import React, { useState, useRef, useEffect } from "react"
import "../GooeyNav/gooey-nav.css"
import "./gooey-nav2.css"
import "./hover-blobs.css"

const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "beats", label: "Beats", href: "/beats" },
  { id: "mixes", label: "Mixes", href: "/mixes" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
]

export default function GooeyNav2({ style = {}, className = "" }) {
  const [active, setActive] = useState(null)
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [blobPos, setBlobPos] = useState({
    x: "-9999px",
    y: "-9999px",
    visible: false,
  })

  useEffect(() => {
    if (active === null) {
      setBlobPos({ x: "-9999px", y: "-9999px", visible: false })
      return
    }

    const li = itemRefs.current[active]
    if (!li || !navRef.current) {
      setBlobPos({ x: "-9999px", y: "-9999px", visible: false })
      return
    }

    const navRect = navRef.current.getBoundingClientRect()
    const dot = li.querySelector(".gm-dot")
    const dotRect = dot
      ? dot.getBoundingClientRect()
      : li.getBoundingClientRect()

    const x = dotRect.left - navRect.left + dotRect.width / 2 - 36
    const y = dotRect.top - navRect.top + dotRect.height / 2 - 28

    setBlobPos({ x: `${x}px`, y: `${y}px`, visible: true })
  }, [active])

  return (
    <div className={`gm-gooey-wrap ${className}`} style={style}>
      <svg width="0" height="0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <nav className="gm-gooey-nav" aria-label="Main" ref={navRef}>
        <div className="gm-blobs">
          <div
            className="gm-blob"
            style={{
              left: blobPos.x,
              top: blobPos.y,
              opacity: blobPos.visible ? 1 : 0,
            }}
          />
          <div
            className="gm-blob gm-blob--small"
            style={{
              left: blobPos.x,
              top: blobPos.y,
              opacity: blobPos.visible ? 0.9 : 0,
            }}
          />
          <div
            className="gm-blob gm-blob--tiny"
            style={{
              left: blobPos.x,
              top: blobPos.y,
              opacity: blobPos.visible ? 0.75 : 0,
            }}
          />
        </div>
        <ul>
          {items.map((it, idx) => (
            <li
              key={it.id}
              className={active === idx ? "active" : ""}
              ref={(el) => (itemRefs.current[idx] = el)}
            >
              <a
                href={it.href}
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                aria-current={active === idx ? "page" : undefined}
              >
                <span className="gm-dot" />
                <span className="gm-label">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
