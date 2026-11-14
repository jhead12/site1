import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import * as styles from "./blocks.css"

export type SpacerProps = {
  size: "small" | "medium" | "large" | "xlarge"
}

const classBySize = {
  small: styles.spacerSmall,
  medium: styles.spacerMedium,
  large: styles.spacerLarge,
  xlarge: styles.spacerXlarge,
}

export const Spacer: ComponentConfig<SpacerProps> = {
  label: "Spacer",
  fields: {
    size: {
      type: "select",
      label: "Height",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "X-Large", value: "xlarge" },
      ],
    },
  },
  defaultProps: { size: "medium" },
  render: ({ size }) => <div className={classBySize[size] || styles.spacerMedium} />,
}
