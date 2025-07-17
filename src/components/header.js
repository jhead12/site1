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
            icon {
              alt
              gatsbyImageData(width: 32, height: 32)
            }
          }
        }
      }
      allContentfulNavItem {
        nodes {
          id
          href
          text
          description
          icon {
            alt
            gatsbyImageData(width: 32, height: 32)
          }
        }
      }
    }
  `)

  // Process navigation data - use Contentful data if available, fallback to mock data
  let navItems = []
  let cta = null
  
  // Check if we have Contentful data available
  if (queryData && (queryData.allContentfulNavItem?.nodes?.length > 0 || queryData.allContentfulNavItemGroup?.nodes?.length > 0)) {
    console.log("Using Contentful navigation data with icons")
    console.log("Contentful data:", queryData) // Debug log
    
    // Combine individual nav items and nav groups
    const contentfulNavItems = queryData.allContentfulNavItem?.nodes || []
    const contentfulNavGroups = queryData.allContentfulNavItemGroup?.nodes || []
    
    console.log("Nav items:", contentfulNavItems) // Debug log
    console.log("Nav groups:", contentfulNavGroups) // Debug log
    
    // Create a hybrid approach: use mock data structure with Contentful icons
    const mockNavItems = mockData?.layout?.header?.navItems || []
    
    // Map mock navigation with Contentful icons where available
    navItems = mockNavItems.map(mockItem => {
      if (mockItem.navItemType === "Group") {
        // Find matching Contentful group
        const contentfulGroup = contentfulNavGroups.find(cg => 
          cg.name?.toLowerCase().includes(mockItem.name?.toLowerCase()) ||
          cg.text?.toLowerCase().includes(mockItem.name?.toLowerCase())
        )
        
        return {
          ...mockItem,
          navItems: mockItem.navItems.map(mockSubItem => {
            // Find matching Contentful nav item for icons
            const contentfulItem = contentfulNavItems.find(ci => 
              ci.text?.toLowerCase().includes(mockSubItem.text?.toLowerCase())
            ) || (contentfulGroup?.navItems || []).find(cni =>
              cni.text?.toLowerCase().includes(mockSubItem.text?.toLowerCase())
            )
            
            return {
              ...mockSubItem,
              icon: contentfulItem?.icon || null,
              description: contentfulItem?.description || mockSubItem.description
            }
          })
        }
      } else {
        // Find matching Contentful item for regular nav items
        const contentfulItem = contentfulNavItems.find(ci => 
          ci.text?.toLowerCase().includes(mockItem.text?.toLowerCase())
        )
        
        return {
          ...mockItem,
          icon: contentfulItem?.icon || null,
          description: contentfulItem?.description || mockItem.description
        }
      }
    })
    
    console.log("Processed hybrid navItems:", navItems) // Debug log
    
    // Use mock CTA for now
    cta = mockData?.layout?.header?.cta
  } else {
    // Fallback to mock data when Contentful is not available
    console.log("Using mock navigation data (Contentful not available)")
    if (mockData?.layout?.header?.navItems) {
      navItems = mockData.layout.header.navItems
    }
    if (mockData?.layout?.header?.cta) {
      cta = mockData.layout.header.cta
    }
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
