// WZS Studio: portal + duas jornadas.
// As três páginas são HTML completo (funcionam sem JavaScript). Aqui entram:
// - o mundo 3D fixo, que continua vivo quando a página troca (navegação sem recarregar);
// - o portal: mover explora, clicar/tocar confirma;
// - a rolagem: cada seção pede uma cena ao mundo e os objetos da página se reorganizam;
// - estudos de caso, player de vídeo, cursor da marca e medição.
// o mundo 3D (Three.js, ~150 KB comprimido) carrega depois do conteúdo: veja iniciar()
const CORES = { deep: "#0a1220", navy: "#0f1a2b", blue: "#3b82f6", rec: "#ff4d2e" };
const suportaWebGL = () => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } };
// rede lenta ou economia de dados (Chrome/Android informam; Safari não): vídeos na versão leve
const rede = navigator.connection || {};
const redeLenta = () => !!rede.saveData || /(^|-)(2g|3g)$/.test(rede.effectiveType || "") || (rede.downlink > 0 && rede.downlink < 1.5);
const fonteVideo = (el, leve) => (leve && el.dataset.leve) || el.dataset.src;
import { iniciarCursor, cursorNoDialogo } from "./cursor.js";
import { iniciarMedicao, medir, medirPagina } from "./medicao.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
const reduz = () => mqReduce.matches;
const fino = matchMedia("(hover: hover) and (pointer: fine)");
const gsap = window.gsap, ST = window.ScrollTrigger;
if (gsap && ST) gsap.registerPlugin(ST);

let mundo = null, lenis = null, navegando = false, capVel = null;
let limpar = [];                       // funções de limpeza da página atual
const universoDe = (path) => (/\/sites\/?/.test(path) ? "sites" : /\/criativos\/?/.test(path) ? "criativos" : "portal");

// ---------------------------------------------------------------------------
function iniciar() {
  iniciarMedicao();
  const canvas = $("#mundo");
  let dados = {};
  try { dados = JSON.parse($("#dados-mundo")?.textContent || "{}"); } catch { /* sem dados */ }
  const sem3d = new URLSearchParams(location.search).get("3d") === "0";      // ?3d=0 desliga a cena
  // 2G ou economia de dados: a página fica sem a cena 3D (tudo funciona sem ela; a logo vira o desenho em SVG)
  const poupar = !!rede.saveData || /(^|-)2g$/.test(rede.effectiveType || "");
  const quer3d = canvas && !sem3d && !poupar && suportaWebGL();
  if (!quer3d) html.classList.add("sem-3d");
  else {
    canvas.style.opacity = "0";
    // o 3D só começa a baixar depois que a página aparece, com prioridade baixa (não disputa a rede com o CSS,
    // as fontes e o texto), e os módulos vão todos juntos em vez de em cascata (mundo → three → dispositivos)
    const carregar3d = () => {
      let mapa = {};
      try { mapa = JSON.parse($("script[type=importmap]")?.textContent || "{}").imports || {}; } catch { /* sem mapa */ }
      for (const m of ["three", "/assets/js/mundo.js", "/assets/js/dispositivos.js", "/assets/vendor/addons/RoomEnvironment.js", "/assets/js/cafe-forma.js"]) {
        if (!mapa[m]) continue;
        const l = Object.assign(document.createElement("link"), { rel: "modulepreload", href: mapa[m] });
        l.setAttribute("fetchpriority", "low"); document.head.appendChild(l);
      }
      import("./mundo.js").then(({ criarMundo }) => {
        mundo = criarMundo(canvas, dados);
        if (!mundo) { html.classList.add("sem-3d"); return; }
        const u = html.dataset.universo;
        mundo.setUniverso(u, { imediato: true });
        mundo.setCena(u === "portal" ? "portal" : "hero", { imediato: true });
        cenas();
        if (document.body.dataset.pagina === "portal") mundo.setAutoBalanco(!fino.matches);
        ST?.refresh();
        // a cena aparece quando os shaders terminam de compilar (veja mundo.js)
        (mundo.pronto || Promise.resolve()).then(() => {
          mundo.chegar(1.4);
          requestAnimationFrame(() => { canvas.style.transition = "opacity 1s ease"; canvas.style.opacity = "1"; });
        });
      }).catch(() => html.classList.add("sem-3d"));
    };
    if (window.requestIdleCallback) requestIdleCallback(carregar3d, { timeout: 900 }); else setTimeout(carregar3d, 200);
  }

  if (gsap && ST && !reduz() && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ST.update);
    let vel = 0, velQ = 0;
    lenis.on("scroll", (l) => { vel = Math.max(-4, Math.min(4, (l.velocity || 0) * 0.14)); });
    // a inclinação só vale no capítulo da tela (mexer numa variável do html recalcularia a página inteira)
    gsap.ticker.add(() => { vel *= 0.9; const q = Math.round(vel * 5) / 5; if (q !== velQ) { velQ = q; capVel?.style.setProperty("--vel", q); } mundo?.setVel?.(vel); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  iniciarCursor();
  ligarGlobais();
  const topo = $("#topo");
  const marcarTopo = () => topo?.classList.toggle("is-rolado", scrollY > 40 && html.dataset.universo !== "portal");
  addEventListener("scroll", marcarTopo, { passive: true }); marcarTopo();
  iniciarPagina();
  document.fonts?.ready.then(() => ST?.refresh());
}

// ---------------------------------------------------------------------------
// Eventos que valem para qualquer página (delegados no documento)
function ligarGlobais() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a, button");
    if (!a) return;

    // WhatsApp: mede antes de abrir (o link já leva a mensagem preenchida)
    if (a.dataset.zap) {
      const [jornada, interesse, posicao] = a.dataset.zap.split("|");
      medir("clique_whatsapp", { jornada, interesse, posicao });
      return;
    }
    if (a.dataset.abrirCaso) { e.preventDefault(); abrirCaso(a.dataset.abrirCaso, a); return; }
    if (a.dataset.play) { e.preventDefault(); abrirVideo(a); return; }
    if (a.hasAttribute("data-fechar")) { a.closest("dialog")?.close(); return; }

    // âncoras internas com rolagem suave
    const href = a.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      const alvo = $(href);
      if (alvo) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(alvo, { offset: -72 }); else alvo.scrollIntoView({ behavior: reduz() ? "auto" : "smooth" });
        history.replaceState(history.state, "", href);
      }
      return;
    }

    // troca de página sem recarregar (mesmo site, sem modificadores)
    if (a.tagName === "A" && href && !a.target && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !["/", "/sites/", "/criativos/"].includes(url.pathname)) return;
      e.preventDefault();
      if (url.pathname === location.pathname) { if (lenis) lenis.scrollTo(0); else scrollTo({ top: 0 }); return; }
      const destino = universoDe(url.pathname);
      const origem = a.dataset.escolha ? "portal" : a.closest("#troca") ? "alternador" : "link";
      if (destino !== "portal") medir("escolha_especialidade", { especialidade: destino, origem });
      const modo = a.dataset.escolha ? "mergulho" : "circulo";
      const r = a.getBoundingClientRect();
      navegar(url.pathname + url.hash, { modo, x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 });
    }
  });

  addEventListener("popstate", () => navegar(location.pathname, { modo: "simples", push: false }));

  // diálogos: rolagem do fundo para enquanto estão abertos
  $$("dialog").forEach((d) => {
    d.addEventListener("close", () => {
      lenis?.start(); mundo?.retomar(); cursorNoDialogo(false);
      if (d.id === "player") { const v = $("#player-video"); v.pause(); v.removeAttribute("src"); v.load(); }
      d._volta?.focus?.({ preventScroll: true });
    });
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });   // clique fora fecha
  });
}

