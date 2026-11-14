import * as React from "react"
import { Render } from "@measured/puck"
import "@measured/puck/puck.css"
import Layout from "../components/layout"
import SEOHead from "../components/head"
import { config } from "../lib/puck/config"

type PuckPageContext = {
  slug: string
  puckData: any
}

export default function PuckPage({ pageContext }: { pageContext: PuckPageContext }) {
  const { puckData } = pageContext

  return (
    <Layout pageContext={pageContext}>
      <Render config={config} data={puckData} />
    </Layout>
  )
}

export function Head({ pageContext }: { pageContext: PuckPageContext }) {
  const { puckData } = pageContext
  const rootProps = puckData?.root?.props || {}

  return <SEOHead title={rootProps.title} description={rootProps.description} />
}
