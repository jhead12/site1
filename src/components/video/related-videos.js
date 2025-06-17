import React from "react"
import { Link } from "../ui"
import {
  Box,
  Text,
  Subhead,
  Flex
} from "../ui"

const RelatedVideos = ({ videos, currentVideoSlug }) => {
  if (!videos || videos.length === 0) {
    return null
  }

  // Filter out current video
  const filteredVideos = videos.filter(video => video.slug !== currentVideoSlug)

  if (filteredVideos.length === 0) {
    return null
  }

  return (
    <Box marginY={6} paddingY={5} style={{ borderTop: "1px solid #eee" }}>
      <Subhead marginY={3}>Related Videos</Subhead>
      
      <Flex gap={4} style={{ flexWrap: "wrap" }}>
        {filteredVideos.slice(0, 3).map((video) => (
          <Box 
            key={video.id} 
            style={{ 
              flex: "1", 
              minWidth: "280px", 
              maxWidth: "350px",
              border: "1px solid #eee",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {/* Video Thumbnail */}
            <Link to={`/videos/${video.slug}/`}>
              <Box style={{ position: "relative" }}>
                {video.featuredImage?.node?.sourceUrl || video.videoDetails?.youtubeVideoId ? (
                  <img
                    src={video.featuredImage?.node?.sourceUrl || 
                         `https://img.youtube.com/vi/${video.videoDetails.youtubeVideoId}/mqdefault.jpg`}
                    alt={video.featuredImage?.node?.altText || video.title}
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Text>No thumbnail</Text>
                  </div>
                )}
                
                {/* Duration overlay */}
                {video.videoDetails?.videoDuration && (
                  <div style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {video.videoDetails.videoDuration}
                  </div>
                )}
                
                {/* Play button overlay */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(255, 0, 0, 0.8)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.8,
                  transition: "opacity 0.2s ease"
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "15px solid white",
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                    marginLeft: "3px"
                  }} />
                </div>
              </Box>
            </Link>
            
            {/* Video Info */}
            <Box style={{ padding: "16px" }}>
              <Text variant="kicker" marginY={1} style={{ color: "#666" }}>
                {video.date}
              </Text>
              
              <Link to={`/videos/${video.slug}/`} style={{ textDecoration: "none" }}>
                <Text variant="bold" style={{ 
                  fontSize: "1rem", 
                  lineHeight: "1.3",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: "8px"
                }}>
                  {video.title}
                </Text>
              </Link>
              
              {video.excerpt && (
                <Text style={{ 
                  fontSize: "0.9rem",
                  color: "#666",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }} dangerouslySetInnerHTML={{ __html: video.excerpt }} />
              )}
              
              {/* Categories */}
              {video.videoCategories?.nodes?.length > 0 && (
                <Box marginY={2}>
                  <Flex gap={1} style={{ flexWrap: "wrap" }}>
                    {video.videoCategories.nodes.slice(0, 2).map((category) => (
                      <span
                        key={category.name}
                        style={{
                          fontSize: "0.8rem",
                          backgroundColor: "#f0f0f0",
                          color: "#666",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          display: "inline-block"
                        }}
                      >
                        {category.name}
                      </span>
                    ))}
                  </Flex>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
      
      {/* Show more videos link */}
      <Box marginY={4} center>
        <Link to="/videos" style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#004ca3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "background-color 0.2s ease"
        }}>
          View All Videos
        </Link>
      </Box>
    </Box>
  )
}

export default RelatedVideos
