import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

// Types for our Beats listing data
interface BeatsListingFields {
  bpm?: number
  musicalKey?: string
  // genre?: string  // Temporarily disabled pending taxonomy fix
  price?: number
  audioFile?: {
    localFile?: {
      publicURL?: string
    }
  }
}

interface BeatListing {
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
  beatsFields?: BeatsListingFields  // Temporarily optional - ACF fields not imported yet
}

interface BeatsPageProps {
  data: {
    allWpBeat: {
      nodes: BeatListing[]
    }
  }
}

const BeatsPage: React.FC<BeatsPageProps> = ({ data }) => {
  const beats = data.allWpBeat.nodes

  return (
    <Layout>
      <div className="beats-page">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="page-header text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Beats</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our collection of original beats. From trap to R&B, find the perfect sound for your next project.
            </p>
          </div>

          {/* Filters */}
          <div className="filters mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                All Genres
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Hip Hop
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                R&B
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Trap
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Pop
              </button>
            </div>
          </div>

          {/* Beats Grid */}
          <div className="beats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beats.map((beat) => (
              <div key={beat.id} className="beat-card bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image */}
                {beat.featuredImage?.node?.localFile?.childImageSharp && (
                  <div className="card-image h-48 bg-gray-200">
                    {/* GatsbyImage would go here */}
                    <div className="h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Beat Cover</span>
                    </div>
                  </div>
                )}

                <div className="card-content p-6">
                  {/* Beat Header */}
                  <div className="beat-header mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link 
                        to={`/beats/${beat.slug}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {beat.title}
                      </Link>
                    </h3>
                    
                    {/* Beat Meta */}
                    <div className="beat-meta flex flex-wrap gap-3 text-sm text-gray-600">
                      {beat.beatsFields?.bpm && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {beat.beatsFields.bpm} BPM
                        </span>
                      )}
                      {beat.beatsFields?.musicalKey && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {beat.beatsFields.musicalKey}
                        </span>
                      )}
                      {/* Temporarily disabled genre field
                      {beat.beatsFields?.genre && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {beat.beatsFields.genre}
                        </span>
                      )}
                      */}
                    </div>
                  </div>

                  {/* Excerpt */}
                  {beat.excerpt && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {beat.excerpt.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* Audio Player Preview */}
                  {beat.beatsFields?.audioFile?.localFile?.publicURL && (
                    <div className="audio-preview mb-4">
                      <audio 
                        controls 
                        className="w-full h-8"
                        src={beat.beatsFields.audioFile.localFile.publicURL}
                        style={{ height: '32px' }}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="card-footer flex justify-between items-center">
                    <div className="price">
                      {beat.beatsFields?.price ? (
                        <span className="text-xl font-bold text-green-600">
                          ${beat.beatsFields.price}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Free</span>
                      )}
                    </div>
                    
                    <div className="actions flex gap-2">
                      <Link
                        to={`/beats/${beat.slug}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {beats.length === 0 && (
            <div className="empty-state text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No beats found</h3>
              <p className="text-gray-500">
                Check back soon for new beats, or browse our other content.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="cta-section mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-3">Need a Custom Beat?</h2>
              <p className="mb-6 opacity-90">
                Can't find what you're looking for? Let's create something unique together.
              </p>
              <button className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                Contact for Custom Work
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BeatsPage

export const query = graphql`
  query GetAllBeats {
    allWpBeat(sort: { date: DESC }) {
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
        # beatsFields {  # Temporarily disabled - ACF fields not imported yet
        #   bpm
        #   musicalKey
        #   # genre  # Temporarily disabled pending taxonomy fix
        #   price
        #   audioFile {
        #     localFile {
        #       publicURL
        #     }
        #   }
        # }
      }
    }
  }
`
