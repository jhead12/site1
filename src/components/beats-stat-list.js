import * as React from "react"
// import { graphql } from "gatsby"
import { Container, Section, FlexList, Box, Text } from "./ui"
// import * as styles from "./about-stat-list.css"


const BeatList = () => (
  <Container width="fullbleed">
              <Text center variant="lead">
    
    <h1>Current Public Beat List</h1>
    </Text>

<iframe 
  src="https://samply.app/embed/gR2wVgSEYQrr5UkzrY7N" 
  frameborder="0"
   width="100%"
  height="400"
  allowtransparency="true"
  style={{ maxWidth: "1024px" }}
></iframe>

    <iframe
      src="https://player.beatstars.com/?storeId=128801"
      width="100%"
      height="400"
      style={{ maxWidth: "1024px" }}
      title="BeatStars Player"
    >
      -- none --
    </iframe>
  </Container>
);

export default BeatList;