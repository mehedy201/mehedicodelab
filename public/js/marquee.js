/* js/marquee.js — infinite text slider: pauses when off-screen, speeds up and follows the scroll direction. */
PF.initMarquee = () => {
const { track } = PF;
const loop = gsap.to(track, { xPercent:-50, duration:40, ease:"none", repeat:-1, paused:true });
ScrollTrigger.create({ trigger:".marquee", onToggle:s => loop.paused(!s.isActive) });   // runs only while visible
ScrollTrigger.create({ onUpdate:s => {                  // scrolling speeds the marquee up and sets its direction
  gsap.killTweensOf(loop);
  gsap.to(loop, { timeScale:s.direction * (1 + Math.min(Math.abs(s.getVelocity())/250, 5)), duration:.2,
    onComplete:() => gsap.to(loop, { timeScale:s.direction, duration:1 }) });
} });
};
