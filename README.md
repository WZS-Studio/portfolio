# WZS Studio · Portfólio

**Uma marca, duas especialidades:** *Criativos e conteúdos virais* e *Sites que convertem*.
Site em HTML, CSS e JavaScript puros (sem build), com um mundo 3D em Three.js que continua vivo entre as páginas.

**No ar:** https://wzsstudio.com.br · Antes de publicar, confira o `PENDENCIAS.md` local (fica fora do repositório, que é público).

---

## Como o site funciona

| Endereço | O que é |
|---|---|
| `/` | Portal: a logo 3D entre os dois caminhos. Mover o mouse (ou o dedo) antecipa o universo; clicar ou tocar confirma. |
| `/sites/` | Jornada *Sites que convertem*, contada em capítulos: a logo expande → o problema (notebook 3D com um site que perde o visitante) → as cinco camadas → o caso MedGrind → mais projetos → a oportunidade → planos e vagas. |
| `/criativos/` | Jornada *Criativos e conteúdos virais*: a logo expande → o problema (celular 3D com o feed sendo pulado) → as camadas de um reel → o celular gira com um reel que deu certo → números das fontes → vídeos → anúncios → a oportunidade → planos e vagas. |

Os capítulos (`.cap`) ficam presos na tela enquanto a pessoa rola; a rolagem continua natural. Os textos de cada capítulo, os planos e as **vagas do mês** estão em `conteudo/site.mjs` (`historia`, `planos`, `vagas`).

- As três páginas são HTML completo (funcionam sem JavaScript, boas para Google e para compartilhar link).
  Com JavaScript, a troca entre elas acontece sem recarregar: a câmera mergulha na logo ou um círculo de luz atravessa a tela.
- `assets/js/mundo.js` — a cena 3D (logo em esfera de contornos, luz por universo, telas e quadros de vídeo em órbita).
  Três níveis de qualidade automáticos; `?qualidade=baixa|media|alta` força um nível e `?3d=0` desliga o 3D.
- `assets/js/dispositivos.js` — celular e notebook em 3D (materiais físicos, luz de estúdio), camadas que se montam e partículas, guiados pelo progresso de cada capítulo.
- `assets/js/app.js` — navegação, portal, capítulos, animações de rolagem, estudos de caso, player de vídeo.
- `assets/js/cursor.js` — cursor com a logo (o rodapé tem o botão para voltar ao cursor padrão).
- `assets/js/medicao.js` — eventos: `escolha_especialidade`, `abrir_projeto`, `reproduzir_video`, `clique_whatsapp`. Nenhum dado pessoal.
- `assets/tex/matcap-*.jpg` — materiais da logo renderizados no Blender (`tools/blender/matcaps.py`).
- Com “reduzir movimento” ligado no sistema: sem rolagem suave, sem voo de câmera, troca de página por corte curto.

## Como atualizar o conteúdo

Tudo que muda fica em **`conteudo/site.mjs`**: textos, projetos, vídeos, métricas, depoimentos, serviços, perguntas, links, WhatsApp e IDs de medição.

```bash
node tools/otimizar-midia.mjs
node tools/gerar.mjs
```

O primeiro cria as cópias leves de imagem e vídeo que entraram ou mudaram: `.webp` ao lado de cada `.jpg`/`.png` e `-leve.mp4` (540×960) para o player em rede lenta. O segundo reescreve `index.html`, `sites/index.html`, `criativos/index.html` e `sitemap.xml`. Não edite esses quatro à mão.

O gerador põe `?v=` (marca do conteúdo) em todo CSS, JS, imagem e vídeo, porque o `.htaccess` manda o navegador guardar CSS, JS e fontes por um ano. Arquivo novo pedido sem passar pelo gerador ficaria velho na casa de quem já visitou. Também é ele que escreve a política de segurança (CSP) de cada página, com o hash dos scripts inline: script colado à mão no HTML é bloqueado.

Regras do arquivo de conteúdo:
- Toda métrica leva **fonte e data**. Visualização, curtida, CTR e venda são coisas diferentes: escreva qual é.
- Lista vazia esconde a seção (ex.: `depoimentos`, `anuncios.videos`).
- `publicar: false` numa série de vídeos deixa ela pronta, mas fora do site.

### Adicionar um vídeo

```bash
node tools/midia.mjs video "C:/caminho/do/video.mp4" nome-do-video 1.5
```

Gera `media/criativos/nome-do-video.mp4` (720×1280, leve) e a capa `.jpg` no segundo indicado. Depois acrescente o vídeo na série em `conteudo/site.mjs` e rode `node tools/otimizar-midia.mjs` e `node tools/gerar.mjs`. A duração é lida do arquivo.

### Adicionar a captura de um site

```bash
node tools/midia.mjs captura "C:/caminho/tela.png" media/sites/projeto/desk-1.webp
```

Para celular use largura 780: `... media/sites/projeto/cel-1.webp 780`.

## Testar no computador

```bash
node tools/servidor.mjs 5190
```

Abra http://localhost:5190 (o servidor entende `/sites/`, `/criativos/`, o 404 e vídeo com Range).

## Publicação

O site fica na hospedagem da MasterSite (cPanel), no domínio [wzsstudio.com.br](https://wzsstudio.com.br).

1. Rode `node tools/otimizar-midia.mjs` e `node tools/gerar.mjs` e confira localmente.
2. Faça o commit e o push na `main`.
3. No cPanel: **Git™ Version Control → WZS-Studio/portfolio → Manage → Pull or Deploy** → **Update from Remote** e **Deploy HEAD Commit**.

O [`.cpanel.yml`](.cpanel.yml) copia só o que o site usa: as páginas, `assets/`, `media/` e as pastas antigas de vídeo. `conteudo/`, `tools/`, `midia/`, `previews/`, `qrcode/` e `logo-3d.html` (ferramenta interna, bloqueada no `.htaccess`) ficam só no repositório.

---

Bibliotecas em `assets/vendor/`: Three.js r160, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. Fontes em `assets/fontes/` (servidas pelo próprio site, licença OFL): Anybody, Schibsted Grotesk e Martian Mono.
