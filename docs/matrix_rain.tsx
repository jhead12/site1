import React, { useEffect, useRef } from "react"

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // These non-null assertions will help with TypeScript errors
    const canvasElement = canvas as HTMLCanvasElement
    const context = ctx as CanvasRenderingContext2D

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvasElement.width = window.innerWidth * dpr
      canvasElement.height = window.innerHeight * dpr
      canvasElement.style.width = window.innerWidth + "px"
      canvasElement.style.height = window.innerHeight + "px"
      context.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", () => {
      resizeCanvas()
      columns = Math.floor(window.innerWidth / fontSize)
      // Reinitialize drops for new column count
      drops.length = 0
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100
      }
    })

    // Matrix characters - mix of Japanese katakana, numbers, and symbols
    const matrixChars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?"

    const fontSize = 14
    let columns = Math.floor(window.innerWidth / fontSize)

    // Array to track the y position of each column
    const drops: number[] = []
    // Array to track the color of each column (0: green, 1: blue)
    const colors: number[] = []

    // Initialize drops and colors
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100 // Start above screen
      colors[i] = Math.random() > 0.7 ? 1 : 0 // 30% chance of blue, 70% green
    }

    let animationFrameId: number
    let frameCount = 0

    function draw() {
      frameCount++

      // Semi-transparent black background for trail effect
      // Occasionally pulse the whole matrix with a blue tint
      const isPulse = frameCount % 500 === 0
      if (isPulse) {
        context.fillStyle = "rgba(0, 10, 20, 0.05)" // Subtle blue tint
      } else {
        context.fillStyle = "rgba(0, 0, 0, 0.04)"
      }
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)

      context.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Randomly change colors occasionally (every ~300 frames per column)
        if (Math.random() > 0.997) {
          colors[i] = colors[i] === 0 ? 1 : 0
        }

        // Choose color based on the column's current color state
        const isBlue = colors[i] === 1

        // Bright color for the leading character
        if (drops[i] * fontSize > canvasElement.height - fontSize * 3) {
          context.fillStyle = isBlue ? "#00c8ff" : "#00ff00" // Bright blue or green
        } else {
          // Gradient effect - brighter at the front
          const alpha = Math.max(
            0,
            1 -
              (canvasElement.height - drops[i] * fontSize) /
                (canvasElement.height * 0.3)
          )
          context.fillStyle = isBlue
            ? `rgba(0, 200, 255, ${alpha})`
            : `rgba(0, 255, 0, ${alpha})`
        }

        // Random character
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]

        // Draw the character
        context.fillText(char, i * fontSize, drops[i] * fontSize)

        // Move drop down
        drops[i]++

        // Reset drop to top with random delay and possibly change color
        if (drops[i] * fontSize > window.innerHeight + Math.random() * 10000) {
          drops[i] = Math.random() * -100
          // 15% chance to change color when resetting
          if (Math.random() > 0.85) {
            colors[i] = colors[i] === 0 ? 1 : 0
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    // Start animation
    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#000",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          background: "#000",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}

export default MatrixRain
