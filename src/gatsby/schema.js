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
      videoDetails: WpContentNode_Videodetails
    }

    # Video details type referenced by WpVideo — kept minimal so the
    # schema is valid in preview/bypass environments where WPGraphQL
    # doesn't expose the full ACF-generated type.
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

    # SEO type used by WpPost and other WP content types
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

  // Blog content types (Contentful-backed, replacing the WordPress blog).
  // `content` is derived from the Contentful `body` Rich Text field via the
  // @richText extension (which parses body.raw → HTML), so templates can keep
  // treating post content as an HTML string.
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
      # Optional: unique key for the YouTube→Contentful auto-sync script.
      # When present, the sync job upserts entries by this id instead of slug.
      youtubeVideoId: String
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
        seo: WpSEOType
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
        videoDetails: WpContentNode_Videodetails
        databaseId: Int
        seo: WpSEOType
      }
      
      # SEO type for Yoast/RankMath-compatible fields
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
        seo: WpSEOType
      }
      
      interface WpTermNode {
        id: ID!
        name: String
        slug: String
      }
      
      # Connection interfaces referenced by featuredImage edge types.
      # In live mode these are provided by gatsby-source-wordpress; in
      # bypass mode we declare minimal versions so the schema compiles.
      interface WpOneToOneConnectionType {
        node: Node
      }
      
      interface WpEdgeType {
        node: Node
      }
      
      interface WpMediaItemConnectionEdgeType {
        node: WpMediaItem
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
