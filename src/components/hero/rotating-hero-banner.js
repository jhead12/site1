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
    (index) => navigateToSlide(index),
    [navigateToSlide]
  )

  // Only query basic site data - no WordPress queries
  const data = useStaticQuery(graphql`
    query HeroBannerContent {
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
      // Use static fallback content (WordPress bypassed)
      const heroItems = [
        {
          id: "welcome",
          title: data?.site?.siteMetadata?.title || "Welcome to J. Eldon Music",
          description:
            data?.site?.siteMetadata?.description ||
            "Discover amazing music content, beats, and tutorials. Professional music production and audio engineering services.",
          image: null,
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

  // Auto-rotation effect
  useEffect(() => {
    if (!isPlaying || heroData.length <= 1 || disableAutoRotate) return

    const interval = setInterval(() => {
      navigateToSlide("next")
    }, 6000) // 6 seconds interval

    return () => clearInterval(interval)
  }, [isPlaying, heroData.length, disableAutoRotate, navigateToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrev()
      } else if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === " ") {
        event.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleNext, handlePrev, isPlaying])

  if (!heroData.length) {
    return (
      <section className="hero-banner loading">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Loading...</h1>
          </div>
        </div>
      </section>
    )
  }

  const currentItem = heroData[currentSlide] || heroData[0]

  return (
    <section className="hero-banner">
      <div className={`hero-content ${fadeClass}`}>
        {/* Background Image or Gradient */}
        <div className="hero-background">
          {currentItem.image ? (
            <GatsbyImage
              image={currentItem.image}
              alt={currentItem.title}
              className="hero-image"
            />
          ) : (
            <div className="hero-gradient" />
          )}
          <div className="hero-overlay" />
        </div>

        {/* Hero Text Content */}
        <div className="hero-text">
          {currentItem.kicker && (
            <span className="hero-kicker">{currentItem.kicker}</span>
          )}
          <h1 className="hero-title">{currentItem.title}</h1>
          <p className="hero-description">{currentItem.description}</p>

          {/* Call to Action */}
          <div className="hero-actions">
            {isAbsoluteURL(currentItem.slug) ? (
              <a
                href={currentItem.slug}
                className="hero-cta primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            ) : (
              <Link to={currentItem.slug} className="hero-cta primary">
                Learn More
              </Link>
            )}
            <Link to="/shop" className="hero-cta secondary">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {heroData.length > 1 && (
        <div className="hero-controls">
          {/* Previous/Next Arrows */}
          <button
            className="hero-nav prev"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="hero-nav next"
            onClick={handleNext}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dot Indicators */}
          <div className="hero-dots">
            {heroData.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            className={`hero-play-pause ${isPlaying ? "playing" : "paused"}`}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && heroData.length > 1 && (
        <div className="hero-progress">
          <div className="hero-progress-bar" />
        </div>
      )}
    </section>
  )
}

export default RotatingHeroBanner
