// ============================================================
//  CONFIG DO CORRETOR — tudo que muda de um corretor pro outro fica aqui.
//  SITE DE PORTFÓLIO DA NEXTAGE: a corretora, os imóveis e a avaliação são
//  FICTÍCIOS. Foto da corretora e fotos dos imóveis: Unsplash (licença livre).
//  Antes de publicar, troque os contatos marcados com "TROCAR" pelos teus.
// ============================================================

window.CORRETOR = {
  nome: 'Helena Duarte',
  primeiroNome: 'Helena',
  profissao: 'Corretora de Imóveis',
  creci: '00000',                 // fictício (de propósito, pra não bater com o CRECI de ninguém)
  creciTipo: 'F',
  cidade: 'Botucatu',
  uf: 'SP',
  regiaoLonga: 'Botucatu e região',
  desde: '2009',

  whatsapp: '5514900000000',          // TROCAR pelo teu WhatsApp (55 + DDD + número), pra quem testar o site falar contigo
  whatsappDisplay: '(14) 90000-0000', // TROCAR
  telefoneFixo: '',                   // vazio = não aparece
  instagram: '',                      // vazio = não aparece (pode pôr o @ da Nextage, sem o @)
  facebook: '',
  email: 'contato@exemplo.com.br',    // TROCAR pelo teu e-mail
  endereco: 'Praça Coronel Moura, Centro, Botucatu/SP',
  cep: '18600-000',
  google: { nota: '4,9', avaliacoes: 48 },

  foto: 'assets/img/corretora.jpg',   // Unsplash, photo-1573497019940-1c28c88b4f3e
  fotoHeroi: 'assets/img/heroi.jpg',  // Unsplash

  bio: [
    'Atuo desde 2009 no mercado imobiliário de Botucatu e região, ajudando famílias e investidores na compra, venda, locação e administração de imóveis residenciais, comerciais e rurais.',
    'Gosto de acompanhar cada cliente de perto, da primeira visita à entrega das chaves. Meu compromisso é simples: só indico imóvel que eu visitaria, e só prometo o que posso cumprir.',
  ],
  servicos: ['Compra e venda', 'Locação', 'Administração de imóveis', 'Avaliação de imóveis'],

  depoimento: {
    texto: 'A Helena cuidou de tudo, da visita ao financiamento. Compramos nosso apartamento sem dor de cabeça e ela continua nos atendendo sempre que precisamos.',
    autor: 'Renata',
    origem: 'Cliente',
  },

  // aviso no rodapé: deixa claro pra quem visita que é um site de demonstração
  aviso: 'Site demonstrativo desenvolvido pela Nextage. A corretora, os imóveis e as avaliações são fictícios.',

  corAcao: '#1f4d3a',
};

