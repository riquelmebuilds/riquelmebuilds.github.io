// ============================================================
//  CONFIG DA PSICÓLOGA: tudo que muda de uma psicóloga pra outra fica aqui.
//  SITE DE PORTFÓLIO DA NEXTAGE: a psicóloga, o CRP e o consultório são
//  FICTÍCIOS. Fotos: Unsplash (licença livre, lista em fontes-das-fotos.md).
//  Antes de publicar, troque os contatos marcados com "TROCAR" pelos teus.
//
//  No HTML, qualquer elemento com data-psi="campo" recebe o valor daqui
//  (ex.: <span data-psi="nome">). O texto dentro do elemento é só reserva.
// ============================================================

window.PSI = {
  nome: 'Marina Sato',
  primeiroNome: 'Marina',
  profissao: 'Psicóloga clínica',
  crp: 'CRP 00/00000',               // fictício (de propósito, pra não bater com o CRP de ninguém)
  abordagem: 'Terapia Cognitivo-Comportamental',
  abordagemCurta: 'TCC',
  publico: 'Adultos, a partir de 18 anos',
  desde: '2015',

  bairro: 'Vila Mariana',
  cidade: 'São Paulo',
  uf: 'SP',
  enderecoPublico: 'Vila Mariana, São Paulo/SP',   // o endereço completo vai no agendamento
  online: 'todo o Brasil e brasileiros no exterior',   // aparece depois de "pra" (minúscula de propósito)
  horario: 'Segunda a sexta, das 8h às 20h',
  horarioExtra: 'Sábado de manhã, só online',
  duracao: '50 minutos',

  whatsapp: '5511900000000',          // TROCAR pelo teu WhatsApp (55 + DDD + número), pra quem testar o site falar contigo
  whatsappDisplay: '(11) 90000-0000', // TROCAR
  email: 'contato@exemplo.com.br',    // TROCAR pelo teu e-mail
  instagram: '',                      // vazio = não aparece (sem o @)

  // mensagem padrão do WhatsApp (botões sem mensagem própria usam essa)
  mensagemPadrao: 'Oi, Marina! Vim pelo site e queria saber sobre horários pra uma primeira conversa.',

  // aviso no rodapé: deixa claro pra quem visita que é um site de demonstração
  aviso: 'Site demonstrativo desenvolvido pela Nextage. A psicóloga, o CRP e o consultório são fictícios.',
};
