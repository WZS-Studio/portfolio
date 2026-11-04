// ============================================================================
//  CONTEÚDO DO SITE — tudo que você vai querer atualizar fica aqui.
//  Depois de editar, gere as páginas de novo:   node tools/gerar.mjs
//
//  Regras que este arquivo segue (e que valem para o que você acrescentar):
//  - Só números, depoimentos, clientes e resultados reais. Toda métrica leva fonte e data.
//  - Lista vazia = a seção some do site (ex.: depoimentos, anúncios). Nada de "em breve".
//  - *texto entre asteriscos* aparece destacado na cor do universo.
// ============================================================================

export const marca = {
  nome: "WZS Studio",
  responsavel: "",                               // nome que assina o rodapé; vazio esconde
  cidade: "Vila Flores, RS",
  dominio: "https://wzsstudio.com.br",
  email: "wzs.studio11@gmail.com",
  assinatura: "Criativos que prendem a atenção e sites que transformam visita em conversa.",
  redes: [
    { rotulo: "Instagram @wzs_studio", url: "https://www.instagram.com/wzs_studio/" },
    { rotulo: "GitHub", url: "https://github.com/WZS-Studio" },
  ],
};

export const whatsapp = {
  numero: "5554997147741",                       // só dígitos, com 55 + DDD
  exibicao: "(54) 99714-7741",
  mensagens: {
    geral: "Olá! Vim pelo portfólio e quero conversar sobre um projeto.",
    sites: (interesse) => `Olá! Vim pelo portfólio e tenho interesse em ${interesse}.`,
    criativos: (objetivo) => `Olá! Vim pelo portfólio e quero conversar sobre criativos para ${objetivo}.`,
    sitesGeral: "Olá! Vim pelo portfólio e quero conversar sobre um site.",
    criativosGeral: "Olá! Vim pelo portfólio e quero conversar sobre criativos.",
  },
};

// VAGAS DO MÊS — use sempre o número REAL. Anunciar escassez que não existe é propaganda enganosa (CDC).
// abertas: 0 mostra "agenda fechada este mês" e mantém o WhatsApp para a fila do próximo.
export const vagas = {
  mes: "novembro",
  sites: { total: 4, abertas: 2 },          // confirmado em 04/11/2026
  criativos: { total: 6, abertas: 3 },      // confirmado em 04/11/2026
};

// IDs de medição. Vazio = eventos só vão para window.dataLayer.
export const medicao = {
  ga4: "",          // ex.: "G-XXXXXXXXXX"
  gtm: "",          // ex.: "GTM-XXXXXXX"
  plausible: "",    // ex.: "wzsstudio.com.br"
};

// ============================================================================
//  PORTAL (página inicial)
// ============================================================================
export const portal = {
  seo: {
    titulo: "WZS Studio · Criativos e conteúdos virais · Sites que convertem",
    descricao: "Vídeos curtos para anunciar ou viralizar e sites que transformam visitas em conversas no WhatsApp. Veja os trabalhos e fale direto pelo WhatsApp.",
    og: "/media/og/og-portal.jpg",
  },
  rotulo: "WZS Studio · uma marca, duas especialidades",
  titulo: "Escolha por onde começar.",
  criativos: {
    palavra: "Criativos", complemento: "e conteúdos virais",
    texto: "Vídeos curtos com gancho, ritmo e roteiro, para anunciar uma oferta ou para ganhar alcance.",
    cta: "Entrar em Criativos",
  },
  sites: {
    palavra: "Sites", complemento: "que convertem",
    texto: "Landing pages e sites escritos do zero para o visitante entender, confiar e chamar você.",
    cta: "Entrar em Sites",
  },
  resumo: {
    titulo: "Atenção e conversão, no mesmo estúdio.",
    texto: "De um lado, vídeos que fazem a pessoa parar de rolar. Do outro, sites que transformam essa visita em conversa no WhatsApp. Dá para contratar um, o outro ou os dois.",
    criativos: "Criativos para anúncios e conteúdo para alcance orgânico, com trabalhos reais e números públicos.",
    sites: "Landing page, reformulação ou site do zero, com estudos de caso de projetos reais.",
  },
};

