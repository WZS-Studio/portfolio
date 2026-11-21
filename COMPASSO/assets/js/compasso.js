/* Compasso · interações (JS puro, sem bibliotecas).
   Tudo é curto e corre pelo relógio, nunca pela rolagem: a página rola livre o tempo todo.
   Sem JS o conteúdo aparece inteiro (as entradas só escondem quando este arquivo roda). Cada parte roda isolada:
   se uma falhar, as outras seguem; se este arquivo inteiro falhar, o <head> mostra tudo em 4 s (window.COMPASSO
   só existe quando o arquivo chegou ao fim). */
(function () {
  'use strict';
  var doc = document, raiz = doc.documentElement;
  var menosMov = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var economia = !!(navigator.connection && navigator.connection.saveData);
  var demo = doc.body.hasAttribute('data-demo');
  raiz.className = 'js';
  var bloco = function (nome, fn) { try { fn(); } catch (e) { if (window.console) console.warn('compasso: ' + nome + ': ' + e.message); } };

  var fmt = function (n) { return Math.round(n).toLocaleString('pt-BR'); };
  var io = function (cb, opt) { return new IntersectionObserver(cb, opt || {}); };

  /* ---------- topo: fundo depois de rolar e cor conforme a faixa que passa por baixo dele ---------- */
  bloco('topo', function () {
    var topo = doc.querySelector('[data-topo]');
    if (!topo) return;
    var faixas = [].slice.call(doc.querySelectorAll('main > [data-tema], footer[data-tema]'));
    var solido = null, tema = '', pedido = false;
    var atualiza = function () {
      pedido = false;
      var s = scrollY > 12;
      if (s !== solido) { solido = s; topo.classList.toggle('solido', s); }
      var t = faixas.length ? faixas[0].getAttribute('data-tema') : '';
      for (var i = 0; i < faixas.length; i++) {
        if (faixas[i].getBoundingClientRect().top <= 34) t = faixas[i].getAttribute('data-tema'); else break;
      }
      if (t !== tema) { tema = t; topo.setAttribute('data-sobre', t); }
    };
    var agenda = function () { if (!pedido) { pedido = true; requestAnimationFrame(atualiza); } };
    addEventListener('scroll', agenda, { passive: true });
    addEventListener('resize', agenda);
    atualiza();
  });

  /* ---------- gaveta do celular ---------- */
  bloco('gaveta', function () {
    var gaveta = doc.querySelector('[data-gaveta]'), abre = doc.querySelector('[data-menu]');
    if (gaveta && abre) {
      var fecha = gaveta.querySelector('[data-fecha-menu]');
      var abrir = function () {
        gaveta.hidden = false; abre.setAttribute('aria-expanded', 'true');
        doc.body.style.overflow = 'hidden';
        requestAnimationFrame(function () { gaveta.classList.add('aberta'); });
        (gaveta.querySelector('nav a') || fecha).focus();
      };
      var fechar = function () {
        gaveta.classList.remove('aberta'); abre.setAttribute('aria-expanded', 'false');
        doc.body.style.overflow = '';
        setTimeout(function () { gaveta.hidden = true; }, 220);
        abre.focus();
      };
      abre.addEventListener('click', abrir);
      fecha.addEventListener('click', fechar);
      gaveta.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
      gaveta.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) fechar(); });
    }
  });

  /* ---------- entradas: rápidas e um pouco antes de a faixa chegar ---------- */
  bloco('entradas', function () {
    var rvs = doc.querySelectorAll('.rv');
    var mostraTudo = function () { rvs.forEach(function (el) { el.classList.add('visto'); }); };
    if (menosMov || !('IntersectionObserver' in window)) { mostraTudo(); return; }
    try {
      var obsRv = io(function (es) {
        var n = 0;
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.style.setProperty('--atraso', Math.min(n++, 4) * 0.06 + 's');
          e.target.classList.add('visto');
          obsRv.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
      rvs.forEach(function (el) { obsRv.observe(el); });
    } catch (e) { mostraTudo(); throw e; }   // nunca deixa conteúdo escondido
  });

  /* ---------- listas que se marcam (o "check" dos reels) ---------- */
  bloco('listas', function () {
    doc.querySelectorAll('[data-checklist]').forEach(function (lista) {
      var cada = lista.tagName === 'OL';
      var itens = lista.matches('.final-item') ? [lista] : [].slice.call(lista.children);
      var marcaveis = itens.filter(function (li) { return !li.classList.contains('checklist-pergunta'); });
      var pergunta = lista.querySelector('.checklist-pergunta');
      if (menosMov) { marcaveis.forEach(function (li) { li.classList.add('marcado'); }); return; }
      if (cada) {
        var obsItem = io(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            setTimeout(function () { e.target.classList.add('marcado'); }, 380);
            obsItem.unobserve(e.target);
          });
        }, { rootMargin: '0px 0px -18% 0px' });
        marcaveis.forEach(function (li) { obsItem.observe(li); });
        return;
      }
      var obsLista = io(function (es) {
        if (!es[0].isIntersecting) return;
        obsLista.disconnect();
        marcaveis.forEach(function (li, i) { setTimeout(function () { li.classList.add('marcado'); }, 300 + i * 380); });
        if (pergunta) setTimeout(function () { pergunta.classList.add('acende'); }, 300 + marcaveis.length * 380 + 120);
      }, { rootMargin: '0px 0px -20% 0px' });
      obsLista.observe(lista);
    });
  });

  /* ---------- 100.000: conta uma vez, em 1,6 s ---------- */
  bloco('contagem', function () {
    doc.querySelectorAll('[data-conta]').forEach(function (el) {
      var alvo = +el.getAttribute('data-conta');
      if (menosMov) return;
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight) return;            // já está na tela: fica o número cheio
      el.textContent = '0';
      var obs = io(function (es) {
        if (!es[0].isIntersecting) return;
        obs.disconnect();
        var t0 = performance.now(), dur = 1600;
        (function passo(t) {
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(2, -10 * k);
          el.textContent = fmt(k >= 1 ? alvo : alvo * e);
          if (k < 1) requestAnimationFrame(passo);
        })(t0);
      }, { rootMargin: '0px 0px -12% 0px' });
      obs.observe(el);
    });
  });

  /* ---------- batidas desde que a página abriu (na conta de 100.000 por dia) ---------- */
  bloco('batidas', function () {
    var batidas = doc.querySelector('[data-batidas]');
    if (batidas) {
      var inicio = performance.now(), porSeg = 100000 / 86400, timer = 0;
      var atualiza = function () { batidas.textContent = fmt(Math.floor((performance.now() - inicio) / 1000 * porSeg)); };
      io(function (es) {
        clearInterval(timer);
        if (es[0].isIntersecting) { atualiza(); timer = setInterval(atualiza, 250); }
      }).observe(batidas);
    }
  });

  /* ---------- relógio do HUD ---------- */
  bloco('relogio', function () {
    var relogios = doc.querySelectorAll('[data-relogio]');
    if (relogios.length) {
      var dois = function (n) { return (n < 10 ? '0' : '') + n; };
      var tique = function () {
        var d = new Date(), s = dois(d.getHours()) + ':' + dois(d.getMinutes()) + ':' + dois(d.getSeconds());
        relogios.forEach(function (r) { r.textContent = s; });
      };
      tique(); setInterval(tique, 1000);
    }
  });

  /* ---------- coração holográfico: o vídeo entra depois da página pronta ---------- */
  bloco('video', function () {
    var fig = doc.querySelector('[data-coracao]');
    var video = fig && fig.querySelector('[data-video]');
    if (video && !menosMov && !economia) {
      var carregar = function () {
        var grande = innerWidth * (devicePixelRatio || 1) > 900;
        video.src = video.getAttribute(grande ? 'data-g' : 'data-p');
        video.addEventListener('playing', function () { video.classList.add('tocando'); }, { once: true });
        var p = video.play(); if (p && p.catch) p.catch(function () {});
        io(function (es) {
          if (es[0].isIntersecting) { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
          else video.pause();
        }).observe(fig);
      };
      var depois = function () { (window.requestIdleCallback || setTimeout)(carregar, { timeout: 1500 }); };
      if (doc.readyState === 'complete') setTimeout(depois, 400);
      else addEventListener('load', function () { setTimeout(depois, 400); });
    }
  });

  /* ---------- WhatsApp: na demonstração, mostra a mensagem em vez de abrir o número fictício ---------- */
  bloco('whatsapp', function () {
    var dlg = doc.getElementById('dlg-wa');
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('[data-wa]');
      if (!a || !demo || !dlg || typeof dlg.showModal !== 'function') return;
      e.preventDefault();
      dlg.querySelector('[data-dlg-msg]').textContent = a.getAttribute('data-wa');
      dlg.showModal();
    });
    if (dlg) dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  /* ---------- montar a mensagem (página Agendar) ---------- */
  bloco('agendar', function () {
    var comp = doc.querySelector('[data-compositor]');
    if (comp) {
      var previa = comp.querySelector('[data-previa]'), botao = comp.querySelector('[data-compositor-botao]');
      var TEXTO = {
        checkup: 'agendar o check-up cardiológico', consulta: 'agendar uma consulta com cardiologista', duvida: 'tirar uma dúvida sobre o check-up cardiológico',
      };
      var monta = function () {
        var oque = comp.querySelector('[name=oque]:checked').value, quem = comp.querySelector('[name=quem]:checked').value;
        var para = quem === 'mim' ? 'para mim' : 'para uma pessoa da minha família';
        var msg = oque === 'duvida'
          ? 'Olá! Quero ' + TEXTO.duvida + (quem === 'mim' ? '.' : ', ' + para + '.')
          : 'Olá! Quero ' + TEXTO[oque] + ' ' + para + '. Pode me passar os horários disponíveis' + (oque === 'checkup' ? ' e o preparo?' : '?');
        previa.textContent = msg;
        botao.setAttribute('data-wa', msg);
        if (!demo) botao.href = botao.href.replace(/text=.*/, 'text=' + encodeURIComponent(msg));
      };
      comp.addEventListener('change', monta);
      comp.addEventListener('submit', function (e) { e.preventDefault(); });
      monta();
    }
  });

  window.COMPASSO = { demo: demo };
})();
