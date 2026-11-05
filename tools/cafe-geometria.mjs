// Exporta a geometria da xícara (assets/js/cafe-forma.js) para o Blender assar luz e sombra nas texturas.
// uso: node tools/cafe-geometria.mjs <saida.json>   e depois tools/blender/cafe_assar.py com esse arquivo
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const THREE = await import(pathToFileURL(join(RAIZ, "assets/vendor/three.module.min.js")).href);
const { geometriasCafe } = await import(pathToFileURL(join(RAIZ, "assets/js/cafe-forma.js")).href);

const saida = process.argv[2];
if (!saida) { console.error("uso: node tools/cafe-geometria.mjs <saida.json>"); process.exit(1); }
const geos = geometriasCafe(THREE, 128), dados = {};
for (const [nome, g] of Object.entries(geos)) {
  const r = (a, n) => Array.from(a.array, (v) => +v.toFixed(n));
  dados[nome] = { pos: r(g.attributes.position, 5), uv: r(g.attributes.uv, 5), idx: Array.from(g.index.array) };
}
writeFileSync(saida, JSON.stringify(dados));
console.log(Object.entries(dados).map(([k, v]) => `${k}: ${v.pos.length / 3} vértices`).join(" · "));
