import React from "react"
import { Box, Flex, Text } from "../ui"

const VideoSearch = ({
  searchTerm,
  onSearchTermChange,
  resultCount,
  selectedCategoryName,
}) => {
  const handleSearchChange = (e) => {
    onSearchTermChange(e.target.value)
  }

  const clearSearch = () => {
    onSearchTermChange("")
  }

  return (
    <Box marginY={4}>
      <Flex gap={2} style={{ alignItems: "center", justifyContent: "center" }}>
        <Box style={{ position: "relative", maxWidth: "500px", width: "100%" }}>
          <input
            type="text"
            placeholder="Search videos..."
            aria-label="Search videos"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "25px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease",
              paddingRight: searchTerm ? "40px" : "1rem",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#004ca3"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0"
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#666",
                padding: "5px",
              }}
              title="Clear search"
            >
              ×
            </button>
          )}
        </Box>
      </Flex>

      {searchTerm.trim() && (
        <Text
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          {resultCount} result{resultCount !== 1 ? "s" : ""} for "{searchTerm}""
          {selectedCategoryName && (
            <span> in "{selectedCategoryName}" category</span>
          )}
        </Text>
      )}
    </Box>
  )
}

export default VideoSearch