// ---------------------------------------------------------------------------
// Navegação entre portal e jornadas mantendo o mundo 3D
async function navegar(caminho, { modo = "circulo", x = innerWidth / 2, y = innerHeight / 2, push = true } = {}) {
  if (navegando) return;
  navegando = true;
  const destino = universoDe(caminho);
  const veu = $("#veu");
  const pedido = fetch(caminho, { headers: { "X-WZS": "1" } }).then((r) => (r.ok ? r.text() : Promise.reject(r.status)));
  const cor = destino === "sites" ? CORES.blue : destino === "criativos" ? CORES.rec : CORES.navy;
  veu.style.setProperty("--vx", (x / innerWidth) * 100 + "%");
  veu.style.setProperty("--vy", (y / innerHeight) * 100 + "%");

  try {
    if (reduz() || modo === "simples") {
      veu.className = "veu"; veu.style.setProperty("--veu-1", CORES.deep); veu.style.setProperty("--veu-2", CORES.deep);
      await animar(veu, [{ opacity: 0 }, { opacity: 1 }], 220);
    } else if (modo === "mergulho" && mundo) {
      // a câmera entra na logo; a luz do universo cobre a tela no fim do mergulho
      mundo.setUniverso(destino);
      veu.className = "veu"; veu.style.setProperty("--veu-1", "#ffffff"); veu.style.setProperty("--veu-2", cor);
      document.body.style.pointerEvents = "none";
      await Promise.all([mundo.mergulhar(1.0), esperar(560).then(() => animar(veu, [{ opacity: 0 }, { opacity: 1 }], 440, "cubic-bezier(.6,0,.3,1)"))]);
    } else {
      // círculo que cresce a partir do clique, na luz do destino
      veu.className = "veu is-circulo"; veu.style.setProperty("--veu-2", destino === "portal" ? CORES.deep : mistura(cor));
      const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      await animar(veu, [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${raio}px at ${x}px ${y}px)` }], 620, "cubic-bezier(.7,0,.25,1)");
    }
    const texto = await pedido;
    trocarPagina(texto, caminho, push);
  } catch (err) {
    location.href = caminho;            // qualquer falha: navegação normal
    return;
  } finally {
    document.body.style.pointerEvents = "";
  }

  if (mundo) {
    mundo.setUniverso(destino, { imediato: modo !== "mergulho" });
    mundo.setUniverso(destino);
    mundo.setCena(destino === "portal" ? "portal" : "hero", { imediato: true });
    mundo.chegar(modo === "mergulho" ? 1.2 : 0.9);
  }
  iniciarPagina();
  const h1 = $("main h1");
  if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
  await esperar(80);
  await animar(veu, [{ opacity: 1 }, { opacity: 0 }], reduz() ? 160 : 560, "cubic-bezier(.4,0,.2,1)");
  veu.className = "veu"; veu.style.clipPath = ""; veu.style.opacity = "";
  medirPagina();
  navegando = false;
}

function trocarPagina(texto, caminho, push) {
  const novo = new DOMParser().parseFromString(texto, "text/html");
  limpar.forEach((f) => { try { f(); } catch { /* segue */ } });
  limpar = [];
  ST?.getAll().forEach((t) => t.kill());
  mundo?.setCap(null); mundo?.setMergulho(0);

  document.title = novo.title;
  for (const sel of ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]', 'meta[property="og:image"]']) {
    const a = $(sel), b = novo.querySelector(sel);
    if (a && b) for (const at of ["content", "href"]) if (b.hasAttribute(at)) a.setAttribute(at, b.getAttribute(at));
  }
  $$('script[type="application/ld+json"]').forEach((s) => s.remove());
  novo.querySelectorAll('script[type="application/ld+json"]').forEach((s) => document.head.appendChild(s.cloneNode(true)));
  html.dataset.universo = novo.documentElement.dataset.universo;
  document.body.dataset.pagina = novo.body.dataset.pagina;
  $("main").replaceWith(document.adoptNode(novo.querySelector("main")));
  $("#zapfixo").replaceWith(document.adoptNode(novo.querySelector("#zapfixo")));
  $("#topo-zap").replaceWith(document.adoptNode(novo.querySelector("#topo-zap")));
  $$("#troca a").forEach((a) => (a.dataset.ir === html.dataset.universo ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  if (push) history.pushState({ wzs: 1 }, "", caminho);
  if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0);
  if (location.hash) requestAnimationFrame(() => $(location.hash)?.scrollIntoView());
}

// ---------------------------------------------------------------------------
// Tudo que pertence à página atual (refeito a cada troca)
function iniciarPagina() {
  const pag = document.body.dataset.pagina;
  letreiros();
  revelar();
  cenas();
  pilulaTroca();
  capitulos();
  carrosseis();
  contarNumeros();
  caixas();
  vitrines();
  if (pag === "portal") portal();
  if (pag === "sites") jornadaSites();
  if (pag === "criativos") jornadaCriativos();
  barraFixa();
  avisoRolar();
  montarAntes();
  requestAnimationFrame(() => ST?.refresh());
}

// palcos dos capítulos e carrosséis: o CSS deixa o navegador pular os que estão longe (content-visibility);
// duas telas antes de chegar, o palco é montado de vez, para as imagens (lazy) já estarem prontas quando ele aparece
function montarAntes() {
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-perto"); io.unobserve(en.target); }
  }), { rootMargin: "200% 0px" });
  $$(".cap, .carrossel").forEach((s) => io.observe(s));
  limpar.push(() => io.disconnect());
}

// aviso de rolar: aparece logo na abertura e volta quando a pessoa para no meio de um capítulo; some assim que ela rola
function avisoRolar() {
  const pag = document.body.dataset.pagina;
  if (pag !== "sites" && pag !== "criativos") return;
  let el = $("#aviso-rolar");
  if (!el) {
    el = document.createElement("div"); el.id = "aviso-rolar"; el.className = "rolar"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<span class="rolar__icone"><i></i></span><span class="rolar__txt"></span>';
    document.body.appendChild(el);
  }
  const txt = $(".rolar__txt", el), toque = matchMedia("(hover: none)").matches;
  el.classList.toggle("rolar--toque", toque);
  let parado = null, ultimoY = scrollY;
  const esconder = () => el.classList.remove("is-on");
  const noFim = () => { const p = $("#planos"); return !!p && p.getBoundingClientRect().top < innerHeight * 0.9; };
  const noMeioDeCapitulo = () => $$(".cap").some((c) => { const r = c.getBoundingClientRect(); return r.top <= 1 && r.bottom > innerHeight + 60; });
  const agendar = () => {
    clearTimeout(parado);
    const topo = scrollY < 40;
    parado = setTimeout(() => {
      if (noFim() || (!topo && !noMeioDeCapitulo())) return;
      txt.textContent = topo ? (toque ? "Deslize para começar" : "Role para começar") : (toque ? "Deslize para continuar" : "Continue rolando");
      el.classList.add("is-on");
    }, topo ? 1400 : 4200);
  };
  const aoRolar = () => { if (Math.abs(scrollY - ultimoY) < 4) return; ultimoY = scrollY; esconder(); agendar(); };
  addEventListener("scroll", aoRolar, { passive: true });
  agendar();
  limpar.push(() => { removeEventListener("scroll", aoRolar); clearTimeout(parado); esconder(); });
}

// letras soltas nos títulos: cada uma entra esticada (largura 150%) e assenta na largura do universo
function letreiros() {
  $$(".passo__titulo, .expande__pergunta, .entra, .hero h1").forEach((t) => {
    if (t.dataset.letras) return;
    t.dataset.letras = "1";
    let i = 0;
    $$(".pal", t).forEach((p) => {
      if (p.querySelector(".l")) return;
      p.innerHTML = [...p.textContent].map((c) => `<span class="l" style="--li:${i++}">${c.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join("");
    });
  });
}

