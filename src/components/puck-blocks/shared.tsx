import * as React from "react"
import type { Field } from "@measured/puck"
import { Button, FlexList } from "../ui"

export type LinkItem = { text: string; href: string }

export function LinkButtons({
  links = [],
  reversed = false,
  center = false,
}: {
  links?: LinkItem[]
  reversed?: boolean
  center?: boolean
}) {
  if (!links.length) return null

  return (
    <FlexList marginY={4} variant={center ? "center" : undefined}>
      {links.map((link, i) => {
        const primary = reversed ? i !== 0 : i === 0
        return (
          <li key={`${link.href}-${i}`}>
            <Button href={link.href} variant={primary ? "primary" : "link"}>
              {link.text}
            </Button>
          </li>
        )
      })}
    </FlexList>
  )
}

export const linksField: Field<LinkItem[]> = {
  type: "array",
  label: "Buttons / links",
  arrayFields: {
    text: { type: "text", label: "Label" },
    href: { type: "text", label: "URL" },
  },
  defaultItemProps: { text: "Learn more", href: "/" },
  getItemSummary: (item) => item.text || "Link",
}
