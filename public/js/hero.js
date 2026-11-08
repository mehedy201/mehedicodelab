/* js/hero.js — opening animation of the first screen and the rotating headline (line-by-line). */
PF.initHero = () => {
const { items, badges } = PF;
const { HEADLINE_WAIT } = PF.config;
gsap.from(items, { opacity:0, duration:.9, stagger:{ each:.03, from:"random" }, delay:.3 });
gsap.from(".hi", { opacity:0, duration:.7, delay:.5 });
gsap.from(".bio,.meta,.hero .btn", { opacity:0, y:16, duration:.7, stagger:.1, delay:.6 });
gsap.set(badges, { xPercent:-50, yPercent:-50 });
gsap.fromTo(badges, { opacity:0, scale:.85 }, { opacity:1, scale:1, duration:.9, delay:.9, stagger:.15, ease:"back.out(1.6)" });
gsap.from(".hero-word", { yPercent:40, opacity:0, duration:1.4, delay:.4, ease:"power3.out" });

const lines = gsap.utils.toArray(".set").map(s => gsap.utils.toArray(".l>span", s));
gsap.set(".set", { opacity:1 });
lines.slice(1).forEach(l => gsap.set(l, { yPercent:115 }));
gsap.from(lines[0], { yPercent:115, duration:1, delay:.7, stagger:.1, ease:"power4.out" });

const rotate = gsap.timeline({ repeat:-1, delay:HEADLINE_WAIT + 1 });
lines.forEach((cur, i) => rotate
  .to(cur, { yPercent:-115, duration:.7, stagger:.07, ease:"power3.in" })
  .fromTo(lines[(i+1) % lines.length], { yPercent:115 }, { yPercent:0, duration:.8, stagger:.08, ease:"power3.out" }, "-=.15")
  .to({}, { duration:HEADLINE_WAIT }));
};
