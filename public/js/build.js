/* js/build.js — builds everything that is generated from data:
   floating icons and stars, marquee text, project rows, review cards, the proof-badge twins, and the footer year.
   It also publishes shared elements and helpers on PF for the other files. */
window.PF = window.PF || {};
PF.$ = id => document.getElementById(id);
PF.build = () => {
const $ = PF.$, icon = PF.icon;
const { ICONS, STARS, DOT_COLORS, PHOTO_X, TABLET } = PF.config;
const { MARQUEE, PROJECTS, REVIEWS } = PF.content;
const rand = (a,b) => a + Math.random()*(b-a);
const stage = $("stage"), items = [];

function addItem(markup, pos, dot) {
  const color = dot ? `--c:${DOT_COLORS[Math.random()*DOT_COLORS.length|0]};` : "";
  const el = document.createElement("div");
  el.className = "ico";
  el.style.cssText = `--dx:${pos[0]}%;--dy:${pos[1]}%;--mx:${pos[2]}%;--my:${pos[3]}%`;
  el.dataset.depth = rand(.35,1).toFixed(2);
  el.innerHTML = `<div class="rp"><div class="ib${dot?" dot":""}" style="${color}--d:${rand(1.4,3.2).toFixed(1)}s;--delay:-${rand(0,3).toFixed(1)}s;--tx:${rand(-7,7).toFixed(0)}px;--ty:${rand(-7,7).toFixed(0)}px">${markup}</div></div>`;
  el._push = el.firstChild; el._pos = pos;
  stage.appendChild(el); items.push(el);
}
ICONS.forEach(i => addItem(icon(i[0]), i.slice(1), false));
for (let n = 0; n < STARS; n++) {
  let x, y, mx, my;
  do { x = Math.random()<.7 ? rand(45,100) : rand(0,45); y = rand(0,100); } while (x>85 && y>38 && y<62);   // keep the photo star area clear
  do { mx = rand(0,100); my = rand(68,98); } while (mx>38 && mx<62 && my>74 && my<94);
  addItem("", [x,y,mx,my], true);
}
const track = $("marquee");   // two identical groups, so the loop has no visible jump
const group = `<div class="marquee-group">${[...MARQUEE, ...MARQUEE].map(t => `<span class="marquee-item">${t}</span>`).join("")}</div>`;
track.innerHTML = group + group.replace("<div ", '<div aria-hidden="true" ');
// project rows: only number, name and subtitle show until a row is opened
$("work-list").innerHTML = PROJECTS.map((p, i) => `
  <article class="proj" style="--tint:${p.tint}">
    <h3><button class="proj-head" aria-expanded="false" aria-controls="proj-${i}">
      <span class="proj-num">0${i+1}</span><span class="proj-name">${p.title}</span><span class="proj-sub"><span class="proj-tag">${p.type}</span>${p.subtitle}</span><span class="proj-plus" aria-hidden="true"></span>
    </button></h3>
    <div class="proj-body" id="proj-${i}"><div class="proj-inner">
      <div class="proj-text">
        <p class="proj-about">${p.about}</p>
        <ul class="proj-feat">${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
        <dl class="proj-facts">
          <div><dt>My role</dt><dd>${p.role}</dd></div>
          <div><dt>Tech stack</dt><dd class="chips">${p.stack.map(s => `<span>${s}</span>`).join("")}</dd></div>
        </dl>
        ${p.url === "#" ? '<span class="btn btn-off">Live link coming soon</span>'
                        : `<a class="btn" href="${p.url}" target="_blank" rel="noopener">View live site ↗</a>`}
      </div>
      <div class="proj-visual" data-n="0${i+1}"><div class="shot${p.frame === false ? " free" : ""}">
        <img src="${p.image}" alt="${p.title} preview" width="${p.size[0]}" height="${p.size[1]}">
      </div></div>
    </div></div>
  </article>`).join("");
// reviews: two rows, each filled so the loop has no gap, moving in opposite directions
const reviewCard = r => `<blockquote class="rv"><div class="rv-stars" role="img" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}</div><p>${r.text}</p><footer><b>${r.author}</b><span>${r.job}</span></footer></blockquote>`;
const fill = (list, min) => { const out = []; while (out.length < min) out.push(...list); return out; };
if (REVIEWS.length) $("rv-rows").innerHTML = [0, 1].map(row => {
  const mine = REVIEWS.filter((_, i) => i % 2 === row), cards = fill(mine.length ? mine : REVIEWS, 6);
  const group = `<div class="rv-group">${cards.map(reviewCard).join("")}</div>`;
  return `<div class="rv-row${row ? " rev" : ""}" style="--dur:${cards.length * 14}s">${group}${group.replace("<div ", '<div aria-hidden="true" ')}</div>`;
}).join("");
$("year").textContent = new Date().getFullYear();
const code = $("code"); code.textContent += "\n\n" + code.textContent;   // doubled so the slow scroll loops

const scene = $("scene"), photo = $("photo"), pf = $("pf"), slot = $("slot");
const isWide = () => innerWidth > TABLET;

// proof badges: invisible twins in the greeting line mark where they start; they end beside the photo in About
const badges = [...document.querySelectorAll(".badge")];
const twins = badges.map(b => {
  const twin = b.cloneNode(true);
  twin.className = "badge badge-slot"; twin.setAttribute("aria-hidden", "true");
  $("hi-badges").appendChild(twin);
  return twin;
});
const startOf = i => {
  const a = twins[i].getBoundingClientRect(), s = scene.getBoundingClientRect();
  return { x:a.left + a.width/2 - (s.left + s.width/2), y:a.top + a.height/2 - (s.top + s.height/2) };
};
const endOf = (i, wide) => {            // i = 0: left badge, 1: right badge
  const r = photo.offsetWidth/2, side = i ? 1 : -1, px = wide ? innerWidth*PHOTO_X : 0, py = wide ? 0 : -innerHeight*.2;
  return wide ? { x:px + side*r*.62, y:py + r*.86 } : { x:side*innerWidth*.25, y:py - r - 34 };
};
Object.assign(PF, { stage, items, track, scene, photo, pf, slot, badges, isWide, startOf, endOf });
};
