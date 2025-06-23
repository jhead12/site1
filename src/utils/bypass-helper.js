// Helper functions to support WordPress bypass mode
export const isBypassWordpressEnabled = () => {
  if (typeof window !== "undefined") {
    return window.BYPASS_WORDPRESS === "true";
  }
  return process.env.BYPASS_WORDPRESS === "true";
};

// Default mock data for header
export const mockHeaderData = {
  layout: {
    header: {
      id: "header-mock",
      navItems: [
        { id: "home", navItemType: "LINK", href: "/", text: "Home" },
        { id: "music", navItemType: "LINK", href: "/music", text: "Music" },
        { id: "videos", navItemType: "LINK", href: "/videos", text: "Videos" },
        { id: "blog", navItemType: "LINK", href: "/blog", text: "Blog" }
      ]
    }
  }
};

// Default mock data for footer
export const mockFooterData = {
  layout: {
    footer: {
      id: "footer-mock",
      copyright: "© 2025 J. Eldon Music",
      links: [
        { id: "home", href: "/", text: "Home" },
        { id: "about", href: "/about", text: "About" },
        { id: "contact", href: "/contact", text: "Contact" }
      ],
      meta: [
        { id: "privacy", href: "/privacy", text: "Privacy Policy" },
        { id: "terms", href: "/terms", text: "Terms of Service" }
      ],
      socialLinks: [
        { id: "yt", service: "YOUTUBE", username: "jeldonmusic" },
        { id: "ig", service: "INSTAGRAM", username: "jeldonmusic" },
        { id: "tw", service: "TWITTER", username: "jeldonmusic" },
        { id: "sc", service: "SOUNDCLOUD", username: "jeldonmusic" }
      ]
    }
  }
};

// Hero banner mock data
export const mockHeroBannerData = {
  allWpPost: { nodes: [] },
  allWpVideo: { nodes: [] },
  allWpBeat: { nodes: [] },
  allWpMix: { nodes: [] },
  allContentfulHomepageHero: {
    nodes: [
      {
        heading: "J. Eldon Music",
        subheading: "Music Producer | Artist | Engineer",
        image: {
          gatsbyImageData: {},
          alt: "J. Eldon Music"
        },
        links: [
          { href: "/music", text: "Explore Music" },
          { href: "/videos", text: "Watch Videos" }
        ]
      }
    ]
  }
};
