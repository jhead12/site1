import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { navigate } from "gatsby"
import { Menu, X } from "react-feather"
import {
  Container,
  Flex,
  FlexList,
  Space,
  NavLink,
  Button,
  InteractiveIcon,
  VisuallyHidden,
} from "./ui"
import {
  mobileNavOverlay,
  mobileNavLink,
  desktopHeaderNavWrapper,
  mobileHeaderNavWrapper,
  mobileCTAButton,
  mobileLogo,
  mobileMenuButton,
  desktopNav,
  mobilePrelayers,
  mobilePrelayer,
} from "./header.css"
import NavItemGroup from "./nav-item-group"
import BrandLogo from "./brand-logo"
// import EmbedPage from "../components/header-scripts"

export default function Header() {
  // Query Contentful for navigation data
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      contentfulLayoutHeader {
        navItems {
          id
          navItemType
          href
          text
          name
          ... on ContentfulNavItemGroup {
            navItems {
              id
              href
              text
              name
              description
              icon {
                url
                title
                description
                gatsbyImageData(width: 32, height: 32)
              }
            }
          }
        }
        cta {
          id
          href
          text
        }
      }
    }
  `)

  // Use Contentful data for navigation
  let navItems = []
  let cta = null
  if (data?.contentfulLayoutHeader?.navItems) {
    navItems = data.contentfulLayoutHeader.navItems
  }
  if (data?.contentfulLayoutHeader?.cta) {
    cta = data.contentfulLayoutHeader.cta
  }

  const [isOpen, setOpen] = React.useState(false)
  const menuButtonRef = React.useRef(null)
  const firstNavLinkRef = React.useRef(null)
  const previousActiveElement = React.useRef(null)
  const overlayRef = React.useRef(null)

  const [locale, setLocale] = React.useState(() => {
    if (typeof window !== "undefined")
      return window.localStorage.getItem("locale") || "en"
    return "en"
  })

  const toggleLocale = () => {
    const next = locale === "en" ? "es" : "en"
    setLocale(next)
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("locale", next)
        const path = window.location.pathname || "/"
        navigate(`${path}?lang=${next}`)
      } catch (e) {
        // ignore
      }
    }
  }

  React.useEffect(() => {
    // lock scrolling when menu open
    if (isOpen) {
      document.body.style.overflowY = "hidden"
    } else {
      document.body.style.overflowY = "visible"
    }

    // toggle aria-hidden on main content to hide from AT when menu open
    try {
      const main = document.getElementById("main-content")
      if (main) {
        if (isOpen) main.setAttribute("aria-hidden", "true")
        else main.removeAttribute("aria-hidden")
      }
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        const main = document.getElementById("main-content")
        if (main) main.removeAttribute("aria-hidden")
      } catch (e) {}
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKey)
    // focus first nav link when opened
    setTimeout(() => {
      if (firstNavLinkRef.current) firstNavLinkRef.current.focus()
    }, 50)
    return () => {
      document.removeEventListener("keydown", handleKey)
      if (
        previousActiveElement.current &&
        previousActiveElement.current.focus
      ) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  // click-away handler for the mobile overlay
  React.useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <header>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* <EmbedPage/> */}
      {/* Desktop Navigation */}
      <Container className={desktopHeaderNavWrapper}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <NavLink to="/">
            <VisuallyHidden>Home</VisuallyHidden>
            <BrandLogo />
          </NavLink>
          <nav className={desktopNav}>
            <FlexList gap={4}>
              {navItems &&
                navItems.map((navItem) => (
                  <li key={navItem.id}>
                    {navItem.navItemType === "Group" ? (
                      <NavItemGroup
                        name={navItem.text || navItem.name}
                        navItems={navItem.navItems}
                      />
                    ) : (
                      <NavLink to={navItem.href}>{navItem.text}</NavLink>
                    )}
                  </li>
                ))}
            </FlexList>
          </nav>
          <div className={desktopNav}>
            {cta && <Button to={cta.href}>{cta.text}</Button>}
          </div>
        </Flex>
      </Container>

      {/* Mobile Navigation Header */}
      <Container className={mobileHeaderNavWrapper[isOpen ? "open" : "closed"]}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <NavLink
            to="/"
            className={mobileLogo}
            style={{ filter: isOpen ? "invert(100%)" : undefined }}
          >
            <VisuallyHidden>Home</VisuallyHidden>
            <BrandLogo />
          </NavLink>
          <Flex gap={3}>
            <div>
              {cta && (
                <Button to={cta.href} variant={isOpen ? "reversed" : "primary"}>
                  {cta.text}
                </Button>
              )}
            </div>
            {/* simple locale toggle */}
            <div>
              <Button
                onClick={toggleLocale}
                aria-label={`Switch language, current ${locale}`}
                variant="ghost"
              >
                {locale.toUpperCase()}
              </Button>
            </div>
            <InteractiveIcon
              title="Toggle menu"
              onClick={() => setOpen((s) => !s)}
              ref={menuButtonRef}
              className={mobileMenuButton}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-overlay"
            >
              {isOpen ? <X /> : <Menu />}
            </InteractiveIcon>
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          id="mobile-nav-overlay"
          ref={overlayRef}
          className={mobileNavOverlay}
          role="dialog"
          aria-modal="true"
          aria-hidden={isOpen ? "false" : "true"}
          tabIndex={-1}
        >
          <div className={mobilePrelayers} aria-hidden={true}>
            {["#B19EEF", "#5227FF", "#8B5CF6"].map((c, i) => (
              <div
                key={i}
                className={mobilePrelayer}
                style={{
                  background: c,
                  transform: `translateX(${(i + 1) * 8}%)`,
                  opacity: 0.12,
                }}
              />
            ))}
          </div>
          <nav style={{ marginTop: "80px" }}>
            <FlexList responsive variant="stretch">
              {navItems?.map((navItem) => (
                <li key={navItem.id}>
                  {navItem.navItemType === "Group" ? (
                    <div>
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          paddingTop: "1rem",
                          paddingBottom: "0.5rem",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {navItem.text || navItem.name}
                      </div>
                      {console.log("Nav Item:", navItem.text, navItem.href)}
                      {navItem.navItems?.map((subItem, idx) => (
                        <NavLink
                          key={subItem.id}
                          to={subItem.href}
                          className={mobileNavLink}
                          onClick={() => setOpen(false)}
                          ref={idx === 0 ? firstNavLinkRef : null}
                          style={{
                            fontSize: "1rem",
                            paddingLeft: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          {subItem.text}
                        </NavLink>
                      ))}
                    </div>
                  ) : (
                    <NavLink
                      to={navItem.href}
                      className={mobileNavLink}
                      onClick={() => setOpen(false)}
                    >
                      {navItem.text}
                    </NavLink>
                  )}
                </li>
              ))}
            </FlexList>

            {/* Mobile CTA */}
            {cta && (
              <div
                style={{
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <NavLink
                  to={cta.href}
                  className={mobileCTAButton}
                  onClick={() => setOpen(false)}
                >
                  {cta.text}
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
