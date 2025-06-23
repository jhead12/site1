/**
 * Fallback data utilities for WordPress bypass mode
 * This file provides demo content when WordPress is not available
 */

// Demo blog posts for frontend display
export const getDemoBlogPosts = (count = 3) => {
  const posts = [
    {
      id: 'demo-post-1',
      title: 'Getting Started with Music Production',
      excerpt: '<p>Learn the essential tools and techniques to start producing your own music today...</p>',
      slug: 'getting-started-music-production',
      date: new Date().toISOString(),
      uri: '/blog/getting-started-music-production/',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-1.jpg',
          altText: 'Music Production Setup'
        }
      },
      author: {
        node: {
          name: 'Jeldon'
        }
      },
      categories: {
        nodes: [
          { id: 'cat-1', name: 'Tutorials', slug: 'tutorials' },
          { id: 'cat-2', name: 'Production', slug: 'production' }
        ]
      },
      content: '<p>This is a demo blog post created when WordPress is bypassed. Connect WordPress to see real content.</p>'
    },
    {
      id: 'demo-post-2',
      title: 'Mixing Techniques for Modern Hip-Hop',
      excerpt: '<p>Advanced mixing techniques that will make your hip-hop tracks sound professional...</p>',
      slug: 'mixing-techniques-hip-hop',
      date: new Date().toISOString(),
      uri: '/blog/mixing-techniques-hip-hop/',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-2.jpg',
          altText: 'Mixing Console'
        }
      },
      author: {
        node: {
          name: 'Jeldon'
        }
      },
      categories: {
        nodes: [
          { id: 'cat-2', name: 'Production', slug: 'production' },
          { id: 'cat-3', name: 'Mixing', slug: 'mixing' }
        ]
      },
      content: '<p>This is a demo blog post created when WordPress is bypassed. Connect WordPress to see real content.</p>'
    },
    {
      id: 'demo-post-3',
      title: 'Creating Your Music Brand',
      excerpt: '<p>Tips for developing a unique brand identity for your music career...</p>',
      slug: 'creating-music-brand',
      date: new Date().toISOString(),
      uri: '/blog/creating-music-brand/',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-1.jpg',
          altText: 'Music Branding'
        }
      },
      author: {
        node: {
          name: 'Jeldon'
        }
      },
      categories: {
        nodes: [
          { id: 'cat-4', name: 'Business', slug: 'business' },
          { id: 'cat-5', name: 'Marketing', slug: 'marketing' }
        ]
      },
      content: '<p>This is a demo blog post created when WordPress is bypassed. Connect WordPress to see real content.</p>'
    },
    {
      id: 'demo-post-4',
      title: 'Mastering Your Tracks at Home',
      excerpt: '<p>Learn how to master your music using affordable tools in a home studio environment...</p>',
      slug: 'mastering-tracks-home',
      date: new Date().toISOString(),
      uri: '/blog/mastering-tracks-home/',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-2.jpg',
          altText: 'Home Studio Setup'
        }
      },
      author: {
        node: {
          name: 'Jeldon'
        }
      },
      categories: {
        nodes: [
          { id: 'cat-2', name: 'Production', slug: 'production' },
          { id: 'cat-6', name: 'Mastering', slug: 'mastering' }
        ]
      },
      content: '<p>This is a demo blog post created when WordPress is bypassed. Connect WordPress to see real content.</p>'
    },
    {
      id: 'demo-post-5',
      title: 'Finding Your Sound: Developing a Signature Style',
      excerpt: '<p>Tips and techniques for discovering and refining your unique sound as a producer...</p>',
      slug: 'finding-your-sound',
      date: new Date().toISOString(),
      uri: '/blog/finding-your-sound/',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-1.jpg',
          altText: 'Music Production'
        }
      },
      author: {
        node: {
          name: 'Jeldon'
        }
      },
      categories: {
        nodes: [
          { id: 'cat-7', name: 'Creativity', slug: 'creativity' },
          { id: 'cat-2', name: 'Production', slug: 'production' }
        ]
      },
      content: '<p>This is a demo blog post created when WordPress is bypassed. Connect WordPress to see real content.</p>'
    }
  ];
  
  return count ? posts.slice(0, count) : posts;
};

// Demo categories for blog filtering
export const getDemoCategories = () => {
  return [
    { id: 'cat-1', name: 'Tutorials', slug: 'tutorials', count: 1 },
    { id: 'cat-2', name: 'Production', slug: 'production', count: 4 },
    { id: 'cat-3', name: 'Mixing', slug: 'mixing', count: 1 },
    { id: 'cat-4', name: 'Business', slug: 'business', count: 1 },
    { id: 'cat-5', name: 'Marketing', slug: 'marketing', count: 1 },
    { id: 'cat-6', name: 'Mastering', slug: 'mastering', count: 1 },
    { id: 'cat-7', name: 'Creativity', slug: 'creativity', count: 1 }
  ];
};

// Demo beats for music section
export const getDemoBeats = () => {
  return [
    {
      id: 'beat-1',
      title: 'Summer Vibes',
      slug: 'summer-vibes',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-1.jpg',
          altText: 'Summer Vibes Beat'
        }
      },
      acfBeats: {
        price: 29.99,
        genre: 'Hip-Hop',
        bpm: 95,
        audioUrl: '/static/audio/demo-track-1.mp3',
        soundcloudUrl: '#',
        keySignature: 'C Minor'
      }
    },
    {
      id: 'beat-2',
      title: 'Night Drive',
      slug: 'night-drive',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-2.jpg',
          altText: 'Night Drive Beat'
        }
      },
      acfBeats: {
        price: 24.99,
        genre: 'Trap',
        bpm: 140,
        audioUrl: '/static/audio/demo-track-2.mp3',
        soundcloudUrl: '#',
        keySignature: 'G Minor'
      }
    }
  ];
};

// Demo mixes for music section
export const getDemoMixes = () => {
  return [
    {
      id: 'mix-1',
      title: 'Summer 2025 Mix',
      slug: 'summer-2025-mix',
      featuredImage: {
        node: {
          sourceUrl: '/static/images/demo-cover-1.jpg',
          altText: 'Summer 2025 Mix'
        }
      },
      acfMixes: {
        genre: 'Hip-Hop',
        tracklist: '1. Track One\n2. Track Two\n3. Track Three',
        audioUrl: '/static/audio/demo-track-1.mp3',
        soundcloudUrl: '#',
        duration: '45:30'
      }
    }
  ];
};