// textos que entram (palavras com desfoque, blocos que sobem)
function revelar() {
  const els = $$(".entra, .sobe");
  if (reduz() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-dentro")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-dentro"); io.unobserve(en.target); if (en.target.classList.contains("entra")) mundo?.pulsar(0.7); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach((e) => io.observe(e));
  limpar.push(() => io.disconnect());
}

// cada seção pede ao mundo uma cena (posição da logo, luz, objetos)
function cenas() {
  if (!mundo) return;
  const secs = $$("[data-cena]");
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) mundo.setCena(en.target.dataset.cena);
  }), { rootMargin: "-48% 0px -48% 0px" });
  secs.forEach((s) => io.observe(s));
  // o desenho do fundo acompanha a seção que cruza o meio da tela (a cor do universo não muda)
  const io2 = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, cap = el.dataset.cap;
    mundo.setTom(cap === "expande" ? (el.dataset.prox && el.dataset.prox !== "-" ? el.dataset.prox : null) : cap || el.id);
  }), { rootMargin: "-49% 0px -49% 0px" });
  $$(".cap, .sec, .hero").forEach((s) => io2.observe(s));
  limpar.push(() => { io.disconnect(); io2.disconnect(); });
}

// ---------------------------------------------------------------------------
// CAPÍTULOS: cada .cap fica preso na tela; o progresso da rolagem dentro dele troca os passos
// de texto e conduz o mundo 3D (celular, notebook, camadas). Rolagem natural, sem sequestro.
function capitulos() {
  const caps = $$(".cap");
  html.classList.remove("caps-estaticos");
  if (!caps.length) return;
  if (!ST || reduz() || html.classList.contains("sem-3d")) {
    // sem 3D ou com movimento reduzido: blocos normais, tudo visível, imagem fixa no lugar do 3D
    html.classList.add("caps-estaticos");
    $$(".passo").forEach((p) => p.classList.add("is-on"));
    $$("[data-contador]").forEach((c) => (c.textContent = c.dataset.final));
    return;
  }
  const faixa = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const glide = (x) => x * x * x * (x * (x * 6 - 15) + 10);
  let ativo = null;

  caps.forEach((cap) => {
    const nome = cap.dataset.cap;
    const passos = $$(".passo", cap), veu = $(".cap__veu", cap);
    const contador = $("[data-contador]", cap), barras = $$(".barras", cap);
    const trilhas = $$(".trilha", cap), editor = $(".editor", cap), tc = $("[data-tc]", cap);
    const linhas = $$(".ln", cap), abas = $$(".codigo__abas span", cap), rodape = $("[data-camada]", cap);
    const notif = $(".notif", cap), notifN = $$("[data-conta]", cap), notifL = $$(".notif__lista li", cap);
    const nomesCamada = $$(".passo .passo__titulo", cap).slice(1).map((h) => h.textContent);
    let passoAtual = -1;
    const aplicar = (p) => {
      let idx = -1;
      passos.forEach((el, i) => { const on = p >= +el.dataset.de && p < +el.dataset.ate; el.classList.toggle("is-on", on); if (on) idx = i; });
      if (idx !== passoAtual) { if (passoAtual !== -1 && idx !== -1) mundo?.pulsar(1); passoAtual = idx; }
      // editor de vídeo: cada trilha entra na sua faixa; a agulha corre pela linha do tempo
      if (trilhas.length) {
        trilhas.forEach((tr, i) => tr.classList.toggle("is-on", p >= 0.12 + i * 0.14));
        editor.style.setProperty("--prog", Math.min(1, p / 0.9).toFixed(3));
        const seg = Math.min(40, p / 0.9 * 40); tc.textContent = "00:00:" + String(Math.floor(seg)).padStart(2, "0");
      }
      // editor de código: as linhas de cada camada são "digitadas" dentro da faixa dela
      if (linhas.length) {
        let atual = null;
        linhas.forEach((ln) => {
          const i = +ln.dataset.i, j = +ln.dataset.j, n = +ln.dataset.n, ini = 0.12 + i * 0.14, dur = 0.11;
          const k = (p - ini) / dur * n - j;
          ln.classList.toggle("is-on", k > 0);
          // só escreve quando o valor muda (cada escrita obriga o navegador a recalcular o estilo)
          const tv = Math.max(0, Math.min(1, k)).toFixed(2);
          if (ln._t !== tv) { ln._t = tv; ln.style.setProperty("--t", tv); }
          if (k > 0 && k < 1) atual = ln;
        });
        linhas.forEach((ln) => ln.classList.toggle("is-atual", ln === atual));
        const cam = Math.max(0, Math.min(abas.length - 1, Math.floor((p - 0.12) / 0.14)));
        abas.forEach((a, i) => a.classList.toggle("is-on", i === cam && p >= 0.12));
        if (rodape) rodape.textContent = p < 0.12 ? "pronto para começar" : nomesCamada[cam] || "";
      }
      // reel viralizando: a pílula vermelha conta até 99+ e as notificações chegam
      if (notif) {
        notif.classList.toggle("is-on", p > 0.26);
        const k = Math.max(0, Math.min(1, (p - 0.28) / 0.5));
        notifN.forEach((b, i) => { const n = Math.floor(99 * Math.min(1, k * (1.25 - i * 0.12))); b.textContent = n >= 99 ? "99+" : String(n); });
        notifL.forEach((li) => li.classList.toggle("is-on", p >= +li.dataset.de));
      }
      if (nome === "expande") {
        // 1ª metade: a logo cresce e a câmera entra nela; no meio a luz cobre a tela;
        // 2ª metade: a luz se abre já mostrando a próxima cena
        const prox = cap.dataset.prox;
        if (p < 0.5) { mundo?.setCena("hero"); mundo?.setCap(null); mundo?.setMergulho(glide(p / 0.5) * 0.92); }
        else {
          // a luz se abre já no fundo do próximo capítulo, mas sem os aparelhos: eles só entram quando o capítulo começa
          mundo?.setMergulho(0);
          mundo?.setCena(prox && prox !== "-" ? (/oportunidade/.test(prox) ? "globo" : "fundo") : "leitura");
          mundo?.setCap(null);
        }
        if (veu) veu.style.opacity = p < 0.5 ? faixa(p, 0.22, 0.5).toFixed(3) : (1 - faixa(p, 0.58, 0.96)).toFixed(3);
      } else {
        mundo?.setCena(cap.dataset.cena);
        mundo?.setCap(nome, p);
      }
      if (contador) {
        const k = faixa(p, 0.56, 0.9), n = +contador.dataset.contador * (1 - Math.pow(1 - k, 3));
        contador.textContent = k >= 1 ? contador.dataset.final : n >= 1000 ? Math.round(n / 1000) + " mil" : Math.round(n).toString();
      }
      barras.forEach((b) => b.style.setProperty("--p", faixa(p, 0.62, 0.74).toFixed(3)));
    };
    const st = ST.create({
      trigger: cap, start: "top top", end: "bottom bottom",
      onUpdate: (self) => { if (self.isActive) aplicar(self.progress); },
      onToggle: (self) => {
        if (self.isActive) { ativo = cap; capVel = cap; aplicar(self.progress); mundo?.pulsar(1.15); }
        else { passos.forEach((el) => el.classList.remove("is-on")); passoAtual = -1; if (capVel === cap) { cap.style.setProperty("--vel", 0); capVel = null; } if (ativo === cap) { ativo = null; mundo?.setCap(null); mundo?.setMergulho(0); if (veu) veu.style.opacity = "0"; } }
      },
    });
    limpar.push(() => st.kill());
  });
  limpar.push(() => { mundo?.setCap(null); mundo?.setMergulho(0); });
}

