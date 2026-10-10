/* Vemax Usinagem — interações */
(function () {
  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mídia ausente vira marcador ---------- */
  document.querySelectorAll('.media').forEach((box) => {
    const el = box.querySelector('img, video');
    if (!el) { box.classList.add('is-missing'); return; }
    const miss = () => box.classList.add('is-missing');
    if (el.tagName === 'IMG') {
      if (el.complete && el.naturalWidth === 0) miss();
      el.addEventListener('error', miss);
    } else {
      const src = el.querySelector('source');
      (src || el).addEventListener('error', miss);
      if (el.networkState === 3) miss();
      // vídeos mudos de fundo tocam mesmo com 'reduzir movimento' (comum em PC de empresa)
    }
  });

  /* ---------- rail sobre o hero ---------- */
  const rail = document.querySelector('.rail');
  const hero = document.querySelector('.hero');
  const updateRail = () => {
    if (!rail || !hero) return;
    const limit = hero.offsetHeight - (window.innerWidth <= 767 ? 64 : 80);
    rail.classList.toggle('is-over-hero', window.scrollY < limit);
  };
  updateRail();
  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);

  /* ---------- barra de seções (aparece ao rolar, como no site da Embraer) ---------- */
  const subbar = document.querySelector('.subbar');
  if (subbar && hero) {
    const upd = () => subbar.classList.toggle('is-on', window.scrollY > hero.offsetHeight - 90);
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
  }

  /* ---------- mapa: só captura o mouse depois do clique (não trava a rolagem) ---------- */
  document.querySelectorAll('.mapbox').forEach((m) => {
    m.addEventListener('click', () => m.classList.add('is-active'));
    m.addEventListener('mouseleave', () => m.classList.remove('is-active'));
  });

  /* ---------- menu ---------- */
  const btn = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  const scrim = document.querySelector('.menu-scrim');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? btn.dataset.close : btn.dataset.open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  };
  if (btn && menu) {
    btn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    scrim && scrim.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); btn.focus(); }
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }

  /* ---------- serviços: troca de foto ---------- */
  const svcRows = document.querySelectorAll('.svc-row');
  const svcMedia = document.querySelectorAll('.svc-media .media');
  let svcCurrent = 0;
  const activate = (i) => {
    svcRows.forEach((r, j) => r.classList.toggle('is-active', i === j));
    svcMedia.forEach((m, j) => {
      m.classList.toggle('is-active', i === j);
      const v = m.querySelector('video');
      if (v) { if (i === j) v.play().catch(() => {}); else v.pause(); }
    });
    svcCurrent = i;
  };
  const svcBox = document.querySelector('.svc-media');
  if (svcBox && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) activate(svcCurrent);
      else svcMedia.forEach((m) => { const v = m.querySelector('video'); if (v) v.pause(); });
    }), { threshold: 0.2 }).observe(svcBox);
  }
  svcRows.forEach((row, i) => {
    row.addEventListener('mouseenter', () => activate(i));
    row.addEventListener('focus', () => activate(i));
  });

  /* ---------- galeria ---------- */
  document.querySelectorAll('.gallery').forEach((g) => {
    const track = g.querySelector('.gallery__track');
    const slides = track.children;
    const dotsBox = g.querySelector('.gallery__dots');
    let index = 0, timer = null, paused = false, galleryVisible = false;
    const dots = Array.from(slides).map((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Foto ' + (i + 1));
      d.addEventListener('click', () => { paused = true; go(i); stop(); });
      dotsBox.appendChild(d);
      return d;
    });
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === index)));
      Array.from(slides).forEach((sl, j) => {
        const v = sl.querySelector('video');
        if (v) { if (j === index && galleryVisible) v.play().catch(() => {}); else v.pause(); }
      });
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { if (!reduced && !paused && !timer) timer = setInterval(() => go(index + 1), 5000); };
    g.addEventListener('pointerdown', () => { paused = true; stop(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { galleryVisible = es[0].isIntersecting; go(index); }).observe(g);
    }
    go(0); start();
  });

  /* ---------- reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- formulários pelo WhatsApp ---------- */
  document.querySelectorAll('form[data-whatsapp]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [form.dataset.intro || 'Olá, Vemax!'];
      form.querySelectorAll('[name]').forEach((f) => {
        const v = String(data.get(f.name) || '').trim();
        if (v) lines.push('*' + (f.dataset.label || f.name) + ':* ' + v);
      });
      const url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------- formulários ainda sem destino configurado ---------- */
  document.querySelectorAll('form[data-pending]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form__status');
      if (status) status.textContent = form.dataset.msg;
    });
  });

  /* ano no rodapé */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();


