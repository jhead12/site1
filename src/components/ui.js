import { Link as GatsbyLink } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import isAbsoluteURL from "is-absolute-url"
import * as React from "react"
import * as styles from "./ui.css"

// Fallback styles object to prevent runtime errors
const fallbackStyles = {
  containers: { normal: "container" },
  flex: "flex",
  flexVariants: {
    responsive: "flexVariants responsive",
    wrap: "flexVariants wrap",
  },
  flexGap: [
    "flexGap0",
    "flexGap1",
    "flexGap2",
    "flexGap3",
    "flexGap4",
    "flexGap5",
  ],
  gutter: ["", "gutter1", "gutter2", "gutter3"],
  marginY: ["", "marginY1", "marginY2", "marginY3"],
  list: "list",
  space: ["", "space1", "space2", "space3", "space4", "space5"],
  margin: { auto: "marginAuto" },
  marginLeft: ["", "marginLeft1", "marginLeft2", "marginLeft3"],
  marginRight: ["", "marginRight1", "marginRight2", "marginRight3"],
  marginTop: ["", "marginTop1", "marginTop2", "marginTop3"],
  marginBottom: ["", "marginBottom1", "marginBottom2", "marginBottom3"],
  section: "section",
  widths: {
    full: "widthsFull",
    half: "widthsHalf",
    third: "widthsThird",
    quarter: "widthsQuarter",
  },
  backgrounds: {
    primary: "backgroundsPrimary",
    secondary: "backgroundsSecondary",
  },
  padding: ["", "padding1", "padding2", "padding3", "padding4", "padding5"],
  paddingY: ["", "paddingY1", "paddingY2", "paddingY3"],
  radii: { small: "radiiSmall", medium: "radiiMedium", large: "radiiLarge" },
  box: { center: "boxCenter" },
  order: ["", "order1", "order2", "order3"],
  text: {
    body: "textBody",
    heading: "textHeading",
    subheading: "textSubheading",
    small: "textSmall",
    center: "textCenter",
    bold: "textBold",
  },
  link: "link",
  navlink: "navlink",
  navButtonlink: "navButtonlink",
  buttons: { primary: "buttonPrimary", secondary: "buttonSecondary" },
}

// Use the imported styles if available, otherwise use fallback
const safeStyles = styles || fallbackStyles

export const cx = (...args) => args.filter(Boolean).join(" ")

export function Base({
  as: Component = "div",
  cx: _cx = [],
  className,
  ...props
}) {
  return <Component className={cx(..._cx, className)} {...props} />
}

export function Container({ width = "normal", ...props }) {
  return (
    <Base
      cx={[safeStyles.containers && safeStyles.containers[width]]}
      {...props}
    />
  )
}

export function Flex({
  variant,
  gap = 3,
  gutter,
  wrap,
  responsive,
  marginY,
  alignItems,
  cx: _cx = [],
  ...props
}) {
  return (
    <Base
      cx={[
        safeStyles.flex,
        variant && safeStyles.flexVariants && safeStyles.flexVariants[variant],
        responsive &&
          safeStyles.flexVariants &&
          safeStyles.flexVariants.responsive,
        wrap && safeStyles.flexVariants && safeStyles.flexVariants.wrap,
        gutter && safeStyles.gutter && safeStyles.gutter[gutter],
        gutter
          ? safeStyles.flexGap && safeStyles.flexGap[0]
          : safeStyles.flexGap && safeStyles.flexGap[gap],
        marginY && safeStyles.marginY && safeStyles.marginY[marginY],
        alignItems &&
          safeStyles.flexVariants &&
          safeStyles.flexVariants[alignItems],
        ..._cx,
      ]}
      {...props}
    />
  )
}

export function Box({
  width = "full",
  background,
  padding,
  paddingY,
  radius,
  center = false,
  order,
  cx: _cx = [],
  ...props
}) {
  return (
    <Base
      cx={[
        safeStyles.widths && safeStyles.widths[width],
        background &&
          safeStyles.backgrounds &&
          safeStyles.backgrounds[background],
        padding && safeStyles.padding && safeStyles.padding[padding],
        paddingY && safeStyles.paddingY && safeStyles.paddingY[paddingY],
        radius && safeStyles.radii && safeStyles.radii[radius],
        center && safeStyles.box && safeStyles.box.center,
        order && safeStyles.order && safeStyles.order[order],
        ..._cx,
      ]}
      {...props}
    />
  )
}

export function FlexList(props) {
  return <Flex as="ul" cx={[safeStyles.list]} {...props} />
}