// ------------------------------------------------------------
//  IMÓVEIS (fictícios, com fotos ilustrativas do Unsplash)
//  Campo vazio/null = não aparece.
//  fotos: quantidade de arquivos em assets/img/imoveis/<codigo>/1.jpg, 2.jpg...
// ------------------------------------------------------------
window.IMOVEIS = [
  {
    codigo: '101', tipo: 'Casa', finalidade: ['venda'], bairro: 'Vila Assumpção',
    preco: 480000, selo: 'Exclusividade', aceitaFinanciamento: true,
    quartos: 3, suites: 1, banheiros: 2, vagas: 2,
    areaConstruida: 140, areaTerreno: 300, areaUtil: null, condominio: null,
    descricao: 'Casa com 3 dormitórios, sendo 1 suíte, sala integrada à cozinha e quintal gramado.\nRua tranquila, perto de escolas e comércio. Aceita financiamento.',
    caracteristicas: ['Sala integrada', 'Quintal gramado', 'Área de serviço', 'Portão eletrônico'],
    fotos: 5,
  },
  {
    codigo: '102', tipo: 'Casa em condomínio', finalidade: ['venda'], bairro: 'Condomínio Colinas do Paraíso',
    preco: 1950000, selo: 'Alto padrão', aceitaFinanciamento: false,
    quartos: 4, suites: 4, banheiros: 5, vagas: 4,
    areaConstruida: 380, areaTerreno: 600, areaUtil: null, condominio: 650,
    descricao: 'Casa de alto padrão em condomínio fechado, com 4 suítes, living com pé-direito alto e área gourmet integrada à piscina.\nTerreno de 600 m² e garagem para 4 carros.',
    caracteristicas: ['Condomínio fechado', 'Piscina', 'Área gourmet', 'Pé-direito alto', 'Garagem para 4 carros'],
    fotos: 5,
  },
  {
    codigo: '103', tipo: 'Casa em condomínio', finalidade: ['venda'], bairro: 'Condomínio Residencial Laguna',
    preco: 1750000, selo: 'Aceita financiamento', aceitaFinanciamento: true,
    quartos: 4, suites: 3, banheiros: 4, vagas: 2,
    areaConstruida: 390, areaTerreno: 1000, areaUtil: null, condominio: null,
    descricao: 'São 4 dormitórios, sendo 3 suítes, sala ampla, sala de jantar, cozinha planejada, lavabo, varanda gourmet e piscina.\nTerreno de 1.000 m² com muito espaço verde. Aceita financiamento.',
    caracteristicas: ['Sala ampla', 'Sala de jantar', 'Cozinha planejada', 'Lavabo', 'Varanda gourmet', 'Piscina'],
    fotos: 6,
  },
  {
    codigo: '104', tipo: 'Casa', finalidade: ['venda'], bairro: 'Jardim Bom Pastor',
    preco: 465000, selo: 'Com piscina', aceitaFinanciamento: true,
    quartos: 3, suites: 1, banheiros: 3, vagas: 3,
    areaConstruida: 170, areaTerreno: 330, areaUtil: null, condominio: null,
    descricao: 'Casa com piscina e edícula: 2 dormitórios na casa principal e 1 na edícula, com banheiro, de frente para a piscina. Churrasqueira, lavanderia coberta e aquecimento solar.\nTerreno de 330 m². Aceita financiamento.',
    caracteristicas: ['Piscina', 'Edícula', 'Churrasqueira', 'Aquecimento solar', 'Portão eletrônico', 'Lavanderia coberta'],
    fotos: 5,
  },
  {
    codigo: '105', tipo: 'Casa', finalidade: ['venda'], bairro: 'Vila Sônia',
    preco: 870000, selo: '', aceitaFinanciamento: true,
    quartos: 3, suites: 1, banheiros: 3, vagas: 2,
    areaConstruida: 260, areaTerreno: 360, areaUtil: null, condominio: null,
    descricao: '3 dormitórios, sendo 1 suíte, salas de estar e jantar, escritório, lareira e cozinha com armários.\nÁrea coberta pronta para receber a área de lazer. Terreno de 360 m².',
    caracteristicas: ['Escritório', 'Lareira', 'Cozinha com armários', 'Lavabo', 'Área coberta', 'Piso de madeira'],
    fotos: 5,
  },
  {
    codigo: '106', tipo: 'Apartamento', finalidade: ['venda', 'locacao'], bairro: 'Centro',
    preco: 320000, selo: 'Venda ou locação', aceitaFinanciamento: true,
    quartos: 2, suites: 1, banheiros: 2, vagas: 1,
    areaConstruida: null, areaTerreno: null, areaUtil: 66, condominio: 420,
    descricao: 'Apartamento de 2 dormitórios, sendo 1 suíte, sala de 2 ambientes e varanda, a poucos minutos de tudo no Centro.\nDisponível para venda ou locação. Para locação, consulte o valor.',
    caracteristicas: ['Suíte', 'Sala 2 ambientes', 'Varanda', 'Elevador'],
    fotos: 4,
  },
  {
    codigo: '107', tipo: 'Apartamento', finalidade: ['venda'], bairro: 'Vila Maria',
    preco: 285000, selo: 'Aceita financiamento', aceitaFinanciamento: true,
    quartos: 3, suites: 1, banheiros: 2, vagas: 1,
    areaConstruida: null, areaTerreno: null, areaUtil: 78, condominio: 210,
    descricao: '3 dormitórios, sendo 1 suíte, armários planejados e garagem coberta.\nÁrea útil de 78 m². Aceita financiamento.',
    caracteristicas: ['Suíte', 'Armários planejados', 'Garagem coberta', 'Área de serviço'],
    fotos: 3,
  },
  {
    codigo: '108', tipo: 'Apartamento', finalidade: ['venda'], bairro: 'Jardim Paraíso',
    preco: 310000, selo: 'Aceita permuta', aceitaFinanciamento: true,
    quartos: 2, suites: 1, banheiros: 2, vagas: 1,
    areaConstruida: null, areaTerreno: null, areaUtil: 70, condominio: 350,
    descricao: 'Apartamento de 2 dormitórios, sendo 1 suíte, em prédio com portaria e área de lazer.\nPronto para morar.',
    caracteristicas: ['Suíte', 'Portaria', 'Área de lazer'],
    fotos: 2,
  },
];
