// Servidor local para testar o site: arquivos estáticos, /pasta/ → /pasta/index.html,
// suporte a Range (vídeo no Safari/iOS) e a 404.html. Uso: node tools/servidor.mjs [porta]
import { createServer } from "node:http";
import { stat, readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PORTA = Number(process.env.PORT || process.argv[2] || 5190);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml", ".ico": "image/x-icon", ".glb": "model/gltf-binary",
};

async function achar(caminho) {
  let alvo = normalize(join(RAIZ, decodeURIComponent(caminho)));
  if (!alvo.startsWith(RAIZ)) return null;
  try {
    let s = await stat(alvo);
    if (s.isDirectory()) { alvo = join(alvo, "index.html"); s = await stat(alvo); }
    return { alvo, s };
  } catch { return null; }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  // /sites e /criativos sem barra final → com barra (igual ao Apache)
  if (!extname(url.pathname) && !url.pathname.endsWith("/")) {
    const dir = await achar(url.pathname);
    if (dir) { res.writeHead(301, { Location: url.pathname + "/" + url.search }); return res.end(); }
  }
  const f = await achar(url.pathname);
  if (!f) {
    const nf = await readFile(join(RAIZ, "404.html")).catch(() => "404");
    res.writeHead(404, { "Content-Type": TIPOS[".html"] }); return res.end(nf);
  }
  const tipo = TIPOS[extname(f.alvo).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;
  if (range && /^bytes=/.test(range)) {
    const [a, b] = range.replace("bytes=", "").split("-");
    const ini = Number(a) || 0, fim = b ? Number(b) : f.s.size - 1;
    res.writeHead(206, { "Content-Type": tipo, "Content-Range": `bytes ${ini}-${fim}/${f.s.size}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
    return createReadStream(f.alvo, { start: ini, end: fim }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": tipo, "Content-Length": f.s.size, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" });
  if (req.method === "HEAD") return res.end();
  createReadStream(f.alvo).pipe(res);
}).listen(PORTA, () => console.log(`WZS local: http://localhost:${PORTA}/`));
