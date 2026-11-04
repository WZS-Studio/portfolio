// Cursor da marca: a logo simplificada (círculo + três arcos) com um ponto exato no centro.
// O ponto segue o mouse sem atraso; o rótulo aparece ao lado, sem cobrir o ponto do clique.
// Em campos de texto volta o cursor de texto do sistema. No rodapé dá para voltar ao padrão.
// No toque não existe ponteiro: só um eco curto da marca onde o dedo tocou um controle.

const CHAVE = "wzs:cursor";

export function iniciarCursor() {
  const el = document.getElementById("cursor");
  const rotulo = document.getElementById("cursor-rotulo");
  const botao = document.getElementById("alternar-cursor");
  const fino = matchMedia("(hover: hover) and (pointer: fine)");
  const html = document.documentElement;

  // eco do toque
  addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    const alvo = e.target.closest?.("a, button, summary, [data-escolha]");
    if (!alvo || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = document.createElement("span");
    t.className = "toque"; t.setAttribute("aria-hidden", "true");
    t.style.left = e.clientX + "px"; t.style.top = e.clientY + "px";
    t.innerHTML = '<svg viewBox="0 0 24 24"><use href="#cur-mark"/></svg>';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 600);
  }, { passive: true });

  if (!el || !fino.matches) { if (botao) botao.closest("span").hidden = true; return; }

  let ativo = (() => { try { return localStorage.getItem(CHAVE) !== "padrao"; } catch { return true; } })();
  const aplicar = () => {
    html.classList.toggle("tem-cursor", ativo);
    if (botao) { botao.textContent = ativo ? "Usar cursor padrão" : "Usar cursor da marca"; botao.setAttribute("aria-pressed", String(!ativo)); }
  };
  aplicar();
  botao?.addEventListener("click", () => {
    ativo = !ativo;
    try { localStorage.setItem(CHAVE, ativo ? "marca" : "padrao"); } catch { /* sem armazenamento */ }
    aplicar();
  });

  el.classList.add("is-oculto");          // só aparece depois do primeiro movimento
  let x = -100, y = -100, raf = 0;
  const pintar = () => { raf = 0; el.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    el.classList.remove("is-oculto");
    if (!raf) raf = requestAnimationFrame(pintar);
  }, { passive: true });
  document.addEventListener("pointerleave", () => el.classList.add("is-oculto"));
  addEventListener("blur", () => el.classList.add("is-oculto"));
  addEventListener("pointerdown", () => el.classList.add("is-pressionado"));
  addEventListener("pointerup", () => el.classList.remove("is-pressionado"));

  let ultimo = null;
  document.addEventListener("pointerover", (e) => {
    const t = e.target;
    if (t === ultimo) return;
    ultimo = t;
    const texto = t.closest?.("input, textarea, select, [contenteditable='true']");
    const comRotulo = t.closest?.("[data-cursor]");
    const link = t.closest?.("a, button, summary, label, [role='button']");
    const arrasta = t.closest?.("[data-cursor-arrasta]");
    el.classList.toggle("is-texto", !!texto);
    el.classList.toggle("is-arrasta", !!arrasta && !comRotulo);
    if (comRotulo && !texto) {
      rotulo.textContent = comRotulo.getAttribute("data-cursor");
      el.classList.add("is-rotulo"); el.classList.remove("is-link");
    } else {
      el.classList.remove("is-rotulo");
      el.classList.toggle("is-link", !!link && !texto);
    }
  });
}
