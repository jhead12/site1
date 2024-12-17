import "@fontsource/dm-sans"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/700.css"
import "@fontsource/dm-mono"
import "@fontsource/dm-mono/500.css"

export const onClientEntry = () => {
    if (typeof window !== "undefined" && window.gatsbyPluginGDPRCookiesOptions) {
      const options = window.gatsbyPluginGDPRCookiesOptions;
      // Initialize the plugin here
    }
  };
  