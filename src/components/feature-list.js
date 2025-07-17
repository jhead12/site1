import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Container, Box, Kicker, Heading, Text } from "./ui"
import Feature from "./feature"

export default function FeatureList(props) {
  // Try to fetch Contentful data
  const data = useStaticQuery(graphql`
    query FeatureListContentfulQuery {
      allContentfulHomepageFeatureList {
        nodes {
          id
        }
      }
    }
  `)

  // Use props data if provided, otherwise try Contentful data
  const featureListFromProps =
    props?.kicker ||
    props?.featureHeading ||
    props?.featureListHeading ||
    props?.heading ||
    props?.content
      ? props
      : null

  const contentfulFeatureList = data.allContentfulHomepageFeatureList.nodes[0]

  const featureList = featureListFromProps || contentfulFeatureList

  // Don't render if no data
  if (!featureList) {
    return null
  }

  return (
    <Container width="fullbleed">
      <Box background="muted" radius="large">
        <Box center paddingY={5}>
          <Heading>
            {featureList.kicker && <Kicker>{featureList.kicker}</Kicker>}
            {featureList.featureHeading ||
              featureList.featureListHeading ||
              featureList.heading ||
              "Features"}
          </Heading>
          {featureList.text && <Text>{featureList.text}</Text>}
        </Box>
        {featureList.content?.map((feature, i) => (
          <Feature key={feature.id} {...feature} flip={Boolean(i % 2)} />
        ))}
      </Box>
    </Container>
  )
}
