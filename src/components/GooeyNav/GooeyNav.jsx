import React, { useState } from 'react'
import './gooey-nav.css'

const items = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'beats', label: 'Beats', href: '/beats' },
  { id: 'mixes', label: 'Mixes', href: '/mixes' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

export default function GooeyNav({ style = {}, className = '' }) {
  const [active, setActive] = useState(null)

  return (
    <div className={`gm-gooey-wrap ${className}`} style={style}>
      <svg width="0" height="0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <nav className="gm-gooey-nav" aria-label="Main">
        <div className="gm-blobs" />
        <ul>
          {items.map((it, idx) => (
            <li key={it.id} className={active === idx ? 'active' : ''}>
              <a
                href={it.href}
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                aria-current={active === idx ? 'page' : undefined}
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
