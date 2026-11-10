---
category: WordPress Performance
date: 2026-11-10
description: Improve WordPress image performance with the right
  dimensions, compression, WebP and AVIF formats, responsive images, and
  loading priorities.
tags: Image Optimization, WordPress, WebP, AVIF, PageSpeed Insights, LCP
title: How to Optimize Images for Better PageSpeed Scores
---

# How to Optimize Images for Better PageSpeed Scores

Images often make up a large part of a web page's total download size. A
high-resolution banner, product gallery, or collection of blog images
can slow down a WordPress website---especially on mobile connections.

Image optimization is not just about making every file as small as
possible. The goal is to deliver the right image dimensions and format,
at an acceptable visual quality, when the visitor needs it.

This guide covers practical image optimization for WordPress and
Elementor websites.

> **Key takeaways** - Resize images to match their actual display
> requirements. - Use modern formats such as WebP or AVIF when your
> workflow and visitors support them. - Serve responsive image sizes
> instead of sending oversized files to every device. - Lazy-load
> below-the-fold images, but do not lazy-load the main LCP image.

## 1. Find the images that need attention

Run your page through [Google PageSpeed
Insights](https://pagespeed.web.dev/) and review image-related
opportunities and diagnostics.

Look for messages such as:

-   Properly size images.
-   Efficiently encode images.
-   Serve images in next-gen formats.
-   Defer offscreen images.
-   Improve image delivery.

These messages point to different problems. For example, converting a
PNG to WebP may reduce file size, but it will not solve an image that is
several times larger than its displayed dimensions.

## 2. Resize images before uploading

Start with the dimensions. If an image is displayed at 600 pixels wide,
uploading a 3000-pixel version may waste bandwidth.

Before uploading:

1.  Check the image's intended display size.
2.  Export it at an appropriate resolution for the layout and device
    pixel density.
3.  Keep the original for future editing.
4.  Upload the optimized version to WordPress.

Do not make every image the same size. A full-width hero, a product
thumbnail, and a small author avatar have different requirements.

## 3. Choose an appropriate image format

WebP and AVIF can often deliver smaller files than older formats at
comparable visual quality. However, the best format depends on the
image, compression settings, browser support, and delivery setup.

-   **JPEG:** still useful for photographs and compatible workflows.
-   **PNG:** useful when transparency or lossless detail is required,
    but can be unnecessarily large for photographs.
-   **WebP:** a practical modern format for many website images.
-   **AVIF:** can provide strong compression, but should be tested with
    your image pipeline and fallback requirements.

Compare the visual quality at the actual display size. Avoid aggressive
compression that creates visible artifacts around text, edges, or
product details.

## 4. Compress images without damaging quality

Use an image editor or a trusted WordPress image optimization workflow
to reduce file size. Review the output before replacing important
images.

A sensible process is:

-   Keep an original copy.
-   Export a resized version.
-   Apply compression appropriate to the image type.
-   Compare the result at normal viewing size.
-   Check the final file size and visual quality.

Avoid installing several image optimization plugins that perform the
same conversion or compression tasks. Conflicting workflows can create
duplicate files or unexpected results.

## 5. Use responsive images

A mobile visitor usually does not need the same large image file as a
desktop visitor. WordPress can generate multiple image sizes and use
`srcset` and `sizes` so the browser can choose a suitable source.

When using custom HTML, provide responsive sources where appropriate:

``` html
<img
  src="/images/office-800.webp"
  srcset="
    /images/office-400.webp 400w,
    /images/office-800.webp 800w,
    /images/office-1200.webp 1200w
  "
  sizes="(max-width: 600px) 100vw, 800px"
  width="1200"
  height="800"
  alt="Modern office workspace"
>
```

The width and height values should represent the intrinsic dimensions of
the fallback image and preserve the same aspect ratio across the
variants.

For WordPress content, prefer the native image functions or the page
builder's responsive image output rather than manually replacing image
URLs without understanding how the media library works.

## 6. Lazy-load images below the fold

Images far below the initial viewport usually do not need to download
immediately. Native lazy loading can delay their requests until they are
near the visible area.

WordPress supports lazy loading for many images by default. Check the
rendered markup and avoid adding lazy loading indiscriminately.

The key exception is the LCP image. If the hero image is the largest
visible element, lazy-loading it can delay the main content. Keep that
image eager-loaded and consider high fetch priority when appropriate.

## 7. Use background images carefully in Elementor

Elementor often uses CSS background images for hero sections and
decorative layouts. Background images do not behave exactly like regular
image elements, so responsive settings and loading priority need
attention.

For each background image:

-   Upload an appropriately sized asset.
-   Set separate mobile and desktop backgrounds when the designs need
    different crops.
-   Avoid using a huge desktop background on a small phone screen.
-   Check whether the background is the LCP element.
-   Consider using a normal image element for meaningful content that
    needs responsive image behavior and useful alternative text.

Do not convert every background into an image element automatically.
Choose the element type based on the content and design.

## 8. Add meaningful alternative text

Alt text is primarily an accessibility feature, not a direct PageSpeed
optimization. Describe the useful information conveyed by an image. For
decorative images, use an empty alt attribute when appropriate.

Avoid stuffing keywords into every alt attribute. A product image should
describe the product, while a decorative shape does not need a long
description.

## 9. Test image delivery

After optimization:

1.  Clear page and CDN caches.
2.  Open the page on desktop and mobile.
3.  Inspect image requests in Chrome DevTools.
4.  Confirm that mobile devices receive suitable image sizes.
5.  Check that important images load promptly.
6.  Run PageSpeed Insights again.

Also check visual quality. A technically smaller image is not an
improvement if it makes the product, brand, or content difficult to see.

## Common mistakes to avoid

-   Uploading original camera images directly to the website.
-   Converting every image to one format without checking quality.
-   Lazy-loading the hero image that determines LCP.
-   Serving desktop-sized images to mobile devices.
-   Using CSS background images for meaningful content without
    considering accessibility.
-   Installing multiple plugins that duplicate image optimization
    features.

## Conclusion

Good image optimization combines correct dimensions, suitable formats,
responsive delivery, and sensible loading priorities. It can reduce page
weight and improve the loading experience without sacrificing visual
quality.

For WordPress and Elementor websites, inspect the actual image requests
and PageSpeed diagnostics first. Then optimize the images that have the
greatest effect on the visitor experience.

## Further reading

-   [Optimize
    images](https://web.dev/learn/performance/image-performance)
-   [Responsive images in
    WordPress](https://developer.wordpress.org/apis/responsive-images/)
-   [Google PageSpeed Insights](https://pagespeed.web.dev/)
