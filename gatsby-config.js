require("dotenv").config()
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
module.exports = {
  siteMetadata: {
    siteUrl: "https://www.jeldonmusic.com",
    title: "Jeldon Music| Beats | Tutorials | Mix",
    author: `j-eldon`,
    description:
      "Jeldon Music — original beats, production tutorials, mixes, and videos. Explore instrumentals for lease, in-depth tutorials, and live DJ mixes from producer and audio engineer J. Eldon.",
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
    ...(process.env.BYPASS_WORDPRESS === "true"
      ? []
      : [
          {
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
              excludeFieldNames: [`blocksJSON`, `savePost`, `proxy`],
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
            },
          },
        ]),
    // Shopify plugin (optional - only included if environment variables are properly configured)
    ...(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN &&
    process.env.GATSBY_MYSHOPIFY_URL &&
    process.env.GATSBY_MYSHOPIFY_URL !== "your-store-name.myshopify.com" &&
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN !== "your_admin_api_token_here" &&
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN.startsWith("shpat_")
      ? [
          {
            resolve: "gatsby-source-shopify",
            options: {
              password: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
              storeUrl: process.env.GATSBY_MYSHOPIFY_URL,
              downloadImages: true,
              shopifyConnections: ["collections"],
              typePrefix: "Shopify",
            },
          },
        ]
      : []),
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-transformer-sharp", // This transforms image files into usable nodes with fields like publicURL
    {
      resolve: `gatsby-plugin-i18n`,
      options: {
        langKeyDefault: `en`,
        useLangKeyLayout: false,
        prefixDefault: false,
        langs: [`en`, `es`], // Add more as needed (e.g., `ar` for Arabic)
        routes: {
          en: `/`,
          es: `/es`,
        },
      },
    },
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
        icons: [
          {
            src: "src/favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "src/favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    },
    // Google gtag — only included if a tracking ID is configured
    ...(process.env.GATSBY_GA_TRACKING_ID
      ? [
          {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              trackingIds: [process.env.GATSBY_GA_TRACKING_ID],
              pluginConfig: {
                head: true,
                respectDNT: true,
                exclude: ["/preview/**", "/do-not-track/me/too/"],
              },
            },
          },
        ]
      : []),
    // GDPR cookies — only included if at least one tracking ID/pixel is configured
    ...(process.env.GATSBY_GA_TRACKING_ID ||
    process.env.GATSBY_GA_TAG_MANAGER_TRACKING_ID ||
    process.env.GATSBY_FACEBOOK_PIXEL_ID
      ? [
          {
            resolve: `gatsby-plugin-gdpr-cookies`,
            options: {
              googleAnalytics: {
                trackingId: process.env.GATSBY_GA_TRACKING_ID,
                cookieName: "gatsby-gdpr-google-analytics",
                anonymize: true,
                allowAdFeatures: false,
              },
              googleTagManager: {
                trackingId: process.env.GATSBY_GA_TAG_MANAGER_TRACKING_ID,
                cookieName: "gatsby-gdpr-google-tagmanager",
                dataLayerName: "dataLayer",
              },
              facebookPixel: {
                pixelId: process.env.GATSBY_FACEBOOK_PIXEL_ID,
                cookieName: "gatsby-gdpr-facebook-pixel",
              },
              tikTokPixel: {
                pixelId: process.env.GATSBY_GA_TIKTOK_PIXEL_ID,
                cookieName: "gatsby-gdpr-tiktok-pixel",
              },
              linkedin: {
                trackingId: process.env.GATSBY_LINKEDIN_TRACKING_ID,
                cookieName: "gatsby-gdpr-linked-in",
              },
              environments: ["production", "development"],
            },
          },
        ]
      : []),
  ],
}
