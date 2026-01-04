import React, { useRef, useEffect, useState } from "react"
import "./gooey-nav.css"

const GooeyNav = ({
  items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  animationTime = 600,
  particleCount = 8,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null)
  const navRef = useRef(null)
  const filterRef = useRef(null)
  const textRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const [navItems, setNavItems] = useState(items)
  const [attachedToHeader, setAttachedToHeader] = useState(false)

  const noise = (n = 1) => n / 2 - Math.random() * n

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10)
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    }
  }

  const makeParticles = (element) => {
    const d = particleDistances
    const r = particleR
    const bubbleTime = animationTime * 2 + timeVariance
    element.style.setProperty("--time", `${bubbleTime}ms`)

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2)
      const p = createParticle(i, t, d, r)
      element.classList.remove("active")

      setTimeout(() => {
        const particle = document.createElement("span")
        const point = document.createElement("span")
        particle.classList.add("particle")
        particle.style.setProperty("--start-x", `${p.start[0]}px`)
        particle.style.setProperty("--start-y", `${p.start[1]}px`)
        particle.style.setProperty("--end-x", `${p.end[0]}px`)
        particle.style.setProperty("--end-y", `${p.end[1]}px`)
        particle.style.setProperty("--time", `${p.time}ms`)
        particle.style.setProperty("--scale", `${p.scale}`)
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`)
        particle.style.setProperty("--rotate", `${p.rotate}deg`)

        point.classList.add("point")
        particle.appendChild(point)
        element.appendChild(particle)
        requestAnimationFrame(() => {
          element.classList.add("active")
        })
        setTimeout(() => {
          try {
            element.removeChild(particle)
          } catch {
            // ignore
          }
        }, t)
      }, 30)
    }
  }

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const pos = element.getBoundingClientRect()

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    }
    Object.assign(filterRef.current.style, styles)
    Object.assign(textRef.current.style, styles)
    textRef.current.innerText = element.innerText
  }

  const handleClick = (e, index) => {
    const liEl = e.currentTarget
    if (activeIndex === index) return

    setActiveIndex(index)
    updateEffectPosition(liEl)

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle")
      particles.forEach((p) => filterRef.current.removeChild(p))
    }

    if (textRef.current) {
      textRef.current.classList.remove("active")

      void textRef.current.offsetWidth
      textRef.current.classList.add("active")
    }

    if (filterRef.current) {
      makeParticles(filterRef.current)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const liEl = e.currentTarget.parentElement
      if (liEl) {
        handleClick({ currentTarget: liEl }, index)
      }
    }
  }

  useEffect(() => {
    // Attach to header nav if present and keep in sync with dynamic updates
    if (typeof document === "undefined") return

    const headerSelector = "nav.header_desktopNav__1fobsgf9"
    const headerNav = document.querySelector(headerSelector)
    let listeners = []
    let mo = null

    const syncHeaderLinks = () => {
      if (!headerNav) return
      const rawLinks = Array.from(headerNav.querySelectorAll("ul li a"))
      const links = rawLinks
        .map((a) => ({
          label: a.textContent.trim(),
          href: a.getAttribute("href"),
          el: a,
        }))
        .filter((i) => i.label)

      if (links.length) {
        setNavItems(links.map((l) => ({ label: l.label, href: l.href })))

        // attach listeners (clean previous first)
        listeners.forEach(({ a, onEnter, onClick }) => {
          a.removeEventListener("mouseenter", onEnter)
          a.removeEventListener("focus", onEnter)
          a.removeEventListener("click", onClick)
        })
        listeners = []

        links.forEach((linkObj, index) => {
          const a = linkObj.el
          const li = a.parentElement
          const onEnter = () => handleClick({ currentTarget: li }, index)
          const onClick = (e) => {
            e.preventDefault()
            handleClick({ currentTarget: li }, index)
            setTimeout(() => {
              window.location.href = a.href
            }, 220)
          }
          a.addEventListener("mouseenter", onEnter)
          a.addEventListener("focus", onEnter)
          a.addEventListener("click", onClick)
          listeners.push({ a, onEnter, onClick })
        })
      }
    }

    if (headerNav) {
      // Move container into header so positioning aligns
      if (containerRef.current && !attachedToHeader) {
        if (getComputedStyle(headerNav).position === "static") {
          headerNav.style.position = "relative"
        }
        headerNav.appendChild(containerRef.current)
        containerRef.current.style.position = "absolute"
        containerRef.current.style.left = "0"
        containerRef.current.style.top = "0"
        containerRef.current.style.width = "100%"
        setAttachedToHeader(true)
      }

      syncHeaderLinks()

      // watch for changes to header nav (dynamic links from Contentful/WP)
      mo = new MutationObserver(() => syncHeaderLinks())
      mo.observe(headerNav, { childList: true, subtree: true })
    }

    // fallback behaviours for local nav rendering
    if (!navRef.current || !containerRef.current)
      return () => {
        // cleanup listeners and observer
        listeners.forEach(({ a, onEnter, onClick }) => {
          a.removeEventListener("mouseenter", onEnter)
          a.removeEventListener("focus", onEnter)
          a.removeEventListener("click", onClick)
        })
        if (mo) mo.disconnect()
      }

    const activeLi = navRef.current.querySelectorAll("li")[activeIndex]
    if (activeLi) {
      updateEffectPosition(activeLi)
      textRef.current?.classList.add("active")
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi =
        navRef.current?.querySelectorAll("li")[activeIndex]
      if (currentActiveLi) updateEffectPosition(currentActiveLi)
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      listeners.forEach(({ a, onEnter, onClick }) => {
        a.removeEventListener("mouseenter", onEnter)
        a.removeEventListener("focus", onEnter)
        a.removeEventListener("click", onClick)
      })
      if (mo) mo.disconnect()
      resizeObserver.disconnect()
    }
  }, [activeIndex, attachedToHeader])

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      {!attachedToHeader && (
        <nav>
          <ul ref={navRef}>
            {navItems.map((item, index) => (
              <li
                key={index}
                className={activeIndex === index ? "active" : ""}
                onMouseEnter={(e) =>
                  handleClick({ currentTarget: e.currentTarget }, index)
                }
                onFocus={() => {
                  const li = navRef.current?.querySelectorAll("li")[index]
                  if (li) handleClick({ currentTarget: li }, index)
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    const li = e.currentTarget.parentElement
                    if (li) handleClick({ currentTarget: li }, index)
                    setTimeout(() => {
                      window.location.href = e.currentTarget.href
                    }, 220)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  )
}

export default GooeyNav
