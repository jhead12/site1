import React, { useState, useEffect } from "react"
import {
  Box,
  Heading,
  Text,
  Flex
} from "../ui"

const InstagramFeed = ({ feedCount = 6, showLoadMore = false }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    // Check for stored access token
    const storedToken = typeof window !== "undefined" ? 
      localStorage.getItem('instagram_access_token') : null
    setAccessToken(storedToken)
    fetchInstagramPosts(storedToken)
  }, [])

  const fetchInstagramPosts = async (token = null) => {
    try {
      setLoading(true)
      setError(null)
      
      if (token) {
        // Real Instagram API call
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp,media_type,thumbnail_url&access_token=${token}&limit=${feedCount}`
        )
        
        if (response.ok) {
          const data = await response.json()
          setPosts(data.data || [])
          setLoading(false)
          return
        } else {
          console.warn('Instagram API failed, using placeholder data')
        }
      }
      
      // Fallback to placeholder data
      const placeholderPosts = generatePlaceholderPosts(feedCount)
      setPosts(placeholderPosts)
      setLoading(false)
      
    } catch (err) {
      console.error('Instagram feed error:', err)
      setError('Unable to load Instagram posts')
      
      // Still show placeholder data on error
      const placeholderPosts = generatePlaceholderPosts(feedCount)
      setPosts(placeholderPosts)
      setLoading(false)
    }
  }

  const generatePlaceholderPosts = (count) => {
    const posts = [
      {
        id: "1",
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+1",
        permalink: "https://instagram.com/p/example1",
        caption: "Latest beat production session! 🎵 #musicproduction #beats",
        timestamp: "2025-06-16T12:00:00Z",
        media_type: "IMAGE"
      },
      {
        id: "2", 
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+2",
        permalink: "https://instagram.com/p/example2",
        caption: "Studio vibes ✨ Working on something special",
        timestamp: "2025-06-15T15:30:00Z",
        media_type: "IMAGE"
      },
      {
        id: "3",
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+3", 
        permalink: "https://instagram.com/p/example3",
        caption: "New tutorial coming soon! Subscribe for updates 🔔",
        timestamp: "2025-06-14T10:15:00Z",
        media_type: "IMAGE"
      },
      {
        id: "4",
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+4",
        permalink: "https://instagram.com/p/example4", 
        caption: "Behind the scenes at the studio 🎛️",
        timestamp: "2025-06-13T18:45:00Z",
        media_type: "VIDEO"
      },
      {
        id: "5",
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+5",
        permalink: "https://instagram.com/p/example5",
        caption: "Collaboration with amazing artists 🤝 #collaboration",
        timestamp: "2025-06-12T14:20:00Z", 
        media_type: "IMAGE"
      },
      {
        id: "6",
        media_url: "https://via.placeholder.com/300x300/004ca3/white?text=Instagram+Post+6",
        permalink: "https://instagram.com/p/example6",
        caption: "Throwback to last month's live session 🎤",
        timestamp: "2025-06-11T16:30:00Z",
        media_type: "IMAGE"
      }
    ]
    
    return posts.slice(0, count)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateCaption = (caption, maxLength = 80) => {
    if (!caption) return ""
    return caption.length > maxLength ? caption.substring(0, maxLength) + "..." : caption
  }

  const handleConnectInstagram = () => {
    // Instagram OAuth flow would go here
    // For development, show instructions
    alert(`To connect Instagram:
1. Create an Instagram App at https://developers.facebook.com/
2. Get your access token
3. Store it in localStorage as 'instagram_access_token'
4. Refresh the page`)
  }

  if (loading) {
    return (
      <Box marginY={5}>
        <Heading as="h3" center marginY={3}>Instagram Feed</Heading>
        <Text center>Loading Instagram posts...</Text>
      </Box>
    )
  }

  if (error && posts.length === 0) {
    return (
      <Box marginY={5}>
        <Heading as="h3" center marginY={3}>Instagram Feed</Heading>
        <Text center style={{ color: "#666", marginBottom: "1rem" }}>{error}</Text>
        <Box center>
          <button
            onClick={handleConnectInstagram}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#E1306C",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Connect Instagram
          </button>
        </Box>
      </Box>
    )
  }

  return (
    <Box marginY={5}>
      <Heading as="h3" center marginY={3}>Latest from Instagram</Heading>
      <Text center style={{ color: "#666", marginBottom: "2rem" }}>
        Follow <a href="https://instagram.com/jeldonmusic" target="_blank" rel="noopener noreferrer" style={{ color: "#004ca3" }}>@jeldonmusic</a> for more updates
      </Text>
      
      {!accessToken && (
        <Box center marginY={3}>
          <Text style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
            Connect your Instagram account for live posts
          </Text>
          <button
            onClick={handleConnectInstagram}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#E1306C",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              marginBottom: "2rem"
            }}
          >
            Connect Instagram
          </button>
        </Box>
      )}
      
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        gap: "1rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <Box style={{ position: "relative" }}>
              <img
                src={post.media_url}
                alt={post.caption ? truncateCaption(post.caption, 50) : "Instagram post"}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  display: "block"
                }}
                loading="lazy"
              />
              
              {/* Media type indicator */}
              {post.media_type === "VIDEO" && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  VIDEO
                </div>
              )}
              
              {/* Instagram icon overlay */}
              <div style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "30px",
                height: "30px",
                backgroundColor: "rgba(225, 48, 108, 0.9)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </Box>
            
            {/* Post info */}
            <Box style={{ padding: "12px" }}>
              <Text style={{ 
                fontSize: "0.9rem",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "8px"
              }}>
                {truncateCaption(post.caption)}
              </Text>
              <Text variant="kicker" style={{ color: "#666" }}>
                {formatDate(post.timestamp)}
              </Text>
            </Box>
          </a>
        ))}
      </div>
      
      {/* Follow button */}
      <Box center marginY={4}>
        <a
          href="https://instagram.com/jeldonmusic"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#E1306C",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "600",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#C13584"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#E1306C"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow @jeldonmusic
        </a>
      </Box>
    </Box>
  )
}

export default InstagramFeed
