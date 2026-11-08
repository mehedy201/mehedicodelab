#!/usr/bin/env node
/* build.js — turns content/articles/*.md + src/ templates into a static site in dist/.
   Run:  npm run build   (build only)   |   npm run dev   (build + local server on http://localhost:5173)
   Set your domain in site.config.json (or SITE_URL=https://example.com npm run build). */
const fs = require("fs"), path = require("path"), http = require("http");
const { marked } = require("marked");
let sharp; try { sharp = require("sharp"); } catch { /* optional: without it, share images (PNG) are skipped */ }

const cfg = require("./site.config.json");
if (process.env.SITE_URL) cfg.url = process.env.SITE_URL;
const URL_ = cfg.url.replace(/\/$/, "");
const R = (...p) => path.join(__dirname, ...p);
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive:true }); fs.writeFileSync(file, text); };
const read = (...p) => fs.readFileSync(R(...p), "utf8");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fill = (t, vars) => t.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");     // {{name}} placeholders
const dateLabel = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric", timeZone:"UTC" });

/* ---------- 1. articles ---------- */
const TINT = { "WordPress":"#21759B", "React & Next.js":"#0E7FA8", "Full-Stack":"#7C5CFF", "Elementor":"#D30C5C", "Performance":"#FF4D1F", "Business & Hiring":"#12805C" };
const GLYPH = { "WordPress":"W", "React & Next.js":"</>", "Full-Stack":"{ }", "Elementor":"E", "Performance":"ms", "Business & Hiring":"✓" };

