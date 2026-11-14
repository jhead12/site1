# J. Eldon Music: jeldonmusic.com

Website for **J. Eldon Music**: MPC tutorials, MPC + DAW integration, mixing & mastering,
coaching, beats and digital products.

**Live:** https://www.jeldonmusic.com · **Hosting:** Netlify · **Framework:** Gatsby 5 (React)

---

## Where content lives

| Content | Source | How to change it |
|---|---|---|
| Homepage + landing pages | **Puck** (`static/puck-content/*.json`) | Visual editor at **`/edit/`**. See [docs/PUCK_EDITOR_GUIDE.md](docs/PUCK_EDITOR_GUIDE.md) |
| Blog posts, video posts, digital products | **Contentful** | Contentful web app |
| Offer pages (`/sampler`, `/coaching`, `/mixing-mastering`, `/production`, `/retainer`, `/cohort`) | `src/data/offers.json` | Edit the JSON |
| Tutorials, beats, mixes | **WordPress** (WPGraphQL) | WordPress admin. Currently bypassed (see below) |
| Email signups | **MailerLite** via `netlify/functions/subscribe.js` | Puck "Email Signup" block |
| Checkout | **ThriveCart** | ThriveCart dashboard |
| Bookings | **Calendly** | Calendly dashboard |

> **WordPress is bypassed in production.** `BYPASS_WORDPRESS=true` is set in `netlify.toml`
> because the WordPress GraphQL endpoint is down. WordPress-backed pages fall back to mock data
> (`src/gatsby/bypass-mocks.js`). Set it to `"false"` once WPGraphQL + WPGatsby are active again.

## Quick start

Requires **Node 22+** (see `.nvmrc`) and Yarn.

```bash
nvm use               # Node 22
yarn install
cp .env.EXAMPLE .env.development   # fill in the keys you need
yarn develop:ssl-bypass            # dev server without WordPress → http://localhost:8000
```

Netlify Functions (`/edit` login, saving pages, email signup) only run under the Netlify CLI:

```bash
npx netlify dev       # serves the site + functions at http://localhost:8888
```

## Common scripts

| Command | What it does |
|---|---|
| `yarn develop` | Dev server with WordPress |
| `yarn develop:ssl-bypass` | Dev server without WordPress (matches production) |
| `yarn build:no-wp` | Production build without WordPress |
| `yarn build:netlify` | Build used by Netlify |
| `yarn serve` | Serve the production build locally |
| `yarn clean` | Clear Gatsby cache (try this first when builds act strange) |
| `yarn test` | Jest tests |
| `yarn sync:youtube` | Sync YouTube uploads into Contentful video posts (`:dry-run` to preview) |
| `yarn sync:product-map` | Publish Contentful digital products to the S3 product map (`:dry-run` to preview) |
| `yarn inspect:contentful` | Inspect the Contentful content model |

## Project structure

```
src/
  pages/              Route pages (index = homepage, edit.tsx = Puck editor, offer pages)
  templates/          Generated pages (blog-post, video-post, puck-page, tutorial, beat, mix)
  components/         UI + sections (ui.js design primitives, header/footer slices)
    puck-blocks/      Blocks available in the Puck editor
  lib/puck/config.tsx Puck block registry
  gatsby/             gatsby-node logic (pages.js creates blog/video/Puck/WP pages)
  data/offers.json    Offer/landing page copy
  theme.css.ts, colors.css.ts   Design tokens (vanilla-extract)
static/puck-content/  Puck page JSON (home.json → "/", <slug>.json → /<slug>/)
netlify/functions/    Serverless: Puck auth/save, MailerLite subscribe
scripts/              Setup, sync and diagnostic scripts
docs/                 Guides and fix logs
```

## Environment variables

All keys are listed with comments in [`.env.EXAMPLE`](.env.EXAMPLE). The main groups are:

- **Contentful:** `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN` (required to build)
- **WordPress:** `WPGRAPHQL_URL`, `WP_USERNAME`, `WP_PASSWORD` (only when not bypassed)
- **Puck editor:** `GITHUB_OAUTH_*`, `SITE_URL`, `GITHUB_OWNER/REPO/BRANCH`, `ALLOWED_GITHUB_LOGINS`
- **Email signup:** `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`
- **YouTube sync, S3 product map, Tawk.to, Calendly, ThriveCart:** see `.env.EXAMPLE`

Set production values in **Netlify → Site configuration → Environment variables**. Never commit `.env*` files.

## Deployment

Pushes to `master` deploy automatically on Netlify. Pull requests get Deploy Previews.
Publishing from `/edit/` also commits to `master`, which triggers a deploy (~3–5 min).

Security headers (including the Content-Security-Policy) are in `netlify.toml`. When adding a
third-party script, iframe or form target, add its domain to the CSP or it will be blocked.

## Documentation

- [Puck editor guide](docs/PUCK_EDITOR_GUIDE.md): editing pages, adding blocks, env setup
- [Build & development master guide](docs/BUILD_DEVELOPMENT_MASTER_GUIDE.md)
- [Contentful master guide](docs/CONTENTFUL_MASTER_GUIDE.md)
- [WordPress master guide](docs/WORDPRESS_MASTER_GUIDE.md)
- [ThriveCart integration](docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md)
- [YouTube auto-sync](docs/YOUTUBE_AUTO_SYNC_GUIDE.md)
- [CHANGELOG](CHANGELOG.md)
