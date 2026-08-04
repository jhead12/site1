import * as React from "react"

interface CalendlyEmbedProps {
  url: string
  minHeight?: number
}

/**
 * Inline Calendly scheduling widget. Requires assets.calendly.com in
 * script-src and calendly.com in frame-src (see netlify.toml CSP).
 */
export default function CalendlyEmbed({ url, minHeight = 700 }: CalendlyEmbedProps) {
  React.useEffect(() => {
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      return
    }
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: "320px", height: `${minHeight}px` }}
    />
  )
}
