import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"

// Types for our Mixes listing data
interface MixListingFields {
  duration?: string
  // genre?: string  // Temporarily disabled pending taxonomy fix
  style?: string
  venue?: string
  recordedDate?: string
  audioFile?: {
    localFile?: {
      publicURL?: string
    }
  }
}

interface MixListing {
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
  mixFields?: MixListingFields  // Temporarily optional - ACF fields not imported yet
}

interface MixesPageProps {
  data: {
    allWpMix: {
      nodes: MixListing[]
    }
  }
}

const MixesPage: React.FC<MixesPageProps> = ({ data }) => {
  const mixes = data.allWpMix.nodes

  return (
    <Layout>
      <div className="mixes-page">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="page-header text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">DJ Mixes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the journey through carefully curated mixes spanning various genres and moods. Each mix tells a unique story.
            </p>
          </div>

          {/* Filters */}
          <div className="filters mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                All Genres
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                House
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Techno
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Hip Hop
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                R&B
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Deep House
              </button>
            </div>
          </div>

          {/* Mixes Grid */}
          <div className="mixes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mixes.map((mix) => (
              <div key={mix.id} className="mix-card bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image */}
                <div className="card-image relative h-48 bg-gray-200">
                  {mix.featuredImage?.node?.localFile?.childImageSharp ? (
                    <div className="h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Mix Cover</span>
                    </div>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  {mix.mixFields?.audioFile?.localFile?.publicURL && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                      <div className="bg-white bg-opacity-90 rounded-full p-4">
                        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Duration Badge */}
                  {mix.mixFields?.duration && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {mix.mixFields.duration}
                      </span>
                    </div>
                  )}

                  {/* Venue Badge */}
                  {mix.mixFields?.venue && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded text-xs">
                        📍 {mix.mixFields.venue}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-content p-6">
                  {/* Mix Header */}
                  <div className="mix-header mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link 
                        to={`/mixes/${mix.slug}`}
                        className="text-gray-900 hover:text-purple-600 transition-colors"
                      >
                        {mix.title}
                      </Link>
                    </h3>
                    
                    {/* Mix Meta */}
                    <div className="mix-meta flex flex-wrap gap-3 text-sm text-gray-600">
                      {/* Temporarily disabled genre field
                      {mix.mixFields?.genre && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {mix.mixFields.genre}
                        </span>
                      )}
                      */}
                      {mix.mixFields?.style && (
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                          {mix.mixFields.style}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Excerpt */}
                  {mix.excerpt && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {mix.excerpt.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* Audio Player Preview */}
                  {mix.mixFields?.audioFile?.localFile?.publicURL && (
                    <div className="audio-preview mb-4">
                      <audio 
                        controls 
                        className="w-full h-8"
                        src={mix.mixFields.audioFile.localFile.publicURL}
                        style={{ height: '32px' }}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Additional Info */}
                  {mix.mixFields?.recordedDate && (
                    <div className="recorded-date text-sm text-gray-500 mb-4">
                      Recorded: {mix.mixFields.recordedDate}
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="card-footer flex justify-between items-center">
                    <div className="meta text-sm text-gray-500">
                      {new Date(mix.date).toLocaleDateString()}
                    </div>
                    
                    <div className="actions flex gap-2">
                      <Link
                        to={`/mixes/${mix.slug}`}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                      >
                        Listen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {mixes.length === 0 && (
            <div className="empty-state text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No mixes found</h3>
              <p className="text-gray-500">
                Check back soon for new mixes, or browse our other content.
              </p>
            </div>
          )}

          {/* Featured Mix Spotlight */}
          <div className="featured-mix mt-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Featured Mix of the Month</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Dive deep into our latest curated journey featuring the hottest tracks and hidden gems.
                  </p>
                  <button className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                    Listen Now
                  </button>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6">
                    <svg className="w-16 h-16 mx-auto mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h3 className="text-xl font-semibold">Deep House Sessions #47</h3>
                    <p className="text-sm opacity-75">90 minutes of pure vibes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="newsletter-section mt-12 text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Never Miss a Mix</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to get notified when new mixes drop, plus exclusive content and early access.
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MixesPage

export const query = graphql`
  query GetAllMixes {
    allWpMix(sort: { date: DESC }) {
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
        # mixFields {  # Temporarily disabled - ACF fields not imported yet
        #   duration
        #   # genre  # Temporarily disabled pending taxonomy fix
        #   style
        #   venue
        #   recordedDate
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
