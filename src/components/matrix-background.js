import * as React from "react"
import { matrixCanvas, matrixContainer } from "./matrix-background.css"

export default function MatrixBackground() {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters - mix of katakana, hiragana, and some ASCII
    const matrixChars = "アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズブヅプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    // Convert to array for easier access
    const chars = matrixChars.split("")
    
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // Array to store y position of each column
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height
    }
    
    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Matrix green text
      ctx.fillStyle = '#00ff41'
      ctx.font = fontSize + 'px monospace'
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)]
        
        // Create color variations with blue tones
        const colorVariation = Math.random()
        let fillColor = '#00ff41' // Default matrix green
        
        if (colorVariation > 0.85) {
          // Bright blue highlights
          fillColor = '#00bfff'
        } else if (colorVariation > 0.70) {
          // Cyan blue
          fillColor = '#00ffff'
        } else if (colorVariation > 0.55) {
          // Electric blue
          fillColor = '#0080ff'
        } else if (colorVariation > 0.40) {
          // Teal blue-green
          fillColor = '#00ff80'
        }
        
        // Draw character at current position
        ctx.fillStyle = fillColor
        ctx.fillText(char, i * fontSize, drops[i])
        
        // Add some brighter leading characters with white/bright blue
        if (Math.random() > 0.98) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#80dfff'
          ctx.fillText(char, i * fontSize, drops[i])
        }
        
        // Reset drop to top randomly or when it reaches bottom
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        
        // Move drop down
        drops[i] += fontSize
      }
    }
    
    // Animation loop
    const interval = setInterval(draw, 35)
    
    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={matrixContainer} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -999999, pointerEvents: 'none' }}>
      <canvas 
        ref={canvasRef}
        className={matrixCanvas}
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -999999, pointerEvents: 'none' }}
      />
    </div>
  )
}
