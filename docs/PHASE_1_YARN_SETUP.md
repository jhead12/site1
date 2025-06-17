# Phase 1 Setup Commands (Yarn)

## 🎵 Jeldon Music - WordPress Headless Integration

### Prerequisites
- Node.js 18+
- Yarn package manager
- WordPress installation with admin access

### Phase 1 Setup Steps

#### 1. Install Dependencies
```bash
yarn install
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.EXAMPLE .env.development

# Edit with your WordPress settings
code .env.development
```

Required environment variables:
```bash
WPGRAPHQL_URL="https://your-wordpress-site.com/graphql"
WP_USERNAME="your_wp_username"
WP_PASSWORD="your_wp_password"
WP_CONSUMER_KEY="your_consumer_key"
WP_CONSUMER_SECRET="your_consumer_secret"
```

#### 3. WordPress Setup Guide
```bash
# Run WordPress setup script
yarn setup:wp
```

#### 4. Test WordPress Connection
```bash
# Test GraphQL endpoint connectivity
yarn wp:test-connection
```

#### 5. Development Commands

Start development with WordPress debugging:
```bash
yarn develop:wp
```

Start regular development:
```bash
yarn develop
```

Clean WordPress GraphQL queries cache:
```bash
yarn clean:wp
```

Build with bundle analysis:
```bash
yarn build:analyze
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn develop` | Start Gatsby development server |
| `yarn develop:wp` | Start development with WordPress verbose logging |
| `yarn build` | Build for production |
| `yarn build:analyze` | Build with bundle analyzer |
| `yarn serve` | Serve production build locally |
| `yarn clean` | Clean Gatsby cache |
| `yarn clean:wp` | Clean WordPress GraphQL queries |
| `yarn setup:wp` | WordPress configuration wizard |
| `yarn wp:test-connection` | Test WordPress GraphQL connection |
| `yarn wp:sync` | Sync WordPress content (future feature) |

### WordPress Plugin Installation

Required plugins to install on your WordPress site:

**Essential:**
```bash
# Via WP-CLI (if available)
wp plugin install wp-graphql --activate
wp plugin install wp-graphql-acf --activate
```

**Manual Installation Required:**
- Advanced Custom Fields Pro (requires license)
- Yoast SEO Premium (requires license)

**Optional:**
- Custom Post Type UI
- WP GraphQL Meta Query
- WP GraphQL Yoast SEO

### Phase 1 Completion Checklist

- [ ] Dependencies installed (`yarn install`)
- [ ] Environment configured (`.env.development`)
- [ ] WordPress plugins installed and activated
- [ ] Custom post types created (Beats, Tutorials, Mixes)
- [ ] GraphQL endpoint tested (`yarn wp:test-connection`)
- [ ] Development server running (`yarn develop:wp`)

### Troubleshooting

**GraphQL Connection Issues:**
```bash
# Check WordPress site accessibility
curl https://your-wordpress-site.com

# Test GraphQL endpoint directly
curl -X POST https://your-wordpress-site.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ generalSettings { title } }"}'
```

**Build Issues:**
```bash
# Clear all caches
yarn clean:wp
yarn clean
yarn develop:wp
```

## **Next Steps for Phase 1 Implementation:**

Now that the build is working, you can proceed with the WordPress setup phase:

1. **Set up environment variables** in `.env.development`:
   ```bash
   WPGRAPHQL_URL="https://your-wordpress-site.com/graphql"
   WP_USERNAME="your_wp_username"
   WP_PASSWORD="your_wp_password"
   ```

2. **Install WordPress plugins** as outlined in the setup guide:
   - WP GraphQL
   - Advanced Custom Fields Pro
   - WP GraphQL for ACF

3. **Test the WordPress connection**:
   ```bash
   yarn wp:test-connection
   ```

4. **Start development with WordPress**:
   ```bash
   yarn develop:wp
   ```
Once Phase 1 is complete, you'll be ready for **Phase 2: Content Management Enhancement** where we'll:
- Set up ACF field groups
- Create WordPress admin customizations
- Build content workflows
