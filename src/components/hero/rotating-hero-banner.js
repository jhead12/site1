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

  // Enhanced GraphQL query to include blogs and videos with proper fallback handling
  const data = useStaticQuery(graphql`
    query HeroBannerContent {
      # Get WordPress Videos - will be skipped if WordPress is not connected
      allWpVideo(sort: { date: DESC }, limit: 2) {
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

      # Get WordPress Blog Posts - will be skipped if WordPress is not connected
      allWpPost(sort: { date: DESC }, limit: 2) {
        nodes {
          id
          title
          excerpt
          slug
          date
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

      # Fallback static content - this should always be available
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
      const wpPosts = data?.allWpPost?.nodes || []
      let heroItems = []

      // Transform WordPress videos with images
      const wpVideoItems = wpVideos
        .filter(video => video.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData)
        .map((video) => ({
          id: `video-${video.id}`,
          title: video.title || "Featured Video",
          description: truncateToFirstSentence(video.excerpt) || "Watch our latest video content",
          image: video.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
          slug: `/videos/${video.slug}`,
          date: video.date,
          type: "video",
          kicker: "Latest Video",
          priority: 1,
        }))

      // Transform WordPress blog posts with images
      const wpBlogItems = wpPosts
        .filter(post => post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData)
        .map((post) => ({
          id: `blog-${post.id}`,
          title: post.title || "Featured Article",
          description: truncateToFirstSentence(post.excerpt) || "Read our latest blog post",
          image: post.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
          slug: `/blog/${post.slug}`,
          date: post.date,
          type: "blog",
          kicker: "Latest Article",
          priority: 2,
        }))

      // Combine WordPress content
      const wpContent = [...wpVideoItems, ...wpBlogItems]
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      // If we have WordPress content with images, use it
      if (wpContent.length > 0) {
        console.log(`Found ${wpContent.length} WordPress content items with images`)
        
        // Add a welcome slide as the first slide
        heroItems = [
          {
            id: "welcome",
            title: data?.site?.siteMetadata?.title || "Welcome to J. Eldon Music",
            description: data?.site?.siteMetadata?.description || "Discover amazing music content, beats, and tutorials. Professional music production and audio engineering services.",
            image: null, // Will show fallback UI
            slug: "/",
            date: new Date().toISOString(),
            type: "hero",
            kicker: "Welcome",
            priority: 0,
          },
          ...wpContent
        ]
      } else {
        // Fallback content when no WordPress content with images is available
        console.log("No WordPress content with images found, using fallback slides")
        heroItems = [
          {
            id: "welcome",
            title: data?.site?.siteMetadata?.title || "Welcome to J. Eldon Music",
            description: data?.site?.siteMetadata?.description || "Discover amazing music content, beats, and tutorials. Professional music production and audio engineering services.",
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
            description: "High-quality beats and instrumentals for your next project. From hip-hop to R&B, find the perfect sound for your musical vision.",
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
            description: "Professional music production, mixing, and mastering services. Let's bring your musical vision to life with industry-standard quality.",
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
            description: "Learn music production techniques, mixing tips, and industry secrets through our comprehensive video tutorials.",
            image: null,
            slug: "/videos",
            date: new Date(Date.now() - 259200000).toISOString(),
            type: "video",
            kicker: "Watch & Learn",
            priority: 4,
          },
          {
            id: "blog",
            title: "Music Industry Insights",
            description: "Stay updated with the latest trends, techniques, and insights from the music production industry through our blog.",
            image: null,
            slug: "/blog",
            date: new Date(Date.now() - 345600000).toISOString(),
            type: "blog",
            kicker: "Read More",
            priority: 5,
          }
        ]
      }

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
      <div className={`hero-banner-slide ${fadeClass}`} data-content-type={currentContent.type}>
        <LinkComponent {...linkProps} className="hero-banner-link">
          <div className="hero-banner-corner-ribbon">
            {currentContent.type === "hero" && "Featured"}
            {currentContent.type === "video" && "New Video"}
            {currentContent.type === "blog" && "Latest"}
            {currentContent.type === "product" && "Shop"}
            {!["hero", "video", "blog", "product"].includes(currentContent.type) && "Latest"}
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
                {currentContent.type === "video" && "Watch Video"}
                {currentContent.type === "blog" && "Read Article"}
                {currentContent.type === "product" && "Shop Now"}
                {currentContent.type === "hero" && "Learn More"}
                {!["video", "blog", "product", "hero"].includes(currentContent.type) && "Learn More"}
                {" "}<span>→</span>
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