// ============================================================================
//  SITES QUE CONVERTEM
// ============================================================================
export const sites = {
  seo: {
    titulo: "Sites que convertem · Landing pages e sites do zero · WZS Studio",
    descricao: "Landing pages, reformulação de sites e sites do zero, pensados primeiro para o celular e com um caminho claro até o WhatsApp. Veja estudos de caso reais.",
    og: "/media/og/og-sites.jpg",
  },
  hero: {
    rotulo: "Sites que convertem",
    titulo: "Sites escritos do zero para o seu cliente *achar, entender e chamar você.*",
    texto: "Um bom site junta posicionamento, design, conteúdo, experiência de uso e uma estrutura que facilita a ação do visitante. Eu desenho e programo cada uma dessas partes, sem template e pensando primeiro na tela do celular.",
    cta: "Conversar sobre meu site",
    linha: "Eu desenho e programo landing pages e sites que funcionam primeiro no celular e levam o visitante até o WhatsApp.",
    ctaSecundario: "Ver projetos",
    nota: "Orçamento sem compromisso, direto no WhatsApp.",
  },

  // A jornada é contada em capítulos presos na tela enquanto a pessoa rola.
  // Cada passo aparece numa faixa da rolagem do capítulo; textos curtos funcionam melhor.
  historia: {
    abertura: "Seu cliente pesquisou você. O que ele encontrou?",
    problema: {
      rotulo: "O problema",
      passos: [
        { titulo: "Demorou para abrir. Ele fechou." },
        { titulo: "Abriu, mas não entendeu o que você faz." },
        { titulo: "Gostou, mas não achou o botão." },
        { titulo: "E chamou o concorrente." },
      ],
    },
    montagem: {
      rotulo: "Como eu construo",
      titulo: "O site da CrossHard, camada por camada.",
      camadas: [
        { nome: "Mensagem", arquivo: "index.html", texto: "O que você oferece e para quem, na primeira tela.",
          codigo: ['<h1 class="titulo">', '  Construa seu corpo', '</h1>', '<p>build your body</p>'] },
        { nome: "Design", arquivo: "estilo.css", texto: "Cores, fonte e espaço com a cara do negócio.",
          codigo: [':root { --azul: #1e6bff; }', 'body { background: #0b0f14; }', '.titulo { font: 900 96px "Roboto Flex"; }'] },
        { nome: "Conteúdo", arquivo: "index.html", texto: "Fotos reais e o texto que responde a quem chega.",
          codigo: ['<img src="musculacao.webp" alt="Sala de musculação">', '<p>Sete modalidades, uma equipe', '   que sabe o seu nome.</p>'] },
        { nome: "Celular", arquivo: "celular.css", texto: "A mesma página pensada para a tela em pé.",
          codigo: ['@media (max-width: 760px) {', '  .titulo { font-size: 56px; }', '}'] },
        { nome: "Ação", arquivo: "acao.html", texto: "O botão certo à vista, levando direto ao WhatsApp.",
          codigo: ['<a class="btn" href="https://wa.me/...">', '  Agendar minha visita', '</a>'] },
      ],
    },
    medgrind: {
      rotulo: "Caso em destaque",
      passos: [
        { titulo: "MedGrind", texto: "Um jogo de estudos de medicina apresentado como um mundo 3D." },
        { titulo: "12 capítulos, uma câmera.", texto: "Ela voa entre as ilhas e entra no hospital." },
        { titulo: "Feito para o celular também.", texto: "Cada cena tem um enquadramento próprio na tela em pé." },
        { titulo: "Cerca de 3× mais rápido.", texto: "Carga completa no celular depois da otimização dos modelos 3D.", barras: { antes: "17,8–21,6 s", depois: "5,6–8,2 s", proporcao: 0.38, fonte: "Teste do projeto em 10/10/2026, Chrome com celular emulado." } },
        { titulo: "Do clique à assinatura.", texto: "Botão de assinar sempre à vista e Pixel da Meta só depois do aceite de cookies.", acoes: true },
      ],
    },
    oportunidade: {
      rotulo: "A oportunidade",
      passos: [
        { titulo: "Quem vê o seu anúncio chega pelo celular." },
        { numero: "65 de 70", texto: "cadastros da campanha do MedGrind vieram do Instagram.", fonte: "Gerenciador de Anúncios da Meta, 08 a 20/10/2026." },
        { titulo: "O site é onde a visita vira conversa.", texto: "WhatsApp a um toque, com a mensagem já escrita." },
      ],
    },
    cafe: {
      rotulo: "Para manter",
      passos: [
        { titulo: "E para manter o site no ar?" },
        { numero: "R$ 0,11", texto: "por dia é o custo do domínio .com.br: R$ 40 por ano no Registro.br.", fonte: "Registro.br / NIC.br, valor anual do domínio .com.br, consultado em 04/11/2026." },
        { titulo: "Menos que um cafezinho.", texto: "E a hospedagem pode sair de graça, em serviços como Cloudflare Pages, quando o projeto permite." },
      ],
    },
    convite: "Vamos construir o seu?",
  },

  planos: {
    titulo: "Escolha o seu ponto de partida.",
    itens: [
      { slug: "landing-page", nome: "Landing page", interesse: "landing page", cta: "Quero uma landing page",
        resumo: "Uma página para uma oferta, campanha ou objetivo.",
        inclui: ["Texto e estrutura para uma única ação", "Design e código do zero", "WhatsApp com mensagem pronta"] },
      { slug: "reformulacao", nome: "Reformulação", interesse: "reformulação de site", cta: "Quero reformular meu site",
        resumo: "O site que você já tem, mais claro e mais rápido.",
        inclui: ["Leitura do site atual", "Nova organização e novo visual", "Publicação no mesmo domínio"] },
      { slug: "site-do-zero", nome: "Site do zero", interesse: "site do zero", cta: "Quero um site do zero",
        resumo: "Uma presença própria, alinhada ao seu negócio.",
        inclui: ["Organização das informações", "Versão pensada primeiro para o celular", "Ajuda com o domínio e publicação"] },
    ],
  },

  projetosCab: {
    titulo: "Cada projeto começou com um problema de negócio.",
    lead: "Abra um estudo de caso para ver para quem foi feito, o que precisava resolver, as decisões de design e as telas reais no computador e no celular.",
  },

  // peso: "destaque" (largura total) | "medio" | "compacto"
  // capturas: caminhos a partir da raiz do site; a primeira de cada lista é a principal
  // resultados: [{ valor, rotulo, fonte, data, contexto }] — só dados medidos
  projetos: [
    {
      slug: "medgrind", nome: "MedGrind", peso: "destaque", interesse: "landing page",
      tipo: "Landing page 3D · produto digital",
      linha: "Um mundo 3D dirigido por capítulos para apresentar um jogo de estudos de medicina.",
      url: "https://www.medgrind.com.br/landing", urlRotulo: "medgrind.com.br/landing",
      oQueE: "MedGrind é um “Study Hospital Tycoon”: o tempo de estudo vira progresso num hospital 3D, com questões, simulação clínica (Modo Plantonista), revisão e recursos para estudar com amigos.",
      paraQuem: "Estudantes de medicina que querem uma rotina de estudos mais envolvente.",
      desafio: "Apresentar um produto com muitas partes (hospital, questões, plantão, revisão, amigos) de um jeito que se entenda rápido, inclusive no celular, de onde vem a maior parte do tráfego dos anúncios.",
      feito: "Uma landing em 12 capítulos dentro de um único mundo 3D: a câmera voa entre ilhas, entra no hospital e vira primeira pessoa no Modo Plantonista, com enquadramentos próprios para computador e celular.",
      decisoes: [
        "Uma cena 3D contínua no lugar de seções empilhadas: cada passo é um voo de câmera entre cenas enquadradas, com botão para pular.",
        "O texto entra antes de a câmera pousar, para a leitura começar sem espera.",
        "Cada capítulo tem uma luz própria (manhã, dia, interior, fim de tarde) para marcar a troca de assunto.",
        "Imagens estáticas no lugar do 3D quando o aparelho não tem WebGL, e cortes curtos quando o sistema pede menos movimento.",
        "Pixel da Meta só depois do aceite de cookies (LGPD).",
      ],
      stack: ["React", "Three.js", "React Three Fiber", "Vite", "Supabase", "Vercel"],
      capturas: {
        desktop: ["/media/sites/medgrind/desk-1.webp", "/media/sites/medgrind/desk-2.webp", "/media/sites/medgrind/desk-3.webp", "/media/sites/medgrind/desk-4.webp"],
        celular: ["/media/sites/medgrind/cel-1.webp", "/media/sites/medgrind/cel-2.webp"],
      },
      resultados: [
        { valor: "5,6–8,2 s", rotulo: "carga completa no celular, contra 17,8–21,6 s da versão anterior", fonte: "Teste de carga do projeto, celular emulado no Chrome", data: "10/10/2026" },
        { valor: "−86%", rotulo: "triângulos na cena de abertura no computador, para manter a animação fluida", fonte: "Relatório de otimização da landing", data: "24/10/2026" },
        { valor: "15 → 8,5 MB", rotulo: "download dos modelos 3D depois de eliminar um download duplicado", fonte: "Relatório de carga para os anúncios", data: "14/10/2026" },
      ],
    },
    {
      slug: "1upmed", nome: "1UPmed", peso: "medio", interesse: "landing page",
      tipo: "Landing page de venda · jogo com IA",
      linha: "Uma landing em 11 cenas de pixel art que demonstra o produto enquanto explica.",
      url: "https://www.1upmed.com.br/landing", urlRotulo: "1upmed.com.br/landing",
      oQueE: "1UPmed é um RPG de estudo em pixel art para medicina: a partir do tema que a pessoa quer estudar, a IA monta ficha, questões e casos dentro de uma vila.",
      paraQuem: "Estudantes de medicina.",
      desafio: "Fazer a pessoa entender, antes de assinar, como um tema de estudo vira uma aventura jogável.",
      feito: "Landing em 11 cenas de tela cheia, navegadas pela rolagem, pelas setas ou pelo dedo, com uma demonstração encenada da IA gerando o tema “Sepse”, consulta na UBS, batalha com questão real, recompensas, plano e perguntas frequentes.",
      decisoes: [
        "O campo “O que você quer estudar hoje?” aparece logo na abertura: a primeira ação da página já é a do produto.",
        "Transições em pixel art (coração, explosão, persiana, espiral, íris) mantêm a linguagem do jogo entre as cenas.",
        "Contador de cenas (01/11) para a pessoa saber quanto falta.",
        "Pixel da Meta só depois do “Aceitar” (LGPD).",
      ],
      stack: ["JavaScript", "Vite", "Phaser", "Supabase", "Stripe", "Vercel"],
      capturas: {
        desktop: ["/media/sites/upmed/desk-1.webp", "/media/sites/upmed/desk-2.webp", "/media/sites/upmed/desk-3.webp", "/media/sites/upmed/desk-4.webp"],
        celular: ["/media/sites/upmed/cel-1.webp", "/media/sites/upmed/cel-2.webp"],
      },
      resultados: [],
    },
    {
      slug: "crosshard", nome: "CrossHard", peso: "medio", interesse: "reformulação de site",
      tipo: "Landing page imersiva · academia",
      linha: "Uma landing com 3D, vídeo e tipografia em movimento para uma academia de Adamantina-SP.",
      oQueE: "Academia CrossHard, em Adamantina-SP: sete modalidades, o plano DNA 50+ e equipe própria.",
      paraQuem: "Quem procura academia na cidade e quer conhecer a estrutura e a equipe antes de agendar uma visita.",
      feito: "Nova landing com anilhas em 3D, a palavra HARD como máscara de vídeo do salão, modalidades em rolagem horizontal, fotos da estrutura que se espalham com a rolagem, a equipe real e agendamento de visita pelo WhatsApp.",
      decisoes: [
        "Anilhas 3D em borracha preta com impressão branca e o CH no azul da marca, como o cliente pediu.",
        "Tipografia variável que passa de fina a pesada com a rolagem.",
        "Menu flutuante que muda de tema conforme a seção.",
        "Som de batimento opcional, desligado por padrão.",
        "Dados estruturados de academia (JSON-LD) para o Google.",
      ],
      stack: ["Vite", "Three.js", "GSAP", "Lenis"],
      capturaNota: "versão nova, ainda não publicada",
      capturas: {
        desktop: ["/media/sites/crosshard/desk-1.webp", "/media/sites/crosshard/desk-2.webp", "/media/sites/crosshard/desk-3.webp", "/media/sites/crosshard/desk-4.webp"],
        celular: ["/media/sites/crosshard/cel-1.webp", "/media/sites/crosshard/cel-2.webp"],
      },
      resultados: [],
      nota: "Versão nova entregue e ainda não publicada: o domínio da academia continua com o site anterior.",
    },
    {
      slug: "hyperframe", nome: "Hyper Frame Studio", peso: "compacto", interesse: "site do zero",
      tipo: "Site · estúdio de fotografia",
      linha: "Um site com a cara de um estúdio de eventos, ensaios e cosplay.",
      oQueE: "Hyper Frame Studio, estúdio de fotografia de eventos, ensaios e cosplay.",
      paraQuem: "Quem procura ensaio ou cobertura de evento, e a comunidade cosplay.",
      feito: "Abertura com o logo em pixel, mosaico de fotos animado pela rolagem, uma câmera desenhada que vira o visor do portfólio, serviços, ensaio autoral, galeria com filtros e formulário de contato.",
      decisoes: [
        "Fotos do acervo do próprio estúdio no lugar de banco de imagens.",
        "A câmera desenhada serve de moldura para o portfólio e liga o visual ao serviço.",
        "Galeria com filtros por tipo de trabalho e visualização em tela cheia.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "GSAP", "Lenis"],
      capturaNota: "quadro do vídeo de demonstração",
      capturas: { desktop: ["/media/sites/hyperframe/desk-1.webp", "/media/sites/hyperframe/desk-2.webp", "/media/sites/hyperframe/desk-3.webp", "/media/sites/hyperframe/desk-4.webp"], celular: [] },
      resultados: [],
      nota: "Fotos: acervo do Hyper Frame Studio. Imagens tiradas do vídeo de demonstração do site.",
    },
    {
      slug: "nicolao", nome: "Burgão do Nicolão", peso: "compacto", interesse: "site do zero",
      tipo: "Proposta de site · hamburgueria delivery",
      linha: "O cardápio inteiro no celular, com o pedido a um toque.",
      oQueE: "Proposta de site para o Burgão do Nicolão, hamburgueria delivery de Adamantina-SP.",
      paraQuem: "Clientes que pedem pelo celular e querem ver foto e preço antes de pedir.",
      feito: "Site de 7 páginas com os destaques da casa, cardápio de 69 itens com link direto para o pedido em cada produto, botão “Pedir agora” fixo no celular e WhatsApp com mensagem pronta.",
      decisoes: [
        "Visual neo-brutalista, com tipografia condensada e amarelo forte, no tom da marca.",
        "Cada item do cardápio leva ao produto na plataforma de pedidos, com UTM para saber de onde veio o pedido.",
        "Fotos dos pratos tratadas e ampliadas para continuarem nítidas em telas grandes.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "GSAP"],
      capturas: {
        desktop: ["/media/sites/nicolao/desk-1.webp", "/media/sites/nicolao/desk-2.webp", "/media/sites/nicolao/desk-3.webp"],
        celular: ["/media/sites/nicolao/cel-1.webp", "/media/sites/nicolao/cel-2.webp"],
      },
      resultados: [],
      nota: "Proposta: o site ainda não foi publicado.",
    },
  ],

  // lista curta no fim da seção de projetos (some se ficar vazia)
  maisProjetos: [
    { nome: "Dolce Migliavaca", desc: "Site de confeitaria com cheesecake em 3D e pedido pelo WhatsApp.", url: "https://dolce-migliavaca.pages.dev", rotulo: "no ar ↗" },
    { nome: "JurisConta", desc: "Sistema web para escritórios de advocacia: intimações pela OAB, calculadoras e modelos de documento.", rotulo: "sistema" },
    { nome: "App de treino", desc: "Aplicativo instalável (PWA) com registro de cargas, evolução por exercício e ranking entre amigos.", rotulo: "PWA" },
  ],

  anatomia: {
    rotulo: "Anatomia",
    titulo: "Cinco camadas trabalhando juntas.",
    lead: "Um site que converte não é só bonito. É a soma de cinco decisões que precisam conversar entre si.",
    camadas: [
      { nome: "Posicionamento", texto: "O que você faz, para quem e por que escolher você, dito logo na abertura." },
      { nome: "Design", texto: "Visual com a cara do negócio, hierarquia clara e um acabamento que transmite cuidado." },
      { nome: "Conteúdo", texto: "Texto que responde às dúvidas reais de quem está decidindo, na ordem em que elas aparecem." },
      { nome: "Experiência", texto: "Rápido, legível e fácil de usar no celular, que é de onde vem a maior parte das visitas de um negócio local." },
      { nome: "Ação", texto: "Um caminho claro até o WhatsApp nos momentos certos, com a mensagem já preenchida." },
    ],
  },

  problemas: {
    titulo: "Quando o site não ajuda a vender, quase sempre é por um destes motivos.",
    itens: [
      { problema: "O visitante não entende o que você faz.", solucao: "*Abertura com proposta específica:* o que você oferece, para quem e qual é o próximo passo, antes de qualquer rolagem." },
      { problema: "O site não passa confiança.", solucao: "*Provas reais e informação completa:* trabalhos, endereço, como funciona e quem está por trás, com visual profissional." },
      { problema: "No celular, fica difícil de usar.", solucao: "*Projeto pensado primeiro para o celular:* textos legíveis, botões fáceis de tocar e carregamento leve." },
      { problema: "A pessoa gosta, mas não chama.", solucao: "*Caminho até o contato nos momentos certos:* botões de WhatsApp com mensagem pronta, sem formulário comprido." },
      { problema: "Ninguém encontra o site.", solucao: "*Base de SEO desde o início:* títulos, descrições, estrutura e velocidade que o Google lê bem. Ninguém pode garantir a primeira posição, mas a base fica certa." },
    ],
  },

  evidencias: {
    titulo: "Não precisa acreditar em mim. Dá para conferir.",
    lead: "Os projetos estão no ar. Abra no seu celular, navegue e veja como cada um se comporta.",
    vivosTitulo: "Projetos no ar agora",
    vivosFonte: "Endereços conferidos em 03/11/2026.",
    vivos: [
      { url: "https://www.medgrind.com.br/landing", nota: "landing 3D do MedGrind" },
      { url: "https://www.1upmed.com.br/landing", nota: "landing do 1UPmed" },
      { url: "https://dolce-migliavaca.pages.dev", nota: "confeitaria Dolce Migliavaca" },
    ],
    itens: [
      { valor: "3×", titulo: "Mais rápido no celular", texto: "Na landing do MedGrind, a carga completa no celular emulado caiu de 17,8–21,6 s para 5,6–8,2 s depois da otimização dos modelos 3D.", fonte: "Teste do projeto em 10/10/2026, Chrome com celular emulado." },
      { titulo: "Telas reais, não maquetes", texto: "Todas as imagens desta página são capturas dos projetos, no computador e no celular. Abra um estudo de caso e compare as duas versões." },
    ],
  },

  servicos: {
    titulo: "Três jeitos de começar.",
    lead: "Escolha pelo momento do seu negócio. Se não souber qual faz sentido, me conte pelo WhatsApp e eu indico.",
    itens: [
      {
        slug: "landing-page", nome: "Landing page", interesse: "landing page", cta: "Quero uma landing page",
        resumo: "Uma página direcionada a uma oferta, campanha ou objetivo comercial.",
        paraQuem: "Para quem vai anunciar, lançar um produto ou serviço, abrir agenda ou captar contatos de uma campanha específica.",
        entregas: [
          "Texto e estrutura organizados em torno de uma única ação",
          "Design e programação do zero, para celular e computador",
          "Botões de WhatsApp com mensagem pronta para a oferta",
          "Título, descrição e imagem de compartilhamento para o Google e as redes",
          "Publicação no seu domínio",
        ],
        comoComeca: "Você me conta a oferta, o público e de onde vem o visitante (anúncio, Instagram, Google). Com isso eu envio um orçamento fechado.",
      },
      {
        slug: "reformulacao", nome: "Reformulação de site", interesse: "reformulação de site", cta: "Quero reformular meu site",
        resumo: "Melhoria de um site que já existe para fortalecer a apresentação, a navegação e a jornada até o contato.",
        paraQuem: "Para quem já tem site, mas ele ficou desatualizado, confuso, lento no celular ou não gera contatos.",
        entregas: [
          "Leitura do site atual: o que manter, o que cortar e o que falta",
          "Nova organização das seções e dos caminhos até o contato",
          "Novo visual e nova programação, para celular e computador",
          "Revisão de títulos, descrições e estrutura para o Google",
          "Publicação no mesmo domínio",
        ],
        comoComeca: "Você me manda o link do site atual e conta o que incomoda. Eu respondo com o que mudaria e um orçamento fechado.",
      },
      {
        slug: "site-do-zero", nome: "Site do zero", interesse: "site do zero", cta: "Quero um site do zero",
        resumo: "Criação de uma presença digital alinhada ao negócio e ao que o seu público precisa saber.",
        paraQuem: "Para quem ainda não tem site, ou tem só redes sociais, e precisa de um endereço próprio que explique o negócio e receba contatos.",
        entregas: [
          "Organização das informações: serviços, diferenciais, perguntas e contato",
          "Design com a identidade do negócio e programação do zero",
          "Versão pensada primeiro para o celular",
          "Botões de WhatsApp com mensagem pronta",
          "Ajuda para registrar o domínio e publicação do site",
        ],
        comoComeca: "Você conta sobre o negócio pelo WhatsApp: o que vende, para quem e o que o site precisa fazer. Você recebe um orçamento fechado.",
      },
    ],
  },

  processo: {
    titulo: "Do primeiro oi ao site no ar.",
    passos: [
      { hash: "a1f3c9e", titulo: "Conversa", texto: "Você conta sobre o negócio pelo WhatsApp: o que vende, para quem e o que o site precisa fazer. Você recebe um orçamento fechado." },
      { hash: "7c2e04b", titulo: "Design e código", texto: "Desenho as telas e escrevo o site do zero. Você acompanha por um link de prévia e pede ajustes antes de publicar." },
      { hash: "e94b6d1", titulo: "No ar", texto: "Publico com o seu domínio, testo no celular e no computador e deixo tudo pronto para o Google encontrar." },
    ],
  },

  // Só depoimentos reais, com autorização para publicar. Vazio = seção escondida.
  // { texto, nome, cargo, projeto }
  depoimentos: [],

  faq: {
    titulo: "O que costumam perguntar.",
    itens: [
      { p: "Quanto custa um site?", r: "Depende do tamanho e das funções. Você conta o que precisa pelo WhatsApp e recebe um orçamento fechado, sem compromisso." },
      { p: "Qual a diferença entre landing page e site?", r: "A landing page tem um objetivo só, como uma campanha ou uma oferta, e leva o visitante a uma ação. O site apresenta o negócio inteiro. Se não souber qual escolher, me conte o objetivo e eu indico." },
      { p: "Quanto tempo leva para ficar pronto?", r: "Uma landing page sai mais rápido que um sistema com login. O prazo vem junto com o orçamento, combinado antes de começar." },
      { p: "Você usa template?", r: "Não. Cada site é escrito do zero em HTML, CSS e JavaScript, com o visual e as funções que o seu negócio pede." },
      { p: "O site funciona bem no celular?", r: "Sim. Todo projeto começa pela tela do celular, porque é de lá que vem a maior parte das visitas de um negócio local." },
      { p: "Vou aparecer no Google?", r: "O site sai com títulos, descrições, velocidade e estrutura que o Google lê bem. Ninguém pode garantir a primeira posição, mas a base fica certa." },
      { p: "Preciso ter domínio e hospedagem?", r: "Não precisa chegar com nada. Eu ajudo a registrar o domínio e publico o site." },
      { p: "Consigo mudar textos e fotos depois?", r: "Sim. Combinamos no orçamento se eu faço as atualizações ou se o site ganha um jeito simples de você mesmo editar." },
      { p: "Atende fora de Vila Flores?", r: "Sim. O atendimento acontece pelo WhatsApp e pelo e-mail, então a distância não muda nada." },
    ],
  },

  contato: {
    titulo: "Vamos conversar sobre o seu site?",
    texto: "Escolha o que você procura. A mensagem já vai pronta no WhatsApp e você recebe um orçamento sem compromisso.",
    opcoes: [
      { rotulo: "Landing page", desc: "Uma página para uma oferta ou campanha.", interesse: "landing page" },
      { rotulo: "Reformulação de site", desc: "Melhorar o site que eu já tenho.", interesse: "reformulação de site" },
      { rotulo: "Site do zero", desc: "Ainda não tenho site.", interesse: "site do zero" },
    ],
    alternativa: "Prefere escrever do seu jeito?",
  },
};

// ============================================================================
//  CRIATIVOS E CONTEÚDOS VIRAIS
// ============================================================================
export const criativos = {
  seo: {
    titulo: "Criativos e conteúdos virais · Vídeos para anunciar ou viralizar · WZS Studio",
    descricao: "Criativos para anúncios e conteúdos para alcance orgânico: roteiro, gancho e edição para Reels, TikTok e Shorts. Veja trabalhos reais com números públicos.",
    og: "/media/og/og-criativos.jpg",
  },
  hero: {
    rotulo: "Criativos e conteúdos virais",
    titulo: "Vídeo curto com *gancho, ritmo e roteiro.*",
    texto: "Crio criativos para anunciar uma oferta e conteúdos para ganhar alcance orgânico. São objetivos diferentes, com roteiros, formatos e métricas diferentes, e todo vídeo começa pelo público que precisa assistir.",
    cta: "Conversar sobre criativos",
    linha: "Roteiro, edição e formato para Reels, TikTok e anúncios: do gancho à chamada final.",
    ctaSecundario: "Ver trabalhos",
    prova: [
      { valor: "4 mi+", rotulo: "visualizações em 12 reels do @niloeoinfinito" },
      { valor: "36 mil", rotulo: "visualizações num perfil de 142 seguidores (@wzs_studio)" },
      { valor: "4,56%", rotulo: "CTR do melhor vídeo de anúncio do MedGrind" },
    ],
    fonteProva: "Instagram (contador público, 03/11/2026) e Gerenciador de Anúncios da Meta (08 a 20/10/2026). Visualização mede alcance e CTR mede clique: nenhum dos dois é venda.",
  },

  historia: {
    abertura: "Você também rola o feed. Quantos vídeos você pulou hoje?",
    problema: {
      rotulo: "O problema",
      passos: [
        { titulo: "O feed não espera.", texto: "A pessoa decide em segundos se fica ou passa para o próximo vídeo." },
        { titulo: "Sem gancho, ela rola." },
        { titulo: "Sem ritmo, sai no meio." },
        { titulo: "Sem roteiro, assiste e não faz nada." },
      ],
    },
    explode: { titulo: "É aqui que eu entro.", texto: "Eu monto o vídeo inteiro para segurar quem assiste, do gancho à chamada." },
    montagem: {
      rotulo: "Como eu monto",
      titulo: "Um reel que segura, camada por camada.",
      arquivo: "reel_estenose.mp4",
      camadas: [
        { nome: "Corte", trilha: "V1", texto: "Escolho os melhores trechos e corto no ritmo." },
        { nome: "Gancho", trilha: "T1", texto: "Uma frase forte nos primeiros segundos." },
        { nome: "Legenda", trilha: "TXT", texto: "Palavra por palavra, para quem assiste sem som." },
        { nome: "Som", trilha: "A1", texto: "Trilha e efeitos no tempo dos cortes." },
        { nome: "Chamada", trilha: "FX", texto: "Um pedido claro no final: comentar, salvar ou chamar." },
      ],
      quadros: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `/media/criativos/quadros/est-${i}.jpg`),
      video: "/media/criativos/estenose-insuficiencia.mp4", poster: "/media/criativos/estenose-insuficiencia.jpg",
    },
    sucesso: {
      titulo: "Publicado. Agora ele roda sozinho.",
      meio: "Curtidas, comentários e seguidores chegando.",
      contador: 481000, numero: "481 mil", rotuloNumero: "visualizações",
      legenda: "@niloeoinfinito · “Medo de voltar” · 82.584 curtidas",
      fonte: "Contador público do Instagram em 03/11/2026.",
      video: "/media/criativos/nilo-medo-de-voltar.mp4", poster: "/media/criativos/nilo-medo-de-voltar.jpg",
    },
    dinheiro: {
      rotulo: "Para anunciar",
      passos: [
        { titulo: "No anúncio, cada clique custa dinheiro." },
        { titulo: "Um criativo que prende a atenção paga menos por visita." },
        { numero: "R$ 0,15", texto: "por visita à página no vídeo Plantão do MedGrind, com CTR de 4,56%.", fonte: "Gerenciador de Anúncios da Meta, campanha de 08 a 20/10/2026. Mede clique e visita, não venda." },
      ],
      video: "/media/criativos/ad05v-plantao.mp4",
    },
    oportunidade: {
      rotulo: "A oportunidade",
      passos: [
        { titulo: "O algoritmo entrega o seu vídeo para quem ainda não te segue." },
        { numero: "36 mil", texto: "visualizações em um reel do @wzs_studio, um perfil com 142 seguidores.", fonte: "Instagram, 03/11/2026." },
        { numero: "4 mi+", texto: "visualizações em 12 reels do @niloeoinfinito, publicados em menos de duas semanas.", fonte: "Instagram, 03/11/2026." },
      ],
    },
    convite: "Vamos montar o seu?",
  },

  // números de cada fonte (cartões grandes)
  fontes: [
    { conta: "@niloeoinfinito", url: "https://www.instagram.com/niloeoinfinito/reels/", tema: "Fé e filosofia", numero: "4 mi+", rotulo: "visualizações em 12 reels", extras: ["733 mil no reel mais visto", "44,6 mil seguidores"] },
    { conta: "@felipen.med", url: "https://www.instagram.com/felipen.med/reels/", tema: "Medicina em pixel art", numero: "87,5 mil", rotulo: "visualizações no reel mais visto", extras: ["3 reels acima de 75 mil", "4.578 seguidores"] },
    { conta: "@wzs_studio", url: "https://www.instagram.com/wzs_studio/reels/", tema: "Sites, SEO e WhatsApp", numero: "36 mil", rotulo: "visualizações com 142 seguidores", extras: ["30,1 mil em outro reel"] },
    { conta: "MedGrind", tema: "Anúncio na Meta", numero: "4,56%", rotulo: "CTR do vídeo Plantão", extras: ["R$ 0,15 por visita à página", "campanha de 08 a 20/10/2026"] },
  ],
  fontesNota: "Números públicos dos perfis no Instagram em 03/11/2026 e do Gerenciador de Anúncios da Meta. Visualização mede alcance, CTR mede clique: nenhum dos dois é venda.",
  // reels de destaque que estão só no Instagram (link, sem baixar o vídeo)
  noInstagram: [
    { conta: "@niloeoinfinito", titulo: "Deus tem senso de humor?", numero: "733 mil", url: "https://www.instagram.com/niloeoinfinito/reel/DfA64eUyhsA/" },
    { conta: "@niloeoinfinito", titulo: "Deus é metido?", numero: "704 mil", url: "https://www.instagram.com/niloeoinfinito/reel/DfPpz_2S3D2/" },
    { conta: "@niloeoinfinito", titulo: "Meu amigo vai pro inferno?", numero: "612 mil", url: "https://www.instagram.com/niloeoinfinito/reel/DfLcLBXS9dt/" },
    { conta: "@felipen.med", titulo: "AVC isquêmico × AVC hemorrágico", numero: "76,8 mil", url: "https://www.instagram.com/felipen.med/reel/DeupHnlG8R0/" },
    { conta: "@wzs_studio", titulo: "Seu site é um fantasma?", numero: "36 mil", url: "https://www.instagram.com/wzs_studio/reel/DfLDpYnt53Z/" },
    { conta: "@wzs_studio", titulo: "Seu link chega vazio no WhatsApp?", numero: "30,1 mil", url: "https://www.instagram.com/wzs_studio/reel/DfFEpa6FRsa/" },
  ],

  planos: {
    titulo: "Escolha o objetivo.",
    itens: [
      { slug: "anunciar", nome: "Para anunciar", interesse: "anunciar", cta: "Quero anunciar",
        resumo: "Criativos para campanhas pagas: vender uma oferta e testar ganchos.",
        inclui: ["Roteiro com variações de gancho", "Edição em 9:16, 4:5 e 1:1", "Versão para o público de cada campanha"],
        metrica: "Medido por CTR, custo por resultado e conversão." },
      { slug: "viralizar", nome: "Para viralizar", interesse: "viralizar", cta: "Quero viralizar",
        resumo: "Vídeos para crescer no orgânico: alcance, comentários e seguidores.",
        inclui: ["Ideia e roteiro em formato de série", "Edição com legenda e som", "Pergunta no final para puxar comentários"],
        metrica: "Medido por visualizações, retenção e seguidores." },
    ],
    nota: "Ninguém controla o algoritmo: não existe garantia de viralização nem de vendas.",
  },

  objetivos: {
    titulo: "Anunciar e viralizar são trabalhos diferentes.",
    lead: "Um vídeo feito para vender uma oferta e um vídeo feito para ganhar alcance pedem ganchos, roteiros e métricas diferentes. Antes de começar, definimos qual é o objetivo.",
    itens: [
      {
        slug: "anunciar", tag: "Tráfego pago", nome: "Para anunciar", interesse: "anunciar", cta: "Quero criativos para anunciar",
        resumo: "Criativos para apresentar uma oferta, testar abordagens e apoiar campanhas de aquisição.",
        detalhes: [
          { t: "Objetivo", d: "Fazer a pessoa certa entender a oferta e tomar uma ação: clicar, chamar, comprar ou se cadastrar." },
          { t: "Onde aparece", d: "Anúncios no Instagram, Facebook, TikTok e YouTube, para o público escolhido na campanha." },
          { t: "Como é feito", d: "Mais de uma versão de gancho e de abordagem para a mesma oferta, para descobrir o que funciona melhor com o seu público." },
        ],
        metricas: ["Taxa de cliques (CTR)", "Custo por resultado", "Conversões", "Retenção nos primeiros segundos"],
      },
      {
        slug: "viralizar", tag: "Alcance orgânico", nome: "Para viralizar", interesse: "viralizar", cta: "Quero conteúdo para viralizar",
        resumo: "Conteúdos para conquistar atenção, gerar identificação e ampliar o alcance sem pagar pela distribuição.",
        detalhes: [
          { t: "Objetivo", d: "Fazer o vídeo ser assistido até o fim, compartilhado e salvo, e trazer seguidores para o perfil." },
          { t: "Onde aparece", d: "Reels, TikTok e Shorts, distribuído pelo algoritmo para quem ainda não segue você." },
          { t: "Como é feito", d: "Temas que geram identificação, gancho forte logo no primeiro segundo e um formato reconhecível, pensado para virar série." },
        ],
        metricas: ["Visualizações", "Retenção", "Compartilhamentos e salvamentos", "Novos seguidores"],
      },
    ],
    nota: "Ninguém controla o algoritmo: não existe garantia de viralização nem de vendas. O que dá para fazer é aumentar as chances com público bem definido, gancho testado e edição caprichada, e medir cada vídeo pela métrica do seu objetivo. *Muitas visualizações mostram alcance, não vendas.*",
  },

  trabalhosCab: {
    titulo: "Trabalhos com números públicos.",
    lead: "Selecionei os vídeos pelo desempenho e pela qualidade criativa. Os números são os que aparecem publicamente em cada perfil, com a data da consulta.",
  },

  // séries de vídeos. Cada vídeo: { id, titulo, arquivo, poster, duracao, data, objetivo, publico,
  // gancho, edicao, metricas: [{ tipo: "visualizações" | "curtidas" | ..., valor }], fonte, selo, grande }
  // publicar: false = a série fica pronta aqui, mas não aparece no site (use enquanto falta confirmar algo)
  series: [
    {
      slug: "felipen-med", conta: "@felipen.med", contaUrl: "https://www.instagram.com/felipen.med/",
      tema: "Medicina em vídeos curtos", nome: "Medicina que dá vontade de assistir até o fim.",
      descricao: [
        "Perfil próprio de conteúdo médico: comparações clínicas, casos e histórias de plantão em pixel art com simulação, voxel narrado, animação explicativa e formatos de escolha.",
        "Os vídeos abrem com um contraste ou uma pergunta (*“FA: dá pra viver anos com ela. FV: você tem minutos.”*) e terminam pedindo um comentário A ou B.",
      ],
      participacao: "ideia, roteiro, produção visual e edição (perfil próprio).",
      numeros: [
        { valor: "87,5 mil", rotulo: "visualizações no reel mais visto" },
        { valor: "3 reels", rotulo: "acima de 75 mil visualizações" },
        { valor: "4.578", rotulo: "seguidores" },
      ],
      fonte: "Contadores públicos do perfil no Instagram, consultados em 03/11/2026.",
      videos: [
        { id: "estenose-insuficiencia", grande: true, selo: "75,9 mil", titulo: "Estenose × insuficiência aórtica",
          arquivo: "/media/criativos/estenose-insuficiencia.mp4", poster: "/media/criativos/estenose-insuficiencia.jpg",
          metricas: [{ tipo: "visualizações", valor: "75,9 mil" }],
          objetivo: "Alcance orgânico e salvamentos.", publico: "Estudantes de medicina.",
          gancho: "“Esse sangue não foi desenhado, foi calculado.”",
          edicao: "Pixel art com simulação de fluido dentro da própria anatomia: o jato e o refluxo saem da física. Loop de 40 s com trilha sincronizada.",
          fonte: "Contador público do Instagram em 03/11/2026." },
        { id: "fa-x-fv", titulo: "FA × FV: só um ainda bombeia sangue",
          arquivo: "/media/criativos/fa-x-fv.mp4", poster: "/media/criativos/fa-x-fv.jpg",
          metricas: [{ tipo: "visualizações", valor: "31,2 mil" }],
          objetivo: "Alcance orgânico e comentários.", publico: "Estudantes de medicina.",
          gancho: "“FA: dá pra viver anos com ela. FV: você tem minutos.”",
          edicao: "Pixel art em 60 fps com os dois corações lado a lado, loop perfeito de 40 s e pergunta A ou B na legenda.",
          fonte: "Print do perfil em 16/10/2026; o número atual pode ser maior." },
        { id: "dpp-x-placenta-previa", titulo: "DPP × placenta prévia",
          arquivo: "/media/criativos/dpp-x-placenta-previa.mp4", poster: "/media/criativos/dpp-x-placenta-previa.jpg", data: "2026-11-03",
          metricas: [{ tipo: "visualizações", valor: "12,1 mil" }],
          objetivo: "Alcance orgânico e salvamentos.", publico: "Estudantes de medicina.",
          gancho: "“As duas sangram, uma dói e a outra não.”",
          edicao: "Comparação em pixel art com zoom nos detalhes que diferenciam os dois quadros.",
          fonte: "Contador público em 03/11/2026, cerca de 11 horas depois da publicação." },
        { id: "ultimo-plantao", titulo: "O último plantão",
          arquivo: "/media/criativos/ultimo-plantao.mp4", poster: "/media/criativos/ultimo-plantao.jpg",
          objetivo: "Identificação e compartilhamento.", publico: "Estudantes e profissionais de saúde.",
          gancho: "“O último plantão: seis anos num hospital, num corredor só.”",
          edicao: "Voxel 3D narrado, cena a cena pelos setores do hospital; termina com uma pergunta para os comentários." },
        { id: "soro-tce", titulo: "Soro no traumatismo craniano",
          arquivo: "/media/criativos/soro-tce.mp4", poster: "/media/criativos/soro-tce.jpg",
          objetivo: "Educação e autoridade no tema.", publico: "Estudantes de medicina.",
          gancho: "Abre direto no caso: “Traumatismo craniano grave…”",
          edicao: "Animação explicativa em estilo flat, com a voz real do autor e efeitos sonoros sincronizados a cada cena." },
      ],
    },
    {
      slug: "wzs-studio", conta: "@wzs_studio", contaUrl: "https://www.instagram.com/wzs_studio/",
      tema: "Conteúdo para atrair clientes", nome: "Vídeos que vendem a ideia de ter um site.",
      descricao: [
        "Série do próprio estúdio: explica, na linguagem de quem tem um negócio, por que um site ajuda a ser encontrado e a receber contatos.",
      ],
      videos: [
        { id: "wzs-cidade", titulo: "Ninguém sabe que o seu negócio existe",
          arquivo: "/media/criativos/wzs-cidade.mp4", poster: "/media/criativos/wzs-cidade.jpg",
          objetivo: "Atrair clientes para o serviço de sites (orgânico).", publico: "Donos de negócio local.",
          gancho: "“Esse aqui é o seu negócio. E ele tem um problema. Ninguém sabe que ele existe.”",
          edicao: "Cidade isométrica em 3D, legendas cinéticas e contadores que sobem ao vivo." },
        { id: "wzs-isso-e-um-site", titulo: "Isso aqui é um site",
          arquivo: "/media/criativos/wzs-isso-e-um-site.mp4", poster: "/media/criativos/wzs-isso-e-um-site.jpg",
          objetivo: "Mostrar trabalhos reais e gerar conversa.", publico: "Donos de negócio local.",
          gancho: "“Isso aqui é um site.”",
          edicao: "Sites reais em janelas de navegador, cortados no ritmo da trilha." },
        { id: "wzs-seo-ep01", titulo: "SEO na prática, episódio 1",
          arquivo: "/media/criativos/wzs-seo-ep01.mp4", poster: "/media/criativos/wzs-seo-ep01.jpg",
          objetivo: "Educar e criar autoridade (série).", publico: "Donos de negócio que querem aparecer no Google.",
          gancho: "“Como o Google escolhe quem aparece primeiro?”",
          edicao: "Editor de código e resultado do Google animados, com um quiz A ou B; primeiro episódio de uma série de cinco." },
      ],
    },
    {
      slug: "marcas-proprias", conta: "@medgrind_oficial e @1upmed_", contaUrl: "https://www.instagram.com/medgrind_oficial/",
      tema: "Produtos próprios", nome: "Conteúdo para jogos de estudo.",
      descricao: [
        "Reels orgânicos para os jogos MedGrind e 1UPmed: gameplay real, narração e uma pergunta para o público responder.",
      ],
      videos: [
        { id: "medgrind-bora-atender", titulo: "Bora atender no MedGrind",
          arquivo: "/media/criativos/medgrind-bora-atender.mp4", poster: "/media/criativos/medgrind-bora-atender.jpg",
          objetivo: "Mostrar o produto em uso e levar à assinatura.", publico: "Estudantes de medicina.",
          gancho: "“Bora assumir o médico e atender de verdade.”",
          edicao: "Gameplay real do Modo Plantonista com narração e legenda; termina na oferta." },
        { id: "1upmed-dr-joaozinho", titulo: "Doutor Joãozinho, episódio 1",
          arquivo: "/media/criativos/1upmed-dr-joaozinho.mp4", poster: "/media/criativos/1upmed-dr-joaozinho.jpg",
          objetivo: "Série interativa para criar hábito de voltar ao perfil.", publico: "Estudantes de medicina.",
          gancho: "“Oi! Eu sou o Doutor Joãozinho, recém-formado… quem vai decidir a minha vida são vocês.”",
          edicao: "Gameplay narrado pelo personagem; os comentários decidem o que acontece no próximo episódio." },
      ],
    },
    // Perfis citados no briefing que ainda precisam de confirmação antes de aparecer no site.
    // Números públicos consultados em 03/11/2026; faltam os arquivos de vídeo e a confirmação de autoria.
    {
      slug: "nilo", conta: "@niloeoinfinito", contaUrl: "https://www.instagram.com/niloeoinfinito/reels/",
      tema: "Fé e filosofia", nome: "Perguntas pequenas, reflexões gigantes.",
      descricao: ["Diálogos curtos com Deus em voxel 3D: uma pergunta que todo mundo já fez, respondida em menos de dois minutos."],
      numeros: [
        { valor: "4 milhões+", rotulo: "visualizações somadas nos 12 reels publicados até 03/11/2026" },
        { valor: "44,6 mil", rotulo: "seguidores" },
        { valor: "733 mil", rotulo: "visualizações no reel mais visto" },
      ],
      fonte: "Contadores públicos do perfil no Instagram, consultados em 03/11/2026.",
      videos: [
        { id: "nilo-medo-de-voltar", grande: true, selo: "481 mil", titulo: "Medo de voltar",
          arquivo: "/media/criativos/nilo-medo-de-voltar.mp4", poster: "/media/criativos/nilo-medo-de-voltar.jpg", data: "2026-10-27",
          metricas: [{ tipo: "visualizações", valor: "481 mil" }, { tipo: "curtidas", valor: "82.584" }],
          objetivo: "Alcance orgânico e identificação.", publico: "Pessoas de fé e quem tem dúvidas sobre fé.",
          gancho: "Uma pergunta íntima, dita em voz alta.",
          edicao: "Diálogo em voxel 3D com vozes, expressões e cortes no ritmo da fala.",
          fonte: "Contador público do Instagram em 03/11/2026. Publicado em 27/10/2026." },
      ],
      // reels de referência: DfA64eUyhsA “Deus tem senso de humor?” 733 mil · DfPpz_2S3D2 “Deus é metido?” 704 mil ·
      // DfLcLBXS9dt “Meu amigo vai pro inferno?” 612 mil · De_0tWGyjO6 “Medo de voltar” 481 mil
    },
    {
      slug: "night-clinic", publicar: false, conta: "@the.night.clinic", contaUrl: "https://www.instagram.com/the.night.clinic/",
      tema: "Saúde em pixel art, em inglês", nome: "Health information everyone deserves to know.",
      descricao: ["PENDENTE: confirmar a autoria/participação e enviar os arquivos dos vídeos."],
      numeros: [{ valor: "33,1 mil", rotulo: "seguidores" }, { valor: "62,8 mil", rotulo: "curtidas em “Why Lift Her Legs?”" }],
      fonte: "Contadores públicos do perfil no Instagram, consultados em 03/11/2026.",
      videos: [],
    },
  ],

  // Anúncios e criativos de conversão: a seção só aparece quando houver vídeos aqui.
  anuncios: {
    titulo: "Os criativos que vendem.",
    lead: "Anúncios e peças de motion feitos em código: ritmo, tipografia em movimento e a oferta clara no final.",
    conta: "Anúncios e motion", tema: "Criativos de conversão", slug: "anuncios", nomeSerie: "Feitos para vender.",
    descricao: [
      "Vídeos de 15 a 28 s para campanhas pagas, com imagens reais do produto, HUD animado e trilha no tempo dos cortes. O mesmo corpo de vídeo ganha ganchos diferentes para testar qual segura melhor.",
    ],
    numeros: [
      { valor: "4,56%", rotulo: "CTR do vídeo Plantão" },
      { valor: "R$ 0,15", rotulo: "por visita à página" },
    ],
    fonte: "Gerenciador de Anúncios da Meta, campanha de tráfego de 08 a 20/10/2026.",
    videos: [
      { id: "ad05v-plantao", grande: true, selo: "CTR 4,56%", titulo: "Plantão: “Paciente na sala 1. A conduta é sua.”",
        arquivo: "/media/criativos/ad05v-plantao.mp4", poster: "/media/criativos/ad05v-plantao.jpg",
        metricas: [{ tipo: "CTR", valor: "4,56%" }, { tipo: "por visita", valor: "R$ 0,15" }],
        objetivo: "Levar estudantes à página e à assinatura.", gancho: "“Paciente na sala 1.” → “A conduta é sua.”",
        edicao: "Imagens reais do Modo Plantonista com HUD animado, 15 s, em 9:16, 4:5 e 1:1.",
        fonte: "Meta Ads, 08 a 20/10/2026, medido na primeira versão deste vídeo; só o cartão final mudou." },
      { id: "medgrind-meta-15s", titulo: "“4 horas estudando… e o seu progresso?”",
        arquivo: "/media/criativos/medgrind-meta-15s.mp4", poster: "/media/criativos/medgrind-meta-15s.jpg",
        objetivo: "Anúncio de 15 s para o MedGrind.", gancho: "Um cronômetro rodando: “4 horas estudando.”",
        edicao: "Motion graphics em HUD, tipografia cinética e trilha na batida." },
      { id: "medgrind-showreel", titulo: "Showreel de lançamento do MedGrind",
        arquivo: "/media/criativos/medgrind-showreel.mp4", poster: "/media/criativos/medgrind-showreel.jpg",
        objetivo: "Apresentar o produto em 16 s.", gancho: "“Você estuda horas. Nada evolui.”",
        edicao: "Interface real do jogo com cursor demonstrando cada recurso, cortes na trilha." },
      { id: "motion-feito-em-codigo", titulo: "“Feito em código.”",
        arquivo: "/media/criativos/motion-feito-em-codigo.mp4", poster: "/media/criativos/motion-feito-em-codigo.jpg",
        objetivo: "Peça de demonstração do estilo de motion.", gancho: "“Feito em código.”",
        edicao: "Molas, curvas de movimento e quatro formatos, tudo gerado em código e sincronizado com a música." },
      { id: "exemplo-fluxo", titulo: "“Você ainda faz tudo à mão?”",
        arquivo: "/media/criativos/exemplo-fluxo.mp4", poster: "/media/criativos/exemplo-fluxo.jpg",
        objetivo: "Exemplo de anúncio para um app de automação (marca de demonstração).", gancho: "“Você ainda faz tudo à mão?”",
        edicao: "Motion graphics de 15 s com formas, tipografia e cortes no compasso." },
      { id: "ad08-hipocrates", titulo: "“Contratei o Hipócrates.”",
        arquivo: "/media/criativos/ad08-hipocrates.mp4", poster: "/media/criativos/ad08-hipocrates.jpg",
        objetivo: "Apresentar a equipe de médicos do jogo.", gancho: "“Contratei o Hipócrates.”",
        edicao: "Uma carta vira e revela o médico lendário que entra para a equipe." },
    ],
  },

  processo: {
    titulo: "Do público ao vídeo publicado.",
    lead: "O processo muda conforme o escopo, mas costuma passar por estas etapas.",
    trilhas: [
      { nome: "V1", clips: [
        { nome: "Gancho", nota: "0–3 s", x: 0, w: 11, cor: "#ff4d2e" },
        { nome: "Desenvolvimento", nota: "o que segura até o fim", x: 11.5, w: 56, cor: "#ff7a45" },
        { nome: "Virada", nota: "prova ou surpresa", x: 68, w: 16, cor: "#ffb547" },
        { nome: "Chamada", nota: "ação", x: 84.5, w: 15.5, cor: "#ff4d2e" },
      ] },
      { nome: "TXT", clips: [{ nome: "Legendas e textos na tela", nota: "para quem assiste sem som", x: 0, w: 100, cor: "#8fd3ff" }] },
      { nome: "A1", clips: [{ nome: "Voz", x: 2, w: 80, cor: "#ffb547" }, { nome: "Trilha e efeitos", x: 82.5, w: 17.5, cor: "#ff7a45" }] },
    ],
    passos: [
      { nome: "Público", texto: "Quem precisa ver, o que essa pessoa já sabe e o que faria ela parar de rolar." },
      { nome: "Pesquisa", texto: "Referências, comentários, dúvidas frequentes e o que já funciona no nicho." },
      { nome: "Ideia", texto: "O ângulo do vídeo: uma pergunta, uma situação ou uma promessa clara." },
      { nome: "Roteiro", texto: "Gancho nos primeiros segundos, desenvolvimento curto e um final que leva a uma ação." },
      { nome: "Edição", texto: "Ritmo, cortes, legendas, som e elementos visuais que seguram a atenção." },
      { nome: "Formatos", texto: "Adaptação para Reels, TikTok, Shorts e anúncios, nos tamanhos e durações de cada um." },
    ],
  },

  faq: {
    titulo: "Antes de começar.",
    itens: [
      { p: "Você garante que o vídeo vai viralizar?", r: "Não. Ninguém controla o algoritmo. O trabalho é aumentar as chances: entender o público, escolher o ângulo, testar ganchos e editar com ritmo. Os números desta página são resultados reais de outros perfis, não uma promessa." },
      { p: "Qual a diferença entre criativo para anúncio e conteúdo orgânico?", r: "O criativo para anúncio é mostrado para um público escolhido na campanha e é medido por cliques, custo e conversões. O conteúdo orgânico depende do algoritmo e é medido por visualizações, retenção, compartilhamentos e seguidores." },
      { p: "Muitas visualizações significam mais vendas?", r: "Não necessariamente. Visualização mostra alcance. Venda depende da oferta, do público e do caminho até a compra. Por isso cada vídeo começa com um objetivo e uma métrica." },
      { p: "Quanto custa?", r: "Depende do objetivo, do formato e da quantidade de vídeos. Você conta o que precisa pelo WhatsApp e recebe um orçamento sem compromisso." },
      { p: "O que eu preciso enviar para começar?", r: "O que você vende, para quem, e exemplos de vídeos de que você gosta, seus ou de outros perfis. Se já tiver gravações, fotos ou a identidade visual da marca, elas ajudam." },
    ],
  },

  contato: {
    titulo: "Qual é o objetivo do seu próximo vídeo?",
    texto: "Escolha abaixo. A mensagem já vai pronta no WhatsApp.",
    opcoes: [
      { rotulo: "Anunciar", desc: "Criativos para campanhas e ofertas.", interesse: "anunciar" },
      { rotulo: "Viralizar", desc: "Conteúdo para alcance orgânico.", interesse: "viralizar" },
    ],
    alternativa: "Ainda não sabe qual?",
  },
};
