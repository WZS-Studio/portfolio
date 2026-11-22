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
  cidade: "Atendimento em todo o Brasil",
  dominio: "https://wzsstudio.com.br",
  email: "wzs.studio11@gmail.com",
  assinatura: "Vídeos e sites para médicos e clínicas, com base clínica e dentro das regras de publicidade do CFM.",
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
// Clientes que aparecem como prova social (cartão com foto ao lado dos números de Criativos e no caso em destaque de Sites).
// Números do perfil público, com a data: são do perfil do cliente, não resultado do trabalho.
export const clientes = [
  {
    slug: "lucas-tosi", nome: "Dr. Lucas Tosi", especialidade: "Ginecologista e obstetra",
    // conferidos no Guia Médico do CREMESP em 19/11/2026 (Lucas de Almeida Tosi, inscrição ativa)
    registro: "CRM-SP 165212 · RQE 109323",
    // foto do perfil dele no Instagram (baixada em 20/11/2026, com a autorização do Felipe)
    foto: "/media/clientes/dr-lucastosi.jpg",
    instagram: "https://www.instagram.com/dr.lucastosi/", arroba: "@dr.lucastosi", verificado: true,
    numeros: [{ valor: "130 mil", rotulo: "seguidores" }, { valor: "2.299", rotulo: "publicações" }],
    fonte: "Perfil público no Instagram em 20/11/2026. Os números são do perfil dele, não resultado dos vídeos.",
    feito: ["Vídeos com animação 3D sobre *estrogênio, mioma e canetas emagrecedoras*", "A landing do livro *“A revolução da mulher 40+”*, com o livro em 3D", "A proposta do *site do consultório*, com as quatro áreas de cuidado"],
    site: "https://wzsstudio.com.br/LUCASTOSI/",
  },
];

// Quem assina o conteúdo próprio (@felipen.med): a foto aparece onde o site cita o perfil.
// verificado: o perfil não tinha o selo azul do Instagram em 20/11/2026; ligue só quando tiver.
export const autor = { arroba: "@felipen.med", conta: "felipen.med", foto: "/media/clientes/felipen-med.jpg", verificado: false };

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
    titulo: "WZS Studio · Vídeos e sites para médicos e clínicas",
    descricao: "Vídeos curtos de conteúdo médico e sites para consultórios e clínicas, com base clínica e dentro das regras de publicidade do CFM. Veja os trabalhos e fale pelo WhatsApp.",
    og: "/media/og/og-portal.jpg",
  },
  rotulo: "WZS Studio · conteúdo e sites para médicos",
  titulo: "Escolha por onde começar.",
  criativos: {
    palavra: "Criativos", complemento: "e conteúdo médico",
    texto: "Vídeos curtos que explicam medicina com clareza e seguram quem assiste, para o seu perfil ou para os seus anúncios.",
    cta: "Entrar em Criativos",
  },
  sites: {
    palavra: "Sites", complemento: "para médicos e clínicas",
    texto: "Sites escritos do zero para o paciente encontrar você, entender como você atende e agendar.",
    cta: "Entrar em Sites",
  },
  resumo: {
    titulo: "Medicina bem explicada, do vídeo ao agendamento.",
    texto: "De um lado, vídeos que fazem a pessoa parar de rolar e entender um assunto de saúde. Do outro, o site que recebe essa atenção e leva o paciente até a sua agenda. Dá para contratar um, o outro ou os dois.",
    criativos: "Conteúdo médico em 3D, pixel art e motion, com roteiro conferido na fonte, trabalhos reais e números públicos.",
    sites: "Site de consultório ou clínica, landing page ou reformulação, com CRM e RQE à vista e estudos de caso reais.",
  },
};

