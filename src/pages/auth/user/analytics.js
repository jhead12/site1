import React, { useState, useEffect } from 'react'
import { graphql, navigate } from 'gatsby'
import Layout from '../../../components/layout'
import Head from '../../../components/head'
import DataSliderDashboard from '../../../components/analytics/data-slider-dashboard'
import YouTubeStyleDashboard from '../../../components/analytics/youtube-style-dashboard'
import { Container, Section, Box, Heading, Text, Flex, Button } from '../../../components/ui'
import { demoMusicData } from '../../../utils/demo-analytics-data'
import { useAuth } from '../../../hooks/useAuth'

const UserAnalyticsPage = ({ data }) => {
  const { isAuthenticated, isAdmin, loading, user, logout } = useAuth()
  
  // Process all music data from different sources
  const [musicData, setMusicData] = useState([])
  const [dashboardType, setDashboardType] = useState('youtube') // 'youtube' or 'slider'
  
  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin-login')
    }
  }, [isAdmin, loading])
  
  useEffect(() => {
    // Only process data if user is authenticated admin
    if (!isAdmin) return
    
    const processedData = []
    
    // Check if we have real data from WordPress/Contentful
    const hasRealData = (data.allWpBeat?.nodes?.length > 0) || 
                       (data.allWpMix?.nodes?.length > 0) || 
                       (data.allWpTutorial?.nodes?.length > 0)
    
    if (!hasRealData) {
      // Use demo data if no real data is available
      console.log('Using demo data for analytics dashboard')
      setMusicData(demoMusicData)
      return
    }
    
    // Process WordPress beats
    if (data.allWpBeat?.nodes) {
      data.allWpBeat.nodes.forEach(beat => {
        processedData.push({
          id: beat.id,
          title: beat.title,
          type: 'beat',
          category: 'Beats',
          slug: beat.slug,
          date: beat.date,
          price: 0, // ACF fields not available yet
          bpm: null,
          musicalKey: null,
          featuredImage: beat.featuredImage,
          audioUrl: null,
          source: 'WordPress'
        })
      })
    }
    
    // Process WordPress mixes
    if (data.allWpMix?.nodes) {
      data.allWpMix.nodes.forEach(mix => {
        processedData.push({
          id: mix.id,
          title: mix.title,
          type: 'mix',
          category: 'Mixes',
          slug: mix.slug,
          date: mix.date,
          price: 0,
          featuredImage: mix.featuredImage,
          audioUrl: null,
          source: 'WordPress'
        })
      })
    }
    
    // Process WordPress tutorials
    if (data.allWpTutorial?.nodes) {
      data.allWpTutorial.nodes.forEach(tutorial => {
        processedData.push({
          id: tutorial.id,
          title: tutorial.title,
          type: 'tutorial',
          category: 'Tutorials',
          slug: tutorial.slug,
          date: tutorial.date,
          price: 0,
          difficulty: null,
          featuredImage: tutorial.featuredImage,
          videoUrl: null,
          source: 'WordPress'
        })
      })
    }
    
    setMusicData(processedData)
  }, [data])

  // Handle data changes from the dashboard
  const handleDataChange = (filteredData, filters) => {
    console.log('Filtered Data:', filteredData)
    console.log('Applied Filters:', filters)
    // You can add additional logic here to handle the filtered data
    // For example, updating analytics, sending to external APIs, etc.
  }

  const categories = ['All', 'Beats', 'Mixes', 'Tutorials', 'Tracks', 'Videos']

  // Show loading while checking authentication
  if (loading) {
    return (
      <Layout>
        <Head title="User Analytics Dashboard | J.Eldon" />
        <Section paddingY={5}>
          <Container>
            <Box textAlign="center" padding={6}>
              <Text fontSize={4}>Checking authentication...</Text>
            </Box>
          </Container>
        </Section>
      </Layout>
    )
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <Layout>
        <Head title="Access Denied | J.Eldon" />
        <Section paddingY={5}>
          <Container>
            <Box textAlign="center" padding={6} backgroundColor="white" borderRadius={3} boxShadow="medium">
              <Heading as="h1" variant="display" marginBottom={4} style={{ color: '#dc2626' }}>
                Access Denied
              </Heading>
              <Text fontSize={3} marginBottom={4} style={{ color: '#6b7280' }}>
                You need WordPress administrator privileges to access this page.
              </Text>
              <Button
                onClick={() => navigate('/admin-login')}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Login as Administrator
              </Button>
            </Box>
          </Container>
        </Section>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head title="User Analytics Dashboard | J.Eldon" />
      
      <Section paddingY={3}>
        <Container width="normal">
          {/* Admin Status Bar */}
          <Box marginBottom={4} padding={3} backgroundColor="white" borderRadius={3} boxShadow="small">
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize={2} style={{ color: '#059669', fontWeight: 'bold' }}>
                  ✓ WordPress Administrator
                </Text>
                <Text fontSize={1} style={{ color: '#6b7280' }}>
                  Logged in as: {user?.name || 'Admin User'}
                </Text>
              </Box>
              <Button
                onClick={logout}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Logout
              </Button>
            </Flex>
          </Box>
          
          <Box textAlign="center" marginBottom={4}>
            <Heading as="h1">User Analytics Dashboard</Heading>
            <Text variant="lead" marginTop={3}>
              Interactive data visualization and content management system. 
              Use the controls below to filter and analyze your music content.
            </Text>
            
            {/* Dashboard Type Selector */}
            <Box marginTop={4}>
              <Flex justifyContent="center" gap={3}>
                <button
                  onClick={() => setDashboardType('youtube')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: dashboardType === 'youtube' ? '#1a73e8' : '#e2e8f0',
                    backgroundColor: dashboardType === 'youtube' ? '#1a73e8' : 'white',
                    color: dashboardType === 'youtube' ? 'white' : '#4a5568',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📺 YouTube Studio Style
                </button>
                <button
                  onClick={() => setDashboardType('slider')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: dashboardType === 'slider' ? '#667eea' : '#e2e8f0',
                    backgroundColor: dashboardType === 'slider' ? '#667eea' : 'white',
                    color: dashboardType === 'slider' ? 'white' : '#4a5568',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🎛️ Advanced Slider Dashboard
                </button>
              </Flex>
            </Box>
          </Box>
          
          {/* Usage Instructions */}
          {dashboardType === 'slider' && (
            <Box 
              marginBottom={5} 
              padding={4} 
              style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                borderRadius: '16px',
                border: '1px solid #e0e7ff'
              }}
            >
              <Heading as="h3" size="md" marginBottom={3}>How to Use the Slider Dashboard</Heading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📊 Data Filtering</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Use sliders to filter by price range, BPM, date range, and other criteria
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🎵 Category Selection</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Choose specific content types: beats, mixes, tutorials, or view all
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📈 Visualization Modes</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Switch between grid view, chart view, and analytics view
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>⚡ Real-time Updates</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    See instant results as you adjust filters and settings
                  </Text>
                </div>
              </div>
            </Box>
          )}

          {dashboardType === 'youtube' && (
            <Box 
              marginBottom={5} 
              padding={4} 
              style={{
                background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                borderRadius: '16px',
                border: '1px solid #fed7d7'
              }}
            >
              <Heading as="h3" size="md" marginBottom={3}>YouTube Studio-Style Analytics</Heading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📈 Performance Metrics</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Track views, watch time, engagement, and revenue like YouTube Studio
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🎯 Content Filtering</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Use performance sliders to filter content by views, engagement, and revenue
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📊 Visual Analytics</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Interactive charts showing performance trends over time
                  </Text>
                </div>
                <div>
                  <Text variant="body" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📋 Top Content</Text>
                  <Text style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    See your best-performing content in an organized table view
                  </Text>
                </div>
              </div>
            </Box>
          )}
        </Container>
      </Section>

      {/* Main Dashboard */}
      {dashboardType === 'youtube' ? (
        <YouTubeStyleDashboard
          data={musicData}
          title="J.Eldon Music Analytics"
          timeRange="Last 28 days"
        />
      ) : (
        <DataSliderDashboard
          data={musicData}
          title="J.Eldon Music Content Analytics"
          onDataChange={handleDataChange}
          categories={categories}
        />
      )}
      
      {/* Additional Analytics Section */}
      <Section paddingY={5}>
        <Container width="normal">
          <Box textAlign="center" marginBottom={4}>
            <Heading as="h2">Platform Insights</Heading>
            <Text variant="lead" marginTop={3}>
              Overview of your music platform performance and content metrics
            </Text>
          </Box>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {/* Content Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Content Library</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {musicData.length}
              </div>
              <p style={{ opacity: '0.9', fontSize: '0.9rem' }}>Total pieces of content</p>
            </div>
            
            {/* Average Price */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Average Price</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                ${musicData.length > 0 ? (musicData.reduce((sum, item) => sum + (item.price || 0), 0) / musicData.length).toFixed(2) : '0.00'}
              </div>
              <p style={{ opacity: '0.9', fontSize: '0.9rem' }}>Across all content</p>
            </div>
            
            {/* Content Types */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(245, 158, 11, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Content Types</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {[...new Set(musicData.map(item => item.type))].length}
              </div>
              <p style={{ opacity: '0.9', fontSize: '0.9rem' }}>Different categories</p>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  )
}

export default UserAnalyticsPage

export const query = graphql`
  query UserAnalyticsPageQuery {
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
      }
    }
    allWpTutorial(sort: { date: DESC }) {
      nodes {
        id
        title
        slug
        date
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
      }
    }
  }
`
