// Página de artigo: lê ?a=slug e monta o texto a partir de artigos.js
(function () {
  const alvo = document.querySelector('[data-artigo]');
  if (!alvo || !window.ARTIGOS) return;
  const P = window.PSI || {};
  const esc = window.esc;

  const slug = new URLSearchParams(location.search).get('a');
  const artigo = window.ARTIGOS.find(a => a.slug === slug);

  if (!artigo) {
    alvo.innerHTML = `
      <section class="pagina-topo">
        <div class="container">
          <span class="olho">Blog</span>
          <h1>Esse texto <em>não foi encontrado.</em></h1>
          <p class="lead">Talvez o endereço tenha mudado. Os outros textos continuam no blog.</p>
          <p style="margin-top:28px"><a class="botao" href="blog.html">Ver todos os textos</a></p>
        </div>
      </section>`;
    return;
  }

  document.title = `${artigo.titulo} · ${P.nome}`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', artigo.resumo);

  const relacionados = window.ARTIGOS.filter(a => a.slug !== artigo.slug)
    .sort((a, b) => (b.categoria === artigo.categoria) - (a.categoria === artigo.categoria) || b.data.localeCompare(a.data))
    .slice(0, 3);

  alvo.innerHTML = `
    <article>
      <header class="artigo-topo container">
        <p class="migalha"><a href="index.html">Início</a> / <a href="blog.html">Blog</a> / ${esc(artigo.categoria)}</p>
        <div class="card-blog__meta"><span class="tag">${esc(artigo.categoria)}</span><span>${window.fmtData(artigo.data)}</span><span>·</span><span>${artigo.leitura} min de leitura</span></div>
        <h1>${esc(artigo.titulo)}</h1>
      </header>
      <div class="artigo-capa" data-revela="zoom"><img src="${esc(artigo.capa)}" alt="${esc(artigo.capaAlt || '')}"></div>
      <div class="artigo-corpo">
        ${artigo.conteudo}
        <p class="artigo-aviso">Este texto é informativo e não substitui uma avaliação com psicólogo ou médico. Se você está em sofrimento intenso, ligue 188 (CVV, gratuito, 24 horas).</p>
        <div class="autor-box">
          <img src="assets/img/marina.jpg" alt="${esc(P.nome)}">
          <div>
            <strong>${esc(P.nome)}</strong>
            <p>${esc(P.profissao)} · ${esc(P.crp)} · ${esc(P.abordagem)}</p>
            <a class="link-seta" href="sobre.html">Conhecer a autora <span>→</span></a>
          </div>
        </div>
      </div>
    </article>

    <section class="secao secao--alt">
      <div class="container">
        <div class="blog-topo">
          <div class="cabeca-secao" data-revela><span class="olho">Continue lendo</span><h2>Outros <em>textos</em></h2></div>
          <a class="link-seta" href="blog.html" data-revela>Ver todos <span>→</span></a>
        </div>
        <div class="cards-blog">${relacionados.map(window.cardBlog).join('')}</div>
      </div>
    </section>

    <section class="secao secao--escura chamada">
      <div class="container" data-revela>
        <h2>Quer conversar <em>sobre isso?</em></h2>
        <p>Se esse texto falou com você, a terapia pode ser um bom lugar pra continuar essa conversa.</p>
        <a class="botao botao--grande" data-wa="Oi, Marina! Li o texto &quot;${esc(artigo.titulo)}&quot; e queria saber sobre horários.">Agendar uma conversa</a>
      </div>
    </section>`;

  alvo.querySelectorAll('.cards-blog > *').forEach((c, i) => { c.setAttribute('data-revela', ''); c.style.setProperty('--atraso', `${i * 0.1}s`); });
  window.ligaWhats(alvo);
  window.revela();

  // barra de progresso da leitura
  const barra = document.querySelector('.barra-leitura');
  const corpo = alvo.querySelector('.artigo-corpo');
  if (barra && corpo) {
    const atualiza = () => {
      const r = corpo.getBoundingClientRect();
      const total = r.height - innerHeight;
      const feito = Math.min(Math.max(-r.top / (total > 0 ? total : 1), 0), 1);
      barra.style.width = `${feito * 100}%`;
    };
    window.addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }
})();
