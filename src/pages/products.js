import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import SEOHead from "../components/head"

const ProductsPage = ({ data }) => (
  <Layout>
    <h1>Products</h1>
    <ul>
      {data.allShopifyProduct.edges.map(({ node }) => (
        <li key={node.shopifyId}>
          <h3>
            <Link to={`/products/${node.handle}`}>{node.title}</Link>
            {" - "}${node.priceRangeV2.minVariantPrice.amount}
          </h3>
          <p>{node.description}</p>
        </li>
      ))}
    </ul>
    {/* Render the ShopFeature component if the data is available */}
    {data.allSection && data.allSection.top && (
      <sections.ShopFeature data={data.allSection.top} />
    )}
  </Layout>
)

export default ProductsPage

export const query = graphql`
  {
    allShopifyProduct(sort: { title: ASC }) {
      edges {
        node {
          title
          shopifyId
          description
          handle
          priceRangeV2 {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
   
  }
`