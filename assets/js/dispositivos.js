// Celular e notebook em 3D que contam a história das jornadas, guiados pela rolagem.
// Cada capítulo recebe um progresso p (0 → 1). Quem manda no ritmo é o visitante.
//   c-problema    feed do Reels com vídeos que são pulados
//   c-explode     o celular antigo explode e um novo chega com um reel bem feito
//   c-montagem    prévia do editor: corte, gancho, legenda, som e chamada entram camada a camada
//   c-sucesso     o reel publicado viraliza (contadores e corações dentro da tela)
//   c-dinheiro    o mesmo formato como anúncio: cada clique custa, o criativo paga
//   c-oportunidade  o vídeo chega a quem não segue
//   s-problema    um site genérico que perde o visitante
//   s-montagem    o site sendo construído: mensagem, design, conteúdo, celular, ação
//   s-medgrind    o caso MedGrind no notebook e no celular
//   s-oportunidade  do anúncio no celular até a conversa no WhatsApp
import * as THREE from "three";

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const faixa = (p, a, b) => clamp((p - a) / (b - a));
const suave = (x) => x * x * (3 - 2 * x);
const glide = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const fmt = (n) => (n < 1000 ? String(Math.round(n)) : n < 1e6 ? (n / 1000).toFixed(n < 1e4 ? 1 : 0).replace(".", ",").replace(",0", "") + " mil" : (n / 1e6).toFixed(1).replace(".", ",") + " mi");

const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const TELA_FRAG = /* glsl */ `
  uniform sampler2D uA, uB; uniform float uMix, uAspect, uRaio, uLuz, uTemA, uTemB, uAlpha, uBordaK;
  uniform vec2 uEscA, uEscB; uniform vec3 uBorda;
  varying vec2 vUv;
  float sdR(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  vec3 amostra(sampler2D t, vec2 esc, float tem) { if (tem < 0.5) return vec3(0.01, 0.015, 0.03); return texture2D(t, (vUv - 0.5) * esc + 0.5).rgb; }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float d = sdR(p, vec2(uAspect * 0.5, 0.5), uRaio);
    float aa = fwidth(d) * 1.5;
    float dentro = 1.0 - smoothstep(-aa, aa, d);
    if (dentro < 0.01) discard;
    vec3 c = mix(amostra(uA, uEscA, uTemA), amostra(uB, uEscB, uTemB), uMix) * uLuz;
    c += uBorda * (1.0 - smoothstep(0.0, 0.014, abs(d))) * uBordaK;
    gl_FragColor = vec4(c, dentro * uAlpha);
    #include <colorspace_fragment>
  }
`;
// estilhaços da tela: cada quadradinho gira e voa a partir do próprio centro
const CACO_VERT = /* glsl */ `
  attribute vec3 aCentro; attribute vec3 aDir; attribute vec4 aRot;
  uniform float uP;
  varying vec2 vUv; varying float vA;
  mat3 girar(vec3 a, float g) { float s = sin(g), c = cos(g), o = 1.0 - c;
    return mat3(o*a.x*a.x+c, o*a.x*a.y+a.z*s, o*a.z*a.x-a.y*s, o*a.x*a.y-a.z*s, o*a.y*a.y+c, o*a.y*a.z+a.x*s, o*a.z*a.x+a.y*s, o*a.y*a.z-a.x*s, o*a.z*a.z+c); }
  void main() {
    vUv = uv;
    float e = uP;
    vec3 local = girar(normalize(aRot.xyz), aRot.w * e * 7.0) * (position - aCentro);
    vec3 c = aCentro + aDir * (e * 2.6 + e * e * 1.4) + vec3(0.0, -e * e * 1.6, 0.0);
    vA = 1.0 - smoothstep(0.55, 1.0, e);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(c + local * (1.0 - e * 0.35), 1.0);
  }
`;
const CACO_FRAG = /* glsl */ `
  uniform sampler2D uMap; varying vec2 vUv; varying float vA;
  void main() { if (vA < 0.01) discard; vec3 c = texture2D(uMap, vUv).rgb; gl_FragColor = vec4(c + 0.08, vA);
    #include <colorspace_fragment>
  }
`;

