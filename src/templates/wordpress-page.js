import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Container, Box, Heading } from "../components/ui";
import SEOHead from "../components/head";

export default function PageTemplate(props) {
  const { wpPage } = props.data;

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
  );
}

export const Head = (props) => {
  const { wpPage } = props.data;
  return <SEOHead {...wpPage} />;
};

export const query = graphql`
  query PageTemplate($id: String!) {
    wpPage(id: { eq: $id }) {
      id
      title
      content
      slug
    }
  }
`;