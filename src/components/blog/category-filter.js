import React from "react"
import {
  Box,
  Flex,
  Text,
  Button
} from "../ui"

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Box marginY={4} style={{ paddingTop: "2.5rem" }}>
      <Text variant="subhead" marginY={2}>Filter by Category:</Text>
      <Flex gap={2} style={{ flexWrap: "wrap" }}>
        <Button
          variant={selectedCategory === "all" ? "primary" : "secondary"}
          onClick={() => onCategoryChange("all")}
          style={{
            padding: "0.5rem 1rem",
            margin: "0.25rem",
            backgroundColor: selectedCategory === "all" ? "#004ca3" : "#f0f0f0",
            color: selectedCategory === "all" ? "white" : "#333",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          All Posts
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? "primary" : "secondary"}
            onClick={() => onCategoryChange(category.slug)}
            style={{
              padding: "0.5rem 1rem",
              margin: "0.25rem",
              backgroundColor: selectedCategory === category.slug ? "#004ca3" : "#f0f0f0",
              color: selectedCategory === category.slug ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </Flex>
    </Box>
  )
}

export default CategoryFilter
