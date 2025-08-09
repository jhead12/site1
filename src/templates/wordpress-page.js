// src/templates/wordpress-page.js
import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import { Container, Box, Heading } from '../components/ui';
import SEOHead from '../components/head';

export default function PageTemplate(props) {
  const { wpPage } = props.data;

  // Handle missing data (e.g., in bypass mode)
  if (!wpPage) {
    return (
      <Layout>
        <Box paddingY={5}>
          <Container width="narrow">
            <Heading as="h1">Page Not Found</Heading>
            <p>This page could not be loaded. This might happen in development mode when WordPress is bypassed.</p>
          </Container>
        </Box>
      </Layout>
    );
  }

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