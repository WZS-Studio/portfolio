// Gera as páginas do site a partir de conteudo/site.mjs.
//   node tools/gerar.mjs
// Escreve: index.html (portal), sites/index.html, criativos/index.html e sitemap.xml.
// Tudo que muda com frequência (projetos, vídeos, métricas, depoimentos, serviços, links,
// WhatsApp) fica em conteudo/site.mjs. Este arquivo só monta o HTML.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(pathToFileURL(join(RAIZ, "conteudo/site.mjs")).href + "?v=" + Date.now());
const { marca, whatsapp, medicao, portal, sites, vagas } = C;
import { criarJornadas } from "./jornadas.mjs";
const criativos = { ...C.criativos, series: C.criativos.series.filter((s) => s.publicar !== false) };
const VERSAO = Date.now().toString(36);

// ---------- utilidades ----------
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// *texto* vira destaque na cor do universo
const rico = (s = "") => esc(s).replace(/\*(.+?)\*/g, '<span class="acc">$1</span>');
const palavras = (s = "") => {
  let i = 0;
  return esc(s).split(/(\*[^*]+\*)/).map((parte) => {
    const acc = /^\*.*\*$/.test(parte);
    const txt = acc ? parte.slice(1, -1) : parte;
    const ws = txt.split(/(\s+)/).map((w) => (/^\s+$/.test(w) || !w ? w : `<span class="pal" style="--i:${i++}">${w}</span>`)).join("");
    return acc ? `<span class="acc">${ws}</span>` : ws;
  }).join("");
};
const zap = (msg) => `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(msg)}`;
const lista = (xs, f) => (xs || []).map(f).join("");
const ico = (id, cls = "ico") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const ext = (url) => /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";

// dimensões de PNG/JPEG/WebP para width/height (evita salto de layout)
const cacheDim = new Map();
function dim(src) {
  if (!src || /^https?:/.test(src)) return null;
  if (cacheDim.has(src)) return cacheDim.get(src);
  const f = join(RAIZ, src.replace(/^\//, ""));
  if (!existsSync(f)) { console.warn("  ! imagem não encontrada:", src); cacheDim.set(src, null); return null; }
  const b = readFileSync(f); let d = null;
  if (b[0] === 0x89 && b[1] === 0x50) d = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  else if (b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o < b.length) {
      if (b[o] !== 0xff) { o++; continue; }
      const m = b[o + 1], len = b.readUInt16BE(o + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { d = { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) }; break; }
      o += 2 + len;
    }
  } else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const t = b.toString("ascii", 12, 16);
    if (t === "VP8X") d = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    else if (t === "VP8 ") d = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    else if (t === "VP8L") { const n = b.readUInt32LE(21); d = { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) }; }
  }
  cacheDim.set(src, d);
  return d;
}
const img = (src, alt, { cls = "", lazy = true, sizes = "" } = {}) => {
  const d = dim(src);
  return `<img src="${esc(src)}" alt="${esc(alt)}"${d ? ` width="${d.w}" height="${d.h}"` : ""}${cls ? ` class="${cls}"` : ""}${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ""}>`;
};

