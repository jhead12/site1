import React, { useState, useEffect, useMemo } from 'react'
import { Box, Container, Heading, Text } from '../ui'
import './data-slider-dashboard.css'

const DataSliderDashboard = ({ 
  data = [], 
  title = "Music Analytics Dashboard",
  onDataChange,
  categories = ['All', 'Beats', 'Mixes', 'Tutorials', 'Videos']
}) => {
  // State for slider controls
  const [filters, setFilters] = useState({
    dateRange: [0, 100], // Percentage of date range
    viewCount: [0, 1000],
    priceRange: [0, 1000],
    bpmRange: [60, 200],
    categories: 'All',
    sortBy: 'date',
    chartType: 'grid'
  })

  // State for visualization settings
  const [visualSettings, setVisualSettings] = useState({
    itemsPerPage: 12,
    showPreviews: true,
    showMetadata: true,
    colorScheme: 'default',
    animationSpeed: 1
  })

  // Process and filter data based on slider values
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    let filtered = [...data]

    // Apply category filter
    if (filters.categories !== 'All') {
      filtered = filtered.filter(item => 
        item.type === filters.categories.toLowerCase() ||
        item.category === filters.categories
      )
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const price = item.price || item.beatsFields?.price || 0
        return price >= filters.priceRange[0] && price <= filters.priceRange[1]
      })
    }

    // Apply BPM range filter (for beats)
    if (filters.bpmRange) {
      filtered = filtered.filter(item => {
        const bpm = item.bpm || item.beatsFields?.bpm
        return !bpm || (bpm >= filters.bpmRange[0] && bpm <= filters.bpmRange[1])
      })
    }

    // Apply date range filter
    if (filters.dateRange) {
      const dates = filtered.map(item => new Date(item.date || item.createdAt)).sort()
      if (dates.length > 0) {
        const minDate = dates[0]
        const maxDate = dates[dates.length - 1]
        const dateSpan = maxDate - minDate
        
        const filterMinDate = new Date(minDate.getTime() + (dateSpan * filters.dateRange[0] / 100))
        const filterMaxDate = new Date(minDate.getTime() + (dateSpan * filters.dateRange[1] / 100))
        
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date || item.createdAt)
          return itemDate >= filterMinDate && itemDate <= filterMaxDate
        })
      }
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return (b.price || b.beatsFields?.price || 0) - (a.price || a.beatsFields?.price || 0)
        case 'bpm':
          return (b.bpm || b.beatsFields?.bpm || 0) - (a.bpm || a.beatsFields?.bpm || 0)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'date':
        default:
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      }
    })

    return filtered.slice(0, visualSettings.itemsPerPage)
  }, [data, filters, visualSettings])

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(processedData, filters)
    }
  }, [processedData, filters, onDataChange])

  // Slider component
  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1, 
    unit = '',
    isRange = false 
  }) => (
    <div className="slider-control">
      <label className="slider-label">
        <span>{label}</span>
        <span className="slider-value">
          {isRange 
            ? `${value[0]}${unit} - ${value[1]}${unit}`
            : `${value}${unit}`
          }
        </span>
      </label>
      
      {isRange ? (
        <div className="range-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
            className="slider range-min"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
            className="slider range-max"
          />
          <div className="range-track">
            <div 
              className="range-fill"
              style={{
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                width: `${((value[1] - value[0]) / (max - min)) * 100}%`
              }}
            />
          </div>
        </div>
      ) : (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider"
        />
      )}
    </div>
  )

  // Data visualization components
  const GridView = () => (
    <div className={`data-grid ${visualSettings.colorScheme}`}>
      {processedData.map((item, index) => (
        <div 
          key={item.id} 
          className="data-item"
          style={{
            animationDelay: `${index * (0.1 / visualSettings.animationSpeed)}s`
          }}
        >
          {/* Item Image/Visual */}
          <div className="item-visual">
            {item.featuredImage || item.image ? (
              <img 
                src={item.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src || item.image?.file?.url} 
                alt={item.title}
                className="item-image"
              />
            ) : (
              <div className="item-placeholder">
                <span className="item-type">{item.type || 'Content'}</span>
              </div>
            )}
            
            {/* Audio Preview */}
            {visualSettings.showPreviews && (item.audioUrl || item.beatsFields?.audioFile) && (
              <div className="audio-preview">
                <button className="play-button">▶</button>
              </div>
            )}
          </div>

          {/* Item Metadata */}
          <div className="item-content">
            <h3 className="item-title">{item.title}</h3>
            
            {visualSettings.showMetadata && (
              <div className="item-metadata">
                {item.price || item.beatsFields?.price ? (
                  <span className="price">${item.price || item.beatsFields?.price}</span>
                ) : null}
                
                {item.bpm || item.beatsFields?.bpm ? (
                  <span className="bpm">{item.bpm || item.beatsFields?.bpm} BPM</span>
                ) : null}
                
                {item.musicalKey || item.beatsFields?.musicalKey ? (
                  <span className="key">{item.musicalKey || item.beatsFields?.musicalKey}</span>
                ) : null}
                
                <span className="date">
                  {new Date(item.date || item.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Elements */}
          <div className="item-actions">
            <button className="action-button primary">View</button>
            {item.price || item.beatsFields?.price ? (
              <button className="action-button secondary">Buy</button>
            ) : (
              <button className="action-button secondary">Download</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const ChartView = () => {
    const chartData = processedData.reduce((acc, item) => {
      const category = item.type || 'Other'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    return (
      <div className="chart-view">
        <div className="bar-chart">
          {Object.entries(chartData).map(([category, count]) => (
            <div key={category} className="bar-item">
              <div className="bar-label">{category}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{
                    height: `${(count / Math.max(...Object.values(chartData))) * 100}%`
                  }}
                />
                <span className="bar-value">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const AnalyticsView = () => {
    const analytics = {
      totalItems: processedData.length,
      averagePrice: processedData.reduce((sum, item) => sum + (item.price || item.beatsFields?.price || 0), 0) / processedData.length,
      averageBPM: processedData.filter(item => item.bpm || item.beatsFields?.bpm).reduce((sum, item) => sum + (item.bpm || item.beatsFields?.bpm), 0) / processedData.filter(item => item.bpm || item.beatsFields?.bpm).length,
      categories: [...new Set(processedData.map(item => item.type || 'Other'))].length
    }

    return (
      <div className="analytics-view">
        <div className="analytics-cards">
          <div className="analytics-card">
            <h4>Total Items</h4>
            <span className="analytics-value">{analytics.totalItems}</span>
          </div>
          <div className="analytics-card">
            <h4>Avg Price</h4>
            <span className="analytics-value">${analytics.averagePrice.toFixed(2)}</span>
          </div>
          <div className="analytics-card">
            <h4>Avg BPM</h4>
            <span className="analytics-value">{analytics.averageBPM.toFixed(0)}</span>
          </div>
          <div className="analytics-card">
            <h4>Categories</h4>
            <span className="analytics-value">{analytics.categories}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="data-slider-dashboard">
      <Container width="fullbleed">
        <Box paddingY={5}>
          <Heading as="h2" center marginBottom={4}>
            {title}
          </Heading>
          
          {/* Control Panel */}
          <div className="control-panel">
            <div className="controls-section">
              <h3>Data Filters</h3>
              
              <div className="controls-grid">
                {/* Category Filter */}
                <div className="control-group">
                  <label htmlFor="category-select">Category</label>
                  <select
                    id="category-select"
                    value={filters.categories}
                    onChange={(e) => setFilters(prev => ({...prev, categories: e.target.value}))}
                    className="select-control"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Slider */}
                <SliderControl
                  label="Date Range"
                  value={filters.dateRange}
                  onChange={(value) => setFilters(prev => ({...prev, dateRange: value}))}
                  min={0}
                  max={100}
                  unit="%"
                  isRange={true}
                />

                {/* Price Range Slider */}
                <SliderControl
                  label="Price Range"
                  value={filters.priceRange}
                  onChange={(value) => setFilters(prev => ({...prev, priceRange: value}))}
                  min={0}
                  max={1000}
                  step={10}
                  unit="$"
                  isRange={true}
                />

                {/* BPM Range Slider */}
                <SliderControl
                  label="BPM Range"
                  value={filters.bpmRange}
                  onChange={(value) => setFilters(prev => ({...prev, bpmRange: value}))}
                  min={60}
                  max={200}
                  step={5}
                  unit=" BPM"
                  isRange={true}
                />

                {/* Items Per Page */}
                <SliderControl
                  label="Items Per Page"
                  value={visualSettings.itemsPerPage}
                  onChange={(value) => setVisualSettings(prev => ({...prev, itemsPerPage: value}))}
                  min={6}
                  max={50}
                  step={6}
                />

                {/* Animation Speed */}
                <SliderControl
                  label="Animation Speed"
                  value={visualSettings.animationSpeed}
                  onChange={(value) => setVisualSettings(prev => ({...prev, animationSpeed: value}))}
                  min={0.5}
                  max={3}
                  step={0.5}
                  unit="x"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="view-controls">
                <div className="control-group">
                  <label htmlFor="sort-select">Sort By</label>
                  <select
                    id="sort-select"
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
                    className="select-control"
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="bpm">BPM</option>
                  </select>
                </div>

                <div className="control-group">
                  <label htmlFor="view-type-select">View Type</label>
                  <select
                    id="view-type-select"
                    value={filters.chartType}
                    onChange={(e) => setFilters(prev => ({...prev, chartType: e.target.value}))}
                    className="select-control"
                  >
                    <option value="grid">Grid View</option>
                    <option value="chart">Chart View</option>
                    <option value="analytics">Analytics View</option>
                  </select>
                </div>

                <div className="control-group">
                  <label htmlFor="color-scheme-select">Color Scheme</label>
                  <select
                    id="color-scheme-select"
                    value={visualSettings.colorScheme}
                    onChange={(e) => setVisualSettings(prev => ({...prev, colorScheme: e.target.value}))}
                    className="select-control"
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark Mode</option>
                    <option value="neon">Neon</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="toggle-controls">
                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={visualSettings.showPreviews}
                    onChange={(e) => setVisualSettings(prev => ({...prev, showPreviews: e.target.checked}))}
                  />
                  <span>Show Audio Previews</span>
                </label>

                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={visualSettings.showMetadata}
                    onChange={(e) => setVisualSettings(prev => ({...prev, showMetadata: e.target.checked}))}
                  />
                  <span>Show Metadata</span>
                </label>
              </div>
            </div>
          </div>

          {/* Data Visualization Area */}
          <div className="visualization-area">
            <div className="results-header">
              <Text>
                Showing {processedData.length} of {data.length} items
              </Text>
            </div>

            {filters.chartType === 'grid' && <GridView />}
            {filters.chartType === 'chart' && <ChartView />}
            {filters.chartType === 'analytics' && <AnalyticsView />}
          </div>
        </Box>
      </Container>
    </div>
  )
}

export default DataSliderDashboard
