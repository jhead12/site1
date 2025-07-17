# Hero Section Component

This Hero section component is designed to display "Music + Technology" content from Contentful and fits perfectly between the rotating hero banner and the logo list section.

## Usage

```jsx
import HeroSection from "../components/hero-section"

// In your page component
<HeroSection
  kicker="Innovation"
  h1="Music + Technology"
  subhead="Where creativity meets cutting-edge innovation"
  text="Discover how modern technology is revolutionizing music production, from AI-assisted composition to immersive audio experiences."
  image={heroImage}
  links={[
    { id: "1", href: "/services", text: "Explore Services" },
    { id: "2", href: "/contact", text: "Get Started" }
  ]}
/>
```

## Contentful Integration

The component automatically integrates with Contentful using the `HeroSectionContent` GraphQL fragment:

```graphql
query {
  contentfulHomepageHero {
    ...HeroSectionContent
  }
}
```

## Design Features

- **Rule of Thirds Layout**: Content and image are properly balanced using 1/3 and 2/3 proportions
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Typography Hierarchy**: Proper heading structure with kicker, main heading, and subhead
- **Consistent Spacing**: Follows the site's design system spacing tokens
- **Image Optimization**: Uses Gatsby Image for optimal performance
- **Accessibility**: Proper semantic HTML and focus states

## Content Structure

The Hero section expects:
- `kicker`: Small uppercase text above the main heading
- `h1`: Main heading (e.g., "Music + Technology")
- `subhead`: Secondary heading providing more context
- `text`: Descriptive paragraph text
- `image`: Hero image with gatsby-plugin-image support
- `links`: Array of call-to-action buttons

## Styling

The component uses vanilla-extract CSS-in-JS with:
- Consistent color scheme from the site theme
- Proper hover effects and transitions
- Responsive typography scaling
- Optimized image aspect ratios

## Layout Position

This component is designed to be placed:
1. After the rotating hero banner (top)
2. Before the logo list section (bottom)
3. Within the main page flow with proper spacing