// ---------- peças comuns ----------
const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false"><defs>
<clipPath id="disc"><circle cx="537" cy="432" r="206.5"/></clipPath><clipPath id="r0"><rect x="780" y="240" width="700" height="232"/></clipPath><clipPath id="r1"><rect x="780" y="474" width="700" height="160"/></clipPath>
<symbol id="wzs-mark" viewBox="325 222 424 422"><g fill="none" stroke="currentColor" stroke-width="13"><circle cx="537" cy="432" r="200" transform="rotate(-90 537 432)"/><g clip-path="url(#disc)"><circle cx="537" cy="432" r="200"/><circle cx="581.44" cy="432" r="200"/><circle cx="625.89" cy="432" r="200"/><circle cx="670.33" cy="432" r="200"/><circle cx="714.78" cy="432" r="200"/><circle cx="759.22" cy="432" r="200"/><circle cx="803.67" cy="432" r="200"/><circle cx="848.11" cy="432" r="200"/><circle cx="892.56" cy="432" r="200"/><circle cx="937.00" cy="432" r="200"/></g></g></symbol>
<symbol id="wzs-logo" viewBox="325 222 1160 422"><use href="#wzs-mark" x="325" y="222" width="424" height="422"/><g fill="currentColor"><g clip-path="url(#r0)"><path d="M795.2 260.8 L808.2 315.5 L808.5 318.0 L814.2 340.2 L824.8 385.8 L837.8 438.8 L841.5 456.2 L842.8 460.0 L843.8 460.5 L896.8 460.5 L898.5 459.5 L921.0 376.5 L931.5 339.2 L932.5 337.8 L933.0 337.8 L933.8 338.8 L936.0 347.0 L963.0 459.8 L964.5 460.5 L1018.2 460.5 L1019.5 460.2 L1020.5 459.2 L1040.0 384.0 L1072.8 262.2 L1072.5 260.2 L1021.2 260.0 L1020.2 260.8 L1011.0 301.5 L1000.0 344.2 L995.8 362.8 L993.0 372.0 L990.0 385.5 L989.2 387.0 L988.8 387.0 L987.8 385.5 L985.2 373.8 L975.5 336.2 L974.5 330.8 L957.0 260.8 L955.8 260.0 L911.5 260.2 L910.5 262.2 L900.8 300.2 L891.0 335.8 L889.0 341.5 L877.0 385.5 L876.0 387.2 L874.8 385.8 L872.5 373.5 L859.8 316.2 L855.5 294.0 L848.2 260.8 L847.0 260.0 L796.5 260.0Z"/><path d="M1090.5 260.5 L1090.0 264.5 L1090.0 294.5 L1090.2 295.5 L1091.0 296.0 L1181.0 296.2 L1181.8 297.2 L1178.0 302.5 L1081.8 421.0 L1081.0 422.8 L1081.2 459.8 L1082.5 460.5 L1245.8 460.5 L1247.0 460.0 L1247.2 424.0 L1246.2 423.2 L1145.2 423.2 L1143.8 422.5 L1145.2 419.8 L1170.2 389.0 L1247.0 296.5 L1247.0 260.8 L1245.8 260.0 L1092.2 260.0Z"/><path d="M1289.0 267.5 L1280.5 273.8 L1274.8 280.2 L1270.0 289.0 L1268.2 294.2 L1267.2 299.2 L1267.0 334.0 L1269.0 343.5 L1271.0 348.8 L1273.2 353.0 L1276.8 357.8 L1280.2 361.5 L1287.8 367.2 L1296.2 371.8 L1306.8 375.2 L1318.5 377.0 L1368.5 377.0 L1371.2 377.5 L1374.8 379.0 L1377.2 380.8 L1379.2 383.0 L1381.5 388.0 L1381.8 414.0 L1380.0 418.5 L1376.2 422.5 L1373.0 424.2 L1369.5 425.2 L1327.5 425.2 L1324.2 424.2 L1319.8 422.0 L1313.2 417.8 L1304.5 411.0 L1303.0 411.0 L1270.5 430.5 L1269.5 431.8 L1270.2 433.2 L1277.2 441.2 L1288.2 450.2 L1296.0 454.5 L1303.2 457.5 L1308.8 459.2 L1315.0 460.5 L1319.8 461.0 L1378.2 461.0 L1383.5 460.5 L1390.8 459.2 L1400.5 456.2 L1409.2 452.2 L1414.8 448.8 L1422.0 442.2 L1427.2 435.2 L1430.8 428.0 L1433.0 419.2 L1433.0 382.0 L1430.8 373.0 L1426.0 364.0 L1419.2 356.2 L1412.8 351.2 L1402.5 346.0 L1392.5 343.0 L1381.5 341.5 L1330.2 341.5 L1325.0 339.8 L1320.8 336.2 L1319.2 333.8 L1318.2 330.5 L1318.0 306.8 L1319.0 302.5 L1321.5 298.5 L1324.5 296.0 L1330.0 294.0 L1368.2 294.0 L1378.2 298.0 L1389.5 304.2 L1392.5 305.2 L1417.5 278.5 L1417.5 277.2 L1411.5 272.2 L1405.0 268.0 L1398.8 264.8 L1385.5 260.2 L1375.0 258.8 L1315.2 259.0 L1307.8 260.2 L1302.0 261.8 L1294.2 264.8Z"/></g><g clip-path="url(#r1)"><path d="M819.8 485.0 L814.8 488.2 L809.2 493.8 L806.2 498.5 L804.2 504.5 L803.5 509.0 L803.5 532.0 L804.5 537.5 L807.5 544.8 L810.0 548.2 L816.5 554.2 L821.8 557.2 L828.8 559.8 L836.8 561.2 L869.0 561.2 L871.5 561.5 L875.2 563.0 L877.8 565.2 L879.0 567.2 L879.8 569.8 L879.8 587.0 L878.8 590.2 L877.5 592.2 L875.2 594.2 L871.2 595.8 L844.5 595.8 L839.0 593.5 L833.8 589.8 L829.5 586.0 L827.5 585.2 L806.2 598.8 L805.2 599.8 L805.2 601.0 L808.2 605.0 L812.2 609.0 L818.5 613.8 L827.0 618.0 L832.0 619.5 L837.5 620.5 L880.0 620.5 L884.8 619.8 L892.2 617.5 L899.2 614.0 L903.0 611.2 L908.5 605.5 L911.0 601.5 L913.8 593.8 L914.5 586.8 L914.2 565.8 L912.2 558.0 L909.8 552.8 L906.5 548.5 L900.8 543.5 L895.2 540.5 L888.5 538.2 L880.2 537.0 L845.0 537.0 L842.2 536.0 L839.8 534.0 L837.8 530.0 L837.5 512.0 L838.8 508.5 L841.5 505.5 L846.0 503.8 L869.8 503.8 L874.8 505.5 L884.0 510.5 L887.2 511.8 L890.2 509.0 L903.8 493.5 L903.8 492.2 L900.2 489.2 L892.0 484.2 L884.5 481.5 L875.2 480.0 L838.0 480.0 L827.5 482.0Z"/><path d="M917.5 482.0 L917.0 483.0 L917.0 504.8 L917.5 505.8 L951.0 506.0 L951.8 506.2 L952.8 507.8 L953.0 619.2 L953.8 619.8 L988.2 619.5 L988.8 618.8 L989.0 507.2 L990.0 506.2 L992.5 506.0 L1024.2 505.8 L1024.8 505.0 L1024.5 482.0 L925.2 481.5Z"/><path d="M1038.5 482.0 L1038.0 483.0 L1038.0 587.5 L1039.2 594.8 L1040.2 597.8 L1044.0 605.0 L1049.5 611.2 L1054.5 614.8 L1063.8 618.8 L1072.2 620.5 L1111.5 620.5 L1117.8 619.5 L1123.2 617.8 L1128.2 615.5 L1133.8 612.0 L1138.2 607.8 L1142.2 602.2 L1145.0 595.5 L1146.8 587.0 L1146.8 482.5 L1146.0 481.8 L1112.8 481.8 L1112.0 482.2 L1111.5 586.8 L1109.2 591.5 L1107.0 593.5 L1104.2 594.8 L1081.5 595.0 L1079.5 594.5 L1077.0 593.0 L1075.0 590.8 L1073.8 587.2 L1073.8 482.8 L1072.2 481.5Z"/><path d="M1163.8 481.8 L1163.0 482.8 L1163.2 619.2 L1164.2 619.8 L1233.8 619.8 L1241.2 618.5 L1246.5 616.8 L1253.2 613.5 L1256.8 611.2 L1264.0 604.5 L1266.5 601.0 L1269.8 594.8 L1272.0 585.2 L1272.0 516.0 L1271.5 512.5 L1269.8 506.5 L1267.5 501.5 L1265.0 497.5 L1258.2 490.8 L1252.5 487.0 L1245.5 484.0 L1236.5 482.0ZM1200.0 506.2 L1226.8 506.5 L1228.5 507.0 L1232.0 509.0 L1234.8 512.2 L1236.0 515.2 L1236.5 517.5 L1236.5 583.5 L1235.5 587.2 L1233.0 591.0 L1230.5 593.0 L1226.5 594.5 L1199.8 594.8 L1198.5 593.8 L1198.5 507.5Z"/><path d="M1321.5 481.8 L1288.2 481.8 L1287.5 482.5 L1287.5 619.0 L1288.5 619.8 L1321.2 619.8 L1322.5 618.2 L1322.5 483.0Z"/><path d="M1354.2 486.5 L1347.2 491.8 L1343.0 497.0 L1339.8 503.5 L1337.8 513.0 L1337.8 588.5 L1339.5 597.0 L1342.0 602.8 L1345.8 608.0 L1349.0 611.2 L1352.8 614.0 L1361.2 618.2 L1371.0 620.5 L1412.2 620.5 L1420.8 618.8 L1429.5 615.0 L1435.0 611.2 L1438.8 607.5 L1441.5 603.8 L1445.0 595.8 L1446.2 588.8 L1446.5 515.2 L1446.0 510.2 L1445.0 506.0 L1442.2 499.2 L1439.2 494.8 L1434.8 490.2 L1430.8 487.2 L1423.5 483.8 L1417.8 482.0 L1412.5 481.0 L1373.5 480.8 L1364.8 482.2 L1359.5 484.0ZM1379.8 506.0 L1403.0 505.8 L1407.5 508.0 L1409.2 510.0 L1410.5 513.0 L1411.0 515.5 L1411.0 586.5 L1410.0 590.0 L1409.0 591.8 L1406.8 594.0 L1404.0 595.2 L1399.2 595.8 L1380.2 595.5 L1377.8 594.5 L1375.0 592.0 L1373.0 587.8 L1372.8 514.8 L1373.5 511.8 L1375.0 509.2 L1376.2 508.0Z"/></g></g></symbol>
<symbol id="cur-mark" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M14 2.2A10 10 0 0 0 14 21.8"/><path d="M16.5 3.07A10 10 0 0 0 16.5 20.93"/><path d="M19 4.86A10 10 0 0 0 19 19.14"/></g></symbol>
<symbol id="i-zap" viewBox="0 0 24 24"><path d="M3.6 20.4l1.25-4.1A8.6 8.6 0 1 1 8 19.3z"/><path d="M9.1 8.4c.2-.5.6-.6 1-.5l.9 2-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6 2 .9c.1.4 0 .8-.5 1-1.6.8-6.5-1.8-5.9-5.9z"/></symbol>
<symbol id="i-seta" viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></symbol>
<symbol id="i-dir" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><path d="M6 4.5v15l13-7.5z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-mais" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></symbol>
<symbol id="i-insta" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></symbol>
</defs></svg>`;

const MUNDO = `<div class="mundo" aria-hidden="true"><canvas class="mundo__canvas" id="mundo"></canvas><div class="mundo__alt"><svg viewBox="0 0 424 422"><use href="#wzs-mark"/></svg></div></div><div class="veu" id="veu" aria-hidden="true"></div>`;

function topo(pagina) {
  const atual = (u) => (pagina === u ? ' aria-current="page"' : "");
  return `<header class="topo" id="topo">
  <a class="topo__marca" href="/" aria-label="${esc(marca.nome)}, voltar ao início" data-cursor-link><svg class="marca-logo" viewBox="0 0 1160 422" aria-hidden="true"><use href="#wzs-logo"/></svg><svg class="marca-mark" viewBox="0 0 424 422" aria-hidden="true"><use href="#wzs-mark"/></svg></a>
  <nav class="troca" id="troca" aria-label="Especialidades">
    <span class="troca__pilula" aria-hidden="true"></span>
    <a href="/criativos/" data-universo="criativos" data-ir="criativos"${atual("criativos")}><i aria-hidden="true"></i>Criativos</a>
    <a href="/sites/" data-universo="sites" data-ir="sites"${atual("sites")}><i aria-hidden="true"></i>Sites</a>
  </nav>
  <a class="btn btn--sm topo__zap" id="topo-zap" href="${zap(whatsapp.mensagens.geral)}" target="_blank" rel="noopener" data-zap="${pagina}|geral|topo" aria-label="Conversar pelo WhatsApp (abre em nova aba)">${ico("zap")}<span class="zap-txt">WhatsApp</span></a>
