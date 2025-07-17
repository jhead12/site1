import React, { useState, useEffect, useCallback } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import isAbsoluteURL from "is-absolute-url"
import "./rotating-hero-banner.css"

// Helper function to truncate text to a single sentence
const truncateToFirstSentence = (text) => {
  if (!text) return ""
  const plainText = text.replace(/<[^>]*>/g, "")
  const match = plainText.match(/[^.!?]*[.!?]/)
  return match ? match[0].trim() : plainText.substring(0, 100) + "..."
}

const RotatingHeroBanner = ({ disableAutoRotate = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(!disableAutoRotate)
  const [fadeClass, setFadeClass] = useState("fade-in")
  const [heroData, setHeroData] = useState([])

  // Consolidated navigation function
  const navigateToSlide = useCallback(
    (direction) => {
      if (heroData.length <= 1) return

      setFadeClass("fade-out")
      setTimeout(() => {
        setCurrentSlide((prev) => {
          if (direction === "next") {
            return (prev + 1) % heroData.length
          } else if (direction === "prev") {
            return (prev - 1 + heroData.length) % heroData.length
          }
          return direction // direct index for dot navigation
        })
        setFadeClass("fade-in")
      }, 300)
    },
    [heroData.length]
  )

  const handleNext = useCallback(
    () => navigateToSlide("next"),
    [navigateToSlide]
  )
  const handlePrev = useCallback(
    () => navigateToSlide("prev"),
    [navigateToSlide]
  )
  const handleDotClick = useCallback(
    (index) => {
      if (index !== currentSlide) {
        navigateToSlide(index)
      }
    },
    [currentSlide, navigateToSlide]
  )

  // Updated GraphQL query to get actual Contentful data
  const data = useStaticQuery(graphql`
    query HeroBannerContent {
      # Get WordPress Videos with better error handling
      allWpVideo(sort: { date: DESC }, limit: 3) {
        nodes {
          id
          title
          excerpt
          slug
          date
          videoDetails {
            youtubeVideoId
          }
          featuredImage {
            node {
              altText
              localFile {
                childImageSharp {
                  gatsbyImageData(width: 1200, height: 600)
                }
              }
            }
          }
        }
      }

      # Get actual Contentful Hero content with available fields only
      allContentfulHomepageHero(limit: 3) {
        nodes {
          id
          image {
            id
            gatsbyImageData(width: 1200, height: 600)
            alt
          }
        }
      }

      # Fallback static content for when no dynamic content is available
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  useEffect(() => {
    try {
      const wpVideos = data?.allWpVideo?.nodes || []
      const contentfulHeros = data?.allContentfulHomepageHero?.nodes || []

      // Transform WordPress videos
      const wpItems = wpVideos
        .filter(
          (video) =>
            video.featuredImage?.node?.localFile?.childImageSharp
              ?.gatsbyImageData
        )
        .map((video) => ({
          id: video.id,
          title: video.title || "Video Content",
          description: truncateToFirstSentence(video.excerpt),
          image:
            video.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
          slug: `/videos/${video.slug}`,
          date: video.date,
          type: "video",
          kicker: "Featured Video",
          priority: 2, // Lower priority than hero content
        }))

      // Transform Contentful heroes with simplified data
      const contentfulItems = contentfulHeros
        .filter((hero) => hero.image?.gatsbyImageData)
        .map((hero, index) => ({
          id: hero.id,
          title: `Featured Content ${index + 1}`, // Generate title since heading may not exist
          description: "Discover our featured content and latest updates",
          image: hero.image.gatsbyImageData,
          slug: "/", // Default to homepage
          date: new Date().toISOString(), // Use current date
          type: "hero",
          kicker: "Featured",
          priority: 1, // Highest priority
        }))

      // Combine and sort by priority, then by date
      const combinedItems = [...contentfulItems, ...wpItems]
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority // Lower number = higher priority
          }
          return new Date(b.date) - new Date(a.date) // Newer first
        })
        .slice(0, 3) // Keep only top 3

      if (combinedItems.length > 0) {
        setHeroData(combinedItems)
      } else {
        // Set fallback data when no content is available
        setHeroData([
          {
            id: "fallback",
            title:
              data?.site?.siteMetadata?.title || "Welcome to J. Eldon Music",
            description:
              data?.site?.siteMetadata?.description ||
              "Discover amazing music content, beats, and tutorials",
            image: null, // Will show fallback UI
            slug: "/",
            date: new Date().toISOString(),
            type: "fallback",
            kicker: "Welcome",
            priority: 999,
          },
        ])
      }
    } catch (error) {
      console.error("Error processing hero data:", error)
      // Set fallback data on error
      setHeroData([
        {
          id: "fallback",
          title: "Welcome to J. Eldon Music",
          description: "Discover amazing music content, beats, and tutorials",
          image: null, // Will show fallback UI
          slug: "/",
          date: new Date().toISOString(),
          type: "fallback",
          kicker: "Welcome",
          priority: 999,
        },
      ])
    }
  }, [data])

  // Consolidated auto-rotation effect (single useEffect)
  useEffect(() => {
    if (!isPlaying || heroData.length <= 1 || disableAutoRotate) return

    const interval = setInterval(() => {
      navigateToSlide("next")
    }, 6000) // 6 seconds interval

    return () => clearInterval(interval)
  }, [isPlaying, heroData.length, disableAutoRotate, navigateToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, handleNext, handlePrev])

  // Fallback UI when no data is available
  if (!heroData || heroData.length === 0) {
    return (
      <div className="hero-banner-container hero-banner-fallback">
        <div className="hero-banner-slide fade-in">
          <div className="hero-banner-placeholder">
            <div className="hero-banner-content">
              <div className="hero-banner-text">
                <span className="hero-banner-kicker">Welcome</span>
                <h2>Content Loading...</h2>
                <p>Please check back soon for featured content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentContent = heroData[currentSlide]

  // Fallback for items without images
  if (!currentContent.image && currentContent.type !== "fallback") {
    return (
      <div className="hero-banner-container hero-banner-fallback">
        <div className="hero-banner-slide fade-in">
          <div className="hero-banner-placeholder">
            <div className="hero-banner-content">
              <div className="hero-banner-text">
                <span className="hero-banner-kicker">
                  {currentContent.kicker}
                </span>
                <h2>{currentContent.title}</h2>
                <p>{currentContent.description}</p>
                <Link
                  to={currentContent.slug}
                  className="hero-banner-read-more"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const LinkComponent = isAbsoluteURL(currentContent.slug) ? "a" : Link
  const linkProps = isAbsoluteURL(currentContent.slug)
    ? { href: currentContent.slug }
    : { to: currentContent.slug }

  return (
    <div className="hero-banner-container">
      <div className={`hero-banner-slide ${fadeClass}`}>
        <LinkComponent {...linkProps} className="hero-banner-link">
          <div className="hero-banner-corner-ribbon">
            {currentContent.type === "hero" ? "Featured" : "Latest"}
          </div>
          <div className="hero-banner-date">
            {new Date(currentContent.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>

          {currentContent.image && (
            <GatsbyImage
              image={currentContent.image}
              alt={currentContent.title}
              className="hero-banner-image"
            />
          )}

          <div className="hero-banner-content">
            <div className="hero-banner-text">
              <span className="hero-banner-kicker">
                {currentContent.kicker}
              </span>
              <h2>{currentContent.title}</h2>
              <p
                dangerouslySetInnerHTML={{ __html: currentContent.description }}
              />
              <div className="hero-banner-read-more">
                {currentContent.type === "video" ? "Watch Video" : "Read More"}{" "}
                <span>→</span>
              </div>
            </div>
          </div>
        </LinkComponent>
      </div>

      {/* Only show controls if we have multiple slides */}
      {heroData.length > 1 && (
        <div className="hero-banner-controls">
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="hero-nav-btn"
          >
            ‹
          </button>
          <div className="hero-banner-dots">
            {heroData.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="hero-nav-btn"
          >
            ›
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`play-pause ${isPlaying ? "playing" : ""}`}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>
      )}
    </div>
  )
}

export default RotatingHeroBanner
