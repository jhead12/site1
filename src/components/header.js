import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { isBypassWordpressEnabled } from "../utils/bypass-helper"
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
  mobileNavOverlay,
  mobileNavLink,
  desktopHeaderNavWrapper,
  mobileHeaderNavWrapper,
  mobileNavSVGColorWrapper,
} from "./header.css"
import NavItemGroup from "./nav-item-group"
import BrandLogo from "./brand-logo"
// import EmbedPage from "../components/header-scripts"


export default function Header() {
  const bypassWordpress = isBypassWordpressEnabled();
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
              { id: "music-production", href: "/music", text: "Music Production" },
              { id: "mixing", href: "/mixes", text: "Music and Stem Mixing" },
              { id: "tutorials", href: "/tutorials", text: "Tutorials" }
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
      # Query navigation items directly from Contentful
      allContentfulNavItemGroup {
        nodes {
          id
          name
          href
          text
          description
          navItems {
            id
            href
            text
            description
          }
        }
      }
      allContentfulNavItem {
        nodes {
          id
          href
          text
          description
        }
      }
    }
  `)

  // Process navigation data - prioritize mock data until Contentful hrefs are configured
  let navItems = []
  let cta = null
  
  // For now, use mock data as primary source since Contentful items may not have hrefs set
  console.log("Using mock navigation data (Contentful hrefs not configured)")
  if (mockData?.layout?.header?.navItems) {
    navItems = mockData.layout.header.navItems
  }
  if (mockData?.layout?.header?.cta) {
    cta = mockData.layout.header.cta
  }
  
  // TODO: Once Contentful navigation items have proper href values, we can switch back to:
  // if (queryData && (queryData.allContentfulNavItem?.nodes?.length > 0 || queryData.allContentfulNavItemGroup?.nodes?.length > 0)) {
  
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
      <Container className={desktopHeaderNavWrapper}>
        <Space size={2} />
        <Flex variant="spaceBetween">
          <NavLink to="/">
            <VisuallyHidden>Home</VisuallyHidden>
            <BrandLogo />
          </NavLink>
          <nav>
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
          <div>{cta && <Button to={cta.href}>{cta.text}</Button>}</div>
        </Flex>
      </Container>
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
