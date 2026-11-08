/* js/blog.js — everything the article pages need: shared menu + glass nav, reading progress,
   table-of-contents highlight, copy-link button, topic filter, scroll reveal. */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add("js");
const year = $("#year"); if (year) year.textContent = new Date().getFullYear();

// menu and glass navigation are the same code as the home page
if (window.gsap && window.PF && PF.initMenu) { PF.initMenu(); PF.initNav(); }

// reading progress bar
const bar = $(".read-progress");
if (bar) {
  const paint = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`; };
  addEventListener("scroll", paint, { passive:true }); paint();
}

// highlight the table-of-contents link of the section being read
const links = $$(".toc a");
if (links.length && "IntersectionObserver" in window) {
  const byId = Object.fromEntries(links.map(a => [a.getAttribute("href").slice(1), a]));
  const seen = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { links.forEach(a => a.classList.remove("on")); byId[e.target.id]?.classList.add("on"); }
  }), { rootMargin:"-15% 0px -75% 0px" });
  $$(".prose h2[id], .prose h3[id]").forEach(h => seen.observe(h));
}

// copy link
$$("[data-copy]").forEach(b => b.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copied ✓"; setTimeout(() => b.textContent = "Copy link", 1800); } catch { /* clipboard blocked */ }
}));

// topic filter on the articles page
const chips = $$(".filters button");
chips.forEach(c => c.addEventListener("click", () => {
  chips.forEach(x => x.setAttribute("aria-pressed", x === c));
  $$(".post-grid.index .post-card").forEach((card, i) => { card.hidden = c.dataset.cat !== "all" && card.dataset.cat !== c.dataset.cat; card.classList.toggle("big", false); });
  const first = $(".post-grid.index .post-card:not([hidden])"); if (first && c.dataset.cat === "all") first.classList.add("big");
}));

// scroll reveal for cards and article blocks
const items = $$(".post-card, .cta-panel, .results div, .prose>h2");
if ("IntersectionObserver" in window) {
  items.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin:"0px 0px -8% 0px" });
  items.forEach(el => io.observe(el));
}
})();