// carrossel 3D: a rolagem passa os cartões; o do centro cresce e (no computador) toca sem som
function carrosseis() {
  $$(".carrossel").forEach((sec) => {
    const trilho = $(".carrossel__trilho", sec), cards = $$(".cart", sec);
    if (!trilho || !cards.length) return;
    let centro = null, previa = null;
    const tocarCentro = (c) => {
      if (centro === c) return;
      centro = c; cards.forEach((x) => x.classList.toggle("is-centro", x === c));
      if (previa) { previa.pause(); previa.remove(); previa = null; }
      const tela = c && $(".cart__tela", c);
      if (!tela || reduz() || !fino.matches) return;
      previa = Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true, preload: "metadata", src: fonteVideo(tela, true) });
      previa.setAttribute("muted", ""); previa.setAttribute("aria-hidden", "true");
      tela.insertBefore(previa, tela.firstChild.nextSibling);
      previa.play().then(() => tela.classList.add("is-previa")).catch(() => { });
    };
    const aplicar = (p0) => {
      const p = st2 ? st2.progress : 0;
      const max = trilho.scrollWidth - innerWidth;
      trilho.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
      const meio = innerWidth / 2; let perto = null, dmin = 1e9;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect(), d = (r.left + r.width / 2 - meio) / innerWidth;
        const ad = Math.min(1, Math.abs(d) * 1.6);
        c.style.transform = `rotateY(${(-d * 38).toFixed(1)}deg) translateZ(${(-ad * 160).toFixed(0)}px) scale(${(1.08 - ad * 0.22).toFixed(3)})`;
        c.style.filter = `brightness(${(1 - ad * 0.45).toFixed(2)})`;
        if (Math.abs(d) < dmin) { dmin = Math.abs(d); perto = c; }
      });
      tocarCentro(perto);
    };
    if (!ST || reduz()) return;
    let ativo = false, st2 = null;
    const st = ST.create({ trigger: sec, start: "top bottom", end: "bottom top", onUpdate: (x) => { if (ativo) aplicar(x.progress); }, onToggle: (x) => { ativo = x.isActive; if (!ativo) tocarCentro(null); } });
    st2 = ST.create({ trigger: sec, start: "top top", end: "bottom bottom", onUpdate: (x) => { if (ativo) aplicar(x.progress); } });
    limpar.push(() => st2.kill());
    limpar.push(() => { st.kill(); tocarCentro(null); });
  });
}

