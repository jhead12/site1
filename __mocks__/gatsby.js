// Mock Gatsby for Jest tests
import React from 'react';

// Define the mock data that will be returned by useStaticQuery
const mockData = {
  allWpPost: {
    nodes: [{
      id: 'test-wp-1',
      title: 'Test Video',
      excerpt: 'Test Video Description',
      slug: 'test-video',
      date: '2025-06-20',
      categories: {
        nodes: [{ name: 'Videos', slug: 'videos' }]
      },
      featuredImage: {
        node: {
          altText: 'Test Video Image',
          localFile: {
            childImageSharp: {
              gatsbyImageData: {
                layout: 'constrained',
                width: 1920,
                height: 1080
              }
            }
          }
        }
      }
    }]
  },
  allContentfulHomepageHero: {
    nodes: [{
      id: 'test-hero-1',
      heading: 'Test Hero',
      subhead: 'Test Subheading',
      kicker: 'Test Kicker',
      text: 'Test Hero Description',
      image: {
        gatsbyImageData: {
          layout: 'constrained',
          width: 1920,
          height: 1080
        },
        alt: 'Test Hero Image'
      },
      links: [{ href: '/test', text: 'Learn More' }]
    }]
  }
};

// Mock the graphql function to make sure it's a proper function
export const graphql = jest.fn();

// Mock useStaticQuery hook
export const useStaticQuery = jest.fn(() => mockData);

// Create a React component to mock Link since we're in a module scope
export const Link = (props) => React.createElement('a', { ...props, href: props.to }, props.children);

// Export all mocked functions
export default {
  graphql,
  useStaticQuery,
  Link,
};