</header>`;
}

function rodape() {
  return `<footer class="rodape">
  <div class="rodape__in">
    <div class="rodape__cols">
      <div class="rodape__marca"><svg viewBox="0 0 1160 422" aria-hidden="true"><use href="#wzs-logo"/></svg><p>${esc(marca.assinatura)}</p></div>
      <div><h3>Especialidades</h3><ul><li><a href="/criativos/" data-ir="criativos">Criativos e conteúdos virais</a></li><li><a href="/sites/" data-ir="sites">Sites que convertem</a></li></ul></div>
      <div><h3>Contato</h3><ul><li><a href="${zap(whatsapp.mensagens.geral)}" target="_blank" rel="noopener" data-zap="rodape|geral|rodape">WhatsApp ${esc(whatsapp.exibicao)}</a></li><li><a href="mailto:${esc(marca.email)}">${esc(marca.email)}</a></li></ul></div>
      <div><h3>Redes</h3><ul>${lista(marca.redes, (r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.rotulo)}</a></li>`)}</ul></div>
    </div>
    <div class="rodape__base"><span>© ${new Date().getFullYear()} ${esc(marca.nome)}${marca.responsavel ? " · " + esc(marca.responsavel) : ""} · ${esc(marca.cidade)}</span><span><button type="button" id="alternar-cursor" aria-pressed="false">Usar cursor padrão</button></span></div>
  </div>
</footer>`;
}

