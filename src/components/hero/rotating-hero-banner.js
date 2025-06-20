import React, { useState, useEffect, useCallback } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import './rotating-hero-banner.css';

// Import mock data for development when connections fail
import heroMockData from '../../data/mock/hero-data.json';

const RotatingHeroBanner = ({ disableAutoRotate = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [heroData, setHeroData] = useState([]);

  // Define functions with useCallback to avoid dependency issues
  const goToNext = useCallback(() => {
    if (heroData.length <= 1) return;
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrentSlide((prev) => 
        prev === heroData.length - 1 ? 0 : prev + 1
      );
      setFadeClass('fade-in');
    }, 300);
  }, [heroData.length]);

  const goToPrevious = useCallback(() => {
    if (heroData.length <= 1) return;
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrentSlide((prev) => 
        prev === 0 ? heroData.length - 1 : prev - 1
      );
      setFadeClass('fade-in');
    }, 300);
  }, [heroData.length]);

  const handleNext = useCallback(() => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
      setFadeClass('fade-in');
    }, 500);
  }, [heroData.length]);

  const handlePrev = () => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroData.length) % heroData.length);
      setFadeClass('fade-in');
    }, 500);
  };

  const handleDotClick = (index) => {
    if (index !== currentSlide) {
      setFadeClass('fade-out');
      setTimeout(() => {
        setCurrentSlide(index);
        setFadeClass('fade-in');
      }, 500);
    }
  };

  const data = useStaticQuery(graphql`
    query HeroBannerContent {
      # WordPress Videos - now using direct video post type and sorting by views
      allWpVideo(
        sort: { date: DESC }
        limit: 5
      ) {
        nodes {
          id
          title
          excerpt
          slug
          date
          videoDetails {
            youtubeVideoId
            videoViews
          }
          featuredImage {
            node {
              altText
              localFile {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
      # Contentful Hero Items
      allContentfulHomepageHero {
        nodes {
          id
          heading
          subhead
          kicker
          text
          image {
            gatsbyImageData
            alt
          }
          links {
            href
            text
          }
        }
      }
    }
  `);

  useEffect(() => {
    try {
      // Combine WordPress and Contentful data
      const wpVideos = data?.allWpVideo?.nodes || [];
      const contentfulHeros = data?.allContentfulHomepageHero?.nodes || [];

      // Transform WordPress videos and parse view counts
      const wpItems = wpVideos.map(video => {
        // Parse view count from the videoViews field (default to 0 if not available)
        const viewCount = parseInt(video.videoDetails?.videoViews || '0', 10);
        
        return {
          id: video.id,
          title: video.title,
          description: video.excerpt,
          image: video.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
          slug: `/videos/${video.slug}`,
          date: video.date,
          type: 'video',
          viewCount: viewCount // Store view count for sorting
        };
      });

      // Transform Contentful items
      const contentfulItems = contentfulHeros.map(hero => ({
        id: hero.id,
        title: hero.heading,
        description: hero.text || hero.subhead,
        image: hero.image?.gatsbyImageData,
        slug: hero.links?.[0]?.href || '/',
        date: new Date().toISOString(), // Use current date since we don't have updatedAt
        type: 'hero',
        kicker: hero.kicker,
        viewCount: Number.MAX_SAFE_INTEGER // Ensure hero items always have highest priority
      }));

      // Combine and sort by view count (highest views first)
      const combinedItems = [...wpItems, ...contentfulItems]
        .filter(item => item.image) // Only include items with images
        .sort((a, b) => b.viewCount - a.viewCount) // Sort by view count (highest first)
        .slice(0, 3); // Keep only the top 3 items

      if (combinedItems.length > 0) {
        setHeroData(combinedItems);
      } else {
        console.warn('No live data available, falling back to mock data');
        setHeroData(heroMockData);
      }
    } catch (error) {
      console.error('Error processing hero data:', error);
      setHeroData(heroMockData);
    }
  }, [data]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isPlaying || heroData.length <= 1 || disableAutoRotate) return;

    const interval = setInterval(() => {
      setFadeClass('fade-out');
      
      setTimeout(() => {
        setCurrentSlide((prev) => 
          prev === heroData.length - 1 ? 0 : prev + 1
        );
        setFadeClass('fade-in');
      }, 300);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isPlaying, heroData.length, disableAutoRotate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, goToNext, goToPrevious]);

  useEffect(() => {
    if (!disableAutoRotate && isPlaying) {
      const timer = setInterval(handleNext, 5000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, isPlaying, disableAutoRotate, handleNext]);

  // Return empty if no hero data
  if (!heroData || heroData.length === 0) {
    return (
      <div className="hero-banner-placeholder">
        <div className="placeholder-content">
          <h2>Hero Banner</h2>
          <p>Add hero content in WordPress or update mock data</p>
        </div>
      </div>
    );
  }

  const currentContent = heroData[currentSlide];
  
  return (
    <div className="hero-banner-container">
      <div className={`hero-banner-slide ${fadeClass}`}>
        <Link to={currentContent.slug} className="hero-banner-link">
          <GatsbyImage
            image={currentContent.image}
            alt={currentContent.title}
            className="hero-banner-image"
          />
          <div className="hero-banner-content">
            <div className="hero-banner-text">
              {currentContent.type === 'hero' && currentContent.kicker && (
                <span className="hero-banner-kicker">{currentContent.kicker}</span>
              )}
              {currentContent.type === 'video' && (
                <span className="hero-banner-badge">
                  {currentContent.viewCount > 0 
                    ? `${currentContent.viewCount.toLocaleString()} views` 
                    : 'Featured Video'}
                </span>
              )}
              <h2>{currentContent.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: currentContent.description }} />
            </div>
          </div>
        </Link>
      </div>

      <div className="hero-banner-controls">
        <button onClick={handlePrev} aria-label="Previous slide">
          ‹
        </button>
        <div className="hero-banner-dots">
          {heroData.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={handleNext} aria-label="Next slide">
          ›
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`play-pause ${isPlaying ? 'playing' : ''}`}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
};

export default RotatingHeroBanner;
