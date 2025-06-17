# WordPress About Page Implementation Guide

**Date:** June 16, 2025  
**Phase:** 2.1 - Content Management Enhancement  
**Priority:** High

## Overview

Replace the static Gatsby About page with a dynamic WordPress-powered version, allowing for easy content management through the WordPress admin interface while maintaining the existing URL structure and design.

## Implementation Steps

### Step 1: WordPress About Page Setup

#### 1.1 Create About Page in WordPress
```bash
# Access WordPress admin
# Navigate to Pages > Add New
# Title: "About"
# Slug: "about"
# Status: Published
```

#### 1.2 Create ACF Field Group for About Page
**Field Group Name:** `About Page Fields`  
**Location Rule:** `Page Template` is equal to `About Page` OR `Page` is equal to `About`

```json
{
  "key": "group_about_page",
  "title": "About Page Fields",
  "fields": [
    {
      "key": "field_about_hero",
      "label": "Hero Section",
      "name": "hero_section",
      "type": "group",
      "sub_fields": [
        {
          "key": "field_hero_heading",
          "label": "Main Heading",
          "name": "heading",
          "type": "text",
          "default_value": "About Jeldon"
        },
        {
          "key": "field_hero_subheading",
          "label": "Subheading",
          "name": "subheading",
          "type": "text",
          "default_value": "Producer, Artist, Educator"
        },
        {
          "key": "field_hero_background",
          "label": "Background Image",
          "name": "background_image",
          "type": "image",
          "return_format": "array"
        },
        {
          "key": "field_hero_cta",
          "label": "Call to Action",
          "name": "call_to_action",
          "type": "group",
          "sub_fields": [
            {
              "key": "field_cta_text",
              "label": "Button Text",
              "name": "text",
              "type": "text",
              "default_value": "Get In Touch"
            },
            {
              "key": "field_cta_link",
              "label": "Button Link",
              "name": "link",
              "type": "text",
              "default_value": "/contact"
            }
          ]
        }
      ]
    },
    {
      "key": "field_about_biography",
      "label": "Biography Section",
      "name": "biography",
      "type": "group",
      "sub_fields": [
        {
          "key": "field_bio_content",
          "label": "Main Biography",
          "name": "content",
          "type": "wysiwyg",
          "toolbar": "full"
        },
        {
          "key": "field_bio_highlights",
          "label": "Highlights",
          "name": "highlights",
          "type": "repeater",
          "sub_fields": [
            {
              "key": "field_highlight_title",
              "label": "Title",
              "name": "title",
              "type": "text"
            },
            {
              "key": "field_highlight_value",
              "label": "Value",
              "name": "value",
              "type": "text"
            },
            {
              "key": "field_highlight_description",
              "label": "Description",
              "name": "description",
              "type": "textarea"
            }
          ]
        }
      ]
    },
    {
      "key": "field_about_skills",
      "label": "Skills & Expertise",
      "name": "skills",
      "type": "repeater",
      "sub_fields": [
        {
          "key": "field_skill_category",
          "label": "Category",
          "name": "category",
          "type": "text"
        },
        {
          "key": "field_skill_items",
          "label": "Skills",
          "name": "items",
          "type": "repeater",
          "sub_fields": [
            {
              "key": "field_skill_name",
              "label": "Skill Name",
              "name": "name",
              "type": "text"
            },
            {
              "key": "field_skill_level",
              "label": "Proficiency Level",
              "name": "level",
              "type": "select",
              "choices": {
                "beginner": "Beginner",
                "intermediate": "Intermediate",
                "advanced": "Advanced",
                "expert": "Expert"
              }
            }
          ]
        }
      ]
    },
    {
      "key": "field_about_achievements",
      "label": "Achievements",
      "name": "achievements",
      "type": "repeater",
      "sub_fields": [
        {
          "key": "field_achievement_title",
          "label": "Title",
          "name": "title",
          "type": "text"
        },
        {
          "key": "field_achievement_year",
          "label": "Year",
          "name": "year",
          "type": "text"
        },
        {
          "key": "field_achievement_description",
          "label": "Description",
          "name": "description",
          "type": "textarea"
        },
        {
          "key": "field_achievement_image",
          "label": "Image",
          "name": "image",
          "type": "image",
          "return_format": "array"
        }
      ]
    }
  ],
  "location": [
    [
      {
        "param": "page",
        "operator": "==",
        "value": "about"
      }
    ]
  ]
}
```

### Step 2: Gatsby Template Implementation

#### 2.1 Create WordPress About Page Template
**File:** `src/templates/wordpress-about.tsx`

