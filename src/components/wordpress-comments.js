import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Space
} from "./ui"

// WordPress Comments Component with GraphQL integration
const WordPressComments = ({ postId, postSlug }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Fetch comments when component mounts
  const fetchGraphQLComments = async () => {
    // This would work if WP GraphQL Comments plugin is installed
    // For now, return null to use REST API fallback
    return null
  }

  const fetchRESTComments = useCallback(async () => {
    try {
      const wpUrl = process.env.GATSBY_WORDPRESS_URL || process.env.WPGRAPHQL_URL?.replace('/graphql', '')
      if (!wpUrl) {
        console.warn('No WordPress URL configured')
        return []
      }
      
      const response = await fetch(`${wpUrl}/wp-json/wp/v2/comments?post=${postId}&status=approved&per_page=50`)
      if (response.ok) {
        const comments = await response.json()
        return comments.map(comment => ({
          ...comment,
          author_name: comment.author_name || 'Anonymous',
          content: comment.content.rendered || comment.content
        }))
      } else {
        console.warn('Comments API response not OK:', response.status)
      }
    } catch (error) {
      console.warn('REST API comments fetch failed:', error)
    }
    return []
  }, [postId])

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      // Try GraphQL first (if WP GraphQL Comments plugin is installed)
      const graphqlComments = await fetchGraphQLComments()
      if (graphqlComments) {
        setComments(graphqlComments)
      } else {
        // Fallback to REST API
        const restComments = await fetchRESTComments()
        setComments(restComments)
      }
    } catch (error) {
      console.warn('Comments could not be loaded:', error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [fetchRESTComments])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const submitComment = async (e) => {
    e.preventDefault()
    if (!newComment.author || !newComment.content) {
      alert('Please fill in required fields (Name and Comment)')
      return
    }

    try {
      setSubmitting(true)
      const wpUrl = process.env.GATSBY_WORDPRESS_URL || process.env.WPGRAPHQL_URL?.replace('/graphql', '')
      
      if (!wpUrl) {
        alert('WordPress connection not configured')
        return
      }
      
      const response = await fetch(`${wpUrl}/wp-json/wp/v2/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: postId,
          author_name: newComment.author,
          author_email: newComment.email,
          content: newComment.content,
          status: 'pending' // WordPress will moderate
        })
      })

      if (response.ok) {
        await response.json() // Parse response but don't store unused data
        setNewComment({ author: '', email: '', content: '' })
        alert('Comment submitted successfully! It will appear after moderation.')
        // Refresh comments to show if auto-approved
        setTimeout(() => fetchComments(), 1000)
      } else {
        const error = await response.text()
        console.error('Comment submission failed:', error)
        alert('Failed to submit comment. Please try again.')
      }
    } catch (error) {
      console.error('Comment submission failed:', error)
      alert('Failed to submit comment. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box marginY={5}>
      <Heading as="h3">Comments</Heading>
      <Space size={3} />
      
      {loading ? (
        <Text>Loading comments...</Text>
      ) : comments.length > 0 ? (
        <Box marginY={4}>
          {comments.map((comment) => (
            <Box key={comment.id} marginY={3} style={{ 
              padding: '1rem', 
              borderLeft: '3px solid #0066cc',
              backgroundColor: 'rgba(0, 102, 204, 0.05)'
            }}>
              <Flex variant="spaceBetween">
                <Text variant="bold">
                  {comment.author_name || comment.author?.node?.name}
                </Text>
                <Text variant="kicker">
                  {new Date(comment.date).toLocaleDateString()}
                </Text>
              </Flex>
              <Space size={2} />
              <Text dangerouslySetInnerHTML={{ 
                __html: comment.content?.rendered || comment.content 
              }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Text>No comments yet. Be the first to comment!</Text>
      )}

      <Box marginY={5}>
        <Heading as="h4">Leave a Comment</Heading>
        <Space size={3} />
        <form onSubmit={submitComment}>
          <Box marginY={2}>
            <label htmlFor="author">Name *</label>
            <input
              id="author"
              type="text"
              value={newComment.author}
              onChange={(e) => setNewComment({...newComment, author: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.5rem'
              }}
            />
          </Box>
          
          <Box marginY={2}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={newComment.email}
              onChange={(e) => setNewComment({...newComment, email: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.5rem'
              }}
            />
          </Box>
          
          <Box marginY={2}>
            <label htmlFor="content">Comment *</label>
            <textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.5rem',
                resize: 'vertical'
              }}
            />
          </Box>
          
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Post Comment'}
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default WordPressComments
