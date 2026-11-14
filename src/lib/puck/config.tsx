import * as React from "react"
import type { Config } from "@measured/puck"
import { Hero, type HeroProps } from "../../components/puck-blocks/Hero"
import { CtaBanner, type CtaBannerProps } from "../../components/puck-blocks/CtaBanner"
import { StatBanner, type StatBannerProps } from "../../components/puck-blocks/StatBanner"
import { FeatureGrid, type FeatureGridProps } from "../../components/puck-blocks/FeatureGrid"
import { Testimonials, type TestimonialsProps } from "../../components/puck-blocks/Testimonials"
import { LogoMarquee, type LogoMarqueeProps } from "../../components/puck-blocks/LogoMarquee"
import { VideoEmbed, type VideoEmbedProps } from "../../components/puck-blocks/VideoEmbed"
import { MatrixSection, type MatrixSectionProps } from "../../components/puck-blocks/MatrixSection"
import { RichText, type RichTextProps } from "../../components/puck-blocks/RichText"
import { Spacer, type SpacerProps } from "../../components/puck-blocks/Spacer"
import { EmailSignup, type EmailSignupProps } from "../../components/puck-blocks/EmailSignup"

export type Components = {
  Hero: HeroProps
  CtaBanner: CtaBannerProps
  StatBanner: StatBannerProps
  FeatureGrid: FeatureGridProps
  Testimonials: TestimonialsProps
  LogoMarquee: LogoMarqueeProps
  VideoEmbed: VideoEmbedProps
  MatrixSection: MatrixSectionProps
  RichText: RichTextProps
  Spacer: SpacerProps
  EmailSignup: EmailSignupProps
}

export type RootProps = {
  title: string
  description?: string
}

export const config: Config<{ components: Components; root: { props: RootProps } }> = {
  root: {
    fields: {
      title: { type: "text", label: "Page title (SEO)" },
      description: { type: "textarea", label: "Meta description (SEO)" },
    },
    defaultProps: {
      title: "Jeldon Music",
      description: "",
    },
    render: ({ children }) => <>{children}</>,
  },
  categories: {
    layout: {
      title: "Layout",
      components: ["Hero", "CtaBanner", "MatrixSection", "Spacer"],
    },
    content: {
      title: "Content",
      components: ["RichText", "FeatureGrid", "StatBanner", "Testimonials"],
    },
    conversion: {
      title: "Conversion",
      components: ["EmailSignup"],
    },
    media: {
      title: "Media",
      components: ["VideoEmbed", "LogoMarquee"],
    },
  },
  components: {
    Hero,
    CtaBanner,
    StatBanner,
    FeatureGrid,
    Testimonials,
    LogoMarquee,
    VideoEmbed,
    MatrixSection,
    RichText,
    Spacer,
    EmailSignup,
  },
}

export default config
