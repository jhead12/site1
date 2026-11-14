import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Heading, Text } from "../ui"
import { LinkButtons, linksField } from "./shared"
import ContainedMatrixRain from "./ContainedMatrixRain"
import * as styles from "./blocks.css"

export type MatrixSectionProps = {
  heading: string
  text?: string
  height: "medium" | "large" | "viewport"
  links: { text: string; href: string }[]
}

const sectionClassByHeight = {
  medium: styles.matrixSectionMedium,
  large: styles.matrixSectionLarge,
  viewport: styles.matrixSectionViewport,
}

export const MatrixSection: ComponentConfig<MatrixSectionProps> = {
  label: "Matrix Rain Section (signature effect)",
  fields: {
    heading: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Body text" },
    height: {
      type: "select",
      label: "Section height",
      options: [
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Full viewport", value: "viewport" },
      ],
    },
    links: linksField,
  },
  defaultProps: {
    heading: "Welcome to the matrix",
    text: "A full-bleed, animated section using the site's signature rain effect.",
    height: "large",
    links: [],
  },
  render: ({ heading, text, height, links }) => (
    <div className={sectionClassByHeight[height] || styles.matrixSectionLarge}>
      <ContainedMatrixRain />
      <div className={styles.matrixScrim} />
      <div className={styles.matrixContent}>
        <Heading as="h2" center className={styles.matrixHeading}>
          {heading}
        </Heading>
        {text && (
          <Text as="p" center variant="lead">
            {text}
          </Text>
        )}
        <LinkButtons links={links} center />
      </div>
    </div>
  ),
}
