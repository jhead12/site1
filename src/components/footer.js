import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import {
  Twitter,
  Twitch,
  Instagram,
  Facebook,
  Youtube,
  GitHub,
  Headphones,
} from "react-feather"
import {
  Container,
  Flex,
  FlexList,
  Box,
  Space,
  NavLink,
  Text,
  IconLink,
  VisuallyHidden,
} from "./ui"
import BrandLogo from "./brand-logo"

const socialMedia = {
  TWITTER: {
    url: "https://twitter.com",
    name: "Twitter",
    icon: <Twitter />,
  },
  SOUNDCLOUD: {
    url: "https://soundcloud.com",
    name: "SoundCloud",
    icon: <Headphones />,
  },
  INSTAGRAM: {
    url: "https://instagram.com",
    name: "Instagram",
    icon: <Instagram />,
  },
  FACEBOOK: {
    url: "https://facebook.com",
    name: "Facebook",
    icon: <Facebook />,
  },
  YOUTUBE: {
    url: "https://youtube.com",
    name: "YouTube",
    icon: <Youtube />,
  },
  GITHUB: {
    url: "https://github.com",
    name: "GitHub",
    icon: <GitHub />,
  },
  TWITCH: {
    url: "https://twitch.tv",
    name: "Twitch",
    icon: <Twitch />,
  },
 
}

const getSocialURL = ({ service, username }) => {
  const domain = socialMedia[service]?.url
  if (!domain) return false
  return `${domain}/${username}`
}

const getSocialIcon = ({ service }) => {
  return socialMedia[service]?.icon
}

const getSocialName = ({ service }) => {
  return socialMedia[service]?.name
}

export default function Footer() {
  // Always call useStaticQuery unconditionally to satisfy React Hooks rules
  const queryData = useStaticQuery(graphql`
    query {
      layout {
        footer {
          id
          links {
            id
            href
            text
          }
          meta {
            id
            href
            text
          }
          copyright
          socialLinks {
            id
            service
            username
          }
        }
      }
    }
  `)

  // Check if we're in bypass mode - define outside the rendering
  const isBypassMode = React.useMemo(() => {
    return typeof window !== "undefined" 
      ? window.BYPASS_WORDPRESS === "true" 
      : process.env.BYPASS_WORDPRESS === "true";
  }, []);
  
  // Define mock data outside any conditional
  const mockData = React.useMemo(() => ({
    layout: {
      footer: {
        id: "footer-1",
        links: [
          { id: "link-1", href: "/", text: "Home" },
          { id: "link-2", href: "/about", text: "About" },
          { id: "link-3", href: "/contact", text: "Contact" }
        ],
        meta: [
          { id: "meta-1", href: "/privacy", text: "Privacy" },
          { id: "meta-2", href: "/terms", text: "Terms" }
        ],
        copyright: "© 2025 J. Eldon Music",
        socialLinks: [
          { id: "social-1", service: "INSTAGRAM", username: "jeldonmusic" },
          { id: "social-2", service: "YOUTUBE", username: "jeldonmusic" },
          { id: "social-3", service: "TWITTER", username: "jeldonmusic" }
        ]
      }
    }
  }), []);

  // Use the appropriate data source
  const data = isBypassMode ? mockData : queryData;
  const { links, meta, socialLinks, copyright } = data.layout.footer

  return (
    <Box as="footer" paddingY={4}>
      <Container>
        <Flex variant="start" responsive>
          <NavLink to="/">
            <VisuallyHidden>Home</VisuallyHidden>
            <BrandLogo />
          </NavLink>
          <Space />
          <FlexList>
            {socialLinks &&
              socialLinks.map((link) => {
                const url = getSocialURL(link)
                return (
                  url && (
                    <li key={link.id}>
                      <IconLink to={url}>
                        <VisuallyHidden>{getSocialName(link)}</VisuallyHidden>
                        {getSocialIcon(link)}
                      </IconLink>
                    </li>
                  )
                )
              })}
          </FlexList>
        </Flex>
        <Space size={5} />
        <Flex variant="start" responsive>
          <FlexList variant="start" responsive>
            {links &&
              links.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.href}>{link.text}</NavLink>
                </li>
              ))}
          </FlexList>
          <Space />
          <FlexList>
            {meta &&
              meta.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.href}>
                    <Text variant="small">{link.text}</Text>
                  </NavLink>
                </li>
              ))}
          </FlexList>
          <Text variant="small">{copyright}</Text>
        </Flex>
      </Container>
      <Space size={3} />
    </Box>
  )
}
