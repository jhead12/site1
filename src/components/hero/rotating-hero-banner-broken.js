import React, { useState, useEffect, useCallback } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import isAbsoluteURL from "is-absolute-url"
import PropTypes from "prop-types"
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

  // Simplified GraphQL query that only uses guaranteed available data
  const data = useStaticQuery(graphql`
    query HeroBannerContent {
      # Site metadata should always be available
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
      console.log("Setting up static hero content")

      // Use static content for reliable operation
      const heroItems = [
        {
          id: "welcome",
          title: data?.site?.siteMetadata?.title || "Welcome to J. Eldon Music",
          description:
            data?.site?.siteMetadata?.description ||
            "Discover amazing music content, beats, and tutorials. Professional music production and audio engineering services.",
          image: null, // Will show fallback UI
          slug: "/",
          date: new Date().toISOString(),
          type: "hero",
          kicker: "Welcome",
          priority: 1,
        },
        {
          id: "beats",
          title: "Professional Beats & Instrumentals",
          description:
            "High-quality beats and instrumentals for your next project. From hip-hop to R&B, find the perfect sound for your musical vision.",
          image: null,
          slug: "/beats",
          date: new Date(Date.now() - 86400000).toISOString(),
          type: "product",
          kicker: "Shop Beats",
          priority: 2,
        },
        {
          id: "services",
          title: "Music Production Services",
          description:
            "Professional music production, mixing, and mastering services. Let's bring your musical vision to life with industry-standard quality.",
          image: null,
          slug: "/music",
          date: new Date(Date.now() - 172800000).toISOString(),
          type: "hero",
          kicker: "Services",
          priority: 3,
        },
        {
          id: "videos",
          title: "Music Production Tutorials",
          description:
            "Learn music production techniques, mixing tips, and industry secrets through our comprehensive video tutorials.",
          image: null,
          slug: "/videos",
          date: new Date(Date.now() - 259200000).toISOString(),
          type: "video",
          kicker: "Learn",
          priority: 4,
        },
      ]

      // Sort by priority (highest first)
      heroItems.sort((a, b) => b.priority - a.priority)
      setHeroData(heroItems)
    } catch (error) {
      console.error("Error processing hero data:", error)
      // Set minimal fallback data on error
      setHeroData([
        {
          id: "fallback",
          title: "Welcome to J. Eldon Music",
          description: "Discover amazing music content, beats, and tutorials",
          image: null,
          slug: "/",
          date: new Date().toISOString(),
          type: "hero",
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

  // Only use fallback UI when we have no data at all
  if (!currentContent) {
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

  const LinkComponent = isAbsoluteURL(currentContent.slug) ? "a" : Link
  const linkProps = isAbsoluteURL(currentContent.slug)
    ? { href: currentContent.slug }
    : { to: currentContent.slug }

  return (
    <div className="hero-banner-container">
      <div
        className={`hero-banner-slide ${fadeClass} ${
          !currentContent.image ? "hero-banner-no-image" : ""
        }`}
        data-content-type={currentContent.type}
      >
        <LinkComponent {...linkProps} className="hero-banner-link">
          <div className="hero-banner-corner-ribbon">
            {currentContent.type === "hero" && "Featured"}
            {currentContent.type === "video" && "New Video"}
            {currentContent.type === "blog" && "Latest"}
            {currentContent.type === "product" && "Shop"}
            {!["hero", "video", "blog", "product"].includes(
              currentContent.type
            ) && "Latest"}
          </div>
          <div className="hero-banner-date">
            {new Date(currentContent.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>

          {currentContent.image ? (
            <GatsbyImage
              image={currentContent.image}
              alt={currentContent.imageAlt || currentContent.title}
              className="hero-banner-image"
            />
          ) : (
            <div className="hero-banner-placeholder-bg">
              <div className="hero-banner-placeholder-pattern"></div>
            </div>
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
                {currentContent.type === "video" && "Watch Video"}
                {currentContent.type === "blog" && "Read Article"}
                {currentContent.type === "product" && "Shop Now"}
                {currentContent.type === "hero" && "Learn More"}
                {!["video", "blog", "product", "hero"].includes(
                  currentContent.type
                ) && "Learn More"}{" "}
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
            {heroData.map((item, index) => (
              <button
                key={`slide-${item.id}-${index}`}
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

RotatingHeroBanner.propTypes = {
  disableAutoRotate: PropTypes.bool,
}

RotatingHeroBanner.defaultProps = {
  disableAutoRotate: false,
}

export default RotatingHeroBanner
