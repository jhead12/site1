import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Flex, NavButtonLink, NavLink } from "./ui"
import Caret from "./caret"
import * as styles from "./nav-item-group.css"
import { media } from "./media.css"

export default function NavItemGroup({ name, navItems = [], onItemClick }) {
  // Defensive check to ensure navItems is always an array
  const safeNavItems = Array.isArray(navItems) ? navItems : []

  const [isOpen, setIsOpen] = React.useState(false)
  const [popupVisible, setPopupVisible] = React.useState(false)
  const closeTimeoutRef = React.useRef(null)
  const isSmallScreen = () => {
    return !window.matchMedia(media.small).matches
  }

  const handleSubItemClick = React.useCallback(() => {
    setIsOpen(false)
    setPopupVisible(false)
    if (onItemClick) {
      onItemClick()
    }
  }, [onItemClick])

  const onGroupButtonClick = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true)
      setPopupVisible(true)
    } else {
      // ensures that sub-menu closes when no animation is available
      if (isSmallScreen()) {
        setIsOpen(false)
      }
      setPopupVisible(false)
    }
  }, [isOpen])

  const handleMouseEnter = React.useCallback(() => {
    if (isSmallScreen()) return
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (!isOpen) {
      setIsOpen(true)
      setPopupVisible(true)
    } else {
      setPopupVisible(true)
    }
  }, [isOpen])

  const handleMouseLeave = React.useCallback(() => {
    if (isSmallScreen()) return
    setPopupVisible(false)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = null
    }, 180)
  }, [])

  React.useEffect(() => {
    // crude implementation of animating the popup without a library
    const popupBox = document.querySelector(`[data-id="${name}-popup-box"]`)
    const onAnimationEnd = ({ animationName }) => {
      if (animationName === `zoomOutDown`) {
        setIsOpen(false)
      }
    }
    if (popupBox) {
      popupBox.addEventListener("animationend", onAnimationEnd)
      return () => {
        popupBox.removeEventListener("animationend", onAnimationEnd)
      }
    }
  }, [isOpen, name])

  React.useEffect(() => {
    // hide menu when clicked outside
    const handleClickOutside = (event) => {
      const wrapper = document.querySelector(
        `[data-id="${name}-group-wrapper"]`
      )
      if (
        !isSmallScreen() &&
        isOpen &&
        wrapper &&
        !wrapper.contains(event.target)
      ) {
        onGroupButtonClick()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [name, isOpen, onGroupButtonClick])

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  return (
    <Flex
      data-id={`${name}-group-wrapper`}
      variant="columnStart"
      gap={4}
      className={styles.navGroupWrapper}
      style={{ position: "relative", zIndex: 100 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavButtonLink
        onClick={onGroupButtonClick}
        className={styles.navGroupTitle}
      >
        <Flex gap={1} className={styles.navGroupTitleInner}>
          {name}
          <Caret direction={isOpen ? "up" : "down"} />
        </Flex>
      </NavButtonLink>
      {isOpen && (
        <Box
          data-id={`${name}-popup-box`}
          className={
            styles.navLinkListWrapper[popupVisible ? "opened" : "closed"]
          }
          style={{
            zIndex: 200,
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#000000",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            minWidth: "250px",
          }}
        >
          {/* Card-style grid for dropdown items (desktop-first). */}
          <div className={styles.cardGrid}>
            {safeNavItems &&
              safeNavItems.length > 0 &&
              safeNavItems.map((navItem) => (
                <NavLink
                  key={navItem.id}
                  to={navItem.href}
                  className={styles.cardItem}
                  onClick={handleSubItemClick}
                >
                  <div className={styles.cardItemInner}>
                    {navItem.icon && navItem.icon.gatsbyImageData && (
                      <GatsbyImage
                        alt={navItem.icon.alt || navItem.text}
                        image={getImage(navItem.icon.gatsbyImageData)}
                        className={styles.navIcon}
                        style={{ zIndex: 250 }}
                      />
                    )}
                    <div className={styles.cardItemTitle}>{navItem.text}</div>
                    {!!navItem.description && (
                      <div className={styles.cardItemDescription}>
                        {navItem.description}
                      </div>
                    )}
                  </div>
                </NavLink>
              ))}
          </div>
        </Box>
      )}
    </Flex>
  )
}