// café: superfície que gira (redemoinho com creme) e afunda no centro quando mexe
const CAFE_VERT = /* glsl */ `
  uniform float uMexe; varying vec2 vUv;
  void main() { vUv = uv; vec3 p = position; float r = length(p.xy) / 0.5; p.z -= (1.0 - smoothstep(0.0, 0.5, r)) * 0.045 * uMexe; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }
`;
const CAFE_FRAG = /* glsl */ `
  uniform float uT, uMexe; varying vec2 vUv;
  float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
  float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
  vec3 L(vec3 c) { return pow(c, vec3(2.2)); }
  void main() {
    vec2 p = vUv * 2.0 - 1.0; float r = length(p); if (r > 1.0) discard;
    float a = atan(p.y, p.x);
    // o café gira inteiro e a colher torce o centro (torção limitada: crescendo com o tempo, a textura virava borrão)
    float w = uT * (0.12 + uMexe * 0.9), rot = w + uMexe * 2.2 * (1.0 - r) * (1.0 - r);
    vec2 q = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * p;
    // a crema escorre: deformação por ruído antes das manchas
    vec2 wq = q + 0.2 * vec2(fbm(q * 2.0 + 3.0), fbm(q * 2.0 - 7.0)) - 0.1;
    float n = fbm(wq * 3.4), f = fbm(wq * 15.0);
    vec3 escuro = L(vec3(0.13, 0.065, 0.03)), cafe = L(vec3(0.31, 0.165, 0.08)), crema = L(vec3(0.64, 0.41, 0.21)), clara = L(vec3(0.8, 0.6, 0.38));
    // crema: dourada, com manchas mais escuras (as "listras de tigre") e microbolhas
    vec3 col = mix(crema, clara, smoothstep(0.48, 0.78, n) * 0.6);
    col = mix(col, cafe, smoothstep(0.44, 0.2, n) * 0.6);
    col *= 0.84 + 0.32 * f;
    // a colher abre fios escuros em espiral, quebrados pelo ruído
    float fase = a + 4.2 * log(r + 0.06) - n * 2.4 + w * 0.6;
    float fio = (1.0 - smoothstep(0.0, 0.24, abs(sin(fase * 1.5)))) * smoothstep(0.38, 0.66, fbm(wq * 5.0 + 11.0)) * smoothstep(0.96, 0.5, r) * smoothstep(0.02, 0.18, r);
    col = mix(col, escuro, fio * uMexe * 0.7);
    col = mix(col, escuro, uMexe * (1.0 - smoothstep(0.03, 0.22, r)) * 0.75);
    // borda: menisco claro, bolhinhas presas na louça e sombra no contato
    col = mix(col, clara, smoothstep(0.86, 0.99, r) * 0.42);
    col += clara * smoothstep(0.62, 0.82, vn(vec2(a * 18.0, r * 50.0))) * smoothstep(0.8, 0.93, r) * (1.0 - smoothstep(0.97, 1.0, r)) * 0.16;
    col *= 1.0 - smoothstep(0.95, 1.0, r) * 0.55;
    // reflexo suave de uma janela distante, que ondula quando a colher passa
    vec2 rp = p - vec2(-0.28, 0.42); rp.x += sin(r * 24.0 - uT * 4.0) * 0.015 * uMexe;
    rp *= vec2(3.0, 7.0); col += vec3(1.0, 0.94, 0.86) * exp(-dot(rp, rp)) * 0.15;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function rr(x, X, Y, w, h, r) { x.beginPath(); if (x.roundRect) x.roundRect(X, Y, w, h, r); else x.rect(X, Y, w, h); }
function texCanvas(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function retArred(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2); s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}
const extrudar = (w, h, r, d, bevel, seg = 24) => {
  const g = new THREE.ExtrudeGeometry(retArred(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: seg });
  g.translate(0, 0, -d / 2); return g;
};

// ícones da interface do Reels (vetor no canvas)
const ICO = {
  coracao(x, cx, cy, s, cheio, cor = "#fff") {
    x.save(); x.translate(cx, cy); x.scale(s / 24, s / 24); x.beginPath();
    x.moveTo(0, 8); x.bezierCurveTo(-12, 0, -11, -10, -5, -10); x.bezierCurveTo(-2, -10, 0, -7, 0, -5); x.bezierCurveTo(0, -7, 2, -10, 5, -10); x.bezierCurveTo(11, -10, 12, 0, 0, 8); x.closePath();
    if (cheio) { x.fillStyle = cor; x.fill(); } else { x.strokeStyle = "#fff"; x.lineWidth = 2.2; x.stroke(); }
    x.restore();
  },
  comentario(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s / 24, s / 24); x.strokeStyle = "#fff"; x.lineWidth = 2.2; x.beginPath(); x.arc(0, -1, 9.5, Math.PI * 0.62, Math.PI * 2.42); x.lineTo(-9, 9); x.closePath(); x.stroke(); x.restore(); },
  enviar(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s / 24, s / 24); x.strokeStyle = "#fff"; x.lineWidth = 2.2; x.lineJoin = "round"; x.beginPath(); x.moveTo(-10, -9); x.lineTo(11, -9); x.lineTo(-1, 11); x.lineTo(-3, -1); x.closePath(); x.moveTo(-3, -1); x.lineTo(11, -9); x.stroke(); x.restore(); },
  mais(x, cx, cy) { x.fillStyle = "#fff"; [-7, 0, 7].forEach((d) => { x.beginPath(); x.arc(cx + d, cy, 2.4, 0, Math.PI * 2); x.fill(); }); },
  camera(x, cx, cy) { x.strokeStyle = "#fff"; x.lineWidth = 2.2; rr(x, cx - 12, cy - 9, 24, 18, 5); x.stroke(); x.beginPath(); x.arc(cx, cy, 5, 0, Math.PI * 2); x.stroke(); },
};

export function criarDispositivos({ scene, vista, nivel, reduce, midia = {} }) {
  const leve = nivel !== "alta";
  const raiz = new THREE.Group(); raiz.visible = false; scene.add(raiz);
  const loader = new THREE.TextureLoader();
  const cacheImg = new Map(), cacheEl = new Map();
  const imagem = (src) => {
    if (!src) return null;
    if (!cacheImg.has(src)) { const t = loader.load(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; cacheImg.set(src, t); }
    return cacheImg.get(src);
  };
  const imgEl = (src) => { if (!src) return null; if (!cacheEl.has(src)) { const i = new Image(); i.src = src; cacheEl.set(src, i); } return cacheEl.get(src); };
  // vídeos: um toca por vez; a montagem "arrasta" o vídeo pela rolagem (sem tocar)
  const cacheVid = new Map();
  const video = (src) => {
    if (!src) return null;
    if (!cacheVid.has(src)) {
      const v = document.createElement("video");
      Object.assign(v, { src, muted: true, loop: true, playsInline: true, preload: "auto", crossOrigin: "anonymous" });
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      cacheVid.set(src, v);
    }
    return cacheVid.get(src);
  };
  let tocando = null;
  const tocar = (src) => { const v = video(src); if (!v) return null; if (tocando && tocando !== v) tocando.pause(); tocando = v; if (v.paused) v.play().catch(() => { }); return v; };
  const pararVideos = () => { tocando?.pause(); tocando = null; };
  const arrastar = (src, frac) => {
    const v = video(src); if (!v) return null;
    if (tocando === v) { v.pause(); tocando = null; }
    if (v.readyState >= 1 && v.duration && !v.seeking) { const tt = frac * (v.duration - 0.1); if (Math.abs(v.currentTime - tt) > 0.08) v.currentTime = tt; }
    return v;
  };
  const pronto = (el) => !!el && ((el.readyState !== undefined && el.readyState >= 2) || (el.complete && el.naturalWidth > 0));

  // materiais (a luz de estúdio vem do scene.environment)
  const matAro = new THREE.MeshPhysicalMaterial({ color: "#2a3140", metalness: 1, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3 });
  const matVidro = new THREE.MeshPhysicalMaterial({ color: "#020306", metalness: 0, roughness: 0.04, clearcoat: 1, envMapIntensity: 0.9 });
  const matTraseira = new THREE.MeshPhysicalMaterial({ color: "#1c2230", metalness: 0.3, roughness: 0.45, clearcoat: 0.6, envMapIntensity: 0.9 });
  const matAlu = new THREE.MeshPhysicalMaterial({ color: "#6b7280", metalness: 1, roughness: 0.3, envMapIntensity: 1.1 });
  const matTecla = new THREE.MeshStandardMaterial({ color: "#10141c", metalness: 0.2, roughness: 0.7 });
  const matOuro = new THREE.MeshPhysicalMaterial({ color: "#ffc23a", metalness: 1, roughness: 0.22, envMapIntensity: 1.4, clearcoat: 0.6 });

  const telaMat = (aspect, raio) => new THREE.ShaderMaterial({
    uniforms: {
      uA: { value: null }, uB: { value: null }, uMix: { value: 0 }, uAspect: { value: aspect }, uRaio: { value: raio },
      uLuz: { value: 1 }, uTemA: { value: 0 }, uTemB: { value: 0 }, uAlpha: { value: 1 },
      uEscA: { value: new THREE.Vector2(1, 1) }, uEscB: { value: new THREE.Vector2(1, 1) },
      uBorda: { value: new THREE.Color("#ffd1a6") }, uBordaK: { value: 0 },
    },
    vertexShader: VERT, fragmentShader: TELA_FRAG, transparent: true, extensions: { derivatives: true },
  });
  const porNaTela = (u, slot, tex, telaAsp, texAsp) => {
    u[slot === "A" ? "uA" : "uB"].value = tex; u[slot === "A" ? "uTemA" : "uTemB"].value = tex ? 1 : 0;
    const e = u[slot === "A" ? "uEscA" : "uEscB"].value;
    if (texAsp > telaAsp) e.set(telaAsp / texAsp, 1); else e.set(1, texAsp / telaAsp);
  };

  // ---------- celular: corpo extrudado com cantos de verdade, vidro, câmeras e botões ----------
  const CEL = { w: 0.76, h: 1.62, r: 0.125, d: 0.05 };
  const TELA = { w: 0.708, h: 1.565 }, CEL_ASP = TELA.w / TELA.h;
  const celular = new THREE.Group();
  {
    const corpo = new THREE.Mesh(extrudar(CEL.w, CEL.h, CEL.r, CEL.d, 0.012, leve ? 14 : 28), matAro);
    const frente = new THREE.Mesh(new THREE.ShapeGeometry(retArred(CEL.w - 0.004, CEL.h - 0.004, CEL.r - 0.002), 24), matVidro);
    frente.position.z = CEL.d / 2 + 0.0125;
    const tras = new THREE.Mesh(new THREE.ShapeGeometry(retArred(CEL.w - 0.01, CEL.h - 0.01, CEL.r - 0.005), 24), matTraseira);
    tras.position.z = -CEL.d / 2 - 0.0125; tras.rotation.y = Math.PI;
    const ilha = new THREE.Mesh(extrudar(0.27, 0.27, 0.07, 0.016, 0.006, 12), matAro);
    ilha.position.set(0.17, 0.6, -CEL.d / 2 - 0.02);
    const lenteG = new THREE.CylinderGeometry(0.045, 0.05, 0.022, 28);
    [[0.12, 0.65], [0.22, 0.65], [0.12, 0.55]].forEach(([x, y]) => { const l = new THREE.Mesh(lenteG, matVidro); l.rotation.x = Math.PI / 2; l.position.set(x, y, -CEL.d / 2 - 0.035); celular.add(l); });
    const botaoG = new THREE.BoxGeometry(0.012, 0.16, 0.02);
    [[-1, 0.38], [-1, 0.16], [1, 0.3]].forEach(([s, y]) => { const b = new THREE.Mesh(botaoG, matAro); b.position.set(s * (CEL.w / 2 + 0.016), y, 0); celular.add(b); });
    celular.add(corpo, frente, tras, ilha);
  }
  const celTelaMat = telaMat(CEL_ASP, 0.068), celU = celTelaMat.uniforms;
  const celTela = new THREE.Mesh(new THREE.PlaneGeometry(TELA.w, TELA.h), celTelaMat);
  celTela.position.z = CEL.d / 2 + 0.0135; celTela.renderOrder = 4;
  celular.add(celTela);
  raiz.add(celular);

  // estilhaços (uma malha só, animada no shader)
  const cacosU = { uP: { value: 0 }, uMap: { value: null } };
  const cacos = (() => {
    const nx = leve ? 9 : 12, ny = leve ? 20 : 26, pos = [], uv = [], cen = [], dir = [], rot = [], idx = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x0 = -TELA.w / 2 + (i / nx) * TELA.w, x1 = x0 + TELA.w / nx, y0 = -TELA.h / 2 + (j / ny) * TELA.h, y1 = y0 + TELA.h / ny;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, b = pos.length / 3, r = () => Math.random() - 0.5;
      const d = [cx * 2.2 + r() * 0.8, cy * 1.4 + r() * 0.8, 0.8 + Math.random() * 1.6], ro = [r(), r(), r(), 0.6 + Math.random()];
      [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([x, y]) => {
        pos.push(x, y, 0); uv.push((x + TELA.w / 2) / TELA.w, (y + TELA.h / 2) / TELA.h); cen.push(cx, cy, 0); dir.push(...d); rot.push(...ro);
      });
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("aCentro", new THREE.Float32BufferAttribute(cen, 3)); g.setAttribute("aDir", new THREE.Float32BufferAttribute(dir, 3));
    g.setAttribute("aRot", new THREE.Float32BufferAttribute(rot, 4)); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: cacosU, vertexShader: CACO_VERT, fragmentShader: CACO_FRAG, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.frustumCulled = false; m.visible = false; m.renderOrder = 8; raiz.add(m); return m;
  })();

  // ---------- notebook: fino, alumínio, teclado de verdade e a marca na tampa ----------
  const NB = { w: 2.6, d: 1.76, base: 0.045, tampa: 1.66 };
  const NB_TELA = { w: 2.46, h: 1.5375 }, NB_ASP = NB_TELA.w / NB_TELA.h;
  const notebook = new THREE.Group(), dobradica = new THREE.Group();
  const nbTelaMat = telaMat(NB_ASP, 0.02), nbU = nbTelaMat.uniforms;
  const matAluClaro = new THREE.MeshPhysicalMaterial({ color: "#c8cdd5", metalness: 1, roughness: 0.34, envMapIntensity: 1.15, clearcoat: 0.2 });
  {
    const teclas = (() => {
      const c = canvas(1024, 400), x = c.getContext("2d");
      x.fillStyle = "#b9bec7"; x.fillRect(0, 0, 1024, 400);
      const linhas = [14, 14, 13, 12, 11], kh = 58;
      linhas.forEach((n, r) => { const kw = (1000 - (n - 1) * 8) / n; for (let i = 0; i < n; i++) { const larg = r === 4 && i === 5 ? kw * 5 : kw; if (r === 4 && i > 5 && i < 10) continue; x.fillStyle = "#16181c"; rr(x, 12 + i * (kw + 8), 14 + r * (kh + 10), larg, kh, 9); x.fill(); x.fillStyle = "rgba(255,255,255,.05)"; rr(x, 14 + i * (kw + 8), 16 + r * (kh + 10), larg - 4, 10, 6); x.fill(); } });
      return texCanvas(c);
    })();
    const marcaTampa = (() => {
      const c = canvas(256, 256), x = c.getContext("2d"); x.strokeStyle = "rgba(255,255,255,.75)"; x.lineWidth = 7;
      x.beginPath(); x.arc(128, 128, 96, 0, Math.PI * 2); x.stroke();
      x.save(); x.beginPath(); x.arc(128, 128, 99, 0, Math.PI * 2); x.clip();
      for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(128 + i * 30, 128, 96, Math.PI * 0.5, Math.PI * 1.5); x.stroke(); }
      x.restore(); return texCanvas(c);
    })();
    const base = new THREE.Mesh(extrudar(NB.w, NB.d, 0.1, NB.base, 0.01, 18), matAluClaro); base.rotation.x = -Math.PI / 2;
    const deck = new THREE.Mesh(new THREE.ShapeGeometry(retArred(2.24, 0.86, 0.04), 10), new THREE.MeshStandardMaterial({ map: teclas, roughness: 0.6, metalness: 0.3 }));
    deck.rotation.x = -Math.PI / 2; deck.position.set(0, NB.base / 2 + 0.011, -0.3);
    const touch = new THREE.Mesh(new THREE.ShapeGeometry(retArred(1.0, 0.56, 0.05), 12), new THREE.MeshPhysicalMaterial({ color: "#d9dde3", metalness: 0.9, roughness: 0.2, clearcoat: 1, envMapIntensity: 1.1 }));
    touch.rotation.x = -Math.PI / 2; touch.position.set(0, NB.base / 2 + 0.0115, 0.45);
    dobradica.position.set(0, NB.base / 2 + 0.006, -NB.d / 2 + 0.035);
    const eixo = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, NB.w * 0.82, 16), new THREE.MeshStandardMaterial({ color: "#2a2d33", metalness: 0.8, roughness: 0.4 }));
    eixo.rotation.z = Math.PI / 2;
    const tampa = new THREE.Mesh(extrudar(NB.w, NB.tampa, 0.08, 0.014, 0.006, 18), matAluClaro); tampa.position.set(0, NB.tampa / 2, 0);
    const moldura = new THREE.Mesh(new THREE.ShapeGeometry(retArred(NB.w - 0.02, NB.tampa - 0.02, 0.07), 18), matVidro); moldura.position.set(0, NB.tampa / 2, 0.0145);
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(NB_TELA.w, NB_TELA.h), nbTelaMat); tela.position.set(0, NB.tampa / 2 + 0.01, 0.0155); tela.renderOrder = 4;
    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), new THREE.MeshBasicMaterial({ color: "#1d2533" })); cam.position.set(0, NB.tampa - 0.04, 0.016);
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), new THREE.MeshBasicMaterial({ map: marcaTampa, transparent: true }));
    logo.position.set(0, NB.tampa / 2, -0.0145); logo.rotation.y = Math.PI;
    dobradica.add(eixo, tampa, moldura, tela, cam, logo);
    notebook.add(base, deck, touch, dobradica);
  }
  raiz.add(notebook);

  // ---------- café: xícara, pires, líquido girando, colher mexendo e vapor ----------
  const cafe = new THREE.Group(); cafe.visible = false; raiz.add(cafe);
  const cafeU = { uT: { value: 0 }, uMexe: { value: 0 } };
  const colher = new THREE.Group();
  {
    const matLouca = new THREE.MeshPhysicalMaterial({ color: "#f4f0ea", roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1, side: THREE.DoubleSide });
    const perfil = [[0, 0], [0.36, 0], [0.4, 0.03], [0.45, 0.2], [0.5, 0.5], [0.53, 0.68], [0.535, 0.71], [0.515, 0.71], [0.49, 0.66], [0.46, 0.46], [0.41, 0.2], [0.36, 0.07], [0, 0.07]].map(([x, y]) => new THREE.Vector2(x, y));
    const xicara = new THREE.Mesh(new THREE.LatheGeometry(perfil, leve ? 64 : 128), matLouca);
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 20, 48, Math.PI * 1.25), matLouca);
    alca.position.set(0.52, 0.38, 0); alca.rotation.set(0, 0, -Math.PI * 0.62);
    const pires = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.78, 0], [0.9, 0.05], [0.93, 0.08], [0.86, 0.075], [0.58, 0.03], [0, 0.03]].map(([x, y]) => new THREE.Vector2(x, y)), leve ? 64 : 128), matLouca);
    pires.position.y = -0.03;
    const liquido = new THREE.Mesh(new THREE.CircleGeometry(0.5, leve ? 64 : 128, 0, Math.PI * 2), new THREE.ShaderMaterial({ uniforms: cafeU, vertexShader: CAFE_VERT, fragmentShader: CAFE_FRAG }));
    liquido.rotation.x = -Math.PI / 2; liquido.position.y = 0.6; liquido.scale.setScalar(0.98);
    const matInox = new THREE.MeshPhysicalMaterial({ color: "#d7dbe0", metalness: 1, roughness: 0.15, envMapIntensity: 1.3 });
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.014, 0.78, 20), matInox); cabo.position.y = 0.4; cabo.scale.set(1.7, 1, 0.5);
    const concha = new THREE.Mesh(new THREE.SphereGeometry(0.07, 28, 18), matInox); concha.scale.set(1, 0.42, 1.45);
    colher.add(cabo, concha); colher.position.y = 0.58;
    // sombra de contato sob o pires: sem ela a xícara parece flutuar
    const somb = (() => { const c = canvas(128, 128), x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(0,0,0,.6)"); g.addColorStop(0.55, "rgba(0,0,0,.28)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return texCanvas(c); })();
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({ map: somb, transparent: true, depthWrite: false, toneMapped: false }));
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = -0.04;
    cafe.add(sombra, pires, xicara, alca, liquido, colher);
  }
  const NV = 48, vaporPos = new Float32Array(NV * 3), vaporSem = Array.from({ length: NV }, () => Math.random());
  const vaporGeo = new THREE.BufferGeometry(); vaporGeo.setAttribute("position", new THREE.BufferAttribute(vaporPos, 3));
  const vaporTex = (() => { const c = canvas(64, 64), x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return texCanvas(c); })();
  const vapor = new THREE.Points(vaporGeo, new THREE.PointsMaterial({ size: 0.46, map: vaporTex, transparent: true, depthWrite: false, opacity: 0.3 }));
  vapor.frustumCulled = false; cafe.add(vapor);

  // ---------- dinheiro: moedas e notas ----------
  const NM = leve ? 34 : 60, NN = leve ? 22 : 40;
  const moedas = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.075, 0.075, 0.014, 28), matOuro, NM);
  const notaTex = (() => {
    const c = canvas(256, 120), x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 256, 120);
    g.addColorStop(0, "#1f9d55"); g.addColorStop(1, "#0f6b39"); x.fillStyle = g; rr(x, 0, 0, 256, 120, 10); x.fill();
    x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 4; rr(x, 8, 8, 240, 104, 8); x.stroke();
    x.fillStyle = "#e9ffe9"; x.font = "800 46px Schibsted Grotesk, sans-serif"; x.textAlign = "center"; x.fillText("R$ 100", 128, 76);
    return texCanvas(c);
  })();
  const notas = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.3, 0.14), new THREE.MeshStandardMaterial({ map: notaTex, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.05 }), NN);
  moedas.visible = notas.visible = false; moedas.frustumCulled = notas.frustumCulled = false;
  raiz.add(moedas, notas);
  const semente = Array.from({ length: Math.max(NM, NN) }, () => [Math.random(), Math.random(), Math.random(), Math.random()]);
  const mtx = new THREE.Matrix4(), qq = new THREE.Quaternion(), ee = new THREE.Euler(), vv = new THREE.Vector3(), ss = new THREE.Vector3();

  // ---------- telas desenhadas em canvas ----------
  // tela do celular: desenhada em 432×936 (80%) com coordenadas lógicas 540×1170
  const IG = canvas(432, 936), igx = IG.getContext("2d"), igT = texCanvas(IG);
  const W = 540, H = 1170;
  let quadro = 0;
  function cobrir(x, el, dx, dy, dw, dh, recorte) {
    if (!pronto(el)) return false;
    const sw = el.videoWidth || el.naturalWidth || el.width, sh = el.videoHeight || el.naturalHeight || el.height;
    let sx = 0, sy = 0, cw = sw, ch = sh;
    if (recorte) { sy = sh * recorte[0]; ch = sh * (recorte[1] - recorte[0]); }
    const ra = dw / dh, rs = cw / ch;
    if (rs > ra) { const nw = ch * ra; sx += (cw - nw) / 2; cw = nw; } else { const nh = cw / ra; sy += (ch - nh) / 2; ch = nh; }
    try { x.drawImage(el, sx, sy, cw, ch, dx, dy, dw, dh); } catch { return false; }
    return true;
  }
  // interface do Reels: barra de status, título, coluna de ações, usuário, legenda, áudio, abas
  function desenharIG(o) {
    const x = igx;
    x.setTransform(0.8, 0, 0, 0.8, 0, 0);
    x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
    if (o.fundo) o.fundo(x);
    else if (!cobrir(x, o.fonte, 0, 0, W, H, o.recorte)) { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#26282e"); g.addColorStop(1, "#0c0d10"); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    let g = x.createLinearGradient(0, 0, 0, 190); g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, 190);
    g = x.createLinearGradient(0, H - 470, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.72)"); x.fillStyle = g; x.fillRect(0, H - 470, W, 470);
    x.textAlign = "left";
    x.fillStyle = "#fff"; x.font = "600 26px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText("9:41", 46, 52);
    x.fillStyle = "#000"; rr(x, W / 2 - 64, 22, 128, 38, 19); x.fill();
    x.fillStyle = "#fff"; rr(x, W - 92, 34, 44, 20, 5); x.fill(); x.fillRect(W - 46, 40, 4, 8);
    for (let i = 0; i < 4; i++) x.fillRect(W - 150 + i * 10, 52 - i * 6, 7, 6 + i * 6);
    x.font = "700 40px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText("Reels", 36, 128); ICO.camera(x, W - 52, 116);
    const cx = W - 52; let y = H - 640;
    const cont = (txt) => { x.fillStyle = "#fff"; x.font = "600 22px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.textAlign = "center"; x.fillText(txt, cx, y + 44); x.textAlign = "left"; };
    ICO.coracao(x, cx, y, 46, o.curtido, "#ff3040"); if (o.curtidas != null) cont(fmt(o.curtidas)); y += 112;
    ICO.comentario(x, cx, y, 44); if (o.comentarios != null) cont(fmt(o.comentarios)); y += 112;
    ICO.enviar(x, cx, y, 44); if (o.envios != null) cont(fmt(o.envios)); y += 100;
    ICO.mais(x, cx, y); y += 70;
    x.fillStyle = "#333"; rr(x, cx - 22, y - 22, 44, 44, 9); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 3; rr(x, cx - 22, y - 22, 44, 44, 9); x.stroke();
    const by = H - 300;
    if (o.cta) {
      x.fillStyle = "#0095f6"; rr(x, 28, by - 84, W - 120, 62, 12); x.fill();
      x.fillStyle = "#fff"; x.font = "700 26px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText(o.cta, 50, by - 43); x.fillText("›", W - 124, by - 43);
      if (o.toque > 0) {
        const k = o.toque, tx = W / 2 - 30, ty = by - 53;
        x.save(); rr(x, 28, by - 84, W - 120, 62, 12); x.clip();
        x.fillStyle = `rgba(255,255,255,${0.35 * (1 - k)})`; x.beginPath(); x.arc(tx, ty, 30 + k * 300, 0, Math.PI * 2); x.fill(); x.restore();
        x.fillStyle = `rgba(255,255,255,${0.55 * Math.sin(Math.min(1, k * 1.6) * Math.PI)})`; x.beginPath(); x.arc(tx, ty, 34, 0, Math.PI * 2); x.fill();
      }
    }
    x.fillStyle = o.corAvatar || "#ff4d2e"; x.beginPath(); x.arc(56, by, 26, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#fff"; x.font = "700 26px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; const u = o.usuario || "seu.perfil"; x.fillText(u, 96, by + 9);
    const wu = x.measureText(u).width;
    if (!o.patrocinado) { x.strokeStyle = "#fff"; x.lineWidth = 2; rr(x, 110 + wu, by - 20, 112, 40, 9); x.stroke(); x.font = "600 22px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText(o.seguindo ? "Seguindo" : "Seguir", 124 + wu, by + 8); }
    else { x.font = "400 20px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillStyle = "rgba(255,255,255,.85)"; x.fillText("Patrocinado", 96, by + 36); }
    x.fillStyle = "#fff"; x.font = "400 24px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText((o.legenda || "").slice(0, 34), 36, by + 74);
    x.font = "400 22px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.fillText("♫  " + (o.audio || "Áudio original"), 36, by + 116);
    x.fillStyle = "#000"; x.fillRect(0, H - 104, W, 104);
    x.strokeStyle = "#fff"; x.lineWidth = 3;
    const ab = [W * 0.1, W * 0.3, W * 0.5, W * 0.7, W * 0.9], ay = H - 58;
    x.beginPath(); x.moveTo(ab[0] - 16, ay + 14); x.lineTo(ab[0] - 16, ay - 4); x.lineTo(ab[0], ay - 18); x.lineTo(ab[0] + 16, ay - 4); x.lineTo(ab[0] + 16, ay + 14); x.closePath(); x.stroke();
    x.beginPath(); x.arc(ab[1] - 2, ay - 2, 13, 0, Math.PI * 2); x.moveTo(ab[1] + 8, ay + 8); x.lineTo(ab[1] + 17, ay + 17); x.stroke();
    rr(x, ab[2] - 16, ay - 16, 32, 32, 8); x.stroke(); x.beginPath(); x.moveTo(ab[2], ay - 8); x.lineTo(ab[2], ay + 8); x.moveTo(ab[2] - 8, ay); x.lineTo(ab[2] + 8, ay); x.stroke();
    x.fillStyle = "#fff"; rr(x, ab[3] - 16, ay - 16, 32, 32, 8); x.fill(); x.fillStyle = "#000"; x.beginPath(); x.moveTo(ab[3] - 5, ay - 8); x.lineTo(ab[3] + 8, ay); x.lineTo(ab[3] - 5, ay + 8); x.fill();
    x.beginPath(); x.arc(ab[4], ay, 15, 0, Math.PI * 2); x.stroke();
    x.fillStyle = "#fff"; rr(x, W / 2 - 70, H - 14, 140, 6, 3); x.fill();
    (o.coracoes || []).forEach((c) => { x.globalAlpha = Math.max(0, c.a); ICO.coracao(x, c.x, c.y, c.s, true, c.cor || "#ff3040"); x.globalAlpha = 1; });
    if (o.selo) { x.globalAlpha = o.selo.a; x.fillStyle = "#ff3040"; rr(x, W / 2 - 92, 300, 184, 54, 27); x.fill(); x.fillStyle = "#fff"; x.font = "800 26px -apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif"; x.textAlign = "center"; x.fillText(o.selo.txt, W / 2, 336); x.textAlign = "left"; x.globalAlpha = 1; }
    igT.needsUpdate = true;
  }

  // feed com reels de verdade: o atual toca sem som, o dedo passa e o próximo entra
  function desenharFeed(off) {
    const lista = midia.feed || [], n = lista.length || 1;
    const i0 = Math.floor(off), f = suave(off - i0), a = lista[((i0 % n) + n) % n] || {}, b = lista[(((i0 + 1) % n) + n) % n] || {};
    const va = tocar(a.v);
    desenharIG({
      usuario: a.conta || "seu.perfil", legenda: a.legenda || "", corAvatar: a.cor || "#6b7280",
      fundo: (x) => {
        x.save(); x.translate(0, -f * H);
        if (!cobrir(x, pronto(va) ? va : imgEl(a.poster), 0, 0, W, H)) { x.fillStyle = "#111"; x.fillRect(0, 0, W, H); }
        if (f > 0.001) cobrir(x, imgEl(b.poster), 0, H, W, H);
        x.restore();
      },
      selo: f > 0.05 && f < 0.95 ? { txt: "↑ pulou", a: Math.sin(f * Math.PI) } : null,
    });
  }

  // prévia do editor:  // prévia do editor: as camadas entram por cima de um clipe cru (o vídeo é arrastado pela rolagem)
  const LEG = ["o", "jato", "e", "o", "refluxo", "saem", "da", "física"];
  function desenharEdicao(p, cam, el) {
    const x = igx; x.setTransform(0.8, 0, 0, 0.8, 0, 0); x.fillStyle = "#050608"; x.fillRect(0, 0, W, H); x.textAlign = "left";
    if (cam[0] > 0) { x.globalAlpha = cam[0]; cobrir(x, el, 0, 0, W, H, [0.27, 0.6]); x.globalAlpha = 1; }
    else if (p < 0.12) { x.fillStyle = "rgba(255,255,255,.35)"; x.font = "500 28px Schibsted Grotesk, sans-serif"; x.textAlign = "center"; x.fillText("linha do tempo vazia", W / 2, H / 2); x.textAlign = "left"; }
    else { x.strokeStyle = "rgba(143,211,255,.12)"; x.lineWidth = 1; for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo((i * W) / 6, 0); x.lineTo((i * W) / 6, H); x.stroke(); } for (let i = 1; i < 12; i++) { x.beginPath(); x.moveTo(0, (i * H) / 12); x.lineTo(W, (i * H) / 12); x.stroke(); } }
    if (cam[1] > 0) {
      x.globalAlpha = cam[1]; x.textAlign = "center"; x.lineJoin = "round";
      ["ESSE SANGUE", "NÃO DEVERIA", "VOLTAR."].forEach((l, i) => { x.font = `800 62px Anybody, "Arial Narrow", sans-serif`; x.strokeStyle = "#000"; x.lineWidth = 12; x.strokeText(l, W / 2, 230 + i * 72); x.fillStyle = i === 2 ? "#ff4d6e" : "#fff"; x.fillText(l, W / 2, 230 + i * 72); });
      x.textAlign = "left"; x.globalAlpha = 1;
    }
    if (cam[2] > 0) {
      x.globalAlpha = cam[2]; const k = Math.floor(p * 40) % LEG.length, frase = LEG.slice(Math.max(0, k - 2), k + 1);
      x.font = "800 44px Schibsted Grotesk, sans-serif"; const tw = x.measureText(frase.join(" ")).width;
      x.fillStyle = "rgba(0,0,0,.55)"; rr(x, W / 2 - tw / 2 - 22, H - 470, tw + 44, 70, 14); x.fill();
      let c0 = W / 2 - tw / 2;
      frase.forEach((w, i) => { x.fillStyle = i === frase.length - 1 ? "#ffe14d" : "#fff"; x.fillText(w, c0, H - 422); c0 += x.measureText(w + " ").width; });
      x.globalAlpha = 1;
    }
    if (cam[3] > 0) {
      x.globalAlpha = cam[3]; const b = Math.abs(Math.sin(p * 60));
      for (let i = 0; i < 18; i++) { const h = 8 + Math.abs(Math.sin(i * 1.7 + p * 50)) * 40 * (0.5 + b * 0.5); x.fillStyle = "#ffb547"; x.fillRect(40 + i * 12, H - 180 - h / 2, 6, h); }
      x.fillStyle = "#fff"; x.font = "600 24px Schibsted Grotesk, sans-serif"; x.fillText("♫ trilha + efeitos", 270, H - 172); x.globalAlpha = 1;
    }
    if (cam[4] > 0) {
      x.globalAlpha = cam[4]; x.fillStyle = "#ff4d2e"; rr(x, 70, H - 330, W - 140, 86, 43); x.fill();
      x.fillStyle = "#0a1220"; x.font = "800 34px Schibsted Grotesk, sans-serif"; x.textAlign = "center"; x.fillText("Comenta A ou B 👇", W / 2, H - 274); x.textAlign = "left"; x.globalAlpha = 1;
    }
    x.fillStyle = "rgba(255,77,46,.95)"; x.beginPath(); x.arc(46, 52, 9, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#fff"; x.font = "600 22px Schibsted Grotesk, sans-serif"; x.fillText("PRÉVIA", 64, 60);
    igT.needsUpdate = true;
  }

  // site genérico que perde o visitante
  const siteC = canvas(960, 600), sx = siteC.getContext("2d"), siteT = texCanvas(siteC);
  function desenharSite(p, t) {
    const x = sx, w = siteC.width, h = siteC.height;
    x.textAlign = "left";
    x.fillStyle = "#e9ebef"; x.fillRect(0, 0, w, h); x.fillStyle = "#cfd3da"; x.fillRect(0, 0, w, 30);
    x.fillStyle = "#fff"; rr(x, 90, 6, 520, 18, 9); x.fill(); x.fillStyle = "#8a909b"; x.font = "11px Schibsted Grotesk, sans-serif"; x.fillText("www.seunegocio.com.br", 104, 19);
    if (p < 0.25) {
      const a = t * 5; x.strokeStyle = "#9aa1ad"; x.lineWidth = 6; x.beginPath(); x.arc(w / 2, h / 2, 34, a, a + 4.2); x.stroke();
      x.fillStyle = "#9aa1ad"; x.font = "600 18px Schibsted Grotesk, sans-serif"; x.textAlign = "center"; x.fillText("Carregando…", w / 2, h / 2 + 72); x.textAlign = "left";
      x.fillStyle = "#7f8794"; x.fillRect(0, h - 6, w * (0.12 + p * 2), 6);
    } else {
      x.fillStyle = "#3d4250"; x.fillRect(0, 30, w, 46);
      for (let i = 0; i < 9; i++) { x.fillStyle = "#aab0bb"; x.fillRect(260 + i * 74, 49, 52, 7); }
      x.fillStyle = "#c3c8d0"; x.fillRect(30, 96, w - 60, 200); x.fillStyle = "#a9afb9"; x.font = "700 20px Schibsted Grotesk, sans-serif"; x.textAlign = "center"; x.fillText("BEM-VINDO AO NOSSO SITE", w / 2, 190); x.textAlign = "left";
      for (let c = 0; c < 3; c++) for (let l = 0; l < 9; l++) { x.fillStyle = "#c5cad2"; x.fillRect(40 + c * 300, 320 + l * 16, 240 - (l % 3) * 30, 6); }
      x.fillStyle = "rgba(20,24,32,.88)"; rr(x, w - 300, h - 150, 270, 120, 10); x.fill(); x.fillStyle = "#fff"; x.font = "12px Schibsted Grotesk, sans-serif"; x.fillText("Usamos cookies para melhorar…", w - 284, h - 118);
      x.fillStyle = "#5b6070"; rr(x, 40, h - 110, 210, 70, 10); x.fill(); x.fillStyle = "#fff"; x.fillText("Assine nossa newsletter!", 56, h - 72);
      if (p > 0.5) {
        const q = faixa(p, 0.52, 0.78), cx = w * 0.5 + (w * 0.47 - w * 0.5) * q, cy = h * 0.6 + (14 - h * 0.6) * q;
        x.fillStyle = "#111"; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 14, cy + 36); x.lineTo(cx + 22, cy + 22); x.lineTo(cx + 38, cy + 18); x.closePath(); x.fill();
        if (p > 0.8) {
          x.globalAlpha = faixa(p, 0.8, 0.9); x.fillStyle = "#fff"; x.fillRect(0, 30, w, h - 30);
          x.fillStyle = "#1a0dab"; x.font = "600 20px Schibsted Grotesk, sans-serif"; x.fillText("Concorrente · o que você procura", 60, 120);
          x.fillStyle = "#4d5156"; x.font = "14px Schibsted Grotesk, sans-serif"; x.fillText("concorrente.com.br — Fale com a gente pelo WhatsApp", 60, 146);
          for (let l = 0; l < 4; l++) { x.fillStyle = "#dfe1e5"; x.fillRect(60, 200 + l * 70, 600, 10); x.fillRect(60, 220 + l * 70, 420, 8); }
          x.globalAlpha = 1;
        }
      }
    }
    siteT.needsUpdate = true;
  }

  // o site da CrossHard sendo construído (k de 0 a 5): mensagem → design → conteúdo → celular → ação
  const obraC = canvas(1008, 630), ox = obraC.getContext("2d"), obraT = texCanvas(obraC);
  const obraCelC = canvas(432, 936), ocx = obraCelC.getContext("2d"), obraCelT = texCanvas(obraCelC);
  const FONTE = '"Roboto Flex", "Arial Black", Anybody, sans-serif';
  function desenharObra(k, t, ehCel) {
    const x = ehCel ? ocx : ox, w = ehCel ? 540 : 1008, h = ehCel ? 1170 : 630;
    if (ehCel) x.setTransform(0.8, 0, 0, 0.8, 0, 0);
    const design = clamp(k - 1), conteudo = clamp(k - 2), acao = clamp(k - 4);
    x.textAlign = "left";
    x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h);
    if (design > 0) { x.globalAlpha = design; x.fillStyle = "#0b0f14"; x.fillRect(0, 0, w, h); x.globalAlpha = 1; }
    // conteúdo: a foto da sala de musculação entra por trás, escurecida
    if (conteudo > 0) { x.globalAlpha = conteudo; cobrir(x, imgEl(midia.ch?.foto), 0, 0, w, h); x.fillStyle = "rgba(6,9,14,.62)"; x.fillRect(0, 0, w, h); x.globalAlpha = 1; }
    // design: a faixa azul em diagonal com BUILD YOUR BODY
    if (design > 0) {
      x.save(); x.globalAlpha = design; x.translate(w / 2, ehCel ? 170 : 70); x.rotate(-0.06);
      x.fillStyle = "#1e6bff"; x.fillRect(-w, -26, w * 2, 52);
      x.fillStyle = "#fff"; x.font = `italic 900 ${ehCel ? 30 : 28}px ${FONTE}`; x.textAlign = "center";
      x.fillText("BUILD YOUR BODY  •  BUILD YOUR BODY  •  BUILD YOUR BODY", -((t * 40) % 120), 10); x.restore();
      x.globalAlpha = design; const lg = imgEl(midia.ch?.logo); if (pronto(lg)) x.drawImage(lg, 28, ehCel ? 40 : 18, ehCel ? 150 : 120, (ehCel ? 150 : 120) * 0.67); x.globalAlpha = 1;
    }
    // mensagem: digitada na primeira camada (sem estilo), depois pesada e em caixa alta
    const linhaA = "Construa", linhaB = "seu corpo", n = Math.floor(clamp(k) * (linhaA.length + linhaB.length));
    const ta = linhaA.slice(0, n), tb = linhaB.slice(0, Math.max(0, n - linhaA.length));
    const cx = w / 2, ty = ehCel ? h * 0.36 : h * 0.44, tam = ehCel ? 96 : 92;
    x.textAlign = design > 0.5 ? "center" : "left";
    if (design > 0.5) { x.font = `italic 900 ${tam}px ${FONTE}`; x.fillStyle = "#ffffff"; x.fillText(ta.toUpperCase(), cx, ty); x.fillText(tb.toUpperCase(), cx, ty + tam * 0.95); x.font = `italic 700 ${tam * 0.4}px ${FONTE}`; x.fillStyle = "#1e6bff"; x.fillText("build your body", cx, ty + tam * 1.5); }
    else { x.font = `400 ${tam * 0.6}px "Times New Roman", serif`; x.fillStyle = "#000"; x.fillText(ta, 40, ty); x.fillText(tb, 40, ty + tam * 0.65); if (Math.floor(t * 2) % 2 && k < 1) { const ww = x.measureText(n > linhaA.length ? tb : ta).width; x.fillRect(44 + ww, (n > linhaA.length ? ty + tam * 0.65 : ty) - tam * 0.45, 4, tam * 0.55); } }
    x.textAlign = "center";
    if (conteudo > 0) { x.globalAlpha = conteudo; x.fillStyle = "rgba(255,255,255,.86)"; x.font = `400 ${ehCel ? 26 : 18}px Schibsted Grotesk, sans-serif`; x.fillText("Sete modalidades, uma equipe que sabe o seu nome.", cx, ty + tam * (ehCel ? 2.05 : 1.95)); x.globalAlpha = 1; }
    // ação: os dois botões, o principal pulsando, e o cursor que clica
    if (acao > 0) {
      const bw = ehCel ? 380 : 300, bh = ehCel ? 84 : 54, by = ty + tam * (ehCel ? 2.4 : 2.25), pul = 1 + Math.sin(t * 6) * 0.04 * acao;
      x.save(); x.translate(ehCel ? cx : cx - bw * 0.55, by + bh / 2); x.scale(pul, pul); x.globalAlpha = acao;
      x.shadowColor = "rgba(30,107,255,.85)"; x.shadowBlur = 30 * acao; x.fillStyle = "#1e6bff"; rr(x, -bw / 2, -bh / 2, bw, bh, bh / 2); x.fill(); x.shadowBlur = 0;
      x.fillStyle = "#fff"; x.font = `900 ${ehCel ? 26 : 19}px ${FONTE}`; x.fillText("AGENDAR MINHA VISITA", 0, ehCel ? 9 : 7); x.restore();
      if (!ehCel) { x.globalAlpha = acao; x.strokeStyle = "#fff"; x.lineWidth = 2; rr(x, cx + 20, by, 220, bh, bh / 2); x.stroke(); x.fillStyle = "#fff"; x.font = `900 17px ${FONTE}`; x.fillText("VER MODALIDADES", cx + 130, by + 34);
        const q = clamp(acao * 1.4), px = w * 0.8 - q * (w * 0.8 - (cx - bw * 0.35)), py = h * 0.9 - q * (h * 0.9 - (by + bh * 0.6)); x.globalAlpha = 1; x.fillStyle = "#fff"; x.strokeStyle = "#000"; x.lineWidth = 2; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 12, py + 30); x.lineTo(px + 18, py + 19); x.lineTo(px + 31, py + 15); x.closePath(); x.fill(); x.stroke(); }
      x.globalAlpha = 1;
    }
    if (design < 1) { x.globalAlpha = 0.3 * (1 - design); x.strokeStyle = "#5fb8ff"; x.lineWidth = 1; for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo((i * w) / 12, 0); x.lineTo((i * w) / 12, h); x.stroke(); } x.globalAlpha = 1; }
    (ehCel ? obraCelT : obraT).needsUpdate = true;
  }

  // conversa no WhatsApp  // conversa no WhatsApp
  const chatC = canvas(432, 936), chx = chatC.getContext("2d"), chatT = texCanvas(chatC);
  const UIF = "-apple-system, SF Pro Text, Roboto, Segoe UI, sans-serif";
  // papel de parede do WhatsApp (traços miúdos), desenhado uma vez
  const papel = (() => {
    const c = canvas(540, 1170), x = c.getContext("2d"); x.fillStyle = "#0b141a"; x.fillRect(0, 0, 540, 1170);
    x.strokeStyle = "rgba(255,255,255,.045)"; x.lineWidth = 2.2; x.lineCap = "round";
    for (let i = 0; i < 170; i++) {
      const cx = (i * 97.3) % 540, cy = (i * 61.7 + (i % 7) * 13) % 1170, k = i % 4; x.beginPath();
      if (k === 0) x.arc(cx, cy, 9, 0, Math.PI * 2); else if (k === 1) { x.moveTo(cx - 10, cy); x.lineTo(cx + 10, cy); x.moveTo(cx, cy - 10); x.lineTo(cx, cy + 10); }
      else if (k === 2) { x.moveTo(cx - 9, cy + 6); x.quadraticCurveTo(cx, cy - 12, cx + 9, cy + 6); } else rr(x, cx - 8, cy - 6, 16, 12, 3);
      x.stroke();
    }
    return c;
  })();
  const balao = (x, txt, yy, direita, hora, a = 1) => {
    x.font = `400 27px ${UIF}`; const linhas = []; let l = "";
    for (const w of txt.split(" ")) { if (x.measureText(l + w).width > 340) { linhas.push(l.trim()); l = ""; } l += w + " "; }
    linhas.push(l.trim());
    const tw = Math.max(...linhas.map((s) => x.measureText(s).width)), w = Math.max(tw + 36, 170) + (direita ? 40 : 0), h = linhas.length * 35 + 44;
    const xx = direita ? 540 - w - 26 : 26, sc = 0.85 + 0.15 * a;
    x.save(); x.globalAlpha = a; x.translate(direita ? xx + w : xx, yy); x.scale(sc, sc); x.translate(-(direita ? xx + w : xx), -yy);
    x.fillStyle = direita ? "#005c4b" : "#202c33"; rr(x, xx, yy, w, h, 16); x.fill();
    x.beginPath(); if (direita) { x.moveTo(xx + w - 14, yy); x.lineTo(xx + w + 14, yy); x.lineTo(xx + w, yy + 18); } else { x.moveTo(xx + 14, yy); x.lineTo(xx - 14, yy); x.lineTo(xx, yy + 18); } x.fill();
    x.fillStyle = "#e9edef"; linhas.forEach((s, i) => x.fillText(s, xx + 18, yy + 38 + i * 35));
    x.fillStyle = "rgba(233,237,239,.6)"; x.font = `400 19px ${UIF}`; x.textAlign = "right"; x.fillText(hora, xx + w - (direita ? 50 : 16), yy + h - 14); x.textAlign = "left";
    if (direita) { x.strokeStyle = "#53bdeb"; x.lineWidth = 2.6; x.lineCap = "round"; x.beginPath(); for (const d of [0, 9]) { x.moveTo(xx + w - 44 + d, yy + h - 22); x.lineTo(xx + w - 38 + d, yy + h - 16); x.lineTo(xx + w - 27 + d, yy + h - 29); } x.stroke(); }
    x.restore(); return h;
  };
  // q 0–0,22: a mensagem do site já vem escrita na caixa · 0,22: enviada · 0,34–0,56: digitando · 0,56: resposta · 0,78: agendamento
  const MSG = "Olá! Vim pelo site e quero saber mais.";
  function desenharChat(q, t) {
    const x = chx; x.setTransform(0.8, 0, 0, 0.8, 0, 0); x.textAlign = "left"; x.drawImage(papel, 0, 0);
    // barra de status e cabeçalho
    x.fillStyle = "#1f2c34"; x.fillRect(0, 0, 540, 172);
    x.fillStyle = "#e9edef"; x.font = `600 26px ${UIF}`; x.fillText("9:41", 46, 52); x.fillStyle = "#000"; rr(x, 206, 22, 128, 38, 19); x.fill();
    x.fillStyle = "#e9edef"; rr(x, 448, 34, 44, 20, 5); x.fill(); x.fillRect(494, 40, 4, 8); for (let i = 0; i < 4; i++) x.fillRect(390 + i * 10, 52 - i * 6, 7, 6 + i * 6);
    x.strokeStyle = "#e9edef"; x.lineWidth = 3.4; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath(); x.moveTo(40, 104); x.lineTo(26, 120); x.lineTo(40, 136); x.stroke();
    const g = x.createLinearGradient(64, 92, 116, 148); g.addColorStop(0, "#5aa8ff"); g.addColorStop(1, "#1f5fd6"); x.fillStyle = g; x.beginPath(); x.arc(88, 120, 28, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#fff"; x.font = `700 24px ${UIF}`; x.textAlign = "center"; x.fillText("SN", 88, 129); x.textAlign = "left";
    const digitando = q > 0.34 && q < 0.56;
    x.fillStyle = "#e9edef"; x.font = `600 28px ${UIF}`; x.fillText("Seu negócio", 132, 114);
    x.fillStyle = digitando ? "#25d366" : "#8696a0"; x.font = `400 21px ${UIF}`; x.fillText(digitando ? "digitando…" : "online", 132, 144);
    x.strokeStyle = "#e9edef"; x.lineWidth = 2.8; rr(x, 398, 108, 34, 24, 6); x.stroke(); x.beginPath(); x.moveTo(432, 120); x.lineTo(446, 110); x.lineTo(446, 130); x.closePath(); x.stroke();
    x.beginPath(); x.arc(492, 118, 13, Math.PI * 0.6, Math.PI * 1.9); x.stroke();
    // etiqueta do dia
    x.fillStyle = "#182229"; rr(x, 220, 196, 100, 38, 10); x.fill(); x.fillStyle = "#8696a0"; x.font = `500 19px ${UIF}`; x.textAlign = "center"; x.fillText("HOJE", 270, 222); x.textAlign = "left";
    let y = 258;
    const ap = (a, b) => suave(faixa(q, a, b));
    if (q > 0.22) y += balao(x, MSG, y, true, "10:42", ap(0.22, 0.28)) + 16;
    if (digitando) {
      x.fillStyle = "#202c33"; rr(x, 26, y, 108, 58, 16); x.fill();
      for (let i = 0; i < 3; i++) { x.fillStyle = `rgba(233,237,239,${0.35 + 0.5 * Math.max(0, Math.sin(t * 7 - i * 0.9))})`; x.beginPath(); x.arc(56 + i * 24, y + 29, 7, 0, Math.PI * 2); x.fill(); }
    }
    if (q > 0.56) y += balao(x, "Oi! Que bom que veio. Me conta o que você procura?", y, false, "10:42", ap(0.56, 0.62)) + 16;
    if (q > 0.78) balao(x, "Quero agendar para esta semana.", y, true, "10:43", ap(0.78, 0.84));
    // caixa de mensagem: chega preenchida pelo link do site e é enviada
    x.fillStyle = "#0b141a"; x.fillRect(0, 1046, 540, 124);
    x.fillStyle = "#1f2c34"; rr(x, 18, 1060, 420, 70, 35); x.fill();
    const escrito = q < 0.22 ? MSG : "", brilho = q < 0.22 ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    x.fillStyle = escrito ? "#e9edef" : "#8696a0"; x.font = `400 25px ${UIF}`;
    x.save(); rr(x, 18, 1060, 420, 70, 35); x.clip(); x.fillText(escrito ? escrito.slice(0, 30) + "…" : "Mensagem", 40, 1104); x.restore();
    x.fillStyle = "#00a884"; x.beginPath(); x.arc(486, 1095, 36 + brilho * 4, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#fff"; x.beginPath();
    if (escrito) { x.moveTo(472, 1080); x.lineTo(506, 1095); x.lineTo(472, 1110); x.lineTo(478, 1095); x.closePath(); x.fill(); }
    else { rr(x, 478, 1076, 16, 28, 8); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 3; x.beginPath(); x.arc(486, 1096, 14, 0, Math.PI); x.moveTo(486, 1110); x.lineTo(486, 1118); x.stroke(); }
    x.fillStyle = "#fff"; rr(x, 200, 1156, 140, 6, 3); x.fill();
    chatT.needsUpdate = true;
  }

  // ---------- poses ----------
  // ---------- vista explodida: cada camada é uma placa com borda e etiqueta, presa à tela do aparelho ----------
  const placa = (cw, ch, w, h, cor, rotulo, nivel = 0) => {
    const c = canvas(cw, ch), x = c.getContext("2d"), t = texCanvas(c);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, opacity: 0 }));
    m.visible = false;
    const moldura = () => {
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
      x.strokeStyle = cor; x.lineWidth = 4; x.globalAlpha = 0.95; rr(x, 2, 2, cw - 4, ch - 4, 14); x.stroke();
      x.font = "700 " + Math.round(cw * 0.05) + "px Martian Mono, monospace"; const tw = x.measureText(rotulo).width;
      x.fillStyle = cor; const ly = 14 + nivel * cw * 0.1; rr(x, 14, ly, tw + 28, cw * 0.085, cw * 0.02); x.fill(); x.fillStyle = "#06090f"; x.textBaseline = "middle"; x.fillText(rotulo, 28, ly + cw * 0.0425); x.textBaseline = "alphabetic";
      x.restore();
    };
    return { c, x, t, m, moldura, cw, ch };
  };
  // reel: V1 vídeo · T1 título · TXT legenda · A1 som · FX chamada
  const RC = [["#3b82f6", "V1 · VÍDEO"], ["#ffb547", "T1 · TÍTULO"], ["#ffe14d", "TXT · LEGENDA"], ["#3ddc97", "A1 · SOM"], ["#ff4d2e", "FX · CHAMADA"]];
  const camReel = RC.map(([cor, r], i) => placa(270, 585, TELA.w, TELA.h, cor, r, i));
  const telaZ = CEL.d / 2 + 0.0135;
  camReel.forEach((k, i) => { k.m.renderOrder = 30 + i; celular.add(k.m); });
  function desenharCamadaReel(i, p, el) {
    const k = camReel[i], x = k.x, w = 540, h = 1170;
    x.setTransform(0.5, 0, 0, 0.5, 0, 0); x.clearRect(0, 0, w, h); x.textAlign = "center"; x.lineJoin = "round";
    if (i === 0) { if (el) cobrir(x, el, 0, 0, w, h, [0.27, 0.6]); else { x.fillStyle = "#0b1426"; x.fillRect(0, 0, w, h); } }
    if (i === 1) ["ESSE SANGUE", "NÃO DEVERIA", "VOLTAR."].forEach((l, j) => { x.font = `900 64px Anybody, "Arial Narrow", sans-serif`; x.strokeStyle = "#000"; x.lineWidth = 12; x.strokeText(l, w / 2, 230 + j * 74); x.fillStyle = j === 2 ? "#ff4d6e" : "#fff"; x.fillText(l, w / 2, 230 + j * 74); });
    if (i === 2) { const n = Math.floor(p * 40) % LEG.length, fr = LEG.slice(Math.max(0, n - 2), n + 1).join(" "); x.font = "800 46px Schibsted Grotesk, sans-serif"; const tw = x.measureText(fr).width; x.fillStyle = "rgba(0,0,0,.6)"; rr(x, w / 2 - tw / 2 - 22, h - 470, tw + 44, 72, 14); x.fill(); x.fillStyle = "#ffe14d"; x.fillText(fr, w / 2, h - 420); }
    if (i === 3) { for (let j = 0; j < 22; j++) { const hh = 14 + Math.abs(Math.sin(j * 1.7 + p * 50)) * 70; x.fillStyle = "#3ddc97"; x.fillRect(60 + j * 19, h / 2 - hh / 2, 10, hh); } x.fillStyle = "#fff"; x.font = "700 30px Schibsted Grotesk, sans-serif"; x.fillText("♫ trilha + efeitos", w / 2, h / 2 + 110); }
    if (i === 4) { x.fillStyle = "#ff4d2e"; rr(x, 70, h - 330, w - 140, 90, 45); x.fill(); x.fillStyle = "#0a1220"; x.font = "800 36px Schibsted Grotesk, sans-serif"; x.fillText("Comenta A ou B 👇", w / 2, h - 272); }
    x.textAlign = "left"; k.moldura(); k.t.needsUpdate = true;
  }
  // site: fundo e faixa · foto e texto · título · botões
  const SC = [["#1e6bff", "DESIGN"], ["#8fd3ff", "CONTEÚDO"], ["#ffffff", "MENSAGEM"], ["#3ddc97", "AÇÃO"]];
  const camSite = SC.map(([cor, r], i) => placa(504, 315, NB_TELA.w, NB_TELA.h, cor, r, i * 0.75));
  const nbTelaPos = new THREE.Vector3(0, NB.tampa / 2 + 0.01, 0.0155);
  camSite.forEach((k, i) => { k.m.renderOrder = 30 + i; dobradica.add(k.m); });
  const siteDesenhado = [false, false, false, false];
  function desenharCamadaSite(i, t) {
    const k = camSite[i], x = k.x, w = 1008, h = 630, ch = midia.ch || {}, F2 = FONTE;
    x.setTransform(0.5, 0, 0, 0.5, 0, 0); x.clearRect(0, 0, w, h); x.textAlign = "center";
    if (i === 0) { x.fillStyle = "#0b0f14"; x.fillRect(0, 0, w, h); x.save(); x.translate(w / 2, 70); x.rotate(-0.06); x.fillStyle = "#1e6bff"; x.fillRect(-w, -26, w * 2, 52); x.fillStyle = "#fff"; x.font = `italic 900 28px ${F2}`; x.fillText("BUILD YOUR BODY  •  BUILD YOUR BODY  •  BUILD YOUR BODY", -((t * 40) % 120), 10); x.restore(); const lg = imgEl(ch.logo); if (pronto(lg)) x.drawImage(lg, 28, 18, 120, 80); }
    if (i === 1) { x.globalAlpha = 0.9; cobrir(x, imgEl(ch.foto), 0, 0, w, h); x.fillStyle = "rgba(6,9,14,.55)"; x.fillRect(0, 0, w, h); x.globalAlpha = 1; x.fillStyle = "rgba(255,255,255,.9)"; x.font = "400 20px Schibsted Grotesk, sans-serif"; x.fillText("Sete modalidades, uma equipe que sabe o seu nome.", w / 2, h * 0.44 + 92 * 1.95); }
    if (i === 2) { const ty = h * 0.44; x.font = `italic 900 92px ${F2}`; x.fillStyle = "#fff"; x.fillText("CONSTRUA", w / 2, ty); x.fillText("SEU CORPO", w / 2, ty + 87); x.font = `italic 700 37px ${F2}`; x.fillStyle = "#1e6bff"; x.fillText("build your body", w / 2, ty + 138); }
    if (i === 3) { const by = h * 0.44 + 92 * 2.25; x.shadowColor = "rgba(30,107,255,.85)"; x.shadowBlur = 30; x.fillStyle = "#1e6bff"; rr(x, w / 2 - 300 * 0.55 - 150, by, 300, 54, 27); x.fill(); x.shadowBlur = 0; x.fillStyle = "#fff"; x.font = `900 19px ${F2}`; x.fillText("AGENDAR MINHA VISITA", w / 2 - 165, by + 34); x.strokeStyle = "#fff"; x.lineWidth = 2; rr(x, w / 2 + 20, by, 220, 54, 27); x.stroke(); x.font = `900 17px ${F2}`; x.fillText("VER MODALIDADES", w / 2 + 130, by + 34); }
    x.textAlign = "left"; k.moldura(); k.t.needsUpdate = true;
  }
  // grade escura: a "tela em branco" do notebook enquanto as camadas estão no ar
  const gradeC = canvas(504, 315), gx = gradeC.getContext("2d"), gradeT = texCanvas(gradeC);
  gx.fillStyle = "#0b0f14"; gx.fillRect(0, 0, 504, 315); gx.strokeStyle = "rgba(95,184,255,.16)"; gx.lineWidth = 1;
  for (let i = 1; i < 12; i++) { gx.beginPath(); gx.moveTo((i * 504) / 12, 0); gx.lineTo((i * 504) / 12, 315); gx.stroke(); }
  for (let i = 1; i < 8; i++) { gx.beginPath(); gx.moveTo(0, (i * 315) / 8); gx.lineTo(504, (i * 315) / 8); gx.stroke(); }
  gradeT.needsUpdate = true;
  // posição de cada placa: entra voando de longe, fica no ar em leque e, no fim, encaixa na tela
  function voar(k, i, base, chega, funde, t, esc) {
    const on = chega > 0.001 && funde < 0.999;
    k.m.visible = on; if (!on) return;
    const e = glide(chega), f = glide(funde);
    const xe = (i - 1.5) * 0.07 * esc, ye = 0.015 * i * esc + Math.sin(t * 1.3 + i) * 0.006 * esc, ze = (0.1 + i * 0.15) * esc;
    const x0 = xe + 0.9 * esc, y0 = ye + 0.35 * esc, z0 = ze + 1.8 * esc;
    k.m.position.set(base.x + (x0 + (xe - x0) * e) * (1 - f), base.y + (y0 + (ye - y0) * e) * (1 - f), base.z + 0.002 + (z0 + (ze - z0) * e) * (1 - f) + i * 0.0006);
    k.m.rotation.set(0, (1 - e) * 0.7 * (1 - f), (1 - e) * -0.2);
    k.m.material.opacity = Math.min(1, e * 1.4) * (1 - f) * 0.96;
  }

  const tmpQ = new THREE.Quaternion();
  const alvo = { cel: { pos: new THREE.Vector3(), rot: new THREE.Euler(), s: 0 }, nb: { pos: new THREE.Vector3(), rot: new THREE.Euler(), s: 0 } };
  const atual = { cel: { pos: new THREE.Vector3(0, -6, 0), q: new THREE.Quaternion(), s: 0.001 }, nb: { pos: new THREE.Vector3(0, -6, 0), q: new THREE.Quaternion(), s: 0.001, tampa: 1.55 } };
  let corac = [], ultimoCap = null;
  function aplicar(obj, a, at, dt, k) {
    at.pos.x = damp(at.pos.x, a.pos.x, k, dt); at.pos.y = damp(at.pos.y, a.pos.y, k, dt); at.pos.z = damp(at.pos.z, a.pos.z, k, dt);
    tmpQ.setFromEuler(a.rot); at.q.slerp(tmpQ, 1 - Math.exp(-k * dt)); at.s = damp(at.s, a.s, k, dt);
    obj.position.copy(at.pos); obj.quaternion.copy(at.q); obj.scale.setScalar(Math.max(0.001, at.s)); obj.visible = at.s > 0.02;
  }
  const ig = (o) => { desenharIG(o); porNaTela(celU, "A", igT, CEL_ASP, W / H); };
  const comPoster = (src, poster) => { const v = tocar(src); return pronto(v) ? v : imgEl(poster) || v; };

  function atualizar(dt, t, cap, p, ativo) {
    const { W: VW, H: VH, retrato } = vista();
    raiz.visible = !!cap && ativo;
    if (!raiz.visible) { pararVideos(); return; }
    const k = reduce ? 30 : 7;
    // em pé: o celular ocupa até 50% da altura, logo abaixo da etiqueta (o texto fica no pé); deitado: 74% da altura
    const escCel = retrato ? Math.min(VH * 0.5 / CEL.h, VW * 0.66 / CEL.w) : Math.min(2.05, VH * 0.74 / CEL.h);
    const escNb = retrato ? Math.min(VW * 0.86 / NB.w, VH * 0.34 / NB.tampa) : Math.min(1.26, VW * 0.46 / NB.w);
    const topo = (s) => VH / 2 - 0.62 - CEL.h * s / 2;
    const px = retrato ? 0 : VW * 0.2, py = retrato ? topo(escCel) : 0;
    const cel = alvo.cel, nb = alvo.nb;
    cel.s = 0; nb.s = 0; celU.uMix.value = 0; nbU.uMix.value = 0; celU.uBordaK.value = 0;
    cacos.visible = false; moedas.visible = notas.visible = false; cafe.visible = false;
    if (cap !== "c-montagem") camReel.forEach((k) => (k.m.visible = false));
    if (cap !== "s-montagem") camSite.forEach((k) => (k.m.visible = false));
    quadro++; const redesenha = reduce || quadro % (leve ? 3 : 2) === 0;
    if (cap !== ultimoCap) { corac = []; ultimoCap = cap; }

    if (cap === "c-problema") {
      const e = glide(faixa(p, 0, 0.12));
      cel.pos.set(px, py - (1 - e) * 2.5, 0); cel.rot.set(0.06 - p * 0.08, -0.38 + p * 0.45, 0.02); cel.s = escCel;
      if (redesenha) desenharFeed(p * 4.4); porNaTela(celU, "A", igT, CEL_ASP, W / H);
    } else if (cap === "c-explode") {
      // 0–0,5: o celular antigo explode em cacos; 0,5–0,85: um novo chega girando com um reel bem feito
      const ex = faixa(p, 0.04, 0.6), volta = glide(faixa(p, 0.6, 0.9));
      if (volta <= 0) {
        desenharFeed(4.4); cacosU.uMap.value = igT; cacosU.uP.value = glide(ex);
        cacos.visible = ex > 0 && ex < 1; cacos.position.set(px, py, 0.06); cacos.rotation.set(0.04, 0.04, 0.02); cacos.scale.setScalar(escCel);
        cel.pos.set(px, py, 0); cel.rot.set(0.04, 0.04, 0.02); cel.s = escCel * (1 - glide(faixa(ex, 0, 0.3)));
        porNaTela(celU, "A", igT, CEL_ASP, W / H); celU.uLuz.value = 1 - clamp(ex * 4);
      } else {
        celU.uLuz.value = 1;
        cel.pos.set(px, py, -2.4 * (1 - volta)); cel.rot.set(0.05, -0.25 + (1 - volta) * Math.PI * 1.5, 0); cel.s = escCel * Math.max(0.05, volta);
        const v = tocar(midia.videoMontagem);
        ig({ fonte: pronto(v) ? v : imgEl(midia.posterMontagem), usuario: "felipen.med", legenda: "Estenose × insuficiência aórtica", corAvatar: "#3b82f6" });
        celU.uBordaK.value = Math.sin(volta * Math.PI) * 1.2;
      }
    } else if (cap === "c-montagem") {
      celU.uLuz.value = 1;
      cel.pos.set(retrato ? 0 : VW * 0.27, retrato ? topo(escCel * 0.78) : 0.05, 0); cel.rot.set(0.04, -0.28 + p * 0.2, 0); cel.s = escCel * (retrato ? 0.78 : 0.86);
      const cam = [0, 1, 2, 3, 4].map((i) => suave(faixa(p, 0.12 + i * 0.14, 0.2 + i * 0.14)));
      const vm = tocar(midia.videoMontagem), fonteV = pronto(vm) ? vm : imgEl(midia.posterMontagem);
      const funde = reduce ? 1 : faixa(p, 0.8, 0.92);
      if (p > 0.92) ig({ fonte: vm, usuario: "felipen.med", legenda: "Estenose × insuficiência aórtica", corAvatar: "#3b82f6" });
      else { if (redesenha) desenharEdicao(p, cam.map((v) => v * funde), fonteV); porNaTela(celU, "A", igT, CEL_ASP, W / H); }
      if (!reduce) camReel.forEach((k, i) => {
        const chega = faixa(p, 0.08 + i * 0.14, 0.2 + i * 0.14);
        if (chega > 0 && funde < 1 && (redesenha || i === 0) && (i === 0 || i === 2 || i === 3 || !k.feito)) { desenharCamadaReel(i, p, fonteV); k.feito = true; }
        voar(k, i, { x: 0, y: 0, z: telaZ }, chega, funde, t, 1);
      });
      celU.uBordaK.value = Math.sin(faixa(p, 0.86, 0.96) * Math.PI) * 1.4;
    } else if (cap === "c-sucesso") {
      // troca de lado e viraliza: contadores sobem e os corações sobem por dentro da tela
      const lado = glide(faixa(p, 0, 0.22)), x0 = VW * 0.27, x1 = -VW * 0.2;
      cel.pos.set(retrato ? 0 : x0 + (x1 - x0) * lado, retrato ? py : Math.sin(lado * Math.PI) * 0.25, Math.sin(lado * Math.PI) * 0.6);
      cel.rot.set(0.04, -0.28 + lado * (Math.PI * 2 + 0.56), Math.sin(lado * Math.PI) * 0.12); cel.s = escCel;
      const cresce = 1 - Math.pow(1 - faixa(p, 0.25, 0.92), 3);
      if (!reduce && p > 0.25 && corac.length < 30 && Math.random() < 0.55) corac.push({ x: W - 60 + (Math.random() - 0.5) * 40, y: H - 650, vy: 200 + Math.random() * 180, vx: (Math.random() - 0.5) * 100, s: 30 + Math.random() * 36, a: 1, cor: Math.random() < 0.8 ? "#ff3040" : "#ff7aa2" });
      corac.forEach((c) => { c.y -= c.vy * dt; c.x += c.vx * dt + Math.sin(c.y / 40) * 1.2; c.a -= dt * 0.5; });
      corac = corac.filter((c) => c.a > 0);
      ig({ fonte: comPoster(midia.videoSucesso, midia.posterSucesso), usuario: "niloeoinfinito", legenda: "Medo de voltar #jesus #deus", curtidas: 82584 * cresce, comentarios: 288 * cresce, envios: 9100 * cresce, curtido: cresce > 0.05, seguindo: cresce > 0.5, coracoes: corac, corAvatar: "#ffb547" });
    } else if (cap === "c-dinheiro") {
      cel.pos.set(px, py, 0); cel.rot.set(0.05, -0.3 + p * 0.25, 0.02); cel.s = escCel;
      ig({ fonte: comPoster(midia.videoAnuncio, midia.posterAnuncio), usuario: "medgrind_oficial", legenda: "Seu plantão começa agora.", patrocinado: true, cta: "Saiba mais", corAvatar: "#14a2ff" });
      // moedas e notas saem do botão "Saiba mais" e se espalham pela tela
      const jorro = faixa(p, 0.15, 1);
      moedas.visible = notas.visible = jorro > 0;
      const ox0 = atual.cel.pos.x - 0.05 * escCel, oy0 = atual.cel.pos.y - 0.36 * escCel, oz0 = atual.cel.pos.z + 0.1;
      const bota = (im, i, nota) => {
        const sd = semente[i], vida = ((t * (0.22 + sd[0] * 0.25) + sd[1]) % 1) * clamp(jorro * 1.6);
        const ang = sd[2] * Math.PI * 2, alc = (0.8 + sd[3] * 2.2) * (0.4 + jorro);
        vv.set(ox0 + Math.cos(ang) * alc * vida * 1.6, oy0 + Math.sin(ang * 0.5 + 0.4) * alc * vida * 1.1 + vida * 1.2 - vida * vida * 1.6, oz0 + vida * (0.4 + sd[0]));
        ee.set(t * (2 + sd[1] * 4) + i, t * (1 + sd[2] * 3), sd[3] * 6); qq.setFromEuler(ee);
        const esc = (nota ? 1.1 : 1) * escCel * (vida > 0.02 ? 1 : 0) * clamp(1 - Math.max(0, vida - 0.85) * 6);
        ss.setScalar(Math.max(0.0001, esc)); mtx.compose(vv, qq, ss); im.setMatrixAt(i, mtx);
      };
      for (let i = 0; i < NM; i++) bota(moedas, i, false);
      for (let i = 0; i < NN; i++) bota(notas, i, true);
      moedas.instanceMatrix.needsUpdate = true; notas.instanceMatrix.needsUpdate = true;
    } else if (cap === "c-oportunidade") {
      cel.pos.set(retrato ? -VW * 0.2 : px + VW * 0.16, retrato ? topo(escCel * 0.6) - 0.2 : -0.25, 0.3); cel.rot.set(0.05, -0.5, 0.05); cel.s = escCel * 0.6;
      ig({ fonte: comPoster(midia.videoSucesso, midia.posterSucesso), usuario: "niloeoinfinito", legenda: "Medo de voltar", curtidas: 82584, comentarios: 288, envios: 9100, curtido: true, seguindo: true, corAvatar: "#ffb547" });
    } else if (cap === "s-problema") {
      const e = glide(faixa(p, 0, 0.12));
      nb.pos.set(px, py - 0.35 - (1 - e) * 2.5, 0); nb.rot.set(0.16, -0.34 + p * 0.26, 0); nb.s = escNb;
      if (redesenha) desenharSite(p, t); porNaTela(nbU, "A", siteT, NB_ASP, 1.6);
    } else if (cap === "s-montagem") {
      // o site da CrossHard sendo escrito; no fim vira a captura real (computador e celular)
      const kk = clamp(p * 1.08 - 0.02) * 5.2, ch = midia.ch || {};
      nb.pos.set(retrato ? 0 : VW * 0.2, py - 0.2, 0); nb.rot.set(0.12, -0.3 + p * 0.14, 0); nb.s = retrato ? escNb : escNb * 0.84;
      const fundeS = reduce ? 1 : faixa(kk, 4.45, 4.95);
      if (redesenha && fundeS > 0) desenharObra(kk, t, false);
      if (kk < 5) { porNaTela(nbU, "A", gradeT, NB_ASP, 1.6); porNaTela(nbU, "B", obraT, NB_ASP, 1.6); nbU.uMix.value = fundeS; }
      else { porNaTela(nbU, "A", obraT, NB_ASP, 1.6); porNaTela(nbU, "B", imagem(ch.desk), NB_ASP, 1.6); nbU.uMix.value = faixa(kk, 5, 5.2); }
      // ordem de chegada: mensagem (0–1), design (1–2), conteúdo (2–3), ação (4–5); a pilha vai do fundo (design) à frente (ação)
      if (!reduce) [[1, 1], [2, 2], [0, 0], [4, 3]].forEach(([ini, i]) => {
        const k = camSite[i], chega = faixa(kk, ini + 0.15, ini + 0.85);
        if (chega > 0 && fundeS < 1 && (!siteDesenhado[i] || (i === 0 && redesenha))) { desenharCamadaSite(i, t); siteDesenhado[i] = true; }
        voar(k, i, nbTelaPos, chega, fundeS, t, 1.9);
      });
      const celV = glide(faixa(kk, 3, 3.6));
      if (celV > 0) {
        if (redesenha) desenharObra(kk, t, true);
        cel.pos.set(retrato ? 0.55 : VW * 0.2 + 1.05, retrato ? py - 0.05 : -0.3, 0.9 - (1 - celV) * 1.5);
        cel.rot.set(0.05, -0.4 + (1 - celV) * 1.2, 0.03); cel.s = escCel * (retrato ? 0.46 : 0.6) * celV;
        porNaTela(celU, "A", obraCelT, CEL_ASP, 540 / 1170); porNaTela(celU, "B", imagem(ch.cel), CEL_ASP, 9 / 19.5); celU.uMix.value = faixa(kk, 5, 5.2);
      }
    } else if (cap === "s-cafe") {
      // menos que um cafezinho: a colher mexe, o redemoinho gira e o vapor sobe
      cafe.visible = true;
      const mexe = 0.3 + 0.7 * suave(faixa(p, 0.1, 0.6));
      cafeU.uT.value = t; cafeU.uMexe.value = reduce ? 0.4 : mexe;
      const ang = reduce ? 0.8 : t * (1.2 + mexe * 2.6);
      colher.position.set(Math.cos(ang) * 0.24, 0.58, Math.sin(ang) * 0.24); colher.rotation.set(Math.sin(ang) * 0.58, 0, -Math.cos(ang) * 0.58);
      for (let i = 0; i < NV; i++) {
        const sd = vaporSem[i], vida = (t * (0.12 + sd * 0.1) + sd) % 1;
        vaporPos[i * 3] = Math.sin(sd * 40 + t * 0.8) * 0.18 * (0.4 + vida); vaporPos[i * 3 + 1] = 0.7 + vida * 1.4; vaporPos[i * 3 + 2] = Math.cos(sd * 31 + t * 0.6) * 0.18 * (0.4 + vida);
      }
      vaporGeo.attributes.position.needsUpdate = true; vapor.material.opacity = 0.26 * (1 - 0.3 * Math.sin(t));
      const e = glide(faixa(p, 0, 0.12)), esc = retrato ? Math.min(1.25, VW * 0.46) : 1.5;
      cafe.position.set(retrato ? 0 : VW * 0.22, (retrato ? VH * 0.11 - esc * 0.3 : -0.68) - (1 - e) * 2, 0);
      cafe.rotation.set(0.42, -0.5 + p * 0.6, 0); cafe.scale.setScalar(esc * Math.max(0.05, e));
    } else if (cap === "s-medgrind") {
      const cenas = midia.cenas || [], n = cenas.length || 1, tall = midia.cenasTall || [];
      const pos = clamp(p * 1.05) * (n - 1), i = Math.floor(pos), f = suave(pos - i), celEntra = glide(faixa(p, 0.3, 0.5));
      nb.pos.set(px - celEntra * (retrato ? 0 : 0.35), py + (retrato ? -0.6 + celEntra * 0.2 : -0.35), -celEntra * 0.4);
      nb.rot.set(0.14, -0.25 + celEntra * 0.12, 0); nb.s = escNb;
      porNaTela(nbU, "A", imagem(cenas[i]), NB_ASP, 16 / 9); porNaTela(nbU, "B", imagem(cenas[Math.min(n - 1, i + 1)]), NB_ASP, 16 / 9); nbU.uMix.value = f;
      if (celEntra > 0) {
        cel.pos.set(px + (retrato ? 0.55 : VW * 0.15), py + (retrato ? -0.1 : -0.15), 0.6 - (1 - celEntra) * 2);
        cel.rot.set(0.05, -0.35 + (1 - celEntra) * 1.5, 0.04); cel.s = escCel * (retrato ? 0.5 : 0.66) * celEntra;
        porNaTela(celU, "A", imagem(tall[i]), CEL_ASP, 9 / 16); porNaTela(celU, "B", imagem(tall[Math.min(n - 1, i + 1)]), CEL_ASP, 9 / 16); celU.uMix.value = f;
      }
    } else if (cap === "s-oportunidade") {
      const vira = faixa(p, 0.58, 0.72), giro = Math.sin(vira * Math.PI);
      cel.pos.set(px, py - giro * (retrato ? 0.12 : -0.06), giro * (retrato ? 0.2 : 0.45)); cel.rot.set(0.05 - giro * 0.05, -0.3 + p * 0.22 + suave(vira) * Math.PI * 2, 0.02 - giro * 0.04); cel.s = escCel * 1.02;
      if (vira < 0.5) ig({ fonte: comPoster(midia.videoAnuncio, midia.posterAnuncio), usuario: "medgrind_oficial", legenda: "Seu plantão começa agora.", patrocinado: true, cta: "Saiba mais", corAvatar: "#14a2ff", toque: faixa(p, 0.5, 0.6) });
      else { if (redesenha) desenharChat(faixa(p, 0.66, 0.98), t); porNaTela(celU, "A", chatT, CEL_ASP, 540 / 1170); }
      celU.uBordaK.value = giro * 1.3;
    }
    if (cap !== "c-explode") celU.uLuz.value = 1;

    atual.nb.tampa = damp(atual.nb.tampa, nb.s > 0 ? -0.2 : 1.55, k * 0.7, dt);
    dobradica.rotation.x = atual.nb.tampa;
    aplicar(celular, cel, atual.cel, dt, cap === "c-explode" ? k * 1.6 : k);
    aplicar(notebook, nb, atual.nb, dt, k);
  }

  return { atualizar, pararVideos, raiz };
}
