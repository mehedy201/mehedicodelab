# Mehedi Hasan — Portfolio + Articles (static, SEO-ready)

## Run it
```bash
npm install
npm run dev        # builds, then opens a local server at http://localhost:5173
npm run build      # builds the final site into dist/
```
Before publishing, set your real domain in `site.config.json` ("url"). It is used for canonical links, the sitemap and share cards.

## Publish for free
Upload this folder to GitHub, then connect the repository to **Cloudflare Pages** (recommended) or Netlify:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18 or newer

Then: add your domain, add the site in Google Search Console, and submit `https://your-domain/sitemap.xml`.

## What is where
| Path | Purpose |
|---|---|
| `site.config.json` | domain, name, contact links, skills (used in SEO data) |
| `content/articles/*.md` | your articles (Markdown). Add a file, run build, done |
| `content/TOPICS.md` | the plan for 20 articles |
| `src/index.html` | the home page template (your design and texts) |
| `src/partials/` | menu/navigation and footer shared by every page |
| `src/templates/` | article page, articles index, 404 page |
| `public/css`, `public/js`, `public/images` | styles, scripts and images (copied to `dist/` as they are) |
| `public/js/data.js` | projects, reviews, marquee phrases |
| `build.js` | the build script: Markdown → pages, covers, sitemap, RSS, structured data |
| `dist/` | generated site (do not edit by hand) |

## SEO included
Page titles and descriptions, canonical links, Open Graph and Twitter cards, JSON-LD (Person, WebSite, ProfessionalService, Article, Breadcrumb), sitemap.xml, robots.txt, RSS, a real `<h1>`, a 404 page, security and cache headers (`public/_headers`), and a favicon.
