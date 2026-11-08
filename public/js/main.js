/* js/main.js — starts everything in the right order. Nothing here needs editing. */
(() => {
"use strict";
PF.build();                              // 1. generate icons, projects, reviews...
if (!window.gsap || !window.ScrollTrigger) return;
gsap.registerPlugin(ScrollTrigger);

PF.initMenu();                           // 2. menu and smooth section links
PF.initWork();                           //    "Our Work" accordion
PF.initNav();                            //    glass navigation bar

if (matchMedia("(prefers-reduced-motion:reduce)").matches) {   // less motion: show the final layout, no animation
  const { PHOTO_X } = PF.config, wide = PF.isWide();
  gsap.set(PF.photo, { scale:1, x:wide ? innerWidth*PHOTO_X : 0, y:wide ? 0 : -innerHeight*.2 });
  gsap.set(["#hero", "#stage", ".hero-word"], { opacity:0 });
  PF.badges.forEach((b, i) => gsap.set(b, { xPercent:-50, yPercent:-50, opacity:1, ...PF.endOf(i, wide) }));
  return;
}

if (window.Lenis) {                      // 3. smooth scrolling
  PF.lenis = new Lenis({ duration:1.2 });
  PF.lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => PF.lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
}

PF.initCursor();                         // 4. cursor and icon repel
PF.initHero();                           // 5. first-screen animation + rotating headline
PF.initScene();                          // 6. pinned scroll scene (must run before the sections below)
PF.initMarquee();                        // 7. sections after the scene
PF.initReveals();
PF.initProcess();
})();