const DIALOGOS = `<dialog class="caso" id="caso" aria-labelledby="caso-titulo"><div class="caso__barra"><span class="mono" id="caso-rotulo">Estudo de caso</span><button class="fechar" type="button" data-fechar>Fechar ${ico("x")}</button></div><div class="caso__corpo" id="caso-corpo"></div></dialog>
<dialog class="player" id="player" aria-label="Vídeo"><div class="player__box"><div class="player__topo"><p id="player-conta"></p><button class="fechar" type="button" data-fechar>Fechar ${ico("x")}</button></div><video id="player-video" controls playsinline preload="none"></video><p class="player__leg" id="player-leg"></p></div></dialog>
<div class="cursor" id="cursor" aria-hidden="true"><span class="cursor__mark"><svg viewBox="0 0 24 24"><use href="#cur-mark"/></svg></span><span class="cursor__ponto"></span><span class="cursor__rotulo" id="cursor-rotulo"></span></div>`;

function doc({ pagina, universo, seo, main, dadosMundo, jsonld = [], zapFixo }) {
  const url = marca.dominio + seo.caminho;
  const og = seo.og ? marca.dominio + seo.og : marca.dominio + "/media/og/og-portal.jpg";
  const med = medicao || {};
  return `<!doctype html>
<html lang="pt-BR" data-universo="${universo}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(seo.titulo)}</title>
<meta name="description" content="${esc(seo.descricao)}">
<meta name="theme-color" content="#0a1220">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(marca.nome)}">
<meta property="og:title" content="${esc(seo.ogTitulo || seo.titulo)}">
<meta property="og:description" content="${esc(seo.descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,600..800&family=Geist:wght@400..700&family=Geist+Mono:wght@400..500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/wzs.css?v=${VERSAO}">
<script>document.documentElement.classList.replace("no-js","js");</script>
<script type="importmap">{"imports":{"three":"/assets/vendor/three.module.min.js"}}</script>
<script>window.WZS_V="${VERSAO}";</script>
<link rel="modulepreload" href="/assets/vendor/three.module.min.js">
<link rel="modulepreload" href="/assets/js/mundo.js?v=${VERSAO}">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
<script>window.WZS_MEDICAO=${JSON.stringify({ ga4: med.ga4 || "", gtm: med.gtm || "", plausible: med.plausible || "" })};</script>
</head>
<body data-pagina="${pagina}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${SPRITE}
${MUNDO}
${topo(pagina)}
${main}
${rodape()}
${zapFixo ? `<div class="zapfixo" id="zapfixo"><a class="btn" href="${zapFixo.href}" target="_blank" rel="noopener" data-zap="${zapFixo.track}">${ico("zap")}${esc(zapFixo.rotulo)}</a></div>` : '<div class="zapfixo" id="zapfixo"></div>'}
${DIALOGOS}
<script type="application/json" id="dados-mundo">${JSON.stringify(dadosMundo)}</script>
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script type="module" src="/assets/js/app.js?v=${VERSAO}"></script>
</body>
</html>
`;
}

