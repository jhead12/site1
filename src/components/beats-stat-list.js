import * as React from "react"
// import { graphql } from "gatsby"
import { Container, Text } from "./ui"
// import * as styles from "./about-stat-list.css"

const BeatList = () => (
  <Container width="fullbleed">
    <Text center variant="lead">
      <h1>Current Public Beat List</h1>
    </Text>

    <div style={{ width: "100%", maxWidth: "100%" }}>
      <iframe
        title="samply music list"
        src="https://samply.app/embed/pXJcoEICbOorz8If1Yly"
        frameBorder="0"
        allowtransparency="true"
        style={{
          width: "100%",
          height: "480px",
          border: "0",
          borderRadius: "8px",
          display: "block",
        }}
      ></iframe>
    </div>

    {/* <iframe
      src="https://player.beatstars.com/?storeId=128801"
      width="100%"
      height="400"
      style={{ maxWidth: "1024px" }}
      title="BeatStars Player"
    >
      -- none --
    </iframe> */}
  </Container>
)

export default BeatList
