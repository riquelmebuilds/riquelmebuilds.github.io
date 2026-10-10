// Formulário de contato: valida e abre o WhatsApp com a mensagem montada.
// Nada é guardado no site: os dados vão direto pra conversa no WhatsApp.
(function () {
  const form = document.querySelector('[data-form-contato]');
  if (!form) return;
  const P = window.PSI || {};
  const status = form.querySelector('[data-form-status]');

  const marca = (campo, ok) => campo.closest('.campo').classList.toggle('invalido', !ok);

  form.nome.addEventListener('input', () => marca(form.nome, true));
  form.aceite.addEventListener('change', () => marca(form.aceite, true));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const okNome = nome.length > 0;
    const okAceite = form.aceite.checked;
    marca(form.nome, okNome);
    marca(form.aceite, okAceite);
    if (!okNome) { form.nome.focus(); return; }
    if (!okAceite) { form.aceite.focus(); return; }

    const linhas = [
      `Oi, ${P.primeiroNome}! Meu nome é ${nome}. Vim pelo site e queria agendar uma primeira conversa.`,
      '',
      `Atendimento: ${form.modalidade.value}`,
      `Melhor período: ${form.periodo.value}`,
    ];
    const msg = form.mensagem.value.trim();
    if (msg) linhas.push('', msg);

    const url = window.linkWhats(linhas.join('\n'));
    // sem 'noopener' nas features: com ele o window.open sempre devolve null
    const janela = window.open(url, '_blank');
    if (janela) janela.opener = null;
    // DOM em vez de innerHTML: o texto digitado entra na URL e nunca vira HTML
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = janela ? 'Clique aqui' : 'Clique aqui pra abrir o WhatsApp';
    status.textContent = janela ? 'Abrimos o WhatsApp numa nova aba. Não abriu? ' : 'Seu navegador bloqueou a nova aba. ';
    status.append(link, '.');
  });
})();
