/* js/reveals.js — scroll-in animations for Services, Our Work, process/reviews/contact headings, review badges, contact and the footer name. */
PF.initReveals = () => {
gsap.set(".sv-head .l>span", { yPercent:115 });
gsap.set(".sv-head p", { opacity:0, y:20 });
ScrollTrigger.create({ trigger:".sv-head", start:"top 85%", once:true, onEnter:() => {
  gsap.to(".sv-head .l>span", { yPercent:0, duration:1, ease:"power4.out" });
  gsap.to(".sv-head p", { opacity:.9, y:0, duration:.8, delay:.3 });
} });
gsap.set(".svc", { opacity:0, y:40 });
ScrollTrigger.batch(".svc", { start:"top 90%", once:true,
  onEnter:b => gsap.to(b, { opacity:1, y:0, duration:.9, stagger:.12, ease:"power3.out" }) });
// work: heading reveals, rows rise in
gsap.set(".work-head .l>span", { yPercent:115 });
gsap.set(".work-head p", { opacity:0, y:20 });
ScrollTrigger.create({ trigger:".work-head", start:"top 85%", once:true, onEnter:() => {
  gsap.to(".work-head .l>span", { yPercent:0, duration:1, ease:"power4.out" });
  gsap.to(".work-head p", { opacity:1, y:0, duration:.8, delay:.3 });
} });
gsap.set(".proj", { opacity:0, y:30 });
ScrollTrigger.batch(".proj", { start:"top 92%", once:true,
  onEnter:b => gsap.to(b, { opacity:1, y:0, duration:.9, stagger:.12, ease:"power3.out", clearProps:"transform" }) });

// process and reviews: headings reveal like the other sections
[".process-head", ".reviews-head", ".contact-intro", ".insights-head"].forEach(head => {
  gsap.set(`${head} .l>span`, { yPercent:115 });
  gsap.set(`${head} p`, { opacity:0, y:20 });
  ScrollTrigger.create({ trigger:head, start:"top 85%", once:true, onEnter:() => {
    gsap.to(`${head} .l>span`, { yPercent:0, duration:1, ease:"power4.out" });
    gsap.to(`${head} p`, { opacity:1, y:0, duration:.8, delay:.3 });
  } });
});

// reviews: rows fade in once
gsap.set(".proof-item, .rv-rows, .rv-more", { opacity:0, y:30 });
ScrollTrigger.batch(".proof-item, .rv-rows, .rv-more", { start:"top 92%", once:true,
  onEnter:b => gsap.to(b, { opacity:1, y:0, duration:.9, stagger:.12, ease:"power3.out", clearProps:"transform" }) });

// latest articles: cards rise in
gsap.set(".post-card, .insights-more", { opacity:0, y:30 });
ScrollTrigger.batch(".post-card, .insights-more", { start:"top 92%", once:true,
  onEnter:b => gsap.to(b, { opacity:1, y:0, duration:.9, stagger:.12, ease:"power3.out", clearProps:"transform" }) });

// contact and footer
gsap.set(".open-badge, .contact-intro .btn, .contact-list li", { opacity:0, y:30 });
ScrollTrigger.batch(".open-badge, .contact-intro .btn, .contact-list li", { start:"top 92%", once:true,
  onEnter:b => gsap.to(b, { opacity:1, y:0, duration:.9, stagger:.12, ease:"power3.out", clearProps:"transform" }) });
gsap.from(".footer-word", { yPercent:30, opacity:0, duration:1.2, ease:"power3.out", scrollTrigger:{ trigger:".footer", start:"top 85%", once:true } });
};
