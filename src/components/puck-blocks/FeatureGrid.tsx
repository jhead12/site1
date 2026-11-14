import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Box, Container, Grid, Heading, Kicker, Section, Text } from "../ui"
import * as styles from "./blocks.css"

export type FeatureGridProps = {
  kicker?: string
  heading?: string
  text?: string
  items: { icon: string; heading: string; text: string }[]
}

export const FeatureGrid: ComponentConfig<FeatureGridProps> = {
  label: "Feature Grid",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Intro text" },
    items: {
      type: "array",
      label: "Features",
      arrayFields: {
        icon: { type: "text", label: "Emoji / icon" },
        heading: { type: "text", label: "Title" },
        text: { type: "textarea", label: "Description" },
      },
      defaultItemProps: {
        icon: "⚡",
        heading: "Fast turnaround",
        text: "Describe the benefit here.",
      },
      getItemSummary: (item) => item.heading || "Feature",
    },
  },
  defaultProps: {
    heading: "Why producers stick with this",
    items: [
      { icon: "🎛️", heading: "Hands-on coaching", text: "Feedback on your actual sessions, not generic tips." },
      { icon: "🎧", heading: "Mix-ready templates", text: "Start from a session that already sounds finished." },
      { icon: "🚀", heading: "Fast turnaround", text: "Get unstuck in days, not months." },
    ],
  },
  render: ({ kicker, heading, text, items }) => (
    <Section>
      <Container>
        <Box center>
          {(kicker || heading) && (
            <Heading>
              {kicker && <Kicker>{kicker}</Kicker>}
              {heading}
            </Heading>
          )}
          {text && <Text variant="lead">{text}</Text>}
        </Box>
        <Grid columns={[1, 2, 3]} gap={4}>
          {items.map((item, i) => (
            <div key={`${item.heading}-${i}`} className={styles.featureCard}>
              {item.icon && <div className={styles.featureIcon}>{item.icon}</div>}
              <Text as="h3" bold>
                {item.heading}
              </Text>
              <Text as="p">{item.text}</Text>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  ),
}
