/* js/scene.js — the pinned scroll scene: icons float away, the photo grows from a small star into the About portrait,
   proof badges travel beside it, the background name shrinks and fades, and the About text slides in. */
PF.initScene = () => {
const { scene, photo, pf, slot, items, badges, startOf, endOf } = PF;
const { PHOTO_X, TABLET } = PF.config;
ScrollTrigger.create({ trigger:scene, start:"top top", end:"+=50",       // the photo star twinkles only at the very top
  onLeave:() => pf.classList.remove("twinkle"), onEnterBack:() => pf.classList.add("twinkle") });

const slotPos = () => {                   // start point of the photo, relative to the screen center
  const a = slot.getBoundingClientRect(), s = scene.getBoundingClientRect();
  return { x:a.left + a.width/2 - (s.left + s.width/2), y:a.top + a.height/2 - (s.top + s.height/2), scale:a.width / photo.offsetWidth };
};

function buildScroll(wide) {
  const tl = gsap.timeline({ defaults:{ ease:"none" },
    scrollTrigger:{ trigger:scene, start:"top top", end:"+=260%", scrub:1.3, pin:true, anticipatePin:1, invalidateOnRefresh:true } });
  PF.sceneST = tl.scrollTrigger;
  badges.forEach((b, i) => tl
    .fromTo(b, { x:() => startOf(i).x }, { x:() => endOf(i, wide).x, ease:"power2.inOut", duration:3.2 }, 0)
    .fromTo(b, { y:() => startOf(i).y }, { y:() => endOf(i, wide).y, ease:"sine.inOut", duration:3.2 }, 0));
  tl.fromTo(photo, { x:() => slotPos().x }, { x:wide ? () => innerWidth*PHOTO_X : 0, ease:"power2.inOut", duration:3.2 }, 0)
    .fromTo(photo, { y:() => slotPos().y }, { y:wide ? 0 : () => -innerHeight*.2, ease:"sine.inOut", duration:3.2 }, 0)
    .fromTo(photo, { scale:() => slotPos().scale }, { scale:1, ease:"power3.inOut", duration:3.2 }, 0)
    .to(items, { y:(i,el) => -innerHeight*(.35 + el.dataset.depth*.85),
                 x:(i,el) => (el.getBoundingClientRect().left - innerWidth/2)*.18*el.dataset.depth, duration:3.2 }, 0)
    .to(items, { opacity:0, duration:1.6, ease:"power1.in" }, 1.4)
    .to(".hero-word", { scale:.7, duration:3.2 }, 0)
    .to(".hero-word", { opacity:0, duration:1.4, ease:"power1.in" }, 3.2)
    .to("#hero", { opacity:0, y:-50, duration:1.4 }, .1)
    .set(".about", { zIndex:4 }, 2.2)
    .fromTo(".about>div>*", { opacity:0, x:wide ? 110 : 0, y:wide ? 0 : 36 }, { opacity:1, x:0, y:0, duration:1.2, stagger:.18, ease:"power3.out" }, 2.2)
    .to({}, { duration:.9 });
}
gsap.matchMedia()
  .add(`(min-width:${TABLET+1}px)`, () => buildScroll(true))
  .add(`(max-width:${TABLET}px)`,  () => buildScroll(false));
};
