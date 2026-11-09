/* dev.js — local development server: rebuilds when you save a file and reloads the browser by itself.
   Run: npm run dev   then open http://localhost:5173 */
const { spawnSync } = require("child_process"), fs = require("fs"), path = require("path"), http = require("http");
const root = __dirname, dist = path.join(root, "dist");
const clients = new Set();                                   // open browser tabs waiting for a reload signal

const build = () => {
  spawnSync(process.execPath, ["build.js"], { cwd: root, stdio: "inherit" });
  clients.forEach(res => res.write("data: reload\n\n"));      // tell every tab to refresh
};
let timer;
const schedule = () => { clearTimeout(timer); timer = setTimeout(build, 150); };   // wait a moment so a save is not built twice

build();
for (const dir of ["src", "public", "content"]) fs.watch(path.join(root, dir), { recursive: true }, schedule);
fs.watch(path.join(root, "site.config.json"), schedule);

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".xml": "application/xml", ".txt": "text/plain" };
const reloader = '<script>new EventSource("/__reload").onmessage = () => location.reload();</script>';

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    clients.add(res); return req.on("close", () => clients.delete(res));
  }
  if (p.endsWith("/")) p += "index.html";
  let file = path.join(dist, p), status = 200;
  if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(dist, "404.html"); status = 404; }
  const type = types[path.extname(file)] || "application/octet-stream";
  const body = fs.readFileSync(file);
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type === "text/html" ? body.toString().replace("</body>", reloader + "</body>") : body);
}).listen(5173, () => console.log("Dev server: http://localhost:5173  (saves rebuild and reload automatically)"));