// ============================================================================
//  SITES PARA MÉDICOS E CLÍNICAS
// ============================================================================
export const sites = {
  seo: {
    titulo: "Sites para médicos e clínicas · Consultório, clínica e landing page · WZS Studio",
    descricao: "Sites para consultórios e clínicas, pensados primeiro para o celular, com CRM e RQE à vista e um caminho claro até o agendamento pelo WhatsApp. Veja estudos de caso reais.",
    og: "/media/og/og-sites.jpg",
  },
  hero: {
    rotulo: "Sites para médicos e clínicas",
    titulo: "Sites escritos do zero para o paciente *encontrar, confiar e agendar.*",
    texto: "O site de um médico precisa explicar com clareza, passar confiança e respeitar as regras de publicidade do CFM, tudo ao mesmo tempo. Desenhamos e programamos cada parte, sem template e pensando primeiro na tela do celular.",
    cta: "Conversar sobre meu site",
    linha: "Desenhamos e programamos sites para consultórios e clínicas: abrem rápido no celular, mostram quem atende e levam o paciente até o agendamento.",
    ctaSecundario: "Ver projetos",
    nota: "Orçamento sem compromisso, direto no WhatsApp.",
  },

  // A jornada é contada em capítulos presos na tela enquanto a pessoa rola.
  // Cada passo aparece numa faixa da rolagem do capítulo; textos curtos funcionam melhor.
  historia: {
    abertura: "O paciente pesquisou o seu nome. O que ele encontrou?",
    problema: {
      rotulo: "O problema",
      passos: [
        { titulo: "Demorou para abrir. Ele fechou." },
        { titulo: "Abriu, mas não achou a sua especialidade." },
        { titulo: "Gostou, mas não achou como agendar." },
        { titulo: "E marcou com outro médico." },
      ],
    },
    montagem: {
      rotulo: "Como construímos",
      titulo: "O site de um consultório, camada por camada.",
      // a tela 3D deste capítulo monta o site do Dr. Valter Dias (assets/js/dispositivos.js) e termina na captura real
      camadas: [
        { nome: "Mensagem", arquivo: "index.html", texto: "O que você trata e para quem, na primeira tela.",
          codigo: ['<h1 class="titulo">', '  Estética que começa', '  pela sua saúde', '</h1>'] },
        { nome: "Design", arquivo: "estilo.css", texto: "Cores, tipografia e espaço com a sobriedade que a saúde pede.",
          codigo: [':root { --ouro: #b99a5b; }', 'body { background: #f7f4ee; }', '.titulo { font: 400 56px "Fraunces"; }'] },
        { nome: "Conteúdo", arquivo: "index.html", texto: "Quem atende, como atende e o que o paciente precisa saber antes de ir.",
          codigo: ['<p>Antes de indicar qualquer', '   procedimento, avalio sua pele,', '   sua rotina e os remédios.</p>'] },
        { nome: "Celular", arquivo: "celular.css", texto: "A mesma página pensada para a tela em pé.",
          codigo: ['@media (max-width: 760px) {', '  .titulo { font-size: 36px; }', '}'] },
        { nome: "Ação", arquivo: "acao.html", texto: "O botão de agendar sempre à vista, levando direto ao WhatsApp.",
          codigo: ['<a class="btn" href="https://wa.me/...">', '  Agendar minha avaliação', '</a>'] },
      ],
    },
    // caso em destaque: o site gravado rolando voa nas telas do notebook e do celular (tools/voo.mjs lucas-tosi-clinica) e o projeto abre o estudo de caso.
    // O Felipe pediu o Dr. Lucas aqui ("ele é referência") e que a landing virasse um site de clínica: é a proposta feita em Si/lucas-tosi-clinica,
    // ainda não aprovada nem publicada (por isso não tem "Ver no ar"). A landing do livro continua no carrossel.
    caso: {
      rotulo: "Caso em destaque",
      projeto: "lucas-tosi-clinica",
      passos: [
        { titulo: "Dr. Lucas Tosi", texto: "A proposta de site do consultório, feita a partir da landing do livro.", cliente: true },
        { titulo: "Uma página para cada assunto.", texto: "Menopausa, reposição hormonal, emagrecimento e laser: o que é, quando procurar, os limites de cada tratamento e as referências." },
        { titulo: "O livro continua em 3D.", texto: "Numa seção só, onde a página vira com o dedo, no computador e no celular." },
        { titulo: "Rápido no celular.", texto: "No 3G, o texto da abertura aparece em 1,7 s. O livro 3D carrega depois, sem segurar a página.", fonte: "Teste da WZS Studio: celular emulado, rede 3G do Chrome, processador 4× mais lento, sem cache, mediana de 3 cargas, em 20/11/2026." },
        { titulo: "Do clique à consulta.", texto: "Cada botão abre o WhatsApp do consultório com a mensagem pronta e a cidade escolhida. CRM e RQE à vista, sem promessa de resultado.", acoes: true },
      ],
    },
    // depoimento de cliente (texto passado pelo Felipe em 20/11/2026); a agenda ao lado enche com a rolagem
    depoimento: {
      rotulo: "Na prática",
      passos: [
        { titulo: "Uma clínica recém-aberta, com a agenda vazia." },
        { titulo: "Site novo no ar.", texto: "E o reconhecimento da clínica na cidade cresceu." },
        { titulo: "Hoje, a agenda está cheia.", depoimento: { texto: "Eu estava bem desanimada, mas, com o site novo, meu reconhecimento local aumentou muito! Não tenho mais horário livre, basicamente!", nome: "Dra. Mariana", cargo: "cliente de site da WZS Studio" } },
      ],
    },
    oportunidade: {
      rotulo: "A oportunidade",
      passos: [
        { titulo: "Quem procura médico, procura pelo celular." },
        { titulo: "O site é onde o interesse vira agendamento.", texto: "WhatsApp do consultório a um toque, com a mensagem já escrita." },
      ],
    },
    cafe: {
      rotulo: "Para manter",
      passos: [
        { titulo: "E para manter o site no ar?" },
        { numero: "R$ 0,11", texto: "por dia é o custo do domínio .com.br: R$ 40 por ano no Registro.br.", fonte: "Registro.br / NIC.br, valor anual do domínio .com.br, consultado em 04/11/2026." },
        { titulo: "Menos que um cafezinho.", texto: "A hospedagem é paga à parte, com a MasterSite, parceira da WZS Studio.", parceria: true },
      ],
    },
    convite: "Vamos construir o seu?",
  },

  // parceria de hospedagem (o selo aparece no capítulo do café e abaixo dos planos)
  parceria: {
    nome: "MasterSite", rotulo: "Parceria de hospedagem", logo: "/assets/mastersite-logo.webp",
    texto: "A hospedagem do site é paga à parte. A WZS Studio tem parceria com a MasterSite para colocar o seu site no ar.",
  },

  planos: {
    titulo: "Escolha o seu ponto de partida.",
    itens: [
      { slug: "landing-page", nome: "Landing page", interesse: "landing page", cta: "Quero uma landing page",
        resumo: "Uma página para um tratamento, um procedimento ou uma campanha.",
        inclui: ["Texto e estrutura para uma única ação", "Design e código do zero", "WhatsApp com mensagem pronta"] },
      { slug: "reformulacao", nome: "Reformulação", interesse: "reformulação de site", cta: "Quero reformular meu site",
        resumo: "O site que você já tem, mais claro, mais rápido e revisado pelas regras do CFM.",
        inclui: ["Leitura do site atual", "Nova organização e novo visual", "Publicação no mesmo domínio"] },
      { slug: "site-do-zero", nome: "Site do zero", interesse: "site do zero", cta: "Quero um site do zero",
        resumo: "O endereço próprio do consultório ou da clínica.",
        inclui: ["Equipe, especialidades e como agendar", "CRM e RQE à vista em todas as páginas", "Ajuda com o domínio e publicação"] },
    ],
  },

  projetosCab: {
    titulo: "Cada projeto começou com um problema real.",
    lead: "Abra um estudo de caso para ver para quem foi feito, o que precisava resolver, as decisões de design e as telas reais no computador e no celular.",
  },

  // peso: "destaque" (largura total) | "medio" | "compacto"
  // capturas: caminhos a partir da raiz do site; a primeira de cada lista é a principal
  // resultados: [{ valor, rotulo, fonte, data, contexto }] — só dados medidos
  // publicar: false = o projeto fica guardado aqui, mas não aparece no site (desde 20/11/2026 o site mostra só a área da saúde)
  projetos: [
    {
      // proposta feita em Si/lucas-tosi-clinica (20/11/2026), a partir da landing do livro; não aprovada nem publicada ainda
      slug: "lucas-tosi-clinica", cliente: "lucas-tosi", barra: "consultório do dr. lucas tosi · proposta", nome: "Dr. Lucas Tosi", peso: "destaque", interesse: "site de consultório",
      tipo: "Site de consultório · ginecologia · proposta",
      linha: "O site do consultório, feito a partir da landing do livro: quatro áreas de cuidado, os dois lugares de atendimento e o livro em 3D.",
      oQueE: "Proposta de site para o consultório do Dr. Lucas Tosi, ginecologista e obstetra que atende mulheres na transição da menopausa em Santa Cruz do Rio Pardo e em Alphaville (SP). São 12 páginas: a inicial, uma para cada área (menopausa, reposição hormonal, emagrecimento e laser), o perfil do médico, onde atende, conteúdos em vídeo, agendamento, privacidade e a página de erro.",
      paraQuem: "A mulher de 40 anos ou mais com sintomas da transição, que chega pelo Instagram dele ou pela busca, lê no celular e quer entender o que acontece antes de decidir um tratamento.",
      desafio: "Convencer sem prometer, com CRM e RQE à vista, em temas em que a publicidade costuma exagerar (emagrecimento, reposição hormonal e laser íntimo), e manter a personalidade da landing do livro sem que o site vire peça de lançamento.",
      feito: "Na página inicial: a proposta do médico, as quatro áreas, quem atende, os dois lugares de atendimento, três vídeos feitos pela WZS, o livro em 3D que vira a página no arraste, o Instituto Tosi, a MenoRun e o agendamento pelo WhatsApp com a mensagem pronta para cada cidade. Cada área tem o que é, quando procurar, o que acontece na consulta, as opções e quando não são indicadas, perguntas frequentes e referências.",
      decisoes: [
        "Faixas pretas para a voz do médico (abertura, quem atende, vídeos e livro) e faixas em branco quente para ler: texto longo de saúde em fundo preto cansa.",
        "O 3D aparece só onde diz algo: o livro, prova de que ele explica o assunto em linguagem clara. Ele é montado logo depois da carga, para não dar tranco na rolagem.",
        "Cada área tem uma seção “quando não é indicado”: mostrar os limites dá confiança e segue a Resolução CFM nº 2.336/2023.",
        "Agendar sem formulário: o botão abre o WhatsApp com a cidade escolhida, sem cookies e sem dado de saúde passando pelo site (LGPD).",
        "O que ainda depende do consultório (endereço, horários e convênios) aparece marcado “a confirmar”, em vez de texto inventado.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Three.js"],
      capturaNota: "proposta, ainda não publicada",
      capturas: {
        desktop: ["/media/sites/lucas-tosi-clinica/desk-1.webp", "/media/sites/lucas-tosi-clinica/desk-2.webp", "/media/sites/lucas-tosi-clinica/desk-3.webp", "/media/sites/lucas-tosi-clinica/desk-4.webp"],
        celular: ["/media/sites/lucas-tosi-clinica/cel-1.webp", "/media/sites/lucas-tosi-clinica/cel-2.webp", "/media/sites/lucas-tosi-clinica/cel-3.webp"],
      },
      resultados: [
        { valor: "1,7 s", rotulo: "até o texto da abertura aparecer num celular em 3G, sem cache", fonte: "Teste da WZS Studio: celular emulado, rede 3G do Chrome, processador 4× mais lento, sem cache, mediana de 3 cargas", data: "20/11/2026" },
        { valor: "11 KB", rotulo: "de HTML na página inicial, com 1,2 KB de JavaScript", fonte: "Arquivos do projeto comprimidos com brotli", data: "20/11/2026" },
      ],
      nota: "Proposta de site, ainda não publicada. Fotos do palco: @oandrewillian (encontro do Clube VERO).",
    },
    {
      // demonstração feita em Si/compasso (20/11/2026): marca fictícia, a mesma dos dois anúncios de Criativos; no ar em /COMPASSO/ (cópia do dist)
      slug: "compasso", nome: "Compasso", peso: "medio", interesse: "site de clínica",
      tipo: "Site de clínica · cardiologia · demonstração",
      linha: "O site de uma clínica de check-up do coração que continua os dois anúncios da marca, com a mesma voz e os mesmos números.",
      url: "https://wzsstudio.com.br/COMPASSO/", urlRotulo: "wzsstudio.com.br/COMPASSO",
      oQueE: "Projeto de demonstração: a Compasso é uma clínica fictícia de check-up do coração, criada pela WZS Studio para mostrar o que entregamos quando a campanha de vídeo já existe. São 8 páginas: a inicial, o check-up etapa por etapa com o preparo, para quem é, equipe, dúvidas, agendamento, privacidade e a página de erro.",
      paraQuem: "Quem nunca fez um check-up do coração, quem tem pressão ou colesterol alto na família, quem vai começar a treinar e, em especial, a mulher que cuida de todo mundo e se deixa para depois.",
      desafio: "Os dois anúncios falam em tons opostos, um de precisão e outro de cuidado. O site precisava juntar os dois sem virar duas marcas, abrir rápido no celular e seguir a Resolução CFM nº 2.336/2023 e a LGPD sem parecer um formulário jurídico.",
      feito: "Um site que começa em “precisão” e vira “cuidado” no meio da página inicial, com uma frase de ponte: “Precisão é como a gente examina. Cuidado é como a gente recebe.” O coração do anúncio abre a página, as cinco etapas se marcam como no vídeo e a lista do dia termina em “e o seu coração?”.",
      decisoes: [
        "Duas metades, como os dois anúncios: azul-noite, linhas de exame e DM Sans para explicar o check-up; cacau, creme e serifa itálica para falar com quem vai fazer.",
        "O coração do anúncio entra como vídeo leve depois da carga, sem WebGL. Com economia de dados ou “reduzir movimento”, fica a imagem parada.",
        "A copy manda: entradas curtas, nenhuma seção presa na tela e a rolagem sempre livre.",
        "Responsável técnico com CRM e RQE no topo e no rodapé, aviso de urgência (192), equipe sem fotos de rosto e nenhuma promessa de resultado.",
        "Agendar sem formulário de saúde: duas escolhas montam a mensagem do WhatsApp, e o site não usa cookies nem medição.",
      ],
      stack: ["HTML", "CSS", "JavaScript"],
      capturaNota: "demonstração com marca fictícia",
      capturas: {
        desktop: ["/media/sites/compasso/desk-1.webp", "/media/sites/compasso/desk-2.webp", "/media/sites/compasso/desk-3.webp", "/media/sites/compasso/desk-4.webp"],
        celular: ["/media/sites/compasso/cel-1.webp", "/media/sites/compasso/cel-2.webp", "/media/sites/compasso/cel-3.webp"],
      },
      resultados: [
        { valor: "1,9 s", rotulo: "até o título aparecer num celular em 3G, sem cache", fonte: "Teste da WZS Studio: celular emulado, rede 3G do Chrome, processador 4× mais lento, sem cache, mediana de 3 cargas", data: "20/11/2026" },
        { valor: "135 KB", rotulo: "na primeira tela do celular, com as fontes e o coração", fonte: "Soma dos arquivos da primeira tela comprimidos com brotli", data: "20/11/2026" },
      ],
      nota: "Marca, equipe, CRM, endereço e contatos fictícios. As imagens saem dos dois anúncios da marca, gerados sem pessoas reais; os anúncios estão em Criativos, em “Para anunciar”.",
    },
    {
      slug: "valter", barra: "dr. valter dias · site pronto", nome: "Dr. Valter Dias", peso: "compacto", interesse: "site do zero",
      tipo: "Site · farmácia clínica e estética",
      linha: "Um site de 32 páginas para um farmacêutico clínico e esteta de Adamantina-SP, com a avaliação individual como ponto de partida.",
      oQueE: "Consultório do Dr. Valter Dias, farmacêutico clínico e esteta em Adamantina-SP: estética facial e corporal e farmácia clínica, com atendimento particular e hora marcada.",
      paraQuem: "Quem procura estética facial ou corporal em Adamantina e quer que a avaliação considere a saúde e os remédios em uso, e quem precisa revisar medicamentos e suplementos.",
      feito: "Início com mármore animado, apresentação do Dr. Valter, as três frentes (Rosto, Corpo, Farmácia clínica) em painéis que se abrem, oito queixas para começar, processo em cinco passos, artigos, perguntas frequentes e localização; 16 páginas de tratamento e agendamento que monta a mensagem pronta no WhatsApp.",
      decisoes: [
        "Mármore com veios dourados gerado em WebGL no lugar de um vídeo, com botão de pausa e parado quando o sistema pede menos movimento.",
        "Creme e dourado, Fraunces nos títulos e Inter no texto.",
        "Registro profissional e responsável técnico no rodapé, e em cada tratamento o aviso de que a indicação e os resultados variam de pessoa para pessoa.",
        "O mapa só carrega depois de um clique (LGPD), e o agendamento só monta a mensagem para o WhatsApp.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "WebGL"],
      capturaNota: "versão pronta, ainda não publicada",
      capturas: {
        desktop: ["/media/sites/valter/desk-1.webp", "/media/sites/valter/desk-3.webp", "/media/sites/valter/desk-4.webp"],
        celular: ["/media/sites/valter/cel-1.webp", "/media/sites/valter/cel-2.webp"],
      },
      resultados: [],
      nota: "Site pronto e ainda não publicado: o domínio ainda não foi definido.",
    },
    {
      slug: "lucas-tosi", nome: "Dr. Lucas Tosi", peso: "compacto", interesse: "landing page",
      tipo: "Landing page 3D · livro de ginecologista",
      linha: "A landing do livro “A revolução da mulher 40+”, com o livro em 3D que acompanha a leitura e as duas lojas a um toque.",
      url: "https://wzsstudio.com.br/LUCASTOSI/", urlRotulo: "wzsstudio.com.br/LUCASTOSI",
      oQueE: "Página de venda do e-book “A revolução da mulher 40+”, do Dr. Lucas Tosi, ginecologista e obstetra que atende menopausa, reposição hormonal e emagrecimento no interior de São Paulo e em Alphaville.",
      paraQuem: "Mulheres a partir dos 40 anos que querem entender o que muda no corpo e chegar à próxima consulta com perguntas melhores.",
      desafio: "Mostrar um livro digital, que não tem objeto para fotografar, e levar à compra em duas lojas sem prometer resultado de tratamento.",
      feito: "Uma página única com o livro em 3D ao vivo: fechado na abertura, aberto nos sete pilares, folheando até o plano de 90 dias e em pé no fim. Dá para girar o livro e virar as páginas arrastando. Depois vêm o ponto de partida do livro, os capítulos, quem escreve (consultório, Instituto Tosi, MenoRun e o Instagram) e os botões das duas lojas.",
      decisoes: [
        "Preto, branco quente e o rosa da capa; Instrument Serif nos títulos e Inter no texto.",
        "O livro muda de pose pelo tempo, não pela rolagem: a página nunca fica presa esperando a animação.",
        "No celular o livro aberto ocupa a largura da tela e a rolagem vertical continua livre enquanto a página vira.",
        "Sem WebGL, com “reduzir movimento” ou em economia de dados, aparece a capa plana no lugar do 3D.",
        "CRM e RQE no rodapé, “Conteúdo informativo. Não substitui a consulta médica.” e nenhuma promessa de resultado (Resolução CFM nº 2.336/2023).",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Three.js", "Lenis"],
      capturas: {
        desktop: ["/media/sites/lucas-tosi/desk-1.webp", "/media/sites/lucas-tosi/desk-2.webp", "/media/sites/lucas-tosi/desk-3.webp", "/media/sites/lucas-tosi/desk-4.webp"],
        celular: ["/media/sites/lucas-tosi/cel-1.webp", "/media/sites/lucas-tosi/cel-2.webp", "/media/sites/lucas-tosi/cel-3.webp"],
      },
      resultados: [
        { valor: "0,8 s", rotulo: "até o título aparecer num celular em 3G, sem cache", fonte: "Teste de carga do projeto, celular emulado com processador 4× mais lento", data: "19/11/2026" },
        { valor: "3,7 s", rotulo: "até o livro 3D aparecer no 3G, contra 5,0 s da primeira versão", fonte: "Teste de carga do projeto", data: "19/11/2026" },
        { valor: "440 KB", rotulo: "baixados até o livro aparecer, contra 572 KB antes", fonte: "Teste de carga do projeto", data: "19/11/2026" },
      ],
      nota: "Fotos do palco: @oandrewillian (encontro do Clube VERO). A lombada, a contracapa e as páginas do livro em 3D são ilustrativas.",
    },
    {
      slug: "medgrind", publicar: false, nome: "MedGrind", peso: "destaque", interesse: "landing page",
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
      slug: "dolce", publicar: false, nome: "Dolce Migliavaca", peso: "compacto", interesse: "site do zero",
      tipo: "Site · confeitaria caseira",
      linha: "Um site de uma página com cheesecake em 3D para girar e encomenda pelo WhatsApp.",
      url: "https://dolce-migliavaca.pages.dev", urlRotulo: "dolce-migliavaca.pages.dev",
      oQueE: "Dolce Migliavaca faz tortas e docinhos caseiros, à mão e sob encomenda, com tele-entrega em Vila Flores, Veranópolis e Nova Prata.",
      paraQuem: "Quem quer encomendar uma torta ou docinhos para a mesa de casa, um aniversário ou um presente nessas três cidades.",
      feito: "Site de uma página com um cheesecake em 3D no topo para girar com o mouse ou o dedo, a história da casa, cardápio em carrossel com botão de encomenda em cada item, galeria de fotos, o passo a passo da encomenda e contato por WhatsApp e telefone.",
      decisoes: [
        "Turquesa com pinceladas, fundo creme estampado, bordas onduladas entre as seções e títulos manuscritos.",
        "Cada item do cardápio abre o WhatsApp com o nome do doce já escrito na mensagem.",
        "O 3D carrega só quando chega perto da tela e, sem WebGL, aparece uma foto no lugar.",
        "No celular o giro fica no gesto horizontal e a rolagem da página continua livre.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Three.js", "Cloudflare Pages"],
      capturas: {
        desktop: ["/media/sites/dolce/desk-1.webp", "/media/sites/dolce/desk-2.webp", "/media/sites/dolce/desk-3.webp"],
        celular: ["/media/sites/dolce/cel-1.webp", "/media/sites/dolce/cel-2.webp"],
      },
      resultados: [],
      nota: "Modelo 3D do cheesecake: “Cheese Cake”, de rebuilderai (Sketchfab), licença CC BY 4.0, com crédito no site.",
    },
    {
      slug: "1upmed", publicar: false, nome: "1UPmed", peso: "medio", interesse: "landing page",
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
      slug: "jr-miller", publicar: false, nome: "JR Miller", peso: "compacto", interesse: "site do zero",
      tipo: "Portfólio · criador de conteúdo",
      linha: "Um portfólio com busto 3D e métricas reais para um criador de conteúdo de Caxias do Sul apresentar o trabalho às marcas.",
      oQueE: "Junior Miller (@himiller9_) é criador de conteúdo de Caxias do Sul, RS: humor sobre casamento, futebol e dia a dia.",
      paraQuem: "Marcas e agências que procuram um criador para uma collab e querem ver alcance, repercussão e formatos antes de chamar.",
      desafio: "Transformar um vídeo que viralizou em argumento comercial: mostrar quem é o Junior e o tamanho do alcance de um jeito que uma marca entenda rápido.",
      feito: "Site de uma página com o busto 3D do Junior na abertura, painel de métricas com contadores e gráfico de 90 dias, a repercussão na imprensa, linha do tempo, formatos para marcas, perguntas frequentes e proposta de collab por formulário ou WhatsApp.",
      decisoes: [
        "Uma lente vermelha percorre o rosto em 3D e revela curvas de nível: é a assinatura visual do site.",
        "Preto e vermelho do começo ao fim, com títulos em contorno e o 7 do vídeo que viralizou como elemento gráfico.",
        "Cada número vem com a origem: insights do Instagram, com o período, e mídia kit.",
        "O formulário abre o e-mail com a proposta já escrita, e o WhatsApp fica logo ao lado.",
      ],
      stack: ["HTML", "CSS", "JavaScript", "Three.js", "Lenis"],
      capturas: {
        desktop: ["/media/sites/jr-miller/desk-1.webp", "/media/sites/jr-miller/desk-2.webp", "/media/sites/jr-miller/desk-3.webp"],
        celular: ["/media/sites/jr-miller/cel-1.webp", "/media/sites/jr-miller/cel-2.webp"],
      },
      resultados: [],
    },
    {
      slug: "crosshard", publicar: false, nome: "CrossHard", peso: "medio", interesse: "reformulação de site",
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
      slug: "hyperframe", publicar: false, nome: "Hyper Frame Studio", peso: "compacto", interesse: "site do zero",
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
      slug: "nicolao", publicar: false, nome: "Burgão do Nicolão", peso: "compacto", interesse: "site do zero",
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
    { nome: "JurisConta", publicar: false, desc: "Sistema web para escritórios de advocacia: intimações pela OAB, calculadoras e modelos de documento.", rotulo: "sistema" },
    { nome: "App de treino", publicar: false, desc: "Aplicativo instalável (PWA) com registro de cargas, evolução por exercício e ranking entre amigos.", rotulo: "PWA" },
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
    lead: "Escolha pelo momento do seu negócio. Se não souber qual faz sentido, conte pelo WhatsApp e nós indicamos.",
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
        comoComeca: "Você conta a oferta, o público e de onde vem o visitante (anúncio, Instagram, Google). Com isso enviamos um orçamento fechado.",
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
        comoComeca: "Você manda o link do site atual e conta o que incomoda. Respondemos com o que mudaríamos e um orçamento fechado.",
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
      { hash: "7c2e04b", titulo: "Design e código", texto: "Desenhamos as telas e escrevemos o site do zero. Você acompanha por um link de prévia e pede ajustes antes de publicar." },
      { hash: "e94b6d1", titulo: "No ar", texto: "Publicamos com o seu domínio, testamos no celular e no computador e deixamos tudo pronto para o Google encontrar." },
    ],
  },

  // Só depoimentos reais, com autorização para publicar. Vazio = seção escondida.
  // { texto, nome, cargo, projeto }
  depoimentos: [],

  faq: {
    titulo: "O que costumam perguntar.",
    itens: [
      { p: "Quanto custa um site?", r: "Depende do tamanho e das funções. Você conta o que precisa pelo WhatsApp e recebe um orçamento fechado, sem compromisso." },
      { p: "O site segue as regras de publicidade médica?", r: "Sim, o projeto já nasce com a Resolução CFM nº 2.336/2023 em vista: nome, CRM e RQE à vista, diretor técnico identificado quando é clínica, texto informativo e nenhuma promessa de resultado. Como a responsabilidade pela publicidade é do médico, você aprova cada página antes de publicar." },
      { p: "Qual a diferença entre landing page e site?", r: "A landing page tem um objetivo só, como um tratamento, um procedimento ou uma campanha, e leva o visitante a uma ação. O site apresenta o consultório ou a clínica inteira: equipe, especialidades, localização e agendamento. Se não souber qual escolher, me conte o objetivo e eu indico." },
      { p: "O agendamento pode ser pelo WhatsApp?", r: "Sim. O botão abre o WhatsApp do consultório com a mensagem já escrita, por exemplo com o tratamento que a pessoa estava lendo. Se você usa um sistema de agenda online, o botão pode levar para ele." },
      { p: "E a LGPD?", r: "O site não pede dado de saúde em formulário: o contato vai direto para o seu WhatsApp. Mapa e ferramentas de medição só carregam depois que o visitante aceita." },
      { p: "Quanto tempo leva para ficar pronto?", r: "Uma landing page sai mais rápido que um site de clínica com muitas páginas. O prazo vem junto com o orçamento, combinado antes de começar." },
      { p: "Você usa template?", r: "Não. Cada site é escrito do zero em HTML, CSS e JavaScript, com o visual e as funções que o seu consultório pede." },
      { p: "O site funciona bem no celular?", r: "Sim. Todo projeto começa pela tela do celular, porque é de lá que vem a maior parte das visitas." },
      { p: "Vou aparecer no Google?", r: "O site sai com títulos, descrições, velocidade, endereço e estrutura que o Google lê bem. Ninguém pode garantir a primeira posição, mas a base fica certa." },
      { p: "Preciso ter domínio e hospedagem?", r: "Não precisa chegar com nada. Ajudamos a registrar o domínio e publicamos o site. A hospedagem é paga à parte, e a WZS tem parceria com a MasterSite." },
      { p: "Consigo mudar textos e fotos depois?", r: "Sim. Combinamos no orçamento se nós fazemos as atualizações ou se o site ganha um jeito simples de você mesmo editar." },
      { p: "Vocês atendem a minha cidade?", r: "Sim. Atendemos médicos e clínicas de qualquer lugar do Brasil: a conversa acontece pelo WhatsApp e pelo e-mail, então a distância não muda nada." },
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
//  CRIATIVOS E CONTEÚDO MÉDICO
// ============================================================================
export const criativos = {
  seo: {
    titulo: "Criativos para médicos e clínicas · Conteúdo médico em vídeo · WZS Studio",
    descricao: "Vídeos curtos de conteúdo médico para Reels, TikTok e anúncios: roteiro com fonte, animação e edição, seguindo as regras de publicidade do CFM. Veja trabalhos reais com números públicos.",
    og: "/media/og/og-criativos.jpg",
  },
  hero: {
    rotulo: "Criativos para médicos e clínicas",
    titulo: "Conteúdo médico com *gancho, ritmo e rigor.*",
    texto: "Criamos vídeos curtos para o perfil do seu consultório e criativos para as suas campanhas. O roteiro nasce de uma fonte clínica, a animação faz a pessoa ficar até o fim e nada promete resultado.",
    cta: "Conversar sobre criativos",
    linha: "Roteiro com fonte, animação e edição para Reels, TikTok e anúncios, do gancho à chamada final, seguindo as regras de publicidade do CFM.",
    ctaSecundario: "Ver trabalhos",
    prova: [
      { valor: "759 mil", rotulo: "visualizações em um reel do @felipen.med" },
      { valor: "2,1 mi", rotulo: "visualizações em 13 reels publicados em uma semana" },
      { valor: "10,7 mil", rotulo: "seguidores no perfil: eram 4.578 em 03/11" },
    ],
    fonteProva: "Contadores públicos do Instagram do @felipen.med em 19/11/2026: 13 reels publicados de 12 a 18/11/2026 somam 2,16 milhões de visualizações; o perfil tinha 4.578 seguidores em 03/11/2026. Visualização mede alcance: não é consulta marcada nem venda.",
  },

  historia: {
    abertura: "Seu paciente rola o feed todo dia. Quantos vídeos de saúde ele pulou hoje?",
    problema: {
      rotulo: "O problema",
      passos: [
        { titulo: "O feed não espera.", texto: "A pessoa decide em segundos se fica ou passa para o próximo vídeo." },
        { titulo: "Sem gancho, ela rola." },
        { titulo: "Com termo técnico demais, sai no meio." },
        { titulo: "Sem roteiro, assiste e não lembra de quem era." },
      ],
    },
    explode: { titulo: "É aqui que nós entramos.", texto: "Montamos o vídeo inteiro: a ideia, o roteiro conferido na fonte, a animação e a edição.", poster: "/media/criativos/lucas-canetas.jpg" },
    // clonagem de voz (texto do Felipe, 20/11/2026)
    voz: {
      rotulo: "Com a sua voz",
      passos: [
        { titulo: "Imagine não ter que passar horas narrando." },
        { titulo: "E o conteúdo ser produzido com a sua voz, de forma *profissional.*", texto: "Com uma gravação curta, criamos uma versão digital da sua voz. Você ouve e aprova cada narração antes de publicar." },
      ],
    },
    montagem: {
      rotulo: "Como montamos",
      titulo: "Um reel de medicina, camada por camada.",
      arquivo: "reel_fa_x_fv.mp4",
      camadas: [
        { nome: "Corte", trilha: "V1", texto: "Escolhemos os melhores trechos e cortamos no ritmo." },
        { nome: "Gancho", trilha: "T1", texto: "Uma frase forte nos primeiros segundos." },
        { nome: "Legenda", trilha: "TXT", texto: "Palavra por palavra, para quem assiste sem som." },
        { nome: "Som", trilha: "A1", texto: "Trilha e efeitos no tempo dos cortes." },
        { nome: "Chamada", trilha: "FX", texto: "Um pedido claro no final: comentar, salvar ou mandar para um colega." },
      ],
      quadros: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `/media/criativos/quadros/fa-${i}.jpg`),
      video: "/media/criativos/fa-x-fv.mp4", poster: "/media/criativos/fa-x-fv.jpg",
    },
    sucesso: {
      titulo: "Publicado. Agora ele roda sozinho.",
      meio: "Curtidas, comentários e seguidores chegando.",
      contador: 759000, numero: "759 mil", rotuloNumero: "visualizações",
      legenda: "@felipen.med · “Eu quero antibiótico!” · 50 mil curtidas",
      fonte: "Contador público do Instagram em 19/11/2026. Publicado em 15/11/2026.",
      video: "/media/criativos/pov-antibiotico.mp4", poster: "/media/criativos/pov-antibiotico.jpg",
    },
    dinheiro: {
      rotulo: "Para anunciar",
      passos: [
        { titulo: "No anúncio, cada clique custa dinheiro." },
        { titulo: "Um criativo que prende a atenção paga menos por visita." },
        { titulo: "Um vídeo, várias aberturas.", texto: "Testo ganchos diferentes para o mesmo vídeo e fico com o que segura o seu público por menos." },
      ],
      video: "/media/criativos/lucas-mioma.mp4", poster: "/media/criativos/lucas-mioma.jpg",
    },
    oportunidade: {
      rotulo: "A oportunidade",
      passos: [
        { titulo: "O algoritmo entrega o seu vídeo para quem ainda não te segue." },
        { numero: "70×", texto: "o tamanho do perfil: 759 mil visualizações num reel do @felipen.med, que tem 10,7 mil seguidores.", fonte: "Instagram, 19/11/2026." },
        { numero: "6 reels", texto: "do @felipen.med passaram de 100 mil visualizações, num perfil de 10,7 mil seguidores.", fonte: "Contadores públicos do Instagram em 19/11/2026." },
      ],
    },
    convite: "Vamos montar o seu?",
  },

  // números de cada fonte (cartões grandes)
  fontes: [
    { conta: "@felipen.med", foto: "/media/clientes/felipen-med.jpg", url: "https://www.instagram.com/felipen.med/reels/", tema: "Medicina em 3D e pixel art", numero: "759 mil", rotulo: "visualizações no reel mais visto", extras: ["6 reels acima de 100 mil", "10,7 mil seguidores"] },
  ],
  fontesNota: "Números públicos do Instagram do @felipen.med em 19/11/2026. Visualização mede alcance: não é consulta marcada nem venda.",
  // reels de destaque, com link para conferir o contador no Instagram
  noInstagram: [
    { conta: "@felipen.med", titulo: "“Eu quero antibiótico!”", numero: "759 mil", url: "https://www.instagram.com/felipen.med/reel/DfxltmipNaq/" },
    { conta: "@felipen.med", titulo: "“Eu sou da área da saúde, tá?”", numero: "393 mil", url: "https://www.instagram.com/felipen.med/reel/Df5UICQp9jP/" },
    { conta: "@felipen.med", titulo: "“Doutor, é só um atestado!”", numero: "362 mil", url: "https://www.instagram.com/felipen.med/reel/Df2vWmZphMr/" },
    { conta: "@felipen.med", titulo: "POV: o colega superinteligente", numero: "144 mil", url: "https://www.instagram.com/felipen.med/reel/DfuJ_9vJ0im/" },
  ],

  planos: {
    titulo: "Escolha o objetivo.",
    itens: [
      { slug: "viralizar", nome: "Para o perfil", rotulo: "Orgânico", interesse: "o perfil do consultório", cta: "Quero conteúdo para o perfil",
        resumo: "Vídeos para o seu perfil crescer: alcance, salvamentos e seguidores da sua área.",
        inclui: ["Ideia e roteiro com fonte, em série", "Narração com a sua voz, sem gravar cada vídeo", "Animação e edição com legenda e som", "Sua revisão clínica antes de publicar"],
        metrica: { rotulo: "Medido por", itens: ["Visualizações", "Envios e salvamentos", "Seguidores"] },
        // celular atrás da caixa: o reel “Eu quero antibiótico!” do @felipen.med (contador público do Instagram, 19/11/2026)
        vitrine: { video: "/media/tex/sucesso-leve.mp4", poster: "/media/tex/sucesso.jpg", conta: "felipen.med", cor: "#b8923a",
          legenda: "Você prescreveria para ele?", curtidas: "50 mil", comentarios: "425", envios: "26,3 mil", selo: { rotulo: "Visualizações", valor: "759 mil", nota: "em um único reel" } } },
      { slug: "anunciar", nome: "Para anunciar", rotulo: "Tráfego pago", interesse: "anúncios", cta: "Quero criativos para anúncios",
        resumo: "Criativos para campanhas: apresentar a clínica, um serviço, um livro ou um evento e testar ganchos.",
        inclui: ["Roteiro com variações de gancho", "Edição em 9:16, 4:5 e 1:1", "Texto revisado pelas regras do CFM"],
        metrica: { rotulo: "Medido por", itens: ["CTR", "Custo por resultado", "Conversão"] },
        // celular atrás da caixa: um vídeo do Dr. Lucas Tosi (sem número de anúncio: o selo fica de fora)
        vitrine: { video: "/media/tex/cliente-leve.mp4", poster: "/media/tex/cliente.jpg", conta: "dr.lucastosi", cor: "#b8923a",
          legenda: "Mioma: vira câncer?" } },
    ],
    nota: "Ninguém controla o algoritmo: não existe garantia de alcance nem de pacientes novos. E nenhum vídeo promete resultado de tratamento.",
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
    lead: "Selecionamos os vídeos pelo desempenho e pela qualidade criativa. Os números são os que aparecem publicamente em cada perfil, com a data da consulta.",
  },

  // séries de vídeos. Cada vídeo: { id, titulo, arquivo, poster, duracao, data, objetivo, publico,
  // gancho, edicao, metricas: [{ tipo: "visualizações" | "curtidas" | ..., valor }], fonte, selo, grande }
  // publicar: false = a série fica pronta aqui, mas não aparece no site (use enquanto falta confirmar algo)
  series: [
    {
      slug: "dr-lucastosi", conta: "@dr.lucastosi", contaUrl: "https://www.instagram.com/dr.lucastosi/", foto: "/media/clientes/dr-lucastosi.jpg", verificado: true,
      tema: "Ginecologia e menopausa", nome: "O médico explica, a animação mostra.",
      descricao: [
        "Vídeos para o perfil de um ginecologista com 130 mil seguidores: a fala dele no consultório ou no palco, intercalada com animação 3D do que acontece dentro do corpo.",
        "Cada vídeo responde a uma dúvida que aparece na consulta, com legenda palavra por palavra e, quando há números, a referência na tela.",
      ],
      participacao: "animação 3D, legendas e edição sobre as gravações do Dr. Lucas.",
      videos: [
        { id: "lucas-mioma", grande: true, titulo: "Mioma: vira câncer?",
          arquivo: "/media/criativos/lucas-mioma.mp4", poster: "/media/criativos/lucas-mioma.jpg",
          objetivo: "Responder sem alarme a dúvida de quem acabou de receber o diagnóstico.", publico: "Mulheres com mioma e quem acompanha o tema.",
          gancho: "“Mioma: vira câncer? Se você tem medo dele virar câncer, esse vídeo é pra você.”",
          edicao: "O útero em 3D, o mioma e o sarcoma lado a lado, as imagens parecidas no ultrassom e um gráfico de casos por idade, com o Dr. Lucas explicando no consultório." },
        { id: "lucas-canetas", titulo: "Canetas: como agem no seu corpo",
          arquivo: "/media/criativos/lucas-canetas.mp4", poster: "/media/criativos/lucas-canetas.jpg",
          objetivo: "Explicar o mecanismo antes da conversa sobre tratamento.", publico: "Quem pesquisa canetas emagrecedoras.",
          gancho: "“Você sabe como as canetas emagrecedoras realmente agem no seu corpo?”",
          edicao: "O sinal do GLP-1 do intestino ao cérebro em 3D, gráficos de glicose e de esvaziamento do estômago e a referência de cada trecho na tela (Drucker, Holst, Wilding e outros)." },
        { id: "lucas-estrogenio", titulo: "Estrogênio: não é só o número",
          arquivo: "/media/criativos/lucas-estrogenio.mp4", poster: "/media/criativos/lucas-estrogenio.jpg",
          objetivo: "Levar a conversa do exame para o que o hormônio faz em cada tecido.", publico: "Mulheres na transição da menopausa.",
          gancho: "“Estrogênio: não é só o número.”",
          edicao: "A molécula, o corpo e as células em 3D, intercalados com o Dr. Lucas no palco de um evento sobre terapias hormonais." },
      ],
    },
    {
      slug: "felipen-med", conta: "@felipen.med", contaUrl: "https://www.instagram.com/felipen.med/", foto: "/media/clientes/felipen-med.jpg",
      tema: "Medicina em vídeos curtos", nome: "Medicina que dá vontade de assistir até o fim.",
      descricao: [
        "Perfil próprio de conteúdo médico, com dois formatos que se completam: o *POV de plantão*, em 3D e primeira pessoa, traz alcance; o *caso clínico interativo* ensina uma conduta e traz seguidores da área.",
        "Também há comparações em pixel art e animações explicativas. Toda afirmação clínica tem a fonte anotada no roteiro.",
      ],
      participacao: "ideia, roteiro, produção visual e edição (perfil próprio).",
      numeros: [
        { valor: "759 mil", rotulo: "visualizações no reel mais visto" },
        { valor: "6 reels", rotulo: "acima de 100 mil visualizações" },
        { valor: "10,7 mil", rotulo: "seguidores" },
      ],
      fonte: "Contadores públicos do perfil no Instagram, consultados em 19/11/2026.",
      // oculto: true = o vídeo fica guardado aqui, mas não entra no carrossel
      videos: [
        { id: "pov-antibiotico", grande: true, selo: "759 mil", titulo: "“Eu quero antibiótico!”",
          arquivo: "/media/criativos/pov-antibiotico.mp4", poster: "/media/criativos/pov-antibiotico.jpg", data: "2026-11-15",
          metricas: [{ tipo: "visualizações", valor: "759 mil" }],
          objetivo: "Alcance fora da bolha, com uma lição clínica que dá vontade de mandar para um colega.", publico: "Médicos, estudantes e quem já passou por um pronto-socorro.",
          gancho: "O paciente abre a porta gritando: “Eu quero antibiótico!”",
          edicao: "Cena 3D em primeira pessoa, com visual de videogame dos anos 90: 61 palavras em 42 s, loop perfeito e a fonte de cada afirmação clínica anotada no roteiro.",
          fonte: "Contador público do Instagram em 19/11/2026. Publicado em 15/11/2026." },
        { id: "pov-area-da-saude", selo: "393 mil", titulo: "“Eu sou da área da saúde, tá?”",
          arquivo: "/media/criativos/pov-area-da-saude.mp4", poster: "/media/criativos/pov-area-da-saude.jpg",
          metricas: [{ tipo: "visualizações", valor: "393 mil" }],
          objetivo: "Alcance e envios entre colegas.", publico: "Médicos, estudantes e profissionais de saúde.",
          gancho: "Ela entra apontando o crachá: “Eu sou da área da saúde, tá?”",
          edicao: "Mesmo consultório, mesma câmera, personagem nova: a série reaproveita o cenário e muda só a situação. A piada é a segurança de quem fez um curso de 40 horas, nunca uma categoria profissional.",
          fonte: "Contador público do Instagram em 19/11/2026." },
        { id: "pov-atestado", selo: "362 mil", titulo: "“Doutor, é só um atestado!”",
          arquivo: "/media/criativos/pov-atestado.mp4", poster: "/media/criativos/pov-atestado.jpg",
          metricas: [{ tipo: "visualizações", valor: "362 mil" }],
          objetivo: "Alcance e envios entre colegas.", publico: "Médicos, estudantes e profissionais de saúde.",
          gancho: "Ele entra de boia de pato na cintura, puxando a mala: “Doutor, é só um atestado!”",
          edicao: "25 s, nove falas e uma virada: a declaração de comparecimento de sete minutos. A regra por trás da piada (atestado sai do que o médico examina) vem do Código de Ética Médica.",
          fonte: "Contador público do Instagram em 19/11/2026." },
        { id: "pov-briga-no-ps", selo: "190 mil", titulo: "POV: seis horas de espera no PS",
          arquivo: "/media/criativos/pov-briga-no-ps.mp4", poster: "/media/criativos/pov-briga-no-ps.jpg", data: "2026-11-12",
          metricas: [{ tipo: "visualizações", valor: "190 mil" }],
          objetivo: "Identificação: a cena que todo plantonista já viveu.", publico: "Médicos, estudantes e equipes de pronto-socorro.",
          gancho: "A porta bate na parede: “Seis horas! Seis horas esperando!”",
          edicao: "Primeira pessoa do começo ao fim: as mãos no teclado, a ficha no monitor e a voz interna do médico. Termina onde começa, para o vídeo rodar em loop.",
          fonte: "Contador público do Instagram em 19/11/2026. Publicado em 12/11/2026." },
        { id: "pov-google", selo: "131 mil", titulo: "“O ChatGPT disse que é tumor.”",
          arquivo: "/media/criativos/pov-google.mp4", poster: "/media/criativos/pov-google.jpg", data: "2026-11-13",
          metricas: [{ tipo: "visualizações", valor: "131 mil" }],
          objetivo: "Alcance com um tema que médico e paciente reconhecem.", publico: "Médicos, estudantes e quem pesquisa sintoma de madrugada.",
          gancho: "O paciente enfia o celular na câmera: “Doutor, eu já sei o que eu tenho.”",
          edicao: "Sem música: o humor fica no tempo das falas. A receita do final (“dormir oito horas, largar o celular”) fecha a piada.",
          fonte: "Contador público do Instagram em 19/11/2026. Publicado em 13/11/2026." },
        { id: "caso-anafilaxia", selo: "47,4 mil", titulo: "Caso clínico: falta de ar depois do camarão",
          arquivo: "/media/criativos/caso-anafilaxia.mp4", poster: "/media/criativos/caso-anafilaxia.jpg", data: "2026-11-14",
          metricas: [{ tipo: "visualizações", valor: "47,4 mil" }],
          objetivo: "Ensinar uma conduta e trazer seguidores da área.", publico: "Estudantes de medicina e médicos.",
          gancho: "“Paciente com falta de ar. Três decisões. Você é o médico.”",
          edicao: "Caso em 3D com sinais vitais na tela e três perguntas de A ou B. Uma ideia só por vídeo: na anafilaxia, a adrenalina no músculo vem primeiro. Fonte no primeiro comentário (World Allergy Organization, 2020).",
          fonte: "Contador público do Instagram em 19/11/2026. Publicado em 14/11/2026." },
        { id: "caso-queimadura", selo: "36,4 mil", titulo: "Caso clínico: queimou o corpo. Quanto por cento?",
          arquivo: "/media/criativos/caso-queimadura.mp4", poster: "/media/criativos/caso-queimadura.jpg", data: "2026-11-17",
          metricas: [{ tipo: "visualizações", valor: "36,4 mil" }],
          objetivo: "Ensinar uma regra que se usa na prática.", publico: "Estudantes de medicina e médicos.",
          gancho: "“Queimou o corpo. Quanto por cento?”",
          edicao: "A regra dos nove desenhada sobre o corpo do paciente, a conta do soro na tela e uma pergunta para os comentários. Fontes no primeiro comentário (SBQ, Ministério da Saúde e ATLS).",
          fonte: "Contador público do Instagram em 19/11/2026. Publicado em 17/11/2026." },
        { id: "caso-parada", selo: "31,6 mil", titulo: "Caso clínico: parou. Choca ou não choca?",
          arquivo: "/media/criativos/caso-parada.mp4", poster: "/media/criativos/caso-parada.jpg",
          metricas: [{ tipo: "visualizações", valor: "31,6 mil" }],
          objetivo: "Ensinar uma decisão de segundos.", publico: "Estudantes de medicina e médicos.",
          gancho: "“Parou. Choca ou não choca?”",
          edicao: "O monitor decide: cada ritmo aparece na tela e quem assiste responde antes da resposta. Segue o algoritmo de parada da AHA 2025, citado no primeiro comentário.",
          fonte: "Contador público do Instagram em 19/11/2026." },
        { id: "estenose-insuficiencia", selo: "75,9 mil", titulo: "Estenose × insuficiência aórtica",
          arquivo: "/media/criativos/estenose-insuficiencia.mp4", poster: "/media/criativos/estenose-insuficiencia.jpg",
          metricas: [{ tipo: "visualizações", valor: "75,9 mil" }],
          objetivo: "Alcance orgânico e salvamentos.", publico: "Estudantes de medicina.",
          gancho: "“Esse sangue não foi desenhado, foi calculado.”",
          edicao: "Pixel art com simulação de fluido dentro da própria anatomia: o jato e o refluxo saem da física. Loop de 40 s com trilha sincronizada.",
          fonte: "Contador público do Instagram em 03/11/2026; o número atual pode ser maior." },
        { id: "soro-tce", titulo: "Soro no traumatismo craniano",
          arquivo: "/media/criativos/soro-tce.mp4", poster: "/media/criativos/soro-tce.jpg",
          objetivo: "Explicar uma conduta e mostrar domínio do tema.", publico: "Estudantes de medicina.",
          gancho: "Abre direto no caso: “Traumatismo craniano grave…”",
          edicao: "Animação explicativa em estilo flat, com narração e efeitos sonoros sincronizados a cada cena." },
        { id: "fa-x-fv", oculto: true, titulo: "FA × FV: só um ainda bombeia sangue",
          arquivo: "/media/criativos/fa-x-fv.mp4", poster: "/media/criativos/fa-x-fv.jpg",
          metricas: [{ tipo: "visualizações", valor: "31,2 mil" }],
          objetivo: "Alcance orgânico e comentários.", publico: "Estudantes de medicina.",
          gancho: "“FA: dá pra viver anos com ela. FV: você tem minutos.”",
          edicao: "Pixel art em 60 fps com os dois corações lado a lado, loop perfeito de 40 s e pergunta A ou B na legenda.",
          fonte: "Print do perfil em 16/10/2026; o número atual pode ser maior." },
        { id: "dpp-x-placenta-previa", oculto: true, titulo: "DPP × placenta prévia",
          arquivo: "/media/criativos/dpp-x-placenta-previa.mp4", poster: "/media/criativos/dpp-x-placenta-previa.jpg", data: "2026-11-03",
          metricas: [{ tipo: "visualizações", valor: "12,1 mil" }],
          objetivo: "Alcance orgânico e salvamentos.", publico: "Estudantes de medicina.",
          gancho: "“As duas sangram, uma dói e a outra não.”",
          edicao: "Comparação em pixel art com zoom nos detalhes que diferenciam os dois quadros.",
          fonte: "Contador público em 03/11/2026, cerca de 11 horas depois da publicação." },
        { id: "ultimo-plantao", oculto: true, titulo: "O último plantão",
          arquivo: "/media/criativos/ultimo-plantao.mp4", poster: "/media/criativos/ultimo-plantao.jpg",
          objetivo: "Identificação e compartilhamento.", publico: "Estudantes e profissionais de saúde.",
          gancho: "“O último plantão: seis anos num hospital, num corredor só.”",
          edicao: "Voxel 3D narrado, cena a cena pelos setores do hospital; termina com uma pergunta para os comentários." },
      ],
    },
    {
      slug: "wzs-studio", publicar: false, conta: "@wzs_studio", contaUrl: "https://www.instagram.com/wzs_studio/",
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
      slug: "marcas-proprias", publicar: false, conta: "@medgrind_oficial e @1upmed_", contaUrl: "https://www.instagram.com/medgrind_oficial/",
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
      slug: "nilo", publicar: false, conta: "@niloeoinfinito", contaUrl: "https://www.instagram.com/niloeoinfinito/reels/",
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

  // Anúncios e criativos de conversão: a seção só aparece quando houver vídeos aqui sem oculto: true.
  // Desde 20/11/2026 só os de clínicas fictícias aparecem: os dois da Compasso e, desde 21/11/2026, o da Clínica Mapa
  // (MedGrind, @wzs_studio e as peças de outros ramos estão ocultos). Com três peças de duas marcas, o título
  // "Uma oferta, dois públicos." deixou de valer e virou "Feitos para agendar.".
  anuncios: {
    titulo: "Feitos para agendar.",
    lead: "Anúncios de 30 s que terminam no agendamento pelo WhatsApp. Peças de demonstração para clínicas fictícias.",
    conta: "Compasso · demonstração", tema: "Criativos de conversão", slug: "anuncios", nomeSerie: "Feitos para agendar.",
    descricao: [
      "Dois anúncios de 30 s para a mesma oferta: um check-up cardiológico em uma manhã. Um fala com quem confia em dados; o outro, com a mulher que cuida de todo mundo e esquece de si. A Compasso é uma marca fictícia, criada para demonstrar o formato. O site da marca, que continua estes anúncios, está em Sites.",
      "Um anúncio de 31 s para o mapeamento de pintas de uma clínica de dermatologia, a Clínica Mapa, também fictícia: o teste ABCDE na tela e a foto que compara a pinta de um ano para o outro.",
    ],
    numeros: [],
    fonte: "",
    // Compasso: marca, equipe e contatos fictícios (peças de demonstração enviadas pelo Felipe em 20/11/2026)
    videos: [
      { id: "compasso-precisao", conta: "Compasso · demonstração", grande: true, titulo: "Seu coração, com precisão.",
        arquivo: "/media/criativos/compasso-precisao.mp4", poster: "/media/criativos/compasso-precisao.jpg",
        objetivo: "Levar quem nunca fez um check-up cardiológico ao agendamento pelo WhatsApp.", publico: "Adultos a partir dos 40 anos.",
        gancho: "“Seu coração bate cerca de 100.000 vezes por dia.”",
        edicao: "Coração 3D em raio X, interface de exame e as cinco etapas do check-up marcadas na tela; termina na chamada para o WhatsApp. Marca, equipe e contatos fictícios." },
      { id: "compasso-cuidado", conta: "Compasso · demonstração", titulo: "Quem cuida de todo mundo também merece cuidado.",
        arquivo: "/media/criativos/compasso-cuidado.mp4", poster: "/media/criativos/compasso-cuidado.jpg",
        objetivo: "A mesma oferta contada para outro público, pela emoção.", publico: "Mulheres a partir dos 40 anos.",
        gancho: "A lista do dia: a vacina do filho, o remédio da mãe, o exame do marido… e o seu coração?",
        edicao: "Luz quente, serifa e a lista que vai sendo marcada; o dado da Sociedade Brasileira de Cardiologia na tela e a chamada no fim. Marca, equipe e contatos fictícios." },
      // Clínica Mapa: dermatologia fictícia (reel de demonstração enviado pelo Felipe em 21/11/2026; o próprio vídeo traz telefone, CRM e RQE de exemplo)
      { id: "mapa-pintas", conta: "Clínica Mapa · demonstração", titulo: "Você nunca viu as suas costas.",
        arquivo: "/media/criativos/mapa-pintas.mp4", poster: "/media/criativos/mapa-pintas.jpg",
        objetivo: "Levar quem não vê as próprias costas ao mapeamento de pintas, agendado pelo WhatsApp.",
        gancho: "“Você nunca viu as suas costas.”",
        edicao: "Pele em close, a pinta que cresce e o teste ABCDE marcado letra por letra (a regra da Sociedade Brasileira de Dermatologia, citada na tela); depois a dermatoscopia digital, o mapa do corpo que compara a foto de um ano atrás com a de hoje e a chamada para o WhatsApp. Marca, equipe e contatos fictícios." },
      { id: "ad05v-plantao", oculto: true, grande: true, selo: "CTR 4,56%", titulo: "Plantão: “Paciente na sala 1. A conduta é sua.”",
        arquivo: "/media/criativos/ad05v-plantao.mp4", poster: "/media/criativos/ad05v-plantao.jpg",
        metricas: [{ tipo: "CTR", valor: "4,56%" }, { tipo: "por visita", valor: "R$ 0,15" }],
        objetivo: "Levar estudantes à página e à assinatura.", gancho: "“Paciente na sala 1.” → “A conduta é sua.”",
        edicao: "Imagens reais do Modo Plantonista com HUD animado, 15 s, em 9:16, 4:5 e 1:1.",
        fonte: "Meta Ads, 08 a 20/10/2026, medido na primeira versão deste vídeo; só o cartão final mudou." },
      { id: "wzs-fantasma", oculto: true, conta: "@wzs_studio", selo: "36,6 mil", titulo: "Seu site é um fantasma?",
        arquivo: "/media/criativos/wzs-fantasma.mp4", poster: "/media/criativos/wzs-fantasma.jpg", data: "2026-10-31",
        metricas: [{ tipo: "visualizações", valor: "36,6 mil" }],
        objetivo: "Atrair donos de negócio para o serviço de sites.", publico: "Donos de negócio local.",
        gancho: "“Seu site é um fantasma?”",
        edicao: "Cena 3D em low poly com o teste no Google e a solução passo a passo.",
        fonte: "Contador público do Instagram em 04/11/2026." },
      { id: "medgrind-meta-15s", oculto: true, titulo: "“4 horas estudando… e o seu progresso?”",
        arquivo: "/media/criativos/medgrind-meta-15s.mp4", poster: "/media/criativos/medgrind-meta-15s.jpg",
        objetivo: "Anúncio de 15 s para o MedGrind.", gancho: "Um cronômetro rodando: “4 horas estudando.”",
        edicao: "Motion graphics em HUD, tipografia cinética e trilha na batida." },
      { id: "wzs-link-vazio", oculto: true, conta: "@wzs_studio", selo: "32 mil", titulo: "Seu link chega vazio no WhatsApp?",
        arquivo: "/media/criativos/wzs-link-vazio.mp4", poster: "/media/criativos/wzs-link-vazio.jpg", data: "2026-10-29",
        metricas: [{ tipo: "visualizações", valor: "32 mil" }],
        objetivo: "Atrair donos de negócio para o serviço de sites.", publico: "Donos de negócio local.",
        gancho: "“Seu link chega assim?”",
        edicao: "Cena 3D em low poly que mostra o problema na conversa e a correção de três linhas no código.",
        fonte: "Contador público do Instagram em 04/11/2026." },
      { id: "medgrind-showreel", oculto: true, titulo: "Showreel de lançamento do MedGrind",
        arquivo: "/media/criativos/medgrind-showreel.mp4", poster: "/media/criativos/medgrind-showreel.jpg",
        objetivo: "Apresentar o produto em 16 s.", gancho: "“Você estuda horas. Nada evolui.”",
        edicao: "Interface real do jogo com cursor demonstrando cada recurso, cortes na trilha." },
      { id: "wzs-advogado", oculto: true, conta: "@wzs_studio", selo: "4,4 mil", titulo: "Seu escritório existe. O cliente não te viu.",
        arquivo: "/media/criativos/wzs-advogado.mp4", poster: "/media/criativos/wzs-advogado.jpg", data: "2026-10-18",
        metricas: [{ tipo: "visualizações", valor: "4,4 mil" }],
        objetivo: "Falar com um nicho: escritórios de advocacia sem site.", publico: "Advogados.",
        gancho: "“Advogado perto de mim.”",
        edicao: "Animação 3D com um advogado que virou fantasma até aparecer no Google.",
        fonte: "Contador público do Instagram em 04/11/2026." },
      { id: "motion-feito-em-codigo", oculto: true, titulo: "“Feito em código.”",
        arquivo: "/media/criativos/motion-feito-em-codigo.mp4", poster: "/media/criativos/motion-feito-em-codigo.jpg",
        objetivo: "Peça de demonstração do estilo de motion.", gancho: "“Feito em código.”",
        edicao: "Molas, curvas de movimento e quatro formatos, tudo gerado em código e sincronizado com a música." },
      { id: "exemplo-fluxo", oculto: true, titulo: "“Você ainda faz tudo à mão?”",
        arquivo: "/media/criativos/exemplo-fluxo.mp4", poster: "/media/criativos/exemplo-fluxo.jpg",
        objetivo: "Exemplo de anúncio para um app de automação (marca de demonstração).", gancho: "“Você ainda faz tudo à mão?”",
        edicao: "Motion graphics de 15 s com formas, tipografia e cortes no compasso." },
      { id: "ad08-hipocrates", oculto: true, titulo: "“Contratei o Hipócrates.”",
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
      { p: "O conteúdo segue as regras do CFM?", r: "Sim, é o ponto de partida. Os roteiros seguem a Resolução CFM nº 2.336/2023: caráter educativo, sem promessa de resultado e sem sensacionalismo, com a sua identificação profissional (nome, CRM e, se houver especialidade, RQE). Como a responsabilidade pela publicidade é do médico, nada vai ao ar sem a sua aprovação." },
      { p: "Quem escreve o roteiro entende de medicina?", r: "Sim. Todo roteiro é escrito com a fonte de cada afirmação anotada (diretriz, artigo ou protocolo), e você revisa antes de publicar. A palavra final sobre o conteúdo clínico é sempre sua." },
      { p: "Vocês narram com a minha voz?", r: "Sim. Com uma gravação curta, criamos uma versão digital da sua voz e narramos os roteiros com ela, sem você precisar gravar cada vídeo. Só fazemos com a sua autorização por escrito, a voz é usada apenas nos seus conteúdos e você ouve e aprova cada narração antes de publicar." },
      { p: "Preciso aparecer no vídeo?", r: "Não. Dá para ter conteúdo só com animação e narração, como no @felipen.med. Se você quiser aparecer, a sua gravação ganha animação 3D do que acontece no corpo, como nos vídeos do Dr. Lucas Tosi." },
      { p: "Você garante que o vídeo vai viralizar?", r: "Não. Ninguém controla o algoritmo. O trabalho é aumentar as chances: entender o público, escolher o ângulo, testar ganchos e editar com ritmo. Os números desta página são resultados reais, com fonte e data, não uma promessa." },
      { p: "Muitas visualizações significam mais pacientes?", r: "Não necessariamente. Visualização mostra alcance. Consulta marcada depende do público certo, da especialidade, da região e do caminho até o agendamento. Por isso cada vídeo começa com um objetivo e uma métrica." },
      { p: "Qual a diferença entre criativo para anúncio e conteúdo orgânico?", r: "O criativo para anúncio é mostrado para um público escolhido na campanha e é medido por cliques, custo e conversões. O conteúdo orgânico depende do algoritmo e é medido por visualizações, envios, salvamentos e seguidores." },
      { p: "Quanto custa?", r: "Depende do objetivo, do formato e da quantidade de vídeos. Você conta o que precisa pelo WhatsApp e recebe um orçamento sem compromisso." },
      { p: "O que eu preciso enviar para começar?", r: "A sua especialidade, o público que você quer alcançar e os temas que mais aparecem no consultório. Se já tiver identidade visual, fotos ou gravações, elas ajudam." },
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
