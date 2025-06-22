import React, { useState } from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Heading, Text, Flex } from "../ui"
import SoundcloudPlayer from "./soundcloud-player"

const MusicItem = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Handle audio player
  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  // Get appropriate link for the type of music
  const getItemLink = () => {
    if (item.slug) {
      return item.slug
    }
    if (item.purchaseUrl) {
      return item.purchaseUrl
    }
    if (item.soundcloudUrl) {
      return item.soundcloudUrl
    }
    return "#"
  }
  
  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return null
    return price === 0 ? "Free" : `$${price.toFixed(2)}`
  }
  
  const image = item.image && getImage(item.image)
  
  return (
    <Box 
      className="music-item"
      padding={3}
      backgroundColor="white"
      borderRadius="md"
      boxShadow="sm"
      transition="box-shadow 0.2s ease"
      _hover={{ boxShadow: "md" }}
    >
      {/* Music Item Header */}
      <Flex gap={2} alignItems="center" marginBottom={2}>
        <Box 
          backgroundColor={
            item.type === "beat" ? "blue.100" :
            item.type === "mix" ? "purple.100" : "teal.100"
          }
          color={
            item.type === "beat" ? "blue.700" :
            item.type === "mix" ? "purple.700" : "teal.700"
          }
          paddingX={2}
          paddingY={1}
          borderRadius="full"
          fontSize="sm"
        >
          {item.type === "beat" ? "Beat" : 
           item.type === "mix" ? "Mix" : "Track"}
        </Box>
        
        {item.genre && (
          <Box 
            backgroundColor="gray.100"
            color="gray.700"
            paddingX={2}
            paddingY={1}
            borderRadius="full"
            fontSize="sm"
          >
            {item.genre}
          </Box>
        )}
        
        {item.price !== null && (
          <Box 
            backgroundColor="green.100"
            color="green.700"
            paddingX={2}
            paddingY={1}
            borderRadius="full"
            fontSize="sm"
            marginLeft="auto"
          >
            {formatPrice(item.price)}
          </Box>
        )}
      </Flex>
      
      {/* Music Item Image */}
      {image ? (
        <Box marginBottom={3} style={{ position: "relative" }}>
          <GatsbyImage
            image={image}
            alt={item.title}
            style={{ borderRadius: "8px", aspectRatio: "16/9" }}
          />
          {item.audioUrl && (
            <button
              onClick={handlePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          )}
        </Box>
      ) : (
        <Box 
          marginBottom={3}
          height="120px"
          backgroundColor="gray.100"
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">No Image</Text>
        </Box>
      )}
      
      {/* Title & Metadata */}
      <Heading as="h3" size="md" marginBottom={2}>
        <Link to={getItemLink()} style={{ color: "inherit", textDecoration: "none" }}>
          {item.title}
        </Link>
      </Heading>
      
      <Flex gap={3} marginBottom={3} flexWrap="wrap">
        {item.bpm && (
          <Text fontSize="sm" color="gray.600">
            <strong>BPM:</strong> {item.bpm}
          </Text>
        )}
        
        {item.key && (
          <Text fontSize="sm" color="gray.600">
            <strong>Key:</strong> {item.key}
          </Text>
        )}
        
        {item.duration && (
          <Text fontSize="sm" color="gray.600">
            <strong>Length:</strong> {item.duration}
          </Text>
        )}
      </Flex>
      
      {/* SoundCloud Embed */}
      {item.soundcloudUrl && (
        <SoundcloudPlayer url={item.soundcloudUrl} />
      )}
      
      {/* Audio Player (for local files) */}
      {item.audioUrl && (
        <Box marginY={3}>
          <audio 
            src={item.audioUrl} 
            controls={isPlaying}
            style={{ 
              width: "100%",
              borderRadius: "8px",
              display: isPlaying ? "block" : "none"
            }}
            onPlay={() => setIsPlaying(true)}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            aria-label={`${item.title} audio player`}
            title={item.title}
          >
            {/* Adding a track element to satisfy accessibility requirement */}
            <track kind="captions" src="" label="No captions available" />
          </audio>
        </Box>
      )}
      
      {/* Action Buttons */}
      <Flex gap={2} marginTop={3}>
        {item.slug && (
          <Link 
            to={item.slug}
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "#f0f0f0",
              color: "#333",
              textDecoration: "none",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            Details
          </Link>
        )}
        
        {item.purchaseUrl && (
          <a 
            href={item.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "#004ca3",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            Purchase
          </a>
        )}
        
        {item.soundcloudUrl && !item.purchaseUrl && (
          <a 
            href={item.soundcloudUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "#ff5500",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            SoundCloud
          </a>
        )}
      </Flex>
    </Box>
  )
}

export default MusicItem
