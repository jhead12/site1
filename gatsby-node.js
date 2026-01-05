const { documentToHtmlString } = require("@contentful/rich-text-html-renderer")
const { getGatsbyImageResolver } = require("gatsby-plugin-image/graphql-utils")
const webpackConfig = require("./webpack.config")

// Import webpack configuration to handle CSS chunk ordering issues
exports.onCreateWebpackConfig = webpackConfig.onCreateWebpackConfig

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
    # Only define the concrete type, not the interfaces (WordPress provides those)
    type WpNodeWithFeaturedImageToMediaItemConnectionEdgeType implements WpOneToOneConnectionType & WpEdgeType & WpMediaItemConnectionEdgeType {
      node: WpMediaItem!
    }
    # Minimal WpTutorial placeholder to avoid schema errors when the
    # remote WordPress instance does not expose the type. This mirrors
    # the fuller definition added in BYPASS_WORDPRESS mode but keeps
    # the schema valid in preview environments.
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

    # Minimal placeholders for optional WordPress types that may be absent
    # in preview environments. These keep the schema stable when the remote
    # WPGraphQL doesn't expose these nodes. Fields mirror those queried in
    # templates/components so extraction succeeds.
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
      videoDetails: VideoDetails
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
    }

    # Sort input types used in queries — include date so queries that sort
    # by date compile when WP types don't expose full schema in preview.
    # Note: do not declare custom types ending with FilterInput/SortInput —
    # Gatsby reserves those suffixes for internal schema generation. Sorting
    # will use whatever the source plugin exposes at runtime.
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
  // Ensure `layout` query exists in the schema in all modes so layout
  // static queries (header/footer) work regardless of BYPASS_WORDPRESS.
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

  // Fallback navItem field extension — some environments/plugins
  // may not register a specialized `@navItem` extension. Provide
  // a safe default so schema build doesn't fail when Contentful
  // types reference `@navItem(from: "...")`.
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
          // Prefer the explicit source field, then some common fallbacks
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

  // abstract interfaces
  actions.createTypes(/* GraphQL */ `
    interface HomepageBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface BeatsBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface HomepageLink implements Node {
      id: ID!
      href: String
      text: String
    }

    interface BeatsLink implements Node {
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

    interface BeatsImage implements Node {
      id: ID!
      alt: String
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

    interface BeatsHero implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      subhead: String
      image: BeatsImage
      text: String
      links: [BeatsLink]
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

    interface BeatsFeature implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      text: String
      image: BeatsImage
      links: [BeatsLink]
    }

    interface HomepageFeatureList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      text: String
      content: [HomepageFeature]
    }

    interface BeatsFeatureList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      text: String
      content: [BeatsFeature]
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

    interface BeatsCta implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      text: String
      image: BeatsImage
      links: [BeatsLink]
    }

    interface HomepageLogo implements Node {
      id: ID!
      image: HomepageImage
      alt: String
      link: String
    }

    interface BeatsLogo implements Node {
      id: ID!
      image: BeatsImage
      alt: String
    }

    interface HomepageLogoList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      name: String
      text: String
      logos: [HomepageLogo]
    }

    interface BeatsLogoList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      text: String
      logos: [BeatsLogo]
    }

    interface HomepageTestimonial implements Node {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage
    }

    interface BeatsTestimonial implements Node {
      id: ID!
      quote: String
      source: String
      avatar: BeatsImage
    }

    interface HomepageTestimonialList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      content: [HomepageTestimonial]
    }

    interface BeatsTestimonialList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      content: [BeatsTestimonial]
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

    interface BeatsBenefit implements Node {
      id: ID!
      heading: String
      text: String
      image: BeatsImage
    }

    interface BeatsBenefitList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      heading: String
      text: String
      content: [BeatsBenefit]
    }

    interface HomepageStat implements Node {
      id: ID!
      value: String
      label: String
    }

    interface BeatsStat implements Node {
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

    interface BeatsStatList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      heading: String
      content: [BeatsStat]
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

    interface BeatsProduct implements Node {
      id: ID!
      heading: String
      text: String
      image: BeatsImage
      links: [BeatsLink]
    }

    interface BeatsProductList implements Node & BeatsBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      text: String
      content: [BeatsProduct]
    }

    interface Beats implements Node {
      id: ID!
      title: String
      description: String
      image: BeatsImage
      content: [BeatsBlock]
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

    interface BlogPage implements Node {
      id: ID!
      title: String
      description: String
      image: HomepageImage
      content: [HomepageBlock]
    }

    interface BlogHero implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      text: String
      image: BeatsImage
    }

    interface Privacy implements Node {
      id: ID!
      blocktype: String
      heading: String
      text: String
    }

    interface Terms implements Node {
      id: ID!
      blocktype: String
      heading: String
      text: String
    }

    interface AboutPage implements Node {
      id: ID!
      title: String
      description: String
      image: HomepageImage
      content: [HomepageBlock]
    }

    interface AboutHero implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      text: String
      image: HomepageImage
    }

    interface AboutStat implements Node {
      id: ID!
      value: String
      label: String
    }

    interface AboutStatList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      content: [AboutStat]
    }

    interface AboutProfile implements Node {
      id: ID!
      image: HomepageImage
      name: String
      jobTitle: String
    }

    interface AboutLeadership implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      subhead: String
      content: [AboutProfile]
    }

    interface AboutLogoList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      links: [HomepageLink]
      logos: [HomepageLogo]
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

  // CMS-specific types for Homepage
  actions.createTypes(/* GraphQL */ `
    type ContentfulHomepageLink implements Node & HomepageLink @dontInfer {
      id: ID!
      href: String
      text: String
    }

    type ContentfulBeatsLink implements Node & BeatsLink @dontInfer {
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

    type ContentfulAsset implements Node & HomepageImage & BeatsImage {
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

    type ContentfulBeatsHero implements Node & BeatsHero & BeatsBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      subhead: String
      image: BeatsImage @link(from: "image___NODE")
      text: String
      links: [BeatsLink] @link(from: "links___NODE")
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

    type ContentfulBeatsFeature implements Node & BeatsBlock & BeatsFeature
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      text: String
      image: BeatsImage @link(from: "image___NODE")
      links: [BeatsLink] @link(from: "links___NODE")
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

    type ContentfulBeatsFeatureList implements Node & BeatsBlock & BeatsFeatureList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      content: [BeatsFeature] @link(from: "content___NODE")
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

    type ContentfulBeatsCta implements Node & BeatsBlock & BeatsCta @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      image: BeatsImage @link(from: "image___NODE")
      links: [BeatsLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageLogo implements Node & HomepageLogo @dontInfer {
      id: ID!
      image: HomepageImage @link(from: "image___NODE")
      alt: String
      link: String
    }

    type ContentfulBeatsLogo implements Node & BeatsLogo @dontInfer {
      id: ID!
      image: BeatsImage @link(from: "image___NODE")
      alt: String
    }

    type ContentfulHomepageLogoList implements Node & HomepageBlock & HomepageLogoList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      name: String
      text: String
      logos: [HomepageLogo] @link(from: "logos___NODE")
    }

    type ContentfulBeatsLogoList implements Node & BeatsBlock & BeatsLogoList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      text: String
      logos: [BeatsLogo] @link(from: "logos___NODE")
    }

    type ContentfulHomepageTestimonial implements Node & HomepageTestimonial
      @dontInfer {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage @link(from: "avatar___NODE")
    }

    type ContentfulBeatsTestimonial implements Node & BeatsTestimonial
      @dontInfer {
      id: ID!
      quote: String
      source: String
      avatar: BeatsImage @link(from: "avatar___NODE")
    }

    type ContentfulHomepageTestimonialList implements Node & HomepageBlock & HomepageTestimonialList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      content: [HomepageTestimonial] @link(from: "content___NODE")
    }

    type ContentfulBeatsTestimonialList implements Node & BeatsBlock & BeatsTestimonialList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      content: [BeatsTestimonial] @link(from: "content___NODE")
    }

    type ContentfulHomepageBenefit implements Node & HomepageBenefit
      @dontInfer {
      id: ID!
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
    }

    type ContentfulBeatsBenefit implements Node & BeatsBenefit @dontInfer {
      id: ID!
      heading: String
      text: String
      image: BeatsImage @link(from: "image___NODE")
    }

    type ContentfulHomepageBenefitList implements Node & HomepageBlock & HomepageBenefitList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      text: String
      content: [HomepageBenefit] @link(from: "content___NODE")
    }

    type ContentfulBeatsBenefitList implements Node & BeatsBlock & BeatsBenefitList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      text: String
      content: [BeatsBenefit] @link(from: "content___NODE")
    }

    type ContentfulHomepageStat implements Node & HomepageStat @dontInfer {
      id: ID!
      value: String
      label: String
      heading: String
    }

    type ContentfulBeatsStat implements Node & BeatsStat @dontInfer {
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

    type ContentfulBeatsStatList implements Node & BeatsBlock & BeatsStatList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      text: String
      image: BeatsImage @link(from: "image___NODE")
      icon: BeatsImage @link(from: "icon___NODE")
      content: [BeatsStat] @link(from: "content___NODE")
      links: [BeatsLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageProduct implements Node & HomepageProduct
      @dontInfer {
      id: ID!
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulBeatsProduct implements Node & BeatsProduct @dontInfer {
      id: ID!
      heading: String
      text: String
      image: BeatsImage @link(from: "image___NODE")
      links: [BeatsLink] @link(from: "links___NODE")
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

    type ContentfulBeatsProductList implements Node & BeatsProductList & BeatsBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      kicker: String
      text: String
      content: [BeatsProduct] @link(from: "content___NODE")
    }

    type ContentfulHomepage implements Node & Homepage @dontInfer {
      id: ID!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      content: [HomepageBlock] @link(from: "content___NODE")
    }

    type ContentfulBeats implements Node & Beats @dontInfer {
      id: ID!
      title: String
      description: String
      image: BeatsImage @link(from: "image___NODE")
      content: [BeatsBlock] @link(from: "content___NODE")
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

  // CMS specific types for About page
  actions.createTypes(/* GraphQL */ `
    type ContentfulAboutHero implements Node & AboutHero & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
    }

    type ContentfulAboutStat implements Node & AboutStat @dontInfer {
      id: ID!
      value: String
      label: String
    }

    type ContentfulAboutStatList implements Node & AboutStatList & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      content: [AboutStat] @link(from: "content___NODE")
    }

    type ContentfulAboutProfile implements Node & AboutProfile @dontInfer {
      id: ID!
      image: HomepageImage @link(from: "image___NODE")
      name: String
      jobTitle: String
    }

    type ContentfulAboutLeadership implements Node & AboutLeadership & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      subhead: String
      content: [AboutProfile] @link(from: "content___NODE")
    }

    type ContentfulAboutLogoList implements Node & AboutLogoList & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String
      links: [HomepageLink] @link(from: "links___NODE")
      logos: [HomepageLogo] @link(from: "logos___NODE")
    }

    type ContentfulAboutPage implements Node & AboutPage @dontInfer {
      id: ID!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      content: [HomepageBlock] @link(from: "content___NODE")
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

  // Define the WordPress-specific types
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

  // Note: VideoDetails types are auto-generated by WPGraphQL from ACF field groups.
  // Do not manually define them here as it causes interface/type conflicts.
  // ACF creates: GraphQL Type "VideoDetails" with interface "VideoDetails_Fields"

  // Create comprehensive WordPress mock types when BYPASS_WORDPRESS is true
  if (process.env.BYPASS_WORDPRESS === "true") {
    console.log("📝 Creating WordPress mock types for BYPASS_WORDPRESS mode")
    actions.createTypes(`
      
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
        formattedDate: String
        slug: String
        uri: String
        featuredImage: WpNodeWithFeaturedImageToMediaItemConnectionEdgeType
        categories: WpPostToCategoryConnection
        tags: WpPostToTagConnection
        author: WpNodeWithAuthorToUserConnectionEdge
        databaseId: Int
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
      }

      # Music Content Types
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

      # We need to define this type carefully - it must exist in both modes
      # In WordPress mode, these fields come from ACF
      # In bypass mode, they come from our mock resolvers
      type WpMixAcfMixes {
        audioFile: WpMediaItem
        genre: String
        tracklist: String
        audioUrl: String
        soundcloudUrl: String
        duration: String
        spotifyUrl: String
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
      }

      type WpTutorialAcfTutorials {
        videoUrl: String
        difficulty: String
        duration: String
        topic: String
        software: String
        tags: [String]
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
        databaseId: Int
      }
      
      # Minimal connection type for featured image in BYPASS_WORDPRESS mode
      # Don't redefine WordPress interfaces - just the concrete type
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
      
      # Input types needed for filtering in queries
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
        nin: [String]
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
      
      # Add interfaces that Gatsby needs for querying
      interface WpNode {
        id: ID!
      }
      
      interface WpContentNode {
        id: ID!
        date: Date @dateformat
      }
      
      interface WpTermNode {
        id: ID!
        name: String
        slug: String
      }
      
      # Add connections for collection queries
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

      # Add ContentfulAsset type implementing HomepageImage
      type ContentfulAsset implements HomepageImage {
        id: ID!
        alt: String
        gatsbyImageData: GatsbyImageData
        url: String
      }

      # Add SitePage type extension with slug field 
      extend type SitePage {
        slug: String
      }
    `)

    // Add type extensions for query root fields
    actions.createTypes(/* GraphQL */ `
      input WpPostSort {
        fields: [String]
        order: SortOrderEnum
      }

      enum SortOrderEnum {
        ASC
        DESC
      }

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

// Add resolvers for fields that can't be handled by gatsby-transformer-sharp
exports.createResolvers = ({ createResolvers }) => {
  // Always add resolvers, but conditionally return real or mock data
  const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

  // Log mode for debugging
  console.log(
    bypassWordpress
      ? "📝 Adding mock data resolvers for BYPASS_WORDPRESS mode"
      : "📝 Adding essential resolvers for WordPress mode"
  )

  // Create a base resolver set that works in both modes
  const baseResolvers = {
    // Add field resolvers for navigation items
    ContentfulNavItem: {
      name: {
        resolve: (source) => source.text || source.name || "",
      },
      submenu: {
        resolve: () => [],
      },
    },
    ContentfulNavItemGroup: {
      href: {
        resolve: () => "#",
      },
      text: {
        resolve: (source) => source.name || "",
      },
      description: {
        resolve: () => "",
      },
      submenu: {
        resolve: (source) => source.navItems || [],
      },
    },

    // The Query type resolvers (like allPage) work in both modes
    Query: {
      // allPage resolver for both bypass mode and live mode
      allPage: {
        resolve(source, args, context) {
          if (bypassWordpress) {
            // Return mock pages in bypass mode
            return {
              nodes: [
                { id: "page-1", path: "/", slug: "home", title: "Home" },
                { id: "page-2", path: "/about", slug: "about", title: "About" },
                {
                  id: "page-3",
                  path: "/contact",
                  slug: "contact",
                  title: "Contact",
                },
              ],
            }
          } else {
            // In live mode, delegate to regular SitePage resolver
            return context.nodeModel.getAllNodes({ type: "SitePage" })
          }
        },
      },

      // Add layout resolver for both modes
      layout: {
        resolve(source, args, context) {
          // Prefer an actual ContentfulLayout node if available so the
          // abstract Layout interface resolves to a concrete type.
          try {
            const layouts =
              context.nodeModel.getAllNodes({ type: "ContentfulLayout" }) || []
            if (layouts.length > 0) return layouts[0]
          } catch (e) {
            /* ignore and fall back to mock object below */
          }

          return {
            __typename: "ContentfulLayout",
            header: {
              __typename: "ContentfulLayoutHeader",
              id: "header-1",
              navItems: [
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-1",
                  navItemType: "LINK",
                  text: "Home",
                  url: "/",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-2",
                  navItemType: "LINK",
                  text: "Blog",
                  url: "/blog",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-3",
                  navItemType: "LINK",
                  text: "Music",
                  url: "/music",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-4",
                  navItemType: "LINK",
                  text: "Videos",
                  url: "/videos",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-5",
                  navItemType: "LINK",
                  text: "Contact",
                  url: "/contact",
                },
              ],
            },
            footer: {
              __typename: "ContentfulLayoutFooter",
              id: "footer-1",
              links: [
                {
                  __typename: "ContentfulNavItem",
                  id: "social-1",
                  navItemType: "SOCIAL",
                  text: "YouTube",
                  url: "https://youtube.com",
                  username: "jeldonmusic",
                  service: "youtube",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "social-2",
                  navItemType: "SOCIAL",
                  text: "Instagram",
                  url: "https://instagram.com",
                  username: "jeldonmusic",
                  service: "instagram",
                },
              ],
            },
          }
        },
      },
    },

    // File resolvers work in both modes
    File: {
      publicURL: {
        resolve(source) {
          return source.publicURL || source.url || "/static/fallback-file.pdf"
        },
      },
    },

    // ContentfulAsset works in both modes
    ContentfulAsset: {
      id: {
        type: "ID!",
        resolve: (source) =>
          source.id ||
          `mock-contentful-asset-${Math.random().toString(36).substring(2, 9)}`,
      },
      alt: {
        type: "String",
        resolve: (source) => source.alt || source.title || "Asset image",
      },
      gatsbyImageData: {
        type: "GatsbyImageData",
        resolve: (source) => {
          // Return mock GatsbyImageData structure if actual data is not available
          return (
            source.gatsbyImageData || {
              layout: "constrained",
              width: 800,
              height: 600,
              images: {
                sources: [],
                fallback: {
                  src: source.url || `/static/fallback-image.jpg`,
                  srcSet: "",
                  sizes: "",
                },
              },
            }
          )
        },
      },
      url: {
        type: "String",
        resolve: (source) =>
          source.url || source.file?.url || `/static/fallback-image.jpg`,
      },
    },
  }

  // Only add WordPress-specific resolvers in bypass mode
  if (bypassWordpress) {
    // Add all the WordPress mock resolvers
    const wpResolvers = {
      WpPost: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""

            const dateObj = new Date(source.date)
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]

            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()

            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo featured image",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        categories: {
          type: "WpPostToCategoryConnection",
          resolve() {
            // Return mock categories in bypass mode
            return {
              nodes: [
                { id: "cat-1", name: "Music", slug: "music" },
                { id: "cat-2", name: "Production", slug: "production" },
              ],
            }
          },
        },
        tags: {
          type: "WpPostToTagConnection",
          resolve() {
            return {
              nodes: [
                { id: "tag-1", name: "Tutorial", slug: "tutorial" },
                { id: "tag-2", name: "Tips", slug: "tips" },
              ],
            }
          },
        },
        author: {
          type: "WpPostToUserConnectionEdge",
          resolve() {
            return {
              node: {
                id: "author-1",
                name: "Jeldon",
                slug: "jeldon",
              },
            }
          },
        },
      },
      // Add WpVideo resolvers
      WpVideo: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""

            const dateObj = new Date(source.date)
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]

            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()

            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo video thumbnail",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        videoCategories: {
          type: "WpVideoToVideoCategoryConnection",
          resolve() {
            // Return mock categories in bypass mode
            return {
              nodes: [
                { id: "vcat-1", name: "Tutorials", slug: "tutorials" },
                {
                  id: "vcat-2",
                  name: "Behind the Scenes",
                  slug: "behind-the-scenes",
                },
              ],
            }
          },
        },
        videoDetails: {
          type: "VideoDetails",
          resolve() {
            return {
              videoViews: "12,345",
              videoDuration: "10:30",
              videoPublishedAt: new Date().toISOString(),
              youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              youtubeVideoId: "dQw4w9WgXcQ",
            }
          },
        },
      },
      // Enhance WpBeat resolvers
      WpBeat: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo beat cover",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        // Add mock acfBeats fields
        acfBeats: {
          type: "WpBeatAcfBeats",
          resolve() {
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-1.mp3",
                  url: "/static/audio/demo-track-1.mp3",
                },
              },
              price: 29.99,
              genre: "Hip-Hop",
              bpm: 95,
              audioUrl: "/static/audio/demo-track-1.mp3",
              soundcloudUrl: "#",
              keySignature: "C Minor",
              musicalKey: "C Minor",
            }
          },
        },
        beatFields: {
          type: "WpBeatAcfBeats",
          resolve(source) {
            // Simply pass through or delegate to the acfBeats resolver
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-1.mp3",
                  url: "/static/audio/demo-track-1.mp3",
                },
              },
              price: 29.99,
              genre: "Hip-Hop",
              bpm: 95,
              audioUrl: "/static/audio/demo-track-1.mp3",
              soundcloudUrl: "#",
              keySignature: "C Minor",
              musicalKey: "C Minor",
              purchaseUrl: "https://example.com/buy",
            }
          },
        },
      },
      // Enhance WpMix resolvers
      WpMix: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo mix cover",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        mixFields: {
          type: "WpMixAcfMixes",
          resolve(source) {
            // Only use this resolver in bypass mode
            const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

            if (!bypassWordpress && source.acfMixes) {
              // In WordPress mode, delegate to the actual ACF field
              return source.acfMixes
            }

            // In bypass mode or if acfMixes is missing, return mock data
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-2.mp3",
                  url: "/static/audio/demo-track-2.mp3",
                },
              },
              genre: "Hip-Hop",
              tracklist: "1. Track One\n2. Track Two\n3. Track Three",
              audioUrl: "/static/audio/demo-track-2.mp3",
              soundcloudUrl: "#",
              spotifyUrl: "https://spotify.com/track",
              mixDuration: "45:30",
              mixType: "DJ Mix",
            }
          },
        },
      },
    }

    // Merge the base resolvers with the WordPress resolvers
    const resolvers = { ...baseResolvers, ...wpResolvers }
    createResolvers(resolvers)
  } else {
    // In WordPress mode, only use the base resolvers to avoid conflicts
    createResolvers(baseResolvers)
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createSlice } = actions

  // Skip WordPress queries if BYPASS_WORDPRESS is true
  if (process.env.BYPASS_WORDPRESS === "true") {
    console.log(
      "WordPress data fetch bypassed by BYPASS_WORDPRESS environment variable"
    )
    // Slices will be created at the end of this function
    return
  }

  // Create WordPress pages
  let result
  try {
    result = await graphql(`
      {
        allWpPage {
          nodes {
            id
            slug
            title
            content
          }
        }
        allWpPost {
          nodes {
            id
            slug
            title
          }
        }
        allWpBeat {
          nodes {
            id
            slug
            title
          }
        }
        allWpTutorial {
          nodes {
            id
            slug
            title
          }
        }
        allWpMix {
          nodes {
            id
            slug
            title
          }
        }
        allWpVideo {
          nodes {
            id
            slug
            title
          }
        }
      }
    `)

    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      console.warn("Continuing build despite GraphQL errors")
    }
  } catch (error) {
    console.error("Error fetching WordPress data:", error)
    console.warn("Continuing build despite fetch error")
    // Create empty result object to allow the build to continue
    result = { data: {} }
  }

  // Safely access data with fallbacks
  const pages = result.data?.allWpPage?.nodes || []
  const posts = result.data?.allWpPost?.nodes || []
  const beats = result.data?.allWpBeat?.nodes || []
  const tutorials = result.data?.allWpTutorial?.nodes || []
  const mixes = result.data?.allWpMix?.nodes || []
  const videos = result.data?.allWpVideo?.nodes || []

  // Debug logging
  console.log(`Creating ${pages.length} WordPress pages`)
  console.log(`Creating ${posts.length} blog posts`)
  console.log(`Creating ${beats.length} beats`)
  console.log(`Creating ${tutorials.length} tutorials`)
  console.log(`Creating ${mixes.length} mixes`)
  console.log(`Creating ${videos.length} videos`)

  // Check for WordPress connection
  if (posts.length === 0) {
    console.warn(
      "⚠️  No WordPress posts found. Check WordPress connection at:",
      process.env.WPGRAPHQL_URL
    )
  }

  // Create WordPress pages
  pages.forEach((page) => {
    createPage({
      path: `/${page.slug}/`,
      component: require.resolve("./src/templates/wp-page.js"),
      context: {
        id: page.id,
        slug: page.slug,
      },
    })
  })

  // Create Blog post pages with next/previous navigation
  posts.forEach((post, index) => {
    console.log(`Creating blog post page: /blog/${post.slug}/`)
    const previousPost = index === 0 ? null : posts[index - 1]
    const nextPost = index === posts.length - 1 ? null : posts[index + 1]

    createPage({
      path: `/blog/${post.slug}/`,
      component: require.resolve("./src/templates/blog-post.js"),
      context: {
        id: post.id,
        slug: post.slug,
        previousPost: previousPost
          ? {
              slug: previousPost.slug,
              title: previousPost.title,
            }
          : null,
        nextPost: nextPost
          ? {
              slug: nextPost.slug,
              title: nextPost.title,
            }
          : null,
      },
    })
  })

  // Create Beat pages
  beats.forEach((beat) => {
    createPage({
      path: `/beats/${beat.slug}/`,
      component: require.resolve("./src/templates/beat.tsx"),
      context: {
        id: beat.id,
        slug: beat.slug,
      },
    })
  })

  // Create Tutorial pages
  tutorials.forEach((tutorial) => {
    createPage({
      path: `/tutorials/${tutorial.slug}/`,
      component: require.resolve("./src/templates/tutorial.tsx"),
      context: {
        id: tutorial.id,
        slug: tutorial.slug,
      },
    })
  })

  // Create Mix pages
  mixes.forEach((mix) => {
    createPage({
      path: `/mixes/${mix.slug}/`,
      component: require.resolve("./src/templates/mix.tsx"),
      context: {
        id: mix.id,
        slug: mix.slug,
      },
    })
  })

  // Create Video pages with next/previous navigation
  videos.forEach((video, index) => {
    console.log(`Creating video page: /videos/${video.slug}/`)
    const previousVideo = index === 0 ? null : videos[index - 1]
    const nextVideo = index === videos.length - 1 ? null : videos[index + 1]

    createPage({
      path: `/videos/${video.slug}/`,
      component: require.resolve("./src/templates/video.js"),
      context: {
        id: video.id,
        slug: video.slug,
        previousVideo: previousVideo
          ? {
              slug: previousVideo.slug,
              title: previousVideo.title,
            }
          : null,
        nextVideo: nextVideo
          ? {
              slug: nextVideo.slug,
              title: nextVideo.title,
            }
          : null,
      },
    })
  })

  // Create slices (both bypass and normal mode need slices)
  createSlice({
    id: "header",
    component: require.resolve("./src/components/header.js"),
  })

  createSlice({
    id: "footer",
    component: require.resolve("./src/components/footer.js"),
  })
}

