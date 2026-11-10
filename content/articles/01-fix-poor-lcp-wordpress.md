---
category: WordPress Performance
date: 2026-11-10
description: Learn how to find the Largest Contentful Paint element and
  improve LCP in WordPress with practical image, hosting, and rendering
  optimizations.
tags: LCP, WordPress, Core Web Vitals, Elementor, Website Speed
title: How to Fix a Poor LCP Score in WordPress
---

# How to Fix a Poor LCP Score in WordPress

A WordPress page can feel slow even when the rest of the content appears
quickly. The reason may be its Largest Contentful Paint (LCP): the time
it takes for the largest visible image or text block in the initial
viewport to render.

LCP is an important Core Web Vital because it helps measure how quickly
visitors can see the main content of a page. A slow LCP can make a
website feel unfinished and may affect the user experience, especially
on mobile connections.

This guide explains how to identify the LCP element and improve it
without applying random speed settings.

> **Key takeaways** - A good LCP result is 2.5 seconds or less at the
> 75th percentile. - The LCP element is often a hero image, banner,
> featured image, or large heading. - The most useful fixes usually
> involve faster server responses, correctly sized images, and removing
> delays before the LCP resource loads. - Do not lazy-load the image
> that is responsible for LCP.

## 1. Understand what is causing the LCP delay

LCP is not simply the time required to download an image. Several stages
can delay it:

1.  The browser waits for the server to respond.
2.  The browser discovers the main image or content.
3.  The required resource downloads.
4.  The browser processes styles and renders the content.

A delay in any of these stages can increase LCP. For example, a large
hero image may be the main problem, but a slow server or render-blocking
stylesheet can delay it before the image even begins downloading.

## 2. Find the actual LCP element

Start with [Google PageSpeed Insights](https://pagespeed.web.dev/). Test
the page URL and review the Largest Contentful Paint section.

Look for the LCP element or related diagnostic details. PageSpeed
Insights may identify an image, heading, or another large visible
element.

For a more detailed inspection:

1.  Open the page in Chrome.
2.  Open Developer Tools.
3.  Select the **Performance** tab.
4.  Record a page load.
5.  Inspect the LCP marker and the related element.

Test the exact page that has the problem. The homepage, service page,
and blog article may have different LCP elements.

## 3. Optimize the LCP image

If the LCP element is a hero or banner image, check its dimensions,
format, and file size.

-   Resize the image to the largest dimensions it actually needs on the
    page.
-   Use a modern format such as WebP or AVIF when it is supported by
    your image workflow.
-   Compress the image while keeping acceptable visual quality.
-   Avoid uploading a 3000-pixel image when the displayed area only
    needs a much smaller version.
-   Use responsive image output so mobile devices do not download
    unnecessarily large files.

WordPress normally generates multiple image sizes and can output
responsive `srcset` attributes. Use the appropriate image size in the
page builder rather than forcing the original full-size image into every
layout.

## 4. Do not lazy-load the LCP image

Lazy loading is useful for images further down the page. However, if the
main above-the-fold image is lazy-loaded, the browser may wait longer
before requesting it.

For the LCP image, use eager loading and give it high fetch priority
when appropriate. WordPress supports image loading attributes, and
recent WordPress versions can add fetch priority to important images.

For a known hero image, you can conditionally adjust its attributes
using its attachment ID:

``` php
add_filter('wp_get_attachment_image_attributes', function ($attr, $attachment) {
    $lcp_image_id = 123; // Replace with your hero image attachment ID.

    if ((int) $attachment->ID === $lcp_image_id) {
        $attr['loading'] = 'eager';
        $attr['fetchpriority'] = 'high';
    }

    return $attr;
}, 10, 2);
```

Add this through a child theme or a trusted snippets solution, and
replace `123` with the correct media-library attachment ID. Do not apply
high priority to every image. The browser should have a clear priority
for the most important resource.

## 5. Improve server response time

A browser cannot render page content until it receives the required HTML
and resources. If the initial server response is slow, LCP may suffer.

Review these areas:

-   Hosting performance and available server resources.
-   PHP and database performance.
-   Page caching for public pages.
-   Unnecessary plugins or expensive background operations.
-   CDN configuration for visitors far from the origin server.

Measure Time to First Byte (TTFB) before changing hosting settings. If
TTFB is consistently high, image compression alone will not solve the
full problem.

## 6. Reduce delays from CSS and JavaScript

A browser may need to download and process CSS before it can display the
page correctly. Large stylesheets, unnecessary scripts, and third-party
embeds can delay rendering.

Review the PageSpeed diagnostics for render-blocking resources. Remove
unused assets where possible, reduce unnecessary third-party scripts,
and use safe defer or delay settings for non-critical JavaScript.

Do not blindly defer every script. Some scripts depend on others, and
changing their execution order can break navigation menus, forms,
sliders, or Elementor features.

## 7. Check fonts and above-the-fold layout

A large heading may be the LCP element. If the font file takes too long
to load, the visible text can be delayed or may change after rendering.

Use only the font weights you need, serve fonts efficiently, and
consider preloading a critical font only when it is genuinely required
for the initial viewport. Also avoid hiding the main heading until an
animation or JavaScript effect runs.

## 8. Test the result correctly

After making changes:

1.  Clear page and CDN caches.
2.  Test the same URL again in PageSpeed Insights.
3.  Check both mobile and desktop results.
4.  Confirm that the page still works and looks correct.
5.  Compare field data when available, not just one laboratory test.

A single test can vary because of network and server conditions. Look
for consistent improvement rather than chasing a perfect score.

## Common mistakes to avoid

-   Lazy-loading the main hero image.
-   Preloading several large images without checking which one is the
    LCP resource.
-   Compressing images but ignoring a slow server response.
-   Installing multiple optimization plugins that duplicate features.
-   Removing CSS or JavaScript without checking the page afterward.
-   Treating a single Lighthouse score as a guarantee of real-user
    performance.

## Conclusion

Improving LCP starts with identifying the actual LCP element. Once you
know whether the delay comes from the server, image discovery, image
download, or rendering, you can make targeted changes instead of
enabling every optimization setting.

If your WordPress or Elementor website has a poor LCP score, a
structured performance audit can reveal which changes are likely to make
the biggest difference. A good optimization process improves both
loading performance and the experience visitors have when they arrive.

## Further reading

-   [Web Vitals: Largest Contentful Paint](https://web.dev/articles/lcp)
-   [WordPress image optimization](https://wordpress.org/documentation/)
-   [Google PageSpeed Insights](https://pagespeed.web.dev/)
