# Puck Visual Editor Guide

The homepage and landing pages are built from drag-and-drop blocks using
[Puck](https://puckeditor.com). You can change copy, reorder sections and add
new pages without touching code.

**Use Puck for:** the homepage, landing and offer pages, and one-off campaign pages.
**Don't use Puck for:** blog posts and videos (Contentful), and tutorials, beats
and mixes (WordPress).

---

## Editing a page

1. Go to **`https://jeldonmusic.com/edit/`** and log in with GitHub.
2. Pick the page from the dropdown in the top bar (it defaults to the homepage).
3. Drag blocks in from the left panel, click a block to edit its fields, and
   reorder blocks by dragging.
4. Click **Publish**. This commits `static/puck-content/<page>.json` to GitHub,
   which triggers a Netlify build. The live site updates in **~3–5 minutes**.

Every publish is a git commit, so you can undo any change by reverting it in GitHub.

## Adding a new page

1. Open `/edit/?page=<slug>`. Use lowercase letters, numbers and hyphens, e.g. `/edit/?page=mpc-fl-studio`.
2. Build the page and publish. It goes live at `/<slug>/`.
3. Optional: add it to the `PAGES` list in `src/pages/edit.tsx` so it appears in the dropdown.

## How it works

| Piece | File |
|---|---|
| Page content (one JSON file per page) | `static/puck-content/<slug>.json` |
| Homepage (`home.json` renders at `/`) | `src/pages/index.js` |
| All other pages render at `/<slug>/` | `src/templates/puck-page.tsx`, created in `src/gatsby/pages.js` |
| Editor | `src/pages/edit.tsx` |
| Block list / categories | `src/lib/puck/config.tsx` |
| Blocks | `src/components/puck-blocks/*.tsx` (styles in `blocks.css.ts`) |
| Login + save (GitHub OAuth) | `netlify/functions/{auth,callback,whoami,logout,save-puck-page}.js` |
| Email signup backend | `netlify/functions/subscribe.js` |

The homepage still renders the latest blog posts and the shop section below the
Puck content. Those come from Contentful/Shopify, not the editor.

## Blocks

| Block | Use for |
|---|---|
| Hero | Page headline, image, buttons |
| Email Signup | Lead magnet opt-in (MailerLite). Set `source` per placement for tracking; `anchor` lets buttons link to it with `#anchor` |
| Feature Grid | 3-up benefits / what you'll learn |
| CTA Banner | Book coaching / mixing calls-to-action |
| Video Embed | YouTube or Vimeo URL |
| Stat Banner, Testimonials, Logo Marquee | Social proof: **real numbers and real quotes only** |
| Rich Text, Spacer, Matrix Section | Layout and copy |

### Adding a new block
1. Create `src/components/puck-blocks/MyBlock.tsx` exporting a `ComponentConfig` (`fields`, `defaultProps`, `render`). Copy `CtaBanner.tsx` as a starting point.
2. Register it in `src/lib/puck/config.tsx` (type map, `categories`, `components`).
3. Reuse `../ui` components and `theme` tokens so it matches the site.

---

## Required Netlify environment variables

| Variable | Purpose |
|---|---|
| `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App dedicated to this site |
| `GITHUB_OAUTH_REDIRECT_URI` | `https://jeldonmusic.com/.netlify/functions/callback` (must match the OAuth App exactly; use the bare domain, since `www` redirects to it) |
| `SITE_URL` | `https://jeldonmusic.com` |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | `jhead12` / `site1` / `master`: the repo that page JSON is committed to |
| `ALLOWED_GITHUB_LOGINS` | **Set this.** Comma-separated GitHub usernames allowed to publish. If blank, any GitHub account can publish. |
| `MAILERLITE_API_KEY` | MailerLite > Integrations > API |
| `MAILERLITE_GROUP_ID` | Default group for signups. That group's automation delivers the MPC Quickstart Kit |

If MailerLite isn't configured, the Email Signup form shows an error with a link
to the block's fallback URL (the `winning.jeldonmusic.com` kit page).

## Gotchas
- **Changes aren't instant.** The live site updates only after the Netlify build finishes.
- **Publishing commits to the deploy branch.** Pull before editing JSON locally, or you'll get merge conflicts with editor commits.
- **`/design-lab/`** is a demo page with placeholder stats. Replace them with real numbers or delete `static/puck-content/design-lab.json` before promoting it.
