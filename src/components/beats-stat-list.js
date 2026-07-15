import * as React from "react"
// import { graphql } from "gatsby"
import { Container, Text } from "./ui"
// import * as styles from "./about-stat-list.css"

// The Samply embed pulls in a large third-party stack (Stripe, Firebase,
// Facebook Pixel, Microsoft Clarity, multiple GTM bundles, Mixpanel, etc.)
// plus HLS/FLAC audio streams — ~320 requests / ~11MB. Loading it eagerly on
// the homepage destroyed LCP/TTI/TBT. We gate it behind a click-to-load facade
// so none of that loads until the visitor opts in.
const SAMPLY_EMBED_URL = "https://samply.app/embed/pXJcoEICbOorz8If1Yly"

const BeatList = () => {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <Container width="fullbleed">
      <Text center variant="lead">
        <h1>Current Public Beat List</h1>
      </Text>

      <div style={{ width: "100%", maxWidth: "100%" }}>
        {loaded ? (
          <iframe
            title="samply music list"
            src={SAMPLY_EMBED_URL}
            frameBorder="0"
            allowtransparency="true"
            loading="lazy"
            style={{
              width: "100%",
              height: "480px",
              border: "0",
              borderRadius: "8px",
              display: "block",
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label="Load the beats player"
            style={{
              width: "100%",
              height: "480px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              cursor: "pointer",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              color: "#fff",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: "3rem" }} aria-hidden="true">
              🎹
            </span>
            <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              Load beats player
            </span>
            <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>
              Click to load the Samply player
            </span>
          </button>
        )}
      </div>
    </Container>
  )
}

export default BeatList