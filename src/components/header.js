import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
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
} from "./header.css"
import NavItemGroup from "./nav-item-group"
import BrandLogo from "./brand-logo"
// import EmbedPage from "../components/header-scripts"


export default function Header() {
  const mockData = {
    layout: {
      header: {
        id: "header-mock",
        navItems: [
          { id: "home", navItemType: "LINK", href: "/", text: "Home" },
          { id: "blog", navItemType: "LINK", href: "/blog", text: "Blog" },
          { id: "videos", navItemType: "LINK", href: "/videos", text: "Videos" },
          { id: "beats", navItemType: "LINK", href: "/beats", text: "Beats" },
          { id: "music", navItemType: "LINK", href: "/music", text: "Music" },
          { 
            id: "services", 
            navItemType: "Group", 
            name: "Services",
            navItems: [
              { 
                id: "music-production", 
                href: "/music", 
                text: "Music Production",
                description: "Professional music production services",
                icon: null // No icon available in mock data
              },
              { 
                id: "mixing", 
                href: "/mixes", 
                text: "Music and Stem Mixing",
                description: "Professional mixing and mastering",
                icon: null // No icon available in mock data
              },
              { 
                id: "tutorials", 
                href: "/tutorials", 
                text: "Tutorials",
                description: "Learn music production techniques",
                icon: null // No icon available in mock data
              }
            ]
          },
          { id: "about", navItemType: "LINK", href: "/about", text: "About" },
          { id: "shop", navItemType: "LINK", href: "/shop", text: "Shop" }
        ],
        cta: {
          id: "contact",
          href: "/contact",
          text: "Contact"
        }
      }
    }
  };

  // This is the actual query - it will be processed normally by Gatsby
  const queryData = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  // Process navigation data - use mock data for now
  let navItems = []
  let cta = null
  
  // Use mock data for navigation
  console.log("Using mock navigation data")
  if (mockData?.layout?.header?.navItems) {
    navItems = mockData.layout.header.navItems
  }
  if (mockData?.layout?.header?.cta) {
    cta = mockData.layout.header.cta
  }
  
  const [isOpen, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden"
    } else {
      document.body.style.overflowY = "visible"
    }
  }, [isOpen])

  return (
    <header>
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
          <div className={desktopNav}>{cta && <Button to={cta.href}>{cta.text}</Button>}</div>
        </Flex>
      </Container>
      
      {/* Mobile Navigation Header */}
      <Container className={mobileHeaderNavWrapper[isOpen ? "open" : "closed"]}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <NavLink to="/" className={mobileLogo}>
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
            <InteractiveIcon
              title="Toggle menu"
              onClick={() => setOpen(!isOpen)}
              className={mobileMenuButton}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X /> : <Menu />}
            </InteractiveIcon>
          </Flex>
        </Flex>
      </Container>
      
      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className={mobileNavOverlay}>
          <nav style={{ marginTop: "80px" }}>
            <FlexList responsive variant="stretch">
              {navItems?.map((navItem) => (
                <li key={navItem.id}>
                  {navItem.navItemType === "Group" ? (
                    <div>
                      <div style={{ 
                        color: "#ffffff", 
                        fontSize: "1.25rem", 
                        fontWeight: "600",
                        paddingTop: "1rem",
                        paddingBottom: "0.5rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        marginBottom: "0.5rem"
                      }}>
                        {navItem.text || navItem.name}
                      </div>
                      {navItem.navItems?.map((subItem) => (
                        <NavLink
                          key={subItem.id}
                          to={subItem.href}
                          className={mobileNavLink}
                          onClick={() => setOpen(false)}
                          style={{ 
                            fontSize: "1rem",
                            paddingLeft: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem"
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
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
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
