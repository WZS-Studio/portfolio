// Mundo 3D da WZS: uma única cena que fica atrás de todas as páginas.
// O fundo é papel: branco e off-white quente, com desenhos em traço de ouro que mudam a cada capítulo.
// A logo é o emblema de assets/js/emblema.js (esfera de pérola com os arcos em ouro), que vira o bastão de
// Asclépio quando o mouse passa por ela. Um único número, "mix", vai de -1 (Criativos) a +1 (Sites) e decide
// o lado do portal e os objetos em volta (quadros de vídeo vertical ou telas de sites).
import * as THREE from "three";
import { RoomEnvironment } from "/assets/vendor/addons/RoomEnvironment.js";
import { criarDispositivos } from "./dispositivos.js";
import { criarEmblema } from "./emblema.js";

// paleta da marca (a mesma do CSS)
export const CORES = {
  papel: "#ffffff", creme: "#faf8f4", tinta: "#0f1724",
  ouro: "#b8923a", ouroClaro: "#e8d9b0", ouroEscuro: "#8a6b22",
};

// Cenas: posição/escala da logo (em frações da tela visível), presença dos objetos,
// quanto o fundo escurece para leitura. "d" = versão em pé (celular).
const CENAS = {
  portal:    { x: 0,    y: 0.02, s: 1,    o: 1,    cards: "portal", dim: 0,    d: { x: 0, y: -0.03, s: 0.45 }, m: { s: 0.8 }, teto: 0.44 },
  hero:      { x: 0.3,  y: 0,    s: 0.86, o: 1,    cards: "orbita", dim: 0,    d: { x: 0, y: 0.25, s: 0.5, o: 0.9 }, m: { x: 0.37, s: 0.56, o: 0.8 } },
  trabalhos: { x: 0.42, y: -0.32, s: 0.3, o: 0,    cards: "fora",   dim: 0.55, d: { x: 0.3, y: -0.38, s: 0.2, o: 0 } },
  leitura:   { x: 0.36, y: -0.06, s: 0.62, o: 0,    cards: "fora",  dim: 0.78, d: { x: 0.2, y: 0.3, s: 0.4, o: 0 } },
  servicos:  { x: -0.36, y: 0.04, s: 0.7, o: 0.7,  cards: "fora",   dim: 0.5,  d: { x: 0, y: 0.32, s: 0.42, o: 0.4 } },
  contato:   { x: 0,    y: 0.06, s: 1.02, o: 0.6,  cards: "orbita", dim: 0.1,  d: { x: 0, y: 0.18, s: 0.58, o: 0.5 } },
  // capítulos com celular/notebook: a logo recua para o fundo
  fundo:     { x: -0.37, y: 0.27, s: 0.2, o: 1, cards: "fora", dim: 0.3, d: { x: -0.33, y: -0.03, s: 0.12, o: 1 }, m: { x: -0.36, y: 0.29, s: 0.18 } },
  painel:    { x: 0.02, y: 0.33, s: 0.17, o: 1, cards: "fora", dim: 0.3, d: { x: 0.33, y: 0.36, s: 0.1, o: 1 } },
  // capítulos só de texto (voz clonada, depoimento): a logo sai de cena para a leitura ficar livre
  texto:     { x: -0.37, y: 0.27, s: 0.12, o: 0, cards: "fora", dim: 0.3, d: { x: -0.33, y: -0.03, s: 0.1, o: 0 } },
  // caso em destaque (Sites): como o fundo, mas a logo desce para o canto de baixo e deixa o nome do cliente livre;
  // na tela em pé ela some (ficaria em cima do notebook)
  caso:      { x: -0.37, y: -0.36, s: 0.18, o: 1, cards: "fora", dim: 0.3, d: { x: -0.33, y: -0.03, s: 0.12, o: 0 }, m: { x: -0.36, y: -0.36, s: 0.16 } },
  // oportunidade: a logo vira um globo de alcance
  globo:     { x: 0.2,  y: 0.02, s: 0.95, o: 0.85, cards: "fora", dim: 0.15, d: { x: 0, y: 0.2, s: 0.55, o: 0.8 }, m: { x: 0.24, s: 0.7 } },
};

