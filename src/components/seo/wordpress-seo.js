import React from "react"

const WordPressSEO = ({ 
  // WordPress SEO data (from Yoast or RankMath)
  seo,
  // Fallback data
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  categories,
  // Schema data
  schema,
  // Additional meta
  canonical,
  noindex = false,
  nofollow = false
}) => {
  // Use WordPress SEO data if available, otherwise use fallbacks
  const seoTitle = seo?.title || title || "Jeldon Music"
  const seoDescription = seo?.metaDesc || description || "Music production, beats, tutorials, and more"
  const seoImage = seo?.opengraphImage?.sourceUrl || image?.url || image
  const seoCanonical = seo?.canonical || canonical || (typeof window !== 'undefined' ? window.location.href : '')
  
  // Open Graph data
  const ogTitle = seo?.opengraphTitle || seoTitle
  const ogDescription = seo?.opengraphDescription || seoDescription
  const ogImage = seo?.opengraphImage?.sourceUrl || seoImage
  const ogType = seo?.opengraphType || type
  
  // Twitter Card data
  const twitterTitle = seo?.twitterTitle || ogTitle
  const twitterDescription = seo?.twitterDescription || ogDescription
  const twitterImage = seo?.twitterImage?.sourceUrl || ogImage
  const twitterCard = "summary_large_image"
  
  // Generate JSON-LD schema
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Jeldon Music",
      "url": "https://jeldonmusic.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://jeldonmusic.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }

    // Article schema for blog posts
    if (type === "article" || ogType === "article") {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": seoTitle,
        "description": seoDescription,
        "image": ogImage,
        "url": seoCanonical,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
          "@type": "Person",
          "name": author || "Jeldon"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Jeldon Music",
          "logo": {
            "@type": "ImageObject",
            "url": "https://jeldonmusic.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": seoCanonical
        }
      }
    }

    // Music schema for beats/tracks
    if (type === "music" || categories?.includes("beats")) {
      return {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        "name": seoTitle,
        "description": seoDescription,
        "image": ogImage,
        "url": seoCanonical,
        "byArtist": {
          "@type": "Person",
          "name": "Jeldon"
        },
        "inAlbum": {
          "@type": "MusicAlbum",
          "name": "Jeldon Music Collection"
        }
      }
    }

    // Video schema for tutorials/videos
    if (type === "video" || categories?.includes("tutorials")) {
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": seoTitle,
        "description": seoDescription,
        "thumbnailUrl": ogImage,
        "url": seoCanonical,
        "uploadDate": publishedTime,
        "creator": {
          "@type": "Person",
          "name": "Jeldon"
        }
      }
    }

    // Use custom schema if provided
    if (schema) {
      return schema
    }

    return baseSchema
  }

  const schemaMarkup = generateSchema()

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Canonical URL */}
      {seoCanonical && <link rel="canonical" href={seoCanonical} />}
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:site_name" content="Jeldon Music" />
      <meta property="og:locale" content="en_US" />
      
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={seoTitle} />
        </>
      )}
      
      {/* Article specific Open Graph */}
      {(type === "article" || ogType === "article") && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {categories && categories.map((category, index) => (
            <meta key={index} property="article:section" content={category} />
          ))}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:site" content="@jeldonmusic" />
      <meta name="twitter:creator" content="@jeldonmusic" />
      
      {twitterImage && (
        <meta name="twitter:image" content={twitterImage} />
      )}
      
      {/* Additional Meta Tags */}
      <meta name="author" content={author || "Jeldon"} />
      <meta name="generator" content="Gatsby" />
      <meta name="theme-color" content="#004ca3" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://www.instagram.com" />
      
      {/* WordPress SEO specific meta */}
      {seo?.focuskw && <meta name="keywords" content={seo.focuskw} />}
      {seo?.metaRobotsNoindex && <meta name="robots" content="noindex" />}
      {seo?.metaRobotsNofollow && <meta name="robots" content="nofollow" />}
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
      
      {/* Additional WordPress Yoast/RankMath meta */}
      {seo?.breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": seo.breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.text,
              "item": crumb.url
            }))
          })}
        </script>
      )}
    </>
  )
}

export default WordPressSEO
