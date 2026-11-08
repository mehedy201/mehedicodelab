/* js/cursor.js — custom cursor (dot + ring). Over text the ring becomes a liquid-glass lens that magnifies slightly (Chrome/Edge).
   Floating icons glide away from the cursor. Desktop mouse only. */
PF.initCursor = () => {
const { items, stage, isWide } = PF;
const { REPEL_RADIUS, REPEL_FORCE, TEXT } = PF.config;
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const zoom = /Chrome|Chromium|Edg/.test(navigator.userAgent);
  const dot = Object.assign(document.createElement("div"), { className:"cur" });
  const ring = Object.assign(document.createElement("div"), { className:"cur2" });
  document.body.classList.add("has-cursor");
  document.body.append(ring, dot);
  gsap.set([dot, ring], { x:-100, y:-100 });

  const follow = (el, d, ease) => [gsap.quickTo(el,"x",{duration:d,ease}), gsap.quickTo(el,"y",{duration:d,ease})];
  const [dotX, dotY] = follow(dot, .12), [ringX, ringY] = follow(ring, .45, "power3");

  const movers = items.map(el => ({ el, on:false, cx:0, cy:0,
    x:gsap.quickTo(el._push,"x",{duration:.9,ease:"power3.out"}), y:gsap.quickTo(el._push,"y",{duration:.9,ease:"power3.out"}) }));
  const measure = () => {
    const r = stage.getBoundingClientRect(), i = isWide() ? 0 : 2;
    movers.forEach(m => { m.cx = r.left + r.width*m.el._pos[i]/100; m.cy = r.top + r.height*m.el._pos[i+1]/100; });
  };
  measure(); addEventListener("resize", measure);

  let mode = "";
  addEventListener("pointermove", e => {
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
    const radius = scrollY < 30 ? REPEL_RADIUS : 0;          // icons only react at the top of the page
    let near = false;
    movers.forEach(m => {
      const dx = m.cx - e.clientX, dy = m.cy - e.clientY, d = Math.hypot(dx, dy);
      if (d < radius) { const f = (1-d/radius)**1.6 * REPEL_FORCE; m.x(dx/d*f); m.y(dy/d*f); m.on = near = true; }
      else if (m.on) { m.x(0); m.y(0); m.on = false; }
    });
    const t = e.target;
    document.body.classList.toggle("on-dark", !!t.closest(".services,.reviews,.process-head,.footer"));
    const next = near || t.closest(".btn,.burger") ? "big" : t.closest(TEXT) ? "lens" + (zoom ? " zoom" : "") : "";
    if (next !== mode) { mode = next; ring.className = "cur2 " + mode; }
  }, { passive:true });
  document.documentElement.addEventListener("mouseleave", () => {
    movers.forEach(m => { m.x(0); m.y(0); m.on = false; });
    mode = ""; ring.className = "cur2";
  });
}
};
