import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ContactPage = ({ data }) => {
  // Get the consultation link from Contentful
  const consultationLink = data?.allContentfulHomepageLink?.nodes?.find(
    link => link.text && link.text.toLowerCase().includes('consultation')
  ) || {
    text: "Schedule Music Consultation",
    href: "/music-consultation"
  };
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
        
        {/* Music Consultation CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Take Your Music to the Next Level?</h2>
          <p className="text-lg mb-4">Book a personalized music consultation session</p>
          <a 
            href={consultationLink.href} 
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {consultationLink.text}
          </a>
        </div>
        
        <div className="max-w-2xl">
          <p className="text-lg mb-6">Get in touch with us!</p>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">info@jeldonmusic.com</p>
              </div>
              <div>
                <h3 className="font-medium">Social Media</h3>
                <p className="text-gray-600">Follow us on our social channels</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-600">More contact options and forms coming soon...</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ContactPageQuery {
    allContentfulHomepageLink {
      nodes {
        id
        text
        href
      }
    }
  }
`

export default ContactPage
