import * as React from "react"
import { useLocation } from "@reach/router" // this helps tracking the location
import { initializeAndTrack } from 'gatsby-plugin-gdpr-cookies'

export default function Head({ title, description, image }) {

  const location = useLocation()
initializeAndTrack(location)
  return (
    <>
      <meta charSet="utf-8" />
      <title>{"Matrixblend: Jeldon Music"}</title>
      {description && (
        <meta
          name="description"
          property="og:description"
          content={description}
        />
      )}
      <meta property="og:title" content={title} />
      {image && <meta property="og:image" content={image.url} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image.url} />}
        
    </>
  )
}

// <!-- Meta Pixel Code -->
// <script>
// !function(f,b,e,v,n,t,s)
// {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
// n.callMethod.apply(n,arguments):n.queue.push(arguments)};
// if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
// n.queue=[];t=b.createElement(e);t.async=!0;
// t.src=v;s=b.getElementsByTagName(e)[0];
// s.parentNode.insertBefore(t,s)}(window, document,'script',
// 'https://connect.facebook.net/en_US/fbevents.js');
// fbq('init', '515492541521568');
// fbq('track', 'PageView');
// </script>
// <noscript><img height="1" width="1" style="display:none"
// src="https://www.facebook.com/tr?id=515492541521568&ev=PageView&noscript=1"
// /></noscript>
// <!-- End Meta Pixel Code -->
