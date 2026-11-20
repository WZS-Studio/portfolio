// Emblema da WZS: a logo como uma esfera de pérola com os arcos em ouro, que se transforma no bastão de Asclépio.
// Não há troca de modelo: são as mesmas peças mudando de lugar.
//   - os 8 arcos da logo (curvas de nível x + sqrt(1 - y²) = k·STEP, as mesmas do SVG) se enrolam e viram a serpente;
//   - o aro externo se fecha de lado e vira a haste;
//   - a esfera de pérola encolhe e sobe: é o pomo no alto da haste.
// Cada vértice guarda as duas formas; o shader interpola pelo "uMorph" (0 = logo, 1 = bastão).
// Os arcos giram em volta do eixo vertical no caminho (coordenadas cilíndricas), por isso parecem se enrolar.
import * as THREE from "three";

const STEP = 44.44 / 200;        // distância entre arcos (igual ao SVG)
const TRACO = 13 / 200 / 2;      // meia largura do traço da logo
const ARCOS = 8;                 // k = 1..8 (k = 0 coincide com o aro e k = 9 é um ponto)

// ---------- as duas formas ----------
// arco k da logo sobre a esfera de raio 1, fechado: sobe pela frente (z > 0) e desce por trás
function arco(k, u) {
  const c = k * STEP, Y = Math.sqrt(1 - (c * c) / 4), a = u * Math.PI * 2;
  const y = -Y * Math.cos(a), x = c - Math.sqrt(Math.max(0, 1 - y * y));
  return new THREE.Vector3(x, y, Math.sign(Math.sin(a)) * Math.sqrt(Math.max(0, 1 - x * x - y * y)));
}
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// serpente: s = 0 na ponta da cauda (embaixo), s = 1 no focinho. Devolve raio em volta da haste, ângulo e altura.
const VOLTAS = 3.1, Y_CAUDA = -0.98, Y_PESCOCO = 0.62, TH0 = Math.PI * 0.9;
function serpente(s) {
  const corpo = Math.min(s / 0.88, 1), h = Math.max(0, (s - 0.88) / 0.12), sh = h * h * (3 - 2 * h);
  return {
    r: 0.13 + 0.075 * suave(0, 0.14, corpo) + 0.2 * sh,                         // a cauda abraça a haste; a cabeça se afasta
    th: TH0 + Math.PI * 2 * VOLTAS * corpo + 0.5 * h,
    y: Y_CAUDA + (Y_PESCOCO - Y_CAUDA) * corpo + 0.1 * h + 0.045 * Math.sin(Math.PI * h),
  };
}
const pontoSerpente = (s) => { const q = serpente(s); return new THREE.Vector3(Math.cos(q.th) * q.r, q.y, Math.sin(q.th) * q.r); };
// grossura do corpo: cauda fina, corpo cheio, pescoço, cabeça e focinho
function grossura(s) {
  let g = 0.007 + 0.05 * suave(0, 0.3, s);
  g -= 0.016 * suave(0.8, 0.885, s);          // pescoço
  g += 0.036 * suave(0.885, 0.935, s);         // cabeça
  return g * (1 - 0.95 * suave(0.94, 1, s));   // focinho
}
// haste: do pé (ponta fina) ao alto, onde o pomo se apoia
const Y_PE = -1.3, Y_ALTO = 0.99;
const raioHaste = (y) => (0.034 + 0.016 * suave(Y_PE, Y_ALTO, y)) * suave(Y_PE, Y_PE + 0.16, y) + 0.004;
export const POMO = { y: 1.13, r: 0.155 };

const cil = (v) => [Math.hypot(v.x, v.z), Math.atan2(v.z, v.x), v.y];
// componentes de um vetor na base cilíndrica (radial, tangente, vertical) do ângulo th
const emCil = (o, th) => [o.x * Math.cos(th) + o.z * Math.sin(th), -o.x * Math.sin(th) + o.z * Math.cos(th), o.y];

