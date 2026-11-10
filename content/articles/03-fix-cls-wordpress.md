---
category: WordPress Performance
date: 2026-11-10
description: Learn what causes Cumulative Layout Shift and how to
  prevent unexpected movement from images, fonts, ads, embeds, and
  dynamic content in WordPress.
tags: CLS, WordPress, Core Web Vitals, Elementor, Layout Shift
title: How to Fix CLS Issues in WordPress
---

# How to Fix CLS Issues in WordPress

Have you ever tried to click a button, only for the page to move at the
last moment? This unexpected movement is frustrating for visitors and
can cause accidental clicks.

Cumulative Layout Shift (CLS) measures unexpected layout movement during
a page's lifetime. It is one of Google's Core Web Vitals and is
especially relevant to pages where images, fonts, banners, or other
content appear after the initial render.

This guide explains how to find and fix common CLS problems in WordPress
and Elementor.

> **Key takeaways** - A good CLS score is 0.1 or less at the 75th
> percentile. - Images and embeds without reserved dimensions are common
> sources of layout shifts. - Late-loading fonts, banners, and
> dynamically inserted content can also move the page. - Reserve space
> before content loads and avoid inserting content above existing
> content unexpectedly.

## 1. Understand why layout shifts happen

A layout shift occurs when a visible element changes its position from
one rendered frame to another. It becomes a problem when the movement is
unexpected.

For example, a visitor starts reading a paragraph. An image above it
finishes loading without reserved space, pushing the paragraph down. The
visitor loses their place.

Common causes include:

-   Images or videos without dimensions.
-   Ads or promotional banners inserted after the page starts rendering.
-   Web fonts that change text size or line wrapping.
-   Popups or notices that push existing content.
-   Dynamically loaded sections without reserved space.

## 2. Find the elements causing CLS

Run the page through [Google PageSpeed
Insights](https://pagespeed.web.dev/) and review the CLS diagnostics.
When available, use the layout-shift details to identify the elements
involved.

You can also investigate in Chrome DevTools:

1.  Open Developer Tools.
2.  Select the **Performance** panel.
3.  Record a page load.
4.  Inspect the Experience or Layout Shifts information in the
    recording.
5.  Identify which elements moved and what appeared immediately before
    the shift.

Test the page from a fresh load. Some shifts happen only after fonts,
images, or third-party content finish loading.

## 3. Set image dimensions

Images should reserve the space they need before the browser downloads
them. WordPress-generated image markup normally includes width and
height attributes, but custom HTML, some page-builder elements, and
third-party widgets may omit them.

Use image elements with intrinsic dimensions:

``` html
<img
  src="/wp-content/uploads/product-image.webp"
  width="800"
  height="600"
  alt="Product displayed on a desk"
>
```

The browser can use these dimensions to calculate the image's aspect
ratio and reserve space. Make sure the dimensions match the actual image
ratio.

If you use Elementor, inspect the rendered HTML for the image that
shifts. Prefer the Image widget or a properly configured image element
instead of custom markup that omits dimensions.

## 4. Reserve space for banners, ads, and embeds

A cookie notice, announcement bar, ad slot, or embedded video can shift
content if it appears after the page has already rendered.

Set a predictable size or minimum height for the area before the
external content loads. For example:

``` css
.ad-slot {
  min-height: 250px;
}

.video-embed {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

Choose dimensions that match the content and the layout at each
breakpoint. Do not reserve a large empty space on mobile if the
component is not displayed there.

For embedded content, use a responsive wrapper with a known aspect
ratio. This lets the browser allocate space before the video or iframe
becomes available.

## 5. Optimize font loading

A web font can change the appearance and dimensions of text after it
loads. This may cause headings and paragraphs to wrap differently,
moving content below them.

To reduce font-related shifts:

-   Use fewer font families and weights.
-   Host only the font files you need when appropriate.
-   Use a sensible fallback font with similar metrics.
-   Consider `font-display: swap` or another suitable font-display
    strategy, while checking whether the fallback causes a noticeable
    layout change.
-   Preload a critical font only when it is needed for above-the-fold
    content.

Example:

``` css
@font-face {
  font-family: "Site Sans";
  src: url("/wp-content/uploads/fonts/site-sans.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

The best font-display choice depends on the design and the font. Always
test the visual result rather than applying a setting without checking.

## 6. Avoid inserting content above existing content

Some scripts add banners, notices, or recommendation blocks after the
page has loaded. If they are inserted above existing content, everything
below them may move.

Better approaches include:

-   Reserve a fixed or minimum-height area for the component.
-   Display overlays when appropriate instead of pushing the page
    content.
-   Render important layout elements in the initial HTML.
-   Avoid injecting promotional content above the current reading
    position.

An overlay must still be accessible and must not cover important
controls.

## 7. Check Elementor sections and responsive layouts

In Elementor, compare the desktop, tablet, and mobile layouts. A section
that has a stable height on desktop may change significantly on mobile
because of text wrapping or different image dimensions.

Review:

-   Background images and their container sizes.
-   Sliders and carousels.
-   Sticky headers and announcement bars.
-   Entrance animations that affect layout.
-   Dynamic widgets that load content after the initial render.

Prefer stable section dimensions and avoid animations that change the
document flow. If an animation is purely decorative, use transform or
opacity where suitable rather than repeatedly changing layout-affecting
properties.

## 8. Verify the fix

After making changes:

1.  Clear WordPress, plugin, and CDN caches.
2.  Test the page in PageSpeed Insights.
3.  Reload the page several times.
4.  Check mobile and desktop layouts.
5.  Confirm that the page does not jump when images, fonts, or embeds
    load.

CLS is evaluated across the page visit, so inspect more than the first
second of loading. Interactions and dynamically loaded content can also
contribute to layout instability.

## Common mistakes to avoid

-   Setting image width and height that do not match the image ratio.
-   Reserving space for one viewport but breaking another.
-   Adding a large empty placeholder without considering mobile.
-   Assuming all movement is caused by images.
-   Using animations that repeatedly change layout dimensions.
-   Ignoring third-party banners and embeds.

## Conclusion

Fixing CLS is mainly about making the layout predictable. Reserve space
for images and embeds, use stable font and component settings, and avoid
inserting content in ways that push existing elements around.

When a WordPress or Elementor page shifts unexpectedly, identify the
element that moved and the event that caused it. A targeted fix is more
reliable than changing the entire design.

## Further reading

-   [Web Vitals: Cumulative Layout Shift](https://web.dev/articles/cls)
-   [Optimize Cumulative Layout
    Shift](https://web.dev/articles/optimize-cls)
-   [Google PageSpeed Insights](https://pagespeed.web.dev/)
