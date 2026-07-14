const { documentToHtmlString } = require("@contentful/rich-text-html-renderer")
const { getGatsbyImageResolver } = require("gatsby-plugin-image/graphql-utils")

exports.createSchemaCustomization = async ({ actions }) => {
  const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

  // Defensive GraphQL types for optional WordPress content types.
  // These use `JSON` nodes so queries like `allWpBeat`/`allWpMix` still
  // exist on the schema even if the WP source plugin doesn't expose them yet.
  // This prevents build-time "Cannot query field 'allWpBeat' on type 'Query'" errors.
  actions.createTypes(/* GraphQL */ `
    type WpBeatConnection {
      nodes: [WpBeat]
    }
    type WpMixConnection {
      nodes: [WpMix]
    }
    type WpVideoConnection {
      nodes: [WpVideo]
    }
    # Minimal connection type for featured image links used by templates
    type WpNodeWithFeaturedImageToMediaItemConnectionEdgeType implements WpOneToOneConnectionType & WpEdgeType & WpMediaItemConnectionEdgeType {
      node: WpMediaItem!
    }
    type WpTutorial implements Node {
      id: ID!
      title: String
      slug: String
      content: String
      date: Date
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
      formattedDate: String
    }

    type WpTutorialAcfTutorials {
      videoUrl: String
      difficulty: String
      duration: String
      topic: String
      software: String
      tags: [String]
    }

    # Minimal placeholders for optional WordPress types
    type WpBeat implements Node {
      id: ID!
      title: String
      slug: String
      content: String
      date: Date
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
      formattedDate: String
    }

    type WpMix implements Node {
      id: ID!
      title: String
      slug: String
      content: String
      date: Date
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
      formattedDate: String
    }

    type WpVideo implements Node {
      id: ID!
      title: String
      slug: String
      excerpt: String
      content: String
      date: Date
      formattedDate: String
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
      videoDetails: WpContentNode_Videodetails
    }

    type WpContentNode_Videodetails {
      videoViews: String
      videoDuration: String
      videoPublishedAt: Date
      youtubeUrl: String
      youtubeVideoId: String
    }

    type WpPost implements Node {
      id: ID!
      title: String
      slug: String
      excerpt: String
      content: String
      date: Date
      formattedDate: String
      featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
      seo: WpSEOType
    }

    type WpSEOType {
      title: String
      metaDesc: String
      canonical: String
      opengraphTitle: String
      opengraphDescription: String
      opengraphImage: WpSEOImage
      twitterTitle: String
      twitterDescription: String
      twitterImage: WpSEOImage
    }

    type WpSEOImage {
      altText: String
      sourceUrl: String
      localFile: File @link
    }

    type WpTutorialConnection {
      nodes: [WpTutorial]
    }

    extend type Query {
      allWpBeat: WpBeatConnection
      allWpMix: WpMixConnection
      allWpVideo: WpVideoConnection
      allWpTutorial: WpTutorialConnection
    }
  `)

  actions.createTypes(/* GraphQL */ `
    extend type Query {
      layout: ContentfulLayout
    }
  `)

  actions.createFieldExtension({
    name: "blocktype",
    extend(options) {
      return {
        resolve(source) {
          if (source.internal.type.startsWith("Contentful")) {
            return source.internal.type.replace("Contentful", "")
          }
          return source.internal.type.replace("Wp", "")
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "imageUrl",
    extend(options) {
      const schemaRE = /^\/\//
      const addURLSchema = (str) => {
        if (schemaRE.test(str)) return `https:${str}`
        return str
      }
      return {
        resolve(source) {
          return addURLSchema(source.file.url)
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "navItemType",
    args: {
      name: {
        type: "String!",
        defaultValue: "Link",
      },
    },
    extend(options) {
      return {
        resolve() {
          switch (options.name) {
            case "Group":
              return "Group"
            default:
              return "Link"
          }
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "richText",
    extend(options) {
      return {
        resolve(source, args, context, info) {
          const body = source.body
          const doc = JSON.parse(body.raw)
          const html = documentToHtmlString(doc)
          return html
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "imagePassthroughArgs",
    extend(options) {
      const { args } = getGatsbyImageResolver()
      return {
        args,
      }
    },
  })

  actions.createFieldExtension({
    name: "linkField",
    args: {
      from: {
        type: "String!",
      },
    },
    extend(options) {
      return {
        resolve(source) {
          if (source[options.from]) {
            return source[options.from]
          }
          return null
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "navItem",
    args: {
      from: {
        type: "String!",
      },
    },
    extend(options) {
      return {
        resolve(source) {
          return (
            (options && options.from && source[options.from]) ||
            source.href ||
            source.url ||
            null
          )
        },
      }
    },
  })

  // Abstract interfaces - simplified (removed Beats and About interfaces)
  actions.createTypes(/* GraphQL */ `
    interface HomepageBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface HomepageLink implements Node {
      id: ID!
      href: String
      text: String
    }

    interface HeaderNavItem implements Node {
      id: ID!
      navItemType: String
      href: String
      text: String
      name: String
      description: String
      submenu: [HeaderNavItem]
    }

    interface NavItem implements Node & HeaderNavItem {
      id: ID!
      navItemType: String
      href: String
      text: String
      name: String
      description: String
      submenu: [HeaderNavItem]
      icon: HomepageImage
    }

    interface NavItemGroup implements Node & HeaderNavItem {
      id: ID!
      navItemType: String
      href: String
      text: String
      name: String
      description: String
      submenu: [HeaderNavItem]
      navItems: [NavItem]
    }

    interface HomepageImage implements Node {
      id: ID!
      alt: String
      title: String
      description: String
      gatsbyImageData: GatsbyImageData @imagePassthroughArgs
      url: String
    }

    interface HomepageHero implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      subhead: String
      image: HomepageImage
      text: String
      links: [HomepageLink]
    }

    interface BlogFeature implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      title: String
      excerpt: String
      uri: String
      date: Date
    }

    interface HomepageFeature implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      text: String
      image: HomepageImage
      links: [HomepageLink]
    }

    interface HomepageFeatureList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      text: String
      content: [HomepageFeature]
    }

    interface HomepageCta implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      text: String
      image: HomepageImage
      links: [HomepageLink]
    }

    interface HomepageLogo implements Node {
      id: ID!
      image: HomepageImage
      alt: String
      link: String
    }

    interface HomepageLogoList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      name: String
      text: String
      logos: [HomepageLogo]
    }

    interface HomepageTestimonial implements Node {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage
    }

    interface HomepageTestimonialList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      content: [HomepageTestimonial]
    }

    interface HomepageBenefit implements Node {
      id: ID!
      heading: String
      text: String
      image: HomepageImage
    }

    interface HomepageBenefitList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      text: String
      content: [HomepageBenefit]
    }

    interface HomepageStat implements Node {
      id: ID!
      value: String
      label: String
    }

    interface HomepageStatList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      content: [HomepageStat]
    }

    interface HomepageProduct implements Node {
      id: ID!
      heading: String
      text: String
      image: HomepageImage
      links: [HomepageLink]
    }

    interface HomepageProductList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      text: String
      content: [HomepageProduct]
    }

    interface Homepage implements Node {
      id: ID!
      title: String
      description: String
      image: HomepageImage
      content: [HomepageBlock]
    }

    interface LayoutHeader implements Node {
      id: ID!
      navItems: [HeaderNavItem]
      cta: HomepageLink
    }

    enum SocialService {
      TWITTER
      FACEBOOK
      INSTAGRAM
      YOUTUBE
      LINKEDIN
      GITHUB
      DISCORD
      TWITCH
      SOUNDCLOUD
    }

    interface SocialLink implements Node {
      id: ID!
      username: String!
      service: SocialService!
    }

    interface LayoutFooter implements Node {
      id: ID!
      links: [HomepageLink]
      meta: [HomepageLink]
      socialLinks: [SocialLink]
      copyright: String
    }

    interface Layout implements Node {
      id: ID!
      header: LayoutHeader
      footer: LayoutFooter
    }

    interface Page implements Node {
      id: ID!
      slug: String!
      title: String
      description: String
      image: HomepageImage
      html: String!
    }
  `)

  // CMS-specific types for Homepage - simplified (removed Beats types)
  actions.createTypes(/* GraphQL */ `
    type ContentfulHomepageLink implements Node & HomepageLink @dontInfer {
      id: ID!
      href: String
      text: String
    }

    type ContentfulNavItem implements Node & NavItem & HeaderNavItem
      @dontInfer {
      id: ID!
      navItemType: String @navItemType(name: "Link")
      href: String @navItem(from: "href")
      text: String
      name: String
      description: String
      submenu: [HeaderNavItem]
      icon: HomepageImage @link(from: "icon___NODE")
    }

    type ContentfulNavItemGroup implements Node & NavItemGroup & HeaderNavItem
      @dontInfer {
      id: ID!
      navItemType: String @navItemType(name: "Group")
      name: String
      navItems: [NavItem] @link(from: "navItems___NODE")
      href: String
      text: String
      description: String
      submenu: [HeaderNavItem]
    }

    type ContentfulAsset implements Node & HomepageImage {
      id: ID!
      alt: String @proxy(from: "title")
      gatsbyImageData: GatsbyImageData
      url: String @imageUrl
      file: JSON
      title: String
      description: String
    }

    type ContentfulHomepageHero implements Node & HomepageHero & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      subhead: String
      image: HomepageImage @link(from: "image___NODE")
      text: String
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageFeature implements Node & HomepageBlock & HomepageFeature
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageFeatureList implements Node & HomepageBlock & HomepageFeatureList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      content: [HomepageFeature] @link(from: "content___NODE")
    }

    type ContentfulHomepageCta implements Node & HomepageBlock & HomepageCta
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageLogo implements Node & HomepageLogo @dontInfer {
      id: ID!
      image: HomepageImage @link(from: "image___NODE")
      alt: String
      link: String
    }

    type ContentfulHomepageLogoList implements Node & HomepageBlock & HomepageLogoList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      name: String
      text: String
      logos: [HomepageLogo] @link(from: "logos___NODE")
    }

    type ContentfulHomepageTestimonial implements Node & HomepageTestimonial
      @dontInfer {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage @link(from: "avatar___NODE")
    }

    type ContentfulHomepageTestimonialList implements Node & HomepageBlock & HomepageTestimonialList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      content: [HomepageTestimonial] @link(from: "content___NODE")
    }

    type ContentfulHomepageBenefit implements Node & HomepageBenefit
      @dontInfer {
      id: ID!
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
    }

    type ContentfulHomepageBenefitList implements Node & HomepageBlock & HomepageBenefitList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      text: String
      content: [HomepageBenefit] @link(from: "content___NODE")
    }

    type ContentfulHomepageStat implements Node & HomepageStat @dontInfer {
      id: ID!
      value: String
      label: String
      heading: String
    }

    type ContentfulHomepageStatList implements Node & HomepageBlock & HomepageStatList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      icon: HomepageImage @link(from: "icon___NODE")
      content: [HomepageStat] @link(from: "content___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageProduct implements Node & HomepageProduct
      @dontInfer {
      id: ID!
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageProductList implements Node & HomepageProductList & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      text: String
      content: [HomepageProduct] @link(from: "content___NODE")
    }

    type ContentfulHomepage implements Node & Homepage @dontInfer {
      id: ID!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      content: [HomepageBlock] @link(from: "content___NODE")
    }

    type ContentfulBlogFeature implements Node & BlogFeature & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      title: String
      excerpt: String
      uri: String
      date: Date
    }
  `)

  // Layout types
  actions.createTypes(/* GraphQL */ `
    type ContentfulLayoutHeader implements Node & LayoutHeader @dontInfer {
      id: ID!
      navItems: [HeaderNavItem] @link(from: "navItems___NODE")
      cta: HomepageLink @link(from: "cta___NODE")
    }

    type ContentfulSocialLink implements Node & SocialLink @dontInfer {
      id: ID!
      username: String!
      service: SocialService!
    }

    type ContentfulLayoutFooter implements Node & LayoutFooter @dontInfer {
      id: ID!
      links: [HomepageLink] @link(from: "links___NODE")
      meta: [HomepageLink] @link(from: "meta___NODE")
      socialLinks: [SocialLink] @link(from: "socialLinks___NODE")
      copyright: String
    }

    type ContentfulLayout implements Node & Layout @dontInfer {
      id: ID!
      header: LayoutHeader @link(from: "header___NODE")
      footer: LayoutFooter @link(from: "footer___NODE")
    }
  `)

  // Page types
  actions.createTypes(/* GraphQL */ `
    type ContentfulPage implements Node & Page {
      id: ID!
      slug: String!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      html: String! @richText
    }
  `)

  // Blog content types (Contentful-backed)
  actions.createTypes(/* GraphQL */ `
    type ContentfulBlogCategory implements Node @dontInfer {
      id: ID!
      name: String
      slug: String
    }

    type ContentfulBlogTag implements Node @dontInfer {
      id: ID!
      name: String
      slug: String
    }

    type ContentfulBlogPost implements Node @dontInfer {
      id: ID!
      title: String
      slug: String!
      excerpt: String
      content: String @richText
      publishDate: Date @dateformat
      author: String
      featuredImage: ContentfulAsset @link(from: "featuredImage___NODE")
      categories: [ContentfulBlogCategory] @link(from: "categories___NODE")
      tags: [ContentfulBlogTag] @link(from: "tags___NODE")
      seoTitle: String
      seoDescription: String
    }
  `)

  // Video content types (Contentful-backed, separate from Blog)
  actions.createTypes(/* GraphQL */ `
    type ContentfulVideoCategory implements Node @dontInfer {
      id: ID!
      name: String
      slug: String
      description: String
    }

    type ContentfulVideoTag implements Node @dontInfer {
      id: ID!
      name: String
      slug: String
    }

    type ContentfulVideoPost implements Node @dontInfer {
      id: ID!
      title: String
      slug: String!
      excerpt: String
      body: String @richText
      publishDate: Date @dateformat
      author: String
      featuredImage: ContentfulAsset @link(from: "featuredImage___NODE")
      categories: [ContentfulVideoCategory] @link(from: "categories___NODE")
      tags: [ContentfulVideoTag] @link(from: "tags___NODE")
      youtubeVideoId: String
      duration: String
      videoViews: Int
    }
  `)

  // WordPress-specific types
  actions.createTypes(/* GraphQL */ `
    type WpPost implements Node & BlogFeature & HomepageBlock @dontInfer {
      id: ID!
      blocktype: String @blocktype
      title: String
      excerpt: String
      uri: String
      date: Date
    }
  `)


  // Always create these types so queries work even when Contentful has no blog posts
  // These act as fallbacks that merge with Contentful's generated types
  actions.createTypes(`
    # Fallback Contentful types for when no blog posts exist yet
    type ContentfulBlogPost implements Node @dontInfer {
        id: ID!
        title: String
        slug: String!
        excerpt: String
        content: String
        publishDate: Date @dateformat
        author: String
        featuredImage: ContentfulAsset
        categories: [ContentfulBlogCategory]
        tags: [ContentfulBlogTag]
        seoTitle: String
        seoDescription: String
      }

      type ContentfulBlogPostConnection {
        nodes: [ContentfulBlogPost]
        totalCount: Int!
      }

      type ContentfulBlogCategory implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
      }

      type ContentfulBlogTag implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
      }

      type ContentfulVideoPost implements Node @dontInfer {
        id: ID!
        title: String
        slug: String!
        excerpt: String
        body: String
        publishDate: Date @dateformat
        author: String
        featuredImage: ContentfulAsset
        categories: [ContentfulVideoCategory]
        tags: [ContentfulVideoTag]
        youtubeVideoId: String
        duration: String
        videoViews: Int
      }

      type ContentfulVideoPostConnection {
        nodes: [ContentfulVideoPost]
        totalCount: Int!
      }

      type ContentfulVideoCategory implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
        description: String
      }

      type ContentfulVideoTag implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
      }

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
        formattedDate: String
        slug: String
        uri: String
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        categories: WpPostToCategoryConnection
        tags: WpPostToTagConnection
        author: WpNodeWithAuthorToUserConnectionEdge
        databaseId: Int
        seo: WpSEOType
      }

      type WpPage implements Node @dontInfer {
        id: ID!
        title: String
        content: String
        slug: String
        uri: String
        date: Date @dateformat
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        databaseId: Int
        seo: WpSEOType
      }

      type WpBeat implements Node @dontInfer {
        id: ID!
        title: String
        slug: String
        content: String
        date: Date @dateformat
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        acfBeats: WpBeatAcfBeats
        beatFields: WpBeatAcfBeats
        databaseId: Int
        seo: WpSEOType
      }

      type WpBeatAcfBeats @dontInfer {
        audioFile: WpMediaItem
        price: Float
        genre: String
        bpm: Int
        audioUrl: String
        soundcloudUrl: String
        purchaseUrl: String
        keySignature: String
        musicalKey: String
      }

      type WpMix implements Node @dontInfer {
        id: ID!
        title: String
        slug: String
        content: String
        date: Date @dateformat
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        acfMixes: WpMixAcfMixes
        mixFields: WpMixAcfMixes
        databaseId: Int
      }

      type WpMixAcfMixes {
        audioFile: WpMediaItem
        genre: String
        tracklist: String
        audioUrl: String
        soundcloudUrl: String
        duration: String
        mixDuration: String
        mixType: String
        recordingDate: Date @dateformat
        equipment: String
        featured: Boolean
        playCount: Int
      }

      type WpTutorial implements Node @dontInfer {
        id: ID!
        title: String
        slug: String
        content: String
        date: Date @dateformat
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        acfTutorials: WpTutorialAcfTutorials
        databaseId: Int
        seo: WpSEOType
      }

      type WpVideo implements Node @dontInfer {
        id: ID!
        title: String
        excerpt: String
        content: String
        date: Date @dateformat
        formattedDate: String
        slug: String
        uri: String
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        videoCategories: WpVideoToVideoCategoryConnection
        videoDetails: WpContentNode_Videodetails
        databaseId: Int
        seo: WpSEOType
      }

      type WpSEOImage {
        altText: String
        sourceUrl: String
        localFile: File @link
      }

      type WpNodeWithFeaturedImageToMediaItemConnectionEdgeType implements WpOneToOneConnectionType & WpEdgeType & WpMediaItemConnectionEdgeType {
        node: WpMediaItem!
      }

      type WpPostToCategoryConnection {
        nodes: [WpCategory]
      }

      type WpVideoToVideoCategoryConnection {
        nodes: [WpCategory]
      }

      type WpPostToTagConnection {
        nodes: [WpTag]
      }

      type WpNodeWithAuthorToUserConnectionEdge {
        node: WpUser
      }

      type WpUser implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
      }

      type WpCategory implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
        count: Int
      }

      type WpTag implements Node @dontInfer {
        id: ID!
        name: String
        slug: String
        count: Int
      }

      input WpPostFilter {
        slug: StringQueryOperatorInput
        date: DateQueryOperatorInput
        categories: WpPostToCategoryConnectionFilter
        title: StringQueryOperatorInput
        content: StringQueryOperatorInput
        excerpt: StringQueryOperatorInput
      }

      input WpCategoryFilter {
        id: StringQueryOperatorInput
        slug: StringQueryOperatorInput
        name: StringQueryOperatorInput
        count: IntQueryOperatorInput
      }

      input IntQueryOperatorInput {
        eq: Int
        ne: Int
        gt: Int
        gte: Int
        lt: Int
        lte: Int
        in: [Int]
        nin: [Int]
      }

      input WpTagFilter {
        slug: StringQueryOperatorInput
        name: StringQueryOperatorInput
      }

      input WpPostToCategoryConnectionFilter {
        nodes: WpCategoryFilterList
      }

      input WpCategoryFilterList {
        elemMatch: WpCategoryFilter
      }

      input StringQueryOperatorInput {
        eq: String
        ne: String
        in: [String]
        nin: String
        regex: String
        glob: String
      }

      input DateQueryOperatorInput {
        eq: Date
        ne: Date
        gt: Date
        gte: Date
        lt: Date
        lte: Date
        in: [Date]
        nin: [Date]
      }

      interface WpNode {
        id: ID!
      }

      interface WpContentNode {
        id: ID!
        date: Date @dateformat
        seo: WpSEOType
      }

      interface WpTermNode {
        id: ID!
        name: String
        slug: String
      }

      interface WpOneToOneConnectionType {
        node: Node
      }

      interface WpEdgeType {
        node: Node
      }

      interface WpMediaItemConnectionEdgeType {
        node: WpMediaItem
      }

      type WpPostConnection {
        nodes: [WpPost]
      }

      type WpCategoryConnection {
        nodes: [WpCategory]
      }

      type WpTagConnection {
        nodes: [WpTag]
      }

      type WpTutorialConnection {
        nodes: [WpTutorial]
      }

      type WpVideoConnection {
        nodes: [WpVideo]
      }

      type WpBeatConnection {
        nodes: [WpBeat]
      }

      type WpMixConnection {
        nodes: [WpMix]
      }

      type ContentfulAsset implements HomepageImage {
        id: ID!
        alt: String
        gatsbyImageData: GatsbyImageData
        url: String
      }

      extend type SitePage {
        slug: String
      }
    `)

    actions.createTypes(/* GraphQL */ `
      extend type Query {
        wpPage(id: String, slug: String): WpPage
        wpPost(id: String, slug: String): WpPost
        wpBeat(id: String, slug: String): WpBeat
        wpMix(id: String, slug: String): WpMix
        wpVideo(id: String, slug: String): WpVideo
        wpTutorial(id: String, slug: String): WpTutorial
        allWpPost(
          filter: WpPostFilter
          sort: WpPostSort
          limit: Int
        ): WpPostConnection
        allWpCategory(filter: WpCategoryFilter): WpCategoryConnection
        allWpTag(filter: WpTagFilter): WpTagConnection
        allWpTutorial: WpTutorialConnection
        allWpVideo: WpVideoConnection
        allWpBeat: WpBeatConnection
        allWpMix: WpMixConnection
        allPage: SitePageConnection
        layout: ContentfulLayout
      }
    `)
  }
}
