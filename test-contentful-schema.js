const { execSync } = require("child_process")

console.log("Querying Contentful data available in GraphQL...\n")

// Test query to see what Contentful data is available
const testQuery = `
{
  # Homepage content
  contentfulHomepage {
    id
    title
    description
    content {
      __typename
      ... on ContentfulHomepageHero {
        id
        heading
        kicker
        text
        image {
          url
          title
          description
        }
      }
      ... on ContentfulHomepageFeatureList {
        id
        heading
        kicker
        text
        content {
          __typename
        }
      }
      ... on ContentfulHomepageLogoList {
        id
        heading
        text
        logos {
          id
          alt
          url
        }
      }
    }
  }
  
  # All heroes
  allContentfulHomepageHero {
    nodes {
      id
      heading
      kicker
      text
      image {
        url
        title
        description
      }
    }
  }
  
  # All feature lists
  allContentfulHomepageFeatureList {
    nodes {
      id
      heading
      kicker
      text
      content {
        __typename
        ... on ContentfulHomepageFeature {
          id
          heading
          kicker
          text
        }
      }
    }
  }
  
  # All features
  allContentfulHomepageFeature {
    nodes {
      id
      heading
      kicker
      text
      links {
        id
        href
        text
      }
      image {
        url
        title
        description
      }
    }
  }
  
  # All logo lists
  allContentfulHomepageLogoList {
    nodes {
      id
      heading
      text
      logos {
        id
        alt
        url
      }
    }
  }
}
`

try {
  const result = execSync(
    `curl -s -X POST -H "Content-Type: application/json" -d '${JSON.stringify({
      query: testQuery,
    }).replace(/'/g, "'\\''")}' http://localhost:8000/___graphql`,
    { encoding: "utf8" }
  )

  const data = JSON.parse(result)

  if (data.errors) {
    console.log("GraphQL Errors:")
    data.errors.forEach((error) => {
      console.log(`- ${error.message}`)
      if (error.locations) {
        error.locations.forEach((loc) => {
          console.log(`  at line ${loc.line}, column ${loc.column}`)
        })
      }
    })
  }

  if (data.data) {
    console.log("Available Contentful Data:")
    console.log("==========================")

    if (data.data.contentfulHomepage) {
      console.log(
        "Homepage:",
        JSON.stringify(data.data.contentfulHomepage, null, 2)
      )
    }

    if (data.data.allContentfulHomepageHero?.nodes?.length) {
      console.log(
        "Heroes:",
        data.data.allContentfulHomepageHero.nodes.length,
        "found"
      )
      console.log(
        "Sample hero:",
        JSON.stringify(data.data.allContentfulHomepageHero.nodes[0], null, 2)
      )
    }

    if (data.data.allContentfulHomepageFeatureList?.nodes?.length) {
      console.log(
        "Feature Lists:",
        data.data.allContentfulHomepageFeatureList.nodes.length,
        "found"
      )
      console.log(
        "Sample feature list:",
        JSON.stringify(
          data.data.allContentfulHomepageFeatureList.nodes[0],
          null,
          2
        )
      )
    }

    if (data.data.allContentfulHomepageFeature?.nodes?.length) {
      console.log(
        "Features:",
        data.data.allContentfulHomepageFeature.nodes.length,
        "found"
      )
      console.log(
        "Sample feature:",
        JSON.stringify(data.data.allContentfulHomepageFeature.nodes[0], null, 2)
      )
    }

    if (data.data.allContentfulHomepageLogoList?.nodes?.length) {
      console.log(
        "Logo Lists:",
        data.data.allContentfulHomepageLogoList.nodes.length,
        "found"
      )
      console.log(
        "Sample logo list:",
        JSON.stringify(
          data.data.allContentfulHomepageLogoList.nodes[0],
          null,
          2
        )
      )
    }
  }
} catch (error) {
  console.error("Error querying GraphQL:", error.message)
}