function loadArticle(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = Object.fromEntries(m[1].split("\n").filter(Boolean).map(l => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  for (const k of ["title", "description", "date", "category"]) if (!meta[k]) throw new Error(`${file}: "${k}" is required`);
  const slug = path.basename(file, ".md");
  const toc = [];
  const html = marked.parse(m[2]).replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, inner) => {
    const id = inner.replace(/<[^>]+>/g, "").toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    toc.push({ level:+level, id, text:inner.replace(/<[^>]+>/g, "") });
    return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${level}>`;
  });
  return { ...meta, slug, html, toc, tags:(meta.tags || "").split(",").map(s => s.trim()).filter(Boolean),
    minutes:Math.max(1, Math.round(m[2].split(/\s+/).length / 220)), tint:TINT[meta.category] || "#7C5CFF",
    results:(meta.results || "").split(";").map(s => s.split("|").map(x => x.trim())).filter(r => r[0] && r[1]) };
}
const articles = fs.readdirSync(R("content/articles")).filter(f => f.endsWith(".md")).map(f => loadArticle(R("content/articles", f)))
  .sort((a, b) => b.date.localeCompare(a.date));

const wrap = t => {          // title lines for the share image (max 3 lines)
  const lines = []; let line = "";
  for (const w of t.split(" ")) { if ((line + " " + w).trim().length > 24) { lines.push(line); line = w; } else line = (line + " " + w).trim(); }
  lines.push(line);
  return lines.slice(0, 3).map((l, i) => `<text x="64" y="${230 + i * 76}" font-family="Arial,Helvetica,sans-serif" font-size="62" font-weight="800" fill="#F2F0EA">${esc(l)}</text>`).join("");
};
/* ---------- 2. cover art (unique per article, no stock photos needed) ---------- */
function cover(a, title) {
  let h = 0; for (const c of a.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const r = n => { h = (h * 1664525 + 1013904223) >>> 0; return (h % 1000) / 1000 * n; };
  const blob = (i, color) => `<radialGradient id="g${i}"><stop offset="0" stop-color="${color}" stop-opacity=".75"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${r(1200)}" cy="${r(630)}" r="${260 + r(220)}" fill="url(#g${i})"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><defs><pattern id="d" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#fff" fill-opacity=".16"/></pattern></defs>
<rect width="1200" height="630" fill="#121212"/>${blob(1, a.tint)}${blob(2, "#7C5CFF")}${blob(3, "#FF4D1F")}<rect width="1200" height="630" fill="url(#d)"/>
<text x="1140" y="470" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="330" font-weight="800" fill="none" stroke="#F2F0EA" stroke-opacity=".28" stroke-width="3">${esc(GLYPH[a.category] || "/")}</text>
<text x="64" y="86" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="800" fill="#F2F0EA">mehedi.</text>
<text x="64" y="566" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="700" fill="#F2F0EA">${esc(a.category)}</text>${title ? wrap(title) : ""}</svg>`;
}

/* ---------- 3. shared HTML pieces ---------- */
const jsonld = o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const seo = ({ title, description, path:p, image, type = "website", extra = "" }) => `<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${URL_}${p}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#F2F0EA">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<meta property="og:site_name" content="${esc(cfg.name)}"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${URL_}${p}">${image ? `<meta property="og:image" content="${URL_}${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">${image ? `<meta name="twitter:image" content="${URL_}${image}">` : ""}
${extra}`;
const forBlog = html => html.replace(/ data-go="[^"]*"/g, "").replace(/href="#/g, 'href="/#').replace(/href="articles\//g, 'href="/articles/');   // links work from sub-pages
const card = (a, big) => `<a class="post-card${big ? " big" : ""}" href="/articles/${a.slug}/" data-cat="${esc(a.category)}" style="--tint:${a.tint}"><span class="post-card-img"><img src="/covers/${a.slug}.svg" alt="" width="1200" height="630" loading="lazy"></span><span class="post-card-body"><span class="post-chip">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><span class="post-card-meta">${dateLabel(a.date)} · ${a.minutes} min read</span></span></a>`;
const nav = forBlog(read("src/partials/nav.html")), footer = forBlog(read("src/partials/footer.html"));
const page = (tplName, vars) => fill(read("src/templates", tplName), { nav, footer, ...vars });

/* ---------- 4. build ---------- */
(async () => {
  fs.rmSync(R("dist"), { recursive:true, force:true });
  fs.cpSync(R("public"), R("dist"), { recursive:true });
  fs.mkdirSync(R("dist/og"), { recursive:true });
  const skipped = e => console.warn("share image skipped:", e.message);

  // home
  const person = { "@type":"Person", "@id":URL_ + "/#me", name:cfg.name, jobTitle:"Full-Stack, React, Next.js & WordPress Developer", url:URL_ + "/", email:cfg.email, telephone:cfg.phone, image:URL_ + "/images/photo.webp", sameAs:[cfg.upwork], knowsAbout:cfg.skills };
  const homeLd = jsonld({ "@context":"https://schema.org", "@graph":[ person,
    { "@type":"WebSite", "@id":URL_ + "/#site", url:URL_ + "/", name:cfg.name, inLanguage:"en", publisher:{ "@id":URL_ + "/#me" } },
    { "@type":"ProfessionalService", name:cfg.name + " — Web Development", url:URL_ + "/", founder:{ "@id":URL_ + "/#me" }, areaServed:cfg.areaServed, serviceType:["Full-stack development", "Front-end development", "React development", "Next.js development", "WordPress development", "Elementor development", "Website speed optimization", "Website bug fixing", "Website maintenance"] } ] });
  write(R("dist/index.html"), fill(read("src/index.html"), { nav:read("src/partials/nav.html"), footer:read("src/partials/footer.html"),
    seo:seo({ title:cfg.title, description:cfg.description, path:"/", image:sharp ? "/og/default.png" : "", extra:homeLd }),
    teaser:articles.slice(0, 3).map(a => card(a)).join("") }));

  // article pages, covers, share images
  for (const a of articles) {
    const svg = cover(a);
    write(R("dist/covers", a.slug + ".svg"), svg);
    if (sharp) await sharp(Buffer.from(cover(a, a.title))).png().toFile(R("dist/og", a.slug + ".png")).catch(skipped);
    const related = articles.filter(x => x !== a).sort((x, y) => (y.category === a.category) - (x.category === a.category)).slice(0, 3);
    const idx = articles.indexOf(a);
    const ld = jsonld({ "@context":"https://schema.org", "@graph":[
      { "@type":"Article", headline:a.title, description:a.description, image:URL_ + (sharp ? `/og/${a.slug}.png` : `/covers/${a.slug}.svg`), datePublished:a.date, dateModified:a.updated || a.date,
        author:{ "@id":URL_ + "/#me", "@type":"Person", name:cfg.name, url:URL_ + "/" }, publisher:{ "@type":"Person", name:cfg.name }, mainEntityOfPage:`${URL_}/articles/${a.slug}/`, keywords:a.tags.join(", ") },
      { "@type":"BreadcrumbList", itemListElement:[ { "@type":"ListItem", position:1, name:"Home", item:URL_ + "/" }, { "@type":"ListItem", position:2, name:"Articles", item:URL_ + "/articles/" }, { "@type":"ListItem", position:3, name:a.title } ] } ] });
    write(R("dist/articles", a.slug, "index.html"), page("article.html", {
      seo:seo({ title:`${a.title} | ${cfg.name}`, description:a.description, path:`/articles/${a.slug}/`, image:sharp ? `/og/${a.slug}.png` : "", type:"article", extra:ld }),
      title:esc(a.title), description:esc(a.description), category:esc(a.category), tint:a.tint, slug:a.slug, url:`${URL_}/articles/${a.slug}/`,
      date:a.date, dateLabel:dateLabel(a.date), minutes:a.minutes, content:a.html, whatsapp:cfg.whatsapp, email:cfg.email, upwork:cfg.upwork,
      toc:a.toc.map(t => `<a class="toc-l${t.level}" href="#${t.id}">${t.text}</a>`).join(""),
      tags:a.tags.map(t => `<span>${esc(t)}</span>`).join(""),
      results:a.results.length ? `<div class="results">${a.results.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("")}</div>` : "",
      related:related.map(x => card(x)).join("") }));
  }

  // articles index
  const cats = [...new Set(articles.map(a => a.category))];
  write(R("dist/articles/index.html"), page("articles.html", {
    seo:seo({ title:`Articles on WordPress, React, Next.js & Web Performance | ${cfg.name}`, description:"Practical guides and case studies on WordPress, Elementor, React, Next.js and full-stack development, written for business owners and developers.", path:"/articles/", image:sharp ? "/og/default.png" : "",
      extra:jsonld({ "@context":"https://schema.org", "@type":"CollectionPage", name:"Articles", url:URL_ + "/articles/", isPartOf:{ "@id":URL_ + "/#site" } }) }),
    filters:`<button aria-pressed="true" data-cat="all">All</button>` + cats.map(c => `<button aria-pressed="false" data-cat="${esc(c)}">${esc(c)}</button>`).join(""),
    cards:articles.map((a, i) => card(a, i === 0)).join("") }));

  // 404, sitemap, robots, rss
  write(R("dist/404.html"), page("notfound.html", { seo:seo({ title:`Page not found | ${cfg.name}`, description:"This page does not exist.", path:"/404.html" }).replace("index,follow", "noindex") }));
  const today = new Date().toISOString().slice(0, 10);
  write(R("dist/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [["/", today], ["/articles/", articles[0]?.date || today], ...articles.map(a => [`/articles/${a.slug}/`, a.updated || a.date])].map(([u, d]) => `  <url><loc>${URL_}${u}</loc><lastmod>${d}</lastmod></url>`).join("\n") + `\n</urlset>\n`);
  write(R("dist/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${URL_}/sitemap.xml\n`);
  write(R("dist/rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(cfg.name)} — Articles</title><link>${URL_}/articles/</link><description>${esc(cfg.description)}</description>\n` +
    articles.map(a => `<item><title>${esc(a.title)}</title><link>${URL_}/articles/${a.slug}/</link><guid>${URL_}/articles/${a.slug}/</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.description)}</description></item>`).join("\n") + `\n</channel></rss>\n`);

  // default share image
  if (sharp) await sharp(Buffer.from(cover({ slug:"home", category:"Full-Stack · React · Next.js · WordPress", tint:"#7C5CFF" }, "Full-Stack, React, Next.js & WordPress Developer")))
    .png().toFile(R("dist/og/default.png")).catch(skipped);
  console.log(`Built ${articles.length} articles → dist/  (site url: ${URL_})`);

  /* ---------- 5. local server ---------- */
  if (process.argv.includes("--serve")) {
    const types = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".svg":"image/svg+xml", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".xml":"application/xml", ".txt":"text/plain" };
    http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
      const file = path.join(R("dist"), p);
      if (!file.startsWith(R("dist")) || !fs.existsSync(file)) { res.writeHead(404, { "Content-Type":"text/html" }); return res.end(fs.readFileSync(R("dist/404.html"))); }
      res.writeHead(200, { "Content-Type":types[path.extname(file)] || "application/octet-stream" }); fs.createReadStream(file).pipe(res);
    }).listen(5173, () => console.log("Open http://localhost:5173"));
  }
})();
