import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

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
  excerpt?: string  // Temporarily optional - field doesn't exist for custom post types
  featuredImage?: {
    node?: {
      localFile?: {
        childImageSharp?: {
          gatsbyImageData?: any
        }
      }
    }
  }
  tutorialFields?: TutorialListingFields  // Temporarily optional - ACF fields not imported yet
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="tutorials-page">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="page-header text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Tutorials</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn music production, mixing techniques, and industry secrets through our comprehensive tutorial library.
            </p>
          </div>

          {/* Filters */}
          <div className="filters mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                All Categories
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Production
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Mixing
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Mastering
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Sound Design
              </button>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="difficulty-filter mb-8 flex justify-center gap-4">
            <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors">
              Beginner
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200 transition-colors">
              Intermediate
            </button>
            <button className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors">
              Advanced
            </button>
          </div>

          {/* Tutorials Grid */}
          <div className="tutorials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="tutorial-card bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image / Video Thumbnail */}
                <div className="card-image relative h-48 bg-gray-200">
                  {tutorial.featuredImage?.node?.localFile?.childImageSharp ? (
                    <div className="h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Tutorial Thumbnail</span>
                    </div>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m-1 6h1a3 3 0 010 6h-1m1-6V9a3 3 0 013-3h1" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  {tutorial.tutorialFields?.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Difficulty Badge */}
                  {tutorial.tutorialFields?.difficulty && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.tutorialFields.difficulty)}`}>
                        {tutorial.tutorialFields.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Duration Badge */}
                  {tutorial.tutorialFields?.duration && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {tutorial.tutorialFields.duration}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-content p-6">
                  {/* Tutorial Header */}
                  <div className="tutorial-header mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link 
                        to={`/tutorials/${tutorial.slug}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {tutorial.title}
                      </Link>
                    </h3>
                    
                    {/* Tutorial Meta */}
                    <div className="tutorial-meta flex flex-wrap gap-3 text-sm text-gray-600">
                      {tutorial.tutorialFields?.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tutorial.tutorialFields.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Excerpt */}
                  {tutorial.excerpt && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {tutorial.excerpt.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* Card Footer */}
                  <div className="card-footer flex justify-between items-center">
                    <div className="meta text-sm text-gray-500">
                      {new Date(tutorial.date).toLocaleDateString()}
                    </div>
                    
                    <div className="actions">
                      <Link
                        to={`/tutorials/${tutorial.slug}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
            <div className="empty-state text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutorials found</h3>
              <p className="text-gray-500">
                Check back soon for new tutorials, or browse our other content.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="cta-section mt-12 text-center">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-3">Want More In-Depth Training?</h2>
              <p className="mb-6 opacity-90">
                Get access to our premium course library with downloadable project files and one-on-one feedback.
              </p>
              <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                View Premium Courses
              </button>
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
