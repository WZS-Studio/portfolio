// Gera as cópias leves que o site prefere quando existem (precisa do ffmpeg no PATH):
//   - .webp ao lado de cada .jpg/.png de media/ e assets/tex (cerca de 45% menor; o gerar.mjs troca sozinho)
//   - -leve.mp4 (540×960) ao lado dos vídeos do player em media/criativos (rede lenta e tela pequena)
// uso: node tools/otimizar-midia.mjs     (só refaz o que mudou; rode antes do node tools/gerar.mjs)
import { readdirSync, statSync, existsSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arquivos = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? arquivos(join(dir, e.name)) : [join(dir, e.name)]));
const novo = (alvo, fonte) => existsSync(alvo) && statSync(alvo).mtimeMs >= statSync(fonte).mtimeMs;
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });
const kb = (f) => Math.round(statSync(f).size / 1024);

// imagens (media/og fica em JPG: é o que as redes sociais leem)
let n = 0, antes = 0, depois = 0;
for (const f of [...arquivos(join(RAIZ, "media")), ...arquivos(join(RAIZ, "assets/tex"))]) {
  if (!/\.(jpe?g|png)$/i.test(f) || f.includes(join("media", "og"))) continue;
  const w = f.replace(/\.(jpe?g|png)$/i, ".webp");
  if (novo(w, f)) continue;
  const png = /\.png$/i.test(f);
  ff(["-i", f, "-c:v", "libwebp", ...(png ? ["-pix_fmt", "yuva420p", "-quality", "90"] : ["-quality", "78"]), "-compression_level", "6", "-preset", "picture", w]);
  // se a cópia não ficou menor, o site continua com o original
  if (statSync(w).size >= statSync(f).size) { unlinkSync(w); continue; }
  n++; antes += kb(f); depois += kb(w);
}
console.log(`imagens: ${n} novas em .webp (${antes} KB → ${depois} KB)`);

// vídeos do player: 540×960, sem som alterado, começo rápido (faststart)
let v = 0;
for (const f of arquivos(join(RAIZ, "media/criativos"))) {
  if (!/\.mp4$/i.test(f) || /-leve\.mp4$/i.test(f)) continue;
  const l = f.replace(/\.mp4$/i, "-leve.mp4");
  if (novo(l, f)) continue;
  ff(["-i", f, "-vf", "scale=540:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "700k", "-bufsize", "1400k", "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", l]);
  if (statSync(l).size >= statSync(f).size * 0.9) { unlinkSync(l); continue; }
  v++; console.log(`  ${relative(RAIZ, l)}: ${kb(f)} KB → ${kb(l)} KB`);
}
console.log(`vídeos: ${v} versões leves novas`);
