/* js/nav.js — liquid-glass navigation bar: transparent at the top, glass after scrolling,
   and light text + dark glass while the bar is over a dark section. */
PF.initNav = () => {
/* navigation: glass background appears after scrolling, disappears at the very top */
const navEl = document.querySelector("nav");
const paintNav = () => navEl.classList.toggle("scrolled", scrollY > 24);
addEventListener("scroll", paintNav, { passive:true }); paintNav();
const darkUnderNav = new Set();                       // dark sections currently behind the bar
const navWatch = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting ? darkUnderNav.add(e.target) : darkUnderNav.delete(e.target));
  navEl.classList.toggle("on-dark", darkUnderNav.size > 0);
}, { rootMargin:"0px 0px -92% 0px" });
document.querySelectorAll(".services,.reviews,.footer").forEach(s => navWatch.observe(s));
};