// números que contam até o valor quando aparecem
function contarNumeros() {
  const els = $$("[data-contar]");
  if (!els.length || reduz()) return;
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, txt = el.dataset.contar, m = txt.match(/[\d.,]+/);
    if (!m) return;
    const alvo = parseFloat(m[0].replace(/\./g, "").replace(",", ".")), casas = (m[0].split(",")[1] || "").length, t0 = performance.now();
    const passo = (now) => {
      const k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
      const v = (alvo * e).toFixed(casas).replace(".", ",");
      el.textContent = txt.replace(m[0], k < 1 ? v : m[0]);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    mundo?.pulsar(0.6);
  }), { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
  limpar.push(() => io.disconnect());
}

// caixas 3D dos planos: inclinam com o mouse e o botão solta corações, dinheiro ou código
const FORMAS = {
  coracoes: ['<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="#ff3040"/></svg>', '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="#ff7aa2"/></svg>'],
  // cédulas de verdade (frente das notas de R$ 100 e R$ 50, imagens do Banco Central)
  dinheiro: ['<img class="estouro__nota" src="/media/tex/cedula-100.webp" alt="">', '<img class="estouro__nota" src="/media/tex/cedula-50.webp" alt="">', '<img class="estouro__nota" src="/media/tex/cedula-100.webp" alt="">'],
  codigo: ['<svg viewBox="0 0 30 20"><text x="15" y="15" font-size="14" font-weight="700" text-anchor="middle" fill="#8fd3ff" font-family="monospace">&lt;/&gt;</text></svg>', '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" fill="none" stroke="#3ddc97" stroke-width="3" stroke-linecap="round"/></svg>', '<svg viewBox="0 0 30 20"><text x="15" y="15" font-size="14" font-weight="700" text-anchor="middle" fill="#ffcb6b" font-family="monospace">{ }</text></svg>'],
};
function estourar(el, tipo, qtd = 16, forca = 1) {
  if (reduz() || !el) return;
  const r = el.getBoundingClientRect(), formas = FORMAS[tipo] || FORMAS.coracoes;
  for (let i = 0; i < qtd; i++) {
    const p = document.createElement("span"); p.className = "estouro"; p.setAttribute("aria-hidden", "true");
    p.innerHTML = formas[i % formas.length];
    const x0 = r.left + r.width * (0.2 + Math.random() * 0.6), y0 = r.top + r.height / 2;
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5, dist = (110 + Math.random() * 220) * forca, s = 0.7 + Math.random() * 1.1;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist, rot = (Math.random() - 0.5) * 120;
    document.body.appendChild(p);
    p.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(.3) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${x0 + dx}px, ${y0 + dy}px) scale(${s}) rotate(${rot}deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${x0 + dx * 1.15}px, ${y0 + dy + 90}px) scale(${s * 0.8}) rotate(${rot * 1.5}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).finished.then(() => p.remove()).catch(() => p.remove());
  }
}
function caixas() {
  $$(".caixa").forEach((cx, i) => {
    const tipo = cx.dataset.efeito, cta = $(".plano__cta", cx), box = $(".caixa__3d", cx), boca = $(".caixa__miolo", cx);
    let jorro = null;
    const soltar = (qtd, forca) => estourar(boca, tipo, qtd, forca);
    // tampa aberta: a luz sobe e o que está dentro (corações, dinheiro, código) não para de sair
    const abrir = (on) => {
      if (cx.classList.contains("is-aberta") === on) return;
      cx.classList.toggle("is-aberta", on);
      clearInterval(jorro); jorro = null;
      if (on && !reduz()) { setTimeout(() => soltar(16, 1.1), 180); jorro = setInterval(() => soltar(2, 0.9), 240); mundo?.pulsar(0.8); }
    };
    const mover = (e) => { if (!fino.matches || reduz()) return; const r = cx.getBoundingClientRect(); box.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 18).toFixed(1) + "deg"); box.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(1) + "deg"); };
    cx.addEventListener("pointermove", mover);
    cx.addEventListener("pointerenter", () => { if (fino.matches) cx.classList.add("is-espia"); });
    cx.addEventListener("pointerleave", () => { box.style.setProperty("--ry", "0deg"); box.style.setProperty("--rx", "0deg"); cx.classList.remove("is-espia"); abrir(false); });
    cta?.addEventListener("pointerenter", () => abrir(true));
    cta?.addEventListener("focus", () => abrir(true));
    cta?.addEventListener("blur", () => abrir(false));
    cta?.addEventListener("pointerdown", () => soltar(30, 1.5));
    // ao aparecer, a tampa dá uma piscada e escapa um pouco do que tem dentro;
    // no celular (sem mouse) a caixa abre sozinha quando chega ao meio da tela
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting || cx.dataset.piscou) return;
      cx.dataset.piscou = "1";
      setTimeout(() => { if (reduz()) return; cx.classList.add("is-espia"); soltar(8, 0.8); setTimeout(() => { if (!cx.matches(":hover")) cx.classList.remove("is-espia"); }, 950); }, 420 + i * 320);
    }), { threshold: 0.45 });
    io.observe(cx);
    let io2 = null;
    if (!fino.matches) { io2 = new IntersectionObserver((ents) => ents.forEach((en) => abrir(en.isIntersecting)), { rootMargin: "-32% 0px -32% 0px" }); io2.observe(cx); }
    limpar.push(() => { clearInterval(jorro); io.disconnect(); io2?.disconnect(); });
  });
}