// Fundo: um triângulo de tela cheia. Papel branco e creme, com desenhos em traço de ouro.
// No portal cada lado mostra o seu desenho: riscos (Criativos) e piso em perspectiva (Sites).
const FUNDO_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.999, 1.0); }
`;
const FUNDO_FRAG = /* glsl */ `
  uniform vec2 uRes, uFoco; uniform float uTime, uMix, uPortal, uPortrait, uDim, uSplitK, uLuz, uOnda, uVelT;
  uniform vec3 uPapel, uCreme, uOuro, uOuroClaro, uTinta;
  uniform float uTroca, uLado, uBaixo, uPadA, uPadB, uTomA, uTomB, uRaio, uForma, uSombra;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  float ruido(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * ruido(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
  float caixa(vec2 q, vec2 b, float r) { vec2 d = abs(q) - b + r; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r; }
  float traco(float d, float w) { return 1.0 - smoothstep(0.0, w, abs(d)); }
  float dot2(vec2 v) { return dot(v, v); }
  // coração (distância com sinal; ponta em y = 0, topo perto de y = 1)
  float coracao(vec2 p) { p.x = abs(p.x); if (p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - 0.35355; return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y); }
  // desenho do fundo de cada capítulo; devolve (traço principal, traço secundário), pintados em ouro
  vec2 padrao(float id, vec2 p, vec2 f, float t, float vt, float ar) {
    float r = length(p - f), a = atan(p.y - f.y, p.x - f.x);
    if (id < 0.5) { // riscos diagonais
      return vec2(0.0, smoothstep(0.985, 1.0, sin((p.x * 0.8 + p.y) * 26.0 - t * 2.4 - vt * 7.0)) * 0.55);
    }
    if (id < 1.5) { // grade em perspectiva
      float hz = -0.12, l = 0.0;
      if (p.y < hz) { float z = 0.45 / (hz - p.y); vec2 gp = vec2(p.x * z, z + t * 0.12 + vt * 0.9);
        vec2 gl = abs(fract(gp * 1.2) - 0.5) / fwidth(gp * 1.2); l = (1.0 - min(min(gl.x, gl.y), 1.0)) * smoothstep(9.0, 1.2, z) * smoothstep(hz, hz - 0.08, p.y); }
      return vec2(0.0, l * 0.9);
    }
    if (id < 2.5) { // feed: cartões subindo em colunas
      vec2 cel = vec2(0.3, 0.46); float col = floor(p.x / cel.x); vec2 q = p; q.y += t * 0.16 * (1.0 + 0.35 * mod(col, 2.0)) + vt * 0.6 + col * 0.21;
      vec2 g = (fract(q / cel) - 0.5) * cel; float d = caixa(g, cel * vec2(0.4, 0.42), 0.025);
      return vec2(traco(d, 0.0045) * 0.9, d < 0.0 ? 0.05 : 0.0);
    }
    if (id < 3.5) { // estilhaços
      vec2 q = p * 4.2, i = floor(q), fq = fract(q); float d1 = 8.0, d2 = 8.0;
      for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec2 o = vec2(float(x), float(y)), h = hash2(i + o); vec2 dd = o + 0.5 + 0.4 * sin(h * 6.28 + t * 0.3) - fq; float d = dot(dd, dd);
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; } }
      return vec2(traco(sqrt(d2) - sqrt(d1), 0.07) * 0.85, 0.0);
    }
    if (id < 4.5) { // trilhas de uma linha do tempo, com a agulha
      float ln = floor(p.y * 6.0), fy = fract(p.y * 6.0) - 0.5;
      float bx = fract((p.x + t * (0.06 + 0.1 * hash(vec2(ln, 3.0))) + vt * 0.3) * 1.6 + hash(vec2(ln, 7.0)) * 9.0);
      float bloco = step(0.12, bx) * step(bx, 0.78) * step(abs(fy), 0.3);
      float borda = bloco * (1.0 - step(abs(fy), 0.25) * step(0.145, bx) * step(bx, 0.755));
      float agulha = traco(p.x - (fract(t * 0.07) * 2.0 - 1.0) * ar * 0.5, 0.004);
      return vec2(borda * 0.45, agulha * 0.8 + bloco * 0.025);
    }
    if (id < 5.5) { // corações subindo
      vec2 cel = vec2(0.24); vec2 q = p; q.y -= t * 0.08 + vt * 0.4; vec2 i = floor(q / cel), g = (fract(q / cel) - 0.5) * cel, h = hash2(i);
      g -= (h - 0.5) * cel * 0.4; float s = 0.05 + h.x * 0.045; float d = coracao(g / s + vec2(0.0, 0.5)) * s;
      return vec2(traco(d, 0.0035) * 0.85 * step(0.3, h.y), d < 0.0 ? 0.05 * step(0.3, h.y) : 0.0);
    }
    if (id < 6.5) { // matriz de pontos ondulando a partir da logo
      vec2 g = (fract(p / 0.04) - 0.5) * 0.04; float on = 0.5 + 0.5 * sin(r * 22.0 - t * 2.6);
      float d = length(g) - 0.003 - 0.0045 * on * exp(-r * 1.1);
      return vec2(0.0, (1.0 - smoothstep(0.0, 0.002, d)) * (0.3 + 0.7 * on));
    }
    if (id < 7.5) { // barras de gráfico
      float ci = floor(p.x * 9.0), fx = fract(p.x * 9.0), h = -0.2 + 0.45 * ruido(vec2(ci * 0.7, t * 0.25));
      float dentro = step(0.18, fx) * step(fx, 0.82) * step(p.y, h);
      float borda = dentro * (1.0 - step(0.215, fx) * step(fx, 0.785) * step(p.y, h - 0.008));
      return vec2(borda * 0.75 + dentro * 0.05, traco(p.y - h, 0.004) * step(0.18, fx) * step(fx, 0.82));
    }
    if (id < 8.5) { // radar: anéis, meridianos e a varredura
      float an = traco(fract(r * 5.0 - t * 0.25) - 0.5, 0.025) * smoothstep(1.7, 0.2, r);
      float me = traco(sin(a * 6.0 + t * 0.2), 0.05) * smoothstep(1.5, 0.3, r);
      float va = smoothstep(0.75, 1.0, fract((a + t * 0.6) / 6.2832)) * smoothstep(1.4, 0.0, r);
      return vec2(an * 0.7 + me * 0.3, va * 0.35);
    }
    if (id < 9.5) { // céu: nuvens e chão isométrico
      float n = fbm(p * 2.2 + vec2(t * 0.03, 0.0));
      vec2 iso = vec2(p.x * 1.732 + p.y, p.x * 1.732 - p.y) * 3.0, gi = abs(fract(iso) - 0.5) / fwidth(iso);
      return vec2((1.0 - min(min(gi.x, gi.y), 1.0)) * smoothstep(-0.1, -0.6, p.y) * 0.55, smoothstep(0.45, 0.85, n) * 0.35);
    }
    if (id < 10.5) { // bolhas de conversa subindo, uma de cada lado
      float yy = (p.y + t * 0.12 + vt * 0.5) / 0.16, lin = floor(yy), fy = fract(yy) - 0.5;
      float lado = mod(lin, 2.0) < 1.0 ? -1.0 : 1.0, w = 0.16 + 0.15 * hash(vec2(lin, 1.0));
      float d = caixa(vec2(p.x - lado * (ar * 0.5 - w - 0.08), fy * 0.16), vec2(w, 0.05), 0.045);
      return vec2(traco(d, 0.0045) * 0.85, d < 0.0 ? 0.06 : 0.0);
    }
    if (id < 11.5) { // vapor: curvas de nível que sobem e se enrolam
      vec2 q = p * 1.1; q.y -= t * 0.1; q += 0.45 * vec2(fbm(q + t * 0.04), fbm(q + 3.1));
      return vec2(traco(fract(fbm(q) * 5.0) - 0.5, 0.045) * 0.5 * smoothstep(-0.6, 0.1, p.y), 0.0);
    }
    if (id < 12.5) { // raios saindo da logo
      float ra = pow(abs(sin(a * 9.0 + t * 0.15)), 24.0) * smoothstep(0.15, 0.5, r) * exp(-r * 0.7);
      return vec2(ra * 0.9, ra * 0.3);
    }
    if (id < 13.5) { // carregando: anéis tracejados girando em volta da logo
      float k = 0.0;
      for (int i = 0; i < 3; i++) { float fi = float(i); k += traco(r - 0.35 - fi * 0.22, 0.004) * step(0.5, fract((a / 6.2832) * (10.0 + fi * 6.0) + t * (0.3 - fi * 0.17))); }
      return vec2(k * 0.75, 0.0);
    }
    // código: linhas de traços que sobem
    float yy = (p.y + t * 0.05 + vt * 0.4) * 22.0, ln = floor(yy), fy = fract(yy) - 0.5;
    float x0 = -ar * 0.5 + 0.08 + floor(hash(vec2(ln, 2.0)) * 4.0) * 0.06, len = 0.2 + 0.9 * hash(vec2(ln, 5.0));
    float tok = step(0.28, fract((p.x - x0) * 9.0 + hash(vec2(ln, 9.0))));
    return vec2(0.0, step(x0, p.x) * step(p.x, x0 + len) * step(abs(fy), 0.18) * tok * 0.4);
  }
  void main() {
    vec2 uv = vUv;
    float ar = uRes.x / uRes.y;
    vec2 p = (uv - 0.5) * vec2(ar, 1.0);
    float t = uTime;
    vec2 f = (uFoco - 0.5) * vec2(ar, 1.0);
    // troca de capítulo: o desenho e o tom do papel novos se abrem em círculo a partir da logo
    float rT = length(p - f), RT = uTroca * 2.7;
    float kT = uTroca >= 1.0 ? 1.0 : (uTroca <= 0.0 ? 0.0 : smoothstep(RT + 0.22, RT - 0.04, rT));
    float c = clamp(-uMix, 0.0, 1.0), s = clamp(uMix, 0.0, 1.0);

    // lado: 0 = Criativos (esquerda / topo), 1 = Sites (direita / base)
    float axis = mix(uv.x, 1.0 - uv.y, uPortrait);
    float edge = 0.5 - uMix * uSplitK;
    float side = smoothstep(edge - 0.2, edge + 0.2, axis);
    float wC = mix(c, (1.0 - side) * (0.3 + 0.7 * c) * (1.0 - 0.75 * s), uPortal);
    float wS = mix(s, side * (0.3 + 0.7 * s) * (1.0 - 0.75 * c), uPortal);
    float calma = 1.0 - uDim * 0.82;                       // seções de leitura: o desenho quase some
    float jr = 1.0 - uPortal;

    // papel: branco, com o off-white quente chegando pelas bordas; os capítulos alternam entre os dois tons
    float tom = mix(uTomA, uTomB, kT);
    vec3 col = mix(uPapel, uCreme, clamp(tom * 0.9 + smoothstep(0.3, 1.2, length(p)) * 0.55, 0.0, 1.0));

    // luz quente junto da logo, como um refletor de estúdio sobre o papel
    float rl = length(p - f);
    col = mix(col, uOuroClaro, exp(-rl * rl * mix(2.0, 4.2, jr)) * (0.2 + 0.3 * uLuz) * calma * (0.4 + 0.6 * min(1.0, wC + wS)));

    // desenho em traço de ouro. No portal: riscos do lado de Criativos e piso em perspectiva do lado de Sites.
    // Nas jornadas: o desenho do capítulo, mais marcado perto da logo.
    float tinta = 0.0;
    if (jr > 0.01) {
      vec2 pA = padrao(uPadA, p, f, t, uVelT, ar);
      vec2 pB = (kT > 0.001 && abs(uPadB - uPadA) > 0.5) ? padrao(uPadB, p, f, t, uVelT, ar) : pA;
      vec2 pat = mix(pA, pB, kT);
      tinta += (pat.x * 0.85 + pat.y * 0.6) * jr * max(wC, wS);
    }
    if (uPortal > 0.01) {
      vec2 pc = padrao(0.0, p, f, t, uVelT, ar), ps = padrao(1.0, p, f, t, uVelT, ar);
      tinta += ((pc.x * 0.85 + pc.y * 0.6) * wC + (ps.x * 0.85 + ps.y * 0.6) * wS) * uPortal;
    }
    float perto = 0.36 + 0.5 * exp(-rT * rT * 1.3);
    col = mix(col, uOuro, clamp(tinta * perto * (1.0 + uLuz * 0.6), 0.0, 1.0) * 0.6 * calma);

    // sombra de contato sob a logo: mais estreita quando ela está de pé, como bastão
    if (uSombra > 0.001) {
      float larg = uRaio * (1.0 - 0.55 * uForma);
      vec2 q = p - f + vec2(0.0, uRaio * (1.2 + 0.2 * uForma));
      float sh = exp(-(q.x * q.x) / (larg * larg * 0.62) - (q.y * q.y) / (uRaio * uRaio * 0.012));
      col = mix(col, uTinta, sh * 0.12 * uSombra);
    }
    // quando a logo "fala": um anel fino de ouro atravessa a tela
    if (uOnda > 0.0) {
      float R = uOnda * 2.1;
      col = mix(col, uOuro, exp(-pow((rl - R) / (0.01 + uOnda * 0.03), 2.0)) * pow(1.0 - uOnda, 1.6) * 0.5);
      col = mix(col, uOuroClaro, smoothstep(R, R - 0.5, rl) * pow(1.0 - uOnda, 3.0) * 0.12);
    }
    // a frente da troca de capítulo é uma linha de ouro
    if (uTroca > 0.0 && uTroca < 1.0) col = mix(col, uOuro, exp(-pow((rT - RT) / 0.012, 2.0)) * 0.5 * (1.0 - uTroca));
    // véu de leitura preso à tela: papel limpo atrás do texto (esquerda no computador, pé da tela no celular)
    col = mix(col, uPapel, uLado * 0.82 * smoothstep(0.72, 0.05, uv.x));
    col = mix(col, uPapel, uBaixo * 0.9 * smoothstep(0.6, 0.05, uv.y));
    col += (hash(uv * uRes + fract(t) * 37.0) - 0.5) * 0.012;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

// Cartões: telas de site (com barra de navegador) e quadros 9:16 de vídeo
const CARD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const CARD_FRAG = /* glsl */ `
  uniform sampler2D uMap; uniform float uHasMap, uOpacity, uAspect, uTime, uBar, uSeed;
  uniform vec3 uEdge;
  varying vec2 vUv;
  float sdRound(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float d = sdRound(p, vec2(uAspect * 0.5, 0.5) - 0.004, 0.045);
    float aa = fwidth(d) * 1.5;
    float inside = 1.0 - smoothstep(-aa, aa, d);
    if (inside < 0.01) discard;
    float barH = 0.075 * uBar;
    vec2 iuv = vec2(vUv.x, vUv.y / (1.0 - barH));
    vec3 col = uHasMap > 0.5 ? texture2D(uMap, iuv).rgb : mix(vec3(0.84, 0.81, 0.74), vec3(0.94, 0.92, 0.88), vUv.y);
    if (vUv.y > 1.0 - barH) {
      col = vec3(0.9, 0.88, 0.83);
      vec2 bp = vec2(vUv.x * uAspect, (vUv.y - (1.0 - barH * 0.5)));
      for (int i = 0; i < 3; i++) {
        float dd = length(bp - vec2(0.05 + float(i) * 0.045, 0.0));
        col = mix(col, uEdge, 1.0 - smoothstep(0.011, 0.015, dd));
      }
    }
    float rim = 1.0 - smoothstep(0.0, aa * 2.5 + 0.004, abs(d));
    col = mix(col, uEdge, rim * 0.9);
    float sweep = fract(uTime * 0.07 + uSeed);
    col += smoothstep(0.07, 0.0, abs((vUv.x * 0.6 + vUv.y * 0.4) - (sweep * 1.6 - 0.3))) * 0.09;
    gl_FragColor = vec4(col, inside * uOpacity);
    #include <colorspace_fragment>
  }
`;

// aura da logo sobre o papel: um halo de ouro claro, raios finos (como gravação) quando ela "fala" e um anel que sai dela
const LUZ_VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const LUZ_FRAG = /* glsl */ `
  uniform vec3 uCor; uniform float uK, uOnda, uT, uBase, uFade;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 8.0;
    float r = length(p), a = atan(p.y, p.x);
    float halo = exp(-max(r - 1.0, 0.0) * 2.4) * smoothstep(0.8, 1.05, r);
    float raios = pow(0.5 + 0.5 * sin(a * 24.0 + uT * 0.25), 30.0) * exp(-max(r - 1.0, 0.0) * 1.3) * smoothstep(1.1, 1.32, r);
    float anel = 0.0;
    if (uOnda > 0.0) { float R = 1.05 + uOnda * 2.8; anel = exp(-pow((r - R) / (0.02 + uOnda * 0.05), 2.0)) * pow(1.0 - uOnda, 1.4); }
    float alfa = (halo * 0.16 * (uBase + uK) + raios * 0.55 * uK + anel * 0.5) * smoothstep(4.0, 3.0, r) * uFade;
    gl_FragColor = vec4(uCor, clamp(alfa, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);   // easeGlide do MedGrind
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));

export function suportaWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export function criarMundo(canvas, { telas = [], reels = [], midia = {}, matcaps = {} } = {}) {
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = mqReduce.matches;
  mqReduce.addEventListener?.("change", (e) => { reduce = e.matches; });
  const coarse = matchMedia("(pointer: coarse)").matches;
  // três níveis: alta (computador), media (celular/máquina modesta), baixa (WebGL por software
  // ou ?qualidade=baixa). A cena é a mesma; muda a densidade da esfera e a resolução.
  // o nível vem do aparelho (tela física, ponteiro, núcleos), não da janela: janela estreita no computador continua "alta"
  let nivel = coarse || Math.min(screen.width, screen.height) < 700 || (navigator.hardwareConcurrency || 8) <= 4 ? "media" : "alta";
  const pedido = new URLSearchParams(location.search).get("qualidade");
  const fixo = new URLSearchParams(location.search).get("bastao") === "1" ? 1 : 0;      // ?bastao=1 deixa a logo como bastão (para conferir)
  try {
    const sonda = document.createElement("canvas");
    const gl = sonda.getContext("webgl2") || sonda.getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const placa = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(placa)) nivel = "baixa";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { /* segue */ }
  if (["alta", "media", "baixa"].includes(pedido)) nivel = pedido;
  const leve = nivel !== "alta";

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: nivel !== "baixa", alpha: false, powerPreference: "high-performance" });
  } catch { return null; }
  let dprMax = nivel === "alta" ? 1.5 : nivel === "media" ? 1.25 : 1;
  renderer.setPixelRatio(Math.min(devicePixelRatio, dprMax));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(CORES.papel);
  // só os materiais físicos (celular, notebook) usam tom de câmera; os shaders do emblema e do fundo não
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  {
    const sol = new THREE.DirectionalLight("#ffffff", 1.6); sol.position.set(-3, 4, 5); scene.add(sol);
  }
  // luz de estúdio (só os materiais físicos do celular, notebook e xícara usam; os shaders da logo e do fundo não):
  // é gerada depois do primeiro quadro, junto com os aparelhos (veja o fim de criarMundo)
  const ambiente = () => {
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    pm.dispose();
  };
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  const CAM_Z = 7.5;
  camera.position.set(0, 0, CAM_Z);

  const C = (h) => new THREE.Color(h);
  const MATCAPS = { ouro: { value: null }, perola: { value: null }, tem: { value: 0 } };

  // ---------- fundo ----------
  const fundoU = {
    uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMix: { value: 0 }, uPortal: { value: 1 },
    uPortrait: { value: 0 }, uDim: { value: 0 }, uSplitK: { value: 0.12 }, uFoco: { value: new THREE.Vector2(0.5, 0.5) },
    uPapel: { value: C(CORES.papel) }, uCreme: { value: C(CORES.creme) }, uTinta: { value: C(CORES.tinta) },
    uOuro: { value: C(CORES.ouro) }, uOuroClaro: { value: C(CORES.ouroClaro) },
    uLuz: { value: 0 }, uOnda: { value: 0 }, uVelT: { value: 0 }, uRaio: { value: 0.2 }, uForma: { value: 0 }, uSombra: { value: 0 },
    uTroca: { value: 0 }, uLado: { value: 0 }, uBaixo: { value: 0 }, uPadA: { value: 0 }, uPadB: { value: 0 }, uTomA: { value: 0 }, uTomB: { value: 0 },
  };
  // desenho do fundo por capítulo, sempre em traço de ouro:
  // 0 riscos · 1 grade · 2 feed · 3 estilhaços · 4 trilhas · 5 corações · 6 pontos · 7 barras · 8 radar
  // 9 céu · 10 bolhas · 11 vapor · 12 raios · 13 carregando · 14 código
  const PADROES = {
    "c-problema": 2, "c-explode": 3, "c-montagem": 4, "c-voz": 10, "c-sucesso": 5, numeros: 6, trabalhos: 12, "c-dinheiro": 7, anuncios: 6, "c-oportunidade": 8,
    "s-problema": 13, "s-montagem": 14, "s-caso": 9, "s-depoimento": 7, projetos: 6, "s-oportunidade": 10, "s-cafe": 11,
  };
  // capítulos em que o papel fica no off-white quente (os outros ficam no branco): os dois tons se alternam pela página
  const CREME = new Set(["c-problema", "c-montagem", "numeros", "c-dinheiro", "c-oportunidade", "s-problema", "s-caso", "s-oportunidade"]);
  const tomPara = (nome, imediato) => {
    const id = PADROES[nome] ?? (st.universo === "sites" ? 1 : 0), tom = CREME.has(nome) ? 1 : 0;
    if (!imediato && id === fundoU.uPadB.value && tom === fundoU.uTomB.value && st.tomChave === "ok") return;
    st.tomChave = "ok";
    if (imediato || reduce) { fundoU.uPadA.value = fundoU.uPadB.value = id; fundoU.uTomA.value = fundoU.uTomB.value = tom; st.troca = 0; return; }
    // se a troca anterior ainda corre, parte do desenho que domina a tela
    if (st.troca > 0.5) { fundoU.uPadA.value = fundoU.uPadB.value; fundoU.uTomA.value = fundoU.uTomB.value; }
    fundoU.uPadB.value = id; fundoU.uTomB.value = tom; st.troca = 0.0001;
    st.pulso = Math.max(st.pulso, 0.85); st.onda = 0.001;
  };
  const triGeo = new THREE.BufferGeometry();
  triGeo.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const fundo = new THREE.Mesh(triGeo, new THREE.ShaderMaterial({
    uniforms: fundoU, vertexShader: FUNDO_VERT, fragmentShader: FUNDO_FRAG, depthWrite: false, depthTest: false,
    extensions: { derivatives: true },
  }));
  fundo.frustumCulled = false; fundo.renderOrder = -10;
  scene.add(fundo);

  // ---------- logo: o emblema (esfera de pérola, arcos de ouro) que vira o bastão de Asclépio ----------
  const logoPos = new THREE.Group(), tilt = new THREE.Group(), spin = new THREE.Group();
  logoPos.add(tilt); tilt.add(spin); scene.add(logoPos);
  const emblema = criarEmblema({ nivel, matcaps: MATCAPS });
  spin.add(emblema.grupo);
  // aura atrás do emblema + uma luz pontual que acende celular e notebook quando a logo fala
  const luzU = { uCor: { value: C(CORES.ouro) }, uK: { value: 0 }, uOnda: { value: 0 }, uT: { value: 0 }, uBase: { value: 0.15 }, uFade: { value: 1 } };
  const luz = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShaderMaterial({
    uniforms: luzU, vertexShader: LUZ_VERT, fragmentShader: LUZ_FRAG, transparent: true, depthWrite: false, depthTest: false,
  }));
  luz.position.z = -0.6; luz.renderOrder = -2; logoPos.add(luz);
  const luzP = new THREE.PointLight("#fff1d6", 0, 9, 1.4); luzP.position.z = 0.8; logoPos.add(luzP);
  // matcaps (ouro e pérola, assados no Blender): chegam depois da primeira imagem; até lá o emblema usa uma luz simples
  {
    const tl = new THREE.TextureLoader(); let n = 0;
    for (const k of ["ouro", "perola"]) {
      tl.load(matcaps[k] || `/assets/tex/matcap-${k}.webp`, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; MATCAPS[k].value = tex;
        if (++n === 2) MATCAPS.tem.value = 1;
      });
    }
  }

  // ---------- cartões ----------
  const loader = new THREE.TextureLoader();
  const cardGeoCache = new Map();
  function cartao(src, aspect, tipo, i) {
    const key = aspect.toFixed(3);
    if (!cardGeoCache.has(key)) cardGeoCache.set(key, new THREE.PlaneGeometry(aspect, 1));
    const uni = {
      uMap: { value: null }, uHasMap: { value: 0 }, uOpacity: { value: 0 }, uAspect: { value: aspect }, uTime: { value: 0 },
      uBar: { value: tipo === "tela" ? 1 : 0 }, uSeed: { value: i * 0.173 },
      uEdge: { value: C(CORES.ouro) },
    };
    const m = new THREE.Mesh(cardGeoCache.get(key), new THREE.ShaderMaterial({
      uniforms: uni, vertexShader: CARD_VERT, fragmentShader: CARD_FRAG, transparent: true, depthWrite: false,
      side: THREE.DoubleSide, extensions: { derivatives: true },
    }));
    m.renderOrder = 3; m.visible = false;
    m.userData = { src, tipo, i, carregado: false, uni, pos: new THREE.Vector3(0, 0, -6), rot: new THREE.Euler(), op: 0, s: 1 };
    scene.add(m);
    return m;
  }
  function carregar(m) {
    if (m.userData.carregado || !m.userData.src) return;
    m.userData.carregado = true;
    loader.load(m.userData.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      m.userData.uni.uMap.value = tex; m.userData.uni.uHasMap.value = 1;
    });
  }
  const cTelas = telas.slice(0, 6).map((src, i) => cartao(src, 16 / 10, "tela", i));
  const disp = criarDispositivos({ scene, renderer, nivel, reduce, midia, vista: () => ({ W, H, retrato }) });
  const cReels = reels.slice(0, 7).map((src, i) => cartao(src, 9 / 16, "reel", i));

  // ---------- estado ----------
  const st = { onda: 0, vel: 0, velT: 0, troca: 0, tomChave: "", lado: 0, baixo: 0,
    universo: "portal",              // portal | sites | criativos
    lean: 0, mix: 0,                 // lean = alvo no portal; mix = valor suavizado
    cena: "portal", dim: 0,
    lp: new THREE.Vector3(), ls: 1, lo: 1,
    ptr: { x: 0, y: 0, tx: 0, ty: 0 },
    mergulho: 0, chegada: 0, ocioso: 0, glow: 0, pulso: 0,
    vivo: true, visivel: true, opacidade: 1,
    morph: 0, emblema: 0, vida: 0, ptrVisto: false,   // morph: 0 = logo, 1 = bastão de Asclépio
  };

  let W = 1, H = 1, retrato = false;
  const enquadrar = (cena) => {
    const c = retrato ? { ...cena, ...cena.d } : innerWidth < 1400 ? { ...cena, ...(cena.m || {}) } : cena;
    // teto: no portal a logo fica entre duas palavras; em tela mais quadrada ela encolhe para não entrar no texto
    return cena.teto && !retrato ? { ...c, s: Math.min(c.s, cena.teto * camera.aspect) } : c;
  };
  function visivel() {
    const h = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return { w: h * camera.aspect, h };
  }
  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    // teto de pixels: em monitores grandes a cena não passa de ~2,3 milhões de pixels
    renderer.setPixelRatio(Math.max(0.75, Math.min(devicePixelRatio, dprMax, Math.sqrt(2.3e6 / (w * h)))));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    retrato = w / h < 0.9;
    fundoU.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    fundoU.uPortrait.value = retrato ? 1 : 0;
    const v = visivel(); W = v.w; H = v.h;
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  // ponteiro (paralaxe amortecida, como no MedGrind: x .35, y .18)
  const onMove = (e) => {
    st.ptr.tx = (e.clientX / innerWidth) * 2 - 1; st.ptr.ty = (e.clientY / innerHeight) * 2 - 1;
    st.ocioso = 0; st.ptrVisto = true;
  };
  addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { st.ptrVisto = false; });

  document.addEventListener("visibilitychange", () => { st.visivel = !document.hidden; if (st.visivel) clock.getDelta(); });

  // ---------- disposição dos cartões ----------
  const tmpV = new THREE.Vector3();
  function alvoCartoes(dt, t) {
    const c = Math.max(0, -st.mix), s = Math.max(0, st.mix);
    const cena = CENAS[st.cena] || CENAS.portal;
    const portal = st.universo === "portal";
    const orbitaRaio = (retrato ? 1.05 : 1.75) * st.ls;
    const setCard = (m, pos, rot, op, sc) => {
      const d = m.userData;
      d.pos.x = damp(d.pos.x, pos.x, 3.2, dt); d.pos.y = damp(d.pos.y, pos.y, 3.2, dt); d.pos.z = damp(d.pos.z, pos.z, 3.2, dt);
      d.rot.x = damp(d.rot.x, rot.x, 3.2, dt); d.rot.y = damp(d.rot.y, rot.y, 3.2, dt); d.rot.z = damp(d.rot.z, rot.z, 3.2, dt);
      d.op = damp(d.op, op, 4, dt); d.s = damp(d.s, sc, 3.2, dt);
      m.position.copy(d.pos); m.rotation.copy(d.rot); m.scale.setScalar(d.s);
      d.uni.uOpacity.value = d.op * st.opacidade; d.uni.uTime.value = t;
      m.visible = d.op > 0.01;
      if (op > 0.01) carregar(m);
    };
    // Sites: telas em leque em perspectiva / em órbita precisa
    cTelas.forEach((m, i) => {
      const n = cTelas.length; let pos, rot, op, sc;
      if (portal) {
        const k = i - (n - 1) / 2;
        if (retrato) {
          pos = tmpV.set(k * 0.5 + 0.2, -0.32 - Math.abs(k) * 0.05, -2.6 - Math.abs(k) * 0.2 + s * 0.7);
          rot = { x: -0.25, y: -k * 0.18, z: 0 };
        } else {
          pos = tmpV.set(W * 0.16 + k * 0.3 + s * 0.12, k * 0.44 + Math.sin(t * 0.3 + i) * 0.03, -2.5 - Math.abs(k) * 0.3 + s * 0.8);
          rot = { x: 0.08, y: -0.55 + s * 0.12, z: 0.03 * k };
        }
        op = 0.85 * s * (1 - 0.85 * c); sc = retrato ? 0.42 : 0.66 + 0.08 * s;
      } else if (st.universo === "sites" && cena.cards === "orbita") {
        const a = (i / n) * Math.PI * 2 + t * (reduce ? 0 : 0.12);
        pos = tmpV.set(st.lp.x + Math.cos(a) * orbitaRaio, st.lp.y + Math.sin(a) * orbitaRaio * 0.28 + 0.05, st.lp.z + Math.sin(a) * orbitaRaio * 0.6);
        rot = { x: 0, y: Math.atan2(Math.cos(a), 1.6) * -0.9, z: 0 };
        op = 0.55 + 0.45 * Math.max(0, Math.sin(a)); sc = (retrato ? 0.42 : 0.62) * st.ls;
      } else {
        pos = tmpV.set(m.userData.pos.x * 1.02, m.userData.pos.y, -8); rot = m.userData.rot; op = 0; sc = m.userData.s;
      }
      setCard(m, pos, rot, op, sc);
    });
    // Criativos: quadros verticais que giram com energia
    cReels.forEach((m, i) => {
      const n = cReels.length; let pos, rot, op, sc;
      const wob = reduce ? 0 : Math.sin(t * 1.3 + i * 1.7);
      if (portal) {
        const k = i - (n - 1) / 2;
        if (retrato) {
          pos = tmpV.set(k * 0.42 - 0.15, 0.36 + Math.abs(k) * 0.05, -2.6 - Math.abs(k) * 0.2 + c * 0.7);
          rot = { x: 0.25, y: k * 0.2, z: wob * 0.08 };
        } else {
          pos = tmpV.set(-W * 0.16 + k * 0.26 - c * 0.12, Math.sin(i * 2.1) * 0.85 + wob * 0.06, -2.4 - Math.abs(Math.cos(i * 1.3)) * 0.8 + c * 0.8);
          rot = { x: 0.05, y: 0.5 - c * 0.12, z: (i % 2 ? 1 : -1) * 0.12 + wob * 0.05 };
        }
        op = 0.85 * c * (1 - 0.85 * s); sc = retrato ? 0.36 : 0.58 + 0.08 * c;
      } else if (st.universo === "criativos" && cena.cards === "orbita") {
        const a = (i / n) * Math.PI * 2 + t * (reduce ? 0 : 0.28);
        const r = orbitaRaio * 1.05;
        pos = tmpV.set(st.lp.x + Math.cos(a) * r, st.lp.y + Math.sin(a * 2 + t * 0.6) * 0.18 * r + Math.sin(a) * 0.32 * r, st.lp.z + Math.sin(a) * r * 0.7);
        rot = { x: 0.1 * wob, y: Math.atan2(Math.cos(a), 1.4) * -0.9, z: (i % 2 ? 1 : -1) * 0.14 + wob * 0.08 };
        op = 0.5 + 0.5 * Math.max(0, Math.sin(a)); sc = (retrato ? 0.46 : 0.7) * st.ls;
      } else {
        pos = tmpV.set(m.userData.pos.x * 1.02, m.userData.pos.y, -8); rot = m.userData.rot; op = 0; sc = m.userData.s;
      }
      setCard(m, pos, rot, op, sc);
    });
  }

  // ---------- laço ----------
  const clock = new THREE.Clock();
  let t = 0, raf = 0, frames = 0, acc = 0, pular = false, janelas = 0;
  const qId = new THREE.Quaternion();
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), inv = new THREE.Matrix4(), esfera = new THREE.Sphere();
  const ptr3 = new THREE.Vector3(0, 0, 9), ptrAlvo = new THREE.Vector3();

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(Math.max(clock.getDelta(), 1 / 240), 1 / 12);   // como no MedGrind: travada atrasa, não pula
    if (!st.visivel || !st.vivo) return;
    if (st.opacidade < 0.01 && st.mergulho === 0) return;
    st.ocioso += dt;

    // auto-ajuste: se os primeiros quadros forem lentos, baixa a resolução
    frames++; acc += dt;
    // a 1ª janela de medida tem shaders compilando e vídeos abrindo: não conta
    if (frames >= 90) { if (acc / frames > 1 / 40 && janelas++ > 0 && dprMax > 1) { dprMax = Math.max(1, dprMax - 0.25); renderer.setPixelRatio(Math.min(devicePixelRatio, dprMax)); resize(); } frames = 0; acc = 0; }

    // portal: no toque (ou mouse parado no centro), a logo respira entre os dois universos
    let alvoMix;
    if (st.universo === "portal") {
      alvoMix = st.lean;
      if (st.autoBalanco && !reduce && st.ocioso > 2.2) alvoMix = Math.sin((st.ocioso - 2.2) * 0.55) * 0.55;
    } else alvoMix = st.universo === "sites" ? 1 : -1;
    st.mix = damp(st.mix, alvoMix, reduce ? 10 : 3.4, dt);
    const c = Math.max(0, -st.mix), s = Math.max(0, st.mix);
    t += reduce ? 0 : dt * (0.55 + c * 0.9 + s * 0.15);

    // cena alvo
    const cena = CENAS[st.cena] || CENAS.portal;
    const cd = enquadrar(cena);
    const k = reduce ? 12 : 2.4;
    st.lp.x = damp(st.lp.x, cd.x * W, k, dt);
    st.lp.y = damp(st.lp.y, cd.y * H, k, dt);
    st.lp.z = damp(st.lp.z, 0, k, dt);
    st.ls = damp(st.ls, cd.s, k, dt);
    st.lo = damp(st.lo, cd.o ?? 1, k, dt);
    st.dim = damp(st.dim, cd.dim, k, dt);

    // mergulho (portal → universo): a câmera atravessa a logo
    const md = smoother(Math.min(1, st.mergulho));
    const ch = smoother(Math.min(1, st.chegada));

    // ponteiro e respiração da câmera
    st.ptr.x = damp(st.ptr.x, st.ptr.tx, 4, dt); st.ptr.y = damp(st.ptr.y, st.ptr.ty, 4, dt);
    const breath = reduce ? 0 : 1;
    camera.position.x = st.ptr.x * 0.22 * breath + Math.sin(t * 0.25) * 0.05 * breath;
    camera.position.y = -st.ptr.y * 0.12 * breath + Math.sin(t * 0.18) * 0.04 * breath;
    camera.position.z = CAM_Z - md * (CAM_Z - 0.6) + (1 - ch) * 3.2 * (st.chegada > 0 ? 1 : 0);
    camera.fov = 32 + md * 18 + Math.sin(Math.PI * md) * 6;
    camera.updateProjectionMatrix();
    camera.lookAt(st.lp.x * md * 0.9, st.lp.y * md * 0.9, 0);

    st.pulso = damp(st.pulso, 0, reduce ? 12 : 2.6, dt);
    if (st.onda > 0) { st.onda += dt * 0.7; if (st.onda >= 1) st.onda = 0; }
    if (st.troca > 0) {
      st.troca += dt * 0.62;
      if (st.troca >= 1) { st.troca = 0; fundoU.uPadA.value = fundoU.uPadB.value; fundoU.uTomA.value = fundoU.uTomB.value; }
    }
    fundoU.uTroca.value = st.troca;
    // leitura: limpa o papel à esquerda no hero e no pé da tela no celular, sem faixas que rolam
    const retr = fundoU.uPortrait.value > 0.5, jornada = st.universo !== "portal";
    st.lado = damp(st.lado, jornada && !retr && st.cena === "hero" ? 1 : 0, 2.4, dt);
    st.baixo = damp(st.baixo, jornada && retr && ["hero", "fundo", "texto", "caso", "painel", "globo"].includes(st.cena) ? 1 : 0, 2.4, dt);
    fundoU.uLado.value = st.lado; fundoU.uBaixo.value = st.baixo;
    st.velT = (st.velT || 0) + dt * Math.abs(st.vel || 0) * 0.6;
    const fala = Math.sin(Math.min(1, st.pulso) * Math.PI * 0.5);
    logoPos.position.copy(st.lp);
    logoPos.scale.setScalar(st.ls * (1 + md * 0.4) * (1 + fala * 0.07));

    // o mouse sobre a logo a transforma no bastão de Asclépio (a área de toque é a esfera inteira, mesmo com o bastão fino)
    scene.updateMatrixWorld();
    let hit = false;
    if (!coarse && st.mergulho === 0 && st.opacidade > 0.5) {
      ndc.set(st.ptr.tx, -st.ptr.ty); ray.setFromCamera(ndc, camera);
      emblema.grupo.getWorldPosition(esfera.center); esfera.radius = logoPos.scale.x;
      hit = !!ray.ray.intersectSphere(esfera, ptrAlvo) && st.ptrVisto;
    }
    // quem chega vê a transformação uma vez; no toque (sem mouse) ela volta a acontecer de tempos em tempos
    st.vida += dt;
    const grande = st.ls > 0.3 && st.lo > 0.6;
    const apresenta = !reduce && grande && st.vida > 1.6 && st.vida < 4.4;
    const ciclo = coarse && !reduce && grande && st.vida > 9 && (st.vida % 11) > 7.6;
    const alvoMorph = Math.max(hit ? 1 : 0, st.emblema, apresenta || ciclo ? 1 : 0, fixo);
    st.morph = damp(st.morph, alvoMorph, reduce ? 12 : alvoMorph > st.morph ? 2.3 : 1.9, dt);
    const mf = st.morph;

    // giro: no portal a logo acompanha o lado escolhido e volta de frente; como bastão, fica de pé girando devagar
    const spinV = reduce ? 0 : (0.05 + (c * 0.3 + s * 0.12) * (st.universo === "portal" ? 1 : 0.25)) * (1 - mf) + (alvoMorph > 0 ? mf * 0.5 : 0);
    spin.rotation.y += spinV * dt * (1 - 0.7 * Math.max(0, 1 - Math.abs(st.mix) * 3) * (st.universo === "portal" ? 1 : 0) * (1 - mf));
    // de volta à logo, ela gira para ficar de frente enquanto os arcos se abrem (chega reconhecível)
    if (alvoMorph === 0 && ((st.universo === "portal" && Math.abs(st.mix) < 0.15) || st.universo !== "portal" || mf > 0.02)) spin.quaternion.slerp(qId, 1 - Math.exp(-dt * (st.universo === "portal" ? 2.5 : 1.6) * (1 + 2.4 * mf)));
    tilt.rotation.y = damp(tilt.rotation.y, st.ptr.x * 0.35 * breath * (1 - mf * 0.6), 4, dt);
    tilt.rotation.x = damp(tilt.rotation.x, st.ptr.y * 0.22 * breath * (1 - mf * 0.6) + mf * 0.06, 4, dt);
    tilt.rotation.z = damp(tilt.rotation.z, 0, 4, dt);

    // traço e brilho: a logo engrossa e acende de leve quando "fala"
    const fade = Math.min(1, st.lo + fala * 0.45) * st.opacidade * (1 - Math.max(0, md - 0.75) * 4);
    emblema.atualizar({ morph: mf, fade: Math.max(0, fade), grossura: 1 + fala * 0.35, luz: st.glow * 0.4 + fala * 0.12 });

    // luz emitida: ouro, mais forte quando a logo fala
    const someLuz = Math.max(0, 1 - md * 1.6) * st.opacidade * Math.min(1, st.lo * 1.4);
    luzU.uK.value = fala * 1.15; luzU.uOnda.value = st.onda; luzU.uT.value = t;
    luzU.uBase.value = st.universo === "portal" ? 0.5 : 0.8; luzU.uFade.value = someLuz;
    luzP.intensity = (0.4 + fala * 7) * someLuz;
    fundoU.uLuz.value = fala * someLuz; fundoU.uOnda.value = st.onda * (someLuz > 0.05 ? 1 : 0); fundoU.uVelT.value = st.velT;
    fundoU.uRaio.value = logoPos.scale.x / H; fundoU.uForma.value = mf;
    fundoU.uSombra.value = Math.max(0, fade) * (1 - md) * Math.min(1, st.ls * 2.2);

    // fundo
    fundoU.uTime.value = t; fundoU.uMix.value = st.mix;
    fundoU.uPortal.value = damp(fundoU.uPortal.value, st.universo === "portal" ? 1 : 0, 3, dt);
    fundoU.uDim.value = st.dim;
    tmpV.copy(st.lp).project(camera);
    fundoU.uFoco.value.set(tmpV.x * 0.5 + 0.5, tmpV.y * 0.5 + 0.5);

    alvoCartoes(dt, t);
    disp.atualizar(dt, t, st.cap, st.capP, st.universo !== "portal");
    // seções de leitura (fundo escurecido, sem travessia): meia taxa de quadros poupa bateria
    pular = !pular;
    if (st.dim > 0.7 && st.mergulho === 0 && st.chegada === 0 && pular) return;
    if (aquecer) aquecerUm();
    renderer.render(scene, camera);
  }
  // cada aparelho é desenhado uma vez num pixel só, um por quadro, logo antes do quadro normal (que redesenha a tela
  // inteira): o driver de vídeo termina de preparar os shaders agora, e não quando o celular aparece no meio da rolagem
  let aquecer = null;
  function aquecerUm() {
    const grupo = aquecer.shift(); if (!aquecer.length) aquecer = null;
    const mudados = [];
    const mostrar = (o) => { mudados.push([o, o.visible, o.frustumCulled]); o.visible = true; o.frustumCulled = false; };
    mostrar(disp.raiz); grupo.traverse(mostrar);
    renderer.setScissorTest(true); renderer.setScissor(0, 0, 1, 1);
    try { renderer.render(scene, camera); } finally {
      renderer.setScissorTest(false);
      for (const [o, v, f] of mudados) { o.visible = v; o.frustumCulled = f; }
    }
  }

  // ---------- API ----------
  const api = {
    get estado() { return st; },
    setLean(m) { st.lean = Math.max(-1, Math.min(1, m)); st.ocioso = 0; },
    // pede a transformação em bastão de fora da cena (o mouse sobre a logo do topo, por exemplo)
    setEmblema(on) { st.emblema = on ? 1 : 0; },
    setAutoBalanco(on) { st.autoBalanco = on; },
    setUniverso(nome, { imediato = false } = {}) {
      st.universo = nome;
      if (nome === "portal") st.cena = "portal";
      else if (st.cena === "portal") st.cena = "hero";
      if (imediato) { st.mix = nome === "sites" ? 1 : nome === "criativos" ? -1 : 0; fundoU.uPortal.value = nome === "portal" ? 1 : 0; }
      tomPara(null, imediato);
    },
    // paleta do capítulo (a cor nova se espalha em círculo a partir da logo)
    setTom(nome) { tomPara(nome, false); },
    setCena(nome, { imediato = false } = {}) {
      if (!CENAS[nome]) return;
      st.cena = nome;
      if (imediato) {
        const cd = enquadrar(CENAS[nome]);
        st.lp.set(cd.x * W, cd.y * H, 0); st.ls = cd.s; st.lo = cd.o ?? 1; st.dim = cd.dim;
      }
    },
    setOpacidade(o) { st.opacidade = o; },
    // a logo pulsa como se estivesse falando (cada frase nova)
    pulsar(forca = 1) { st.pulso = Math.max(st.pulso, Math.min(1, forca)); if (forca >= 0.6 && !reduce && (st.onda === 0 || st.onda > 0.45)) st.onda = 0.001; },
    // velocidade da rolagem (acelera os riscos de luz e a grade do fundo)
    setVel(v) { st.vel = v; },
    // capítulo da história (celular/notebook) e o progresso dele na rolagem
    setCap(nome, p = 0) { st.cap = nome; st.capP = p; if (!nome) disp.pararVideos(); },
    // mergulho controlado pela rolagem (a logo expande e a câmera entra nela)
    setMergulho(p) { st.mergulho = Math.max(0, Math.min(1, p)); },
    // Mergulho: a câmera entra na logo. Resolve quando a tela já está coberta pela luz.
    mergulhar(dur = 1.05) {
      return new Promise((res) => {
        if (reduce) { st.mergulho = 0; return res(); }
        const t0 = performance.now();
        const passo = () => {
          const p = (performance.now() - t0) / (dur * 1000);
          st.mergulho = Math.min(1, p);
          if (p < 1) requestAnimationFrame(passo); else res();
        };
        passo();
      });
    },
    // Chegada: depois da troca de página a câmera recua para o enquadramento da nova cena
    chegar(dur = 1.1) {
      st.mergulho = 0;
      if (reduce) { st.chegada = 0; return; }
      const t0 = performance.now();
      st.chegada = 0.0001;
      const passo = () => {
        const p = (performance.now() - t0) / (dur * 1000);
        st.chegada = Math.min(1, p);
        if (p < 1) requestAnimationFrame(passo); else st.chegada = 0;
      };
      passo();
    },
    pausar() { st.vivo = false; },
    retomar() { if (!st.vivo) { st.vivo = true; clock.getDelta(); } },
    destruir() {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("pointermove", onMove);
      renderer.dispose();
    },
  };

  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); document.documentElement.classList.add("sem-3d"); st.vivo = false; });

  // shaders: compilar na hora do primeiro quadro travava a página (até ~5 s numa placa integrada, em pedaços
  // durante a rolagem). Agora compilam em paralelo (KHR_parallel_shader_compile) e a cena só aparece depois:
  // primeiro o fundo, a logo e os cartões; os aparelhos (celular, notebook, xícara) logo em seguida, antes da rolagem chegar neles.
  // api.pronto resolve no primeiro quadro desenhado.
  let avisar;
  api.pronto = new Promise((r) => (avisar = r));
  const compilar = (obj, alvo) => (renderer.compileAsync ? renderer.compileAsync(obj, camera, alvo) : Promise.resolve()).catch(() => { });
  scene.remove(disp.raiz);
  compilar(scene).then(() => {
    frame(); avisar();
    return new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  }).then(() => {
    ambiente(); scene.add(disp.raiz);
    return compilar(disp.raiz, scene);
  }).then(() => { aquecer = disp.raiz.children.length ? [...disp.raiz.children] : null; });
  return api;
}
