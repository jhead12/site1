import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"
import * as styles from "../styles/tutorials.css.ts"

// Types for our Tutorials listing data
interface TutorialListingFields {
  difficulty?: string
  duration?: string
  category?: string
  videoUrl?: string
}

interface TutorialListing {
  id: string
  title: string
  slug: string
  date: string
  excerpt?: string // Temporarily optional - field doesn't exist for custom post types
  featuredImage?: {
    node?: {
      localFile?: {
        childImageSharp?: {
          gatsbyImageData?: any
        }
      }
    }
  }
  tutorialFields?: TutorialListingFields // Temporarily optional - ACF fields not imported yet
}

interface TutorialsPageProps {
  data: {
    allWpTutorial: {
      nodes: TutorialListing[]
    }
  }
}

const TutorialsPage: React.FC<TutorialsPageProps> = ({ data }) => {
  const tutorials = data.allWpTutorial.nodes

  const getDifficultyStyle = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return styles.difficultyVariants.beginner
      case "intermediate":
        return styles.difficultyVariants.intermediate
      case "advanced":
        return styles.difficultyVariants.advanced
      default:
        return styles.difficultyVariants.default
    }
  }

  return (
    <Layout>
      <div className={styles.tutorialsPage}>
        <div className={styles.pageContainer}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Tutorials</h1>
            <p className={styles.subtitle}>
              Learn music production, mixing techniques, and industry secrets
              through our comprehensive tutorial library.
            </p>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${styles.filterButtonActive}`}
            >
              All Categories
            </button>
            <button className={styles.filterButton}>Production</button>
            <button className={styles.filterButton}>Mixing</button>
            <button className={styles.filterButton}>Mastering</button>
            <button className={styles.filterButton}>Sound Design</button>
          </div>

          {/* Difficulty Filter */}
          <div className={styles.difficultyFilter}>
            <button
              className={`${styles.difficultyButton} ${styles.difficultyVariants.beginner}`}
            >
              Beginner
            </button>
            <button
              className={`${styles.difficultyButton} ${styles.difficultyVariants.intermediate}`}
            >
              Intermediate
            </button>
            <button
              className={`${styles.difficultyButton} ${styles.difficultyVariants.advanced}`}
            >
              Advanced
            </button>
          </div>

          {/* Tutorials Grid */}
          <div className={styles.tutorialsGrid}>
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className={styles.tutorialCard}>
                {/* Featured Image / Video Thumbnail */}
                <div className={styles.cardImage}>
                  {tutorial.featuredImage?.node?.localFile?.childImageSharp ? (
                    <div className={styles.cardImageGradient}>
                      <span className={styles.cardImageText}>
                        Tutorial Thumbnail
                      </span>
                    </div>
                  ) : (
                    <div className={styles.cardImageGradientFallback}>
                      <svg
                        className={styles.iconLarge}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m-1 6h1a3 3 0 010 6h-1m1-6V9a3 3 0 013-3h1"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  {tutorial.tutorialFields?.videoUrl && (
                    <div className={styles.playButtonOverlay}>
                      <div className={styles.playButton}>
                        <svg
                          className={styles.playIcon}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Difficulty Badge */}
                  {tutorial.tutorialFields?.difficulty && (
                    <div className={styles.difficultyBadge}>
                      <span
                        className={`${
                          styles.difficultyBadgeText
                        } ${getDifficultyStyle(
                          tutorial.tutorialFields.difficulty
                        )}`}
                      >
                        {tutorial.tutorialFields.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Duration Badge */}
                  {tutorial.tutorialFields?.duration && (
                    <div className={styles.durationBadge}>
                      <span className={styles.durationBadgeText}>
                        {tutorial.tutorialFields.duration}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  {/* Tutorial Header */}
                  <div className="tutorial-header mb-4">
                    <h3 className={styles.tutorialTitle}>
                      <Link
                        to={`/tutorials/${tutorial.slug}`}
                        className={styles.tutorialLink}
                      >
                        {tutorial.title}
                      </Link>
                    </h3>

                    {/* Tutorial Meta */}
                    <div className={styles.tutorialMeta}>
                      {tutorial.tutorialFields?.category && (
                        <span className={styles.categoryTag}>
                          {tutorial.tutorialFields.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Excerpt */}
                  {tutorial.excerpt && (
                    <p className={styles.excerpt}>
                      {tutorial.excerpt.replace(/<[^>]*>/g, "")}
                    </p>
                  )}

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.metaText}>
                      {new Date(tutorial.date).toLocaleDateString()}
                    </div>

                    <div className="actions">
                      <Link
                        to={`/tutorials/${tutorial.slug}`}
                        className={styles.watchButton}
                      >
                        Watch Tutorial
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {tutorials.length === 0 && (
            <div className={styles.emptyState}>
              <div>
                <svg
                  className={styles.emptyIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>No tutorials found</h3>
              <p className={styles.emptyText}>
                Check back soon for new tutorials, or browse our other content.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaBox}>
              <h2 className={styles.ctaTitle}>Want More In-Depth Training?</h2>
              <p className={styles.ctaText}>
                Get access to our premium course library with downloadable
                project files and one-on-one feedback.
              </p>
              <button className={styles.ctaButton}>View Premium Courses</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TutorialsPage

export const query = graphql`
  query GetAllTutorials {
    allWpTutorial(sort: { date: DESC }) {
      nodes {
        id
        title
        slug
        date
        # excerpt  # Temporarily disabled - field doesn't exist for custom post types
        featuredImage {
          node {
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 400
                  height: 300
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
        # tutorialFields {  # Temporarily disabled - ACF fields not imported yet
        #   difficulty
        #   duration
        #   category
        #   videoUrl
        # }
      }
    }
  }
`
