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
import StaggeredMenu from "./StaggeredMenu"

export default function Header() {
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

  let navItems = []
  let cta = null
  if (data?.contentfulLayoutHeader?.navItems) {
    navItems = data.contentfulLayoutHeader.navItems
  }
  if (data?.contentfulLayoutHeader?.cta) {
    cta = data.contentfulLayoutHeader.cta
  }

  const [isOpen, setOpen] = React.useState(false)
  const [isMobileView, setIsMobileView] = React.useState(false)
  const menuButtonRef = React.useRef(null)
  const firstNavLinkRef = React.useRef(null)
  const previousActiveElement = React.useRef(null)
  const overlayRef = React.useRef(null)

  const menuItems = React.useMemo(() => {
    const out = []
    navItems?.forEach((navItem) => {
      if (navItem.navItemType === "Group") {
        navItem.navItems?.forEach((sub) => {
          out.push({ label: sub.text || sub.name || "Item", ariaLabel: `Go to ${sub.text || sub.name || 'item'}`, link: sub.href || "#" })
        })
      } else {
        out.push({ label: navItem.text || navItem.name || "Item", ariaLabel: `Go to ${navItem.text || navItem.name || 'item'}`, link: navItem.href || "#" })
      }
    })
    return out
  }, [navItems])

  const [locale, setLocale] = React.useState(() => {
    if (typeof window !== "undefined") return window.localStorage.getItem("locale") || "en"
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
    if (isOpen) document.body.style.overflowY = "hidden"
    else document.body.style.overflowY = "visible"

    try {
      const main = document.getElementById("main-content")
      if (main) {
        if (isOpen) main.setAttribute("aria-hidden", "true")
        else main.removeAttribute("aria-hidden")
      }
    } catch (e) {}

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
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    setTimeout(() => {
      if (firstNavLinkRef.current) firstNavLinkRef.current.focus()
    }, 50)
    return () => {
      document.removeEventListener("keydown", handleKey)
      if (previousActiveElement.current && previousActiveElement.current.focus) previousActiveElement.current.focus()
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target) && menuButtonRef.current && !menuButtonRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Track viewport size to only show the staggered menu on mobile
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 1024px)')
    const setMatch = () => setIsMobileView(mq.matches)
    setMatch()
    if (mq.addEventListener) mq.addEventListener('change', setMatch)
    else mq.addListener(setMatch)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', setMatch)
      else mq.removeListener(setMatch)
    }
  }, [])

  return (
    <header>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

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
                      <NavItemGroup name={navItem.text || navItem.name} navItems={navItem.navItems} />
                    ) : (
                      <NavLink to={navItem.href}>{navItem.text}</NavLink>
                    )}
                  </li>
                ))}
            </FlexList>
          </nav>
          <div className={desktopNav}>{cta && <Button to={cta.href}>{cta.text}</Button>}</div>
        </Flex>
      </Container>

      <Container className={mobileHeaderNavWrapper[isOpen ? "open" : "closed"]}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <NavLink to="/" className={mobileLogo} style={{ filter: isOpen ? "invert(100%)" : undefined }}>
            <VisuallyHidden>Home</VisuallyHidden>
            <BrandLogo />
          </NavLink>
          <Flex gap={3}>
            <div>
              <Button onClick={toggleLocale} aria-label={`Switch language, current ${locale}`} variant="ghost">
                {locale.toUpperCase()}
              </Button>
            </div>
            {/* StaggeredMenu renders its own toggle button and will show the CTA inside the menu on mobile */}
          </Flex>
        </Flex>
      </Container>

      {isMobileView && (
        <StaggeredMenu
          cta={cta}
          position="right"
          items={menuItems}
          socialItems={[]}
          displaySocials={false}
          displayItemNumbering={true}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={["#B19EEF", "#5227FF"]}
          logoUrl={undefined}
          accentColor="#5227FF"
          isFixed
          closeOnClickAway
          locale={locale}
          onToggleLocale={toggleLocale}
          onMenuOpen={() => setOpen(true)}
          onMenuClose={() => setOpen(false)}
        />
      )}
    </header>
  )
}
