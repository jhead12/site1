import React, { useState } from "react"
import {
  Box,
  Heading,
  Text,
  Subhead,
  Button
} from "../ui"

const CommentsSection = ({ postId, postTitle }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // For now, we'll store comments locally
    // In a real implementation, you'd send this to your WordPress API or comments service
    const comment = {
      id: Date.now(),
      name: newComment.name,
      message: newComment.message,
      date: new Date().toLocaleDateString(),
      approved: true // For demo purposes
    }

    setComments([...comments, comment])
    setNewComment({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e) => {
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box marginY={6} paddingY={5} style={{ borderTop: "1px solid #eee" }}>
      <Subhead marginY={3}>Comments ({comments.length})</Subhead>
      
      {/* Existing Comments */}
      {comments.length > 0 && (
        <Box marginY={4}>
          {comments.map((comment) => (
            <Box 
              key={comment.id} 
              marginY={3} 
              paddingY={3}
              style={{ 
                borderLeft: "3px solid #004ca3", 
                paddingLeft: "16px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px"
              }}
            >
              <Text variant="bold">{comment.name}</Text>
              <Text variant="kicker" marginY={1}>{comment.date}</Text>
              <Text marginY={2}>{comment.message}</Text>
            </Box>
          ))}
        </Box>
      )}

      {/* Comment Form */}
      <Box marginY={4}>
        <Text variant="subhead" marginY={3}>Leave a Comment</Text>
        
        <form onSubmit={handleSubmit}>
          <Box marginY={3}>
            <label htmlFor="name">
              <Text variant="bold">Name *</Text>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newComment.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
          </Box>

          <Box marginY={3}>
            <label htmlFor="email">
              <Text variant="bold">Email *</Text>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newComment.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
          </Box>

          <Box marginY={3}>
            <label htmlFor="message">
              <Text variant="bold">Comment *</Text>
            </label>
            <textarea
              id="message"
              name="message"
              value={newComment.message}
              onChange={handleChange}
              required
              rows={5}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                resize: "vertical"
              }}
            />
          </Box>

          <Box marginY={3}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: "#004ca3",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </button>
          </Box>
        </form>

        <Box marginY={3}>
          <Text variant="small" style={{ color: "#666" }}>
            Note: Comments are currently stored locally for demo purposes. 
            In production, integrate with WordPress Comments API or a service like Disqus.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default CommentsSection
