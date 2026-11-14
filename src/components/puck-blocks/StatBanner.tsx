import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Box, Container, Flex, FlexList, Heading, Kicker, Section, Text } from "../ui"
import { LinkButtons, linksField } from "./shared"

export type StatBannerProps = {
  kicker?: string
  heading: string
  text?: string
  stats: { value: string; label: string }[]
  links: { text: string; href: string }[]
}

export const StatBanner: ComponentConfig<StatBannerProps> = {
  label: "Stat Banner",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Body text" },
    stats: {
      type: "array",
      label: "Stats",
      arrayFields: {
        value: { type: "text", label: "Value (e.g. 500+)" },
        label: { type: "text", label: "Label" },
      },
      defaultItemProps: { value: "100+", label: "Tracks produced" },
      getItemSummary: (item) => `${item.value} — ${item.label}`,
    },
    links: linksField,
  },
  defaultProps: {
    heading: "Numbers that back it up",
    stats: [
      { value: "500+", label: "Producers coached" },
      { value: "10k+", label: "Beats sold" },
      { value: "4.9/5", label: "Average rating" },
    ],
    links: [],
  },
  render: ({ kicker, heading, text, stats, links }) => (
    <Container width="fullbleed">
      <Section padding={5} radius="large" background="primary">
        <Flex responsive variant="end">
          <Box width="full">
            <Heading>
              {kicker && <Kicker>{kicker}</Kicker>}
              {heading}
            </Heading>
            {text && <Text variant="lead">{text}</Text>}
            <FlexList wrap gap={4}>
              {stats.map((stat, i) => (
                <li key={`${stat.label}-${i}`}>
                  <Box>
                    <Text variant="stat">{stat.value}</Text>
                    <Text variant="statLabel">{stat.label}</Text>
                  </Box>
                </li>
              ))}
            </FlexList>
            <LinkButtons links={links} reversed />
          </Box>
        </Flex>
      </Section>
    </Container>
  ),
}
