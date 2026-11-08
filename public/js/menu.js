/* js/menu.js — full-screen menu (circle opens from the menu icon, links rise in) and smooth scrolling for every link with data-go (menu + footer). */
PF.initMenu = () => {
const $ = PF.$;
let menuOpen = false;
const menu = $("menu"), burger = $("burger");
const originOf = () => { const r = burger.querySelector("i").getBoundingClientRect(); return `${r.left + r.width/2}px ${r.top + r.height/2}px`; };
const menuTl = gsap.timeline({ paused:true, defaults:{ ease:"power3.inOut" },
    onStart:() => menu.classList.add("is-on"), onReverseComplete:() => menu.classList.remove("is-on") })
  .fromTo(menu, { clipPath:() => `circle(0% at ${originOf()})` }, { clipPath:() => `circle(150% at ${originOf()})`, duration:.9 }, 0)
  .fromTo("#menu li a", { yPercent:110 }, { yPercent:0, duration:.8, stagger:.08, ease:"power4.out" }, .45)
  .fromTo(".menu-side>*", { opacity:0, y:20 }, { opacity:1, y:0, duration:.6, stagger:.06, ease:"power2.out" }, .7);

function setMenu(open) {
  menuOpen = open;
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.firstChild.nodeValue = open ? "Close" : "Menu";
  menu.setAttribute("aria-hidden", !open);
  open ? menuTl.invalidate().timeScale(1).play() : menuTl.timeScale(1.4).reverse();
  if (PF.lenis) open ? PF.lenis.stop() : PF.lenis.start();
}
burger.addEventListener("click", () => setMenu(!menuOpen));
addEventListener("keydown", e => { if (e.key === "Escape" && menuOpen) setMenu(false); });
const scrollToSection = go => {
  const y = go === "top" ? 0 : go === "about" && PF.sceneST ? PF.sceneST.end : $(go).getBoundingClientRect().top + scrollY;
  PF.lenis ? PF.lenis.scrollTo(y, { duration:1.6 }) : scrollTo({ top:y, behavior:"smooth" });
};
document.addEventListener("click", e => {          // links with data-go (menu and footer) scroll smoothly
  const a = e.target.closest("a"); if (!a) return;
  const go = a.dataset.go, inMenu = menu.contains(a);
  if (go) {
    e.preventDefault();
    if (inMenu) { setMenu(false); setTimeout(() => scrollToSection(go), 500); } else scrollToSection(go);
  } else if (inMenu) setMenu(false);
});
};
