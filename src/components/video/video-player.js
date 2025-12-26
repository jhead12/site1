import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Text
} from "../ui"

const VideoPlayer = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const wrapperRef = useRef(null)
  const playerDivRef = useRef(null)
  
  // Defensive validation: ensure videoId is a valid YouTube ID (11 chars)
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return (
      <Box style={{ 
        backgroundColor: "#f0f0f0", 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: "8px"
      }}>
        <Text>Video not available</Text>
      </Box>
    )
  }
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  // We'll instantiate the player client-side to allow graceful fallback on errors
  const playerDivId = `yt-player-div-${videoId}`
  const wrapperId = `yt-player-wrapper-${videoId}`

  const handlePlay = () => {
    setIsLoaded(true)
  }

  return (
    <Box style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "8px", overflow: "hidden" }}>
      {!isLoaded ? (
        // Thumbnail with play button
        <div
          onClick={() => {
            handlePlay()
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Play button overlay */}
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: "25px solid white",
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
              marginLeft: "5px"
            }} />
          </div>

          {/* Video title overlay */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            color: "white",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            {title}
          </div>
        </div>
      ) : (
        // Player placeholder div — YT.Player will create the iframe client-side
        <div id={wrapperId} ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
          <div id={playerDivId} ref={playerDivRef} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </Box>
  )
}

// Helpers outside of render to avoid duplication
function getFallbackHTML(id) {
  return '<a href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener noreferrer" style="display:block;width:100%;height:100%;text-decoration:none;color:inherit"><div style="position:absolute;inset:0;background-image:url(https://img.youtube.com/vi/' + id + '/hqdefault.jpg);background-size:cover;background-position:center;border-radius:8px"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);padding:12px;border-radius:999px;color:#fff;font-weight:700">Watch on YouTube</div></a>'
}

function createPlayer(divId, vidId, wrapId) {
  try {
    new window.YT.Player(divId, {
      height: '100%',
      width: '100%',
      videoId: vidId,
      playerVars: { origin: typeof window !== 'undefined' ? (window.location?.origin || window.location?.href) : '' },
      events: {
        onError: function() {
          var wrapper = document.getElementById(wrapId)
          if (wrapper) wrapper.innerHTML = getFallbackHTML(vidId)
        }
      }
    })
  } catch (e) {
    console.error('YT player init failed for', vidId, e)
    var wrapper = document.getElementById(wrapId)
    if (wrapper) wrapper.innerHTML = getFallbackHTML(vidId)
  }
}

// Initialize player when `isLoaded` becomes true — useEffect ensures DOM ready
useEffect(() => {
  if (!isLoaded || typeof window === 'undefined') return

  // If player div isn't present, nothing to do
  const div = playerDivRef.current || document.getElementById(playerDivId)
  if (!div) return

  // If YT is already available, create immediately
  if (window.YT && window.YT.Player) {
    createPlayer(playerDivId, videoId, wrapperId)
    return
  }

  // Avoid injecting duplicate script tags
  const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]')
  let intervalId = null

  if (existingScript) {
    // Poll until the API becomes available
    intervalId = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(intervalId)
        createPlayer(playerDivId, videoId, wrapperId)
      }
    }, 200)
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }

  // Inject script and set ready handler
  try {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = function() {
      if (previous) try { previous(); } catch (e) { console.error(e) }
      createPlayer(playerDivId, videoId, wrapperId)
    }
  } catch (e) {
    console.error('Failed to load YouTube iframe API', e)
    const wrapper = wrapperRef.current || document.getElementById(wrapperId)
    if (wrapper) wrapper.innerHTML = getFallbackHTML(videoId)
  }

  return () => {
    if (intervalId) clearInterval(intervalId)
  }
}, [isLoaded, videoId])

export default VideoPlayer