// Force client-only routes for development in bypass mode
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  // Only apply these changes in bypass mode
  if (process.env.BYPASS_WORDPRESS === "true") {
    // Skip if the page is already marked as client-only
    if (
      page.mode === "SSR" &&
      page.path.match(/^\/(music|videos|blog|beats|mixes)/)
    ) {
      deletePage(page)
      createPage({
        ...page,
        mode: "SSG", // Switch to static site generation mode
      })
    }
  }
}

// Add slug field to SitePage nodes
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  // Only process SitePage nodes
  if (node.internal.type === "SitePage") {
    // Extract slug from path (remove leading and trailing slashes)
    const slug = node.path.replace(/^\/|\/$/g, "")

    // Add slug as a field on the node
    createNodeField({
      node,
      name: "slug",
      value: slug || "home", // Default to 'home' for the root path
    })
  }
}

// Create mock data files for static queries in bypass mode
exports.onPostBuild = ({ store }) => {
  const { program } = store.getState()
  const fs = require("fs")
  const path = require("path")

  if (process.env.BYPASS_WORDPRESS === "true") {
    const publicPath = path.join(program.directory, "public")
    const dataPath = path.join(publicPath, "page-data", "sq", "d")

    // Ensure the directory exists
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true })
    }

    // Mock data for layout query used in header (ID: 860043902)
    const headerData = {
      data: {
        layout: {
          header: {
            id: "header-mock",
            navItems: [
              { id: "home", navItemType: "LINK", href: "/", text: "Home" },
              {
                id: "music",
                navItemType: "LINK",
                href: "/music",
                text: "Music",
              },
              {
                id: "videos",
                navItemType: "LINK",
                href: "/videos",
                text: "Videos",
              },
              { id: "blog", navItemType: "LINK", href: "/blog", text: "Blog" },
              {
                id: "contact",
                navItemType: "LINK",
                href: "/contact",
                text: "Contact",
              },
            ],
          },
        },
      },
    }

    // Mock data for layout query used in footer
    const footerData = {
      data: {
        layout: {
          footer: {
            id: "footer-mock",
            copyright: "© 2025 J. Eldon Music",
            links: [
              { id: "home", href: "/", text: "Home" },
              { id: "about", href: "/about", text: "About" },
              { id: "contact", href: "/contact", text: "Contact" },
            ],
            meta: [
              { id: "privacy", href: "/privacy", text: "Privacy Policy" },
              { id: "terms", href: "/terms", text: "Terms of Service" },
            ],
            socialLinks: [
              { id: "yt", service: "YOUTUBE", username: "jeldonmusic" },
              { id: "ig", service: "INSTAGRAM", username: "jeldonmusic" },
              { id: "tw", service: "TWITTER", username: "jeldonmusic" },
              { id: "sc", service: "SOUNDCLOUD", username: "jeldonmusic" },
            ],
          },
        },
      },
    }

    // Hero banner data
    const { getDemoBlogPosts } = require("./src/utils/fallback-data")
    const heroBannerData = {
      data: {
        allWpPost: { nodes: getDemoBlogPosts(5) },
        allWpVideo: {
          nodes: [
            {
              id: "video-1",
              title: "Beat Making Tutorial",
              excerpt:
                "<p>Learn how to create beats with industry standard tools</p>",
              slug: "beat-making-tutorial",
              date: "2025-06-10",
              videoDetails: {
                youtubeVideoId: "dQw4w9WgXcQ",
                videoViews: "12345",
              },
              featuredImage: {
                node: {
                  altText: "Beat Making",
                  localFile: {
                    childImageSharp: {
                      gatsbyImageData: {},
                    },
                  },
                },
              },
            },
            {
              id: "video-2",
              title: "Mixing Vocals",
              excerpt: "<p>Professional vocal mixing techniques</p>",
              slug: "mixing-vocals",
              date: "2025-05-20",
              videoDetails: {
                youtubeVideoId: "dQw4w9WgXcQ",
                videoViews: "5432",
              },
              featuredImage: {
                node: {
                  altText: "Vocal Mixing",
                  localFile: {
                    childImageSharp: {
                      gatsbyImageData: {},
                    },
                  },
                },
              },
            },
          ],
        },
        allWpBeat: { nodes: [] },
        allWpMix: { nodes: [] },
        allContentfulHomepageHero: {
          nodes: [
            {
              heading: "J. Eldon Music",
              subheading: "Music Producer | Artist | Engineer",
              image: {
                gatsbyImageData: {},
                alt: "J. Eldon Music",
              },
              links: [
                { href: "/music", text: "Explore Music" },
                { href: "/videos", text: "Watch Videos" },
              ],
            },
          ],
        },
      },
    }

    // Mock data for related posts
    const relatedPostsData = {
      data: {
        allWpPost: {
          nodes: getDemoBlogPosts(10), // Use the same helper function to get mock blog posts
        },
      },
    }

    // Write the mock data files
    fs.writeFileSync(
      path.join(dataPath, "860043902.json"),
      JSON.stringify(headerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "3235098977.json"),
      JSON.stringify(footerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "3265857146.json"),
      JSON.stringify(heroBannerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "2141841991.json"),
      JSON.stringify(relatedPostsData)
    )

    console.log("📝 Created mock static query data files for bypass mode")
  }
}
