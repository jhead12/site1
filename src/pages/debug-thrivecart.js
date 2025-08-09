import React from "react"
import Layout from "../components/layout"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Button,
} from "../components/ui"

const DebugThriveCart = () => {
  const account = process.env.GATSBY_THRIVECART_ACCOUNT || "nomoneyblanks"
  const basicId = process.env.GATSBY_THRIVECART_BEAT_BASIC_ID || "18"
  const premiumId = process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID || "19"
  const exclusiveId = process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID || "20"

  const testUrls = [
    {
      name: "Basic License",
      url: `https://thrivecart.com/checkout/${account}/${basicId}`,
      id: basicId,
    },
    {
      name: "Premium License",
      url: `https://thrivecart.com/checkout/${account}/${premiumId}`,
      id: premiumId,
    },
    {
      name: "Exclusive License",
      url: `https://thrivecart.com/checkout/${account}/${exclusiveId}`,
      id: exclusiveId,
    },
  ]

  const handleTestUrl = (url) => {
    console.log("Testing ThriveCart URL:", url)
    window.open(url, "_blank")
  }

  return (
    <Layout>
      <Section paddingY={5}>
        <Container>
          <Box
            padding={5}
            backgroundColor="white"
            borderRadius={3}
            boxShadow="medium"
          >
            <Heading as="h1" marginBottom={4}>
              ThriveCart Debug Page
            </Heading>

            <Box marginBottom={4}>
              <Text fontWeight="bold">Environment Variables:</Text>
              <Text>Account: {account}</Text>
              <Text>Basic ID: {basicId}</Text>
              <Text>Premium ID: {premiumId}</Text>
              <Text>Exclusive ID: {exclusiveId}</Text>
            </Box>

            <Box marginBottom={4}>
              <Text fontWeight="bold">Test URLs:</Text>
              {testUrls.map((test, index) => (
                <Box
                  key={index}
                  marginBottom={3}
                  padding={3}
                  backgroundColor="#f9fafb"
                  borderRadius={2}
                >
                  <Text fontWeight="bold">{test.name}</Text>
                  <Text fontSize={1} marginBottom={2}>
                    {test.url}
                  </Text>
                  <Button
                    onClick={() => handleTestUrl(test.url)}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Test {test.name}
                  </Button>
                </Box>
              ))}
            </Box>

            <Box marginBottom={4}>
              <Text fontWeight="bold">Direct Account Test:</Text>
              <Button
                onClick={() =>
                  handleTestUrl(`https://thrivecart.com/${account}`)
                }
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              >
                Visit Account Page
              </Button>
            </Box>

            <Box padding={3} backgroundColor="#fff3cd" borderRadius={2}>
              <Text fontWeight="bold">Notes:</Text>
              <Text>
                • If you get "invalid.access" errors, the product IDs might be
                incorrect
              </Text>
              <Text>
                • Try visiting the account page first to verify the account
                exists
              </Text>
              <Text>• Check ThriveCart dashboard for correct product IDs</Text>
            </Box>
          </Box>
        </Container>
      </Section>
    </Layout>
  )
}

export default DebugThriveCart

export const Head = () => <title>ThriveCart Debug - J. Eldon Music</title>
