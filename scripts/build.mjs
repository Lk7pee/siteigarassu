// Gera HTML estático completo. Não é necessário executar para usar ou hospedar o site.
import { writeFileSync, mkdirSync } from 'node:fs';
const name = 'Serventia Registral de Igarassu';
const email = 'serventiaregistraldeigarassu@gmail.com';
const gmailCompose = (subject = '', body = '') =>
  `https://mail.google.com/mail/?${new URLSearchParams({ view: 'cm', fs: '1', to: email, su: subject, body })}`.replaceAll(
    '&',
    '&amp;',
  );
const official = 'Ana Clarinda de Souza Ribeiro Ferraz';
const dpo = 'Geovanna Conceição Soares da Silva';
const paths = {
  home: 'index.html',
  institutional: 'institucional.html',
  services: 'servicos.html',
  ri: 'registro-imoveis.html',
  rtd: 'titulos-documentos.html',
  rcpj: 'pessoas-juridicas.html',
  reurb: 'reurb.html',
  contact: 'contato.html',
  privacy: 'politica-privacidade.html',
};
const labels = {
  home: 'Início',
  institutional: 'Institucional',
  services: 'Serviços',
  ri: 'Registro de Imóveis',
  rtd: 'Títulos e Documentos',
  rcpj: 'Pessoas Jurídicas',
  reurb: 'REURB',
  contact: 'Contato',
  privacy: 'Política de Privacidade',
};
const svg = {
  home: '<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-8h6v8"/>',
  doc: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  people:
    '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  phone: '<path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3c-1 6-5 5-10 2S1 9 3 5Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
};
const icon = (type) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${svg[type] || svg.doc}</svg>`;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const link = (key, text, cls = 'text-link') =>
  `<a class="${cls}" href="${paths[key]}">${text}${arrow}</a>`;
const external = (url, text) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span><span class="visually-hidden"> (abre em nova aba)</span></a>`;
const brand = () =>
  `<a class="brand" href="index.html" aria-label="${name} — Início"><img src="img/logocorrigida.png" width="54" height="54" alt="Logo da Serventia Registral de Igarassu"><span><small>Serventia Registral de</small><strong>IGARASSU</strong></span></a>`;
function header(key) {
  return `<a class="skip-link" href="#conteudo">Ir para o conteúdo</a><div class="scroll-progress" aria-hidden="true"></div><header class="site-header"><div class="container header-inner">${brand()}<nav class="nav" id="navigation" aria-label="Navegação principal">${['home', 'institutional', 'services', 'reurb', 'contact'].map((k) => (k === 'services' ? `<div class="dropdown"><div class="dropdown-row"><a href="servicos.html" ${key === 'services' ? 'aria-current="page"' : ''}>Serviços</a><button class="dropdown-toggle" aria-label="Exibir categorias de serviços" aria-expanded="false" aria-controls="service-menu">⌄</button></div><div class="dropdown-menu" id="service-menu" hidden>${['ri', 'rtd', 'rcpj'].map((s) => `<a href="${paths[s]}" ${key === s ? 'aria-current="page"' : ''}>${s === 'rcpj' ? 'Registro Civil das Pessoas Jurídicas' : labels[s]}</a>`).join('')}</div></div>` : `<a href="${paths[k]}" ${key === k ? 'aria-current="page"' : ''}>${labels[k]}</a>`)).join('')}${link('contact', 'Falar com a Serventia', 'button')}</nav><div class="header-actions"><button class="theme-toggle" type="button" aria-label="Ativar modo escuro" aria-pressed="false"><span class="theme-sun" aria-hidden="true">☼</span><span class="theme-moon" aria-hidden="true">☾</span></button><button class="menu-toggle" aria-label="Abrir menu" aria-controls="navigation" aria-expanded="false"><span></span><span></span></button></div></div></header><div class="menu-backdrop" hidden></div>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div>${brand()}<p>Serviços registrais com responsabilidade, clareza e compromisso com o cidadão.</p><div class="footer-tagline">Moderno, digital e próximo.</div></div><div><h2>NAVEGUE</h2>${['home', 'institutional', 'services', 'reurb', 'contact'].map((k) => `<a href="${paths[k]}">${labels[k]}</a>`).join('')}</div><div><h2>SERVIÇOS</h2>${['ri', 'rtd', 'rcpj'].map((k) => `<a href="${paths[k]}">${labels[k]}</a>`).join('')}<a href="contato.html?servico=certidoes">Certidões e orientações</a></div><div><h2>ATENDIMENTO</h2><p>Rua Joaquim Nabuco, nº 105<br>Centro, Igarassu/PE</p><a href="tel:+5581999492993">(81) 99949-2993</a><a href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">${email}</a><p>Horário: 9h às 17h</p></div></div><div class="footer-bottom"><span>© <span data-year>2026</span> ${name}<br>CNPJ 68.672.136/0001-81</span><div class="footer-credit"><a href="politica-privacidade.html">Política de Privacidade</a><span>Desenvolvido por: Filipe Gualberto</span></div></div></div></footer>`;
}
const bread = (key) =>
  `<nav class="breadcrumb" aria-label="Caminho de navegação"><a href="index.html">Início</a><span aria-hidden="true">/</span>${['ri', 'rtd', 'rcpj'].includes(key) ? '<a href="servicos.html">Serviços</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${labels[key]}</span></nav>`;
const hero = (key, tag, title, desc) =>
  `<section class="inner-hero"><div class="container">${bread(key)}<div class="eyebrow">${tag}</div><h1 class="reveal reveal-up">${title}</h1><p class="lead reveal" data-delay="100">${desc}</p></div></section>`;
