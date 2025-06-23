import * as React from "react"
import Layout from "../components/layout"
import { Container, Section, Heading, Text } from "../components/ui"

export default function ContactPage() {
  return (
    <Layout>
      <Section>
        <Container>
          <Heading>Contact</Heading>
          <Text>
            You can reach out to J. Eldon Music via email at <a href="mailto:info@jeldonmusic.com">info@jeldonmusic.com</a> or use the form below (coming soon).
          </Text>
        </Container>
      </Section>
    </Layout>
  )
}
