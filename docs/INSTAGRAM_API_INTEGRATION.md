# Instagram API Integration Guide

## Overview
Complete guide for integrating Instagram Basic Display API with your Gatsby music platform.

## Features
- ✅ Instagram feed component with placeholder data
- 🔄 **Instagram API integration (requires setup)**
- ✅ Responsive grid layout
- ✅ Post interaction (likes, comments display)
- ✅ Connect/disconnect functionality

## Instagram App Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Consumer" app type
4. Fill in app details:
   - App Name: "Your Music Site Instagram"
   - Contact Email: your-email@domain.com

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Go to Basic Display → Settings
4. Add OAuth Redirect URIs:
   - `https://your-domain.com/auth/instagram/callback`
   - `http://localhost:8000/auth/instagram/callback` (for development)

### Step 3: Create Test User (Development)
1. Go to Roles → Roles
2. Add yourself as an Instagram Tester
3. Accept the invitation in your Instagram account

## Environment Variables

Add to your `.env` files:

```bash
# .env.development
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:8000/auth/instagram/callback

# .env.production
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.com/auth/instagram/callback
```

## Backend API Endpoints

Create these API endpoints (using Netlify Functions, Vercel Functions, or your backend):

### 1. Instagram Auth Endpoint

```javascript
// netlify/functions/instagram-auth.js
const https = require('https')

exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code required' })
    }
  }
  
  try {
    // Exchange code for access token
    const tokenData = await getAccessToken(code)
    
    // Get long-lived token
    const longLivedToken = await getLongLivedToken(tokenData.access_token)
    
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `instagram_token=${longLivedToken.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${longLivedToken.expires_in}`
      },
      body: JSON.stringify({ 
        success: true,
        expires_in: longLivedToken.expires_in
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to authenticate with Instagram' })
    }
  }
}

async function getAccessToken(code) {
  const data = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    code: code
  })
  
  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: data
  })
  
  return await response.json()
}

async function getLongLivedToken(shortToken) {
  const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${shortToken}`
  
  const response = await fetch(url)
  return await response.json()
}
```

### 2. Instagram Feed Endpoint

```javascript
// netlify/functions/instagram-feed.js
exports.handler = async (event, context) => {
  const { instagram_token } = parseCookies(event.headers.cookie || '')
  
  if (!instagram_token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No Instagram token found' })
    }
  }
  
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp,media_type,thumbnail_url&access_token=${instagram_token}&limit=12`
    )
    
    const data = await response.json()
    
    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error.message })
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Instagram feed' })
    }
  }
}

function parseCookies(cookieString) {
  const cookies = {}
  cookieString.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      cookies[key] = decodeURIComponent(value)
    }
  })
  return cookies
}
```

## Frontend Integration

### Update Instagram Feed Component

```javascript
// src/components/social/instagram-feed.js (already updated)
// The component now includes:
// - Real API integration with fallback to placeholder
// - Connect/disconnect functionality
// - Error handling and loading states
// - Token management via localStorage
```

### Add Instagram Auth Page

```javascript
// src/pages/auth/instagram/callback.js
import React, { useEffect } from "react"
import { navigate } from "gatsby"
import Layout from "../../../components/layout"
import { Container, Box, Heading, Text } from "../../../components/ui"

const InstagramCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (error) {
      console.error('Instagram auth error:', error)
      navigate('/?instagram=error')
      return
    }
    
    if (code) {
      handleInstagramAuth(code)
    } else {
      navigate('/?instagram=error')
    }
  }, [])
  
  const handleInstagramAuth = async (code) => {
    try {
      const response = await fetch('/.netlify/functions/instagram-auth?code=' + code, {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store success flag in localStorage
        localStorage.setItem('instagram_connected', 'true')
        navigate('/?instagram=success')
      } else {
        navigate('/?instagram=error')
      }
    } catch (error) {
      console.error('Instagram auth failed:', error)
      navigate('/?instagram=error')
    }
  }
  
  return (
    <Layout>
      <Container>
        <Box paddingY={5} center>
          <Heading as="h1">Connecting Instagram...</Heading>
          <Text>Please wait while we connect your Instagram account.</Text>
        </Box>
      </Container>
    </Layout>
  )
}

export default InstagramCallback
```