const cta = (
  title = 'Podemos orientar seu próximo passo.',
  text = 'Fale com a serventia para identificar o serviço e esclarecer as particularidades da sua solicitação.',
) =>
  `<aside class="compact-cta reveal"><div><h2>${title}</h2><p>${text}</p></div>${link('contact', 'Fale conosco', 'button')}</aside>`;
const notice =
  '<aside class="notice"><p>A documentação e o procedimento podem variar conforme o caso. Consulte a serventia para orientação específica.</p></aside>';
const accordion = (items) =>
  `<div class="accordion">${items.map(([q, a], i) => `<details><summary>${q}</summary><div class="answer"><p>${a}</p></div></details>`).join('')}</div>`;
const law = 'https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm';
const lgpd = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm';
const reurbLaw = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13465.htm';
const reurbDrive = 'https://drive.google.com/drive/folders/1uuD1lrPmMU7AxN7tnDuBhAUB9ZWE62L7';
const source = (url, text) =>
  `<p class="source">Consulte a fonte oficial: ${external(url, text)}.</p>`;
function quickContact() {
  return `<section class="section contact-banner"><div class="container split"><div class="reveal"><div class="eyebrow">Estamos por perto</div><h2>Uma conversa pode ser o seu primeiro passo.</h2><p class="lead">Conte com os nossos canais de atendimento para esclarecer dúvidas sobre serviços registrais.</p><div class="actions"><a class="button" href="tel:+5581999492993">Ligar para a Serventia ${arrow}</a><a class="button secondary" href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">Enviar e-mail ${arrow}</a></div>${link('contact', 'Ver página de contato')}</div><div class="contact-lines reveal"><div><small>Visite a serventia</small>Rua Joaquim Nabuco, nº 105<br>Centro, Igarassu/PE</div><div><small>Telefone</small><a href="tel:+5581999492993">(81) 99949-2993</a></div><div><small>E-mail</small><a href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">${email}</a></div><div><small>Horário de atendimento</small>9h às 17h</div></div></div></section>`;
}
function serviceGrid() {
  return `<div class="service-grid"><article class="service-card featured reveal">${icon('home')}<h3>Registro<br>de Imóveis</h3><p>Informações sobre matrícula, transferências, averbações e certidões. Segurança para as relações com o seu imóvel.</p>${link('ri', 'Conheça os serviços')}</article><article class="service-card reveal" data-delay="100">${icon('doc')}<h3>Títulos e Documentos</h3><p>Registro e conservação de documentos, contratos e notificações extrajudiciais.</p>${link('rtd', 'Explore esta área')}</article><article class="service-card reveal" data-delay="200">${icon('people')}<h3>Pessoas Jurídicas</h3><p>Atos da vida das associações, fundações e outras entidades sujeitas ao registro civil.</p>${link('rcpj', 'Consulte as orientações')}</article></div>`;
}
const journey = () =>
  `<div class="journey">${[
    ['Identifique o serviço', 'Encontre a área relacionada ao seu imóvel, documento ou entidade.'],
    ['Consulte as orientações', 'Entenda os conceitos e as informações iniciais do serviço.'],
    ['Entre em contato', 'Fale com a serventia ou utilize o canal disponível para o seu pedido.'],
    ['Acompanhe sua solicitação', 'Guarde as informações do atendimento e consulte o andamento.'],
  ]
    .map(
      ([t, d], i) =>
        `<article class="reveal" data-delay="${i * 80}"><span class="step">0${i + 1}</span><h3>${t}</h3><p>${d}</p></article>`,
    )
    .join('')}</div>`;
