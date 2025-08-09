import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  FlexList
} from '../components/ui';
import SEOHead from '../components/head';

/**
 * Beats Catalog - Browse all available beats from WordPress
 * Dynamically pulls from WordPress custom post type
 */
const BeatsPage = ({ data }) => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedKey, setSelectedKey] = useState('all');

  // Get beats from WordPress or fallback to static data
  const wpBeats = data?.allWpBeat?.nodes || [];
  
  // Transform WordPress data to consistent format
  const transformedBeats = wpBeats.map(beat => ({
    id: beat.slug,
    title: beat.title,
    bpm: beat.beatDetails?.bpm || null,
    key: beat.beatKeys?.nodes?.[0]?.name || null,
    genre: beat.beatGenres?.nodes?.[0]?.name || null,
    tags: beat.beatDetails?.tags?.split(',').map(tag => tag.trim()) || [],
    description: beat.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'Professional beat ready for your next track',
    preview: beat.beatDetails?.previewAudio?.localFile?.publicURL || beat.beatDetails?.previewAudio?.mediaItemUrl,
    artwork: beat.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src,
    featured: beat.beatDetails?.featured || false,
    date: beat.date
  }));

  // Fallback static beats if no WordPress data
  const staticBeats = [
    {
      id: 'dark-trap-001',
      title: 'Dark Trap Beat',
      bpm: 140,
      key: 'C Minor',
      genre: 'Trap',
      tags: ['Dark', 'Heavy', 'Melodic'],
      description: 'Hard-hitting trap beat with dark melodies',
      preview: '/audio/dark-trap-preview.mp3',
      artwork: null
    },
    {
      id: 'drill-beat-002',
      title: 'UK Drill Banger',
      bpm: 138,
      key: 'F# Minor',
      genre: 'Drill',
      tags: ['UK Drill', 'Hard', 'Street'],
      description: 'Aggressive UK drill beat with sliding 808s',
      preview: '/audio/drill-preview.mp3',
      artwork: null
    },
    {
      id: 'melodic-hiphop-003',
      title: 'Melodic Dreams',
      bpm: 85,
      key: 'G Major',
      genre: 'Hip Hop',
      tags: ['Melodic', 'Emotional', 'Smooth'],
      description: 'Smooth melodic hip hop with emotional chord progressions',
      preview: '/audio/melodic-preview.mp3',
      artwork: null
    },
    {
      id: 'afrobeat-004',
      title: 'Afro Vibes',
      bpm: 105,
      key: 'D Minor',
      genre: 'Afrobeat',
      tags: ['Afrobeat', 'Danceable', 'Global'],
      description: 'Infectious afrobeat with traditional percussion',
      preview: '/audio/afro-preview.mp3',
      artwork: null
    },
    {
      id: 'rage-type-005',
      title: 'Rage Energy',
      bpm: 150,
      key: 'E Minor',
      genre: 'Rage',
      tags: ['Rage', 'Distorted', 'Experimental'],
      description: 'High-energy rage beat with distorted elements',
      preview: '/audio/rage-preview.mp3',
      artwork: null
    }
  ];

  // Use WordPress beats if available, otherwise fallback to static
  const beats = transformedBeats.length > 0 ? transformedBeats : staticBeats;

  // Filter beats
  const filteredBeats = beats.filter(beat => {
    if (selectedGenre !== 'all' && beat.genre !== selectedGenre) return false;
    if (selectedKey !== 'all' && beat.key !== selectedKey) return false;
    return true;
  });

  const genres = ['all', ...new Set(beats.map(beat => beat.genre))];
  const keys = ['all', ...new Set(beats.map(beat => beat.key))];

  return (
    <Layout>
      <Section paddingY={5} style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <Container>
          {/* Header */}
          <Box textAlign="center" marginBottom={5} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h1" style={{ color: '#111827', marginBottom: '16px' }}>
              J. Eldon Beats Catalog
            </Heading>
            <Text variant="lead" style={{ color: '#374151', marginBottom: '8px' }}>
              Professional beats ready for your next project
            </Text>
            <Text fontSize={2} style={{ color: '#6b7280' }}>
              Preview beats instantly • Multiple license options • Instant download
            </Text>
          </Box>

          {/* Filters */}
          <Box marginBottom={5} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Flex gap={5} flexDirection={["column", "column", "row"]}>
              <Box flex="1">
                <Text fontWeight="bold" marginBottom={2} style={{ color: '#374151' }}>Genre</Text>
                <FlexList gap={2} wrap>
                  {genres.map(genre => (
                    <Button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      size="small"
                      style={{
                        backgroundColor: selectedGenre === genre ? '#3b82f6' : '#f3f4f6',
                        color: selectedGenre === genre ? 'white' : '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {genre}
                    </Button>
                  ))}
                </FlexList>
              </Box>
              
              <Box flex="1">
                <Text fontWeight="bold" marginBottom={2} style={{ color: '#374151' }}>Key</Text>
                <FlexList gap={2} wrap>
                  {keys.map(key => (
                    <Button
                      key={key}
                      onClick={() => setSelectedKey(key)}
                      size="small"
                      style={{
                        backgroundColor: selectedKey === key ? '#3b82f6' : '#f3f4f6',
                        color: selectedKey === key ? 'white' : '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '14px'
                      }}
                    >
                      {key}
                    </Button>
                  ))}
                </FlexList>
              </Box>
            </Flex>
          </Box>

          {/* Beats Grid */}
          <Box marginBottom={4}>
            <Text fontSize={2} style={{ color: '#6b7280', marginBottom: '16px' }}>
              Showing {filteredBeats.length} of {beats.length} beats
            </Text>
          </Box>

          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredBeats.map((beat) => (
              <Box
                key={beat.id}
                backgroundColor="white"
                borderRadius={3}
                boxShadow="medium"
                overflow="hidden"
                style={{
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'large'
                  }
                }}
              >
                {/* Beat Artwork */}
                <Box
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: '#1f2937',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {beat.artwork ? (
                    <img 
                      src={beat.artwork} 
                      alt={beat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Text fontSize={8} style={{ color: '#9ca3af' }}>🎵</Text>
                  )}
                  
                  {/* Play Button */}
                  <button
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.9)',
                      border: 'none',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    ▶️
                  </button>
                  
                  {/* Genre Badge */}
                  <Box
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  >
                    {beat.genre}
                  </Box>
                </Box>

                {/* Beat Info */}
                <Box padding={4}>
                  <Heading as="h3" variant="subheadLarge" marginBottom={2} style={{ color: '#111827' }}>
                    {beat.title}
                  </Heading>
                  
                  <Text fontSize={2} style={{ color: '#6b7280', marginBottom: '12px' }}>
                    {beat.description}
                  </Text>
                  
                  {/* Beat Details */}
                  <Flex gap={3} marginBottom={3}>
                    <Box>
                      <Text fontSize={1} style={{ color: '#9ca3af' }}>BPM</Text>
                      <Text fontWeight="bold" fontSize={2} style={{ color: '#374151' }}>{beat.bpm}</Text>
                    </Box>
                    <Box>
                      <Text fontSize={1} style={{ color: '#9ca3af' }}>Key</Text>
                      <Text fontWeight="bold" fontSize={2} style={{ color: '#374151' }}>{beat.key}</Text>
                    </Box>
                  </Flex>
                  
                  {/* Tags */}
                  <Flex gap={1} wrap marginBottom={4}>
                    {beat.tags.map((tag, index) => (
                      <Box
                        key={index}
                        style={{
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Flex>
                  
                  {/* Price Starting From */}
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text fontSize={1} style={{ color: '#9ca3af' }}>Starting from</Text>
                      <Text fontSize={4} fontWeight="bold" style={{ color: '#059669' }}>$50</Text>
                    </Box>
                    
                    <Button
                      as="a"
                      href={`/beats/${beat.id}`}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      View Licenses →
                    </Button>
                  </Flex>
                </Box>
              </Box>
            ))}
          </Box>

          {/* No Results */}
          {filteredBeats.length === 0 && (
            <Box padding={5} textAlign="center" backgroundColor="white" borderRadius={3} boxShadow="medium">
              <Text marginBottom={3} style={{ color: '#374151' }}>
                No beats match your current filters.
              </Text>
              <Button 
                onClick={() => {
                  setSelectedGenre('all');
                  setSelectedKey('all');
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Container>
      </Section>
    </Layout>
  );
};

export default BeatsPage;

export const Head = () => (
  <SEOHead 
    title="Beats Catalog - J. Eldon Music" 
    description="Browse professional beats from J. Eldon Music. Multiple license options available with instant download."
  />
);

// GraphQL query to get all beats from WordPress
export const query = graphql`
  query AllBeats {
    allWpBeat(sort: {date: DESC}) {
      nodes {
        id
        title
        content
        slug
        date(formatString: "MMMM DD, YYYY")
        featuredImage {
          node {
            altText
            sourceUrl
            localFile {
              childImageSharp {
                gatsbyImageData(width: 300, height: 300, placeholder: BLURRED)
              }
            }
          }
        }
      }
    }
  }
`;
