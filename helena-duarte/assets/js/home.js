// Página inicial.
(function () {
  const { C, IMOVEIS, brl, creci, wa, tel, ICON, card, revelar } = window.MM;

  // herói
  document.getElementById('foto-heroi').src = C.fotoHeroi;
  if (C.google) {
    document.getElementById('nota-google').innerHTML = `<strong>${C.google.nota}</strong><span>Google</span>`;
  }

  // busca: tipos e bairros vêm dos imóveis cadastrados
  const unicos = (campo) => [...new Set(IMOVEIS.map((im) => im[campo]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const opcoes = (id, lista) => {
    document.getElementById(id).insertAdjacentHTML('beforeend', lista.map((v) => `<option>${v}</option>`).join(''));
  };
  opcoes('busca-tipo', unicos('tipo'));
  opcoes('busca-bairro', unicos('bairro'));
  document.getElementById('busca').addEventListener('submit', (e) => {
    // remove campos vazios da URL
    [...e.target.elements].forEach((el) => { if (el.name && !el.value) el.disabled = true; });
  });

  // barra de confiança
  const fatos = [
    ['CRECI', creci],
    ['No mercado', `desde ${C.desde}`],
    ['Google', `nota ${C.google.nota} (${C.google.avaliacoes} avaliações)`],
    ['Atuação', 'residencial, comercial e rural'],
  ];
  document.getElementById('barra').innerHTML = fatos.map(([r, v]) => `<p><span>${r}</span>${v}</p>`).join('');

  // destaques + filtro
  const grade = document.getElementById('grade');
  grade.innerHTML = IMOVEIS.slice(0, 8).map(card).join('');
  document.querySelectorAll('.filtro').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.filtro').forEach((x) => x.classList.toggle('ativo', x === b));
      const f = b.dataset.filtro;
      grade.classList.add('trocando');
      setTimeout(() => {
        grade.querySelectorAll('.card').forEach((c) => {
          c.hidden = f !== 'todos' && !c.dataset.finalidade.split(' ').includes(f);
        });
        grade.classList.remove('trocando');
      }, 180);
    });
  });

  // bairros
  const porBairro = {};
  IMOVEIS.forEach((im) => { if (im.bairro) porBairro[im.bairro] = (porBairro[im.bairro] || 0) + 1; });
  document.getElementById('bairros').innerHTML = Object.entries(porBairro)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([b, n]) => `
      <a class="bairro revelar" href="imoveis.html?bairro=${encodeURIComponent(b)}">
        <strong>${b}</strong>
        <span>${C.cidade} - ${C.uf}</span>
        <em>${n} ${n > 1 ? 'imóveis' : 'imóvel'}</em>
      </a>`).join('');

  // formulário de avaliação -> WhatsApp
  document.getElementById('form-avaliacao').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const texto = `Olá, ${C.primeiroNome}! Sou ${f.nome.value}. Tenho um imóvel (${f.tipo.value.toLowerCase()}${f.bairro.value ? `, ${f.bairro.value}` : ''}) e quero ${f.fin.value.toLowerCase()}. Pode fazer uma avaliação?`;
    window.open(wa(texto), '_blank', 'noopener');
  });

  // sobre
  document.getElementById('bio').innerHTML = C.bio.map((p) => `<p>${p}</p>`).join('');
  document.getElementById('servicos').innerHTML = C.servicos.map((s) => `<li>${s}</li>`).join('');
  document.getElementById('depo').innerHTML = `
    <p>“${C.depoimento.texto}”</p>
    <cite>${C.depoimento.autor} · ${C.depoimento.origem}</cite>`;

  // contato
  document.getElementById('ic-wa').innerHTML = ICON.wa;
  document.getElementById('ic-fone').innerHTML = ICON.fone;
  if (C.telefoneFixo) document.getElementById('link-fixo').href = tel(C.telefoneFixo);
  else document.getElementById('link-fixo').remove();
  document.getElementById('link-email').href = `mailto:${C.email}`;
  document.getElementById('mapa').src = `https://www.google.com/maps?q=${encodeURIComponent(C.endereco)}&output=embed`;
  document.getElementById('form-contato').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    window.open(wa(`Olá, ${C.primeiroNome}! Sou ${f.nome.value}. ${f.msg.value}`), '_blank', 'noopener');
  });

  revelar();
})();
