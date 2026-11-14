import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Blockquote, Box, Container, Flex, FlexList, Heading, Kicker, Section, Text } from "../ui"
import * as styles from "./blocks.css"

export type TestimonialsProps = {
  kicker?: string
  heading?: string
  items: { quote: string; source: string; avatarUrl?: string }[]
}

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  label: "Testimonials",
  fields: {
    kicker: { type: "text", label: "Kicker" },
    heading: { type: "text", label: "Heading" },
    items: {
      type: "array",
      label: "Testimonials",
      arrayFields: {
        quote: { type: "textarea", label: "Quote" },
        source: { type: "text", label: "Attribution (name, role)" },
        avatarUrl: { type: "text", label: "Avatar image URL" },
      },
      defaultItemProps: {
        quote: "This completely changed how I finish tracks.",
        source: "A. Producer",
      },
      getItemSummary: (item) => item.source || "Testimonial",
    },
  },
  defaultProps: {
    heading: "What producers are saying",
    items: [
      { quote: "This completely changed how I finish tracks.", source: "A. Producer" },
      { quote: "Worth every session — I actually ship music now.", source: "J. Beatmaker" },
    ],
  },
  render: ({ kicker, heading, items }) => (
    <Section>
      <Container>
        <Box center>
          {(kicker || heading) && (
            <Heading>
              {kicker && <Kicker>{kicker}</Kicker>}
              {heading}
            </Heading>
          )}
        </Box>
        <FlexList gutter={3} variant="start" responsive wrap>
          {items.map((item, i) => (
            <Box as="li" key={`${item.source}-${i}`} width="half" padding={3}>
              <Flex variant="start">
                {item.avatarUrl && (
                  <img src={item.avatarUrl} alt="" className={styles.testimonialAvatar} loading="lazy" />
                )}
                <Blockquote>
                  <Text as="p" variant="lead">
                    {item.quote}
                  </Text>
                  <figcaption>
                    <Text as="cite" bold variant="caps">
                      {item.source}
                    </Text>
                  </figcaption>
                </Blockquote>
              </Flex>
            </Box>
          ))}
        </FlexList>
      </Container>
    </Section>
  ),
}
