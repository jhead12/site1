import * as React from "react"

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  // Ensure HTML `lang` attribute is present for accessibility
  const siteLocale = process.env.SITE_LOCALE || process.env.LOCALE || "en-US"
  setHtmlAttributes && setHtmlAttributes({ lang: siteLocale })

  // Facebook Pixel is handled by gatsby-plugin-gdpr-cookies (configured in
  // gatsby-config.js) — do not inject it manually here to avoid double-firing.
  setHeadComponents([
    // Content-Language / Open Graph locale for social previews
    <meta
      key="content-language"
      httpEquiv="Content-Language"
      content={siteLocale}
    />,
    <meta key="og-locale" property="og:locale" content={siteLocale} />,
  ])
}
