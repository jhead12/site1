import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

// Types for our Tutorial data
interface TutorialFields {
  difficulty?: string
  duration?: string
  category?: string
  videoUrl?: string
  equipment?: string
  software?: string
  prerequisites?: string
  learningObjectives?: string
  resources?: Array<{
    title?: string
    url?: string
    type?: string
  }>
}

interface Tutorial {
  id: string
  title: string
  slug: string
  date: string
  content: string
  featuredImage?: {
    node?: {
      localFile?: {
        childImageSharp?: {
          gatsbyImageData?: any
        }
      }
    }
  }
  tutorialFields?: TutorialFields
}

interface TutorialTemplateProps {
  data: {
    wpTutorial: Tutorial
  }
  pageContext: {
    slug: string
  }
}

const TutorialTemplate: React.FC<TutorialTemplateProps> = ({ data, pageContext }) => {
  const tutorial = data.wpTutorial
  const fields = tutorial.tutorialFields || {}

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
      <div className="tutorial-single">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="tutorial-header mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">{tutorial.title}</h1>
              {fields.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(fields.difficulty)}`}>
                  {fields.difficulty}
                </span>
              )}
            </div>
            
            <div className="tutorial-meta flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span>Published: {new Date(tutorial.date).toLocaleDateString()}</span>
              {fields.duration && <span>Duration: {fields.duration}</span>}
              {fields.category && <span>Category: {fields.category}</span>}
            </div>

            {/* Quick Info Bar */}
            <div className="quick-info bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {fields.duration && (
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2">{fields.duration}</span>
                  </div>
                )}
                {fields.software && (
                  <div>
                    <span className="font-medium text-gray-700">Software:</span>
                    <span className="ml-2">{fields.software}</span>
                  </div>
                )}
                {fields.equipment && (
                  <div>
                    <span className="font-medium text-gray-700">Equipment:</span>
                    <span className="ml-2">{fields.equipment}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tutorial-content grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              {fields.videoUrl && (
                <div className="video-player mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tutorial Video</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {/* YouTube/Vimeo embed would go here */}
                    <iframe
                      src={fields.videoUrl}
                      title={tutorial.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              {fields.learningObjectives && (
                <div className="learning-objectives mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">What You'll Learn</h3>
                  <div 
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: fields.learningObjectives }}
                  />
                </div>
              )}

              {/* Prerequisites */}
              {fields.prerequisites && (
                <div className="prerequisites mb-6 p-4 bg-orange-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-orange-800">Prerequisites</h3>
                  <div 
                    className="prose prose-orange max-w-none"
                    dangerouslySetInnerHTML={{ __html: fields.prerequisites }}
                  />
                </div>
              )}

              {/* Main Content */}
              {tutorial.content && (
                <div className="tutorial-description mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tutorial Content</h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: tutorial.content }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Tutorial Info */}
              <div className="tutorial-info bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Tutorial Info</h3>
                <div className="space-y-3">
                  {fields.difficulty && (
                    <div className="flex justify-between">
                      <span className="font-medium">Difficulty:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(fields.difficulty)}`}>
                        {fields.difficulty}
                      </span>
                    </div>
                  )}
                  {fields.duration && (
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{fields.duration}</span>
                    </div>
                  )}
                  {fields.category && (
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span>{fields.category}</span>
                    </div>
                  )}
                  {fields.software && (
                    <div className="flex justify-between">
                      <span className="font-medium">Software:</span>
                      <span>{fields.software}</span>
                    </div>
                  )}
                  {fields.equipment && (
                    <div className="flex justify-between">
                      <span className="font-medium">Equipment:</span>
                      <span>{fields.equipment}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources */}
              {fields.resources && fields.resources.length > 0 && (
                <div className="resources bg-white border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <div className="space-y-3">
                    {fields.resources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium text-blue-600">{resource.title}</div>
                          {resource.type && (
                            <div className="text-sm text-gray-500">{resource.type}</div>
                          )}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="cta bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Want More Tutorials?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Get access to our complete library of music production tutorials.
                </p>
                <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors mb-2">
                  View All Tutorials
                </button>
                <button className="w-full bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                  Subscribe to Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TutorialTemplate

export const query = graphql`
  query GetTutorial($slug: String!) {
    wpTutorial(slug: { eq: $slug }) {
      id
      title
      slug
      date
      content
      featuredImage {
        node {
          localFile {
            childImageSharp {
              gatsbyImageData(
                width: 800
                height: 400
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
      #   equipment
      #   software
      #   prerequisites
      #   learningObjectives
      #   resources {
      #     title
      #     url
      #     type
      #   }
      # }
    }
  }
`