const cab = ({ n, rotulo, titulo, lead }) => `<header class="sec__cab"><p class="rotulo sobe"><b>${esc(n)}</b> ${esc(rotulo)}</p><h2 class="display entra">${palavras(titulo)}</h2>${lead ? `<p class="lead sobe" style="--d:120ms">${rico(lead)}</p>` : ""}</header>`;

const faqHtml = (faq, n) => `<section class="sec sec--leitura" id="perguntas" data-cena="leitura" aria-labelledby="t-faq">
  <div class="sec__in faq">
    <header class="sec__cab"><p class="rotulo sobe"><b>${n}</b> Perguntas frequentes</p><h2 class="display entra" id="t-faq">${palavras(faq.titulo)}</h2>${faq.lead ? `<p class="lead sobe">${rico(faq.lead)}</p>` : ""}</header>
    <div class="faq__lista">${lista(faq.itens, (q) => `<details><summary>${esc(q.p)}<span class="mais-ico">${ico("mais")}</span></summary><p>${rico(q.r)}</p></details>`)}</div>
  </div>
</section>`;

const faqLd = (faq) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.itens.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r.replace(/\*/g, "") } })) });
const orgLd = () => ({
  "@context": "https://schema.org", "@type": "ProfessionalService", name: marca.nome, url: marca.dominio + "/",
  logo: marca.dominio + "/assets/logo.png", image: marca.dominio + "/media/og/og-portal.jpg",
  description: portal.seo.descricao, telephone: "+" + whatsapp.numero, email: marca.email,
  address: { "@type": "PostalAddress", addressLocality: marca.cidade.split(",")[0], addressRegion: "RS", addressCountry: "BR" },
  sameAs: marca.redes.map((r) => r.url),
});