function geometria(seg, lados) {
  const pos = [], aA = [], aB = [], oA = [], oB = [], aK = [], aLin = [], idx = [];
  const tmp = new THREE.Vector3(), T = new THREE.Vector3(), N1 = new THREE.Vector3(), N2 = new THREE.Vector3(), O = new THREE.Vector3();
  const anel = (base, n) => { for (let i = 0; i < n; i++) for (let j = 0; j < lados; j++) { const a = base + i * lados + j, b = base + i * lados + ((j + 1) % lados), c = a + lados, d = b + lados; idx.push(a, c, b, b, c, d); } };

  // --- arcos → serpente ---
  for (let k = 1; k <= ARCOS; k++) {
    const fatia = k - 1, base = pos.length / 3;
    // giro mínimo: a fatia da serpente é contada na volta mais próxima do ângulo em que o arco está
    const meioA = cil(arco(k, 0.25))[1], meioB = serpente((fatia + 0.5) / ARCOS).th;
    const volta = -Math.PI * 2 * Math.round((meioB - meioA) / (Math.PI * 2));
    for (let i = 0; i <= seg; i++) {
      const u = i / seg, s = (fatia + u) / ARCOS;
      // forma A (logo): tubo sobre a esfera
      const A = arco(k, u % 1);
      T.copy(arco(k, (u + 0.002) % 1)).sub(arco(k, (u - 0.002 + 1) % 1)).normalize();
      N1.copy(A).normalize(); N2.crossVectors(T, N1).normalize();
      const cA = cil(A);
      // forma B (serpente)
      const B = pontoSerpente(s), q = serpente(s), g = grossura(s);
      const Tb = pontoSerpente(Math.min(1, s + 0.002)).sub(pontoSerpente(Math.max(0, s - 0.002))).normalize();
      const Nb1 = tmp.set(Math.cos(q.th), 0, Math.sin(q.th)); Nb1.addScaledVector(Tb, -Nb1.dot(Tb)).normalize();
      const Nb1c = Nb1.clone(), Nb2 = new THREE.Vector3().crossVectors(Tb, Nb1c).normalize();
      const cabeca = suave(0.885, 0.935, s);        // a cabeça é mais larga que alta
      for (let j = 0; j < lados; j++) {
        const a = (j / lados) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
        O.copy(N1).multiplyScalar(ca * TRACO * 0.92).addScaledVector(N2, sa * TRACO * 0.92);
        pos.push(A.x + O.x, A.y + O.y, A.z + O.z);
        aA.push(...cA); oA.push(...emCil(O, cA[1]));
        O.copy(Nb1c).multiplyScalar(ca * g * (1 - cabeca * 0.3)).addScaledVector(Nb2, sa * g * (1 + cabeca * 0.28));
        aB.push(q.r, q.th + volta, q.y); oB.push(...emCil(O, q.th));
        aK.push(fatia / (ARCOS - 1)); aLin.push(0);
      }
    }
    anel(base, seg);
  }

  // --- aro externo → haste (interpolação reta: o aro se fecha de lado) ---
  {
    const base = pos.length / 3, n = Math.round(seg * 1.4);
    for (let i = 0; i <= n; i++) {
      const fi = (i / n) * Math.PI * 2, cx = Math.cos(fi), sy = Math.sin(fi);
      const yB = Y_PE + (Y_ALTO - Y_PE) * (sy * 0.5 + 0.5), rB = raioHaste(yB), lado = cx >= 0 ? 1 : -1;
      for (let j = 0; j < lados; j++) {
        const a = (j / lados) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
        // A: seção no plano (radial, z). B: seção no plano xz, igual nas duas metades (elas se sobrepõem numa haste só)
        pos.push(cx * (1 + ca * TRACO * 0.92), sy * (1 + ca * TRACO * 0.92), sa * TRACO * 0.92);
        aA.push(cx, sy, 0); oA.push(cx * ca * TRACO * 0.92, sy * ca * TRACO * 0.92, sa * TRACO * 0.92);
        aB.push(0, yB, 0); oB.push(lado * ca * rB, 0, sa * rB);
        aK.push(0); aLin.push(1);
      }
    }
    anel(base, n);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  for (const [nome, v] of [["aA", aA], ["aB", aB], ["oA", oA], ["oB", oB]]) g.setAttribute(nome, new THREE.Float32BufferAttribute(v, 3));
  g.setAttribute("aK", new THREE.Float32BufferAttribute(aK, 1));
  g.setAttribute("aLin", new THREE.Float32BufferAttribute(aLin, 1));
  g.setIndex(idx);
  return g;
}

const VERT_ARCOS = /* glsl */ `
  attribute vec3 aA, aB, oA, oB; attribute float aK, aLin;
  uniform float uMorph, uGross;
  varying vec3 vN;
  float glide(float x) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
  void main() {
    // a serpente se forma da cauda para a cabeça: cada fatia sai um pouco depois da anterior
    float t = glide(clamp(uMorph * 1.5 - aK * 0.5, 0.0, 1.0));
    vec3 cen, off;
    if (aLin > 0.5) { cen = mix(aA, aB, t); off = mix(oA, oB, t); }
    else {
      float r = mix(aA.x, aB.x, t) + sin(t * 3.14159) * 0.1, th = mix(aA.y, aB.y, t), y = mix(aA.z, aB.z, t);
      vec3 er = vec3(cos(th), 0.0, sin(th)), et = vec3(-sin(th), 0.0, cos(th)), o = mix(oA, oB, t);
      cen = er * r + vec3(0.0, y, 0.0);
      off = er * o.x + et * o.y + vec3(0.0, o.z, 0.0);
    }
    off *= mix(uGross, 1.0, t);
    vN = normalize(normalMatrix * normalize(off + vec3(1e-6)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(cen + off, 1.0);
  }
`;
const VERT_PEROLA = /* glsl */ `
  varying vec3 vN;
  void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// matcaps assados no Blender (tools/blender/matcaps.py); até a imagem chegar, uma luz simples na cor do material
const FRAG = /* glsl */ `
  uniform sampler2D uMat; uniform float uTem, uFade, uLuz; uniform vec3 uBase;
  varying vec3 vN;
  void main() {
    vec3 n = normalize(vN);
    vec3 col = uTem > 0.5 ? texture2D(uMat, n.xy * 0.485 + 0.5).rgb : uBase * (0.62 + 0.38 * clamp(n.y * 0.5 + n.z * 0.6 + 0.2, 0.0, 1.0));
    col *= 1.0 + uLuz;
    gl_FragColor = vec4(col, uFade);
    #include <colorspace_fragment>
  }
`;

// matcaps: { ouro: { value }, perola: { value }, tem: { value } } (o mundo carrega as imagens e liga "tem")
export function criarEmblema({ nivel = "alta", matcaps }) {
  const seg = nivel === "alta" ? 96 : nivel === "media" ? 72 : 48, lados = nivel === "baixa" ? 8 : 12;
  const grupo = new THREE.Group();
  const uni = (mat, base) => ({ uMat: mat, uTem: matcaps.tem, uFade: { value: 1 }, uLuz: { value: 0 }, uBase: { value: new THREE.Color(base) } });
  const arcosU = { ...uni(matcaps.ouro, "#b8923a"), uMorph: { value: 0 }, uGross: { value: 1 } };
  const arcos = new THREE.Mesh(geometria(seg, lados), new THREE.ShaderMaterial({ uniforms: arcosU, vertexShader: VERT_ARCOS, fragmentShader: FRAG, transparent: true, side: THREE.DoubleSide }));
  arcos.frustumCulled = false; arcos.renderOrder = 5;
  const perolaU = uni(matcaps.perola, "#f3efe6");
  const perola = new THREE.Mesh(new THREE.SphereGeometry(1, nivel === "baixa" ? 40 : 72, nivel === "baixa" ? 28 : 48), new THREE.ShaderMaterial({ uniforms: perolaU, vertexShader: VERT_PEROLA, fragmentShader: FRAG, transparent: true }));
  perola.renderOrder = 4;
  grupo.add(perola, arcos);
  const glide = (x) => x * x * x * (x * (x * 6 - 15) + 10);
  return {
    grupo, arcos, perola,
    // morph: 0 = logo, 1 = bastão · fade: opacidade · grossura: 1 = traço normal (engrossa quando a logo "fala") · luz: brilho extra
    atualizar({ morph = 0, fade = 1, grossura = 1, luz = 0 }) {
      arcosU.uMorph.value = morph; arcosU.uGross.value = grossura;
      arcosU.uFade.value = perolaU.uFade.value = fade; arcosU.uLuz.value = luz; perolaU.uLuz.value = luz * 0.25;
      const e = glide(Math.min(1, morph * 1.25));
      perola.scale.setScalar(0.972 + (POMO.r - 0.972) * e);
      perola.position.y = POMO.y * e;
    },
  };
}
