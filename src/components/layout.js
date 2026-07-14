import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import "../styles.css"
import { Slice } from "gatsby"
import "./page-consistency.css"
import "./global-fixes.css"
import MatrixBackground from "./matrix-background"
import "./page-transition.css"
import GooeyNav from "./GooeyNav/GooeyNav"
import { desktopNav as desktopNavClass } from "./header.css"

const Layout = ({ children, pageContext }) => {
  const locale = pageContext?.langKey || "en" // Get locale from pageContext or default to 'en'
  const pageRef = useRef(null)

  useEffect(() => {
    // Trigger entry animation on mount
    const node = pageRef.current
    if (!node) return
    // Allow next paint
    requestAnimationFrame(() => {
      node.classList.add("is-visible")
    })

    return () => {
      // clean up class for unmount
      try {
        node.classList.remove("is-visible")
      } catch (e) {}
    }
  }, [locale])

  return (
    <>
      {/* Matrix Digital Rain Background - Positioned outside normal flow */}
      <MatrixBackground />

      {/* Dense gradient overlay - Matrix visible only at edges */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: `
            radial-gradient(ellipse at center, 
              rgba(0, 0, 0, 0.95) 0%,
              rgba(0, 0, 0, 0.85) 50%,
              rgba(0, 0, 0, 0.7) 80%,
              rgba(0, 0, 0, 0.5) 100%
            )
          `,
          zIndex: -100000,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <Slice alias="header" />

        {/* Main Content */}
        <div ref={pageRef} className="page-transition">
          <main
            id="main-content"
            role="main"
            style={{
              margin: "0 auto",
              padding: "20px",
              maxWidth: "1200px",
              position: "relative",
              zIndex: "10",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              borderRadius: "8px",
            }}
          >
            {children}
          </main>
        </div>

        {/* Footer */}
        <Slice alias="footer" />

        {/* Gooey floating nav (top header links only) */}
        <GooeyNav headerSelector={`nav.${desktopNavClass}`} />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.shape({
    langKey: PropTypes.string,
  }),
}

export default Layout
