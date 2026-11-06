// Empacota o voo do MedGrind (a landing gravada rolando) para as telas 3D do capítulo s-medgrind.
// Precisa do ffmpeg no PATH.
//
//   node tools/voo.mjs
//     lê   midia/medgrind/voo.mp4 e voo-cel.mp4 (as gravações, só no repositório)
//     gera media/sites/medgrind/voo[-cel][-medio|-leve].bin (telas grandes, computadores comuns e celulares)
//
// Formato do .bin: uint32 (little-endian) com o número de quadros, um uint32 com o tamanho de cada
// quadro e os WebP em sequência. Um arquivo só, baixado em fluxo: os primeiros quadros já valem.
// Depois de gerar, rode: node tools/gerar.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = join(RAIZ, "media/sites/medgrind");

// passo: usa 1 a cada N quadros. O nível leve (celular) fica com a metade para não pesar mais que os vídeos antigos.
const PACOTES = [
  { de: "voo.mp4", para: "voo.bin", w: 960, h: 540, q: 52, passo: 1 },
  { de: "voo-cel.mp4", para: "voo-cel.bin", w: 400, h: 866, q: 52, passo: 1 },
  { de: "voo.mp4", para: "voo-medio.bin", w: 768, h: 432, q: 52, passo: 1 },
  { de: "voo-cel.mp4", para: "voo-cel-medio.bin", w: 344, h: 744, q: 52, passo: 1 },
  { de: "voo.mp4", para: "voo-leve.bin", w: 640, h: 360, q: 50, passo: 2 },
  { de: "voo-cel.mp4", para: "voo-cel-leve.bin", w: 288, h: 624, q: 50, passo: 2 },
];

for (const { de, para, w, h, q, passo } of PACOTES) {
  const tmp = mkdtempSync(join(tmpdir(), "voo-"));
  try {
    const vf = `select='not(mod(n,${passo}))',scale=${w}:${h}:flags=lanczos`;
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", join(RAIZ, "midia/medgrind", de), "-vf", vf, "-fps_mode", "vfr",
      "-c:v", "libwebp", "-q:v", String(q), "-compression_level", "5", join(tmp, "%04d.webp")], { stdio: ["ignore", "ignore", "inherit"] });
    const quadros = readdirSync(tmp).sort().map((f) => readFileSync(join(tmp, f)));
    const cab = Buffer.alloc(4 + quadros.length * 4);
    cab.writeUInt32LE(quadros.length, 0);
    quadros.forEach((b, i) => cab.writeUInt32LE(b.length, 4 + i * 4));
    const pacote = Buffer.concat([cab, ...quadros]);
    writeFileSync(join(SAIDA, para), pacote);
    console.log(`✓ ${para}: ${quadros.length} quadros ${w}×${h}, ${(pacote.length / 1048576).toFixed(1)} MB`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// Ritmo: a gravação tem trechos quase parados e trechos em que a câmera salta muito a cada quadro. Dividir a rolagem por igual
// deixa esses saltos ainda mais bruscos; aqui cada quadro recebe rolagem conforme o quanto a imagem muda nele. A saída são os
// pontos de uma curva rolagem → tempo do voo (0–1), que o gerar.mjs entrega ao dispositivos.js.
const EQUILIBRIO = 0.6, SUAVIZA = 6, PONTOS = 41; // 0 = rolagem igual para todos os quadros; 1 = só pela mudança de imagem
const L = 240, A = 136, T = L * A;
const cinza = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", join(RAIZ, "midia/medgrind/voo.mp4"), "-vf", `scale=${L}:${A},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 2 ** 31 - 1, stdio: ["ignore", "pipe", "inherit"] });
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
writeFileSync(join(RAIZ, "midia/medgrind/voo-ritmo.json"), JSON.stringify(ritmo) + "\n");
console.log(`✓ voo-ritmo.json: ${PONTOS} pontos; trecho mais rápido fica ${(media / ((1 - EQUILIBRIO) * media + EQUILIBRIO * Math.max(...liso))).toFixed(2)}× a velocidade de antes`);
