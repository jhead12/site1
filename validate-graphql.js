const fs = require("fs")
const path = require("path")

// Simple GraphQL syntax validator
function validateGraphQLSyntax(content) {
  // Check for balanced braces
  let braceCount = 0
  let inString = false
  let escaped = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if (char === '"' || char === "'") {
      inString = !inString
      continue
    }

    if (!inString) {
      if (char === "{") {
        braceCount++
      } else if (char === "}") {
        braceCount--
      }
    }
  }

  return braceCount === 0
}

// Read and validate the index.js file
const indexPath = path.join(__dirname, "src", "pages", "index.js")
const content = fs.readFileSync(indexPath, "utf8")

// Extract GraphQL queries (simple regex match)
const graphqlMatches = content.match(/graphql`[\s\S]*?`/g)

if (graphqlMatches) {
  console.log(`Found ${graphqlMatches.length} GraphQL queries in index.js`)

  graphqlMatches.forEach((match, index) => {
    console.log(`\nValidating GraphQL query ${index + 1}:`)
    const isValid = validateGraphQLSyntax(match)
    console.log(
      isValid ? "✅ Valid syntax" : "❌ Invalid syntax - check braces"
    )

    if (!isValid) {
      // Count braces for debugging
      const openBraces = (match.match(/\{/g) || []).length
      const closeBraces = (match.match(/\}/g) || []).length
      console.log(`   Open braces: ${openBraces}, Close braces: ${closeBraces}`)
    }
  })
} else {
  console.log("No GraphQL queries found in index.js")
}

console.log("\n✅ GraphQL syntax validation complete")