export function Grid({ columns = [1, 2, 3], gap = 3, children, ...props }) {
  return (
    <Base
      cx={[
        {
          display: "grid",
          gridTemplateColumns: columns
            .map((col) => `repeat(${col}, 1fr)`)
            .join(", "),
          gridGap:
            gap && safeStyles.space && safeStyles.space[gap]
              ? safeStyles.space[gap]
              : `${gap * 0.5}rem`,
        },
      ]}
      {...props}
    >
      {children}
    </Base>
  )
}

export function List(props) {
  return <Base as="ul" cx={[safeStyles.list]} {...props} />
}

export function Space({ size = "auto", ...props }) {
  return <Base cx={[safeStyles.margin && safeStyles.margin[size]]} {...props} />
}

export function Nudge({ left, right, top, bottom, ...props }) {
  return (
    <Base
      cx={[
        left && safeStyles.marginLeft && safeStyles.marginLeft[-left],
        right && safeStyles.marginRight && safeStyles.marginRight[-right],
        top && safeStyles.marginTop && safeStyles.marginTop[-top],
        bottom && safeStyles.marginBottom && safeStyles.marginBottom[-bottom],
      ]}
      {...props}
    />
  )
}

export function Section(props) {
  return <Box as="section" className={safeStyles.section} {...props} />
}

export function Text({
  variant = "body",
  center = false,
  bold = false,
  ...props
}) {
  return (
    <Base
      cx={[
        safeStyles.text && safeStyles.text[variant],
        center && safeStyles.text && safeStyles.text.center,
        bold && safeStyles.text && safeStyles.text.bold,
      ]}
      {...props}
    />
  )
}

export function SuperHeading({ ...props }) {
  return <Text as="h1" variant="superHeading" {...props} />
}

export function Heading({ ...props }) {
  return <Text as="h2" variant="heading" {...props} />
}

export function Subhead({ ...props }) {
  return <Text as="h3" variant="subhead" {...props} />
}

export function Kicker({ ...props }) {
  return <Text variant="kicker" {...props} />
}

export function Link({ to, href, ...props }) {
  const url = href || to || ""
  if (isAbsoluteURL(url)) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a href={url} className={safeStyles.link} {...props} />
    )
  }
  return <GatsbyLink to={url} className={safeStyles.link} {...props} />
}

export function NavLink({ ...props }) {
  return <Base as={Link} cx={[safeStyles.navlink]} {...props} />
}

export function NavButtonLink({ ...props }) {
  return <Base as="button" cx={[safeStyles.navButtonlink]} {...props} />
}

export function Button({ variant = "primary", ...props }) {
  return (
    <Base
      as={Link}
      cx={[safeStyles.buttons && safeStyles.buttons[variant]]}
      {...props}
    />
  )
}

export function ButtonList({ links = [], reversed = false, ...props }) {
  const getVariant = (i) => {
    if (reversed) {
      return i === 0 ? "reversed" : "linkReversed"
    }
    return i === 0 ? "primary" : "link"
  }
  return (
    <FlexList marginY={4} {...props}>
      {links &&
        links.map((link, i) => (
          <li key={link.id}>
            <Button href={link.href} variant={getVariant(i)}>
              {link.text}
            </Button>
          </li>
        ))}
    </FlexList>
  )
}

export function CTALink(props) {
  return <Base as={Link} cx={[safeStyles.ctaLink]} {...props} />
}

export function LinkList({ links = [], ...props }) {
  return (
    <FlexList {...props}>
      {links &&
        links.map((link, i) => (
          <li key={link.id}>
            <CTALink href={link.href}>{link.text}</CTALink>
          </li>
        ))}
    </FlexList>
  )
}

export function Blockquote(props) {
  return <Base as="blockquote" cx={[safeStyles.blockquote]} {...props} />
}

export function Avatar({ alt, image }) {
  const imageData = getImage(image)

  if (!imageData) {
    return null
  }

  return (
    <GatsbyImage alt={alt} image={imageData} className={safeStyles.avatar} />
  )
}

export function Logo({ alt, image, size = "small" }) {
  const imageData = getImage(image)

  if (!imageData) {
    return null
  }

  return (
    <GatsbyImage
      alt={alt}
      image={imageData}
      className={safeStyles.logos && safeStyles.logos[size]}
    />
  )
}

export function Icon({ alt, image, size = "medium" }) {
  const imageData = getImage(image)

  if (!imageData) {
    return null
  }

  return (
    <GatsbyImage alt={alt} image={imageData} className={styles.icons[size]} />
  )
}

export function IconLink(props) {
  return <NavLink cx={[styles.iconLink]} {...props} />
}

export function InteractiveIcon(props) {
  return <Base as="button" cx={[styles.interactiveIcon]} {...props} />
}

export function VisuallyHidden(props) {
  return <Base as="span" cx={[styles.visuallyHidden]} {...props} />
}

export function BlockLink(props) {
  return <Link className={styles.blockLink} {...props} />
}
