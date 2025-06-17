import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

// Types for our Beats data
interface BeatsFields {
  bpm?: number
  musicalKey?: string
  // genre?: string  // Temporarily disabled pending taxonomy fix
  // mood?: string  // Temporarily disabled pending taxonomy fix
  tempo?: string
  audioFile?: {
    localFile?: {
      publicURL?: string
    }
  }
  waveformImage?: {
    localFile?: {
      childImageSharp?: {
        gatsbyImageData?: any
      }
    }
  }
  price?: number
  license?: string
  tags?: string
  description?: string
}

interface Beat {
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
  beatsFields?: BeatsFields
}

interface BeatTemplateProps {
  data: {
    wpBeat: Beat
  }
  pageContext: {
    slug: string
  }
}

const BeatTemplate: React.FC<BeatTemplateProps> = ({ data, pageContext }) => {
  const beat = data.wpBeat
  const fields = beat.beatsFields || {}

  return (
    <Layout>
      <div className="beat-single">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="beat-header mb-8">
            <h1 className="text-4xl font-bold mb-4">{beat.title}</h1>
            <div className="beat-meta flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Published: {new Date(beat.date).toLocaleDateString()}</span>
              {/* Temporarily disabled genre field
              {fields.genre && <span>Genre: {fields.genre}</span>}
              */}
              {fields.bpm && <span>BPM: {fields.bpm}</span>}
              {fields.musicalKey && <span>Key: {fields.musicalKey}</span>}
            </div>
          </div>

          <div className="beat-content grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Audio Player */}
              {fields.audioFile?.localFile?.publicURL && (
                <div className="audio-player mb-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Listen to Beat</h3>
                  <audio 
                    controls 
                    className="w-full"
                    src={fields.audioFile.localFile.publicURL}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Waveform Image */}
              {fields.waveformImage?.localFile?.childImageSharp && (
                <div className="waveform mb-6">
                  <h3 className="text-lg font-semibold mb-3">Waveform</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {/* Add GatsbyImage component when available */}
                    <div className="h-32 bg-gray-300 rounded flex items-center justify-center">
                      Waveform Visualization
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {beat.content && (
                <div className="beat-description mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: beat.content }}
                  />
                </div>
              )}

              {/* Additional Description from ACF */}
              {fields.description && (
                <div className="acf-description mb-6">
                  <h3 className="text-lg font-semibold mb-3">Producer Notes</h3>
                  <p className="text-gray-700">{fields.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Beat Details */}
              <div className="beat-details bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Beat Details</h3>
                <div className="space-y-3">
                  {fields.bpm && (
                    <div className="flex justify-between">
                      <span className="font-medium">BPM:</span>
                      <span>{fields.bpm}</span>
                    </div>
                  )}
                  {fields.musicalKey && (
                    <div className="flex justify-between">
                      <span className="font-medium">Key:</span>
                      <span>{fields.musicalKey}</span>
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
                  {/* Temporarily disabled mood field
                  {fields.mood && (
                    <div className="flex justify-between">
                      <span className="font-medium">Mood:</span>
                      <span>{fields.mood}</span>
                    </div>
                  )}
                  */}
                  {fields.tempo && (
                    <div className="flex justify-between">
                      <span className="font-medium">Tempo:</span>
                      <span>{fields.tempo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Licensing & Purchase */}
              {(fields.price || fields.license) && (
                <div className="licensing bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Get This Beat</h3>
                  {fields.price && (
                    <div className="price mb-4">
                      <span className="text-2xl font-bold">${fields.price}</span>
                    </div>
                  )}
                  {fields.license && (
                    <div className="license mb-4">
                      <span className="text-sm opacity-90">License: {fields.license}</span>
                    </div>
                  )}
                  <button className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                    Purchase Beat
                  </button>
                  <button className="w-full bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-purple-600 transition-colors mt-2">
                    Download Free Version
                  </button>
                </div>
              )}

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

export default BeatTemplate

export const query = graphql`
  query GetBeat($slug: String!) {
    wpBeat(slug: { eq: $slug }) {
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
      # beatsFields {  # Temporarily disabled - ACF fields not imported yet
      #   bpm
      #   musicalKey
      #   # genre  # Temporarily disabled pending taxonomy fix
      #   # mood  # Temporarily disabled pending taxonomy fix
      #   tempo
      #   audioFile {
      #     localFile {
      #       publicURL
      #     }
      #   }
      #   waveformImage {
      #     localFile {
      #       childImageSharp {
      #         gatsbyImageData(
      #           width: 600
      #           height: 150
      #           placeholder: BLURRED
      #           formats: [AUTO, WEBP, AVIF]
      #         )
      #       }
      #     }
      #   }
      #   price
      #   license
      #   tags
      #   description
      # }
    }
  }
`