## WordPress Integration (Optional)

### Save Instagram Posts to WordPress

```php
// Add to functions.php or create a plugin
function sync_instagram_to_wordpress() {
    $access_token = get_option('instagram_access_token');
    
    if (!$access_token) {
        return false;
    }
    
    $response = wp_remote_get(
        "https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp,media_type&access_token={$access_token}&limit=10"
    );
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $data = json_decode(wp_remote_retrieve_body($response), true);
    
    foreach ($data['data'] as $post) {
        // Check if post already exists
        $existing = get_posts([
            'post_type' => 'instagram_post',
            'meta_query' => [
                [
                    'key' => 'instagram_id',
                    'value' => $post['id'],
                    'compare' => '='
                ]
            ],
            'posts_per_page' => 1
        ]);
        
        if (empty($existing)) {
            // Create new post
            $post_id = wp_insert_post([
                'post_title' => substr($post['caption'], 0, 50) . '...',
                'post_content' => $post['caption'],
                'post_status' => 'publish',
                'post_type' => 'instagram_post',
                'post_date' => date('Y-m-d H:i:s', strtotime($post['timestamp']))
            ]);
            
            if ($post_id) {
                update_post_meta($post_id, 'instagram_id', $post['id']);
                update_post_meta($post_id, 'instagram_url', $post['permalink']);
                update_post_meta($post_id, 'media_url', $post['media_url']);
                update_post_meta($post_id, 'media_type', $post['media_type']);
            }
        }
    }
    
    return true;
}

// Schedule sync
add_action('wp', function() {
    if (!wp_next_scheduled('instagram_sync_cron')) {
        wp_schedule_event(time(), 'hourly', 'instagram_sync_cron');
    }
});

add_action('instagram_sync_cron', 'sync_instagram_to_wordpress');
```

## Testing

### 1. Test Instagram Connection
1. Click "Connect Instagram" button
2. Follow OAuth flow
3. Verify token is stored
4. Check feed loads with real data

### 2. Test API Endpoints
```bash
# Test auth endpoint
curl "https://your-site.netlify.app/.netlify/functions/instagram-auth?code=test"

# Test feed endpoint (with valid token)
curl "https://your-site.netlify.app/.netlify/functions/instagram-feed" \
  -H "Cookie: instagram_token=YOUR_TOKEN"
```

## Token Management

### Refresh Long-Lived Tokens
Long-lived tokens expire after 60 days. Set up automatic refresh:

```javascript
// netlify/functions/instagram-refresh-token.js
exports.handler = async (event, context) => {
  const { instagram_token } = parseCookies(event.headers.cookie || '')
  
  try {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${instagram_token}`
    )
    
    const data = await response.json()
    
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `instagram_token=${data.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${data.expires_in}`
      },
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to refresh token' })
    }
  }
}
```

## Privacy & Security

### Data Handling
- Store tokens securely (HttpOnly cookies)
- Implement CSRF protection
- Rate limit API calls
- Cache feed data to reduce API usage

### User Privacy
- Add privacy notice for Instagram integration
- Allow users to disconnect easily
- Don't store unnecessary user data

## Go Live Checklist

1. ✅ Create Facebook App
2. ✅ Add Instagram Basic Display product
3. ✅ Set up redirect URIs
4. ✅ Deploy API endpoints
5. ✅ Add environment variables
6. ✅ Test OAuth flow
7. ✅ Test feed loading
8. ✅ Submit for Instagram review (if needed)
9. ✅ Update privacy policy

Your Instagram integration is now ready for production use!
