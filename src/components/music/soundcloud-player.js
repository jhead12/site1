import React from "react"
import { Box, Text } from "../ui"

const SoundcloudPlayer = ({ url }) => {
  // Extract the track ID from the URL if needed
  const getEmbedUrl = (soundcloudUrl) => {
    // If it's already an embed URL, use it as is
    if (soundcloudUrl.includes('w.soundcloud.com/player')) {
      return soundcloudUrl
    }
    
    // Otherwise, create an embed URL
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true`
  }
  
  const embedUrl = getEmbedUrl(url)
  
  return (
    <Box className="soundcloud-player" marginY={3}>
      <iframe
        width="100%" 
        height="120" 
        scrolling="no"
        frameBorder="no" 
        allow="autoplay"
        src={embedUrl}
        title="SoundCloud Player"
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      ></iframe>
      <Text fontSize="xs" color="muted" marginTop={1} textAlign="right">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#ff5500", textDecoration: "none" }}
        >
          Listen on SoundCloud
        </a>
      </Text>
    </Box>
  )
}

export default SoundcloudPlayer
