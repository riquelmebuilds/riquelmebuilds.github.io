// Fundo do hero: rede de nós conectados (referência aos nós da logo Nextage).
// Pontos à deriva bem devagar, ligados quando estão perto; o mouse acende a vizinhança.
(function () {
  var cv = document.getElementById('heroRede');
  if (!cv || !cv.getContext) return;
  var hero = document.getElementById('hero');
  var ctx = cv.getContext('2d');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LIME = '217,248,74', W = 0, H = 0, dpr = 1, nos = [], mouse = { x: -9999, y: -9999 }, visivel = true, raf = null;
  var LIGA = 150, RAIO_MOUSE = 190;

  function montar() {
    var r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var qtd = Math.min(70, Math.round(W * H / (W < 700 ? 22000 : 17000)));
    nos = [];
    for (var i = 0; i < qtd; i++) {
      nos.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: Math.random() < .12 ? 2.2 : 1.2
      });
    }
  }

  function quadro() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < nos.length; i++) {
      var a = nos[i];
      if (!reduz) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
      }
    }
    for (i = 0; i < nos.length; i++) {
      a = nos[i];
      var dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      var perto = dm < RAIO_MOUSE ? 1 - dm / RAIO_MOUSE : 0;
      for (var j = i + 1; j < nos.length; j++) {
        var b = nos[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LIGA) {
          var al = (1 - d / LIGA) * (.09 + perto * .35);
          ctx.strokeStyle = 'rgba(' + LIME + ',' + al.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (perto > 0) {
        ctx.strokeStyle = 'rgba(' + LIME + ',' + (perto * .28).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(' + LIME + ',' + (.28 + perto * .6).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r + perto * 1.2, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduz && visivel && !document.hidden) raf = requestAnimationFrame(quadro); else raf = null;
  }

  function iniciar() { if (!raf) raf = requestAnimationFrame(quadro); }

  montar(); quadro();
  hero.classList.add('rede-on');

  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { montar(); if (reduz) quadro(); }, 150); });
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    if (reduz) quadro();
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; if (reduz) quadro(); });
  new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; if (visivel && !reduz) iniciar(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !reduz) iniciar(); });
})();
