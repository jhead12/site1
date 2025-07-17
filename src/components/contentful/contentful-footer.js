import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const ContentfulFooter = () => {
  const data = useStaticQuery(graphql`
    query ContentfulFooterQuery {
      # Get site metadata for fallback
      site {
        siteMetadata {
          title
          description
        }
      }
      # Try to get Contentful footer/navigation data
      allContentfulHomepageHero {
        nodes {
          id
        }
      }
      allContentfulHomepageFeatureList {
        nodes {
          id
        }
      }
    }
  `)

  const siteTitle = data.site?.siteMetadata?.title || "Jeldon Music"
  const hasContentfulData =
    data.allContentfulHomepageHero.nodes.length > 0 ||
    data.allContentfulHomepageFeatureList.nodes.length > 0

  // Enhanced footer links based on available content
  const footerLinks = [
    { href: "/about", text: "About" },
    { href: "/music", text: "Music" },
    { href: "/beats", text: "Beats" },
    { href: "/blog", text: "Blog" },
    { href: "/contact", text: "Contact" },
  ]

  const socialLinks = [
    { href: "https://youtube.com/@jeldonmusic", text: "YouTube" },
    { href: "https://instagram.com/jeldonmusic", text: "Instagram" },
    { href: "https://soundcloud.com/jeldonmusic", text: "SoundCloud" },
  ]

  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "40px 20px 20px 20px",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Contentful Status Indicator */}
        {hasContentfulData && (
          <div
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            ✓ Connected to Contentful -{" "}
            {data.allContentfulHomepageHero.nodes.length} heroes,{" "}
            {data.allContentfulHomepageFeatureList.nodes.length} feature lists
            found
          </div>
        )}

        {/* Footer Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand Section */}
          <div>
            <h3 style={{ marginBottom: "15px", fontSize: "24px" }}>
              {siteTitle}
            </h3>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
              {data.site?.siteMetadata?.description ||
                "Professional music production, beats, and audio content."}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ marginBottom: "15px", fontSize: "18px" }}>
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {footerLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: "8px" }}>
                  <a
                    href={link.href}
                    style={{
                      color: "#ccc",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "white")}
                    onMouseOut={(e) => (e.target.style.color = "#ccc")}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{ marginBottom: "15px", fontSize: "18px" }}>
              Follow Us
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {socialLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: "8px" }}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#ccc",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "white")}
                    onMouseOut={(e) => (e.target.style.color = "#ccc")}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.9rem",
          }}
        >
          © {new Date().getFullYear()} {siteTitle}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default ContentfulFooter
