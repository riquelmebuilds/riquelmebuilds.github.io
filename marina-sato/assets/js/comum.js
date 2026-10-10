// ============================================================
//  COMUM: cabeçalho, rodapé, dados da config, WhatsApp, animações
//  e FAQ. Roda em todas as páginas (depois do config.js).
// ============================================================

(function () {
  const P = window.PSI || {};
  const pagina = document.body.dataset.pagina || '';

  const ICONES = {
    simbolo: '<svg class="marca__simbolo" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="20" cy="20" r="18.6"/><path d="M20 31.5V17.5"/><path d="M20 23c-5.2 0-8.4-3.4-8.4-8.6 5.2 0 8.4 3.4 8.4 8.6z"/><path d="M20 19.4c0-4.6 2.9-7.6 7.6-7.6 0 4.6-2.9 7.6-7.6 7.6z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></svg>',
    alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.4-9.6C1.3 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.6 0 5.7 3.5 4.4 6.9C19.5 16.4 12 21 12 21z"/></svg>',
  };
  window.ICONES = ICONES;

  const LINKS = [
    { href: 'index.html', rotulo: 'Início', id: 'inicio' },
    { href: 'sobre.html', rotulo: 'Sobre', id: 'sobre' },
    { href: 'atendimento.html', rotulo: 'Atendimento', id: 'atendimento' },
    { href: 'blog.html', rotulo: 'Blog', id: 'blog' },
    { href: 'contato.html', rotulo: 'Contato', id: 'contato' },
  ];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.esc = esc;

  const linkWhats = msg => `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(msg || P.mensagemPadrao || '')}`;
  window.linkWhats = linkWhats;

  const marca = () => `
    <a class="marca" href="index.html" aria-label="${esc(P.nome)}, página inicial">
      ${ICONES.simbolo}
      <span class="marca__texto">
        <span class="marca__nome">${esc(P.nome)}</span>
        <span class="marca__sub"><span class="marca__prof">${esc(P.profissao)} · </span>${esc(P.crp)}</span>
      </span>
    </a>`;

  // ---------- Cabeçalho ----------
  const topo = document.querySelector('[data-topo]');
  if (topo) {
    topo.classList.add('topo');
    topo.innerHTML = `
      <div class="container topo__in">
        ${marca()}
        <nav class="menu" id="menu" aria-label="Principal">
          <ul class="menu__links">
            ${LINKS.map(l => `<li><a href="${l.href}"${l.id === pagina ? ' aria-current="page"' : ''}>${l.rotulo}</a></li>`).join('')}
          </ul>
          <a class="botao" data-wa>Agendar conversa</a>
        </nav>
        <button class="hamburguer" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span></button>
      </div>`;

    const btn = topo.querySelector('.hamburguer');
    const fecha = () => { document.body.classList.remove('menu-aberto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menu'); };
    btn.addEventListener('click', () => {
      const abre = !document.body.classList.contains('menu-aberto');
      document.body.classList.toggle('menu-aberto', abre);
      btn.setAttribute('aria-expanded', String(abre));
      btn.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
    });
    topo.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', fecha));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecha(); });
  }

  // ---------- Rodapé ----------
  const rodape = document.querySelector('[data-rodape]');
  if (rodape) {
    rodape.classList.add('rodape');
    const ano = new Date().getFullYear();
    rodape.innerHTML = `
      <div class="container">
        <div class="rodape__grid">
          <div>
            ${marca()}
            <p>${esc(P.abordagem)} pra ${esc((P.publico || '').toLowerCase())}. Presencial na ${esc(P.bairro)} e online.</p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>${LINKS.map(l => `<li><a href="${l.href}">${l.rotulo}</a></li>`).join('')}</ul>
          </div>
          <div>
            <h4>Atendimento</h4>
            <ul>
              <li>${esc(P.horario)}</li>
              ${P.horarioExtra ? `<li>${esc(P.horarioExtra)}</li>` : ''}
              <li>${esc(P.enderecoPublico)}</li>
              <li>Online pra ${esc(P.online)}</li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a data-wa>WhatsApp ${esc(P.whatsappDisplay)}</a></li>
              <li><a href="mailto:${esc(P.email)}">${esc(P.email)}</a></li>
              ${P.instagram ? `<li><a href="https://instagram.com/${esc(P.instagram)}" target="_blank" rel="noopener">Instagram @${esc(P.instagram)}</a></li>` : ''}
            </ul>
          </div>
        </div>
        <div class="rodape__crise">
          ${ICONES.alerta}
          <p><strong>Precisa de ajuda agora?</strong> Este site não faz atendimento de urgência. Se você está em sofrimento intenso ou pensando em tirar a própria vida, ligue <a href="tel:188">188</a> (CVV, gratuito, 24 horas) ou procure o pronto-socorro mais próximo. Em emergência médica, ligue <a href="tel:192">192</a> (SAMU).</p>
        </div>
        <div class="rodape__base">
          <p>© ${ano} ${esc(P.nome)} · ${esc(P.profissao)} · ${esc(P.crp)} · <a href="privacidade.html">Política de privacidade</a></p>
          ${P.aviso ? `<p>${esc(P.aviso)}</p>` : ''}
        </div>
      </div>`;
  }

  // ---------- Dados da config no HTML ----------
  document.querySelectorAll('[data-psi]').forEach(el => {
    const v = P[el.dataset.psi];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-se]').forEach(el => { if (!P[el.dataset.se]) el.remove(); });
  document.querySelectorAll('[data-email]').forEach(el => { el.href = `mailto:${P.email}`; if (!el.textContent.trim()) el.textContent = P.email; });

  // ---------- WhatsApp ----------
  const ligaWhats = (raiz = document) => raiz.querySelectorAll('a[data-wa]').forEach(a => {
    a.href = linkWhats(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  window.ligaWhats = ligaWhats;

  if (pagina !== 'contato') {
    const flut = document.createElement('a');
    flut.className = 'wa-flutuante';
    flut.setAttribute('data-wa', '');
    flut.setAttribute('aria-label', 'Conversar no WhatsApp');
    flut.innerHTML = `${ICONES.whatsapp}<span class="wa-flutuante__dica">Agendar pelo WhatsApp</span>`;
    document.body.appendChild(flut);
  }
  ligaWhats();

  // ---------- Rolagem: cabeçalho, botão flutuante, paralaxe ----------
  const flutuante = document.querySelector('.wa-flutuante');
  const fundos = [...document.querySelectorAll('[data-paralaxe]')];
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pendente = false;
  const aoRolar = () => {
    const y = window.scrollY;
    if (topo) topo.classList.toggle('rolou', y > 10);
    if (flutuante) flutuante.classList.toggle('visivel', y > 260);
    if (!semMovimento) fundos.forEach(f => {
      const r = f.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const progresso = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      f.style.transform = `translate3d(0, ${progresso * -60}px, 0)`;
    });
    pendente = false;
  };
  window.addEventListener('scroll', () => { if (!pendente) { pendente = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  aoRolar();

  // ---------- Animações de entrada ----------
  document.querySelectorAll('[data-revela-filhos]').forEach(pai => {
    [...pai.children].forEach((filho, i) => {
      if (!filho.hasAttribute('data-revela')) filho.setAttribute('data-revela', pai.dataset.revelaFilhos || '');
      filho.style.setProperty('--atraso', `${(i % 6) * 0.09}s`);
    });
  });
  const revela = () => {
    const els = document.querySelectorAll('[data-revela]:not(.visto)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visto')); return; }
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visto'); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => obs.observe(e));
  };
  window.revela = revela;

  // ---------- FAQ (sanfona) ----------
  document.querySelectorAll('.faq__item').forEach((item, i) => {
    const btn = item.querySelector('.faq__pergunta');
    const resp = item.querySelector('.faq__resposta');
    if (!btn || !resp) return;
    resp.id = resp.id || `faq-${i}`;
    btn.setAttribute('aria-controls', resp.id);
    btn.setAttribute('aria-expanded', item.classList.contains('aberto') ? 'true' : 'false');
    if (!btn.querySelector('.faq__icone')) btn.insertAdjacentHTML('beforeend', '<span class="faq__icone" aria-hidden="true"></span>');
    btn.addEventListener('click', () => {
      const abre = !item.classList.contains('aberto');
      item.classList.toggle('aberto', abre);
      btn.setAttribute('aria-expanded', String(abre));
    });
  });

  // ---------- Cards do blog ----------
  const fmtData = iso => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  window.fmtData = fmtData;
  window.cardBlog = a => `
    <a class="card-blog" href="artigo.html?a=${encodeURIComponent(a.slug)}" data-categoria="${esc(a.categoria)}">
      <div class="card-blog__foto"><img src="${esc(a.capa)}" alt="${esc(a.capaAlt || '')}" loading="lazy"></div>
      <div class="card-blog__meta"><span class="tag">${esc(a.categoria)}</span><span>${a.leitura} min de leitura</span></div>
      <h3>${esc(a.titulo)}</h3>
      <p>${esc(a.resumo)}</p>
    </a>`;
  const ultimos = document.querySelector('[data-blog-ultimos]');
  if (ultimos && window.ARTIGOS) {
    const n = +ultimos.dataset.blogUltimos || 3;
    ultimos.innerHTML = [...window.ARTIGOS].sort((a, b) => b.data.localeCompare(a.data)).slice(0, n).map(window.cardBlog).join('');
    ultimos.setAttribute('data-revela-filhos', '');
    [...ultimos.children].forEach((c, i) => { c.setAttribute('data-revela', ''); c.style.setProperty('--atraso', `${i * 0.1}s`); });
  }

  document.querySelectorAll('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

  revela();
  window.addEventListener('load', () => document.body.classList.add('carregado'));
})();
