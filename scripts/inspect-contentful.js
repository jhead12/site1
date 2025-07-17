const contentful = require("contentful")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config()

/**
 * Contentful Data Inspector
 * Inspects actual content in Contentful to match with GraphQL fragments
 */

async function inspectContentfulData() {
  console.log("🔍 Contentful Data Inspector")
  console.log("=" * 50)

  try {
    // Check if environment variables exist
    if (
      !process.env.CONTENTFUL_SPACE_ID ||
      !process.env.CONTENTFUL_ACCESS_TOKEN
    ) {
      console.log("❌ Missing Contentful environment variables")
      console.log("   Required: CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN")
      return
    }

    const client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    })

    console.log(
      `📡 Connected to Contentful space: ${process.env.CONTENTFUL_SPACE_ID}`
    )

    // Get all content types
    const contentTypes = await client.getContentTypes()

    console.log(`\n📋 Available Content Types (${contentTypes.items.length}):`)
    console.log("-" * 50)

    const relevantTypes = []

    contentTypes.items.forEach((type) => {
      const isRelevant =
        type.sys.id.toLowerCase().includes("homepage") ||
        type.sys.id.toLowerCase().includes("hero") ||
        type.sys.id.toLowerCase().includes("nav") ||
        type.sys.id.toLowerCase().includes("layout")

      if (isRelevant) relevantTypes.push(type)

      console.log(`\n🎯 ${type.name} (${type.sys.id})`)
      console.log(`   Description: ${type.description || "No description"}`)
      console.log(`   Relevant: ${isRelevant ? "✅" : "⚪"}`)
      console.log(`   Fields (${type.fields.length}):`)

      type.fields.forEach((field) => {
        const fieldType =
          field.type === "Link"
            ? `Link<${field.linkType}>`
            : field.type === "Array"
            ? `Array<${field.items?.type || "Unknown"}>`
            : field.type

        console.log(`     - ${field.name} (${field.id}): ${fieldType}`)

        if (field.validations?.length > 0) {
          console.log(
            `       Validations: ${JSON.stringify(field.validations, null, 2)}`
          )
        }
      })
    })

    // Focus on relevant content types
    console.log("\n" + "=" * 50)
    console.log("🎯 HOMEPAGE-RELEVANT CONTENT ANALYSIS")
    console.log("=" * 50)

    for (const type of relevantTypes) {
      console.log(`\n📊 Analyzing: ${type.name} (${type.sys.id})`)

      try {
        const entries = await client.getEntries({
          content_type: type.sys.id,
          limit: 10,
        })

        console.log(`   Entries found: ${entries.items.length}`)

        if (entries.items.length > 0) {
          entries.items.forEach((entry, index) => {
            const title =
              entry.fields.title ||
              entry.fields.name ||
              entry.fields.heading ||
              `Entry ${index + 1}`
            console.log(`\n   📄 ${title}`)

            // Show actual field values
            Object.keys(entry.fields).forEach((fieldKey) => {
              const value = entry.fields[fieldKey]

              if (typeof value === "string") {
                const preview =
                  value.length > 50 ? value.substring(0, 50) + "..." : value
                console.log(`      ${fieldKey}: "${preview}"`)
              } else if (Array.isArray(value)) {
                console.log(`      ${fieldKey}: [${value.length} items]`)
                if (value.length > 0 && value[0].sys) {
                  console.log(
                    `         Sample: ${value[0].sys.type} (${value[0].sys.id})`
                  )
                }
              } else if (value && typeof value === "object" && value.sys) {
                console.log(
                  `      ${fieldKey}: ${value.sys.type} (${value.sys.id})`
                )
              } else {
                console.log(
                  `      ${fieldKey}: ${typeof value} (${
                    JSON.stringify(value)?.substring(0, 30) || "null"
                  })`
                )
              }
            })
          })
        }
      } catch (error) {
        console.log(`   ❌ Error fetching entries: ${error.message}`)
      }
    }

    // Check against our GraphQL fragments
    console.log("\n" + "=" * 50)
    console.log("🔍 FRAGMENT VALIDATION")
    console.log("=" * 50)

    const indexPath = path.join(__dirname, "../src/pages/index.js")
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, "utf8")

      // Extract fragments
      const fragmentMatches = indexContent.match(
        /fragment\s+(\w+)\s+on\s+(\w+)\s*{([^}]+)}/g
      )

      if (fragmentMatches) {
        console.log(
          `\n📋 Found ${fragmentMatches.length} GraphQL fragments to validate:`
        )

        fragmentMatches.forEach((fragment) => {
          const nameMatch = fragment.match(/fragment\s+(\w+)\s+on\s+(\w+)/)
          if (nameMatch) {
            const fragmentName = nameMatch[1]
            const contentType = nameMatch[2]

            console.log(`\n🧩 ${fragmentName} -> ${contentType}`)

            // Check if content type exists
            const typeExists = contentTypes.items.find(
              (t) =>
                t.sys.id === contentType ||
                `Contentful${t.sys.id}` === contentType
            )
            console.log(`   Type exists: ${typeExists ? "✅" : "❌"}`)

            if (typeExists) {
              // Extract fields from fragment
              const fieldMatches = fragment.match(/(\w+)\s*(?:{|\s|$)/g)
              if (fieldMatches) {
                fieldMatches.forEach((field) => {
                  const fieldName = field.replace(/[{\s]/g, "")
                  if (
                    fieldName &&
                    !["id", "on", "fragment"].includes(fieldName)
                  ) {
                    const fieldExists = typeExists.fields.find(
                      (f) => f.id === fieldName
                    )
                    console.log(
                      `     ${fieldName}: ${fieldExists ? "✅" : "❌"}`
                    )
                  }
                })
              }
            }
          }
        })
      }
    }

    // Get assets summary
    console.log("\n" + "=" * 50)
    console.log("🖼️ ASSETS SUMMARY")
    console.log("=" * 50)

    const assets = await client.getAssets({ limit: 5 })
    console.log(`Total assets: ${assets.total}`)
    console.log(`Sample assets:`)

    assets.items.forEach((asset, index) => {
      console.log(`   ${index + 1}. ${asset.fields.title}`)
      console.log(`      Type: ${asset.fields.file?.contentType}`)
      console.log(`      URL: ${asset.fields.file?.url}`)
      console.log(`      Size: ${asset.fields.file?.details?.size} bytes`)
    })
  } catch (error) {
    console.error("❌ Error inspecting Contentful:", error.message)

    if (error.message.includes("401")) {
      console.log("   Check your CONTENTFUL_ACCESS_TOKEN")
    }
    if (error.message.includes("404")) {
      console.log("   Check your CONTENTFUL_SPACE_ID")
    }
  }
}

// Export for use in other scripts
module.exports = { inspectContentfulData }

// Run if called directly
if (require.main === module) {
  inspectContentfulData()
}
