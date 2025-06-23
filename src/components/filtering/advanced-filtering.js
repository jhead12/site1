import React, { useState, useEffect } from "react"
import { Box, Flex, Text, Heading } from "../ui"

const AdvancedFiltering = ({ 
  items, 
  onFilterChange,
  availableFilters = {},
  showFilterCounts = true,
  persistFilters = true,
  filterStorageKey = "content_filters"
}) => {
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    tags: [],
    authors: [],
    dateRange: 'all',
    contentTypes: [],
    sortBy: 'date',
    sortOrder: 'desc'
  })
  
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Load persisted filters on mount
  useEffect(() => {
    if (persistFilters && typeof window !== 'undefined') {
      try {
        const savedFilters = localStorage.getItem(filterStorageKey)
        if (savedFilters) {
          try {
            setActiveFilters(JSON.parse(savedFilters))
          } catch (e) {
            console.warn('Failed to parse saved filters')
          }
        }
      } catch (error) {
        console.error("Browser storage not available:", error)
      }
    }
  }, [persistFilters, filterStorageKey])

  // Save filters to localStorage
  useEffect(() => {
    if (persistFilters && typeof window !== 'undefined') {
      try {
        localStorage.setItem(filterStorageKey, JSON.stringify(activeFilters))
      } catch (error) {
        console.error("Browser storage not available:", error)
      }
    }
  }, [activeFilters, persistFilters, filterStorageKey])

  // Apply filters and notify parent
  useEffect(() => {
    const filteredItems = applyFilters(items, activeFilters)
    if (onFilterChange) {
      onFilterChange(filteredItems, activeFilters)
    }
  }, [items, activeFilters, onFilterChange])

  const applyFilters = (items, filters) => {
    let filtered = [...items]

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        item.categories?.nodes?.some(cat => 
          filters.categories.includes(cat.slug || cat.name)
        )
      )
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags?.nodes?.some(tag => 
          filters.tags.includes(tag.slug || tag.name)
        )
      )
    }

    // Author filter
    if (filters.authors.length > 0) {
      filtered = filtered.filter(item => 
        filters.authors.includes(item.author?.node?.name || item.author?.name)
      )
    }

    // Content type filter
    if (filters.contentTypes.length > 0) {
      filtered = filtered.filter(item => 
        filters.contentTypes.includes(item.__typename || item.type)
      )
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
        case 'custom':
          // Handle custom date range if implemented
          break
      }
      
      filtered = filtered.filter(item => 
        new Date(item.date) >= cutoffDate
      )
    }

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'author':
          aValue = (a.author?.node?.name || a.author?.name || '').toLowerCase()
          bValue = (b.author?.node?.name || b.author?.name || '').toLowerCase()
          break
        case 'date':
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const toggleFilter = (filterType, value) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [filterType]: newValues
      }
    })
  }

  const setFilter = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      tags: [],
      authors: [],
      dateRange: 'all',
      contentTypes: [],
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  const getFilterCount = (filterType, value) => {
    if (!showFilterCounts) return null
    
    const tempFilters = { ...activeFilters }
    tempFilters[filterType] = [value]
    const filtered = applyFilters(items, tempFilters)
    return filtered.length
  }

  const getActiveFilterCount = () => {
    return (
      activeFilters.categories.length +
      activeFilters.tags.length +
      activeFilters.authors.length +
      activeFilters.contentTypes.length +
      (activeFilters.dateRange !== 'all' ? 1 : 0)
    )
  }

  const FilterSection = ({ title, filterType, options, isMultiSelect = true }) => (
    <Box style={{ marginBottom: "1.5rem" }}>
      <Text style={{ fontWeight: "bold", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
        {title}
      </Text>
      <div style={{
        display: "grid",
        gap: "0.5rem",
        maxHeight: "200px",
        overflowY: "auto"
      }}>
        {options.map((option) => {
          const isActive = isMultiSelect 
            ? activeFilters[filterType].includes(option.value)
            : activeFilters[filterType] === option.value
          const count = getFilterCount(filterType, option.value)
          
          return (
            <label
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "0.5rem",
                backgroundColor: isActive ? "#e8f4f8" : "transparent",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: isActive ? "#004ca3" : "transparent",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = "#f0f0f0"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = "transparent"
                }
              }}
            >
              <input
                type={isMultiSelect ? "checkbox" : "radio"}
                checked={isActive}
                onChange={() => {
                  if (isMultiSelect) {
                    toggleFilter(filterType, option.value)
                  } else {
                    setFilter(filterType, option.value)
                  }
                }}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ flex: 1, fontSize: "0.9rem" }}>
                {option.label}
              </span>
              {count !== null && (
                <span style={{ 
                  fontSize: "0.8rem", 
                  color: "#666",
                  backgroundColor: "#f0f0f0",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "12px"
                }}>
                  {count}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </Box>
  )

  const dateRangeOptions = [
    { value: 'all', label: 'Any time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
    { value: 'quarter', label: 'Past 3 months' },
    { value: 'year', label: 'Past year' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' }
  ]

  const sortOrderOptions = [
    { value: 'desc', label: 'Newest first' },
    { value: 'asc', label: 'Oldest first' }
  ]

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div style={{ display: "block" }} className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "#004ca3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </span>
          <span>{showMobileFilters ? '−' : '+'}</span>
        </button>
      </div>

      {/* Filter Panel */}
      <Box 
        style={{
          display: showMobileFilters ? "block" : "none",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "2rem"
        }}
        className="lg:block lg:display-block"
      >
        {/* Filter Header */}
        <Flex style={{ 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <Heading as="h3">Filters</Heading>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                color: "#dc3545",
                border: "1px solid #dc3545",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Clear All ({getActiveFilterCount()})
            </button>
          )}
        </Flex>

        {/* Active Filters Pills */}
        {getActiveFilterCount() > 0 && (
          <Box style={{ marginBottom: "1.5rem" }}>
            <Text style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: "#666" }}>
              Active Filters:
            </Text>
            <Flex style={{ flexWrap: "wrap", gap: "0.5rem" }}>
              {activeFilters.categories.map(cat => (
                <span
                  key={cat}
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#004ca3",
                    color: "white",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  {cat}
                  <button
                    onClick={() => toggleFilter('categories', cat)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "0"
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {activeFilters.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  #{tag}
                  <button
                    onClick={() => toggleFilter('tags', tag)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "0"
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </Flex>
          </Box>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}>
          {/* Categories */}
          {availableFilters.categories && (
            <FilterSection
              title="Categories"
              filterType="categories"
              options={availableFilters.categories}
            />
          )}

          {/* Tags */}
          {availableFilters.tags && (
            <FilterSection
              title="Tags"
              filterType="tags"
              options={availableFilters.tags}
            />
          )}

          {/* Authors */}
          {availableFilters.authors && (
            <FilterSection
              title="Authors"
              filterType="authors"
              options={availableFilters.authors}
            />
          )}

          {/* Content Types */}
          {availableFilters.contentTypes && (
            <FilterSection
              title="Content Type"
              filterType="contentTypes"
              options={availableFilters.contentTypes}
            />
          )}

          {/* Date Range */}
          <FilterSection
            title="Date Range"
            filterType="dateRange"
            options={dateRangeOptions}
            isMultiSelect={false}
          />

          {/* Sort Options */}
          <Box>
            <Text style={{ fontWeight: "bold", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
              Sort By
            </Text>
            <select
              value={activeFilters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                marginBottom: "0.5rem"
              }}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={activeFilters.sortOrder}
              onChange={(e) => setFilter('sortOrder', e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #e0e0e0",
                borderRadius: "4px"
              }}
            >
              {sortOrderOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Box>
        </div>
      </Box>
    </>
  )
}

export default AdvancedFiltering
