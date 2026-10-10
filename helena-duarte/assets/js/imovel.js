// Página do imóvel: imovel.html?cod=XXXX
(function () {
  const { C, IMOVEIS, NEG, brl, creci, wa, tel, fotos, local, area, titulo, urlImovel, msgImovel, ICON, card, revelar } = window.MM;
  const el = document.getElementById('conteudo');
  const cod = new URLSearchParams(location.search).get('cod');
  const im = IMOVEIS.find((x) => x.codigo === cod) || IMOVEIS[0];

  document.title = `${titulo(im)} | Cód. ${im.codigo} | ${C.nome}`;
  const lista = fotos(im);
  const finTxt = im.finalidade.map((n) => NEG[n]).join(' e ');
  const venda = im.finalidade.includes('venda');
  const m2 = area(im);

  // ficha técnica (só o que existe)
  const ficha = [
    ['Código', im.codigo],
    ['Tipo', im.tipo],
    ['Finalidade', finTxt],
    ['Bairro', im.bairro],
    ['Cidade', `${C.cidade}/${C.uf}`],
    ['Dormitórios', im.quartos],
    ['Suítes', im.suites],
    ['Banheiros', im.banheiros],
    ['Vagas', im.vagas],
    ['Área construída', im.areaConstruida && `${im.areaConstruida} m²`],
    ['Área útil', im.areaUtil && `${im.areaUtil} m²`],
    ['Área do terreno', im.areaTerreno && `${im.areaTerreno.toLocaleString('pt-BR')} m²`],
    ['Condomínio', im.condominio && `${brl(im.condominio)}/mês`],
    ['Valor por m²', venda && m2 && brl(Math.round(im.preco / m2))],
    ['Financiamento', im.aceitaFinanciamento ? 'Aceita' : ''],
  ].filter(([, v]) => v);

  const destaques = [
    ['Dormitórios', im.quartos], ['Suítes', im.suites], ['Banheiros', im.banheiros],
    ['Vagas', im.vagas], ['Área', m2 && `${m2} m²`], ['Terreno', !m2 && im.areaTerreno && `${im.areaTerreno} m²`],
  ].filter(([, v]) => v);

  const relacionados = IMOVEIS
    .filter((x) => x.codigo !== im.codigo)
    .sort((a, b) => (b.bairro === im.bairro) - (a.bairro === im.bairro) || (b.tipo === im.tipo) - (a.tipo === im.tipo))
    .slice(0, 3);

  const urlAtual = location.href;
  const msgVisita = `Olá, ${C.primeiroNome}! Quero agendar uma visita ao imóvel cód. ${im.codigo} (${im.tipo.toLowerCase()}${im.bairro ? `, ${im.bairro}` : ''}).`;

  el.innerHTML = `
    <nav class="trilha" aria-label="Você está em">
      <a href="index.html">Início</a><span>›</span>
      <a href="imoveis.html?fin=${im.finalidade[0]}">Imóveis ${venda ? 'à venda' : 'para alugar'}</a><span>›</span>
      ${im.bairro ? `<a href="imoveis.html?bairro=${encodeURIComponent(im.bairro)}">${im.bairro}</a><span>›</span>` : ''}
      <span>Cód. ${im.codigo}</span>
    </nav>

    <div class="im-cabeca entrar">
      <div>
        <div class="im-selos">
          ${im.selo ? `<span class="im-selo im-selo--forte">${im.selo}</span>` : ''}
          <span class="im-selo">${finTxt}</span>
          <span class="im-selo">Cód. ${im.codigo}</span>
        </div>
        <h1>${titulo(im)}</h1>
        <p class="im-local">${ICON.pin} ${local(im)} - ${C.uf}</p>
      </div>
      <div class="im-preco">
        <span>${venda ? 'Valor de venda' : 'Valor'}</span>
        <strong>${brl(im.preco)}</strong>
        ${im.condominio ? `<small>Condomínio ${brl(im.condominio)}/mês</small>` : ''}
      </div>
    </div>

    <div class="im-grade">
      <div class="im-principal">
        <div class="galeria entrar">
          <div class="galeria__palco" id="palco">
            ${lista.map((src, i) => `<img src="${src}" alt="${titulo(im)}, foto ${i + 1}" class="${i === 0 ? 'ativa' : ''}" ${i ? 'loading="lazy"' : ''}>`).join('')}
            <button class="galeria__seta galeria__seta--ant" id="g-ant" aria-label="Foto anterior">‹</button>
            <button class="galeria__seta galeria__seta--prox" id="g-prox" aria-label="Próxima foto">›</button>
            <button class="galeria__cheia" id="g-cheia" aria-label="Ver em tela cheia">⤢</button>
            <span class="galeria__cont" id="g-cont">1 / ${lista.length}</span>
          </div>
          <div class="galeria__miniaturas" id="miniaturas">
            ${lista.map((src, i) => `<button class="${i === 0 ? 'ativa' : ''}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}
          </div>
          <p class="galeria__nota">Fotos ilustrativas.</p>
        </div>

        ${destaques.length ? `
        <ul class="im-destaques revelar">
          ${destaques.map(([r, v]) => `<li><strong>${v}</strong><span>${r}</span></li>`).join('')}
        </ul>` : ''}

        <section class="im-bloco revelar">
          <h2>Descrição do imóvel</h2>
          ${im.descricao.split('\n').map((p) => `<p>${p}</p>`).join('')}
        </section>

        ${im.caracteristicas.length ? `
        <section class="im-bloco revelar">
          <h2>Características</h2>
          <ul class="im-carac">${im.caracteristicas.map((c) => `<li>${c}</li>`).join('')}</ul>
        </section>` : ''}

        <section class="im-bloco revelar">
          <h2>Ficha técnica</h2>
          <dl class="im-ficha">${ficha.map(([r, v]) => `<div><dt>${r}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </section>

        ${venda ? `
        <section class="im-bloco revelar" id="simulador">
          <h2>Simule o financiamento</h2>
          <div class="sim">
            <label>Entrada<span><input type="range" id="s-entrada" min="10" max="80" step="5" value="20"> <b id="s-entrada-v"></b></span></label>
            <label>Prazo<span><input type="range" id="s-prazo" min="5" max="35" step="1" value="30"> <b id="s-prazo-v"></b></span></label>
            <label>Juros ao ano<span><input type="number" id="s-taxa" min="1" max="30" step="0.1" value="11.5"> %</span></label>
            <div class="sim__res">
              <span>Parcela estimada (tabela Price)</span>
              <strong id="s-parcela"></strong>
              <small id="s-detalhe"></small>
            </div>
          </div>
          <p class="sim__aviso">Simulação ilustrativa. Taxa, prazo e aprovação dependem do banco e do seu perfil. Eu te ajudo com a simulação oficial.</p>
        </section>` : ''}

        <section class="im-bloco revelar">
          <h2>Localização</h2>
          <div class="im-mapa"><iframe loading="lazy" title="Mapa da região" src="https://www.google.com/maps?q=${encodeURIComponent(`${im.bairro || ''} ${C.cidade} ${C.uf}`)}&output=embed"></iframe></div>
          <p class="im-mapa__nota">Localização aproximada do bairro. O endereço exato é informado no agendamento da visita.</p>
        </section>

        <div class="im-compartilhar revelar">
          <span>Compartilhar:</span>
          <a href="https://wa.me/?text=${encodeURIComponent(`${titulo(im)} - ${brl(im.preco)}: ${urlAtual}`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlAtual)}" target="_blank" rel="noopener" aria-label="Facebook">f</a>
          <button id="copiar" type="button">Copiar link</button>
        </div>
      </div>

      <aside class="im-lado">
        <div class="corretora revelar">
          <p class="corretora__rot">Corretora responsável</p>
          <img src="${C.foto}" alt="${C.nome}">
          <p class="corretora__nome">${C.nome}</p>
          <p class="corretora__creci">CRECI ${creci}</p>
          <a class="btn btn--acao btn--cheio" href="${wa(msgImovel(im))}" target="_blank" rel="noopener">${ICON.wa} Falar no WhatsApp</a>
          <a class="btn btn--linha btn--cheio" href="${wa(msgVisita)}" target="_blank" rel="noopener">Agendar visita</a>
          ${C.telefoneFixo ? `<a class="corretora__tel" href="${tel(C.telefoneFixo)}">${ICON.fone} ${C.telefoneFixo}</a>` : ''}
        </div>
        <form class="cartao-form revelar" id="form-interesse">
          <p class="cartao-form__titulo">Tenho interesse</p>
          <label>Seu nome<input name="nome" required autocomplete="name"></label>
          <label>Seu telefone<input name="tel" type="tel" autocomplete="tel"></label>
          <label>Mensagem<textarea name="msg" rows="4">Olá! Vi o imóvel cód. ${im.codigo} no site e gostaria de mais informações.</textarea></label>
          <button class="btn btn--acao btn--cheio">Enviar pelo WhatsApp</button>
        </form>
      </aside>
    </div>

    <section class="secao secao--sem-topo">
      <div class="imoveis__topo revelar">
        <div>
          <p class="sobretitulo">Você também pode gostar</p>
          <h2>${im.bairro ? `Imóveis em ${im.bairro} e região` : 'Outros imóveis'}</h2>
        </div>
        <a class="link-seta" href="imoveis.html">Ver todos os imóveis</a>
      </div>
      <div class="grade grade--3">${relacionados.map(card).join('')}</div>
    </section>
    <p class="legal-imovel">Imóvel anunciado com autorização do proprietário. Valores e disponibilidade sujeitos a confirmação.</p>`;

  // barra fixa no celular
  document.getElementById('barra-celular').innerHTML = `
    <div><span>${finTxt}</span><strong>${brl(im.preco)}</strong></div>
    <a class="btn btn--acao" href="${wa(msgImovel(im))}" target="_blank" rel="noopener">${ICON.wa} WhatsApp</a>`;

  // ---------- galeria ----------
  const imgs = [...document.querySelectorAll('#palco img')];
  const minis = [...document.querySelectorAll('#miniaturas button')];
  let atual = 0;
  const ir = (i) => {
    atual = (i + imgs.length) % imgs.length;
    imgs.forEach((img, k) => img.classList.toggle('ativa', k === atual));
    minis.forEach((b, k) => b.classList.toggle('ativa', k === atual));
    minis[atual].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    document.getElementById('g-cont').textContent = `${atual + 1} / ${imgs.length}`;
  };
  document.getElementById('g-ant').addEventListener('click', () => ir(atual - 1));
  document.getElementById('g-prox').addEventListener('click', () => ir(atual + 1));
  minis.forEach((b) => b.addEventListener('click', () => ir(Number(b.dataset.i))));

  // arrastar no celular
  let x0 = null;
  const palco = document.getElementById('palco');
  palco.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  palco.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ir(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  // tela cheia
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbMostra = () => {
    lbImg.classList.remove('entrou');
    lbImg.src = lista[atual];
    lbImg.alt = imgs[atual].alt;
    document.getElementById('lb-cont').textContent = `${atual + 1} / ${lista.length}`;
    requestAnimationFrame(() => lbImg.classList.add('entrou'));
  };
  const lbAbre = () => { lb.hidden = false; lbMostra(); requestAnimationFrame(() => lb.classList.add('aberto')); document.body.style.overflow = 'hidden'; };
  const lbFecha = () => { lb.classList.remove('aberto'); setTimeout(() => { lb.hidden = true; }, 250); document.body.style.overflow = ''; };
  document.getElementById('g-cheia').addEventListener('click', lbAbre);
  imgs.forEach((img) => img.addEventListener('click', lbAbre));
  document.getElementById('lb-fechar').addEventListener('click', lbFecha);
  document.getElementById('lb-ant').addEventListener('click', () => { ir(atual - 1); lbMostra(); });
  document.getElementById('lb-prox').addEventListener('click', () => { ir(atual + 1); lbMostra(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) lbFecha(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbFecha();
    if (e.key === 'ArrowLeft') { ir(atual - 1); lbMostra(); }
    if (e.key === 'ArrowRight') { ir(atual + 1); lbMostra(); }
  });

  // ---------- simulador ----------
  if (venda) {
    const $ = (id) => document.getElementById(id);
    const calc = () => {
      const ent = Number($('s-entrada').value) / 100;
      const anos = Number($('s-prazo').value);
      const taxa = Number($('s-taxa').value) / 100;
      const financiado = im.preco * (1 - ent);
      const i = Math.pow(1 + taxa, 1 / 12) - 1;
      const n = anos * 12;
      const parcela = i ? financiado * i / (1 - Math.pow(1 + i, -n)) : financiado / n;
      $('s-entrada-v').textContent = `${Math.round(ent * 100)}% (${brl(im.preco * ent)})`;
      $('s-prazo-v').textContent = `${anos} anos`;
      $('s-parcela').textContent = `${brl(Math.round(parcela))}/mês`;
      $('s-detalhe').textContent = `Valor financiado: ${brl(Math.round(financiado))} em ${n} parcelas`;
    };
    ['s-entrada', 's-prazo', 's-taxa'].forEach((id) => $(id).addEventListener('input', calc));
    calc();
  }

  // ---------- formulário e compartilhar ----------
  document.getElementById('form-interesse').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const texto = `Olá, ${C.primeiroNome}! Sou ${f.nome.value}${f.tel.value ? ` (${f.tel.value})` : ''}. ${f.msg.value}`;
    window.open(wa(texto), '_blank', 'noopener');
  });
  document.getElementById('copiar').addEventListener('click', (e) => {
    const b = e.currentTarget;
    const ok = () => { b.textContent = 'Link copiado'; setTimeout(() => { b.textContent = 'Copiar link'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(urlAtual).then(ok, ok); else ok();
  });

  revelar();
})();
