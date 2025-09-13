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
          <div className={desktopNav}>
            {cta && <Button to={cta.href}>{cta.text}</Button>}
          </div>
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
                <Button to={cta.Href} variant={isOpen ? "reversed" : "primary"}>
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
