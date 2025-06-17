// src/components/blog-query.js
import gql from 'graphql-tag';

export const GET_BLOG_POSTS = gql`
  query {
    allPosts {
      id
      title
      content
      publishedDate
    }
  }
`;