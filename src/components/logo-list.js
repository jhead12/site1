import * as React from "react"
import { graphql } from "gatsby"
import { Space, Container, Section, Text } from "./ui"
import { GatsbyImage } from "gatsby-plugin-image"
import { logoContainer, logoItem, logoLink } from "./logo-list.css"

export function LogoItem(props) {
  if (!props.image || !props.image.gatsbyImageData) return null

  return (
    <a href={props.link} className={logoLink} target="_blank" rel="noopener noreferrer">
      <GatsbyImage
        image={props.image.gatsbyImageData}
        alt={props.image.alt || props.alt || "Album cover"}
        style={{
          width: "100%",
          height: "100%",
        }}
        imgStyle={{
          objectFit: "cover",
        }}
      />
    </a>
  )
}

export default function LogoList(props) {
  // Defensive: handle missing logos array
  const logos = props.logos || [];
  
  return (
    <Section paddingY={5}>
      <Container>
        {props.text && (
          <Text center variant="lead" as="h2" style={{ 
            marginBottom: "3rem",
            fontSize: "1.5rem",
            fontWeight: "400",
            color: "#ffffff"
          }}>
            {props.text}
          </Text>
        )}
        <Space size={4} />
        <ul className={logoContainer}>
          {logos.map(
            (logo) =>
              logo && (
                <li key={logo.id} className={logoItem}>
                  <LogoItem {...logo} />
                </li>
              )
          )}
        </ul>
      </Container>
    </Section>
  )
}

export const query = graphql`
  fragment LogoListComponentContent on ContentfulHomepageLogoList {
    id
    name
    text
    logos {
      id
      alt
      link
      image {
        id
        alt
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`
