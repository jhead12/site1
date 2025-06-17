import React, { useState } from "react"
import {
  Box,
  Text
} from "../ui"

const VideoPlayer = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  if (!videoId) {
    return (
      <Box style={{ 
        backgroundColor: "#f0f0f0", 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: "8px"
      }}>
        <Text>Video not available</Text>
      </Box>
    )
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`

  const handlePlay = () => {
    setIsLoaded(true)
  }

  return (
    <Box style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "8px", overflow: "hidden" }}>
      {!isLoaded ? (
        // Thumbnail with play button
        <div
          onClick={handlePlay}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Play button overlay */}
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: "25px solid white",
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
              marginLeft: "5px"
            }} />
          </div>
          
          {/* Video title overlay */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            color: "white",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            {title}
          </div>
        </div>
      ) : (
        // YouTube iframe
        <iframe
          src={embedUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none"
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </Box>
  )
}

export default VideoPlayer
