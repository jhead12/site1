import React, { useState, useMemo } from 'react'
import { Box, Container, Heading, Text } from '../ui'
import './youtube-style-dashboard.css'

const YouTubeStyleDashboard = ({ 
  data = [], 
  title = "Channel Analytics",
  timeRange = "Last 28 days"
}) => {
  // State for time range and metrics
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [selectedMetric, setSelectedMetric] = useState('views')
  
  // Mock analytics data similar to YouTube Studio
  const [analyticsData] = useState({
    views: 24589,
    viewsChange: 15.2,
    watchTime: 1840,
    watchTimeChange: 8.7,
    subscribers: 2157,
    subscribersChange: 12.3,
    revenue: 342.87,
    revenueChange: 23.1
  })

  // Process content performance data
  const contentMetrics = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type || 'content',
      views: Math.floor(Math.random() * 10000) + 100, // Simulated view data
      likes: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 100) + 5,
      shares: Math.floor(Math.random() * 50) + 2,
      watchTime: Math.floor(Math.random() * 300) + 30, // In minutes
      ctr: (Math.random() * 10 + 2).toFixed(1), // Click-through rate
      avgViewDuration: Math.floor(Math.random() * 180) + 60, // In seconds
      impressions: Math.floor(Math.random() * 50000) + 1000,
      revenue: (Math.random() * 50 + 5).toFixed(2),
      publishDate: item.date || item.createdAt,
      thumbnail: item.featuredImage || item.image
    })).sort((a, b) => b.views - a.views)
  }, [data])

  // Generate chart data points for the last 28 days
  const chartData = useMemo(() => {
    const days = []
    const today = new Date()
    
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Simulate view data with some variation
      const baseViews = 800 + Math.sin(i * 0.2) * 200
      const randomVariation = (Math.random() - 0.5) * 300
      const views = Math.max(0, Math.floor(baseViews + randomVariation))
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        views: views,
        watchTime: Math.floor(views * 0.7), // Simulated watch time correlation
        subscribers: Math.floor(Math.random() * 20) + 5,
        revenue: (views * 0.002).toFixed(2)
      })
    }
    return days
  }, [])

  // Top performing content filter controls
  const PerformanceSlider = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => (
    <div className="performance-slider">
      <div className="slider-header">
        <label>{label}</label>
        <span className="slider-value">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="yt-slider"
      />
    </div>
  )

  // State for performance filters
  const [performanceFilters, setPerformanceFilters] = useState({
    minViews: 0,
    minEngagement: 0,
    minRevenue: 0,
    contentType: 'all'
  })

  // Filter content based on performance sliders
  const filteredContent = useMemo(() => {
    return contentMetrics.filter(item => {
      const meetsViews = item.views >= (performanceFilters.minViews * 100)
      const engagementRate = ((item.likes + item.comments + item.shares) / item.views) * 100
      const meetsEngagement = engagementRate >= performanceFilters.minEngagement
      const meetsRevenue = parseFloat(item.revenue) >= (performanceFilters.minRevenue * 0.5)
      const meetsType = performanceFilters.contentType === 'all' || item.type === performanceFilters.contentType
      
      return meetsViews && meetsEngagement && meetsRevenue && meetsType
    })
  }, [contentMetrics, performanceFilters])

  return (
    <div className="youtube-dashboard">
      <Container width="fullbleed">
        <Box paddingY={4}>
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <Heading as="h2" className="dashboard-title">
                {title}
              </Heading>
              <div className="time-range-selector">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="time-select"
                >
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 28 days">Last 28 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                  <option value="Last 365 days">Last 365 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Analytics Cards */}
          <div className="analytics-overview">
            <div className="metric-card views">
              <div className="metric-header">
                <span className="metric-label">Views</span>
                <span className={`metric-change ${analyticsData.viewsChange > 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.viewsChange > 0 ? '+' : ''}{analyticsData.viewsChange}%
                </span>
              </div>
              <div className="metric-value">{analyticsData.views.toLocaleString()}</div>
              <div className="metric-subtitle">vs previous period</div>
            </div>

            <div className="metric-card watch-time">
              <div className="metric-header">
                <span className="metric-label">Watch time (hours)</span>
                <span className={`metric-change ${analyticsData.watchTimeChange > 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.watchTimeChange > 0 ? '+' : ''}{analyticsData.watchTimeChange}%
                </span>
              </div>
              <div className="metric-value">{analyticsData.watchTime.toLocaleString()}</div>
              <div className="metric-subtitle">vs previous period</div>
            </div>

            <div className="metric-card subscribers">
              <div className="metric-header">
                <span className="metric-label">Subscribers</span>
                <span className={`metric-change ${analyticsData.subscribersChange > 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.subscribersChange > 0 ? '+' : ''}{analyticsData.subscribersChange}%
                </span>
              </div>
              <div className="metric-value">{analyticsData.subscribers.toLocaleString()}</div>
              <div className="metric-subtitle">vs previous period</div>
            </div>

            <div className="metric-card revenue">
              <div className="metric-header">
                <span className="metric-label">Estimated revenue</span>
                <span className={`metric-change ${analyticsData.revenueChange > 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.revenueChange > 0 ? '+' : ''}{analyticsData.revenueChange}%
                </span>
              </div>
              <div className="metric-value">${analyticsData.revenue}</div>
              <div className="metric-subtitle">vs previous period</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-header">
              <h3>Analytics Overview</h3>
              <div className="chart-controls">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="metric-select"
                >
                  <option value="views">Views</option>
                  <option value="watchTime">Watch Time</option>
                  <option value="subscribers">Subscribers</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
            </div>
            
            <div className="chart-container">
              <svg className="analytics-chart" viewBox="0 0 800 200">
                {/* Chart grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="50"
                    y1={40 + (i * 32)}
                    x2="750"
                    y2={40 + (i * 32)}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Chart line */}
                <polyline
                  fill="none"
                  stroke="#1a73e8"
                  strokeWidth="3"
                  points={chartData.map((point, index) => {
                    const x = 50 + (index * (700 / (chartData.length - 1)))
                    const maxValue = Math.max(...chartData.map(d => d[selectedMetric]))
                    const y = 180 - ((point[selectedMetric] / maxValue) * 140)
                    return `${x},${y}`
                  }).join(' ')}
                />
                
                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = 50 + (index * (700 / (chartData.length - 1)))
                  const maxValue = Math.max(...chartData.map(d => d[selectedMetric]))
                  const y = 180 - ((point[selectedMetric] / maxValue) * 140)
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#1a73e8"
                      className="chart-point"
                    />
                  )
                })}
                
                {/* X-axis labels */}
                {chartData.filter((_, index) => index % 4 === 0).map((point, index) => (
                  <text
                    key={index}
                    x={50 + (index * 4 * (700 / (chartData.length - 1)))}
                    y="195"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                  >
                    {point.date}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Performance Filters Section */}
          <div className="performance-section">
            <h3>Content Performance Filters</h3>
            <div className="performance-controls">
              <PerformanceSlider
                label="Minimum Views"
                value={performanceFilters.minViews}
                onChange={(value) => setPerformanceFilters(prev => ({...prev, minViews: value}))}
                min={0}
                max={100}
              />
              
              <PerformanceSlider
                label="Minimum Engagement"
                value={performanceFilters.minEngagement}
                onChange={(value) => setPerformanceFilters(prev => ({...prev, minEngagement: value}))}
                min={0}
                max={20}
              />
              
              <PerformanceSlider
                label="Minimum Revenue"
                value={performanceFilters.minRevenue}
                onChange={(value) => setPerformanceFilters(prev => ({...prev, minRevenue: value}))}
                min={0}
                max={100}
              />
              
              <div className="content-type-filter">
                <label htmlFor="content-type-select">Content Type</label>
                <select
                  id="content-type-select"
                  value={performanceFilters.contentType}
                  onChange={(e) => setPerformanceFilters(prev => ({...prev, contentType: e.target.value}))}
                  className="type-select"
                >
                  <option value="all">All Content</option>
                  <option value="beat">Beats</option>
                  <option value="mix">Mixes</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="track">Tracks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top Content Table */}
          <div className="top-content-section">
            <div className="section-header">
              <h3>Top Content</h3>
              <Text>Showing {filteredContent.length} of {contentMetrics.length} items</Text>
            </div>
            
            <div className="content-table">
              <div className="table-header">
                <div className="col-content">Content</div>
                <div className="col-views">Views</div>
                <div className="col-engagement">Engagement</div>
                <div className="col-watch-time">Watch Time</div>
                <div className="col-revenue">Revenue</div>
                <div className="col-ctr">CTR</div>
              </div>
              
              {filteredContent.slice(0, 10).map((item, index) => (
                <div key={item.id} className="table-row">
                  <div className="col-content">
                    <div className="content-info">
                      <div className="content-thumbnail">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail.node?.localFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src || '/placeholder.jpg'} 
                            alt={item.title}
                          />
                        ) : (
                          <div className="thumbnail-placeholder">{item.type}</div>
                        )}
                      </div>
                      <div className="content-details">
                        <div className="content-title">{item.title}</div>
                        <div className="content-meta">
                          {item.type} • {new Date(item.publishDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-views">{item.views.toLocaleString()}</div>
                  <div className="col-engagement">
                    {item.likes + item.comments + item.shares}
                  </div>
                  <div className="col-watch-time">{item.watchTime}m</div>
                  <div className="col-revenue">${item.revenue}</div>
                  <div className="col-ctr">{item.ctr}%</div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Container>
    </div>
  )
}

export default YouTubeStyleDashboard