// celulares atrás das caixas (Criativos): o vídeo só carrega perto da tela e pausa quando sai dela
function vitrines() {
  $$(".vitrine video").forEach((v) => {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) { v.pause(); return; }
      if (!v.src) { if (v.dataset.poster) v.poster = v.dataset.poster; v.src = v.dataset.src; }
      if (!reduz()) v.play().catch(() => {});
    }, { rootMargin: "240px 0px" });
    io.observe(v);
    limpar.push(() => { io.disconnect(); v.pause(); });
  });
}

function pilulaTroca() {
  const nav = $("#troca"), pil = $(".troca__pilula", nav);
  if (!nav || !pil) return;
  const pos = () => {
    const a = $('a[aria-current="page"]', nav);
    if (!a) { pil.style.opacity = "0"; return; }
    pil.style.opacity = "1"; pil.style.width = a.offsetWidth + "px"; pil.style.transform = `translateX(${a.offsetLeft}px)`;
    pil.style.background = html.dataset.universo === "criativos" ? "#ffd2c6" : "#d6e6ff";
  };
  pos();
  const ro = new ResizeObserver(pos); ro.observe(nav);
  limpar.push(() => ro.disconnect());
}

function barraFixa() {
  const barra = $("#zapfixo"), hero = $(".hero"), contato = $("#contato");
  if (!barra || !hero) return;
  let passouHero = false, noContato = false;
  const cheios = new Set();
  const at = () => barra.classList.toggle("is-on", passouHero && !noContato && !cheios.size);
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.target === hero) passouHero = !en.isIntersecting;
    if (en.target === contato) noContato = en.isIntersecting;
    at();
  }), { threshold: 0.05 });
  io.observe(hero); if (contato) io.observe(contato);
  const io2 = new IntersectionObserver((ents) => { ents.forEach((en) => (en.isIntersecting ? cheios.add(en.target) : cheios.delete(en.target))); at(); }, { rootMargin: "0px" });
  $$(".cap, .carrossel, #planos").forEach((el) => io2.observe(el));
  limpar.push(() => { io.disconnect(); io2.disconnect(); });
}