/* ---------- tela de apresentação (home) ---------- */
(function () {
  const html = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro || !html.classList.contains('intro-on')) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !intro.animate;
  const $ = (s) => intro.querySelector(s);
  const behind = Array.from(document.body.children).filter((el) => el !== intro && el.tagName !== 'SCRIPT');
  behind.forEach((el) => el.setAttribute('inert', ''));
  intro.focus({ preventScroll: true });
  let done = false;

  // título letra a letra (palavras não quebram no meio)
  const title = intro.querySelector('.intro__title');
  const chars = [];
  intro.querySelectorAll('.intro__l').forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((w, i) => {
      const ws = document.createElement('span');
      ws.className = 'intro__w';
      [...w].forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'intro__c';
        c.textContent = ch;
        ws.appendChild(c);
        chars.push(c);
      });
      line.appendChild(ws);
      if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });
  intro.querySelector('.intro__title').setAttribute('aria-label', Array.from(intro.querySelectorAll('.intro__l')).map((l) => l.textContent).join(' '));

  const E_OUT = 'cubic-bezier(.22,.61,.36,1)';
  const E_IO = 'cubic-bezier(.76,0,.24,1)';
  const anim = (el, kf, o) => el.animate(kf, Object.assign({ fill: 'both', easing: E_OUT }, o));

  // serra circular atravessando a chapa, com faísca saindo do corte
  const saw = (cy, dur) => {
    const blade = $('.intro__blade'), kerf = $('.intro__kerf'), cv = $('.intro__sparks');
    const vw = window.innerWidth, vh = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = vw * dpr; cv.height = vh * dpr;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    const R = blade.offsetWidth / 2;
    blade.style.top = cy + 'px';
    kerf.style.top = cy + 'px';
    const sparks = [];
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    let t0 = null;
    const frame = (now) => {
      if (done) return;
      if (t0 === null) t0 = now;
      const k = Math.min(1, (now - t0) / dur);
      const bx = -R * 1.4 + (vw + R * 2.8) * ease(k);
      blade.style.transform = 'translate(' + (bx - R) + 'px, -50%)';
      kerf.style.transform = 'scaleX(' + Math.max(0, Math.min(1, bx / vw)) + ')';
      if (k < 1 && bx > 0 && bx < vw) {
        for (let i = 0; i < 6; i++) {
          sparks.push({ x: bx - R * (0.85 + Math.random() * 0.12), y: cy + (Math.random() - 0.5) * 8, vx: -(1.5 + Math.random() * 9), vy: (Math.random() - 0.3) * 7.5, life: 1, decay: 0.018 + Math.random() * 0.03 });
        }
      }
      ctx.clearRect(0, 0, vw, vh);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.32; s.vx *= 0.985; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.strokeStyle = 'hsla(' + (28 + s.life * 22) + ', 100%, ' + (52 + s.life * 33) + '%, ' + Math.min(1, s.life * 1.3) + ')';
        ctx.lineWidth = 0.6 + s.life * 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.8, s.y - s.vy * 1.8);
        ctx.stroke();
      }
      if (k < 1 || sparks.length) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, vw, vh); blade.style.display = 'none'; }
    };
    requestAnimationFrame(frame);
  };

  let started = false;
  const play = () => {
    if (started) return;
    started = true;
    if (reduced) { intro.classList.add('is-static'); return; }
    chars.forEach((c) => { c.style.opacity = '0'; });
    intro.classList.add('is-play');

    // o título começa grande no centro da tela e depois encolhe pro lugar dele
    const vw = window.innerWidth, vh = window.innerHeight;
    const r = title.getBoundingClientRect();
    const S = Math.min((vw * 0.82) / r.width, (vh * 0.3) / r.height, 4.4);
    const cy = vh / 2;
    const big = 'translateY(' + (cy - (r.top + r.height / 2)).toFixed(1) + 'px) scale(' + S.toFixed(3) + ')';
    title.style.transform = big;
    const half = (r.height * S) / 2 + Math.max(30, vh * 0.06);
    const top = $('.intro__bar--t'), bot = $('.intro__bar--b');
    top.style.height = cy + 'px';
    bot.style.height = (vh - cy) + 'px';

    // 1) a serra corta a chapa
    const T0 = 300, SAW = 1600;
    setTimeout(() => saw(cy, SAW), T0);
    // 2) as metades se separam e mostram o vídeo
    const tOpen = T0 + SAW + 150;
    setTimeout(() => intro.classList.add('is-cut'), tOpen - 100);
    anim($('.intro__kerf'), [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: tOpen, fill: 'forwards' });
    anim(top, [{ height: cy + 'px' }, { height: (cy - half) + 'px' }], { duration: 1100, delay: tOpen, easing: E_IO });
    anim(bot, [{ height: (vh - cy) + 'px' }, { height: (vh - cy - half) + 'px' }], { duration: 1100, delay: tOpen, easing: E_IO });
    // 3) o título surge letra a letra
    const tTitle = tOpen + 350;
    chars.forEach((c, i) => anim(c, [
      { opacity: 0, filter: 'blur(10px)', transform: 'translateY(.3em)' },
      { opacity: 1, filter: 'blur(0)', transform: 'none' },
    ], { duration: 800, delay: tTitle + i * 28 }));
    // 4) a chapa abre de vez, o título encolhe e a mensagem toma a tela
    const tEnd = tTitle + chars.length * 28 + 900;
    anim(top, [{ height: (cy - half) + 'px' }, { height: '0px' }], { duration: 1200, delay: tEnd, easing: E_IO, fill: 'forwards' });
    anim(bot, [{ height: (vh - cy - half) + 'px' }, { height: '0px' }], { duration: 1200, delay: tEnd, easing: E_IO, fill: 'forwards' });
    anim($('.intro__dim'), [{ opacity: 0.25 }, { opacity: 1 }], { duration: 1300, delay: tEnd, easing: 'ease' });
    setTimeout(() => {
      if (done) return;
      title.style.transform = '';
      anim(title, [{ transform: big }, { transform: 'none' }], { duration: 1300, easing: E_IO, fill: 'none' });
    }, tEnd);
    intro.querySelectorAll('[data-step]').forEach((el, i) => anim(el, [
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'none' },
    ], { duration: 1000, delay: tEnd + 700 + i * 150 }));
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(play));
  else play();
  setTimeout(play, 1500);

  // saída: a mensagem se dissolve e o site aparece por trás
  const close = () => {
    if (done) return;
    done = true;
    try { sessionStorage.setItem('vemaxIntro', '1'); } catch (e) {}
    const finish = () => {
      intro.remove();
      html.classList.add('intro-reveal');
      html.classList.remove('intro-on');
      behind.forEach((el) => el.removeAttribute('inert'));
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('is-entering');
      window.scrollTo(0, 0);
      document.dispatchEvent(new CustomEvent('intro:done'));
      setTimeout(() => html.classList.remove('intro-reveal'), 1500);
    };
    if (reduced) { finish(); return; }
    intro.getAnimations({ subtree: true }).forEach((a) => { try { a.finish(); } catch (e) {} });
    title.style.transform = '';
    ['.intro__blade', '.intro__sparks', '.intro__kerf'].forEach((s) => { $(s).style.display = 'none'; });
    anim($('.intro__inner'), [{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.05)', filter: 'blur(10px)' }], { duration: 650, easing: 'ease-in' });
    anim($('.intro__dim'), [{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 250, easing: 'ease' }).finished.then(finish);
  };
  $('.intro__go').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();


/* ---------- hero: vídeos em crossfade ---------- */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-slides]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.slide'));
    const dur = parseInt(root.dataset.dur || '9000', 10);
    let i = 0, timer = null;
    const playing = () => !document.hidden;
    const vid = (s) => s.querySelector('video');
    const sync = () => slides.forEach((s, j) => {
      const v = vid(s);
      if (!v) return;
      if (j === i && playing()) v.play().catch(() => {});
      else if (j !== i) setTimeout(() => { if (j !== i) v.pause(); }, 1500);
      else v.pause();
    });
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
      const v = vid(slides[i]);
      if (v && playing()) v.currentTime = 0;
      sync();
      // começa a baixar o próximo só agora, pra não pesar o carregamento da página
      const next = vid(slides[(i + 1) % slides.length]);
      if (next && next.preload !== 'auto') { next.preload = 'auto'; next.load(); }
    };
    const schedule = () => {
      clearTimeout(timer);
      if (playing() && slides.length > 1) timer = setTimeout(() => { show(i + 1); schedule(); }, dur);
    };
    document.addEventListener('visibilitychange', () => { sync(); schedule(); });
    show(0);
    // com a apresentação aberta o hero fica parado no primeiro vídeo e recomeça quando ela fecha
    if (document.documentElement.classList.contains('intro-on')) {
      document.addEventListener('intro:done', () => { show(0); schedule(); }, { once: true });
    } else schedule();
  });

  /* vídeos de painel: só tocam quando aparecem na tela */
  const vids = Array.from(document.querySelectorAll('video[data-io]'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    }), { threshold: 0.25 });
    vids.forEach((v) => io.observe(v));
  }
})();
