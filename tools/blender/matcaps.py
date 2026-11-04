# Renderiza matcaps (esfera iluminada em estúdio, câmera ortográfica) para a logo WZS.
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
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Punchy"
    w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = (*cfg["mundo"], 1); bg.inputs[1].default_value = cfg.get("mundo_k", 1.0)

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

BRANCO = (1, 1, 1)
CONFIGS = [
    # neutro: cerâmica gelo, luz de estúdio limpa (reconhecimento da logo)
    {"nome": "matcap-gelo", "base": (0.86, 0.88, 0.92), "metal": 0.0, "rough": 0.28, "coat": 0.6,
     "mundo": (0.035, 0.05, 0.09), "luzes": [
        {"loc": (-2.5, -3.5, 3.2), "tam": (3, 2), "e": 900, "cor": (1, 0.98, 0.96)},
        {"loc": (3.2, -1.5, 0.8), "tam": (1, 3), "e": 350, "cor": (0.55, 0.72, 1.0)},
        {"loc": (0, 2.5, -2.5), "tam": (4, 1), "e": 260, "cor": (0.4, 0.55, 1.0)},
        {"loc": (0, -3, -3), "tam": (3, 0.6), "e": 120, "cor": (0.9, 0.92, 1.0)},
    ]},
    # Sites: cromo azulado, reflexos recortados e exatos (softboxes em faixas)
    {"nome": "matcap-sites", "base": (0.8, 0.88, 1.0), "metal": 1.0, "rough": 0.16,
     "mundo": (0.02, 0.05, 0.12), "mundo_k": 1.0, "luzes": [
        {"loc": (-2.6, -2.2, 0.6), "tam": (0.45, 5), "e": 900, "cor": (0.85, 0.93, 1.0)},
        {"loc": (2.8, -1.6, -0.2), "tam": (0.35, 5), "e": 650, "cor": (0.4, 0.72, 1.0)},
        {"loc": (-0.6, -1.4, 3.4), "tam": (2.6, 1.6), "e": 520, "cor": (1, 1, 1)},
        {"loc": (0, -2.4, -3.2), "tam": (4.5, 0.5), "e": 380, "cor": (0.45, 0.8, 1.0)},
    ]},
    # Criativos: laca quente e brilhante, luz de palco vermelha e âmbar
    {"nome": "matcap-criativos", "base": (1.0, 0.86, 0.8), "metal": 0.0, "rough": 0.18, "coat": 1.0,
     "mundo": (0.07, 0.02, 0.02), "luzes": [
        {"loc": (-2.8, -3.0, 2.4), "tam": (2.5, 2.5), "e": 900, "cor": (1.0, 0.92, 0.85)},
        {"loc": (3.0, -1.2, 0.6), "tam": (1.2, 3.5), "e": 650, "cor": (1.0, 0.3, 0.15)},
        {"loc": (-1.0, -1.0, -3.4), "tam": (3.5, 1.2), "e": 520, "cor": (1.0, 0.65, 0.2)},
        {"loc": (0, 3.0, 1.0), "tam": (4, 4), "e": 380, "cor": (1.0, 0.25, 0.35)},
    ]},
]
so = os.environ.get("SO")
for c in [c for c in CONFIGS if not so or c["nome"] == so]:
    cena(c)
print("MATCAPS_OK")