// ---------------------------------------------------------------------------
// PORTAL: mover explora, clique/toque confirma
function portal() {
  const tela = $("#portal");
  if (!tela) return;
  const lados = $$(".lado", tela);
  const marcar = (u) => {
    lados.forEach((l) => l.classList.toggle("is-ativo", l.dataset.escolha === u));
    tela.classList.toggle("tem-foco", !!u);
    $("#cursor")?.style.setProperty("--cur", u === "criativos" ? "#ff8a73" : u === "sites" ? "#8fc1ff" : "");
  };
  const curva = (v) => Math.sign(v) * Math.min(1, Math.pow(Math.max(0, Math.abs(v) - 0.06) / 0.7, 0.85));
  const emPe = () => innerWidth / innerHeight < 0.9 || innerWidth <= 760;
  const aplicar = (v) => {
    const l = curva(v);
    mundo?.setLean(l);
    marcar(l < -0.15 ? "criativos" : l > 0.15 ? "sites" : null);
  };
  mundo?.setAutoBalanco(!fino.matches);

  const mover = (e) => {
    if (e.pointerType !== "mouse") return;
    aplicar(emPe() ? (e.clientY / innerHeight) * 2 - 1 : (e.clientX / innerWidth) * 2 - 1);
  };
  const sair = () => { mundo?.setLean(0); marcar(null); };
  // toque: o dedo que passa por um dos lados antecipa aquele universo (sem navegar)
  const toque = (e) => {
    const t = e.touches[0]; if (!t) return;
    const r = tela.getBoundingClientRect();
    if (t.clientY < r.top || t.clientY > r.bottom) return;
    aplicar(emPe() ? ((t.clientY - r.top) / r.height) * 2 - 1 : (t.clientX / r.width) * 2 - 1);
  };
  const fimToque = () => setTimeout(() => { mundo?.setLean(0); marcar(null); }, 900);
  const foco = (e) => { const u = e.target.closest(".lado")?.dataset.escolha; if (!u) return; mundo?.setLean(u === "sites" ? 0.9 : -0.9); marcar(u); };
  const teclas = (e) => {
    if (!e.target.closest(".lado")) return;
    const ant = emPe() ? "ArrowUp" : "ArrowLeft", prox = emPe() ? "ArrowDown" : "ArrowRight";
    if (e.key === ant) { lados[0].focus(); e.preventDefault(); }
    if (e.key === prox) { lados[1].focus(); e.preventDefault(); }
  };
  tela.addEventListener("pointermove", mover);
  tela.addEventListener("pointerleave", sair);
  tela.addEventListener("touchstart", toque, { passive: true });
  tela.addEventListener("touchmove", toque, { passive: true });
  tela.addEventListener("touchend", fimToque, { passive: true });
  tela.addEventListener("focusin", foco);
  tela.addEventListener("focusout", (e) => { if (!tela.contains(e.relatedTarget)) sair(); });
  tela.addEventListener("keydown", teclas);
  limpar.push(() => { mundo?.setAutoBalanco(false); marcar(null); });

  // entrada: as duas palavras chegam dos lados (só na primeira visita da sessão)
  if (gsap && !reduz()) {
    let visto = false;
    try { visto = sessionStorage.getItem("wzs:portal") === "1"; sessionStorage.setItem("wzs:portal", "1"); } catch { /* ok */ }
    const d = visto ? 0.5 : 1;
    gsap.from(".lado--criativos .lado__palavra", { xPercent: -14, opacity: 0, filter: "blur(12px)", duration: 1.1 * d, ease: "expo.out", delay: 0.15 * d });
    gsap.from(".lado--sites .lado__palavra", { xPercent: 14, opacity: 0, filter: "blur(12px)", duration: 1.1 * d, ease: "expo.out", delay: 0.25 * d });
    gsap.from(".lado__num, .lado__sub, .lado__texto, .lado__cta, .portal__titulo, .portal__dica", { y: 14, opacity: 0, duration: 0.8 * d, ease: "power3.out", stagger: 0.04, delay: 0.45 * d, clearProps: "all" });
  }
}

// ---------------------------------------------------------------------------
// SITES: telas que se aproximam, camadas que se separam, linha do git que acende
function jornadaSites() {
  if (!gsap || !ST || reduz()) { $$(".gitlog li").forEach((l) => l.classList.add("is-feito")); return; }

  $$(".proj").forEach((pj) => {
    const mesa = $(".proj__mesa", pj), cel = $(".disp--cel", pj);
    const lado = pj.classList.contains("proj--destaque") ? 0 : ($$(".proj").indexOf(pj) % 2 ? -1 : 1);
    gsap.fromTo(mesa,
      { rotateX: 24, rotateY: 16 * lado, rotateZ: -2 * lado, z: -180, scale: 0.9, opacity: 0.4, transformOrigin: "50% 70%" },
      { rotateX: 0, rotateY: 0, rotateZ: 0, z: 0, scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: pj, start: "top 98%", end: "top 28%", scrub: 0.6 } });
    if (cel) gsap.fromTo(cel, { yPercent: 34, xPercent: 18 * (lado || 1), rotate: 7 * (lado || 1), z: 80 },
      { yPercent: -4, xPercent: 0, rotate: 0, z: 80, ease: "none", scrollTrigger: { trigger: pj, start: "top 92%", end: "center 42%", scrub: 0.8 } });
  });

  const cena = $("#anat-cena");
  if (cena) {
    const camadas = $$(".camada", cena);
    ST.create({
      trigger: "#anatomia .anat", start: "top 78%", end: "bottom 40%", scrub: 0.7,
      onUpdate: (st) => {
        const p = st.progress;
        camadas.forEach((c, i) => c.style.setProperty("--z", (i * (8 + 64 * p)).toFixed(1)));
        cena.style.transform = `rotateX(${56 + 6 * p}deg) rotateZ(${-32 - 10 * p}deg) translateY(${-p * 30}px)`;
      },
    });
  }

  const log = $("#gitlog");
  if (log) {
    const itens = $$("li", log);
    ST.create({
      trigger: log, start: "top 70%", end: "bottom 55%", scrub: true,
      onUpdate: (st) => {
        log.style.setProperty("--prog", st.progress.toFixed(3));
        itens.forEach((li, i) => li.classList.toggle("is-feito", st.progress >= i / Math.max(1, itens.length - 1) - 0.02));
      },
    });
  }
}

