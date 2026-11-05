# Assa luz, sombras e oclusão da xícara de café nas texturas do site (media/tex/cafe).
# Roda dentro do Blender (MCP ou "blender --background --python"), numa cena própria que é apagada no fim:
#   GEO = "<geo.json de tools/cafe-geometria.mjs>"; SAIDA = "<pasta das PNG>"; exec(open(".../cafe_assar.py", encoding="utf-8").read())
# Saídas: xicara.png, pires.png, alca.png (porcelana com a luz assada, sRGB), liquido.png (sombra sobre o café, cinza)
# e chao.png (sombra no chão: preto com transparência).
import bpy, json, math, os
import numpy as np

AMOSTRAS = globals().get("AMOSTRAS", 64)
dados = json.load(open(GEO, encoding="utf-8"))
os.makedirs(SAIDA, exist_ok=True)

# em segundo plano (blender --background --factory-startup) usa a cena vazia de fábrica;
# com o Blender aberto, cria uma cena própria e a põe na janela só durante o assado (a do usuário volta no fim)
NOME = "WZS_cafe_assar"
if bpy.app.background:
    cena = bpy.context.scene
    for o in list(cena.objects): bpy.data.objects.remove(o, do_unlink=True)
    janela, cena_antes = None, None
else:
    if NOME in bpy.data.scenes:
        bpy.data.scenes.remove(bpy.data.scenes[NOME])
    cena = bpy.data.scenes.new(NOME)
    janela = bpy.context.window_manager.windows[0]; cena_antes = janela.scene; janela.scene = cena
cena.render.engine = "CYCLES"
cena.cycles.samples = AMOSTRAS
cena.cycles.use_denoising = False
cena.view_settings.view_transform = "Standard"
cena.view_settings.look = "None"
cena.view_settings.exposure = 0
cena.view_settings.gamma = 1
cena.render.bake.margin = 8
camada = cena.view_layers[0]
criados = {"obj": [], "mat": [], "img": [], "mesh": [], "luz": [], "mundo": []}

def malha(nome, d):
    # a cena do site tem y para cima; no Blender z sobe: (x, y, z) -> (x, -z, y)
    p = np.array(d["pos"], dtype=np.float64).reshape(-1, 3)
    vs = [(x, -z, y) for x, y, z in p]
    idx = np.array(d["idx"], dtype=np.int64).reshape(-1, 3)
    me = bpy.data.meshes.new(nome)
    me.from_pydata(vs, [], [tuple(f) for f in idx])
    uv = np.array(d["uv"], dtype=np.float64).reshape(-1, 2)
    camada_uv = me.uv_layers.new(name="UVMap")
    lv = np.zeros(len(me.loops), dtype=np.int64); me.loops.foreach_get("vertex_index", lv)
    camada_uv.data.foreach_set("uv", uv[lv].ravel())
    me.update()
    # costura do torno: junta os vértices repetidos para a normal não quebrar (a UV continua por canto)
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(me); bm.free()
    for pl in me.polygons: pl.use_smooth = True
    ob = bpy.data.objects.new(nome, me)
    cena.collection.objects.link(ob)
    criados["obj"].append(ob); criados["mesh"].append(me)
    return ob

def material(nome, montar):
    m = bpy.data.materials.new(nome); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    saida = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], saida.inputs["Surface"])
    montar(nt, bsdf)
    criados["mat"].append(m)
    return m

def sk(lista, ident):
    # o nó Mix tem soquetes de mesmo nome para cada tipo; vale o identificador (A_Color, Factor_Float, Result_Color)
    return next(x for x in lista if x.identifier == ident)

def porcelana(z_pe):
    # branco quente com variação leve, pontinhos de esmalte e o pé sem esmalte, mais cru
    def montar(nt, bsdf):
        n = nt.nodes
        coord = n.new("ShaderNodeTexCoord")
        ruido = n.new("ShaderNodeTexNoise"); ruido.inputs["Scale"].default_value = 18; ruido.inputs["Detail"].default_value = 6
        nt.links.new(coord.outputs["Object"], ruido.inputs["Vector"])
        rampa = n.new("ShaderNodeValToRGB")
        rampa.color_ramp.elements[0].position = 0.35; rampa.color_ramp.elements[0].color = (0.86, 0.835, 0.80, 1)
        rampa.color_ramp.elements[1].position = 0.7; rampa.color_ramp.elements[1].color = (0.93, 0.915, 0.89, 1)
        nt.links.new(ruido.outputs["Fac"], rampa.inputs["Fac"])
        vor = n.new("ShaderNodeTexVoronoi"); vor.inputs["Scale"].default_value = 140
        nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])
        ponto = n.new("ShaderNodeMath"); ponto.operation = "LESS_THAN"; ponto.inputs[1].default_value = 0.035
        nt.links.new(vor.outputs["Distance"], ponto.inputs[0])
        mist = n.new("ShaderNodeMix"); mist.data_type = "RGBA"; sk(mist.inputs, "B_Color").default_value = (0.45, 0.40, 0.36, 1)
        fat = n.new("ShaderNodeMath"); fat.operation = "MULTIPLY"; fat.inputs[1].default_value = 0.55
        nt.links.new(ponto.outputs[0], fat.inputs[0]); nt.links.new(fat.outputs[0], sk(mist.inputs, "Factor_Float"))
        nt.links.new(rampa.outputs["Color"], sk(mist.inputs, "A_Color"))
        sep = n.new("ShaderNodeSeparateXYZ"); nt.links.new(coord.outputs["Object"], sep.inputs["Vector"])
        pe = n.new("ShaderNodeMath"); pe.operation = "LESS_THAN"; pe.inputs[1].default_value = z_pe
        nt.links.new(sep.outputs["Z"], pe.inputs[0])
        cru = n.new("ShaderNodeMix"); cru.data_type = "RGBA"; sk(cru.inputs, "B_Color").default_value = (0.66, 0.62, 0.56, 1)
        nt.links.new(pe.outputs[0], sk(cru.inputs, "Factor_Float")); nt.links.new(sk(mist.outputs, "Result_Color"), sk(cru.inputs, "A_Color"))
        nt.links.new(sk(cru.outputs, "Result_Color"), bsdf.inputs["Base Color"])
        bsdf.inputs["Roughness"].default_value = 0.25
    return montar

