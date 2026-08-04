import * as React from "react"
import { Box, Heading, Text, Grid } from "./ui"

export interface Testimonial {
  quote: string
  name: string
  role?: string
}

interface TrustSectionProps {
  credibilityPoints?: string[]
  testimonials?: Testimonial[]
}

const defaultCredibilityPoints = [
  "Years of hands-on MPC and mix experience, taught the way I actually work",
  "Built for producers who want results, not another shelf of unfinished tutorials",
]

export default function TrustSection({
  credibilityPoints = defaultCredibilityPoints,
  testimonials = [],
}: TrustSectionProps) {
  return (
    <Box paddingY={4}>
      <Heading as="h2">Why trust this</Heading>
      <ul style={{ marginTop: "0.75rem", marginBottom: "1.5rem" }}>
        {credibilityPoints.map((point) => (
          <li key={point} style={{ marginBottom: "0.5rem" }}>
            <Text>{point}</Text>
          </li>
        ))}
      </ul>

      {testimonials.length > 0 && (
        <Grid columns={[1, testimonials.length > 1 ? 2 : 1]} gap={4}>
          {testimonials.map((t) => (
            <Box
              key={t.name}
              padding={4}
              radius="medium"
              background="secondary"
            >
              <Text>&ldquo;{t.quote}&rdquo;</Text>
              <Text bold style={{ marginTop: "0.5rem" }}>
                {t.name}
                {t.role ? ` — ${t.role}` : ""}
              </Text>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  )
}
