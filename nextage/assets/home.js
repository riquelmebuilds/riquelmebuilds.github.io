// Interações da home (hero, processo, carrossel, FAQ, formulário).
// HERO: entrada + parallax leve
(function(){
  var hv = document.getElementById('hv'), hero = document.getElementById('hero');
  requestAnimationFrame(function(){ setTimeout(function(){ hv.classList.add('go'); }, 150); });
  setTimeout(function(){ hv.classList.add('ready'); }, 2600);
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduz || !fino) return;
  var figs = hv.querySelectorAll('figure'), raf = null, mx = 0, my = 0;
  hero.addEventListener('pointermove', function(e){
    var r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
    if (!raf) raf = requestAnimationFrame(function(){
      figs.forEach(function(f){ var d = +f.getAttribute('data-d'); f.style.translate = (mx * d) + 'px ' + (my * d) + 'px'; });
      raf = null;
    });
  }, {passive:true});
})();

// PROCESSO acompanha a rolagem
(function(){
  var board = document.getElementById('board'), chs = document.querySelectorAll('.ch');
  var po = new IntersectionObserver(function(es){
    es.forEach(function(x){
      if (x.isIntersecting) {
        chs.forEach(function(c){ c.classList.toggle('on', c === x.target); });
        board.setAttribute('data-s', x.target.getAttribute('data-s'));
      }
    });
  }, {rootMargin:'-40% 0px -45% 0px'});
  chs.forEach(function(c){ po.observe(c); });
})();

