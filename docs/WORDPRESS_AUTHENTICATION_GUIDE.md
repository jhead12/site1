# WordPress Authentication & Admin Analytics Access

## Overview
The Analytics Dashboard is now protected and only accessible to WordPress administrators. The system checks authentication in real-time and conditionally shows the Analytics navigation link.

## How It Works

### 1. Authentication System
- **AuthProvider** wraps the entire application in `layout.js`
- **useAuth hook** provides authentication state throughout the app
- **WordPress REST API** checks user authentication and permissions
- **Local storage** caches auth state for better performance

### 2. Navigation Control
- Analytics link only appears in navigation when user is WordPress admin
- Uses conditional rendering: `...(isAdmin ? [analytics_link] : [])`
- Real-time updates when authentication status changes

### 3. Page Protection
- Analytics page redirects non-admin users to login page
- Shows loading states while checking authentication
- Displays clear access denied messages for insufficient permissions

## User Experience

### For Regular Visitors
- No Analytics link visible in navigation
- Clean, uncluttered navigation experience
- No access to restricted admin features

### For WordPress Administrators
1. **Login Process:**
   - Visit `/admin-login` to access login page
   - Redirected to WordPress admin login
   - Return to site with authenticated session

2. **Authenticated Experience:**
   - Analytics link appears in navigation automatically
   - Access to full analytics dashboard
   - Admin status indicator on analytics page
   - Logout option available

## Authentication States

### Not Authenticated
```javascript
{
  isAuthenticated: false,
  isAdmin: false,
  user: null
}
```
- Analytics link hidden
- Redirected to login if accessing protected pages

### Authenticated User (Non-Admin)
```javascript
{
  isAuthenticated: true,
  isAdmin: false,
  user: { name, email, roles: ['subscriber'] }
}
```
- Analytics link still hidden
- Access denied to analytics with clear message

### Authenticated Administrator
```javascript
{
  isAuthenticated: true,
  isAdmin: true,
  user: { name, email, roles: ['administrator'] }
}
```
- Analytics link visible in navigation
- Full access to analytics dashboard
- Admin status displayed

## Technical Implementation

### Files Modified/Created:
1. **`src/hooks/useAuth.js`** - Authentication hook and context
2. **`src/components/layout.js`** - AuthProvider wrapper
3. **`src/components/header.js`** - Conditional navigation
4. **`src/pages/admin-login.js`** - Login page
5. **`src/pages/auth/user/analytics.js`** - Protected analytics page
6. **`src/components/auth-status.js`** - Status component

### WordPress Integration:
- Uses WordPress REST API (`/wp-json/wp/v2/users/me`)
- Checks `capabilities.administrator` or `roles.includes('administrator')`
- Respects WordPress session cookies
- Works with existing WordPress authentication

### Security Features:
- Real-time authentication checking
- Session timeout handling (30 minutes)
- Cross-tab synchronization
- Graceful fallback for network errors

## Setup Requirements

### 1. WordPress Configuration
- WordPress REST API enabled (default in modern WP)
- CORS configured to allow your Gatsby site domain
- User accounts with administrator role

### 2. Environment Variables
```env
GATSBY_WORDPRESS_URL=http://localhost:10008
```

### 3. WordPress CORS (if needed)
Add to `functions.php`:
```php
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: http://localhost:8000");
    header("Access-Control-Allow-Credentials: true");
}
add_action('init','add_cors_http_header');
```

## Usage Instructions

### For Site Administrators:
1. **Initial Setup:**
   - Ensure you have WordPress administrator account
   - Log in to WordPress admin dashboard first
   - Visit the Gatsby site

2. **Accessing Analytics:**
   - Look for Analytics link in navigation (appears when logged in)
   - Or visit `/admin-login` directly
   - Follow login prompts if not authenticated

3. **Managing Access:**
   - Only users with `administrator` role can access analytics
   - Use WordPress user management to grant/revoke access
   - Sessions automatically expire after 30 minutes of inactivity

### For Regular Users:
- Analytics link not visible
- Clean navigation experience
- Can still access all public pages

## Error Handling

### Common Scenarios:
1. **WordPress site offline** - Graceful fallback, cached auth used
2. **Network errors** - Retry logic with exponential backoff
3. **Session expired** - Automatic logout and redirect to login
4. **Insufficient permissions** - Clear error message and login option

### Debugging:
- Check browser console for authentication errors
- Verify WordPress REST API accessibility
- Test WordPress login directly
- Check CORS configuration if cross-origin issues

## Future Enhancements

### Potential Improvements:
1. **Role-based access** - Different analytics for different user roles
2. **JWT tokens** - More secure authentication method
3. **Single sign-on** - Integration with external auth providers
4. **Audit logging** - Track who accesses analytics
5. **Session management** - Admin interface for active sessions

### Analytics Permissions:
- **View Only** - See analytics data
- **Full Access** - Modify settings, export data
- **Super Admin** - User management, system settings

## Troubleshooting

### Analytics Link Not Appearing:
1. Check WordPress login status
2. Verify administrator role
3. Clear browser cache/localStorage
4. Check console for auth errors

### Authentication Failures:
1. Verify WordPress URL in environment
2. Check CORS configuration
3. Ensure WordPress REST API enabled
4. Test direct WordPress admin login

### Session Issues:
1. Check browser cookies
2. Verify WordPress session configuration
3. Clear localStorage: `localStorage.clear()`
4. Re-authenticate through WordPress

---

**Status**: ✅ **IMPLEMENTED AND SECURE**

The authentication system provides robust protection for admin features while maintaining a seamless user experience for both administrators and regular visitors.
