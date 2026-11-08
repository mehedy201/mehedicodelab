---
title: WordPress Speed Optimization: A Practical Core Web Vitals Checklist
description: A step-by-step checklist to make a slow WordPress site pass Core Web Vitals, from hosting and caching to images, plugins and third-party scripts.
date: 2026-11-02
category: Performance
tags: WordPress, Core Web Vitals, Page speed, Technical SEO
---
A slow WordPress site costs you twice: visitors leave before the page appears, and search engines treat poor page experience as a weaker result. Most slow sites are not slow for one big reason. They are slow because of ten small ones. This checklist is the order I follow when I audit a site.

> **Key takeaways**
> - Measure first, using real-user data, not only a lab score.
> - Fix the server and caching before you touch any image or script.
> - Remove weight (plugins, scripts, fonts) before you add tools to hide it.

## What "passing" means

Google reports three Core Web Vitals, judged at the 75th percentile of real visits:

| Metric | What it measures | Good |
|---|---|---|
| LCP | How fast the main content appears | 2.5 s or less |
| INP | How fast the page reacts to taps and clicks | 200 ms or less |
| CLS | How much the layout jumps | 0.1 or less |

Check the real numbers in PageSpeed Insights (the "field data" block) and the Core Web Vitals report in Search Console. A perfect lab score on your own fast laptop proves very little.

## 1. Fix the foundation: hosting and caching

If the server takes a long time to answer (high TTFB), nothing else can fully save you.

- Use a host with current PHP, enough memory and SSD storage.
- Turn on **full-page caching** so most visits never run PHP at all.
- Add **object caching** (Redis or Memcached) for logged-in users, WooCommerce and dynamic pages.
- Put a CDN in front, so images and files come from a server near the visitor.

## 2. Make the biggest element fast (LCP)

The LCP element is usually the hero image or a large heading.

- Serve modern formats (WebP or AVIF) at the size actually shown, with `srcset`.
- **Never lazy-load the LCP image.** Give it `fetchpriority="high"` instead.
- Preload the one font you need and use `font-display: swap`.
- Avoid sliders in the first screen. They are slow and rarely help.

## 3. Cut JavaScript and CSS (INP)

- Audit plugins with Query Monitor. Delete the ones you do not truly use.
- Load scripts only on the pages that need them (for example, a form plugin only on the contact page).
- Defer non-critical JavaScript and delay chat widgets, heatmaps and tag managers until the first interaction.
- Replace heavy page-builder add-ons with a few lines of CSS where possible.

## 4. Stop the layout jumping (CLS)

- Always set `width` and `height` on images and video.
- Reserve space for ads, banners and cookie notices.
- Do not inject content above what the visitor is already reading.

## 5. Clean the database and keep it clean

Old revisions, expired transients and abandoned plugin tables slow queries. Clean them, limit post revisions, and schedule it.

## Common mistakes

1. Installing three optimization plugins that fight each other.
2. Chasing a 100 score instead of real-user metrics.
3. Compressing images but leaving a 2 MB hero background video.
4. Optimizing only the home page. Check your top landing pages too.

## When to ask for help

If the site is still slow after caching, image work and a plugin audit, the cause is usually theme code, a heavy builder layout or a slow database query. That is where a developer pays for themselves. If you want an audit with a clear, prioritized list and a fixed price, send me the URL and I will tell you what I would change first.
