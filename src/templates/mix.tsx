import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

// Types for our Mix data
interface MixFields {
  duration?: string
  tracklist?: string
  // genre?: string  // Temporarily disabled pending taxonomy fix
  style?: string
  audioFile?: {
    localFile?: {
      publicURL?: string
      url?: string
    }
  }
  downloadUrl?: string
  recordedDate?: string
  venue?: string
  event?: string
  description?: string
  tags?: string
}

interface Mix {
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
  mixFields?: MixFields
}

interface MixTemplateProps {
  data: {
    wpMix: Mix
  }
  pageContext: {
    slug: string
  }
}

const MixTemplate: React.FC<MixTemplateProps> = ({ data, pageContext }) => {
  const mix = data.wpMix
  const fields = mix.mixFields || {}

  const parseTracklist = (tracklist?: string) => {
    if (!tracklist) return []
    return tracklist.split('\n').filter(track => track.trim()).map((track, index) => ({
      number: index + 1,
      title: track.trim()
    }))
  }

  const tracks = parseTracklist(fields.tracklist)

  return (
    <Layout>
      <div className="mix-single">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mix-header mb-8">
            <h1 className="text-4xl font-bold mb-4">{mix.title}</h1>
            <div className="mix-meta flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span>Released: {new Date(mix.date).toLocaleDateString()}</span>
              {fields.duration && <span>Duration: {fields.duration}</span>}
              {/* Temporarily disabled genre field
              {fields.genre && <span>Genre: {fields.genre}</span>}
              */}
              {fields.venue && <span>Venue: {fields.venue}</span>}
            </div>

            {/* Mix Info Bar */}
            {(fields.recordedDate || fields.event || fields.style) && (
              <div className="mix-info bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {fields.recordedDate && (
                    <div>
                      <span className="font-medium text-gray-700">Recorded:</span>
                      <span className="ml-2">{fields.recordedDate}</span>
                    </div>
                  )}
                  {fields.event && (
                    <div>
                      <span className="font-medium text-gray-700">Event:</span>
                      <span className="ml-2">{fields.event}</span>
                    </div>
                  )}
                  {fields.style && (
                    <div>
                      <span className="font-medium text-gray-700">Style:</span>
                      <span className="ml-2">{fields.style}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mix-content grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Audio Player */}
              {fields.audioFile?.localFile?.url && (
                <div className="audio-player mb-6 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                  <h3 className="text-xl font-semibold mb-4">🎧 Listen to Mix</h3>
                  <audio 
                    controls 
                    className="w-full h-12"
                    src={fields.audioFile.localFile.url}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex justify-between items-center mt-4 text-sm opacity-90">
                    <span>{mix.title}</span>
                    {fields.duration && <span>{fields.duration}</span>}
                  </div>
                </div>
              )}

              {/* Description */}
              {mix.content && (
                <div className="mix-description mb-6">
                  <h3 className="text-lg font-semibold mb-3">About This Mix</h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: mix.content }}
                  />
                </div>
              )}

              {/* Additional Description from ACF */}
              {fields.description && (
                <div className="acf-description mb-6">
                  <h3 className="text-lg font-semibold mb-3">DJ Notes</h3>
                  <p className="text-gray-700">{fields.description}</p>
                </div>
              )}

              {/* Tracklist */}
              {tracks.length > 0 && (
                <div className="tracklist mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tracklist</h3>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    {tracks.map((track, index) => (
                      <div 
                        key={index}
                        className={`flex items-center p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <span className="w-8 text-sm text-gray-500 font-mono">
                          {String(track.number).padStart(2, '0')}
                        </span>
                        <span className="flex-1 ml-3">{track.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Mix Details */}
              <div className="mix-details bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Mix Details</h3>
                <div className="space-y-3">
                  {fields.duration && (
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{fields.duration}</span>
                    </div>
                  )}
                  {/* Temporarily disabled genre field
                  {fields.genre && (
                    <div className="flex justify-between">
                      <span className="font-medium">Genre:</span>
                      <span>{fields.genre}</span>
                    </div>
                  )}
                  */}
                  {fields.style && (
                    <div className="flex justify-between">
                      <span className="font-medium">Style:</span>
                      <span>{fields.style}</span>
                    </div>
                  )}
                  {fields.recordedDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Recorded:</span>
                      <span>{fields.recordedDate}</span>
                    </div>
                  )}
                  {fields.venue && (
                    <div className="flex justify-between">
                      <span className="font-medium">Venue:</span>
                      <span>{fields.venue}</span>
                    </div>
                  )}
                  {fields.event && (
                    <div className="flex justify-between">
                      <span className="font-medium">Event:</span>
                      <span>{fields.event}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Section */}
              {fields.downloadUrl && (
                <div className="download bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Download Mix</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Get the full quality version of this mix
                  </p>
                  <a
                    href={fields.downloadUrl}
                    className="block w-full bg-white text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download (Free)
                  </a>
                </div>
              )}

              {/* Share Section */}
              <div className="share bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Share This Mix</h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 bg-blue-400 text-white py-2 px-3 rounded text-sm hover:bg-blue-500 transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-pink-600 text-white py-2 px-3 rounded text-sm hover:bg-pink-700 transition-colors">
                    Instagram
                  </button>
                </div>
              </div>

              {/* Tags */}
              {fields.tags && (
                <div className="tags">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {fields.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MixTemplate

export const query = graphql`
  query GetMix($slug: String!) {
    wpMix(slug: { eq: $slug }) {
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
      # mixFields {  # Temporarily disabled - ACF fields not imported yet
      #   duration
      #   tracklist
      #   # genre  # Temporarily disabled pending taxonomy fix
      #   style
      #   audioFile {
      #     localFile {
      #       publicURL
      #     }
      #   }
      #   downloadUrl
      #   recordedDate
      #   venue
      #   event
      #   description
      #   tags
      # }
    }
  }
`
