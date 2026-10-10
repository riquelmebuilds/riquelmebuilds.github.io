// Comportamentos compartilhados: cabeçalho ao rolar, menu mobile e entrada das seções.
(function () {
  var header = document.querySelector('header.top');
  if (header) {
    var fixo = header.classList.contains('sc');
    var sc = function () { if (!fixo) header.classList.toggle('sc', window.scrollY > 24); };
    sc(); window.addEventListener('scroll', sc, { passive: true });

    var btn = header.querySelector('.menu-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var aberto = header.classList.toggle('open');
        btn.setAttribute('aria-expanded', aberto);
      });
      header.querySelectorAll('nav a').forEach(function (a) {
        a.addEventListener('click', function () { header.classList.remove('open'); btn.setAttribute('aria-expanded', false); });
      });
    }
  }

  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }
})();
