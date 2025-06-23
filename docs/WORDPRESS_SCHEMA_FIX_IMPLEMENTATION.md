# WordPress Schema Fix Implementation Guide

This guide details the technical implementation of our WordPress Schema Fix solution that enables the site to build properly when WordPress is bypassed (using `BYPASS_WORDPRESS=true`).

## 1. Enhanced Schema Customization

The most critical part of our solution is in `gatsby-node.js`, where we added comprehensive type definitions for the WordPress schema:

```javascript
// Inside createSchemaCustomization
if (process.env.BYPASS_WORDPRESS === "true") {
  console.log("📝 Creating WordPress mock types for BYPASS_WORDPRESS mode");
  actions.createTypes(/* GraphQL */ `
    # Core WordPress Types
    type WpMediaItem implements Node @dontInfer {
      id: ID!
      altText: String
      sourceUrl: String
      localFile: File @link
      gatsbyImage: JSON
    }
    
    type WpPost implements Node @dontInfer {
      id: ID!
      title: String
      excerpt: String
      content: String
      date: Date @dateformat
      slug: String
      uri: String
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdge
      categories: WpPostToCategoryConnection
      tags: WpPostToTagConnection
      author: WpNodeWithAuthorToUserConnectionEdge
      databaseId: Int
    }
    
    # Additional WordPress types...
    
    # Input types needed for filters
    input WpPostFilterInput {
      slug: StringQueryOperatorInput
      categories: WpPostToCategoryConnectionFilterInput
      title: StringQueryOperatorInput
      content: StringQueryOperatorInput
      excerpt: StringQueryOperatorInput
      date: DateQueryOperatorInput
    }
    
    # Other input types...
  `);
  
  // Add extensions for root query fields
  actions.createTypes(/* GraphQL */ `
    extend type Query {
      wpPage(id: String, slug: String): WpPage
      wpPost(id: String, slug: String): WpPost
      wpBeat(id: String, slug: String): WpBeat
      wpMix(id: String, slug: String): WpMix
      wpVideo(id: String, slug: String): WpVideo
      wpTutorial(id: String, slug: String): WpTutorial
      allWpCategory: WpCategoryConnection
      allWpTag: WpTagConnection
      allWpTutorial: WpTutorialConnection
    }
  `);
}
```

We also added enhanced resolvers for date formatting, featured images, and other fields:

```javascript
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Date: {
      formatString: {
        type: 'String',
        args: {
          formatString: { type: 'String', defaultValue: 'MMMM DD, YYYY' },
          locale: { type: 'String', defaultValue: 'en' },
        },
        resolve(source, { formatString, locale }, context, info) {
          const dateObj = new Date(source);
          
          // Simple formatter that mimics the "MMMM DD, YYYY" format
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          const month = months[dateObj.getMonth()];
          const day = dateObj.getDate();
          const year = dateObj.getFullYear();
          
          return `${month} ${day < 10 ? '0' + day : day}, ${year}`;
        },
      },
    },
    
    // WpPost resolver
    WpPost: {
      featuredImage: {
        resolve() {
          // Return a mock featuredImage structure in bypass mode
          return {
            node: {
              sourceUrl: '/static/images/demo-cover-1.jpg',
              altText: 'Demo featured image',
              localFile: {
                childImageSharp: {
                  gatsbyImageData: {}
                }
              }
            }
          };
        }
      },
      // Other field resolvers
    },
    
    // Additional resolvers
  }
  createResolvers(resolvers);
}
```

## 2. Fallback Data Module

Created a utility file `src/utils/fallback-data.js` to provide demo content:

```javascript
// Demo blog posts for frontend display
export const getDemoBlogPosts = (count = 3) => {
  const posts = [
    {
      id: 'demo-post-1',
      title: 'Getting Started with Music Production',
      excerpt: '<p>Learn the essential tools and techniques...</p>',
      slug: 'getting-started-music-production',
      date: new Date().toISOString(),
      // Other fields...
    },
    // More demo posts...
  ];
  
  return count ? posts.slice(0, count) : posts;
};

// Other utilities for categories, beats, etc...
```

## 3. Component Updates

Updated components like `src/pages/index.js` and `src/pages/blog.js` to use fallback data:

```javascript
// In index.js
export default function Homepage(props) {
  // Get WordPress posts or fallback to demo data
  const wpPosts = props.data.allWpPost?.nodes
  const wpBypassMode = !wpPosts
  const blogPosts = wpBypassMode 
    ? { nodes: getDemoBlogPosts(5) }
    : props.data.allWpPost
    
  // Use blogPosts in components...
}
```

Added a bypass mode indicator to pages:

```javascript
{wpBypassMode && (
  <Box 
    marginY={4} 
    paddingY={3} 
    style={{ 
      background: "#fff8e1", 
      borderRadius: "8px",
      border: "1px solid #ffecb3", 
      textAlign: "center"
    }}
  >
    <Text>
      <strong>WordPress Bypass Mode:</strong> Sample content is being displayed.
    </Text>
  </Box>
)}
```

## 4. GraphQL Query Updates

Updated GraphQL queries to use conditional directives:

```graphql
query BlogArchive {
  allWpPost(sort: { date: DESC }) @skip(if: $BYPASS_WORDPRESS) {
    nodes {
      id
      title
      excerpt
      slug
      # Other fields...
    }
  }
  
  allWpCategory @skip(if: $BYPASS_WORDPRESS) {
    nodes {
      id
      name
      slug
      count
    }
  }
}
```

## 5. Startup Flow

1. When `BYPASS_WORDPRESS=true` is set:
   - WordPress source plugin is not included
   - Mock schema types are created
   - Custom resolvers handle data formatting
   - Components use fallback data

2. When WordPress is available:
   - WordPress source plugin fetches real data
   - Components use the actual WordPress data
   - No mock types are needed

## Testing Process

1. Test local development:
   ```
   yarn develop:mock
   ```

2. Test Netlify build:
   ```
   BYPASS_WORDPRESS=true gatsby build
   ```

3. Verify that all pages render correctly:
   - Homepage with blog section
   - Blog archive and filtering
   - Individual blog posts
   - Music section with beats/mixes

## Future Enhancements

- Add more diverse demo content
- Improve search functionality in bypass mode
- Add conditional rendering for advanced WordPress features
- Implement client-side fallbacks for dynamic content
