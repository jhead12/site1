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
  Nudge,
  VisuallyHidden,
} from "./ui"
import {
  desktopHeaderNavWrapper,
  mobileHeaderNavWrapper,
  mobileNavSVGColorWrapper,
  mobileNavOverlay,
  mobileNavLink,
  navAlignment,
  navHover,
  navItemBase,
  navListItem,
  desktopHeaderNavList,
} from "./header.css"
import NavItemGroup from "./nav-item-group"
import BrandLogo from "./brand-logo"
import { useAuth } from "../hooks/useAuth"
// import EmbedPage from "../components/header-scripts"


export default function Header() {
  const { isAdmin } = useAuth()
  
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
          // Only show Analytics for WordPress admin users
          ...(isAdmin ? [{ id: "analytics", navItemType: "LINK", href: "/auth/user/analytics", text: "Analytics" }] : []),
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
                icon: {
                  alt: "Music Production",
                  gatsbyImageData: null // Will be replaced with actual icon data when available
                }
              },
              { 
                id: "mixing", 
                href: "/mixes", 
                text: "Music and Stem Mixing",
                description: "Professional mixing and mastering",
                icon: {
                  alt: "Mixing",
                  gatsbyImageData: null // Will be replaced with actual icon data when available
                }
              },
              { 
                id: "tutorials", 
                href: "/tutorials", 
                text: "Tutorials",
                description: "Learn music production techniques",
                icon: {
                  alt: "Tutorials",
                  gatsbyImageData: null // Will be replaced with actual icon data when available
                }
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
  console.log("Site title from query:", queryData?.site?.siteMetadata?.title)
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
          <nav className={navAlignment}>
            <FlexList gap={4} className={desktopHeaderNavList}>
              {navItems &&
                navItems.map((navItem) => (
                  <li key={navItem.id} className={navListItem}>
                    {navItem.navItemType === "Group" ? (
                      <NavItemGroup
                        name={navItem.text || navItem.name}
                        navItems={navItem.navItems}
                      />
                    ) : (
                      <NavLink to={navItem.href} className={`${navItemBase} ${navHover}`}>{navItem.text}</NavLink>
                    )}
                  </li>
                ))}
            </FlexList>
          </nav>
          <div>{cta && <Button to={cta.href}>{cta.text}</Button>}</div>
        </Flex>
      </Container>
      
      {/* Mobile Navigation Header */}
      <Container className={mobileHeaderNavWrapper[isOpen ? "open" : "closed"]}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <span
            className={
              mobileNavSVGColorWrapper[isOpen ? "reversed" : "primary"]
            }
          >
            <NavLink to="/">
              <VisuallyHidden>Home</VisuallyHidden>
              <BrandLogo />
            </NavLink>
          </span>
          <Flex>
            <Space />
            <div>
              {cta && (
                <Button to={cta.href} variant={isOpen ? "reversed" : "primary"}>
                  {cta.text}
                </Button>
              )}
            </div>
            <Nudge right={3}>
              <InteractiveIcon
                title="Toggle menu"
                onClick={() => setOpen(!isOpen)}
                className={
                  mobileNavSVGColorWrapper[isOpen ? "reversed" : "primary"]
                }
              >
                {isOpen ? <X /> : <Menu />}
              </InteractiveIcon>
            </Nudge>
          </Flex>
        </Flex>
      </Container>
      
      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className={mobileNavOverlay}>
          <nav>
            <FlexList responsive variant="stretch">
              {navItems?.map((navItem) => (
                <li key={navItem.id}>
                  {navItem.navItemType === "Group" ? (
                    <NavItemGroup
                      name={navItem.text || navItem.name}
                      navItems={navItem.navItems}
                      onItemClick={() => setOpen(false)}
                    />
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
          </nav>
        </div>
      )}
    </header>
  )
}