// CARROSSEL "o que a gente constrói"
// PC, só na primeira descida: a rolagem vertical move os slides pro lado (seção fixa na tela).
// Ao terminar, vira carrossel normal (setas / arrastar) e não prende mais a rolagem.
// Celular/tablet: carrossel de arrastar + setas.
(function(){
  var sec = document.getElementById('projeto'), track = document.getElementById('track'), slides = track.querySelectorAll('.slide');
  var prev = document.getElementById('prev'), next = document.getElementById('next'), count = document.getElementById('count'), prog = document.getElementById('prog');
  var n = slides.length, POR_SLIDE = .7; // altura de tela rolada por slide
  var mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  var hs = false, feito = false, atualHs = 0, raf = null, ocioso = null;

  function ui(i, fracProg, inicio, fim){
    count.textContent = '0' + (i + 1) + ' / 0' + n;
    prog.style.width = (fracProg * 100) + '%';
    prev.disabled = inicio; next.disabled = fim;
  }
  function suave(t){ return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function passo(){ return slides[1].offsetLeft - slides[0].offsetLeft; }

  // ---- modo PC (rolagem vertical → horizontal), uma única vez
  function totalHs(){ return sec.offsetHeight - window.innerHeight; }
  function medir(){ sec.style.setProperty('--hs-h', (window.innerHeight * (1 + (n - 1) * POR_SLIDE)) + 'px'); }
  function rolarHs(){
    raf = null;
    if (!hs) return;
    var total = totalHs(), p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
    var x = p * (n - 1), i = Math.min(n - 1, Math.floor(x)), f = x - i;
    var e = f < .1 ? 0 : f > .9 ? 1 : suave((f - .1) / .8);
    var pos = Math.min(n - 1, i + e);
    track.style.transform = 'translate3d(' + (-pos * passo()) + 'px,0,0)';
    slides.forEach(function(sl, k){ sl.style.opacity = Math.max(0, 1 - Math.abs(k - pos) * 1.25); });
    atualHs = Math.round(pos);
    ui(atualHs, (pos + 1) / n, p <= .001, p >= .999);
    // chegou no fim: assim que a rolagem parar, solta a seção (sem pulo na tela)
    clearTimeout(ocioso);
    if (p >= .999) ocioso = setTimeout(encerrar, 140);
  }
  function encerrar(){
    if (!hs) return;
    var ref = document.getElementById('opcoes'), antes = ref.getBoundingClientRect().top;
    feito = true; hs = false;
    sec.classList.remove('hs-on'); sec.style.removeProperty('--hs-h');
    track.style.transform = ''; slides.forEach(function(sl){ sl.style.opacity = ''; });
    var depois = ref.getBoundingClientRect().top;
    window.scrollBy({ top: depois - antes, behavior: 'instant' });
    track.scrollLeft = (n - 1) * passo();
    upd();
  }
  function irHs(dir){
    var k = Math.max(0, Math.min(n - 1, atualHs + dir));
    window.scrollTo({ top: sec.offsetTop + k / (n - 1) * totalHs() + 2, behavior: 'smooth' });
  }

  // ---- modo arrastar / setas
  function atual(){
    var best = 0, d = Infinity;
    slides.forEach(function(s, i){ var dd = Math.abs((s.offsetLeft - slides[0].offsetLeft) - track.scrollLeft); if (dd < d) { d = dd; best = i; } });
    return best;
  }
  function upd(){
    var fim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4, i = fim ? n - 1 : atual();
    ui(i, (i + 1) / n, track.scrollLeft < 4, fim);
  }
  function ir(dir){
    var i = Math.max(0, Math.min(n - 1, atual() + dir));
    track.scrollTo({ left: i * passo(), behavior: 'smooth' });
  }

  function aplicar(){
    var quer = mq.matches && !feito;
    if (quer === hs && sec.classList.contains('hs-on') === hs) { if (!hs) upd(); else { medir(); rolarHs(); } return; }
    hs = quer;
    sec.classList.toggle('hs-on', hs);
    if (hs) { track.scrollLeft = 0; medir(); rolarHs(); }
    else { track.style.transform = ''; sec.style.removeProperty('--hs-h'); slides.forEach(function(sl){ sl.style.opacity = ''; }); upd(); }
  }
  prev.addEventListener('click', function(){ hs ? irHs(-1) : ir(-1); });
  next.addEventListener('click', function(){ hs ? irHs(1) : ir(1); });
  window.addEventListener('scroll', function(){ if (hs && !raf) raf = requestAnimationFrame(rolarHs); }, {passive:true});
  var dica = document.getElementById('swipe');
  track.addEventListener('scroll', function(){ if (!hs) { requestAnimationFrame(upd); if (track.scrollLeft > 20) dica.classList.add('off'); } }, {passive:true});
  window.addEventListener('resize', aplicar);
  if (mq.addEventListener) mq.addEventListener('change', aplicar);
  aplicar();
})();

// FAQ: perguntas entram deslizando uma única vez
(function(){
  var itens = document.querySelectorAll('.faq-list details');
  if (!('IntersectionObserver' in window)) { itens.forEach(function(d){ d.classList.add('in'); }); return; }
  var fo = new IntersectionObserver(function(es){
    es.forEach(function(x){
      if (!x.isIntersecting) return;
      x.target.classList.add('in');
      fo.unobserve(x.target);
    });
  }, {threshold:.25});
  itens.forEach(function(d, i){
    if (d.getBoundingClientRect().bottom < 0) d.classList.add('from-top'); // página abriu já abaixo do FAQ
    d.style.transitionDelay = (i % 4) * 60 + 'ms';
    fo.observe(d);
  });
})();

// escolher opção preenche o formulário
var dd = document.getElementById('dd'), ddBtn = document.getElementById('dd-btn'), ddList = document.getElementById('dd-list'), ddVal = document.getElementById('dd-val'), ddIn = dd.querySelector('input');
function setOpcao(v){
  ddIn.value = v; ddVal.textContent = v;
  ddList.querySelectorAll('li').forEach(function(li){ li.classList.toggle('sel', li.getAttribute('data-v') === v && v !== ''); });
}
function abrirDd(abrir){
  dd.classList.toggle('open', abrir); ddList.hidden = !abrir; ddBtn.setAttribute('aria-expanded', abrir);
}
ddBtn.addEventListener('click', function(){ abrirDd(ddList.hidden); });
ddList.addEventListener('click', function(e){ var li = e.target.closest('li'); if (!li) return; setOpcao(li.getAttribute('data-v')); abrirDd(false); ddBtn.focus(); });
document.addEventListener('click', function(e){ if (!dd.contains(e.target)) abrirDd(false); });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') abrirDd(false); });
document.querySelectorAll('[data-pk]').forEach(function(a){
  a.addEventListener('click', function(){ setOpcao(a.getAttribute('data-pk')); });
});

// formulário → WhatsApp
document.getElementById('lead').addEventListener('submit', function(e){
  e.preventDefault();
  var f = new FormData(this);
  var t = 'Opa, tudo bem? Meu nome é ' + f.get('nome').trim() + ' e eu tenho um(a) ' + f.get('negocio').trim() + '.';
  if (f.get('opcao')) t += ' Tenho interesse em: ' + f.get('opcao') + '.';
  if (f.get('msg').trim()) t += ' ' + f.get('msg').trim();
  var url = 'https://wa.me/5514991863224?text=' + encodeURIComponent(t);
  var w = window.open(url, '_blank');
  try { if (w) w.opener = null; } catch (e) {}
  var ok = document.getElementById('form-ok');
  ok.textContent = '';
  if (w) { ok.textContent = 'Abrimos o WhatsApp com a sua mensagem. É só enviar.'; }
  else {
    var link = document.createElement('a');
    link.href = url; link.rel = 'noopener'; link.target = '_blank'; link.textContent = 'Clique aqui pra abrir o WhatsApp';
    ok.append('Seu navegador bloqueou a nova aba. ', link, '.');
  }
});
