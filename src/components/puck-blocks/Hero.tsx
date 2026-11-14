import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Box, Container, Flex, Heading, Kicker, Section, Subhead, Text } from "../ui"
import { LinkButtons, linksField } from "./shared"
import * as styles from "./blocks.css"

export type HeroProps = {
  kicker?: string
  heading: string
  subhead?: string
  text?: string
  imageUrl?: string
  imageAlt?: string
  links: { text: string; href: string }[]
}

export const Hero: ComponentConfig<HeroProps> = {
  label: "Hero",
  fields: {
    kicker: { type: "text", label: "Kicker (small label above heading)" },
    heading: { type: "text", label: "Heading" },
    subhead: { type: "text", label: "Subheading" },
    text: { type: "textarea", label: "Body text" },
    imageUrl: { type: "text", label: "Image URL" },
    imageAlt: { type: "text", label: "Image alt text" },
    links: linksField,
  },
  defaultProps: {
    kicker: "Jeldon Music",
    heading: "Make beats that actually finish",
    subhead: "Production coaching, sample packs, and mix tools",
    text: "A hands-on approach to production, built around the way producers actually work.",
    links: [{ text: "Get started", href: "/coaching" }],
  },
  render: ({ kicker, heading, subhead, text, imageUrl, imageAlt, links }) => (
    <Section>
      <Container>
        <Flex gap={4} variant="responsive">
          <Box width="half">
            {imageUrl && (
              <div className={styles.heroImageWrap}>
                <img
                  src={imageUrl}
                  alt={imageAlt || ""}
                  className={styles.heroImage}
                  loading="lazy"
                />
              </div>
            )}
          </Box>
          <Box width="half">
            <Heading as="h1">
              {kicker && <Kicker>{kicker}</Kicker>}
              {heading}
            </Heading>
            {subhead && <Subhead as="h2">{subhead}</Subhead>}
            {text && <Text as="p">{text}</Text>}
            <LinkButtons links={links} />
          </Box>
        </Flex>
      </Container>
    </Section>
  ),
}