def cor_lisa(c, rug=0.6):
    def montar(nt, bsdf):
        bsdf.inputs["Base Color"].default_value = (*c, 1); bsdf.inputs["Roughness"].default_value = rug
    return montar

obs = {k: malha("cafe_" + k, dados[k]) for k in ["xicara", "pires", "alca", "liquido", "chao"]}
obs["xicara"].data.materials.append(material("cafe_m_xicara", porcelana(0.012)))
obs["alca"].data.materials.append(material("cafe_m_alca", porcelana(-1)))
obs["pires"].data.materials.append(material("cafe_m_pires", porcelana(-0.052)))
obs["liquido"].data.materials.append(material("cafe_m_liquido", cor_lisa((0.09, 0.045, 0.02), 0.2)))
mat_chao = material("cafe_m_chao", cor_lisa((0.05, 0.06, 0.09), 0.9))
obs["chao"].data.materials.append(mat_chao)

# luz: janela grande à esquerda e acima de quem olha, contraluz fria atrás e um céu azulado fraco (o fundo do site é azul-marinho)
def luz(nome, pos, alvo, energia, tam, cor):
    ld = bpy.data.lights.new(nome, "AREA"); ld.energy = energia; ld.size = tam; ld.color = cor
    lo = bpy.data.objects.new(nome, ld); cena.collection.objects.link(lo); lo.location = pos
    d = np.array(alvo) - np.array(pos); lo.rotation_mode = "QUATERNION"
    from mathutils import Vector
    lo.rotation_quaternion = Vector(d).to_track_quat("-Z", "Y")
    criados["obj"].append(lo); criados["luz"].append(ld)
luz("cafe_luz_chave", (-2.4, -2.2, 3.4), (0, 0, 0.3), 1100, 2.6, (1.0, 0.96, 0.9))
luz("cafe_luz_contra", (2.6, 2.6, 2.4), (0, 0, 0.35), 380, 1.8, (0.75, 0.84, 1.0))
luz("cafe_luz_rebate", (1.8, -2.6, 0.4), (0, 0, 0.3), 55, 3.0, (0.6, 0.7, 1.0))
mundo = bpy.data.worlds.new("cafe_mundo"); mundo.use_nodes = True; criados["mundo"].append(mundo)
fundo = mundo.node_tree.nodes.get("Background"); fundo.inputs["Color"].default_value = (0.42, 0.48, 0.62, 1); fundo.inputs["Strength"].default_value = 0.16
cena.world = mundo

def assar(ob, nome, w, h, passes):
    img = bpy.data.images.new("cafe_" + nome, w, h, alpha=False, float_buffer=True); criados["img"].append(img)
    m = ob.active_material; no = m.node_tree.nodes.new("ShaderNodeTexImage"); no.image = img
    for x in m.node_tree.nodes: x.select = False
    no.select = True; m.node_tree.nodes.active = no
    for o in cena.objects: o.select_set(False, view_layer=camada)
    ob.select_set(True, view_layer=camada); camada.objects.active = ob
    cena.render.bake.use_pass_direct = "DIRECT" in passes
    cena.render.bake.use_pass_indirect = "INDIRECT" in passes
    cena.render.bake.use_pass_color = "COLOR" in passes
    bpy.ops.object.bake(type="DIFFUSE", pass_filter=passes, margin=8, use_clear=True)
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    m.node_tree.nodes.remove(no)
    return px

def salvar(px, nome):
    h, w = px.shape[:2]
    img = bpy.data.images.new("cafe_sai_" + nome, w, h, alpha=True, float_buffer=True); criados["img"].append(img)
    img.pixels.foreach_set(np.ascontiguousarray(px, dtype=np.float32).ravel())
    cena.render.image_settings.file_format = "PNG"; cena.render.image_settings.color_mode = "RGBA"; cena.render.image_settings.color_depth = "8"
    img.save_render(os.path.join(SAIDA, nome + ".png"), scene=cena)

