import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import { Container, Box, Heading } from "../components/ui"

import SEOHead from "../components/head"

export default function Beats(props) {
 

  return (
    <Layout>
    <Box paddingY={5}>
      <Container width="narrow">
        <Heading as="h1">{wpPage.title}</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: wpPage.content,
          }}
        />
      </Container>
    </Box>
  </Layout>
  )}


export const Head = (props) => {
  const { wpPage } = props.data;
  return <SEOHead {...wpPage} />;
};

export const wpPage = graphql`
  query PageTemplate($id: String!) {
    wpPage(id: { eq: $id }) {
      id
      title
      content
      slug

    }
  }
`;
   
