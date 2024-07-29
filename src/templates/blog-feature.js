import React from "react"
import Carousel from "react-bootstrap/Carousel"

const BlogFeature = ({ data }) => {
  const { allWpPost } = data
  const posts = allWpPost.nodes

  if (posts.length <= 1) {
    // Render posts without carousel if there is one or no post
    return (
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            {post.featuredImage && (
              <img src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Carousel>
      {posts.map(post => (
        <Carousel.Item key={post.id}>
          <div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            {post.featuredImage && (
              <img src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText} />
            )}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default BlogFeature
