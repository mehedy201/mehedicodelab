---
title: How to Improve INP in React Apps: A Practical Guide
description: INP measures how quickly your app responds to taps and clicks. Learn how to find slow interactions in React and fix them with transitions, smaller renders and less main-thread work.
date: 2026-09-29
category: React & Next.js
tags: React, INP, Performance, Core Web Vitals
---
Interaction to Next Paint (INP) replaced First Input Delay as a Core Web Vital in 2024. It asks a simple question: when someone taps or clicks, how long until the screen visibly responds? In React apps, slow answers usually come from too much work on the main thread.

> **Key takeaways**
> - Measure real interactions before you optimize.
> - Do less work per interaction: smaller renders, less JavaScript.
> - Keep urgent updates (typing, clicking) separate from non-urgent ones (filtering, rendering).

## What a good INP looks like

Google treats 200 milliseconds or less as good, measured at the 75th percentile of real visits. Between 200 and 500 ms needs improvement, and above 500 ms is poor.

## 1. Find the slow interaction

- Use the **Performance** panel in Chrome DevTools. Record, click the slow control, and look for long tasks.
- Add the `web-vitals` library and log `onINP` in production, so you see real-user data.
- Use React DevTools Profiler to see which components re-render on that interaction.

## 2. Render less

- Do not keep fast-changing values (like input text) in a high-level state if only one component needs them.
- Move state down, closer to where it is used.
- Use `React.memo`, `useMemo` and `useCallback` where the Profiler shows a real benefit, not everywhere by default.
- **Virtualize long lists** so only visible rows are in the DOM.

## 3. Separate urgent from non-urgent work

React's concurrent features help here:

```jsx
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [isPending, startTransition] = useTransition();

function onChange(e) {
  setQuery(e.target.value);                      // urgent: the input stays instant
  startTransition(() => setResults(filter(allItems, e.target.value)));   // can wait
}
```

`useDeferredValue` gives a similar result when the value comes from props.

## 4. Reduce JavaScript on the main thread

- Split code by route and lazy-load heavy components.
- Move expensive calculations to a Web Worker.
- Break long tasks into smaller chunks and yield to the browser between them.
- Delay third-party scripts (chat, analytics, tag managers) until after the first interaction.

## 5. Avoid layout thrashing

Reading layout values (like `offsetHeight`) right after writing styles forces the browser to recalculate layout repeatedly. Batch reads first, then writes.

## A quick workflow

1. Pick the worst interaction from real-user data.
2. Reproduce it with CPU throttling in DevTools.
3. Fix the biggest long task first.
4. Re-measure. Stop when you reach the target.

Good INP is as much a product feature as a technical one: the app feels fast. If your React or Next.js app feels sluggish and you would like a focused performance review, send me the link and your most painful screen.
