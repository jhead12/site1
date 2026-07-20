import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Text, Flex } from "../ui"
import "./video-card.css"

const VideoCard = ({ video }) => {
  const thumbUrl = video.youtubeVideoId
    ? `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`
    : null
  const featuredImage = video.featuredImage ? getImage(video.featuredImage) : null

  return (
    <Link
      to={`/videos/${video.slug}/`}
      className="video-card"
      aria-label={`Watch ${video.title}`}
    >
      <Box className="video-card-thumbnail">
        {featuredImage ? (
          <GatsbyImage
            image={featuredImage}
            alt={video.featuredImage?.alt || video.title}
            className="video-card-image"
            loading="lazy"
          />
        ) : thumbUrl ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="video-card-image"
            loading="lazy"
            onError={(e) => {
              const src = e.currentTarget.src
              if (src.includes("/maxresdefault.jpg")) {
                e.currentTarget.src = src.replace(
                  "/maxresdefault.jpg",
                  "/mqdefault.jpg"
                )
              }
            }}
          />
        ) : (
          <div className="video-card-image video-card-image-placeholder">
            <Text>No thumbnail</Text>
          </div>
        )}

        {video.duration && (
          <span className="video-card-duration">{video.duration}</span>
        )}

        <span className="video-card-play" aria-hidden="true" />
      </Box>

      <Box className="video-card-info">
        <Text className="video-card-date" variant="kicker">
          {new Date(video.publishDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
          })}
        </Text>

        <h3 className="video-card-title">{video.title}</h3>

        {video.excerpt && (
          <Text className="video-card-excerpt">{video.excerpt}</Text>
        )}

        {video.categories?.length > 0 && (
          <div className="video-card-categories">
            {video.categories.slice(0, 3).map((category) => (
              <span key={category.name} className="video-card-category">
                {category.name}
              </span>
            ))}
          </div>
        )}

        <span className="video-card-cta">Watch Video →</span>
      </Box>
    </Link>
  )
}

export default VideoCard