function home() {
  return `<section class="hero"><div class="container"><div class="hero-topline"><span class="eyebrow">Moderno, digital e próximo</span><span class="hero-location">IGARASSU · PERNAMBUCO</span></div><div class="hero-layout"><div class="hero-copy"><h1>Registrar o presente.<br><em>Proteger o futuro.</em></h1></div><div class="hero-art"><div class="brand-panel"><img src="img/logocorrigida.png" width="1254" height="1254" alt="Identidade oficial da Serventia Registral de Igarassu"></div><p class="hero-signature">Tradição que acompanha o seu tempo</p></div><div class="hero-bottom"><div><p class="lead">Segurança jurídica para os momentos que importam. Registro de Imóveis, Títulos e Documentos e Registro Civil das Pessoas Jurídicas em Igarassu.</p><div class="actions">${link('services', 'Conheça nossos serviços', 'button')}${link('contact', 'Fale conosco', 'button secondary')}</div><div class="hero-services"><span>Registro de Imóveis</span><span>Títulos e Documentos</span><span>Pessoas Jurídicas</span></div></div></div></div></div></section><div class="principles"><div class="container principle-track">${['Segurança jurídica', 'Tecnologia', 'Confiança', 'Credibilidade', 'Atendimento', 'Modernização'].map((t) => `<span>${t}</span>`).join('')}</div></div><section class="section"><div class="container"><div class="section-heading reveal"><div><div class="eyebrow">Central de serviços</div><h2>Encontre o serviço<br>que você precisa.</h2></div><p>Informação clara para começar.<br>Escolha a área e conheça as orientações.</p></div>${serviceGrid()}<div class="shortcuts"><a href="contato.html?servico=certidoes">Certidões ${arrow}</a><a href="contato.html?servico=protocolo">Acompanhamento / Protocolo ${arrow}</a><!-- TODO: configurar URL oficial do registro digital em config.js --><a href="contato.html?servico=digital" data-config-link="registroDigital">Orientação para registro digital ${arrow}</a></div></div></section><section class="section institutional-home"><div class="container split"><div class="reveal"><div class="eyebrow">A nossa serventia</div><h2>Compromisso com os seus direitos.<br>Proximidade com você.</h2><p class="lead">A Serventia Registral de Igarassu atua na prestação de serviços registrais essenciais à segurança das relações jurídicas.</p>${link('institutional', 'Conheça a Serventia')}</div><div class="reveal reveal-right"><blockquote class="editorial-quote">Registrar é dar às relações jurídicas uma base de confiança, continuidade e transparência.</blockquote><div class="official"><small>Oficiala Registradora Interina</small><strong>${official}</strong><small>CNPJ 68.672.136/0001-81</small></div></div></div></section><section class="section reurb-feature"><div class="container split"><div class="reveal"><div class="eyebrow">Território, cidadania e registro</div><span class="display">REURB</span><h2>Regularização<br>Fundiária Urbana</h2></div><div class="reveal"><p class="lead">Informação, segurança jurídica e orientação em processos de REURB.</p><p>A regularização reúne medidas voltadas à integração de núcleos urbanos informais ao ordenamento territorial e à titulação de seus ocupantes.</p><div class="actions">${link('reurb', 'Saiba mais sobre REURB', 'button gold')}<a class="button secondary reurb-drive" href="${reurbDrive}" target="_blank" rel="noopener noreferrer">Acessar materiais da REURB ${arrow}</a></div><p class="reurb-note">A Serventia Registral de Igarassu trabalha com REURB. Conheça o papel do registro imobiliário nesse processo.</p></div></div></section><section class="section"><div class="container"><div class="eyebrow">Seu atendimento, passo a passo</div><h2>Clareza em cada etapa.</h2>${journey()}</div></section><section class="section" style="padding-top:0"><div class="container split"><div><div class="eyebrow">Informação ao seu alcance</div><h2>Acessos importantes.</h2><p class="lead">Referências e orientações para consultar com tranquilidade.</p></div><div class="legal-links">${external('https://ridigital.org.br/', 'Registro Digital')}${external('https://portal.tjpe.jus.br/documents/d/corregedoria/tabela-emolumentos-2025-pdf', 'Tabela de Emolumentos — 2025')}${external('https://portal.tjpe.jus.br/documents/d/corregedoria/codigo-de-normas-compilado-novo-19-02-2026-pdf', 'Código de Normas — compilado em 19/02/2026')}${external(law, 'Lei de Registros Públicos')}${external('https://www.planalto.gov.br/ccivil_03/leis/l8935.htm', 'Lei dos Notários e Registradores')}${external(lgpd, 'Lei Geral de Proteção de Dados')}</div></div></section>${quickContact()}`;
}
const pages = {};
pages.home = {
  title: 'Registro de Imóveis, Títulos e Documentos e Pessoas Jurídicas',
  description:
    'Serviços registrais em Igarassu: Registro de Imóveis, Títulos e Documentos, Pessoas Jurídicas e REURB. Atendimento das 9h às 17h.',
  body: home(),
};
pages.institutional = {
  title: 'Institucional',
  description:
    'Conheça a Serventia Registral de Igarassu, seus princípios e a Oficialia Interina de Ana Clarinda de Souza Ribeiro Ferraz.',
  body:
    hero(
      'institutional',
      'Nossa identidade',
      'Tradição registral.<br>Um olhar para o presente.',
      'Responsabilidade no registro, clareza na informação e respeito em cada atendimento.',
    ) +
    `<section class="section"><div class="container split"><div class="institutional-panel reveal reveal-scale"><!-- TODO: adicionar a imagem oficial img/institucional.png quando disponibilizada. Não substituir por fotografia de equipe. --><img src="img/institucional.png" alt="Imagem institucional da Serventia Registral de Igarassu" width="720" height="820" loading="lazy" data-institutional-image hidden><div class="institutional-fallback">Moderno.<br>Digital.<br>Próximo.<small>Serventia Registral de Igarassu</small></div></div><div class="reveal"><div class="eyebrow">A Serventia</div><h2>Segurança para as relações que fazem parte da vida.</h2><p class="lead">A Serventia Registral de Igarassu atua na prestação de serviços de Registro de Imóveis, Registro de Títulos e Documentos e Registro Civil das Pessoas Jurídicas.</p><p>O compromisso institucional é oferecer informação compreensível, tratar cada solicitação com responsabilidade e aproximar o cidadão dos serviços registrais.</p><p>A modernização e a atenção ao público orientam uma experiência de atendimento respeitosa, em harmonia com as exigências próprias da atividade registral.</p><div class="official"><small>Oficiala Registradora Interina</small><strong>${official}</strong><p>A condução da serventia tem como referência a responsabilidade pela atividade registral e a observância das normas aplicáveis.</p><small>CNPJ 68.672.136/0001-81</small></div></div></div></section><section class="section" style="padding-top:0"><div class="container"><div class="eyebrow">O que nos orienta</div><h2>Princípios que dão sentido ao registro.</h2><div class="values" style="margin-top:40px"><article class="reveal"><h3>Missão</h3><p>Prestar serviços registrais com responsabilidade, favorecendo a segurança jurídica e o acesso do cidadão a informações claras.</p></article><article class="reveal" data-delay="100"><h3>Visão</h3><p>Aproximar tradição e modernização em uma experiência de atendimento cada vez mais acessível e organizada.</p></article><article class="reveal" data-delay="200"><h3>Valores</h3><p>Legalidade, transparência, respeito, proteção de dados e cuidado com a informação em cada ato praticado.</p></article></div>${cta()}</div></section>`,
};
const services = [
  [
    'ri',
    'home',
    'Registro de Imóveis',
    'Para conhecer a situação registral de um imóvel e entender atos relacionados à propriedade, aos direitos e às garantias.',
    'Matrículas · Registros · Averbações · Certidões',
  ],
  [
    'rtd',
    'doc',
    'Títulos e Documentos',
    'Informações sobre registro de documentos, conservação documental e comunicações formais.',
    'Contratos · Notificações · Documentos eletrônicos',
  ],
  [
    'rcpj',
    'people',
    'Registro Civil das Pessoas Jurídicas',
    'Orientações sobre atos constitutivos e alterações da vida institucional das entidades sujeitas a este registro.',
    'Estatutos · Atas · Diretorias · Certidões',
  ],
  [
    'reurb',
    'pin',
    'Regularização Fundiária Urbana',
    'Conheça a REURB e a participação do registro imobiliário no processo de regularização.',
    'Território · Titulação · Segurança jurídica',
  ],
];
pages.services = {
  title: 'Serviços',
  description:
    'Encontre orientações sobre Registro de Imóveis, Títulos e Documentos, Pessoas Jurídicas, certidões e REURB.',
  body:
    hero(
      'services',
      'Central de serviços',
      'O seu próximo passo<br>começa com informação.',
      'Explore as áreas de atuação. Cada serviço tem suas particularidades; a serventia pode orientar o atendimento do seu caso.',
    ) +
    `<section class="section"><div class="container"><nav class="category-nav" aria-label="Categorias de serviços">${services.map(([k, i, t]) => `<a href="#${k}">${t}</a>`).join('')}</nav>${services.map(([k, i, t, d, tags], n) => `<article class="service-chapter reveal" id="${k}"><span class="chapter-number">0${n + 1}</span><div><h2>${t}</h2><p>${d}</p><p class="source">${tags}</p>${link(k, 'Conheça os serviços')}</div>${icon(i)}</article>`).join('')}<div class="shortcuts"><a href="contato.html?servico=certidoes">Solicitar orientação sobre certidões ${arrow}</a><a href="contato.html?servico=protocolo">Consultar protocolo ${arrow}</a><a href="contato.html?servico=digital" data-config-link="registroDigital">Consultar canal digital ${arrow}</a></div></div></section><section class="section" style="padding-top:0"><div class="container split"><div><div class="eyebrow">Dúvidas frequentes</div><h2>Antes de começar.</h2></div><div>${accordion(
      [
        [
          'Não sei qual serviço escolher. Como proceder?',
          'Descreva sua necessidade pelo telefone ou e-mail. A serventia pode ajudar a identificar a área de atendimento relacionada ao pedido.',
        ],
        [
          'Quais documentos devo apresentar?',
          'A documentação depende do ato pretendido e das características do caso. Antes de encaminhar documentos, consulte as orientações específicas do atendimento.',
        ],
        [
          'Como consultar valores e andamento?',
          'Consulte a serventia sobre a tabela aplicável ao ato. Para acompanhar uma solicitação, tenha em mãos as informações ou o número do protocolo, quando existente.',
        ],
        [
          'O formulário realiza um pedido de registro?',
          'Não. O formulário prepara uma mensagem de e-mail para contato inicial. O envio de uma mensagem não substitui a apresentação formal de um título.',
        ],
      ],
    )}</div></div></section>`,
};
const riGroups = [
  [
    'matricula',
    'Matrícula e propriedade',
    [
      [
        'Matrícula do imóvel',
        'É o registro individualizado que reúne a identificação do imóvel e os atos relacionados a ele. Sua leitura permite compreender a situação registral documentada.',
      ],
      [
        'Propriedade',
        'A situação da propriedade deve ser examinada a partir do registro e do título correspondente. A matrícula é uma referência essencial nessa consulta.',
      ],
      [
        'Compra e venda, doação e permuta',
        'São formas distintas de transmissão. O título apresentado passa por análise registral, considerando a natureza do negócio e os requisitos pertinentes.',
      ],
      [
        'Usucapião',
        'É uma forma de aquisição vinculada a requisitos legais. A possibilidade de processamento extrajudicial e os elementos do pedido dependem da análise do caso.',
      ],
    ],
  ],
  [
    'direitos',
    'Direitos, garantias e restrições',
    [
      [
        'Hipoteca e alienação fiduciária',
        'São modalidades de garantia com regimes próprios. Sua constituição, alteração ou cancelamento exige título e análise adequados a cada situação.',
      ],
      [
        'Penhora e indisponibilidade',
        'São medidas que podem repercutir na situação registral do imóvel. Seus efeitos e eventuais cancelamentos dependem da determinação competente e da legislação aplicável.',
      ],
      [
        'Usufruto e servidão',
        'O usufruto e a servidão envolvem direitos específicos sobre imóveis. A identificação dos titulares, do conteúdo e do alcance do direito integra a análise registral.',
      ],
    ],
  ],
  [
    'organizacao',
    'Organização e transformação do imóvel',
    [
      [
        'Loteamentos e incorporações',
        'Envolvem a organização de empreendimentos imobiliários e documentação própria. A análise considera a modalidade do empreendimento e as aprovações cabíveis.',
      ],
      [
        'Desmembramento e remembramento',
        'Dizem respeito, respectivamente, à divisão e à reunião de áreas. A viabilidade e os documentos variam conforme a situação e as regras pertinentes.',
      ],
      [
        'Condomínio',
        'A instituição e os atos relativos a um condomínio exigem identificação adequada das unidades, áreas e direitos envolvidos, conforme sua modalidade.',
      ],
    ],
  ],
  [
    'atualizacoes',
    'Atualizações e informações',
    [
      [
        'Averbações',
        'Anotam alterações relevantes ligadas ao imóvel ou às pessoas que figuram no registro, mediante documentação pertinente ao fato.',
      ],
      [
        'Retificações',
        'Destinam-se à correção ou adequação de informações registrais. O procedimento depende da natureza da informação e dos interesses envolvidos.',
      ],
      [
        'Georreferenciamento',
        'Trata da identificação técnica da localização e dos limites de um imóvel, especialmente em contextos rurais. Sua exigibilidade e integração ao registro devem ser verificadas no caso concreto.',
      ],
      [
        'Certidões',
        'Apresentam informações constantes do acervo registral. Informe a finalidade da consulta para receber orientação sobre a modalidade e os dados necessários à localização do registro.',
      ],
    ],
  ],
];
const rtdGroups = [
  [
    'documentos',
    'Documentos e instrumentos',
    [
      [
        'Contratos e instrumentos particulares',
        'Documentam acordos e manifestações de vontade. A modalidade de registro adequada depende do conteúdo e da finalidade, sem substituir registros de competência específica.',
      ],
      [
        'Declarações e cessão de direitos',
        'Declarações formalizam manifestações; cessões tratam da transferência de determinados direitos. A natureza do documento orienta a análise de seu ingresso no registro.',
      ],
      [
        'Data certa',
        'O registro pode contribuir para a comprovação da data de apresentação de um documento. Os efeitos jurídicos dependem da espécie de ato praticado.',
      ],
    ],
  ],
  [
    'comunicacoes',
    'Comunicações e conservação',
    [
      [
        'Notificações extrajudiciais',
        'Permitem documentar uma comunicação por meio do serviço registral. Informe o conteúdo, a finalidade e os dados disponíveis para orientação sobre o procedimento.',
      ],
      [
        'Comunicações formais',
        'A forma de realização e de comprovação da comunicação depende da solicitação e das regras aplicáveis. O atendimento esclarece as possibilidades para o caso.',
      ],
      [
        'Conservação documental',
        'O registro para conservação tem finalidade própria de arquivamento de conteúdo e data. Não deve ser confundido com outras modalidades de registro ou com garantia de validade do negócio.',
      ],
    ],
  ],
  [
    'formatos',
    'Formatos e acesso ao acervo',
    [
      [
        'Documentos estrangeiros',
        'A utilização de documentos produzidos no exterior pode envolver tradução e outras formalidades. Os requisitos são verificados de acordo com a origem, o conteúdo e a finalidade.',
      ],
      [
        'Documentos eletrônicos',
        'A apresentação digital depende de formato, assinatura e canal compatíveis com as normas do serviço. Consulte as orientações antes de encaminhar arquivos.',
      ],
      [
        'Certidões',
        'São emitidas a partir das informações do acervo. Dados que permitam localizar o registro auxiliam a identificação do documento pretendido.',
      ],
    ],
  ],
];
const rcpjGroups = [
  [
    'entidades',
    'Entidades e atos constitutivos',
    [
      [
        'Associações',
        'São entidades organizadas em torno de finalidades não econômicas. Seus atos constitutivos e alterações pertinentes podem integrar o Registro Civil das Pessoas Jurídicas.',
      ],
      [
        'Fundações',
        'Possuem estrutura e requisitos próprios. O registro de seus atos observa as exigências aplicáveis, inclusive a atuação dos órgãos competentes quando necessária.',
      ],
      [
        'Organizações religiosas e outras entidades compatíveis',
        'A atribuição registral é definida pela natureza jurídica da entidade. Outras pessoas jurídicas somente ingressam neste serviço quando a legislação assim determinar.',
      ],
      [
        'Estatutos',
        'Organizam as regras de funcionamento da entidade. O instrumento é analisado em conjunto com os demais elementos pertinentes à constituição ou à alteração.',
      ],
    ],
  ],
  [
    'vida',
    'Vida institucional',
    [
      [
        'Alterações estatutárias',
        'Mudanças nas regras da entidade precisam ser formalizadas conforme seu estatuto e a legislação, com o correspondente ato registral quando cabível.',
      ],
      [
        'Atas e eleição de diretoria',
        'Documentam deliberações e escolhas dos órgãos de administração. A apresentação deve permitir verificar a regularidade dos atos e da representação.',
      ],
      [
        'Averbações e filiais',
        'Alterações e atos relacionados a filiais dependem da natureza da entidade e das informações já registradas. Consulte a atribuição e os requisitos para o ato pretendido.',
      ],
      [
        'Dissolução',
        'O encerramento da entidade envolve deliberações e providências próprias. A formalização registral considera a situação jurídica e a documentação apresentada.',
      ],
    ],
  ],
  [
    'acervo',
    'Livros e certidões',
    [
      [
        'Livros',
        'A apresentação de livros e os atos que lhes digam respeito devem observar as regras aplicáveis à entidade e à atribuição do registro.',
      ],
      [
        'Certidões',
        'Permitem consultar atos e informações existentes no acervo, como constituição e alterações. Informe os dados da entidade para auxiliar a localização.',
      ],
    ],
  ],
];
function detail(key, tag, title, desc, groups) {
  return (
    hero(key, tag, title, desc) +
    `<section class="section"><div class="container reading-layout"><nav class="side-nav" aria-label="Nesta página"><strong>Nesta página</strong>${groups.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}<a href="#orientacao">Orientação específica</a></nav><div class="reading-content">${groups.map(([id, t, items]) => `<section id="${id}" class="reveal"><h2>${t}</h2>${accordion(items)}</section>`).join('')}<section id="orientacao">${notice}${source(law, 'Lei de Registros Públicos — Lei nº 6.015/1973')}${cta()}</section></div></div></section>`
  );
}
pages.ri = {
  title: 'Registro de Imóveis',
  description:
    'Entenda matrícula, transferências, direitos, garantias, averbações e certidões imobiliárias em Igarassu.',
  body: detail(
    'ri',
    'Patrimônio e segurança jurídica',
    'Cada imóvel tem uma história.<br>O registro preserva seus atos.',
    'Conheça os principais conceitos do registro imobiliário e encontre o ponto de partida para sua solicitação.',
    riGroups,
  ),
};
pages.rtd = {
  title: 'Títulos e Documentos',
  description:
    'Orientações sobre contratos, notificações extrajudiciais, conservação documental e certidões de títulos e documentos.',
  body: detail(
    'rtd',
    'Documentos e relações jurídicas',
    'Informação documentada.<br>Relações mais seguras.',
    'Entenda as possibilidades do Registro de Títulos e Documentos, suas finalidades e os diferentes tipos de documentos.',
    rtdGroups,
  ),
};
pages.rcpj = {
  title: 'Registro Civil das Pessoas Jurídicas',
  description:
    'Informações sobre associações, fundações, estatutos, atas, diretorias e certidões de pessoas jurídicas.',
  body: detail(
    'rcpj',
    'Organização e continuidade',
    'O registro acompanha<br>a vida da sua entidade.',
    'Da constituição às alterações institucionais, conheça os atos relacionados ao Registro Civil das Pessoas Jurídicas.',
    rcpjGroups,
  ),
};
pages.reurb = {
  title: 'REURB — Regularização Fundiária Urbana',
  description:
    'Conheça a REURB e o papel do registro imobiliário na regularização fundiária urbana. A Serventia Registral de Igarassu trabalha com REURB.',
  body:
    hero(
      'reurb',
      'Regularização Fundiária Urbana',
      'Um território integrado.<br>Direitos reconhecidos.',
      'A Serventia Registral de Igarassu trabalha com REURB. Entenda como o registro participa da regularização fundiária urbana.',
    ) +
    `<section class="section"><div class="container split"><div class="reveal"><div class="eyebrow">Entenda o processo</div><h2>O que é REURB?</h2></div><div class="reveal"><p>A Regularização Fundiária Urbana reúne medidas jurídicas, urbanísticas, ambientais e sociais voltadas à incorporação de núcleos urbanos informais ao ordenamento territorial e à titulação de seus ocupantes.</p><p>Seu objetivo envolve a organização do território e o reconhecimento formal de direitos, considerando as características da ocupação e as exigências legais.</p>${source(reurbLaw, 'Lei nº 13.465/2017')}<div class="actions"><a class="button" href="${reurbDrive}" target="_blank" rel="noopener noreferrer">Acessar materiais da REURB ${arrow}</a></div></div></div></section><section class="section" style="padding-top:0"><div class="container"><div class="eyebrow">Da regularização ao registro</div><h2>Como o registro imobiliário participa.</h2><p class="lead">O registro recebe e analisa os títulos e documentos pertinentes, verificando os requisitos para a prática dos atos registrais. Ele integra um processo que também envolve o poder público e outros participantes.</p><div class="reurb-stages">${[
      [
        'Compreensão da situação',
        'Identificação do núcleo e das características da ocupação pelos participantes responsáveis.',
      ],
      [
        'Processamento da regularização',
        'Desenvolvimento das providências administrativas, técnicas e jurídicas cabíveis.',
      ],
      [
        'Apresentação ao registro',
        'Encaminhamento do título e dos documentos pertinentes para análise registral.',
      ],
      ['Atos registrais', 'Prática dos atos cabíveis quando atendidos os requisitos aplicáveis.'],
    ]
      .map(
        ([t, d], i) =>
          `<article class="reveal" data-delay="${i * 70}"><span class="step">0${i + 1}</span><h3>${t}</h3><p>${d}</p></article>`,
      )
      .join(
        '',
      )}</div><p class="source">Visão geral informativa. As providências e sua sequência dependem do procedimento.</p><aside class="notice"><p>Cada procedimento possui características próprias. Para orientações relacionadas a um caso específico, entre em contato com a Serventia Registral de Igarassu.</p></aside></div></section><section class="section" style="padding-top:0"><div class="container split"><div><div class="eyebrow">Dúvidas sobre REURB</div><h2>Informação para<br>seguir com clareza.</h2></div><div>${accordion(
      [
        [
          'REURB é apenas registrar um imóvel?',
          'Não. A regularização envolve dimensões administrativas, técnicas e jurídicas. O registro imobiliário é uma das partes desse processo.',
        ],
        [
          'Existe uma lista única de documentos?',
          'Os documentos dependem do procedimento e das características do núcleo e dos títulos. Consulte os responsáveis pelo processo e a serventia sobre a etapa registral.',
        ],
        [
          'Há prazo ou custo igual para todos os casos?',
          'Não é possível indicar um valor ou prazo universal. As condições dependem do enquadramento e das particularidades de cada procedimento.',
        ],
        [
          'Por onde posso começar?',
          'Entre em contato descrevendo a situação e as informações disponíveis. A serventia pode esclarecer questões relativas à sua atuação no registro imobiliário.',
        ],
      ],
    )}</div></div></section><div class="container" style="padding-bottom:70px">${cta('Vamos esclarecer sua dúvida sobre REURB?')}</div>`,
};
function backHome() {
  return `<section class="back-home"><div class="container"><a class="button secondary" href="index.html"><span aria-hidden="true">←</span> Voltar para a página inicial</a></div></section>`;
}
function field(id, label, type = 'text', extra = '') {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${extra} required aria-describedby="${id}-error"><span class="error" id="${id}-error"></span></div>`;
}
const maps =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Rua Joaquim Nabuco, 105, Centro, Igarassu, PE');
const mapEmbed =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('Rua Joaquim Nabuco, 105, Centro, Igarassu, PE') +
  '&output=embed';
pages.contact = {
  title: 'Contato',
  description:
    'Fale com a Serventia Registral de Igarassu. Rua Joaquim Nabuco, nº 105, Centro. Telefone (81) 99949-2993. Atendimento das 9h às 17h.',
  body:
    hero(
      'contact',
      'Canais de atendimento',
      'Estamos aqui<br>para orientar você.',
      'Encontre a serventia, entre em contato ou prepare uma mensagem para enviar pelo seu e-mail.',
    ) +
    `<section class="section"><div class="container"><div class="contact-cards"><article class="contact-card reveal">${icon('pin')}<h2>Endereço</h2><p>Rua Joaquim Nabuco, nº 105<br>Centro, Igarassu/PE</p></article><article class="contact-card reveal" data-delay="80">${icon('phone')}<h2>Telefone</h2><p>(81) 99949-2993</p><a class="text-link" href="tel:+5581999492993">Ligar ${arrow}</a></article><article class="contact-card reveal" data-delay="160">${icon('mail')}<h2>E-mail</h2><p><a href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">${email}</a></p><a class="text-link" href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">Enviar e-mail ${arrow}</a></article><article class="contact-card reveal" data-delay="240">${icon('clock')}<h2>Horário</h2><p>9h às 17h</p><p class="source">Consulte a serventia para informações sobre o atendimento.</p></article></div><div class="split contact-layout"><form class="contact-form" id="contact-form" action="${gmailCompose()}" target="_blank" method="get"><h2>Como podemos ajudar?</h2><p>Todos os campos são obrigatórios. Ao continuar, o Gmail será aberto com a mensagem preparada. O envio será concluído por você no Gmail.</p><div class="form-grid">${field('nome', 'Nome completo', 'text', 'autocomplete="name" maxlength="120"')}${field('email', 'E-mail', 'email', 'autocomplete="email" maxlength="180"')}${field('telefone', 'Telefone', 'tel', 'autocomplete="tel" inputmode="tel" maxlength="24"')}${field('assunto', 'Assunto', 'text', 'maxlength="160"')}<div class="field full"><label for="servico">Serviço de interesse</label><select id="servico" name="servico" required aria-describedby="servico-error"><option value="">Selecione um serviço</option><option value="imoveis">Registro de Imóveis</option><option value="documentos">Títulos e Documentos</option><option value="pessoas-juridicas">Pessoas Jurídicas</option><option value="reurb">REURB</option><option value="certidoes">Certidões</option><option value="protocolo">Acompanhamento / Protocolo</option><option value="digital">Registro Digital</option><option value="outros">Outras informações</option></select><span class="error" id="servico-error"></span></div><div class="field full"><label for="mensagem">Mensagem</label><textarea id="mensagem" name="mensagem" required maxlength="3500" aria-describedby="mensagem-help mensagem-error"></textarea><small id="mensagem-help">Descreva sua dúvida. Evite incluir documentos ou dados sensíveis neste primeiro contato.</small><span class="error" id="mensagem-error"></span></div></div><label class="checkbox"><input type="checkbox" id="privacidade" name="privacidade" required aria-describedby="privacidade-error"><span>Li e estou ciente da <a href="politica-privacidade.html" target="_blank" rel="noopener noreferrer">Política de Privacidade (abre em nova aba)</a>.</span></label><span class="error" id="privacidade-error"></span><div class="actions"><button class="button" type="submit">Preparar e-mail ${arrow}</button></div><p class="form-status" id="form-status" role="status" aria-live="polite"></p><noscript><p>Você também pode enviar sua mensagem diretamente para <a href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">${email}</a>.</p></noscript></form><aside class="contact-aside"><div class="eyebrow">Atendimento próximo</div><h2>Prefere conversar?</h2><p>O telefone e o e-mail estão disponíveis para orientar o contato inicial. Tenha os dados do atendimento em mãos, caso já exista uma solicitação.</p><a class="button secondary" href="tel:+5581999492993">(81) 99949-2993 ${arrow}</a><div class="pending-channel"><span>WhatsApp</span><small data-pending="whatsapp">Canal em atualização</small><a data-config-link="whatsapp" hidden>WhatsApp oficial ↗</a></div><div class="pending-channel"><span>Instagram</span><small data-pending="instagram">Canal em atualização</small><a data-config-link="instagram" hidden>Instagram oficial ↗</a></div><div class="map-panel"><iframe src="${mapEmbed}" title="Mapa da localização da Serventia Registral de Igarassu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a class="map-link" href="${maps}" target="_blank" rel="noopener noreferrer">${icon('pin')}<h3>Encontre a Serventia</h3><p>Rua Joaquim Nabuco, nº 105<br>Centro, Igarassu/PE</p><span class="text-link">Abrir no Google Maps ↗</span></a></div><p class="source">O mapa é fornecido pelo Google e pode carregar conteúdo externo.</p></aside></div></div></section>`,
};
pages.privacy = {
  title: 'Política de Privacidade',
  description:
    'Informações sobre o uso de dados, finalidade do contato, direitos dos titulares e canais de privacidade da Serventia Registral de Igarassu.',
  body:
    hero(
      'privacy',
      'Privacidade e transparência',
      'Cuidado com os dados.<br>Respeito às pessoas.',
      'Informações sobre o uso deste site e os canais para questões relacionadas à proteção de dados pessoais.',
    ) +
    `<section class="section"><div class="container reading-layout"><nav class="side-nav" aria-label="Tópicos de privacidade"><strong>Nesta página</strong><a href="#compromisso">Compromisso</a><a href="#dados">Dados e finalidade</a><a href="#seguranca">Segurança</a><a href="#direitos">Direitos do titular</a><a href="#encarregado">Encarregado e contato</a><a href="#externos">Links e atualizações</a></nav><article class="privacy-article reading-content"><section id="compromisso" class="reveal"><h2>Compromisso com a proteção de dados</h2><p>A Serventia Registral de Igarassu considera a proteção de dados parte de um atendimento responsável. Esta página apresenta informações gerais sobre o site e seus canais de contato, em referência à Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018.</p><p>O tratamento decorrente dos serviços registrais observa também deveres legais, de publicidade e de conservação próprios da atividade. Esta página não substitui as informações específicas de cada procedimento.</p></section><section id="dados" class="reveal"><h2>Dados fornecidos e finalidade</h2><p>O formulário solicita nome, e-mail, telefone, assunto, serviço de interesse e mensagem para organizar seu contato. Os dados preenchidos permanecem na página até serem encaminhados ao Gmail por você. Este site não possui um serviço de recebimento automático do formulário.</p><p>Ao efetuar o envio pelo Gmail, as informações passam a compor uma comunicação dirigida à serventia, para atendimento da solicitação. Evite encaminhar dados de terceiros ou informações sensíveis que não sejam necessários à dúvida inicial.</p><p>O preenchimento do formulário não gera protocolo registral. Solicitações formais seguem os canais e requisitos próprios.</p></section><section id="seguranca" class="reveal"><h2>Segurança e conservação</h2><p>Este site não utiliza cookies de publicidade ou ferramentas de análise de audiência. O armazenamento local é usado apenas para recordar a preferência de tema claro ou escuro; os campos do formulário não são armazenados. A validação ocorre no seu navegador, e a página não grava uma cópia das informações preenchidas.</p><p>O provedor de hospedagem e o Gmail podem tratar dados técnicos conforme suas próprias condições. Comunicações recebidas e documentos de procedimentos podem estar sujeitos a deveres legais de conservação. Para detalhes sobre uma situação concreta, solicite informações à serventia.</p></section><section id="direitos" class="reveal"><h2>Direitos do titular</h2><p>Você pode solicitar informações sobre o tratamento de seus dados, acesso e correção, entre outros direitos previstos na LGPD. A análise observa as hipóteses legais e as obrigações relacionadas à atividade registral.</p><p>A eliminação de dados não é automática quando houver fundamento legal para sua conservação. A confirmação da identidade pode ser necessária para atender uma solicitação com segurança.</p></section><section id="encarregado" class="reveal"><h2>Encarregado pelo tratamento de dados</h2><aside class="notice"><p data-dpo>${dpo}</p></aside><p>Para questões de privacidade, entre em contato com a Serventia Registral de Igarassu pelo e-mail <a href="${gmailCompose()}" target="_blank" rel="noopener noreferrer">${email}</a> ou pelo telefone <a href="tel:+5581999492993">(81) 99949-2993</a>.</p><p>Endereço: Rua Joaquim Nabuco, nº 105, Centro, Igarassu/PE.<br>CNPJ: 68.672.136/0001-81.</p></section><section id="externos" class="reveal"><h2>Links externos e atualizações</h2><p>Links para legislação, mapas e outros serviços levam a ambientes de terceiros, sujeitos às suas próprias políticas. Consulte essas condições antes de fornecer informações.</p><p>Esta política poderá ser atualizada para refletir mudanças no site e nos canais de atendimento. A versão disponível nesta página é a referência para o uso atual do site.</p>${source(lgpd, 'LGPD — Lei nº 13.709/2018')}</section>${cta('Precisa esclarecer uma questão de privacidade?', 'Utilize o canal institucional para encaminhar sua solicitação.')}</article></div></section>`,
};
for (const [key, page] of Object.entries(pages)) {
  const title = key === 'home' ? `${name} | ${page.title}` : `${page.title} | ${name}`;
  writeFileSync(
    paths[key],
    `<!doctype html>\n<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${page.description}"><meta name="theme-color" content="#39164f"><link rel="icon" type="image/png" href="img/logocorrigida.png"><!-- TODO: definir SITE_CONFIG.siteUrl para inserir canonical e og:url com o domínio oficial. --><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${name}"><meta property="og:title" content="${title}"><meta property="og:description" content="${page.description}"><script src="js/theme.js"></script><link rel="stylesheet" href="css/style.css"><script src="js/config.js" defer></script><script src="js/main.js" defer></script></head><body class="${key}-page">${header(key)}<main id="conteudo">${page.body}${key === 'home' ? '' : backHome()}</main>${footer()}</body></html>\n`,
    'utf8',
  );
}
console.log('9 páginas HTML geradas. Sem dependências para abrir ou hospedar.');
