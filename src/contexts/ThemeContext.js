import * as React from "react"
import PropTypes from "prop-types"

const themes = {
  en: {
    fontFamily: "Arial, sans-serif",
    direction: "ltr",
    primaryColor: "#000",
  },
  es: {
    fontFamily: "Arial, sans-serif",
    direction: "ltr",
    primaryColor: "#000",
  },
  ar: { // Example for Arabic
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
    primaryColor: "#000",
  },
}

export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children, locale }) => {
  const theme = themes[locale] || themes.en
  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ fontFamily: theme.fontFamily, direction: theme.direction }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}