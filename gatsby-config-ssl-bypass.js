require("dotenv").config()

// Check if we should bypass WordPress due to SSL issues
const bypassWordPress = process.env.BYPASS_WORDPRESS === 'true' || process.env.NODE_ENV === 'production'

const wordPressConfig = {
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
      timeout: 30000,
      perPage: 100,
    },
    auth: {
      htaccess: {
        username: process.env.WP_USERNAME,
        password: process.env.WP_PASSWORD,
      },
    },
  }
}

module.exports = {
  siteMetadata: {
    siteUrl: "https://www.jeldonmusic.com",
    title: "Jeldon Music| Beats | Tutorials | Mix",
    author: `j-eldon`,
    description: "beats, tutorials",
  },
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        downloadLocal: true,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST,
      },
    },
    // Conditionally include WordPress source
    ...(bypassWordPress ? [] : [wordPressConfig]),
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-transformer-sharp",
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