// ---------- dados do mundo 3D ----------
const CENAS_MG = ["abertura", "revelacao", "construcao", "plantonista", "questoes", "amigos"];
const dadosMundo = {
  // miniaturas leves para os quadros que orbitam a logo (geradas em media/tex/cards)
  ...JSON.parse(readFileSync(join(RAIZ, "media/tex/cards/lista.json"), "utf8")),
  midia: {
    // vídeos das telas 3D: versões leves (360×640, sem som) em /media/tex
    videoMontagem: "/media/tex/montagem.mp4", posterMontagem: criativos.historia?.montagem?.poster,
    videoSucesso: "/media/tex/sucesso.mp4", videoAnuncio: "/media/tex/anuncio.mp4",
    feed: [
      { v: "/media/tex/feed-1.mp4", poster: "/media/tex/feed-1.jpg", conta: "felipen.med", legenda: "FA × FV", cor: "#3b82f6" },
      { v: "/media/tex/feed-2.mp4", poster: "/media/tex/feed-2.jpg", conta: "felipen.med", legenda: "O último plantão", cor: "#3b82f6" },
      { v: "/media/tex/feed-3.mp4", poster: "/media/tex/feed-3.jpg", conta: "wzs_studio", legenda: "Ninguém sabe que ele existe", cor: "#1f5fd6" },
      { v: "/media/tex/feed-4.mp4", poster: "/media/tex/feed-4.jpg", conta: "felipen.med", legenda: "DPP × placenta prévia", cor: "#3b82f6" },
      { v: "/media/tex/feed-5.mp4", poster: "/media/tex/feed-5.jpg", conta: "medgrind_oficial", legenda: "Bora atender", cor: "#14a2ff" },
      { v: "/media/tex/feed-6.mp4", poster: "/media/tex/feed-6.jpg", conta: "felipen.med", legenda: "Soro no traumatismo craniano", cor: "#3b82f6" },
    ],
    ch: { foto: "/media/sites/crosshard/foto-musculacao.webp", logo: "/media/sites/crosshard/logo-branco.png", desk: "/media/sites/crosshard/desk-1.webp", cel: "/media/sites/crosshard/cel-1.webp" },
    cenas: CENAS_MG.map((c) => `/media/sites/medgrind/cenas/${c}-wide.webp`),
    cenasTall: CENAS_MG.map((c) => `/media/sites/medgrind/cenas/${c}-tall.webp`),
  },
};

// ---------- PORTAL ----------
function paginaPortal() {
  const p = portal;
  const lado = (u, d, i) => `<a class="lado lado--${u}" href="/${u}/" data-escolha="${u}" data-cursor="Entrar" aria-describedby="lado-${u}-txt">
      <span class="lado__num">${String(i + 1).padStart(2, "0")}</span>
      <span class="lado__palavra">${esc(d.palavra)}</span>
      <span class="lado__sub">${esc(d.complemento)}</span>
      <span class="lado__texto" id="lado-${u}-txt">${esc(d.texto)}</span>
      <span class="lado__cta">${esc(d.cta)} ${ico("dir")}</span>
    </a>`;
  const main = `<main id="conteudo" class="portal" data-cena="portal">
  <section class="portal__tela" id="portal" aria-labelledby="portal-h1">
    <h1 class="portal__titulo" id="portal-h1"><span class="portal__rotulo">${esc(p.rotulo)}</span><strong>${esc(p.titulo)}</strong></h1>
    ${lado("criativos", p.criativos, 0)}
    ${lado("sites", p.sites, 1)}
    <p class="portal__dica" aria-hidden="true"><span class="so-mouse">Mova o cursor para explorar · clique para entrar</span><span class="so-toque">Arraste para explorar · toque para entrar</span></p>
  </section>
  <section class="portal__resumo" aria-labelledby="t-resumo" data-cena="leitura">
    <div class="resumo">
      <p class="rotulo sobe">${esc(marca.nome)} · ${esc(marca.cidade)}</p>
      <h2 class="display entra" id="t-resumo">${palavras(p.resumo.titulo)}</h2>
      <p class="lead sobe">${rico(p.resumo.texto)}</p>
      <div class="resumo__duas sobe">
        <a href="/criativos/" data-ir="criativos" data-cursor="Entrar"><h3>${esc(p.criativos.palavra)} ${esc(p.criativos.complemento)}</h3><p>${esc(p.resumo.criativos)}</p><span class="link-seta">Ver criativos ${ico("seta")}</span></a>
        <a href="/sites/" data-ir="sites" data-cursor="Entrar"><h3>${esc(p.sites.palavra)} ${esc(p.sites.complemento)}</h3><p>${esc(p.resumo.sites)}</p><span class="link-seta">Ver sites ${ico("seta")}</span></a>
      </div>
      <p class="contato__alt sobe" style="justify-content:flex-start">Prefere falar direto? <a href="${zap(whatsapp.mensagens.geral)}" target="_blank" rel="noopener" data-zap="portal|geral|resumo">WhatsApp ${esc(whatsapp.exibicao)}</a> <a href="mailto:${esc(marca.email)}">${esc(marca.email)}</a></p>
    </div>
  </section>
</main>`;
  return doc({ pagina: "portal", universo: "portal", seo: { ...p.seo, caminho: "/" }, main, dadosMundo, jsonld: [orgLd()] });
}

