import React, { useState, useEffect, createContext, useContext } from 'react';

// WordPress Authentication Context
const AuthContext = createContext({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  checkAuth: () => {},
  logout: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check WordPress authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Try to get WordPress user info from REST API
      const wpSiteUrl = process.env.GATSBY_WORDPRESS_URL || 'http://localhost:10008';
      const response = await fetch(`${wpSiteUrl}/wp-json/wp/v2/users/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Check if user has admin capabilities
        const isUserAdmin = userData.capabilities && (
          userData.capabilities.administrator || 
          userData.capabilities.manage_options ||
          userData.roles?.includes('administrator')
        );

        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(isUserAdmin);
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('wp_auth_user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          isAdmin: isUserAdmin,
          timestamp: Date.now()
        }));
      } else {
        // Not authenticated - clear any stored auth
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('wp_auth_user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Fallback: Check localStorage for recent auth
      try {
        const storedAuth = localStorage.getItem('wp_auth_user');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          const maxAge = 30 * 60 * 1000; // 30 minutes
          
          if (Date.now() - authData.timestamp < maxAge) {
            setUser(authData);
            setIsAuthenticated(true);
            setIsAdmin(authData.isAdmin);
          } else {
            localStorage.removeItem('wp_auth_user');
          }
        }
      } catch (storageError) {
        console.error('localStorage auth check failed:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const wpSiteUrl = process.env.GATSBY_WORDPRESS_URL || 'http://localhost:10008';
      
      // Attempt WordPress logout
      await fetch(`${wpSiteUrl}/wp-login.php?action=logout`, {
        credentials: 'include',
        method: 'GET'
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local state regardless of logout request success
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem('wp_auth_user');
    }
  };

  // Check auth on mount and set up periodic checks
  useEffect(() => {
    checkAuth();
    
    // Check auth every 5 minutes if authenticated
    const authInterval = setInterval(() => {
      if (isAuthenticated) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(authInterval);
  }, []);

  // Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'wp_auth_user') {
        if (e.newValue) {
          const authData = JSON.parse(e.newValue);
          setUser(authData);
          setIsAuthenticated(true);
          setIsAdmin(authData.isAdmin);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    checkAuth,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
