import * as React from "react"
import type { ComponentConfig } from "@measured/puck"
import { Container, Section, Text } from "../ui"
import * as styles from "./blocks.css"

export type VideoEmbedProps = {
  url: string
  caption?: string
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v")
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
      if (parsed.pathname.startsWith("/embed/")) return url
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0]
      if (id) return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    return null
  }

  return null
}

export const VideoEmbed: ComponentConfig<VideoEmbedProps> = {
  label: "Video Embed",
  fields: {
    url: { type: "text", label: "YouTube or Vimeo URL" },
    caption: { type: "text", label: "Caption" },
  },
  defaultProps: {
    url: "",
  },
  render: ({ url, caption }) => {
    const embedUrl = toEmbedUrl(url)

    return (
      <Section>
        <Container width="narrow">
          {embedUrl ? (
            <div className={styles.videoWrap}>
              <iframe
                src={embedUrl}
                title={caption || "Embedded video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <Text as="p">Add a YouTube or Vimeo URL to embed a video here.</Text>
          )}
          {caption && (
            <Text as="p" className={styles.videoCaption}>
              {caption}
            </Text>
          )}
        </Container>
      </Section>
    )
  },
}
