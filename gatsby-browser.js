import "@fontsource/dm-sans"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/700.css"
import "@fontsource/dm-mono"
import "@fontsource/dm-mono/500.css"

// const facebookPixelId = process.env.GATSBY_FACEBOOK_PIXEL_ID;

// export const onClientEntry = () => {
//     if (typeof window !== 'undefined') {
//       !function(f,b,e,v,n,t,s)
//       {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//       n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//       if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//       n.queue=[];t=b.createElement(e);t.async=!0;
//       t.src=v;s=b.getElementsByTagName(e)[0];
//       s.parentNode.insertBefore(t,s)}(window, document,'script',
//       'https://connect.facebook.net/en_US/fbevents.js');
//       fbq('init', '515492541521568');
//       fbq('track', 'PageView');
//     }
//   };

export const onClientEntry = () => {
  const tawkToPropertyId = process.env.GATSBY_TAWKTO_PROPERTY_ID
  const tawkToWidgetId = process.env.GATSBY_TAWKTO_WIDGET_ID || "default"

  if (typeof window === "undefined" || !tawkToPropertyId) return

  const inject = () => {
    try {
      window.Tawk_API = window.Tawk_API || {}
      const s1 = document.createElement("script")
      s1.async = true
      s1.src = `https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}`
      s1.charset = "UTF-8"
      s1.crossOrigin = "anonymous"
      const s0 = document.getElementsByTagName("script")[0]
      s0.parentNode.insertBefore(s1, s0)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Tawk.to injection failed", err)
    }
  }

  // Defer chat widget injection off the critical first-paint path. Wait until
  // the browser is idle (or a short fallback timeout), then inject. This keeps
  // Tawk.to's ~25KB + beacons off the main thread during LCP.
  const ric = window.requestIdleCallback
  if (ric) {
    ric(() => setTimeout(inject, 3000), { timeout: 6000 })
  } else {
    setTimeout(inject, 5000)
  }
}
