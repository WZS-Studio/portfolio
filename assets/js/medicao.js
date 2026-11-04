// Medição das ações principais. Configure os IDs em conteudo/site.mjs (medicao) e gere as
// páginas de novo. Sem ID configurado, os eventos só vão para window.dataLayer (pronto para GTM).
// Eventos: escolha_especialidade, abrir_projeto, reproduzir_video, clique_whatsapp.
// Nunca envie dados pessoais: só nomes de especialidade, projeto, vídeo e posição do botão.

const PERMITIDOS = new Set(["especialidade", "origem", "projeto", "video", "conta", "jornada", "interesse", "posicao", "destino"]);

function carregar(src, attrs = {}) {
  const s = document.createElement("script");
  s.async = true; s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export function iniciarMedicao() {
  const cfg = window.WZS_MEDICAO || {};
  window.dataLayer = window.dataLayer || [];
  if (cfg.gtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    carregar(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtm)}`);
  }
  if (cfg.ga4) {
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", cfg.ga4, { anonymize_ip: true });
    carregar(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4)}`);
  }
  if (cfg.plausible) {
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    carregar("https://plausible.io/js/script.tagged-events.js", { "data-domain": cfg.plausible, defer: "" });
  }
}

export function medir(evento, dados = {}) {
  const limpo = {};
  for (const [k, v] of Object.entries(dados)) {
    if (PERMITIDOS.has(k) && (typeof v === "string" || typeof v === "number")) limpo[k] = String(v).slice(0, 80);
  }
  try {
    window.dataLayer?.push({ event: evento, ...limpo });
    if (typeof window.gtag === "function" && window.WZS_MEDICAO?.ga4) window.gtag("event", evento, limpo);
    if (typeof window.plausible === "function" && window.WZS_MEDICAO?.plausible) window.plausible(evento, { props: limpo });
  } catch { /* medição nunca pode quebrar a página */ }
  if (/[?&]debug-medicao\b/.test(location.search)) console.info("[medição]", evento, limpo);
}

// páginas novas (navegação sem recarregar) contam como visualização
export function medirPagina() {
  const cfg = window.WZS_MEDICAO || {};
  window.dataLayer?.push({ event: "page_view", page_path: location.pathname, page_title: document.title });
  if (typeof window.gtag === "function" && cfg.ga4) window.gtag("event", "page_view", { page_path: location.pathname, page_title: document.title });
  if (typeof window.plausible === "function" && cfg.plausible) window.plausible("pageview");
}
