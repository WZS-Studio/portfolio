# Renderiza matcaps (esfera iluminada em estúdio, câmera ortográfica) para a logo WZS: ouro e pérola.
# blender --background --factory-startup --python matcaps.py -- <pasta-saida>
import bpy, sys, os, math

out = sys.argv[sys.argv.index("--") + 1]
os.makedirs(out, exist_ok=True)

def limpar():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def area(nome, loc, rot, tamanho, energia, cor):
    d = bpy.data.lights.new(nome, "AREA")
    d.shape = "RECTANGLE"; d.size = tamanho[0]; d.size_y = tamanho[1]
    d.energy = energia * 0.32; d.color = cor
    o = bpy.data.objects.new(nome, d)
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]
    bpy.context.collection.objects.link(o)
    return o

def apontar(o, alvo=(0, 0, 0)):
    import mathutils
    d = mathutils.Vector(alvo) - o.location
    o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

def cena(cfg):
    limpar()
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.samples = 48
    sc.cycles.use_denoising = True
    sc.cycles.device = "CPU"
    sc.render.resolution_x = sc.render.resolution_y = 512
    sc.render.film_transparent = False
    sc.view_settings.view_transform = cfg.get("vista", "AgX")
    sc.view_settings.look = "None" if cfg.get("vista") == "Standard" else "AgX - Punchy"
    w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = (*cfg["mundo"], 1); bg.inputs[1].default_value = cfg.get("mundo_k", 1.0)
    if "ceu" in cfg:  # degradê do chão ao teto: o metal reflete escuro embaixo e claro em cima
        nt = w.node_tree
        tc = nt.nodes.new("ShaderNodeTexCoord"); sx = nt.nodes.new("ShaderNodeSeparateXYZ"); mr = nt.nodes.new("ShaderNodeMapRange"); cr = nt.nodes.new("ShaderNodeValToRGB")
        mr.inputs[1].default_value = -1.0; mr.inputs[2].default_value = 1.0
        cr.color_ramp.elements[0].color = (*cfg["ceu"][0], 1); cr.color_ramp.elements[1].color = (*cfg["ceu"][1], 1)
        cr.color_ramp.elements[0].position = 0.25; cr.color_ramp.elements[1].position = 0.8
        nt.links.new(tc.outputs["Generated"], sx.inputs[0]); nt.links.new(sx.outputs["Z"], mr.inputs[0]); nt.links.new(mr.outputs[0], cr.inputs[0]); nt.links.new(cr.outputs[0], bg.inputs[0])

    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=1)
    esf = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    m = bpy.data.materials.new("m"); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*cfg["base"], 1)
    p.inputs["Metallic"].default_value = cfg["metal"]
    p.inputs["Roughness"].default_value = cfg["rough"]
    p.inputs["Coat Weight"].default_value = cfg.get("coat", 0)
    p.inputs["Coat Roughness"].default_value = 0.05
    if "sss" in cfg:
        p.inputs["Subsurface Weight"].default_value = cfg["sss"]
    esf.data.materials.append(m)

    for i, L in enumerate(cfg["luzes"]):
        o = area(f"L{i}", L["loc"], (0, 0, 0), L["tam"], L["e"], L["cor"])
        apontar(o)

    cam = bpy.data.cameras.new("c"); cam.type = "ORTHO"; cam.ortho_scale = 2.0
    co = bpy.data.objects.new("c", cam); co.location = (0, -6, 0); co.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.collection.objects.link(co); sc.camera = co
    sc.render.filepath = os.path.join(out, cfg["nome"] + ".png")
    bpy.ops.render.render(write_still=True)

CONFIGS = [
    # ouro polido da marca (arcos da logo, serpente e haste): teto claro e chão escuro para o metal ter contraste e brilho sem estourar
    {"nome": "matcap-ouro", "base": (0.98, 0.64, 0.16), "metal": 1.0, "rough": 0.13,
     "mundo": (0.5, 0.5, 0.5), "mundo_k": 1.0, "ceu": ((0.26, 0.17, 0.07), (1.0, 0.93, 0.80)), "vista": "AgX", "luzes": [
        {"loc": (-2.4, -3.2, 3.4), "tam": (4.0, 3.0), "e": 260, "cor": (1.0, 0.97, 0.92)},
        {"loc": (3.4, -1.2, 0.4), "tam": (0.6, 5.0), "e": 170, "cor": (1.0, 0.94, 0.84)},
        {"loc": (-3.4, -0.4, -0.6), "tam": (0.4, 4.0), "e": 90, "cor": (1.0, 0.92, 0.78)},
    ]},
    # pérola (corpo da esfera): cerâmica quase branca e quente; sombra suave embaixo para a esfera se destacar do fundo branco
    {"nome": "matcap-perola", "base": (0.90, 0.885, 0.85), "metal": 0.0, "rough": 0.38, "coat": 0.35, "sss": 0.1,
     "mundo": (0.5, 0.5, 0.5), "mundo_k": 1.0, "ceu": ((0.50, 0.47, 0.42), (0.97, 0.955, 0.93)), "vista": "Standard", "luzes": [
        {"loc": (-2.6, -3.2, 3.4), "tam": (4.0, 3.0), "e": 150, "cor": (1.0, 0.985, 0.96)},
        {"loc": (3.2, -1.4, 0.4), "tam": (1.2, 3.6), "e": 40, "cor": (1.0, 0.95, 0.88)},
    ]},
]
so = os.environ.get("SO")
for c in [c for c in CONFIGS if not so or c["nome"] == so]:
    cena(c)
print("MATCAPS_OK")
