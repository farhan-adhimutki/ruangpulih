/**
 * ScrollRevealWrapper — utility IntersectionObserver.
 * Elemen dengan atribut [data-reveal] akan mendapat kelas .is-visible saat masuk viewport.
 * Atribut opsional: data-reveal-delay="200" (ms).
 * Hanya memakai opacity/transform (lihat CSS) agar tetap ringan di perangkat low-end.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supported = 'IntersectionObserver' in window;

  function show(el) { el.classList.add('is-visible'); }

  function prepare(el) {
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
  }

  var observer = null;

  if (supported && !reduceMotion) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target); // animasi cukup sekali
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  } else {
    // Tanpa dukungan / gerak dikurangi: tampilkan semua konten langsung.
    root.classList.remove('js');
  }

  /** Daftarkan elemen (atau semua [data-reveal] di dalam container) ke observer. */
  function observe(scope) {
    var els = scope && scope.matches && scope.matches('[data-reveal]')
      ? [scope]
      : (scope || document).querySelectorAll('[data-reveal]:not(.is-visible)');

    Array.prototype.forEach.call(els, function (el) {
      prepare(el);
      if (observer) observer.observe(el); else show(el);
    });
  }

  window.RuangReveal = { observe: observe };
  window.__rpRevealReady = true;

  observe(document);
})();