// ---------------------------------------------------------------------------
// CRIATIVOS: vídeos que surgem como peças de uma composição; linha do tempo de edição
function jornadaCriativos() {
  previas();
  if (!gsap || !ST || reduz()) { $$(".passos li").forEach((l) => l.classList.add("is-ativo")); return; }

  $$(".colagem").forEach((col) => {
    const vids = $$(".vid", col);
    gsap.set(vids, { opacity: 0 });
    ST.batch(vids, {
      start: "top 94%", once: true,
      onEnter: (lote) => gsap.fromTo(lote,
        { opacity: 0, y: 90, z: -260, rotateX: 22, rotateZ: (i) => (i % 2 ? 7 : -6), scale: 0.9 },
        { opacity: 1, y: 0, z: 0, rotateX: 0, rotateZ: 0, scale: 1, duration: 1.15, ease: "expo.out", stagger: 0.09, clearProps: "transform" }),
    });
  });

  const ed = $("#edicao"), passos = $$("#passos li");
  if (ed) ST.create({
    trigger: ed, start: "top 75%", end: "bottom 25%", scrub: 0.5,
    endTrigger: "#passos",
    onUpdate: (st) => {
      ed.style.setProperty("--prog", st.progress.toFixed(3));
      const ativo = Math.min(passos.length - 1, Math.floor(st.progress * passos.length));
      passos.forEach((p, i) => p.classList.toggle("is-ativo", i <= ativo));
    },
  });
}

// prévia muda ao passar o mouse (um vídeo por vez, só no computador)
function previas() {
  if (!fino.matches || reduz()) return;
  let atual = null, timer = 0;
  const parar = () => {
    clearTimeout(timer);
    if (atual) { const v = $("video", atual); v?.pause(); v?.remove(); atual.classList.remove("is-previa"); atual = null; }
  };
  const entrar = (e) => {
    const b = e.target.closest?.(".vid__tela"); if (!b || b === atual || b.closest(".cart")) return;
    parar();
    timer = setTimeout(() => {
      atual = b;
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto", src: fonteVideo(b, true) });
      v.setAttribute("aria-hidden", "true"); v.setAttribute("muted", "");
      b.insertBefore(v, b.firstChild.nextSibling);
      v.play().then(() => b.classList.add("is-previa")).catch(() => { });
    }, 380);
  };
  const sair = (e) => { const b = e.target.closest?.(".vid__tela"); if (b && !b.contains(e.relatedTarget)) parar(); };
  const main = $("main");
  main.addEventListener("pointerover", entrar);
  main.addEventListener("pointerout", sair);
  limpar.push(() => { parar(); main.removeEventListener("pointerover", entrar); main.removeEventListener("pointerout", sair); });
}

// ---------------------------------------------------------------------------
function abrirDialogo(d) {
  lenis?.stop(); mundo?.pausar();
  d.showModal();
  cursorNoDialogo(true);
}

function abrirVideo(botao) {
  const d = $("#player"), v = $("#player-video");
  $$(".vid__tela.is-previa video").forEach((x) => x.pause());
  $("#player-conta").textContent = botao.dataset.conta || "";
  $("#player-leg").textContent = botao.dataset.titulo || "";
  v.src = fonteVideo(botao, redeLenta());
  v.poster = $("img", botao)?.currentSrc || "";
  d._volta = botao;
  abrirDialogo(d);
  v.muted = false;
  v.play().catch(() => { });          // começou por um clique: pode tocar com som
  medir("reproduzir_video", { video: botao.dataset.play, conta: botao.dataset.conta, jornada: "criativos" });
}

function abrirCaso(slug, botao) {
  const tpl = $("#caso-" + slug), d = $("#caso"), corpo = $("#caso-corpo");
  if (!tpl || !d) return;
  corpo.replaceChildren(tpl.content.cloneNode(true));
  corpo.scrollTop = 0;
  $("#caso-rotulo").textContent = "Estudo de caso · " + ($("h2", corpo)?.textContent || "");
  d._volta = botao;
  abrirDialogo(d);
  $(".fechar", d)?.focus();
  medir("abrir_projeto", { projeto: slug });
}

// ---------------------------------------------------------------------------
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
function animar(el, quadros, dur, easing = "ease") {
  if (!el.animate) { Object.assign(el.style, quadros[quadros.length - 1]); return Promise.resolve(); }
  const a = el.animate(quadros, { duration: dur, easing, fill: "forwards" });
  return a.finished.then(() => { Object.assign(el.style, quadros[quadros.length - 1]); a.cancel(); }).catch(() => { });
}
function mistura(hex) {               // cor do destino escurecida para o círculo de travessia
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, k = 0.28;
  const d = [10, 18, 32];
  return `rgb(${Math.round(d[0] + (r - d[0]) * k)}, ${Math.round(d[1] + (g - d[1]) * k)}, ${Math.round(d[2] + (b - d[2]) * k)})`;
}

iniciar();
