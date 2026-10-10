// Peças compartilhadas por todas as páginas: cabeçalho, rodapé, card de imóvel,
// WhatsApp e animações. Nenhum dado do corretor aqui (tudo vem do config.js).
(function () {
  const C = window.CORRETOR;
  const IMOVEIS = window.IMOVEIS || [];

  const NEG = { venda: 'Venda', locacao: 'Locação' };
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const creci = `${C.creci}-${C.creciTipo}`;
  const wa = (texto) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(texto)}`;
  const tel = (t) => `tel:+55${(t || '').replace(/\D/g, '')}`;
  const fotos = (im) => Array.from({ length: im.fotos || 0 }, (_, i) => `assets/img/imoveis/${im.codigo}/${i + 1}.jpg`);
  const local = (im) => [C.cidade, im.bairro].filter(Boolean).join(', ');
  const area = (im) => im.areaConstruida || im.areaUtil || null;
  const titulo = (im) => {
    const fin = im.finalidade.includes('venda') ? 'à venda' : 'para alugar';
    return `${im.tipo} ${fin} em ${im.bairro || C.cidade}`;
  };
  const urlImovel = (im) => `imovel.html?cod=${im.codigo}`;
  const msgImovel = (im) => `Olá, ${C.primeiroNome}! Vi no seu site o imóvel cód. ${im.codigo} (${im.tipo.toLowerCase()}${im.bairro ? `, ${im.bairro}` : ''}, ${brl(im.preco)}) e quero mais informações.`;
  const MSG = {
    procuro: `Olá, ${C.primeiroNome}! Vi seu site e estou procurando um imóvel em ${C.cidade}.`,
    tenho: `Olá, ${C.primeiroNome}! Vi seu site e tenho um imóvel para vender ou alugar.`,
    avaliacao: `Olá, ${C.primeiroNome}! Tenho um imóvel em ${C.cidade} e quero uma avaliação.`,
  };

  const ICON = {
    pin: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.6-.3Z"/></svg>',
    fone: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/></svg>',
  };

  // ---------- cabeçalho ----------
  const topo = document.getElementById('topo');
  if (topo) {
    topo.className = 'topo';
    topo.innerHTML = `
      <div class="wrap topo__in">
        <a class="marca" href="index.html">
          <img class="marca__foto" src="${C.foto}" alt="">
          <span><span class="marca__nome">${C.nome}</span><span class="marca__sub">${C.profissao} · CRECI ${creci}</span></span>
        </a>
        <nav class="topo__nav" id="nav">
          <a href="index.html">Início</a>
          <a href="imoveis.html?fin=venda">Comprar</a>
          <a href="imoveis.html?fin=locacao">Alugar</a>
          <a href="index.html#proprietario">Anunciar meu imóvel</a>
          <a href="index.html#sobre">Sobre</a>
          <a href="index.html#contato">Contato</a>
        </nav>
        <form class="busca-cod" id="busca-cod" role="search">
          <input name="cod" placeholder="Código" aria-label="Buscar imóvel pelo código" inputmode="numeric">
          <button aria-label="Buscar">${ICON.lupa}</button>
        </form>
        <button class="topo__menu" id="btn-menu" aria-label="Abrir menu">${ICON.menu}</button>
      </div>`;
    document.getElementById('btn-menu').addEventListener('click', () => topo.classList.toggle('aberto'));
    document.getElementById('busca-cod').addEventListener('submit', (e) => {
      e.preventDefault();
      const cod = e.target.cod.value.trim();
      if (!cod) return;
      const achou = IMOVEIS.find((im) => im.codigo === cod);
      location.href = achou ? urlImovel(achou) : `imoveis.html?nao=${encodeURIComponent(cod)}`;
    });
    const sombra = () => topo.classList.toggle('rolou', window.scrollY > 10);
    window.addEventListener('scroll', sombra, { passive: true });
    sombra();
  }

  // ---------- rodapé ----------
  const rodape = document.getElementById('rodape');
  if (rodape) {
    rodape.className = 'rodape';
    rodape.innerHTML = `
      <div class="wrap rodape__grade">
        <div>
          <p class="rodape__titulo">Sobre</p>
          <p class="rodape__nome">${C.nome}</p>
          <p>${C.profissao} · CRECI ${creci}</p>
          <p>Desde ${C.desde} em ${C.regiaoLonga}.</p>
          ${C.instagram || C.facebook ? `<p class="rodape__social">
            ${C.instagram ? `<a href="https://www.instagram.com/${C.instagram}/" target="_blank" rel="noopener">Instagram</a>` : ''}
            ${C.facebook ? `<a href="https://www.facebook.com/${C.facebook}/" target="_blank" rel="noopener">Facebook</a>` : ''}
          </p>` : ''}
        </div>
        <div>
          <p class="rodape__titulo">Menu</p>
          <ul class="rodape__menu">
            <li><a href="index.html">Início</a></li>
            <li><a href="imoveis.html?fin=venda">Imóveis à venda</a></li>
            <li><a href="imoveis.html?fin=locacao">Imóveis para locação</a></li>
            <li><a href="imoveis.html">Pesquisa completa</a></li>
            <li><a href="index.html#proprietario">Vender ou alugar meu imóvel</a></li>
            <li><a href="index.html#contato">Contato</a></li>
          </ul>
        </div>
        <div>
          <p class="rodape__titulo">Contato</p>
          <p>${ICON.pin} ${C.endereco}<br>CEP ${C.cep}</p>
          <p><a href="${wa(MSG.procuro)}" target="_blank" rel="noopener">WhatsApp ${C.whatsappDisplay}</a></p>
          ${C.telefoneFixo ? `<p><a href="${tel(C.telefoneFixo)}">Fixo ${C.telefoneFixo}</a></p>` : ''}
          <p><a href="mailto:${C.email}">${C.email}</a></p>
        </div>
      </div>
      <div class="wrap rodape__legal">
        <p>Imóveis anunciados com autorização dos proprietários. Valores e disponibilidade sujeitos a confirmação.</p>
        ${C.aviso ? `<p>${C.aviso}</p>` : ''}
        <p>© ${new Date().getFullYear()} ${C.nome} · ${C.profissao} · CRECI ${creci}</p>
      </div>`;
  }

  // ---------- WhatsApp flutuante ----------
  if (!document.querySelector('.wa-flutuante')) {
    const a = document.createElement('a');
    a.className = 'wa-flutuante';
    a.href = wa(MSG.procuro);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chamar no WhatsApp');
    a.innerHTML = ICON.wa.replace('width="20" height="20"', 'width="28" height="28"');
    document.body.appendChild(a);
  }

  // ---------- textos e fotos declarados no HTML ----------
  if (C.corAcao) document.documentElement.style.setProperty('--acao', C.corAcao);
  const valores = { ...C, creciCompleto: creci };
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const v = valores[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('img[data-foto]').forEach((img) => {
    img.src = C.foto;
    img.alt = `${C.nome}, ${C.profissao.toLowerCase()} em ${C.cidade}`;
  });

  // ---------- links de WhatsApp declarados no HTML ----------
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = wa(MSG[a.dataset.wa]);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // ---------- card de imóvel ----------
  const attrsCard = (im) => [
    ['Dormitórios', im.quartos], ['Suítes', im.suites], ['Banheiros', im.banheiros],
    ['Vagas', im.vagas], ['Área', area(im) ? `${area(im)} m²` : ''],
  ].filter(([, v]) => v).slice(0, 3);

  const card = (im) => {
    const capa = fotos(im)[0];
    const negocio = im.finalidade.map((n) => NEG[n]).join(' e ');
    const lista = attrsCard(im);
    return `
      <article class="card revelar" data-finalidade="${im.finalidade.join(' ')}">
        <a class="card__foto" href="${urlImovel(im)}">
          ${capa ? `<img src="${capa}" alt="${titulo(im)}" loading="lazy">` : '<span class="card__semfoto">Foto do imóvel</span>'}
          ${im.selo ? `<span class="card__selo">${im.selo}</span>` : ''}
          <span class="card__preco">${brl(im.preco)}<small>Cód. ${im.codigo}</small></span>
          <span class="card__ver">Ver imóvel</span>
        </a>
        <a class="card__corpo" href="${urlImovel(im)}">
          <h3>${im.tipo}, ${negocio}</h3>
          <p class="card__local">${ICON.pin} ${local(im)}</p>
          <p class="card__desc">${im.descricao.split('\n')[0]}</p>
        </a>
        ${lista.length ? `<ul class="card__attr">${lista.map(([r, v]) => `<li><span>${r}</span><strong>${v}</strong></li>`).join('')}</ul>` : '<div class="card__attr card__attr--vazio"></div>'}
      </article>`;
  };

  // ---------- animação de entrada ao rolar ----------
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((itens) => {
        itens.forEach((it) => {
          if (it.isIntersecting) { it.target.classList.add('visivel'); io.unobserve(it.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;
  const revelar = (raiz = document) => {
    raiz.querySelectorAll('.revelar:not(.visivel)').forEach((el, i) => {
      el.style.setProperty('--atraso', `${Math.min(i % 4, 3) * 80}ms`);
      if (io) io.observe(el); else el.classList.add('visivel');
    });
  };

  window.MM = { C, IMOVEIS, NEG, brl, creci, wa, tel, fotos, local, area, titulo, urlImovel, msgImovel, MSG, ICON, card, revelar };
  document.addEventListener('DOMContentLoaded', () => revelar());
})();
