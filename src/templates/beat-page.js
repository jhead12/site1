import React, { useState, useEffect, useRef } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Space,
} from "../components/ui"
import SEOHead from "../components/head"

/**
 * Individual Beat Page with License Selection
 * WordPress-powered beats with ThriveCart integration
 */
const BeatPage = ({ data, pageContext }) => {
  const beat = data?.wpBeat || pageContext?.beat // WordPress data or fallback
  const audioRef = useRef(null)
  const [selectedLicense, setSelectedLicense] = useState("basic")
  const [audioPlaying, setAudioPlaying] = useState(false)

  // License configurations - can be customized per beat from WordPress
  const getCustomLicenses = () => {
    // Get custom licenses from WordPress if available
    const customLicenses = beat?.beatDetails?.customLicenses

    // Default license structure
    const defaultLicenses = {
      basic: {
        id: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID || "18",
        name: "Basic License",
        price: 50,
        description: "Perfect for independent artists",
        features: [
          "MP3 & WAV files",
          "Commercial use rights",
          "Up to 10,000 streams",
          "Basic mixing stems",
          "Producer credit required",
        ],
        contractType: "non_exclusive",
      },
      premium: {
        id: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID || "19",
        name: "Premium License",
        price: 150,
        description: "Enhanced rights for serious artists",
        features: [
          "High-quality WAV & MP3",
          "Extended commercial rights",
          "Up to 100,000 streams",
          "Individual stems included",
          "Radio & TV sync rights",
          "Producer credit required",
        ],
        contractType: "exclusive_licensing",
        popular: true,
      },
      exclusive: {
        id: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID || "20",
        name: "Exclusive License",
        price: 1000,
        description: "Complete ownership rights",
        features: [
          "Master-quality files",
          "Complete exclusive rights",
          "Unlimited distribution",
          "Full stem package",
          "Trackouts & MIDI files",
          "Beat removed from store",
          "Producer credit optional",
          "Custom mixing included",
        ],
        contractType: "buyout",
      },
    }

    // Override with WordPress custom pricing/settings if available
    if (beat?.beatDetails?.customPricing) {
      const pricing = beat.beatDetails.customPricing
      if (pricing.basicPrice) defaultLicenses.basic.price = pricing.basicPrice
      if (pricing.premiumPrice)
        defaultLicenses.premium.price = pricing.premiumPrice
      if (pricing.exclusivePrice)
        defaultLicenses.exclusive.price = pricing.exclusivePrice
    }

    // Override with custom license configurations if available
    if (customLicenses) {
      Object.keys(defaultLicenses).forEach((key) => {
        const customLicense = customLicenses[key]
        if (customLicense) {
          if (customLicense.enabled === false) {
            delete defaultLicenses[key] // Remove license if disabled
            return
          }

          // Override specific fields
          if (customLicense.name) defaultLicenses[key].name = customLicense.name
          if (customLicense.description)
            defaultLicenses[key].description = customLicense.description
          if (customLicense.contractType)
            defaultLicenses[key].contractType = customLicense.contractType
          if (customLicense.features)
            defaultLicenses[key].features = customLicense.features
          if (customLicense.popular !== undefined)
            defaultLicenses[key].popular = customLicense.popular
        }
      })
    }

    return defaultLicenses
  }

  const licenses = getCustomLicenses()

  const handlePurchase = () => {
    const license = licenses[selectedLicense]
    const account = process.env.GATSBY_THRIVECART_ACCOUNT || "nomoneyblanks"

    // Debug logging
    console.log("ThriveCart Purchase Debug:", {
      account,
      licenseId: license.id,
      selectedLicense,
      beatTitle: beat.title,
      envVars: {
        basicId: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
        premiumId: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID,
        exclusiveId: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
      },
    })

    // Validate required data
    if (!license.id || license.id === "undefined") {
      alert("Error: Product ID not configured. Please contact support.")
      return
    }

    // Use direct ThriveCart URL format
    const checkoutUrl = `https://thrivecart.com/checkout/${account}/${license.id}`

    // Add beat details as URL parameters (ThriveCart custom fields)
    const params = new URLSearchParams({
      beat_name: beat.title || "Beat",
      beat_id: beat.id || "unknown",
      license_type: selectedLicense,
      beat_bpm: beat.bpm || beat?.beatDetails?.bpm || "",
      beat_key: beat.key || beat?.beatKeys?.nodes?.[0]?.name || "",
    })

    const finalUrl = `${checkoutUrl}?${params.toString()}`
    console.log("Opening ThriveCart URL:", finalUrl)

    // Show a confirmation before redirecting
    if (
      window.confirm(
        `Open checkout for ${license.name} (${formatPrice(license.price)})?`
      )
    ) {
      window.open(finalUrl, "_blank")
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setAudioPlaying(!audioPlaying)
    }
  }

  // Get preview audio URL from WordPress data
  const previewAudio =
    beat?.beatDetails?.previewAudio?.mediaItemUrl || beat?.preview

  return (
    <Layout>
      <Section
        paddingY={5}
        style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}
      >
        <Container>
          {/* Beat Header */}
          <Box
            marginBottom={6}
            padding={5}
            backgroundColor="white"
            borderRadius={3}
            boxShadow="medium"
          >
            <Flex gap={5} flexDirection={["column", "column", "row"]}>
              {/* Beat Artwork */}
              <Box width={["100%", "100%", "300px"]} flex="none">
                <Box
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    backgroundColor: "#1f2937",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {beat.artwork || beat?.featuredImage?.node?.localFile ? (
                    <img
                      src={
                        beat.artwork ||
                        beat?.featuredImage?.node?.localFile?.childImageSharp
                          ?.gatsbyImageData?.images?.fallback?.src
                      }
                      alt={beat.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    <Text fontSize={6} style={{ color: "#9ca3af" }}>
                      🎵
                    </Text>
                  )}

                  {/* Play Button Overlay */}
                  <button
                    onClick={toggleAudio}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(59, 130, 246, 0.9)",
                      border: "none",
                      color: "white",
                      fontSize: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {audioPlaying ? "⏸️" : "▶️"}
                  </button>
                </Box>

                {/* Hidden Audio Element */}
                {previewAudio && (
                  <audio
                    ref={audioRef}
                    src={previewAudio}
                    onEnded={() => setAudioPlaying(false)}
                    style={{ display: "none" }}
                  />
                )}
              </Box>

              {/* Beat Info */}
              <Box flex="1">
                <Heading
                  as="h1"
                  variant="display"
                  style={{ color: "#111827", marginBottom: "16px" }}
                >
                  {beat.title}
                </Heading>

                <Text
                  variant="lead"
                  style={{ color: "#6b7280", marginBottom: "24px" }}
                >
                  {beat.description ||
                    "Professional beat ready for your next track"}
                </Text>

                {/* WordPress Content (if available and different from description) */}
                {beat.content && beat.content !== beat.description && (
                  <Box marginBottom={4}>
                    <div
                      style={{ color: "#6b7280" }}
                      dangerouslySetInnerHTML={{
                        __html: beat.content
                          .replace(
                            /<figure[^>]*class="wp-block-audio"[^>]*>.*?<\/figure>/gs,
                            ""
                          )
                          .replace(/<figure[^>]*>.*?<\/figure>/gs, "")
                          .replace(/<audio[^>]*>.*?<\/audio>/gs, ""),
                      }}
                    />
                  </Box>
                )}

                {/* Beat Details */}
                <Flex gap={4} marginBottom={4}>
                  {(beat.bpm || beat?.beatDetails?.bpm) && (
                    <Box>
                      <Text fontSize={1} style={{ color: "#9ca3af" }}>
                        BPM
                      </Text>
                      <Text fontWeight="bold" style={{ color: "#374151" }}>
                        {beat.bpm || beat?.beatDetails?.bpm}
                      </Text>
                    </Box>
                  )}
                  {(beat.key || beat?.beatKeys?.nodes?.[0]?.name) && (
                    <Box>
                      <Text fontSize={1} style={{ color: "#9ca3af" }}>
                        Key
                      </Text>
                      <Text fontWeight="bold" style={{ color: "#374151" }}>
                        {beat.key || beat?.beatKeys?.nodes?.[0]?.name}
                      </Text>
                    </Box>
                  )}
                  {(beat.genre || beat?.beatGenres?.nodes?.[0]?.name) && (
                    <Box>
                      <Text fontSize={1} style={{ color: "#9ca3af" }}>
                        Genre
                      </Text>
                      <Text fontWeight="bold" style={{ color: "#374151" }}>
                        {beat.genre || beat?.beatGenres?.nodes?.[0]?.name}
                      </Text>
                    </Box>
                  )}
                  {beat?.beatDetails?.duration && (
                    <Box>
                      <Text fontSize={1} style={{ color: "#9ca3af" }}>
                        Duration
                      </Text>
                      <Text fontWeight="bold" style={{ color: "#374151" }}>
                        {beat.beatDetails.duration}
                      </Text>
                    </Box>
                  )}
                </Flex>

                {/* Tags */}
                {(beat.tags || beat?.beatDetails?.tags) && (
                  <Flex gap={2} wrap marginBottom={4}>
                    {(beat.tags || beat?.beatDetails?.tags?.split(","))?.map(
                      (tag, index) => (
                        <Box
                          key={index}
                          style={{
                            backgroundColor: "#e5e7eb",
                            color: "#374151",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        >
                          {typeof tag === "string" ? tag.trim() : tag}
                        </Box>
                      )
                    )}
                  </Flex>
                )}
              </Box>
            </Flex>
          </Box>

          {/* License Selection */}
          <Box
            marginBottom={6}
            padding={5}
            backgroundColor="white"
            borderRadius={3}
            boxShadow="medium"
          >
            <Heading
              as="h2"
              variant="subheadLarge"
              marginBottom={4}
              style={{ color: "#111827" }}
            >
              Choose Your License
            </Heading>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {Object.entries(licenses).map(([key, license]) => (
                <Box
                  key={key}
                  onClick={() => setSelectedLicense(key)}
                  style={{
                    border:
                      selectedLicense === key
                        ? "2px solid #3b82f6"
                        : "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedLicense === key ? "#eff6ff" : "white",
                    position: "relative",
                    transition: "all 0.3s ease",
                  }}
                >
                  {license.popular && (
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "20px",
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Most Popular
                    </Box>
                  )}

                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    marginBottom={3}
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize={4}
                        style={{ color: "#111827" }}
                      >
                        {license.name}
                      </Text>
                      <Text fontSize={1} style={{ color: "#6b7280" }}>
                        {license.description}
                      </Text>
                    </Box>
                    <Text
                      fontSize={5}
                      fontWeight="bold"
                      style={{ color: "#059669" }}
                    >
                      {formatPrice(license.price)}
                    </Text>
                  </Flex>

                  <Box as="ul" style={{ listStyle: "none", padding: 0 }}>
                    {license.features.map((feature, index) => (
                      <Box
                        as="li"
                        key={index}
                        marginBottom={1}
                        style={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <Text
                          style={{
                            color: "#059669",
                            marginRight: "8px",
                            marginTop: "2px",
                          }}
                        >
                          ✓
                        </Text>
                        <Text fontSize={2} style={{ color: "#374151" }}>
                          {feature}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Purchase Section */}
          <Box
            padding={5}
            backgroundColor="white"
            borderRadius={3}
            boxShadow="medium"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text
                  fontSize={4}
                  fontWeight="bold"
                  style={{ color: "#111827" }}
                >
                  {beat.title} - {licenses[selectedLicense].name}
                </Text>
                <Text style={{ color: "#6b7280" }}>
                  Instant download with professional contract included
                </Text>
              </Box>

              <Box textAlign="right">
                <Text
                  fontSize={6}
                  fontWeight="bold"
                  style={{ color: "#059669", marginBottom: "8px" }}
                >
                  {formatPrice(licenses[selectedLicense].price)}
                </Text>
                <Button
                  onClick={handlePurchase}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Purchase Now
                </Button>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Section>
    </Layout>
  )
}

export default BeatPage

export const Head = ({ data, pageContext }) => {
  const beat = data?.wpBeat || pageContext?.beat
  return (
    <SEOHead
      title={`${beat.title} - J. Eldon Music`}
      description={`Purchase ${beat.title} with instant download. Multiple license options available.`}
    />
  )
}

// GraphQL query for WordPress beats
export const query = graphql`
  query BeatBySlug($slug: String!) {
    wpBeat(slug: { eq: $slug }) {
      id
      title
      content
      slug
      date(formatString: "MMMM DD, YYYY")
      featuredImage {
        node {
          altText
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(width: 400, height: 400, placeholder: BLURRED)
            }
          }
        }
      }
    }
  }
`
