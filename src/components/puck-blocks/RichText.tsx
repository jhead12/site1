import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Container, Section } from "../ui"
import * as styles from "./blocks.css"

export type RichTextProps = {
  text: string
  width: "narrow" | "normal"
}

export const RichText: ComponentConfig<RichTextProps> = {
  label: "Text Block",
  fields: {
    text: { type: "textarea", label: "Text (blank lines separate paragraphs)" },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Narrow (readable)", value: "narrow" },
        { label: "Normal", value: "normal" },
      ],
    },
  },
  defaultProps: {
    text: "Write your copy here.",
    width: "narrow",
  },
  render: ({ text, width }) => (
    <Section>
      <Container width={width}>
        {(text || "").split(/\n{2,}/).map((paragraph, i) => (
          <p key={i} className={styles.richTextParagraph}>
            {paragraph}
          </p>
        ))}
      </Container>
    </Section>
  ),
}
