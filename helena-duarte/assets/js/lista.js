// Página de listagem com filtros. Os filtros ficam na URL (dá pra compartilhar a busca).
(function () {
  const { C, IMOVEIS, card, revelar } = window.MM;
  const params = new URLSearchParams(location.search);
  const form = document.getElementById('filtros');
  const grade = document.getElementById('grade');
  const ordem = document.getElementById('ordem');
  let quartos = params.get('quartos') || '';

  // opções de tipo e bairro a partir dos imóveis
  const unicos = (campo) => [...new Set(IMOVEIS.map((im) => im[campo]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  document.getElementById('f-tipo').insertAdjacentHTML('beforeend', unicos('tipo').map((v) => `<option>${v}</option>`).join(''));
  document.getElementById('f-bairro').insertAdjacentHTML('beforeend', unicos('bairro').map((v) => `<option>${v}</option>`).join(''));

  // preenche os filtros com o que veio na URL
  ['fin', 'tipo', 'bairro', 'max'].forEach((k) => { if (params.get(k)) form[k].value = params.get(k); });
  if (params.get('ordem')) ordem.value = params.get('ordem');

  const nao = params.get('nao');
  if (nao) {
    const aviso = document.getElementById('aviso-cod');
    aviso.hidden = false;
    aviso.textContent = `Não encontrei o código ${nao} entre os imóveis do site. Veja os disponíveis abaixo ou me chame no WhatsApp.`;
  }

  const chips = document.querySelectorAll('#f-quartos button');
  const marcaChip = () => chips.forEach((b) => b.classList.toggle('ativo', b.dataset.v === quartos));
  marcaChip();
  chips.forEach((b) => b.addEventListener('click', () => { quartos = b.dataset.v; marcaChip(); aplicar(); }));

  function aplicar() {
    const f = { fin: form.fin.value, tipo: form.tipo.value, bairro: form.bairro.value, max: Number(form.max.value) || 0 };
    let lista = IMOVEIS.filter((im) =>
      (!f.fin || im.finalidade.includes(f.fin)) &&
      (!f.tipo || im.tipo === f.tipo) &&
      (!f.bairro || im.bairro === f.bairro) &&
      (!quartos || (im.quartos || 0) >= Number(quartos)) &&
      (!f.max || im.preco <= f.max));
    if (ordem.value === 'menor') lista = [...lista].sort((a, b) => a.preco - b.preco);
    if (ordem.value === 'maior') lista = [...lista].sort((a, b) => b.preco - a.preco);

    // títulos
    const fin = f.fin === 'venda' ? 'à venda' : f.fin === 'locacao' ? 'para alugar' : '';
    const tipo = f.tipo ? `${f.tipo}s`.replace('Casa térreas', 'Casas térreas') : 'Imóveis';
    document.getElementById('lista-titulo').textContent = `${tipo} ${fin} em ${f.bairro || C.cidade}`.replace(/\s+/g, ' ');
    document.getElementById('trilha-atual').textContent = f.bairro || (fin ? `Imóveis ${fin}` : 'Imóveis');
    document.getElementById('lista-qtd').textContent = `${lista.length} ${lista.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
    document.getElementById('lista-contagem').textContent = `${C.regiaoLonga} · com ${C.nome}, CRECI ${window.MM.creci}`;

    grade.classList.add('trocando');
    setTimeout(() => {
      grade.innerHTML = lista.map(card).join('');
      document.getElementById('vazio').hidden = lista.length > 0;
      grade.classList.remove('trocando');
      revelar(grade);
    }, 150);

    // URL acompanha os filtros
    const q = new URLSearchParams();
    if (f.fin) q.set('fin', f.fin);
    if (f.tipo) q.set('tipo', f.tipo);
    if (f.bairro) q.set('bairro', f.bairro);
    if (quartos) q.set('quartos', quartos);
    if (f.max) q.set('max', f.max);
    if (ordem.value !== 'rec') q.set('ordem', ordem.value);
    history.replaceState(null, '', `${location.pathname}${q.toString() ? `?${q}` : ''}`);
  }

  form.addEventListener('change', aplicar);
  ordem.addEventListener('change', aplicar);
  document.getElementById('limpar').addEventListener('click', () => {
    form.reset();
    quartos = '';
    marcaChip();
    ordem.value = 'rec';
    aplicar();
  });

  aplicar();
})();
