import * as React from "react"
// import { graphql } from "gatsby"
// import {  Text } from "./ui"
// import * as styles from "./about-stat-list.css"


const BeatList = () => (
  <main>
    <h1> Public Beat List</h1>
    <iframe
      src="https://player.beatstars.com/?storeId=128801"
      width="100%"
      height="300"
      style={{ maxWidth: "1024px" }}
      title="BeatStars Player"
    >
      -- none --
    </iframe>
  </main>
);

export default BeatList;