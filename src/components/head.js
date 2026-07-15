import * as React from "react"

export default function Head({ title, description, image, pathname }) {
  const pageTitle = title || "Jeldon Music | Beats | Tutorials | Mix"
  const canonicalUrl = pathname
    ? `https://www.jeldonmusic.com${pathname}`
    : "https://www.jeldonmusic.com"
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{pageTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      {description && (
        <meta
          name="description"
          property="og:description"
          content={description}
        />
      )}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Jeldon Music" />
      <meta property="og:locale" content="en_US" />
      {image && <meta property="og:image" content={image.url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image.url} />}
        
    </>
  )
}
