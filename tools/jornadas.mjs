// Páginas das duas jornadas, contadas em capítulos:
// abertura → a logo expande → o problema → como eu faço → resultado → números → trabalhos → oportunidade → planos.
// Cada capítulo (.cap) fica preso na tela enquanto a pessoa rola; os passos (.passo) trocam por faixa de
// rolagem (data-de / data-ate) e o mundo 3D recebe o mesmo progresso (data-cap).
export function criarJornadas(h) {
  const { esc, rico, palavras, zap, ico, img, lista, marca, whatsapp, sites, criativos, vagas, faqHtml, casoHtml, doc, orgLd, faqLd, dadosMundo, hv } = h;
  const n2 = (k) => String(k).padStart(2, "0");

  const passo = (de, ate, html, cls = "") => `<div class="passo${cls ? " " + cls : ""}" data-de="${de}" data-ate="${ate}">${html}</div>`;
  const faixas = (n, ini = 0, fim = 1) => Array.from({ length: n }, (_, i) => [ini + ((fim - ini) * i) / n, i === n - 1 ? 1.01 : ini + ((fim - ini) * (i + 1)) / n].map((x) => x.toFixed(3)));
  const titulo = (t, texto, tag = "h3", id = "") => `<${tag} class="passo__titulo display"${id ? ` id="${id}"` : ""}>${palavras(t)}</${tag}>${texto ? `<p class="passo__texto">${rico(texto)}</p>` : ""}`;
  const numero = (x) => `<p class="passo__num display" style="--n:${[...String(x.numero)].length}">${esc(x.numero)}</p><p class="passo__texto">${rico(x.texto)}</p>${x.fonte ? `<p class="passo__fonte">${esc(x.fonte)}</p>` : ""}`;
  // selo da parceria de hospedagem: "mini" dentro de um capítulo, completo (com texto e botão) abaixo dos planos
  const selo = (pc, mini) => !pc ? "" : `<aside class="parceria${mini ? " parceria--mini" : " sobe"}" aria-label="${esc(pc.rotulo)}: WZS Studio e ${esc(pc.nome)}">
  <span class="parceria__selo" aria-hidden="true"><svg viewBox="0 0 424 422"><use href="#wzs-mark"/></svg><span class="parceria__x">×</span><img class="parceria__logo" src="${esc(pc.logo)}" alt="" width="536" height="138" decoding="async"></span>
  ${mini ? `<span class="parceria__txt"><b class="parceria__mini">${esc(pc.rotulo)}</b></span>`
    : `<div class="parceria__txt"><p class="parceria__titulo display">${esc(pc.rotulo)}</p><p class="parceria__texto">${rico(pc.texto)}</p></div>`}
</aside>`;
  const passos = (lista_, id) => { const f = faixas(lista_.length); return lista_.map((x, i) => passo(f[i][0], f[i][1], (x.numero ? numero(x) : titulo(x.titulo, x.texto, i ? "h3" : "h2", i ? "" : id)) + (x.parceria ? selo(sites.parceria, true) : ""))).join(""); };
  const camadasPassos = (cm, id) => passo("0", "0.120", `<h2 class="passo__titulo display" id="${id}">${palavras(cm.titulo)}</h2>`)
    + cm.camadas.map((c, i) => passo((0.12 + i * 0.14).toFixed(3), (i === cm.camadas.length - 1 ? 1.01 : 0.26 + i * 0.14).toFixed(3),
      `<p class="passo__n mono">${n2(i + 1)} / ${n2(cm.camadas.length)}${c.trilha ? ` · trilha ${esc(c.trilha)}` : c.arquivo ? ` · ${esc(c.arquivo)}` : ""}</p><h3 class="passo__titulo display">${esc(c.nome)}</h3><p class="passo__texto">${rico(c.texto)}</p>`)).join("");

  const capitulo = ({ id, cap, altura, cena, alt, rotulo, rotuloId, conteudo, extra = "", cls = "" }) => `
<section class="cap${cls ? " " + cls : ""}" id="${id}" data-cap="${cap}" data-cena="${cena}" style="--altura:${altura}"${rotuloId ? ` aria-labelledby="${rotuloId}"` : ""}>
  <div class="cap__palco">
    ${alt ? `<figure class="cap__alt" aria-hidden="true">${img(alt, "")}</figure>` : ""}
    ${rotulo ? `<p class="cap__rotulo rotulo"><b>${esc(rotulo)}</b></p>` : ""}
    <div class="cap__texto">${conteudo}</div>
    ${extra}
  </div>
</section>`;

  const expande = (id, pergunta, prox) => `
<section class="cap cap--expande" id="${id}" data-cap="expande" data-prox="${prox || "-"}" data-cena="hero" style="--altura:190">
  <div class="cap__palco">
    <div class="cap__veu" aria-hidden="true"></div>
    <div class="cap__texto cap__texto--centro">${passo("0.300", "1.010", `<p class="expande__pergunta display">${palavras(pergunta)}</p>`)}</div>
  </div>
</section>`;

  // ---------- editor de vídeo (camadas de verdade) ----------
  const ondas = Array.from({ length: 64 }, (_, i) => `<i style="--h:${(18 + Math.abs(Math.sin(i * 1.7)) * 70 + (i % 7) * 3).toFixed(0)}%"></i>`).join("");
  const editorReel = (cm) => `
<div class="editor" aria-hidden="true">
  <div class="editor__topo"><span class="editor__rec">● REC</span><b>${esc(cm.arquivo || "reel.mp4")}</b><span class="editor__tc" data-tc>00:00:00</span></div>
  <div class="editor__corpo">
    <div class="editor__regua">${["0s", "3s", "10s", "20s", "30s", "40s"].map((t, i) => `<span style="left:${[0, 7.5, 25, 50, 75, 100][i]}%">${t}</span>`).join("")}</div>
    <div class="editor__trilhas">
      <div class="trilha" data-i="0"><span class="trilha__n">V1</span><div class="trilha__pista"><div class="clip clip--v">${lista(cm.quadros, (q) => `<i style="background-image:url(${esc(q)})"></i>`)}</div></div></div>
      <div class="trilha" data-i="1"><span class="trilha__n">T1</span><div class="trilha__pista"><div class="clip clip--t" style="--x:0%;--w:16%"><b>T</b>FA: DÁ PRA VIVER ANOS. FV: MINUTOS.</div></div></div>
      <div class="trilha" data-i="2"><span class="trilha__n">TXT</span><div class="trilha__pista">${["ele se mexe…", "mas não", "bombeia", "sangue", "comenta", "A ou B"].map((w, i) => `<div class="clip clip--l" style="--x:${8 + i * 13}%;--w:11%">${w}</div>`).join("")}</div></div>
      <div class="trilha" data-i="3"><span class="trilha__n">A1</span><div class="trilha__pista"><div class="clip clip--a"><span class="ondas">${ondas}</span><b>trilha + efeitos</b></div></div></div>
      <div class="trilha" data-i="4"><span class="trilha__n">FX</span><div class="trilha__pista"><div class="clip clip--fx" style="--x:82%;--w:18%">Comenta A ou B 👇</div></div></div>
    </div>
    <span class="editor__cabeca"></span>
  </div>
</div>`;

  // ---------- editor de código (o site sendo escrito) ----------
  const realce = (l) => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/("[^"]*")/g, '<i class="st">$1</i>')
    .replace(/(&lt;\/?[a-z0-9]+)/g, '<i class="tg">$1</i>')
    .replace(/(@media|:root)/g, '<i class="kw">$1</i>')
    .replace(/(--[a-z]+|#[0-9a-f]{6}|\b\d+px\b)/g, '<i class="vr">$1</i>');
  const codigoSite = (cm) => `
<div class="codigo" aria-hidden="true">
  <div class="codigo__abas">${lista(cm.camadas, (c, i) => `<span data-i="${i}">${esc(c.arquivo)}</span>`)}</div>
  <div class="codigo__corpo">${cm.camadas.map((c, i) => c.codigo.map((l, j) => `<div class="ln" data-i="${i}" data-j="${j}" data-n="${c.codigo.length}"><em>${n2(i * 4 + j + 1)}</em><code>${realce(l)}</code></div>`).join("")).join("")}</div>
  <div class="codigo__rodape"><span>● salvo</span><span data-camada>${esc(cm.camadas[0].nome)}</span></div>
</div>`;

  // ---------- notificações do reel viralizando ----------
  const svg = { coracao: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/></svg>', pessoa: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c1-4.4 4.4-6.5 8-6.5s7 2.1 8 6.5z" fill="currentColor"/></svg>', balao: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 1 3.6 6.7L4 20l1.2-3.4A8 8 0 0 1 4 12z" fill="currentColor"/></svg>' };
  const notifSucesso = `
<div class="notif" aria-hidden="true">
  <div class="notif__pilula"><span>${svg.coracao}<b data-conta="99">0</b></span><span>${svg.pessoa}<b data-conta="99">0</b></span><span>${svg.balao}<b data-conta="99">0</b></span></div>
  <ul class="notif__lista">
    <li data-de="0.34">${svg.coracao}<span><b>99+ pessoas</b> curtiram seu reel</span></li>
    <li data-de="0.48">${svg.pessoa}<span><b>99+ novos seguidores</b> nesta hora</span></li>
    <li data-de="0.62">${svg.balao}<span><b>99+ comentários</b> esperando resposta</span></li>
  </ul>
</div>`;

  // ---------- carrossel 3D ----------
  const carrossel = ({ id, cena, rotulo, titulo, itens, card, extra = "" }) => `
<section class="sec carrossel" id="${id}" data-cena="${cena}" style="--n:${itens.length}" aria-labelledby="t-${id}">
  <div class="carrossel__palco">
    <header class="carrossel__cab"><p class="rotulo"><b>${esc(rotulo)}</b></p><h2 class="display" id="t-${id}">${palavras(titulo)}</h2></header>
    <div class="carrossel__trilho">${itens.map(card).join("")}</div>
    <p class="carrossel__dica mono" aria-hidden="true">role para passar <span>→</span></p>
    ${extra}
  </div>
</section>`;
  const cartVideo = (v) => `
<article class="cart" data-video="${esc(v.id)}">
  <button class="cart__tela vid__tela" type="button" data-play="${esc(v.id)}" data-src="${esc(v.arquivo)}" data-titulo="${esc(v.titulo)}" data-conta="${esc(v.conta)}" data-cursor="Reproduzir" aria-label="Reproduzir vídeo: ${esc(v.titulo)} (${esc(v.conta)})">
    ${img(v.poster, "", { cls: "vid__poster" })}
    <span class="cart__ui"><span class="cart__conta"><i></i>${esc(v.conta)}</span><span class="cart__titulo">${esc(v.titulo)}</span></span>
    ${v.selo ? `<span class="cart__selo">${esc(v.selo)}</span>` : ""}
    <span class="vid__play"><i>${ico("play", "ico ico--fill")}</i>Assistir</span>
  </button>
  ${v.metricas?.length ? `<p class="cart__met">${lista(v.metricas.filter((m) => m.valor), (m) => `<span><b>${esc(m.valor)}</b> ${esc(m.tipo)}</span>`)}</p>` : `<p class="cart__met cart__met--vazio">${esc(v.objetivo || "")}</p>`}
</article>`;
  const cartSite = (pj) => `
<article class="cart cart--site" data-projeto="${pj.slug}">
  <button class="cart__janela" type="button" data-abrir-caso="${pj.slug}" data-cursor="Ver projeto" aria-label="Abrir o estudo de caso: ${esc(pj.nome)}">
    <span class="cart__barra"><i></i><i></i><i></i><em>${esc((pj.url || pj.slug).replace(/^https?:\/\//, ""))}</em></span>
    ${img(pj.capturas?.desktop?.[0], `${pj.nome} no computador`)}
    ${pj.capturas?.celular?.[0] ? `<span class="cart__cel">${img(pj.capturas.celular[0], "")}</span>` : ""}
  </button>
  <p class="cart__tipo mono">${esc(pj.tipo)}</p><h3 class="cart__nome display">${esc(pj.nome)}</h3>
</article>`;

  // ---------- planos em caixas 3D ----------
  const vagaSelo = (v) => !v ? "" : v.abertas > 0
    ? `<p class="vagas"><span class="vagas__ponto" aria-hidden="true"></span><b>${v.abertas} de ${v.total} vagas abertas</b> para ${esc(vagas.mes)}</p>`
    : `<p class="vagas vagas--fechada"><b>Agenda de ${esc(vagas.mes)} completa.</b> Chame para entrar na fila do próximo mês.</p>`;
  // celular atrás da caixa (Criativos): o anúncio ou o reel de verdade rodando na interface do Instagram
  const IG = {
    curtir: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.6-4.7-7.6-10.4A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 7.6 2.6c0 5.7-7.6 10.4-7.6 10.4z"/></svg>',
    comentar: '<svg viewBox="0 0 24 24"><path d="M20.2 11.6a8.1 8.1 0 0 1-11.8 7.2L3.8 20l1.3-4.2a8.1 8.1 0 1 1 15.1-4.2z"/></svg>',
    enviar: '<svg viewBox="0 0 24 24"><path d="M21 3 3.2 10.4l7.3 2.9L13.4 21z"/><path d="m21 3-10.5 10.3"/></svg>',
  };
  const vitrine = (vt) => !vt ? "" : `<div class="vitrine${vt.patrocinado ? " vitrine--anuncio" : ""}" style="--av:${vt.cor}" aria-hidden="true">
          <div class="vitrine__cel"><div class="vitrine__tela">
            <video muted loop playsinline preload="none" poster="${hv(vt.poster)}" data-src="${hv(vt.video)}"></video>
            <span class="vitrine__ig">
              ${vt.patrocinado ? "" : '<b class="vitrine__reels">Reels</b>'}
              <span class="vitrine__acoes">${[["curtir", vt.curtidas], ["comentar", vt.comentarios], ["enviar", vt.envios]].map(([k, n]) => `<i>${IG[k]}${n ? `<small>${esc(n)}</small>` : ""}</i>`).join("")}</span>
              <span class="vitrine__pe">
                <span class="vitrine__conta"><span class="vitrine__av">${esc(vt.conta[0].toUpperCase())}</span><span><b>${esc(vt.conta)}</b>${vt.patrocinado ? "<small>Patrocinado</small>" : ""}</span>${vt.patrocinado ? "" : "<em>Seguir</em>"}</span>
                <span class="vitrine__leg">${esc(vt.legenda)}</span>
                ${vt.cta ? `<span class="vitrine__cta">${esc(vt.cta)}<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></span>` : ""}
              </span>
            </span>
          </div></div>
          <p class="vitrine__selo"><small>${esc(vt.selo.rotulo)}</small><b>${esc(vt.selo.valor)}</b>${vt.selo.nota ? `<span>${esc(vt.selo.nota)}</span>` : ""}</p>
        </div>`;
  const planosHtml = (pl, v, jornada, msg, efeito) => `
<section class="sec planos" id="planos" data-cena="leitura" aria-labelledby="t-planos">
  <div class="sec__in">
    <header class="planos__cab"><p class="rotulo sobe"><b>Planos</b></p><h2 class="display entra" id="t-planos">${palavras(pl.titulo)}</h2>${vagaSelo(v)}</header>
    <div class="planos__grade planos__grade--${pl.itens.length}">${lista(pl.itens, (it, i) => `
      <article class="caixa sobe" style="--d:${i * 90}ms;--i:${i}" id="plano-${it.slug}" data-efeito="${efeito(it)}">
        <div class="caixa__palco">${vitrine(it.vitrine)}<div class="caixa__3d">
          <div class="caixa__face caixa__face--frente">
            <p class="plano__n">${n2(i + 1)}${it.rotulo ? `<span>${esc(it.rotulo)}</span>` : ""}</p>
            <h3 class="plano__nome display">${esc(it.nome)}</h3>
            <p class="plano__resumo">${rico(it.resumo)}</p>
            <ul class="plano__inclui">${lista(it.inclui, (x) => `<li>${rico(x)}</li>`)}</ul>
            ${it.metrica ? `<div class="plano__metrica"><span>${esc(it.metrica.rotulo)}</span><ul>${lista(it.metrica.itens, (x) => `<li>${esc(x)}</li>`)}</ul></div>` : ""}
            <a class="btn plano__cta" href="${zap(msg(it.interesse))}" target="_blank" rel="noopener" data-zap="${jornada}|${esc(it.interesse)}|plano">${ico("zap")} ${esc(it.cta)}</a>
          </div>
          <span class="caixa__face caixa__face--tras" aria-hidden="true"></span>
          <span class="caixa__face caixa__face--esq" aria-hidden="true"><i>WZS STUDIO</i></span>
          <span class="caixa__face caixa__face--dir" aria-hidden="true"><i>${n2(i + 1)} · ${esc(it.nome)}</i></span>
          <span class="caixa__face caixa__face--base" aria-hidden="true"></span>
          <span class="caixa__miolo" aria-hidden="true"></span>
          <span class="caixa__feixe" aria-hidden="true"></span>
          <span class="caixa__tampa" aria-hidden="true">
            <span class="tampa tampa--topo"><svg viewBox="0 0 424 422"><use href="#wzs-mark"/></svg></span>
            <span class="tampa tampa--frente"></span><span class="tampa tampa--tras"></span><span class="tampa tampa--esq"></span><span class="tampa tampa--dir"></span>
          </span>
        </div></div>
        <span class="caixa__sombra" aria-hidden="true"></span>
      </article>`)}
    </div>
    ${pl.nota ? `<p class="planos__nota">${rico(pl.nota)}</p>` : ""}
    ${jornada === "sites" ? selo(sites.parceria, false) : ""}
    <p class="contato__alt sobe">Prefere escrever do seu jeito? <a href="${zap(whatsapp.mensagens.geral)}" target="_blank" rel="noopener" data-zap="${jornada}|geral|planos">${esc(whatsapp.exibicao)}</a> <a href="mailto:${esc(marca.email)}">${esc(marca.email)}</a></p>
  </div>
</section>`;

  const faqCurto = (faq) => faqHtml(faq, "").replace('<p class="rotulo sobe"><b></b> Perguntas frequentes</p>', '<p class="rotulo sobe"><b>Dúvidas</b></p>');
  const heroHtml = (h, msgZap, track, sec) => `<section class="hero hero--curto" id="inicio" data-cena="hero" aria-labelledby="t-hero">
  <div class="hero__in"><div class="hero__copy">
    <p class="rotulo sobe"><b>${esc(h.rotulo)}</b></p>
    <h1 class="display entra" id="t-hero">${palavras(h.titulo)}</h1>
    ${h.linha ? `<p class="hero__linha sobe" style="--d:250ms">${rico(h.linha)}</p>` : ""}
    <div class="hero__cta sobe" style="--d:350ms"><a class="btn" href="${zap(msgZap)}" target="_blank" rel="noopener" data-zap="${track}|geral|hero">${ico("zap")} ${esc(h.cta)}</a>${sec}</div>
    ${h.prova?.length ? `<div class="hero__prova sobe" style="--d:500ms">${lista(h.prova, (p) => `<div><strong>${esc(p.valor)}</strong><span>${esc(p.rotulo)}</span></div>`)}</div>` : ""}
  </div></div>
</section>`;

  // ======================================================== SITES
  function paginaSites() {
    const s = sites, hi = s.historia;
    const md = s.projetos.find((p) => p.slug === "medgrind");
    const secoes = [];
    secoes.push(heroHtml(s.hero, whatsapp.mensagens.sitesGeral, "sites", `<a class="btn btn--linha" href="#cap-medgrind">Ver o caso MedGrind ${ico("dir")}</a>`));
    secoes.push(expande("abre-sites", hi.abertura, "s-problema"));
    secoes.push(capitulo({ id: "cap-problema", cap: "s-problema", altura: 330, cena: "fundo", rotulo: hi.problema.rotulo, rotuloId: "t-sp", conteudo: passos(hi.problema.passos, "t-sp") }));
    secoes.push(capitulo({ id: "cap-montagem", cap: "s-montagem", altura: 460, cena: "painel", cls: "cap--painel", alt: md?.capturas?.desktop?.[0], rotulo: hi.montagem.rotulo, rotuloId: "t-sm", conteudo: camadasPassos(hi.montagem, "t-sm"), extra: codigoSite(hi.montagem) }));
    const cmd = hi.medgrind, fm = faixas(cmd.passos.length);
    secoes.push(capitulo({ id: "cap-medgrind", cap: "s-medgrind", altura: 480, cena: "fundo", alt: "/media/sites/medgrind/cenas/revelacao-wide.webp", rotulo: cmd.rotulo, rotuloId: "t-mg",
      conteudo: cmd.passos.map((x, i) => {
        let h2 = titulo(x.titulo, x.texto, i ? "h3" : "h2", i ? "" : "t-mg");
        if (!i) h2 = h2.replace("passo__titulo", "passo__titulo passo__titulo--gigante");
        if (x.barras) h2 += `<div class="barras" aria-label="Antes ${esc(x.barras.antes)}, depois ${esc(x.barras.depois)}"><div class="barras__l"><span>Antes</span><i style="--w:1"></i><b>${esc(x.barras.antes)}</b></div><div class="barras__l barras__l--depois"><span>Depois</span><i style="--w:${x.barras.proporcao}"></i><b>${esc(x.barras.depois)}</b></div><p class="passo__fonte">${esc(x.barras.fonte)}</p></div>`;
        if (x.acoes && md) h2 += `<div class="passo__acoes"><button class="btn" type="button" data-abrir-caso="medgrind" data-cursor="Ver projeto">Estudo de caso completo ${ico("dir")}</button><a class="btn btn--linha" href="${esc(md.url)}" target="_blank" rel="noopener" data-cursor="Abrir site">Ver no ar ${ico("seta")}</a></div>`;
        return passo(fm[i][0], fm[i][1], h2);
      }).join("") }));
    secoes.push(carrossel({ id: "projetos", cena: "trabalhos", rotulo: "Projetos", titulo: "Os sites por trás dos números.", itens: s.projetos, card: cartSite,
      extra: s.maisProjetos?.length ? `<p class="outros__mais">Também: ${lista(s.maisProjetos, (m, i) => `${i ? " · " : ""}${m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.nome)} ↗</a>` : esc(m.nome)}`)}</p>` : "" }));
    secoes.push(capitulo({ id: "cap-oportunidade", cap: "s-oportunidade", altura: 320, cena: "fundo", rotulo: hi.oportunidade.rotulo, rotuloId: "t-so", conteudo: passos(hi.oportunidade.passos, "t-so") }));
    if (hi.cafe) secoes.push(capitulo({ id: "cap-cafe", cap: "s-cafe", altura: 300, cena: "fundo", rotulo: hi.cafe.rotulo, rotuloId: "t-sc", conteudo: passos(hi.cafe.passos, "t-sc") }));
    secoes.push(expande("convite-sites", hi.convite, ""));
    secoes.push(planosHtml(s.planos, vagas.sites, "sites", whatsapp.mensagens.sites, () => "codigo"));
    secoes.push(faqCurto(s.faq));
    const templates = `<div hidden>${lista(s.projetos, (pj) => `<template id="caso-${pj.slug}">${casoHtml(pj)}</template>`)}</div>`;
    return doc({
      pagina: "sites", universo: "sites", seo: { ...s.seo, caminho: "/sites/" }, main: `<main id="conteudo" class="jornada jornada--sites">${secoes.join("\n")}${templates}</main>`, dadosMundo,
      jsonld: [orgLd(), faqLd(s.faq), { "@context": "https://schema.org", "@type": "Service", serviceType: "Criação de sites e landing pages", provider: { "@type": "ProfessionalService", name: marca.nome }, areaServed: "BR", hasOfferCatalog: { "@type": "OfferCatalog", name: "Serviços de site", itemListElement: s.planos.itens.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.nome, description: x.resumo } })) } }],
      zapFixo: { href: zap(whatsapp.mensagens.sitesGeral), rotulo: "Conversar sobre meu site", track: "sites|geral|barra-fixa" },
    });
  }

  // ======================================================== CRIATIVOS
  function paginaCriativos() {
    const c = criativos, hi = c.historia;
    const secoes = [];
    secoes.push(heroHtml(c.hero, whatsapp.mensagens.criativosGeral, "criativos", `<a class="btn btn--linha" href="#numeros">Ver os números ${ico("dir")}</a>`));
    secoes.push(expande("abre-criativos", hi.abertura, "c-problema"));
    secoes.push(capitulo({ id: "cap-problema", cap: "c-problema", altura: 330, cena: "fundo", rotulo: hi.problema.rotulo, rotuloId: "t-cp", conteudo: passos(hi.problema.passos, "t-cp") }));
    secoes.push(capitulo({ id: "cap-explode", cap: "c-explode", altura: 230, cena: "fundo", alt: hi.montagem.poster, rotuloId: "t-ce",
      conteudo: passo("0", "0.580", `<p class="passo__titulo display passo__titulo--gigante" aria-hidden="true">Pulou.</p>`) + passo("0.580", "1.010", titulo(hi.explode.titulo, hi.explode.texto, "h2", "t-ce")) }));
    secoes.push(capitulo({ id: "cap-montagem", cap: "c-montagem", altura: 460, cena: "painel", cls: "cap--painel", alt: hi.montagem.poster, rotulo: hi.montagem.rotulo, rotuloId: "t-cm", conteudo: camadasPassos(hi.montagem, "t-cm"), extra: editorReel(hi.montagem) }));
    const su = hi.sucesso;
    secoes.push(capitulo({ id: "cap-sucesso", cap: "c-sucesso", altura: 320, cena: "fundo", cls: "cap--invertido", alt: su.poster, rotuloId: "t-cs", extra: notifSucesso,
      conteudo: passo("0", "0.300", `<h2 class="passo__titulo display" id="t-cs">${palavras(su.titulo)}</h2>`)
        + passo("0.300", "0.640", `<h3 class="passo__titulo display">${palavras(su.meio)}</h3>`)
        + passo("0.640", "1.010", `<p class="passo__num display" style="--n:${[...String(su.numero)].length}"><span data-contador="${su.contador}" data-final="${esc(su.numero)}">${esc(su.numero)}</span></p><p class="passo__texto">${esc(su.rotuloNumero)} · ${esc(su.legenda)}</p><p class="passo__fonte">${esc(su.fonte)}</p>`) }));

    secoes.push(`<section class="sec fontes" id="numeros" data-cena="leitura" aria-labelledby="t-fontes">
  <div class="sec__in">
    <header class="sec__cab"><p class="rotulo sobe"><b>Números reais</b></p><h2 class="display entra" id="t-fontes">${palavras("De quem já está fazendo.")}</h2></header>
    <div class="fontes__grade">${lista(c.fontes, (f, i) => `
      <article class="fonte sobe" style="--d:${i * 80}ms">
        <p class="fonte__conta">${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.conta)} ↗</a>` : esc(f.conta)}<span>${esc(f.tema)}</span></p>
        <p class="fonte__num display" data-contar="${esc(f.numero)}">${esc(f.numero)}</p>
        <p class="fonte__rotulo">${esc(f.rotulo)}</p>
        <ul class="fonte__extras">${lista(f.extras, (x) => `<li>${esc(x)}</li>`)}</ul>
      </article>`)}
    </div>
    <p class="fontes__nota">${rico(c.fontesNota)}</p>
    ${c.noInstagram?.length ? `<div class="noinsta sobe"><p class="rotulo"><b>Mais vistos, direto no Instagram</b></p><ul>${lista(c.noInstagram, (x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener" data-cursor="Abrir"><b>${esc(x.numero)}</b><span>${esc(x.titulo)}</span><em>${esc(x.conta)} ↗</em></a></li>`)}</ul></div>` : ""}
  </div>
</section>`);

    const ordem = ["nilo", "felipen-med", "wzs-studio", "marcas-proprias"];
    const organicos = [...c.series].sort((a, b) => ordem.indexOf(a.slug) - ordem.indexOf(b.slug)).flatMap((se) => se.videos.map((v) => ({ ...v, conta: se.conta })));
    secoes.push(carrossel({ id: "trabalhos", cena: "trabalhos", rotulo: "Para viralizar", titulo: "Os vídeos por trás dos números.", itens: organicos, card: cartVideo }));
    secoes.push(capitulo({ id: "cap-dinheiro", cap: "c-dinheiro", altura: 320, cena: "fundo", alt: c.anuncios?.videos?.[0]?.poster, rotulo: hi.dinheiro.rotulo, rotuloId: "t-cd", conteudo: passos(hi.dinheiro.passos, "t-cd") }));
    if (c.anuncios?.videos?.length) secoes.push(carrossel({ id: "anuncios", cena: "trabalhos", rotulo: "Para anunciar", titulo: c.anuncios.titulo, itens: c.anuncios.videos.map((v) => ({ ...v, conta: v.conta || (v.id.startsWith("exemplo") || v.id.startsWith("motion") ? "Peça de demonstração" : "MedGrind · anúncio") })), card: cartVideo }));
    secoes.push(capitulo({ id: "cap-oportunidade", cap: "c-oportunidade", altura: 320, cena: "globo", rotulo: hi.oportunidade.rotulo, rotuloId: "t-co", conteudo: passos(hi.oportunidade.passos, "t-co") }));
    secoes.push(expande("convite-criativos", hi.convite, ""));
    secoes.push(planosHtml(c.planos, vagas.criativos, "criativos", whatsapp.mensagens.criativos, (it) => (it.slug === "anunciar" ? "dinheiro" : "coracoes")));
    secoes.push(faqCurto(c.faq));
    const videosLd = c.series.flatMap((s) => s.videos.map((v) => ({ "@type": "VideoObject", name: v.titulo, description: v.objetivo || s.tema, thumbnailUrl: marca.dominio + v.poster, contentUrl: marca.dominio + v.arquivo, uploadDate: v.data || undefined })));
    return doc({
      pagina: "criativos", universo: "criativos", seo: { ...c.seo, caminho: "/criativos/" }, main: `<main id="conteudo" class="jornada jornada--criativos">${secoes.join("\n")}</main>`, dadosMundo,
      jsonld: [orgLd(), faqLd(c.faq), ...(videosLd.some((v) => v.uploadDate) ? [{ "@context": "https://schema.org", "@graph": videosLd.filter((v) => v.uploadDate) }] : [])],
      zapFixo: { href: zap(whatsapp.mensagens.criativosGeral), rotulo: "Conversar sobre criativos", track: "criativos|geral|barra-fixa" },
    });
  }
  return { paginaSites, paginaCriativos };
}
