require("dotenv").config()
module.exports = {
  siteMetadata: {
    siteUrl: "https://www.jeldonmusic.com",
    title: "Jeldon Music| Beats | Tutorials | Mix",
    author: `j-eldon`,
    description: "beats, tutorials",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    // Add another source-filesystem entry for audio files
    {
      resolve: "gatsby-source-filesystem", 
      options: {
        name: "audio",
        path: `${__dirname}/static/audio`,
      },
    },
    {
      resolve: "gatsby-source-contentful",
      options: {
        downloadLocal: true,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST,
      },
    },
    // Only include WordPress source if BYPASS_WORDPRESS is not set to true
    ...(process.env.BYPASS_WORDPRESS === "true" ? [] : [{
      resolve: "gatsby-source-wordpress",
      options: {
        url: process.env.WPGRAPHQL_URL,
        verbose: process.env.NODE_ENV === "development",
        develop: {
          hardCacheMediaFiles: true,
          nodeUpdateInterval: 5000,
        },
        production: {
          hardCacheMediaFiles: false,
        },
        excludeFieldNames: [`blocksJSON`, `savePost`],
        type: {
          MediaItem: {
            localFile: {
              requestConcurrency: 50,
              maxFileSizeBytes: 15728640, // 15Mb
            },
          },
        },
        html: {
          useGatsbyImage: true,
          imageMaxWidth: 1024,
          fallbackImageMaxWidth: 800,
        },
        schema: {
          timeout: 60000, // Increased timeout to 60 seconds
          perPage: 20, // Reduced per page to lower resource usage
        },
        auth: {
          htaccess: {
            username: process.env.WP_USERNAME,
            password: process.env.WP_PASSWORD,
          },
        },
      }
    }]),
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-transformer-sharp", // This transforms image files into usable nodes with fields like publicURL
    "gatsby-plugin-vanilla-extract",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Jeldon Music | Beats | Tutorials",
        short_name: "jeldon",
        start_url: "/",
        background_color: "#ffe491",
        theme_color: "#004ca3",
        icon: "src/favicon.png",
      },
    },



  ],
}