// ---------- SITES ----------
function casoHtml(pj) {
  const desk = pj.capturas?.desktop || [], cel = pj.capturas?.celular || [];
  const blocos = [
    ["O que é", pj.oQueE], ["Para quem", pj.paraQuem], ["O desafio", pj.desafio], ["O que foi criado", pj.feito],
  ].filter(([, v]) => v);
  return `<header class="caso__cab"><p class="proj__tipo">${esc(pj.tipo)}</p><h2 id="caso-titulo">${esc(pj.nome)}</h2><p class="lead">${rico(pj.linha)}</p>
    <div class="proj__acoes">${pj.url ? `<a class="btn" href="${esc(pj.url)}" target="_blank" rel="noopener">Ver o site no ar ${ico("seta")}</a>` : ""}${pj.stack?.length ? `<ul class="proj__tags">${lista(pj.stack, (s) => `<li>${esc(s)}</li>`)}</ul>` : ""}</div></header>
  <div class="caso__galeria">
    ${desk[0] ? `<figure class="g-desk">${img(desk[0], `${pj.nome} no computador`)}<figcaption>Computador · ${esc(pj.capturaNota || "captura real")}</figcaption></figure>` : ""}
    ${cel.length ? `<div class="g-cel">${lista(cel.slice(0, 2), (c, k) => `<figure>${img(c, `${pj.nome} no celular, tela ${k + 1}`)}${k === 0 ? "<figcaption>Celular</figcaption>" : ""}</figure>`)}</div>` : ""}
  </div>
  <div class="caso__grade">${lista(blocos, ([k, v]) => `<section><h3>${k}</h3><p>${rico(v)}</p></section>`)}
    ${pj.decisoes?.length ? `<section style="grid-column:1/-1"><h3>Decisões de design, conteúdo e navegação</h3><ul>${lista(pj.decisoes, (d) => `<li>${rico(d)}</li>`)}</ul></section>` : ""}
  </div>
  ${desk.length > 1 ? `<div class="caso__mais-desk">${lista(desk.slice(1), (d, k) => `<figure>${img(d, `${pj.nome}: seção ${k + 2} no computador`)}</figure>`)}</div>` : ""}
  ${pj.resultados?.length ? `<section><h3 class="rotulo" style="margin-bottom:14px">Resultados medidos</h3><div class="resultados">${lista(pj.resultados, (r) => `<div class="resultado"><strong>${esc(r.valor)}</strong><span>${esc(r.rotulo)}</span><small>${esc(r.fonte)}${r.data ? " · " + esc(r.data) : ""}${r.contexto ? " · " + esc(r.contexto) : ""}</small></div>`)}</div></section>` : ""}
  ${pj.nota ? `<p class="evid__fonte">${rico(pj.nota)}</p>` : ""}
  <div class="caso__fim"><a class="btn" href="${zap(pj.interesse ? whatsapp.mensagens.sites(pj.interesse) : whatsapp.mensagens.sitesGeral)}" target="_blank" rel="noopener" data-zap="sites|${esc(pj.interesse || "geral")}|caso-${pj.slug}">${ico("zap")} Quero um projeto assim</a><button class="link-seta" type="button" data-fechar>Voltar aos projetos</button></div>`;
}

