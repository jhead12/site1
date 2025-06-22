import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Head from "../components/head"
import MusicGrid from "../components/music/music-grid"
import MusicFilters from "../components/music/music-filters"
import {
  Container,
  Section,
  Box,
  Heading,
  Text
} from "../components/ui"
import "../components/music/music-page.css"

const MusicPage = ({ data }) => {
  // Extract all music sources
  const wpBeats = data.allWpBeat?.nodes || []
  const wpMixes = data.allWpMix?.nodes || []
  const contentfulTracks = data.allContentfulMusicTrack?.nodes || []
  
  // Process WordPress beats
  const beats = wpBeats.map(beat => ({
    id: beat.id,
    title: beat.title,
    type: "beat",
    source: "WordPress",
    slug: `/beats/${beat.slug}/`,
    audioUrl: beat.beatFields?.audioFile?.localFile?.url || null,
    price: beat.beatFields?.price || null,
    bpm: beat.beatFields?.bpm || null,
    key: beat.beatFields?.musicalKey || null,
    image: beat.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData || null,
    genre: beat.beatFields?.genre || null,
    soundcloudUrl: null, // SoundCloud field not yet available in schema
    purchaseUrl: beat.beatFields?.purchaseUrl || null,
    date: beat.date,
  }))
  
  // Process WordPress mixes
  const mixes = wpMixes.map(mix => ({
    id: mix.id,
    title: mix.title,
    type: "mix",
    source: "WordPress",
    slug: `/mixes/${mix.slug}/`,
    audioUrl: mix.mixFields?.audioFile?.localFile?.url || null,
    duration: mix.mixFields?.mixDuration || null, // Uses mixDuration instead of duration
    image: mix.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData || null,
    genre: mix.mixFields?.mixType || null,
    soundcloudUrl: mix.mixFields?.spotifyUrl || null, // Using spotifyUrl as fallback
    date: mix.date,
  }))
  
  // Process Contentful tracks (if you add them later)
  const tracks = contentfulTracks.map(track => ({
    id: track.id,
    title: track.title,
    type: "track",
    source: "Contentful",
    audioUrl: track.audioFile?.file?.url || null,
    price: track.price || null,
    image: track.coverArt?.gatsbyImageData || null,
    genre: track.genre || null,
    soundcloudUrl: track.soundcloudUrl || null,
    purchaseUrl: track.purchaseUrl || null,
    date: track.createdAt,
  }))
  
  // Combine all music items
  const allMusic = [...beats, ...mixes, ...tracks]
  
  // Extract all available genres for filtering
  const allGenres = [...new Set(allMusic.map(item => item.genre).filter(Boolean))]
  
  // Filtering state
  const [activeFilters, setActiveFilters] = useState({
    type: "all", // "all", "beat", "mix", "track"
    genre: "all", // "all" or any genre name
    source: "all" // "all", "WordPress", "Contentful", "SoundCloud"
  })
  
  // Apply filters to music items
  const filteredMusic = allMusic.filter(item => {
    const typeMatch = activeFilters.type === "all" || item.type === activeFilters.type
    const genreMatch = activeFilters.genre === "all" || item.genre === activeFilters.genre
    const sourceMatch = activeFilters.source === "all" || item.source === activeFilters.source
    return typeMatch && genreMatch && sourceMatch
  })
  
  return (
    <Layout>
      <Head title="Music Library | J.Eldon" />
      
      <Section paddingY={5}>
        <Container width="wide">
          <Box textAlign="center" marginBottom={5}>
            <Heading as="h1">Music Library</Heading>
            <Text variant="lead" marginTop={3}>
              Discover beats, mixes, and tracks - available for purchase or streaming on SoundCloud
            </Text>
          </Box>
          
          <MusicFilters 
            filters={activeFilters}
            setFilters={setActiveFilters} 
            availableGenres={allGenres}
          />
          
          {filteredMusic.length === 0 ? (
            <Box textAlign="center" marginY={6}>
              <Text>No music found matching your filters. Try changing your selection.</Text>
            </Box>
          ) : (
            <MusicGrid items={filteredMusic} />
          )}
        </Container>
      </Section>
    </Layout>
  )
}

export default MusicPage

export const query = graphql`
  query MusicPageQuery {
    allWpBeat(sort: { date: DESC }) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
        beatFields {
          bpm
          musicalKey
          price
          audioFile {
            localFile {
              url
            }
          }
        }
      }
    }
    allWpMix(sort: { date: DESC }) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
        mixFields {
          mixDuration
          mixType
          spotifyUrl
          audioFile {
            localFile {
              url
            }
          }
        }
      }
    }
    # Uncomment when you add Contentful music tracks
    # allContentfulMusicTrack(sort: { createdAt: DESC }) {
    #   nodes {
    #     id
    #     title
    #     price
    #     genre
    #     soundcloudUrl
    #     purchaseUrl
    #     createdAt
    #     coverArt {
    #       gatsbyImageData
    #     }
    #     audioFile {
    #       file {
    #         url
    #       }
    #     }
    #   }
    # }
  }
`
