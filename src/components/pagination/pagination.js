import React, { useState, useMemo } from "react"
import { Box, Flex, Text } from "../ui"

const Pagination = ({ 
  items, 
  itemsPerPage = 12, 
  renderItem,
  loadMoreEnabled = true,
  infiniteScrollEnabled = false,
  showPageNumbers = true,
  onPageChange
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedPages, setLoadedPages] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // For load more functionality
  const loadMoreEndIndex = loadedPages * itemsPerPage
  
  const currentItems = useMemo(() => {
    if (loadMoreEnabled && !showPageNumbers) {
      return items.slice(0, loadMoreEndIndex)
    }
    return items.slice(startIndex, endIndex)
  }, [items, startIndex, endIndex, loadMoreEndIndex, loadMoreEnabled, showPageNumbers])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (onPageChange) {
      onPageChange(page)
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadMore = () => {
    setLoadedPages(prev => prev + 1)
  }

  const getVisiblePageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const PaginationButton = ({ page, isActive, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.5rem 0.75rem",
        margin: "0 0.25rem",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: isActive ? "#004ca3" : "white",
        color: isActive ? "white" : "#333",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isActive) {
          e.target.style.backgroundColor = "#f0f0f0"
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isActive) {
          e.target.style.backgroundColor = "white"
        }
      }}
    >
      {page}
    </button>
  )

  const ResultsInfo = () => {
    const start = loadMoreEnabled && !showPageNumbers 
      ? 1 
      : startIndex + 1
    const end = loadMoreEnabled && !showPageNumbers 
      ? Math.min(loadMoreEndIndex, items.length)
      : Math.min(endIndex, items.length)
    
    return (
      <Text style={{ color: "#666", fontSize: "0.9rem" }}>
        Showing {start}-{end} of {items.length} results
      </Text>
    )
  }

  const PerPageSelector = () => {
    const options = [6, 12, 24, 48]
    
    return (
      <Flex style={{ alignItems: "center", gap: "0.5rem" }}>
        <Text style={{ fontSize: "0.9rem", color: "#666" }}>Show:</Text>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            const newItemsPerPage = parseInt(e.target.value)
            setCurrentPage(1)
            setLoadedPages(1)
            // This would need to be handled by parent component
            // onItemsPerPageChange?.(newItemsPerPage)
          }}
          style={{
            padding: "0.25rem 0.5rem",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            fontSize: "0.9rem"
          }}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <Text style={{ fontSize: "0.9rem", color: "#666" }}>per page</Text>
      </Flex>
    )
  }

  return (
    <Box>
      {/* Top pagination info */}
      <Flex style={{ 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <ResultsInfo />
        {showPageNumbers && <PerPageSelector />}
      </Flex>

      {/* Items Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {currentItems.map((item, index) => (
          <div key={item.id || index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading state for infinite scroll */}
      {infiniteScrollEnabled && loadMoreEndIndex < items.length && (
        <Box style={{ textAlign: "center", padding: "1rem" }}>
          <Text>Loading more...</Text>
        </Box>
      )}

      {/* Load More Button */}
      {loadMoreEnabled && !showPageNumbers && loadMoreEndIndex < items.length && (
        <Box style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#004ca3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#003a7a"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#004ca3"
            }}
          >
            Load More ({Math.min(itemsPerPage, items.length - loadMoreEndIndex)} more)
          </button>
        </Box>
      )}

      {/* Page-based Navigation */}
      {showPageNumbers && totalPages > 1 && (
        <Box>
          {/* Page Numbers */}
          <Flex style={{ 
            justifyContent: "center", 
            alignItems: "center",
            marginTop: "2rem",
            flexWrap: "wrap"
          }}>
            {/* Previous Button */}
            <PaginationButton
              page="‹ Previous"
              isActive={false}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />

            {/* Page Numbers */}
            {getVisiblePageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={index} style={{ padding: "0.5rem 0.25rem", color: "#666" }}>
                  ...
                </span>
              ) : (
                <PaginationButton
                  key={index}
                  page={page}
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                />
              )
            ))}

            {/* Next Button */}
            <PaginationButton
              page="Next ›"
              isActive={false}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Flex>

          {/* Jump to Page */}
          {totalPages > 10 && (
            <Flex style={{ 
              justifyContent: "center", 
              alignItems: "center",
              marginTop: "1rem",
              gap: "0.5rem"
            }}>
              <Text style={{ fontSize: "0.9rem", color: "#666" }}>Jump to page:</Text>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1))
                  handlePageChange(page)
                }}
                style={{
                  width: "60px",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  textAlign: "center"
                }}
              />
              <Text style={{ fontSize: "0.9rem", color: "#666" }}>of {totalPages}</Text>
            </Flex>
          )}
        </Box>
      )}

      {/* Bottom Results Info */}
      <Flex style={{ 
        justifyContent: "center", 
        marginTop: "1rem"
      }}>
        <ResultsInfo />
      </Flex>
    </Box>
  )
}

export default Pagination
