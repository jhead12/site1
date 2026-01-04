import * as React from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client"

const client = new ApolloClient({
  uri: process.env.WPGRAPHQL_URL,
  cache: new InMemoryCache(),
})

// client
//   .query({
//     query: gql`
//       query GetLocations {
//         locations {
//           id
//           name
//           description
//           photo
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result));

export const onRenderBody = ({
  setHeadComponents,
  setPostBodyComponents,
  setHtmlAttributes,
}) => {
  // Ensure HTML `lang` attribute is present for accessibility
  const siteLocale = process.env.SITE_LOCALE || process.env.LOCALE || "en-US"
  setHtmlAttributes && setHtmlAttributes({ lang: siteLocale })
  const facebookPixelId = process.env.GATSBY_FACEBOOK_PIXEL_ID
  const tawkToPropertyId = process.env.GATSBY_TAWKTO_PROPERTY_ID
  const tawkToWidgetId = process.env.GATSBY_TAWKTO_WIDGET_ID || "default"

  setHeadComponents(
    [
      // Content-Language / Open Graph locale for social previews
      <meta
        key="content-language"
        httpEquiv="Content-Language"
        content={siteLocale}
      />,
      <meta key="og-locale" property="og:locale" content={siteLocale} />,
      <script
        key="meta-pixel-script"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />,
      // Tawk.to Live Chat Widget
      tawkToPropertyId && (
        <script
          key="tawkto-script"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      ),
    ].filter(Boolean)
  )

  setPostBodyComponents([
    <noscript key="meta-pixel-noscript">
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
        alt="Meta Pixel"
      />
    </noscript>,
  ])
}
