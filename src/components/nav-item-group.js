import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Flex, FlexList, NavButtonLink, NavLink } from "./ui"
import * as styles from "./nav-item-group.css"

export default function NavItemGroup({ name, navItems = [], onItemClick }) {
  // Defensive check to ensure navItems is always an array
  const safeNavItems = Array.isArray(navItems) ? navItems : []
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [popupVisible, setPopupVisible] = React.useState(false)
  
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
      setIsOpen(false)
      setPopupVisible(false)
    }
  }, [isOpen])

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
      if (isOpen && wrapper && !wrapper.contains(event.target)) {
        setIsOpen(false)
        setPopupVisible(false)
      }
    }

    // Hide menu when pressing escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setPopupVisible(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [name, isOpen])

  return (
    <Flex
      data-id={`${name}-group-wrapper`}
      variant="columnStart"
      gap={4}
      className={styles.navGroupWrapper}
      style={{ position: 'relative', zIndex: 100 }}
    >
      <NavButtonLink
        onClick={onGroupButtonClick}
        className={`${styles.navGroupTitle} ${isOpen ? styles.navGroupTitleActive : ''}`}
      >
        {name}
      </NavButtonLink>
      {isOpen && (
        <Box
          data-id={`${name}-popup-box`}
          className={
            styles.navLinkListWrapper[popupVisible ? "opened" : "closed"]
          }
          style={{ 
            zIndex: 200, 
            position: 'absolute', 
            top: '100%', 
            left: 0,
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '250px'
          }}
        >
          <FlexList
            variant="columnStart"
            gap={2}
            className={styles.navLinkListWrapperInner}
          >
            {safeNavItems && safeNavItems.length > 0 && safeNavItems.map((navItem) => (
              <li key={navItem.id}>
                <NavLink 
                  to={navItem.href} 
                  className={styles.navLinkListLink}
                  onClick={handleSubItemClick}
                >
                  <Flex variant="start" gap={3}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#2d3748',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}>
                      {navItem.icon && navItem.icon.gatsbyImageData ? (
                        <GatsbyImage
                          alt={navItem.icon.alt || navItem.text}
                          image={getImage(navItem.icon.gatsbyImageData)}
                          className={styles.navIcon}
                          style={{ zIndex: 250 }}
                        />
                      ) : (
                        <span style={{ color: '#a0aec0' }}>
                          {navItem.text === 'Music Production' ? '🎵' :
                           navItem.text === 'Music and Stem Mixing' ? '🎧' :
                           navItem.text === 'Tutorials' ? '📚' : '🔧'}
                        </span>
                      )}
                    </div>
                    <Flex variant="columnStart" marginY={1} gap={0}>
                      <Box as="span" className={styles.navLinkTitle}>
                        {navItem.text}
                      </Box>
                      {!!navItem.description && (
                        <Box as="p" className={styles.navLinkDescription}>
                          {navItem.description}
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                </NavLink>
              </li>
            ))}
          </FlexList>
        </Box>
      )}
    </Flex>
  )
}
