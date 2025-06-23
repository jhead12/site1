import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Link } from "gatsby"
import { Box, Flex, Text, Heading } from "../ui"

// Search across all content types
const GlobalSearch = ({ allData, onResultsChange }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    contentType: "all",
    dateRange: "all",
    sortBy: "relevance"
  })
  const [searchHistory, setSearchHistory] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Combine all content types into searchable data
  const searchableContent = useMemo(() => {
    const content = []
    
    // Add blog posts
    if (allData.posts) {
      allData.posts.forEach(post => {
        content.push({
          id: post.id,
          title: post.title,
          content: post.content || '',
          excerpt: post.excerpt || '',
          slug: post.slug,
          type: 'post',
          typeName: 'Blog Post',
          url: `/blog/${post.slug}/`,
          date: post.date,
          categories: post.categories?.nodes?.map(cat => cat.name) || [],
          tags: post.tags?.nodes?.map(tag => tag.name) || [],
          author: post.author?.node?.name || '',
          featuredImage: post.featuredImage?.node?.sourceUrl || null
        })
      })
    }

    // Add videos
    if (allData.videos) {
      allData.videos.forEach(video => {
        content.push({
          id: video.id,
          title: video.title,
          content: video.content || '',
          excerpt: video.excerpt || '',
          slug: video.slug,
          type: 'video',
          typeName: 'Video',
          url: `/videos/${video.slug}/`,
          date: video.date,
          categories: video.videoCategories?.nodes?.map(cat => cat.name) || [],
          tags: video.videoTags?.nodes?.map(tag => tag.name) || [],
          featuredImage: video.videoThumbnail || null
        })
      })
    }

    // Add beats
    if (allData.beats) {
      allData.beats.forEach(beat => {
        content.push({
          id: beat.id,
          title: beat.title,
          content: beat.content || '',
          excerpt: beat.excerpt || '',
          slug: beat.slug,
          type: 'beat',
          typeName: 'Beat',
          url: `/beats/${beat.slug}/`,
          date: beat.date,
          categories: beat.musicGenre?.nodes?.map(genre => genre.name) || [],
          tags: beat.mood?.nodes?.map(mood => mood.name) || [],
          featuredImage: beat.beatCover || null
        })
      })
    }

    // Add tutorials
    if (allData.tutorials) {
      allData.tutorials.forEach(tutorial => {
        content.push({
          id: tutorial.id,
          title: tutorial.title,
          content: tutorial.content || '',
          excerpt: tutorial.excerpt || '',
          slug: tutorial.slug,
          type: 'tutorial',
          typeName: 'Tutorial',
          url: `/tutorials/${tutorial.slug}/`,
          date: tutorial.date,
          categories: tutorial.tutorialCategories?.nodes?.map(cat => cat.name) || [],
          tags: tutorial.tutorialTags?.nodes?.map(tag => tag.name) || [],
          featuredImage: tutorial.tutorialThumbnail || null
        })
      })
    }

    // Add mixes
    if (allData.mixes) {
      allData.mixes.forEach(mix => {
        content.push({
          id: mix.id,
          title: mix.title,
          content: mix.content || '',
          excerpt: mix.excerpt || '',
          slug: mix.slug,
          type: 'mix',
          typeName: 'Mix',
          url: `/mixes/${mix.slug}/`,
          date: mix.date,
          categories: mix.mixCategories?.nodes?.map(cat => cat.name) || [],
          tags: mix.mixTags?.nodes?.map(tag => tag.name) || [],
          featuredImage: mix.mixCover || null
        })
      })
    }

    return content
  }, [allData])

  // Search function with fuzzy matching
  const performSearch = useCallback((term, filters) => {
    if (!term.trim()) return []

    const lowercaseTerm = term.toLowerCase()
    const terms = lowercaseTerm.split(' ').filter(t => t.length > 0)

    let results = searchableContent.filter(item => {
      // Content type filter
      if (filters.contentType !== 'all' && item.type !== filters.contentType) {
        return false
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.date)
        const now = new Date()
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24)

        switch (filters.dateRange) {
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case 'year':
            if (daysDiff > 365) return false
            break
        }
      }

      // Search in multiple fields
      const searchableText = [
        item.title,
        item.content,
        item.excerpt,
        ...item.categories,
        ...item.tags,
        item.author
      ].join(' ').toLowerCase()

      // Check if all search terms are found
      return terms.every(term => {
        // Exact match
        if (searchableText.includes(term)) return true
        
        // Fuzzy match (simple implementation)
        const words = searchableText.split(' ')
        return words.some(word => {
          if (word.length < 3) return word === term
          
          // Simple fuzzy matching - allow 1 character difference for words > 3 chars
          if (Math.abs(word.length - term.length) <= 1) {
            let differences = 0
            const maxLength = Math.max(word.length, term.length)
            
            for (let i = 0; i < maxLength; i++) {
              if (word[i] !== term[i]) differences++
              if (differences > 1) return false
            }
            return true
          }
          return false
        })
      })
    })

    // Calculate relevance scores
    results = results.map(item => {
      let score = 0
      const searchableText = [item.title, item.content, item.excerpt].join(' ').toLowerCase()
      
      // Title matches get higher score
      if (item.title.toLowerCase().includes(lowercaseTerm)) score += 10
      
      // Exact phrase matches
      if (searchableText.includes(lowercaseTerm)) score += 5
      
      // Category/tag matches
      if (item.categories.some(cat => cat.toLowerCase().includes(lowercaseTerm))) score += 3
      if (item.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm))) score += 3
      
      // Content frequency
      terms.forEach(term => {
        const matches = (searchableText.match(new RegExp(term, 'g')) || []).length
        score += matches
      })

      return { ...item, relevanceScore: score }
    })

    // Sort results
    switch (filters.sortBy) {
      case 'relevance':
        results.sort((a, b) => b.relevanceScore - a.relevanceScore)
        break
      case 'date':
        results.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return results
  }, [searchableContent])

  // Debounced search
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true)
        const results = performSearch(searchTerm, selectedFilters)
        setSearchResults(results)
        setIsSearching(false)
        
        if (onResultsChange) {
          onResultsChange(results)
        }
      } else {
        setSearchResults([])
        if (onResultsChange) {
          onResultsChange([])
        }
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedFilters, performSearch, onResultsChange])

  // Search suggestions based on popular terms
  const getSearchSuggestions = useCallback(() => {
    if (!searchTerm.trim()) return []
    
    const suggestions = new Set()
    const term = searchTerm.toLowerCase()
    
    // Add matching titles
    searchableContent.forEach(item => {
      if (item.title.toLowerCase().includes(term)) {
        suggestions.add(item.title)
      }
      
      // Add matching categories and tags
      item.categories.forEach(cat => {
        if (cat.toLowerCase().includes(term)) {
          suggestions.add(cat)
        }
      })
      
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          suggestions.add(tag)
        }
      })
    })
    
    return Array.from(suggestions).slice(0, 5)
  }, [searchTerm, searchableContent])

  const suggestions = getSearchSuggestions()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Add to search history
      const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10)
      setSearchHistory(newHistory)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('search_history', JSON.stringify(newHistory))
        } catch (error) {
          console.error("Browser storage not available:", error)
        }
      }
      setShowSuggestions(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>{part}</mark> : 
        part
    )
  }

  // Load search history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('search_history')
        if (savedHistory) {
          try {
            setSearchHistory(JSON.parse(savedHistory))
          } catch (error) {
            console.error("Error parsing search history:", error)
          }
        }
      } catch (error) {
        console.error("Browser storage not available:", error)
      }
    }
  }, [])

  return (
    <Box>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit}>
        <Box style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search across all content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 3rem 1rem 1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "25px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#004ca3"
              setShowSuggestions(true)
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0"
              setTimeout(() => setShowSuggestions(false), 200)
            }}
          />
          
          {/* Search Icon */}
          <div style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#666"
          }}>
            🔍
          </div>
          
          {isSearching && (
            <div style={{
              position: "absolute",
              right: "45px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666"
            }}>
              ⏳
            </div>
          )}
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto"
            }}>
              {suggestions.length > 0 && (
                <div>
                  <Text style={{ padding: "0.5rem 1rem", fontWeight: "bold", borderBottom: "1px solid #f0f0f0" }}>
                    Suggestions
                  </Text>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0"
                      }}
                      onClick={() => {
                        setSearchTerm(suggestion)
                        setShowSuggestions(false)
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              
              {searchHistory.length > 0 && (
                <div>
                  <Text style={{ padding: "0.5rem 1rem", fontWeight: "bold", borderBottom: "1px solid #f0f0f0" }}>
                    Recent Searches
                  </Text>
                  {searchHistory.slice(0, 5).map((historyItem, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0"
                      }}
                      onClick={() => {
                        setSearchTerm(historyItem)
                        setShowSuggestions(false)
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"
                      }}
                    >
                      🕐 {historyItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Box>
      </form>

      {/* Search Filters */}
      {searchTerm && (
        <Flex gap={2} style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
          <select
            value={selectedFilters.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px"
            }}
          >
            <option value="all">All Content</option>
            <option value="post">Blog Posts</option>
            <option value="video">Videos</option>
            <option value="beat">Beats</option>
            <option value="tutorial">Tutorials</option>
            <option value="mix">Mixes</option>
          </select>
          
          <select
            value={selectedFilters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px"
            }}
          >
            <option value="all">Any Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
          
          <select
            value={selectedFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px"
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </Flex>
      )}

      {/* Search Results */}
      {searchTerm && (
        <Box>
          <Text style={{ marginBottom: "1rem", color: "#666" }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
          </Text>
          
          {searchResults.length > 0 ? (
            <div style={{
              display: "grid",
              gap: "1rem"
            }}>
              {searchResults.map((result) => (
                <Link 
                  key={result.id} 
                  to={result.url}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    padding: "1rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <Flex gap={3}>
                    {result.featuredImage && (
                      <div style={{ minWidth: "120px" }}>
                        <img
                          src={result.featuredImage}
                          alt={result.title}
                          style={{
                            width: "120px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "4px"
                          }}
                        />
                      </div>
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <Flex gap={1} style={{ alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{
                          padding: "0.2rem 0.5rem",
                          backgroundColor: "#004ca3",
                          color: "white",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold"
                        }}>
                          {result.typeName}
                        </span>
                        <Text variant="kicker" style={{ color: "#666" }}>
                          {new Date(result.date).toLocaleDateString()}
                        </Text>
                      </Flex>
                      
                      <Heading as="h3" style={{ marginBottom: "0.5rem" }}>
                        {highlightText(result.title, searchTerm)}
                      </Heading>
                      
                      {result.excerpt && (
                        <Text style={{ 
                          marginBottom: "0.5rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {highlightText(result.excerpt.replace(/<[^>]*>/g, ''), searchTerm)}
                        </Text>
                      )}
                      
                      {(result.categories.length > 0 || result.tags.length > 0) && (
                        <Flex gap={1} style={{ flexWrap: "wrap" }}>
                          {result.categories.slice(0, 2).map((category, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "0.2rem 0.5rem",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "12px",
                                fontSize: "0.75rem"
                              }}
                            >
                              {category}
                            </span>
                          ))}
                          {result.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "0.2rem 0.5rem",
                                backgroundColor: "#e8f4f8",
                                borderRadius: "12px",
                                fontSize: "0.75rem"
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </Flex>
                      )}
                    </div>
                  </Flex>
                </Link>
              ))}
            </div>
          ) : (
            <Box style={{ textAlign: "center", padding: "2rem" }}>
              <Text>No results found for "{searchTerm}"</Text>
              <Text style={{ color: "#666", marginTop: "0.5rem" }}>
                Try different keywords or check your spelling
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default GlobalSearch