def borrar(img, sig, envolve_x):
    # luz é de baixa frequência: um desfoque gaussiano tira o ruído das poucas amostras (no torno, a imagem dá a volta em x)
    r = max(1, int(sig * 3)); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sig) ** 2); k /= k.sum()
    p = np.pad(img, ((r, r), (r, r)) + ((0, 0),) * (img.ndim - 2), mode="edge")
    if envolve_x: p[:, :r] = p[:, -2 * r:-r]; p[:, -r:] = p[:, r:2 * r]
    p = np.apply_along_axis(lambda v: np.convolve(v, k, mode="valid"), 1, p)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode="valid"), 0, p)

def dobra(img):
    # meia resolução de volta à inteira (bilinear simples)
    h, w = img.shape[:2]
    ys = np.clip((np.arange(h * 2) + 0.5) / 2 - 0.5, 0, h - 1); xs = np.clip((np.arange(w * 2) + 0.5) / 2 - 0.5, 0, w - 1)
    y0 = np.floor(ys).astype(int); x0 = np.floor(xs).astype(int); y1 = np.minimum(y0 + 1, h - 1); x1 = np.minimum(x0 + 1, w - 1)
    fy = (ys - y0)[:, None, None]; fx = (xs - x0)[None, :, None]
    a = img[y0][:, x0] * (1 - fx) + img[y0][:, x1] * fx; b = img[y1][:, x0] * (1 - fx) + img[y1][:, x1] * fx
    return a * (1 - fy) + b * fy

def louca(k, w, h):
    # cor da porcelana em resolução inteira (sem ruído: 1 amostra) × luz em meia resolução, desfocada
    cena.cycles.samples = 1; cor = assar(obs[k], k + "_cor", w, h, {"COLOR"})[..., :3]
    cena.cycles.samples = AMOSTRAS; luz_ = assar(obs[k], k + "_luz", w // 2, h // 2, {"DIRECT", "INDIRECT"})[..., :3]
    return cor * dobra(borrar(luz_, 1.6, True))

lou = {k: louca(k, *t) for k, t in [("xicara", (1024, 512)), ("pires", (1024, 512)), ("alca", (512, 256))]}
# o mesmo ganho nas três peças: o ponto mais claro (sem os 0,4% de brilho extremo) fica em 0,96
ref = np.percentile(np.concatenate([p.max(axis=2).ravel() for p in lou.values()]), 99.6)
for k, p in lou.items():
    q = np.clip(p * (0.96 / ref), 0, 1); salvar(np.dstack([q, np.ones(q.shape[:2])]), k)

# sombra sobre o café: só a luz que chega (sem cor), normalizada
liq = borrar(assar(obs["liquido"], "liquido", 128, 128, {"DIRECT", "INDIRECT"})[..., :3].mean(axis=2), 1.5, False)
l = dobra(np.clip(liq / np.percentile(liq, 99), 0, 1)[..., None])[..., 0]
salvar(np.dstack([l, l, l, np.ones_like(l)]), "liquido")

# sombra no chão: luz com a xícara dividida pela luz sem ela (a xícara para de projetar sombra)
bsdf = mat_chao.node_tree.nodes.get("Principled BSDF"); bsdf.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1)
com = borrar(assar(obs["chao"], "chao", 256, 256, {"DIRECT", "INDIRECT"})[..., :3].mean(axis=2), 1.2, False)
for k in ["xicara", "pires", "alca", "liquido"]: obs[k].visible_shadow = False; obs[k].hide_render = True
sem = borrar(assar(obs["chao"], "chao2", 256, 256, {"DIRECT", "INDIRECT"})[..., :3].mean(axis=2), 1.2, False)
a = dobra(np.clip(1 - com / np.maximum(sem, 1e-4), 0, 1)[..., None])[..., 0]
yy, xx = np.mgrid[0:512, 0:512]; r = np.hypot(xx - 255.5, yy - 255.5) / 256
a = np.clip(a * 1.35, 0, 1) * np.clip((1 - r) / 0.25, 0, 1)
salvar(np.dstack([np.zeros_like(a)] * 3 + [a]), "chao")

result = {"ref": float(ref), "sombra_max": float(a.max()), "saida": SAIDA}

# limpa: a cena, os objetos, materiais, imagens e luzes criados aqui (a cena do usuário volta para a janela)
if janela is not None:
    janela.scene = cena_antes
    bpy.data.scenes.remove(cena)
for o in criados["obj"]: bpy.data.objects.remove(o, do_unlink=True)
for coisa, col in [("mesh", bpy.data.meshes), ("mat", bpy.data.materials), ("img", bpy.data.images), ("luz", bpy.data.lights), ("mundo", bpy.data.worlds)]:
    for x in criados[coisa]:
        try: col.remove(x)
        except Exception: pass
