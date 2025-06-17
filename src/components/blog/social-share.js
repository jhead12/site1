import React from "react"
import { Box, Flex, Text } from "../ui"

const SocialShare = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "#1DA1F2",
      icon: "🐦"
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#4267B2",
      icon: "📘"
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "#0077b5",
      icon: "💼"
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: "#FF4500",
      icon: "🤖"
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "#25D366",
      icon: "💬"
    }
  ]

  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // Show feedback (you could implement a toast notification here)
      const button = document.getElementById('copy-link-btn')
      const originalText = button.textContent
      button.textContent = '✓ Copied!'
      button.style.backgroundColor = '#28a745'
      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = '#6c757d'
      }, 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <Box marginY={5}>
      <Text variant="subhead" style={{ marginBottom: "1rem", textAlign: "center" }}>
        Share this post
      </Text>
      
      <Flex gap={2} style={{ 
        flexWrap: "wrap", 
        justifyContent: "center",
        marginBottom: "1rem"
      }}>
        {shareLinks.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform.url)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: platform.color,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "opacity 0.2s ease",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1"
            }}
            title={`Share on ${platform.name}`}
          >
            <span>{platform.icon}</span>
            <span>{platform.name}</span>
          </button>
        ))}
      </Flex>
      
      <Flex style={{ justifyContent: "center" }}>
        <button
          id="copy-link-btn"
          onClick={handleCopyLink}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "background-color 0.2s ease"
          }}
          title="Copy link to clipboard"
        >
          📋 Copy Link
        </button>
      </Flex>
    </Box>
  )
}

export default SocialShare
