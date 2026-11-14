import * as React from "react"
import * as styles from "./blocks.css"

// A self-contained variant of the site's matrix-rain effect, scoped to its
// parent element instead of the full viewport (the original
// src/components/matrix-rain.tsx is position:fixed and sized to
// window.innerWidth/innerHeight, so it can't be dropped inside a normal
// content block without hijacking the whole page).
export default function ContainedMatrixRain() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"
    const fontSize = 16
    let columns = 0
    let drops: number[] = []
    let colors: number[] = []
    let animationFrameId: number

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      columns = Math.max(1, Math.floor(width / fontSize))
      drops = Array.from({ length: columns }, () => Math.random() * -40)
      colors = Array.from({ length: columns }, () => (Math.random() > 0.7 ? 1 : 0))
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    const draw = () => {
      const height = canvas.getBoundingClientRect().height
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const isBlue = colors[i] === 1
        ctx.fillStyle = isBlue ? "rgba(0, 216, 255, 0.8)" : "rgba(0, 255, 51, 0.7)"
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.matrixCanvasLayer} />
}
