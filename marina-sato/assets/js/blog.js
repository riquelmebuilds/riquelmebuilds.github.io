// Lista do blog com filtro por tema
(function () {
  const lista = document.querySelector('[data-lista-blog]');
  const filtros = document.querySelector('[data-filtros]');
  if (!lista || !window.ARTIGOS) return;

  const artigos = [...window.ARTIGOS].sort((a, b) => b.data.localeCompare(a.data));
  lista.innerHTML = artigos.map(window.cardBlog).join('');
  [...lista.children].forEach((c, i) => { c.setAttribute('data-revela', ''); c.style.setProperty('--atraso', `${(i % 3) * 0.1}s`); });

  const temas = ['Todos', ...new Set(artigos.map(a => a.categoria))];
  filtros.innerHTML = temas.map((t, i) => `<button class="filtro${i === 0 ? ' ativo' : ''}" type="button" aria-pressed="${i === 0}" data-tema="${window.esc(t)}">${window.esc(t)}</button>`).join('');

  filtros.addEventListener('click', e => {
    const btn = e.target.closest('.filtro');
    if (!btn) return;
    filtros.querySelectorAll('.filtro').forEach(b => { const ativo = b === btn; b.classList.toggle('ativo', ativo); b.setAttribute('aria-pressed', String(ativo)); });
    const tema = btn.dataset.tema;
    lista.querySelectorAll('.card-blog').forEach(c => c.classList.toggle('some', tema !== 'Todos' && c.dataset.categoria !== tema));
  });

  window.revela();
})();
