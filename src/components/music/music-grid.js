import React from "react"
import { Grid } from "../ui"
import MusicItem from "./music-item"

const MusicGrid = ({ items }) => {
  return (
    <Grid columns={[1, 2, 3]} gap={4}>
      {items.map(item => (
        <MusicItem key={item.id} item={item} />
      ))}
    </Grid>
  )
}

export default MusicGrid