// ---------- CRIATIVOS ----------
function duracaoDe(src) {
  try {
    const s = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", join(RAIZ, src.replace(/^\/+/, ""))]).toString());
    const t = Math.round(s); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  } catch { return ""; }
}
function videoHtml(v, serie) {
  if (!v.duracao && v.arquivo) v.duracao = duracaoDe(v.arquivo);
  if (v.arquivo && !existsSync(join(RAIZ, v.arquivo.replace(/^\/+/, "")))) console.warn("  ! vídeo não encontrado:", v.arquivo);
  const met = (v.metricas || []).filter((m) => m.valor);
  return `<article class="vid${v.grande ? " vid--grande" : ""}" data-video="${esc(v.id)}">
    <button class="vid__tela" type="button" data-play="${esc(v.id)}" data-src="${esc(v.arquivo)}" data-titulo="${esc(v.titulo)}" data-conta="${esc(serie.conta)}" data-cursor="Reproduzir" aria-label="Reproduzir vídeo: ${esc(v.titulo)} (${esc(serie.conta)})">
      ${img(v.poster, "", { cls: "vid__poster" })}
      ${v.selo ? `<span class="vid__selo">${esc(v.selo)}</span>` : ""}${v.duracao ? `<span class="vid__dur">${esc(v.duracao)}</span>` : ""}
      <span class="vid__play"><i>${ico("play", "ico ico--fill")}</i>Assistir</span>
    </button>
    <div class="vid__info">
      <h4 class="vid__titulo">${esc(v.titulo)}</h4>
      ${met.length ? `<p class="vid__met">${lista(met, (m) => `<span><b>${esc(m.valor)}</b> ${esc(m.tipo)}</span>`)}</p>` : ""}
      ${v.objetivo || v.gancho || v.edicao || v.publico ? `<details class="vid__ctx"><summary>Contexto</summary><dl>
        ${v.objetivo ? `<div><dt>Objetivo</dt><dd>${esc(v.objetivo)}</dd></div>` : ""}
        ${v.publico ? `<div><dt>Público</dt><dd>${esc(v.publico)}</dd></div>` : ""}
        ${v.gancho ? `<div><dt>Gancho</dt><dd>${esc(v.gancho)}</dd></div>` : ""}
        ${v.edicao ? `<div><dt>Roteiro e edição</dt><dd>${esc(v.edicao)}</dd></div>` : ""}
        ${v.fonte ? `<div><dt>Fonte dos números</dt><dd>${esc(v.fonte)}</dd></div>` : ""}
      </dl></details>` : ""}
    </div>
  </article>`;
}

function serieHtml(se) {
  return `<section class="serie" id="serie-${se.slug}" aria-labelledby="t-serie-${se.slug}">
    <div class="serie__cab">
      <div>
        <p class="serie__conta sobe">${se.contaUrl ? `<a href="${esc(se.contaUrl)}" target="_blank" rel="noopener">${esc(se.conta)}</a>` : esc(se.conta)} · ${esc(se.tema)}</p>
        <h3 class="entra" id="t-serie-${se.slug}">${palavras(se.nome)}</h3>
        ${se.numeros?.length ? `<div class="serie__nums sobe">${lista(se.numeros, (x) => `<div><strong>${esc(x.valor)}</strong><span>${esc(x.rotulo)}</span></div>`)}</div>${se.fonte ? `<p class="serie__fonte sobe">${esc(se.fonte)}</p>` : ""}` : ""}
      </div>
      <div class="serie__desc sobe">${lista(se.descricao, (p) => `<p>${rico(p)}</p>`)}${se.participacao ? `<p><strong>Minha participação:</strong> ${rico(se.participacao)}</p>` : ""}</div>
    </div>
    <div class="colagem">${lista(se.videos, (v) => videoHtml(v, se))}</div>
  </section>`;
}

// ---------- escrever ----------
function escrever(rel, html) {
  const f = join(RAIZ, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
  console.log("  ✓", rel, (html.length / 1024).toFixed(1) + " KB");
}
escrever("index.html", paginaPortal());
const J = criarJornadas({ esc, rico, palavras, zap, ico, img, lista, marca, whatsapp, sites, criativos, vagas, faqHtml, casoHtml, serieHtml, doc, orgLd, faqLd, dadosMundo });
escrever("sites/index.html", J.paginaSites());
escrever("criativos/index.html", J.paginaCriativos());
const hoje = new Date().toISOString().slice(0, 10);
escrever("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", "/sites/", "/criativos/"].map((u) => `  <url><loc>${marca.dominio}${u}</loc><lastmod>${hoje}</lastmod></url>`).join("\n")}
</urlset>
`);
