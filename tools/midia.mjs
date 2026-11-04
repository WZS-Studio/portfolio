// Prepara mídia para o site (precisa do ffmpeg no PATH).
//
//   node tools/midia.mjs video <arquivo.mp4> <slug> [segundo-da-capa]
//     → media/criativos/<slug>.mp4 (720×1280, H.264, leve, começa a tocar rápido)
//     → media/criativos/<slug>.jpg (capa 540×960) e mostra a duração para colar no conteúdo
//
//   node tools/midia.mjs captura <imagem.png> <saida.webp> [largura]
//     → captura de tela em WebP (padrão 1440 px de largura; use 780 para celular)
//
// Depois é só apontar os caminhos em conteudo/site.mjs e rodar: node tools/gerar.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , cmd, entrada, destino, extra] = process.argv;
const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const kb = (f) => (statSync(f).size / 1024).toFixed(0) + " KB";

function duracao(f) {
  const s = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f]).toString().trim();
  const t = Math.round(Number(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

if (cmd === "video" && entrada && destino) {
  const pasta = join(RAIZ, "media/criativos");
  mkdirSync(pasta, { recursive: true });
  const mp4 = join(pasta, destino + ".mp4"), jpg = join(pasta, destino + ".jpg");
  const vf = "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=black,fps=30";
  ff(["-i", entrada, "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-maxrate", "2400k", "-bufsize", "4800k", "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-movflags", "+faststart", mp4]);
  ff(["-ss", String(extra || 1), "-i", mp4, "-frames:v", "1", "-vf", "scale=540:960", "-q:v", "4", jpg]);
  console.log(`✓ ${mp4} (${kb(mp4)})\n✓ ${jpg} (${kb(jpg)})\n  duração: ${duracao(mp4)}`);
} else if (cmd === "captura" && entrada && destino) {
  const saida = join(RAIZ, destino.replace(/^\//, ""));
  mkdirSync(dirname(saida), { recursive: true });
  ff(["-i", entrada, "-vf", `scale='min(${Number(extra) || 1440},iw)':-2`, "-c:v", "libwebp", "-quality", "82", "-compression_level", "6", saida]);
  console.log(`✓ ${saida} (${kb(saida)})`);
} else {
  console.log("uso:\n  node tools/midia.mjs video <arquivo.mp4> <slug> [segundo-da-capa]\n  node tools/midia.mjs captura <imagem.png> <saida.webp> [largura]");
  process.exit(1);
}
