import React from "react"
import Layout from "../components/layout"

const ContactPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
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

export default ContactPage
