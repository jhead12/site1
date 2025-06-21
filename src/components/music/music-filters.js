import React from "react"
import { Box, Flex, Text, Button } from "../ui"

const MusicFilters = ({ filters, setFilters, availableGenres }) => {
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }
  
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "beat", label: "Beats" },
    { value: "mix", label: "Mixes" },
    { value: "track", label: "Tracks" }
  ]
  
  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "WordPress", label: "My Library" },
    { value: "SoundCloud", label: "SoundCloud" }
  ]
  
  return (
    <Box marginY={4} className="music-filters">
      <Flex gap={4} flexDirection={["column", "row"]} justifyContent="center" marginBottom={4}>
        <Box>
          <Text variant="subhead" marginBottom={2}>Music Type</Text>
          <Flex gap={2} flexWrap="wrap">
            {typeOptions.map(option => (
              <Button
                key={option.value}
                variant={filters.type === option.value ? "primary" : "secondary"}
                onClick={() => handleFilterChange("type", option.value)}
                style={{
                  padding: "0.5rem 1rem",
                  margin: "0.25rem",
                  backgroundColor: filters.type === option.value ? "#004ca3" : "#f0f0f0",
                  color: filters.type === option.value ? "white" : "#333",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                {option.label}
              </Button>
            ))}
          </Flex>
        </Box>
        
        <Box>
          <Text variant="subhead" marginBottom={2}>Genre</Text>
          <Flex gap={2} flexWrap="wrap">
            <Button
              variant={filters.genre === "all" ? "primary" : "secondary"}
              onClick={() => handleFilterChange("genre", "all")}
              style={{
                padding: "0.5rem 1rem",
                margin: "0.25rem",
                backgroundColor: filters.genre === "all" ? "#004ca3" : "#f0f0f0",
                color: filters.genre === "all" ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              All Genres
            </Button>
            
            {availableGenres.map(genre => (
              <Button
                key={genre}
                variant={filters.genre === genre ? "primary" : "secondary"}
                onClick={() => handleFilterChange("genre", genre)}
                style={{
                  padding: "0.5rem 1rem",
                  margin: "0.25rem",
                  backgroundColor: filters.genre === genre ? "#004ca3" : "#f0f0f0",
                  color: filters.genre === genre ? "white" : "#333",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                {genre}
              </Button>
            ))}
          </Flex>
        </Box>
        
        <Box>
          <Text variant="subhead" marginBottom={2}>Source</Text>
          <Flex gap={2} flexWrap="wrap">
            {sourceOptions.map(option => (
              <Button
                key={option.value}
                variant={filters.source === option.value ? "primary" : "secondary"}
                onClick={() => handleFilterChange("source", option.value)}
                style={{
                  padding: "0.5rem 1rem",
                  margin: "0.25rem",
                  backgroundColor: filters.source === option.value ? "#004ca3" : "#f0f0f0",
                  color: filters.source === option.value ? "white" : "#333",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                {option.label}
              </Button>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default MusicFilters
