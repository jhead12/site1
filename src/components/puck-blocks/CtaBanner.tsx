import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Container, Heading, Kicker, Section, Text } from "../ui"
import { LinkButtons, linksField } from "./shared"
import * as styles from "./blocks.css"

export type CtaBannerProps = {
  kicker?: string
  heading: string
  text?: string
  links: { text: string; href: string }[]
  style: "gradient" | "plain"
}

export const CtaBanner: ComponentConfig<CtaBannerProps> = {
  label: "CTA Banner",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Body text" },
    links: linksField,
    style: {
      type: "radio",
      label: "Background",
      options: [
        { label: "Gradient", value: "gradient" },
        { label: "Plain", value: "plain" },
      ],
    },
  },
  defaultProps: {
    heading: "Ready to level up your production?",
    text: "Book a free intro call and get a plan built around your workflow.",
    links: [{ text: "Book a call", href: "/coaching" }],
    style: "gradient",
  },
  render: ({ kicker, heading, text, links, style: bg }) => (
    <Container width="fullbleed">
      <Section
        padding={5}
        radius="large"
        cx={[bg === "plain" ? styles.ctaBannerPlain : styles.ctaBanner]}
      >
        <Heading center>
          {kicker && <Kicker center>{kicker}</Kicker>}
          {heading}
        </Heading>
        {text && (
          <Text as="p" center variant="lead">
            {text}
          </Text>
        )}
        <LinkButtons links={links} center reversed />
      </Section>
    </Container>
  ),
}
