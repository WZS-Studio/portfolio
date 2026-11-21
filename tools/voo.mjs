// Empacota o voo do caso em destaque (a landing gravada rolando) para as telas 3D do capítulo s-caso.
// Precisa do ffmpeg no PATH.
//
//   node tools/voo.mjs [projeto]          (padrão: lucas-tosi)
//     lê   midia/<projeto>/voo.mp4 e voo-cel.mp4 (as gravações, só no repositório)
//     gera media/sites/<projeto>/voo[-cel][-medio|-leve].bin (telas grandes, computadores comuns e celulares)
//          e midia/<projeto>/voo-ritmo.json
//
// Formato do .bin: uint32 (little-endian) com o número de quadros, um uint32 com o tamanho de cada
// quadro e os WebP em sequência. Um arquivo só, baixado em fluxo: os primeiros quadros já valem.
// Gravações longas são lidas de N em N quadros para o pacote ficar com cerca de 300 quadros.
// Depois de gerar, aponte o projeto em tools/gerar.mjs (CASO) e rode: node tools/gerar.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJETO = process.argv[2] || "lucas-tosi";
const ENTRADA = join(RAIZ, "midia", PROJETO), SAIDA = join(RAIZ, "media/sites", PROJETO);
mkdirSync(SAIDA, { recursive: true });

const quadrosDe = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", join(ENTRADA, f)]).toString().replace(/[^\d]/g, ""));
const ALVO = 300;
const passoDe = { "voo.mp4": Math.max(1, Math.round(quadrosDe("voo.mp4") / ALVO)), "voo-cel.mp4": Math.max(1, Math.round(quadrosDe("voo-cel.mp4") / ALVO)) };

// passo: usa 1 a cada N quadros. O nível leve (celular) fica com a metade para não pesar mais que um vídeo.
const PACOTES = [
  { de: "voo.mp4", para: "voo.bin", w: 960, h: 540, q: 52, k: 1 },
  { de: "voo-cel.mp4", para: "voo-cel.bin", w: 400, h: 866, q: 52, k: 1 },
  { de: "voo.mp4", para: "voo-medio.bin", w: 768, h: 432, q: 52, k: 1 },
  { de: "voo-cel.mp4", para: "voo-cel-medio.bin", w: 344, h: 744, q: 52, k: 1 },
  { de: "voo.mp4", para: "voo-leve.bin", w: 640, h: 360, q: 50, k: 2 },
  { de: "voo-cel.mp4", para: "voo-cel-leve.bin", w: 288, h: 624, q: 50, k: 2 },
];

for (const { de, para, w, h, q, k } of PACOTES) {
  const tmp = mkdtempSync(join(tmpdir(), "voo-")), passo = passoDe[de] * k;
  try {
    const vf = `select='not(mod(n,${passo}))',scale=${w}:${h}:flags=lanczos`;
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", join(ENTRADA, de), "-vf", vf, "-fps_mode", "vfr",
      "-c:v", "libwebp", "-q:v", String(q), "-compression_level", "5", join(tmp, "%04d.webp")], { stdio: ["ignore", "ignore", "inherit"] });
    const quadros = readdirSync(tmp).sort().map((f) => readFileSync(join(tmp, f)));
    const cab = Buffer.alloc(4 + quadros.length * 4);
    cab.writeUInt32LE(quadros.length, 0);
    quadros.forEach((b, i) => cab.writeUInt32LE(b.length, 4 + i * 4));
    const pacote = Buffer.concat([cab, ...quadros]);
    writeFileSync(join(SAIDA, para), pacote);
    console.log(`✓ ${para}: ${quadros.length} quadros ${w}×${h} (1 a cada ${passo}), ${(pacote.length / 1048576).toFixed(1)} MB`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// Ritmo: a gravação tem trechos quase parados e trechos em que a página muda muito a cada quadro. Dividir a rolagem por igual
// deixa esses saltos ainda mais bruscos; aqui cada quadro recebe rolagem conforme o quanto a imagem muda nele. A saída são os
// pontos de uma curva rolagem → tempo do voo (0–1), que o gerar.mjs entrega ao dispositivos.js.
const EQUILIBRIO = 0.6, SUAVIZA = 6, PONTOS = 41; // 0 = rolagem igual para todos os quadros; 1 = só pela mudança de imagem
const L = 240, A = 136, T = L * A;
const cinza = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", join(ENTRADA, "voo.mp4"), "-vf", `scale=${L}:${A},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 2 ** 31 - 1, stdio: ["ignore", "pipe", "inherit"] });
const n = cinza.length / T, dif = [];
for (let i = 1; i < n; i++) { let s = 0; for (let j = 0; j < T; j++) s += Math.abs(cinza[i * T + j] - cinza[(i - 1) * T + j]); dif.push(s / T); }
const liso = dif.map((_, i) => { const c = dif.slice(Math.max(0, i - SUAVIZA), i + SUAVIZA + 1); return c.reduce((a, x) => a + x, 0) / c.length; });
const media = liso.reduce((a, x) => a + x, 0) / liso.length;
const acum = [0]; liso.forEach((d) => acum.push(acum.at(-1) + (1 - EQUILIBRIO) * media + EQUILIBRIO * d));
const ritmo = Array.from({ length: PONTOS }, (_, k) => {
  const x = (k / (PONTOS - 1)) * acum.at(-1); let i = 0;
  while (i < acum.length - 2 && acum[i + 1] < x) i++;
  return +((i + (x - acum[i]) / (acum[i + 1] - acum[i])) / (n - 1)).toFixed(4);
});
writeFileSync(join(ENTRADA, "voo-ritmo.json"), JSON.stringify(ritmo) + "\n");
console.log(`✓ voo-ritmo.json: ${PONTOS} pontos; trecho mais rápido fica ${(media / ((1 - EQUILIBRIO) * media + EQUILIBRIO * Math.max(...liso))).toFixed(2)}× a velocidade de antes`);
