import * as React from "react"
import Layout from "./layout"
import Head from "./head"
import { Container, Box, Heading, Subhead, Text, Kicker, Grid } from "./ui"
import ThriveCartButton from "./ThriveCartButton"
import CalendlyEmbed from "./CalendlyEmbed"
import InquiryForm, { InquiryFormField } from "./InquiryForm"
import TrustSection, { Testimonial } from "./TrustSection"

interface OfferCta {
  type: "thrivecart" | "calendly" | "inquiry" | "application" | "waitlist"
  label: string
  formName?: string
  productSlug?: string
  productIdEnvVar?: string
  calendlyUrlEnvVar?: string
  calendlyUrlFallback?: string
}

export interface Offer {
  id: string
  path: string
  seoTitle: string
  seoDescription: string
  kicker: string
  headline: string
  subheadline: string
  price: string
  priceNote: string
  cta: OfferCta
  painPoints: string[]
  includes: string[]
  faq: { q: string; a: string }[]
  formFields?: InquiryFormField[]
  utmWelcomeDefault?: string
}

interface OfferLandingPageProps {
  offer: Offer
  testimonials?: Testimonial[]
}

function getUtmWelcome(offer: Offer, source: string | null): string | null {
  if (!source) return null
  const base = offer.utmWelcomeDefault || "Glad you're here."
  const sourceLabel: Record<string, string> = {
    youtube: "Welcome from YouTube!",
    instagram: "Welcome from Instagram!",
    tiktok: "Welcome from TikTok!",
  }
  const prefix = sourceLabel[source.toLowerCase()]
  return prefix ? `${prefix} ${base}` : base
}

function CtaBlock({ offer }: { offer: Offer }) {
  switch (offer.cta.type) {
    case "thrivecart":
      return (
        <ThriveCartButton
          label={offer.cta.label}
          productSlug={offer.cta.productSlug || offer.id}
          productIdEnvVar={offer.cta.productIdEnvVar}
        />
      )
    case "calendly": {
      const url =
        (offer.cta.calendlyUrlEnvVar && process.env[offer.cta.calendlyUrlEnvVar]) ||
        offer.cta.calendlyUrlFallback ||
        "https://calendly.com/jeldonmusic"
      return <CalendlyEmbed url={url} />
    }
    case "inquiry":
    case "application":
    case "waitlist":
      return (
        <InquiryForm
          formName={offer.cta.formName || offer.id}
          fields={offer.formFields || []}
          submitLabel={offer.cta.label}
        />
      )
    default:
      return null
  }
}

export default function OfferLandingPage({ offer, testimonials }: OfferLandingPageProps) {
  const [utmSource, setUtmSource] = React.useState<string | null>(null)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUtmSource(params.get("utm_source"))
  }, [])

  const welcomeMessage = getUtmWelcome(offer, utmSource)
  const isDirectPurchase = offer.cta.type === "thrivecart"

  return (
    <Layout>
      <Head
        title={offer.seoTitle}
        description={offer.seoDescription}
        pathname={offer.path}
      />

      <Box paddingY={5}>
        <Container width="narrow">
          {welcomeMessage && (
            <Box
              padding={3}
              radius="medium"
              background="secondary"
              style={{ marginBottom: "1.5rem", textAlign: "center" }}
            >
              <Text bold>{welcomeMessage}</Text>
            </Box>
          )}

          <Kicker>{offer.kicker}</Kicker>
          <Heading as="h1" style={{ marginTop: "0.5rem" }}>
            {offer.headline}
          </Heading>
          <Text variant="subheading" style={{ marginTop: "1rem" }}>
            {offer.subheadline}
          </Text>

          <Box
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "baseline",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Text bold style={{ fontSize: "1.5rem" }}>
              {offer.price}
            </Text>
            <Text>{offer.priceNote}</Text>
          </Box>

          <Box style={{ marginTop: "1.5rem" }}>
            {isDirectPurchase ? (
              <CtaBlock offer={offer} />
            ) : (
              <a
                href="#offer-cta"
                style={{
                  display: "inline-block",
                  padding: "0.85rem 2rem",
                  borderRadius: "999px",
                  background: "#e50914",
                  color: "#fff",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {offer.cta.label}
              </a>
            )}
          </Box>
        </Container>
      </Box>

      <Box paddingY={4}>
        <Container width="narrow">
          <Subhead>Sound familiar?</Subhead>
          <ul style={{ marginTop: "0.75rem" }}>
            {offer.painPoints.map((point) => (
              <li key={point} style={{ marginBottom: "0.5rem" }}>
                <Text>{point}</Text>
              </li>
            ))}
          </ul>
        </Container>
      </Box>

      <Box paddingY={4} background="secondary">
        <Container width="narrow">
          <Subhead>What you get</Subhead>
          <Grid columns={[1, 2]} gap={3} style={{ marginTop: "1rem" }}>
            {offer.includes.map((item) => (
              <Box key={item} padding={3} radius="medium" background="primary">
                <Text>{item}</Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box paddingY={4}>
        <Container width="narrow">
          <TrustSection testimonials={testimonials} />
        </Container>
      </Box>

      <Box paddingY={4} background="secondary">
        <Container width="narrow">
          <Subhead>Frequently asked questions</Subhead>
          <Box style={{ marginTop: "1rem" }}>
            {offer.faq.map((item) => (
              <Box key={item.q} style={{ marginBottom: "1.5rem" }}>
                <Text bold>{item.q}</Text>
                <Text style={{ marginTop: "0.35rem" }}>{item.a}</Text>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box paddingY={5} id="offer-cta">
        <Container width="narrow">
          <Subhead>{offer.cta.label}</Subhead>
          <Box style={{ marginTop: "1.25rem" }}>
            <CtaBlock offer={offer} />
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}