```tsx
import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Head from "../components/head"

interface AboutPageData {
  wpPage: {
    id: string
    title: string
    content: string
    aboutPageFields: {
      heroSection: {
        heading: string
        subheading: string
        backgroundImage: {
          localFile: {
            childImageSharp: {
              gatsbyImageData: any
            }
          }
          altText: string
        }
        callToAction: {
          text: string
          link: string
        }
      }
      biography: {
        content: string
        highlights: Array<{
          title: string
          value: string
          description: string
        }>
      }
      skills: Array<{
        category: string
        items: Array<{
          name: string
          level: string
        }>
      }>
      achievements: Array<{
        title: string
        year: string
        description: string
        image: {
          localFile: {
            childImageSharp: {
              gatsbyImageData: any
            }
          }
          altText: string
        }
      }>
    }
  }
}

const WordPressAboutPage: React.FC<{ data: AboutPageData }> = ({ data }) => {
  const { wpPage } = data
  const fields = wpPage.aboutPageFields

  const heroImage = getImage(fields.heroSection.backgroundImage?.localFile)

  return (
    <Layout>
      <div className="about-page">
        {/* Hero Section */}
        <section className="hero-section relative overflow-hidden">
          {heroImage && (
            <GatsbyImage
              image={heroImage}
              alt={fields.heroSection.backgroundImage?.altText || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="relative z-10 bg-black bg-opacity-50 min-h-screen flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-6xl font-bold mb-4">
                {fields.heroSection.heading}
              </h1>
              <p className="text-2xl mb-8">
                {fields.heroSection.subheading}
              </p>
              {fields.heroSection.callToAction && (
                <a
                  href={fields.heroSection.callToAction.link}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {fields.heroSection.callToAction.text}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section className="biography-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: fields.biography.content }}
              />
              
              {/* Highlights */}
              {fields.biography.highlights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {fields.biography.highlights.map((highlight, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">
                        {highlight.value}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        {fields.skills && fields.skills.length > 0 && (
          <section className="skills-section py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Skills & Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {fields.skills.map((skillGroup, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                      <h3 className="text-xl font-semibold mb-4">
                        {skillGroup.category}
                      </h3>
                      <ul className="space-y-2">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <li key={skillIndex} className="flex justify-between">
                            <span>{skill.name}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              skill.level === 'expert' ? 'bg-green-100 text-green-800' :
                              skill.level === 'advanced' ? 'bg-blue-100 text-blue-800' :
                              skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {skill.level}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {fields.achievements && fields.achievements.length > 0 && (
          <section className="achievements-section py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Achievements & Recognition
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {fields.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-6">
                      {achievement.image && (
                        <div className="flex-shrink-0">
                          <GatsbyImage
                            image={getImage(achievement.image.localFile)}
                            alt={achievement.image.altText || achievement.title}
                            className="w-20 h-20 rounded-lg"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-primary-600 font-semibold">
                          {achievement.year}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export default WordPressAboutPage

export const Head = ({ data }: { data: AboutPageData }) => {
  const { wpPage } = data
  return (
    <Head
      title={wpPage.title}
      description={wpPage.aboutPageFields.heroSection.subheading}
    />
  )
}

export const query = graphql`
  query GetWordPressAbout($id: String!) {
    wpPage(id: { eq: $id }) {
      id
      title
      content
      aboutPageFields {
        heroSection {
          heading
          subheading
          backgroundImage {
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 1920
                  height: 1080
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            altText
          }
          callToAction {
            text
            link
          }
        }
        biography {
          content
          highlights {
            title
            value
            description
          }
        }
        skills {
          category
          items {
            name
            level
          }
        }
        achievements {
          title
          year
          description
          image {
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 150
                  height: 150
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            altText
          }
        }
      }
    }
  }
`
```

#### 2.2 Update gatsby-node.js for About Page Routing

```javascript
// Add to gatsby-node.js createPages function
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // ... existing code ...

  // Create WordPress About page (replace static about page)
  const aboutResult = await graphql(`
    {
      wpPage(slug: { eq: "about" }) {
        id
        slug
        title
      }
    }
  `)

  if (aboutResult.data.wpPage) {
    createPage({
      path: `/about/`,
      component: require.resolve("./src/templates/wordpress-about.tsx"),
      context: {
        id: aboutResult.data.wpPage.id,
      },
    })
  }

  // ... rest of existing code ...
}
```

#### 2.3 Remove/Rename Static About Page
```bash
# Rename the existing static about page to avoid conflicts
mv src/pages/about.js src/pages/about-static-backup.js
```

### Step 3: Content Migration Strategy

#### 3.1 Content Assessment
1. Review existing static About page content
2. Identify sections that map to new ACF fields
3. Plan content enhancement opportunities

#### 3.2 Content Migration Process
1. Copy existing text content to WordPress About page
2. Organize content into appropriate ACF field sections
3. Add new rich content using ACF fields
4. Upload and optimize images
5. Test responsive design and functionality

### Step 4: Testing & Validation

#### 4.1 Functionality Testing
- [ ] About page loads correctly at `/about`
- [ ] All ACF fields display properly
- [ ] Images load and optimize correctly
- [ ] Responsive design works on all devices
- [ ] SEO meta tags generate properly

#### 4.2 Content Management Testing
- [ ] WordPress admin can edit all fields
- [ ] Changes reflect immediately in development
- [ ] Changes deploy correctly to production
- [ ] Non-technical users can manage content easily

## Benefits

### For Content Management
- **Easy Updates:** No code changes needed for content updates
- **Rich Content:** Support for images, formatting, and complex layouts
- **SEO Control:** Full control over meta tags and SEO optimization
- **Version Control:** WordPress revision system for content changes

### For Development
- **Maintainability:** Separates content from code
- **Scalability:** Easy to add new sections or fields
- **Consistency:** Follows established WordPress patterns
- **Performance:** Gatsby static generation + WordPress flexibility

## Next Steps

1. **Phase 2.2:** Extend pattern to other static pages (Contact, Services)
2. **Phase 2.3:** Add page builder functionality for flexible layouts
3. **Phase 2.4:** Implement content previewing and staging workflows

## Timeline

- **Week 1:** WordPress setup and ACF configuration
- **Week 2:** Gatsby template development and testing
- **Week 3:** Content migration and optimization
- **Week 4:** Testing, refinement, and documentation

This implementation provides a solid foundation for managing the About page content through WordPress while maintaining Gatsby's performance benefits.
