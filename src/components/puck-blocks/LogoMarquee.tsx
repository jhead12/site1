import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Box, Container, Heading, Kicker, Section } from "../ui"
import * as styles from "./blocks.css"

export type LogoMarqueeProps = {
  kicker?: string
  heading?: string
  speed: "slow" | "medium" | "fast"
  logos: { imageUrl: string; alt: string; href?: string }[]
}

const trackClassBySpeed = {
  slow: styles.marqueeTrackSlow,
  medium: styles.marqueeTrackMedium,
  fast: styles.marqueeTrackFast,
}

export const LogoMarquee: ComponentConfig<LogoMarqueeProps> = {
  label: "Logo Marquee (scrolling)",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    speed: {
      type: "select",
      label: "Scroll speed",
      options: [
        { label: "Slow", value: "slow" },
        { label: "Medium", value: "medium" },
        { label: "Fast", value: "fast" },
      ],
    },
    logos: {
      type: "array",
      label: "Logos",
      arrayFields: {
        imageUrl: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt text" },
        href: { type: "text", label: "Link (optional)" },
      },
      defaultItemProps: { imageUrl: "", alt: "Logo" },
      getItemSummary: (item) => item.alt || "Logo",
    },
  },
  defaultProps: {
    heading: "As featured / trusted by",
    speed: "medium",
    logos: [],
  },
  render: ({ kicker, heading, speed, logos }) => {
    if (!logos.length) return null
    // Duplicate the list so the CSS animation can loop seamlessly at -50%.
    const looped = [...logos, ...logos]

    return (
      <Section paddingY={4}>
        <Container>
          {(kicker || heading) && (
            <Box center>
              <Heading variant="subheadSmall">
                {kicker && <Kicker>{kicker}</Kicker>}
                {heading}
              </Heading>
            </Box>
          )}
          <div className={styles.marqueeViewport}>
            <div className={trackClassBySpeed[speed] || styles.marqueeTrackMedium}>
              {looped.map((logo, i) => {
                const img = (
                  <img
                    src={logo.imageUrl}
                    alt={logo.alt || ""}
                    className={styles.marqueeImage}
                    loading="lazy"
                  />
                )
                return (
                  <div className={styles.marqueeItem} key={`${logo.imageUrl}-${i}`}>
                    {logo.href ? (
                      <a href={logo.href} target="_blank" rel="noopener noreferrer">
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>
    )
  },
}
