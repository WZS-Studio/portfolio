// Forma da xícara de café (capítulo "Para manter" de Sites): perfis de torno, alça, líquido e chão.
// O site e o Blender usam exatamente esta geometria: tools/cafe-geometria.mjs exporta para o Blender,
// que assa luz, sombras e oclusão nas texturas de media/tex/cafe (tools/blender/cafe_assar.py).
// Mudou alguma medida aqui? Rode os dois de novo, senão a textura deixa de bater com a malha.
// Unidades da cena do site (y para cima); a base da xícara fica em y = 0, sobre o pires.

export const FORMA_CAFE = {
  // porcelana: pé com anel, corpo que abre, borda arredondada e parede interna até o fundo
  xicara: [[0, 0.02], [0.25, 0.02], [0.27, 0.004], [0.285, 0], [0.31, 0], [0.325, 0.012], [0.345, 0.04], [0.38, 0.075], [0.425, 0.14], [0.462, 0.24],
    [0.492, 0.34], [0.513, 0.44], [0.527, 0.54], [0.536, 0.62], [0.541, 0.67], [0.543, 0.695], [0.539, 0.711], [0.529, 0.717], [0.518, 0.712], [0.512, 0.697],
    [0.508, 0.66], [0.499, 0.57], [0.484, 0.47], [0.461, 0.37], [0.43, 0.28], [0.39, 0.2], [0.33, 0.135], [0.25, 0.095], [0.13, 0.078], [0, 0.074]],
  // pires: anel de apoio embaixo, cavidade rasa para a xícara e aba que sobe até a borda
  pires: [[0, -0.05], [0.27, -0.05], [0.29, -0.062], [0.33, -0.062], [0.35, -0.05], [0.55, -0.03], [0.74, -0.005], [0.86, 0.022], [0.925, 0.045], [0.95, 0.06],
    [0.953, 0.07], [0.944, 0.075], [0.92, 0.068], [0.85, 0.05], [0.72, 0.025], [0.55, 0.006], [0.4, -0.002], [0.33, 0], [0, 0]],
  // alça: arco de toro com seção achatada; as pontas entram na parede (o que fica entre as duas paredes não aparece)
  alca: { raio: 0.17, tubo: 0.032, arco: 1.24, giro: -0.66, centro: [0.532, 0.39, 0], achata: 0.8, radial: 20, tubular: 48 },
  liquido: { y: 0.6, raio: 0.5 },
  chao: { y: -0.064, lado: 2.8 },
};

// geometrias prontas, já na posição dentro do grupo do café (o Blender recebe as mesmas)
export function geometriasCafe(THREE, seg = 128) {
  const F = FORMA_CAFE, v2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y)), a = F.alca;
  const alca = new THREE.TorusGeometry(a.raio, a.tubo, a.radial, a.tubular, Math.PI * a.arco);
  alca.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...a.centro), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * a.giro)), new THREE.Vector3(1, 1, a.achata)));
  const liquido = new THREE.CircleGeometry(F.liquido.raio, seg); liquido.rotateX(-Math.PI / 2); liquido.translate(0, F.liquido.y, 0);
  const chao = new THREE.PlaneGeometry(F.chao.lado, F.chao.lado); chao.rotateX(-Math.PI / 2); chao.translate(0, F.chao.y, 0);
  return { xicara: new THREE.LatheGeometry(v2(F.xicara), seg), pires: new THREE.LatheGeometry(v2(F.pires), seg), alca, liquido, chao };
}
