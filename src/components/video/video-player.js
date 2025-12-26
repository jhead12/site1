import React, { useState } from "react"
import {
  Box,
  Text
} from "../ui"

const VideoPlayer = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  if (!videoId) {
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
            // create player after setting loaded
            if (typeof window !== "undefined") {
              // small timeout to allow React to render the player div
              setTimeout(() => {
                try {
                  // If YT API is already present
                  if (window.YT && window.YT.Player) {
                    try {
                      new window.YT.Player(playerDivId, {
                        height: '100%',
                        width: '100%',
                        videoId,
                        playerVars: { origin: window.location?.origin || window.location?.href },
                        events: {
                          onError: function() {
                            var wrapper = document.getElementById(wrapperId)
                            if (wrapper) {
                              wrapper.innerHTML = '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" rel="noopener noreferrer" style="display:block;width:100%;height:100%;text-decoration:none;color:inherit"><div style="position:absolute;inset:0;background-image:url(https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg);background-size:cover;background-position:center;border-radius:8px"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);padding:12px;border-radius:999px;color:#fff;font-weight:700">Watch on YouTube</div></a>'
                            }
                          }
                        }
                      })
                    } catch (e) {
                      // fallback: replace with external link
                      var wrapper = document.getElementById(wrapperId)
                      if (wrapper) wrapper.innerHTML = '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>'
                    }
                    return
                  }

                  var tag = document.createElement('script')
                  tag.src = 'https://www.youtube.com/iframe_api'
                  var firstScriptTag = document.getElementsByTagName('script')[0]
                  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

                  var previous = window.onYouTubeIframeAPIReady
                  window.onYouTubeIframeAPIReady = function() {
                    if (previous) try{ previous(); }catch(e){}
                    try {
                      new window.YT.Player(playerDivId, {
                        height: '100%',
                        width: '100%',
                        videoId,
                        playerVars: { origin: window.location?.origin || window.location?.href },
                        events: {
                          onError: function() {
                            var wrapper = document.getElementById(wrapperId)
                            if (wrapper) {
                              wrapper.innerHTML = '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" rel="noopener noreferrer" style="display:block;width:100%;height:100%;text-decoration:none;color:inherit"><div style="position:absolute;inset:0;background-image:url(https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg);background-size:cover;background-position:center;border-radius:8px"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);padding:12px;border-radius:999px;color:#fff;font-weight:700">Watch on YouTube</div></a>'
                            }
                          }
                        }
                      })
                    } catch (err) {
                      var wrapper = document.getElementById(wrapperId)
                      if (wrapper) wrapper.innerHTML = '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>'
                    }
                  }
                } catch (e) {}
              }, 50)
            }
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
        <div id={wrapperId} style={{ position: 'absolute', inset: 0 }}>
          <div id={playerDivId} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </Box>
  )
}

export default VideoPlayer
