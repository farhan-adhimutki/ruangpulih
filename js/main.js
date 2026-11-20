/**
 * Ruang Pulih — main.js
 * Inisialisasi navigasi, progress scroll, section aktif, katalog, dan CTA WhatsApp.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     KONFIGURASI — isi nomor WhatsApp final di sini (format internasional
     tanpa "+" atau spasi, contoh: "6281234567890").
     Selama masih kosong, tombol konsultasi tampil nonaktif dengan keterangan.
     ------------------------------------------------------------------ */
  var CONFIG = {
    WA_NUMBER: '',
    WA_MESSAGE: 'Halo Tim Ruang Pulih, aku ingin konsultasi awal. Boleh dibantu?'
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /** Hook metrik ringan: kirim event ke dataLayer jika ada (GTM/GA). Tidak menyimpan data pribadi. */
  function track(event, detail) {
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: event }, detail || {}));
  }

  /* ---------------- Navigasi (mobile toggle) ---------------- */
  var nav = $('.nav');
  var toggle = $('.nav__toggle');
  var menu = $('#nav-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    $('.sr-only', toggle).textContent = open ? 'Tutup menu' : 'Buka menu';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });

  /* ---------------- Progress bar & shadow nav (rAF-throttled) ---------------- */
  var bar = $('.progress__bar');
  var ticking = false;

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    nav.classList.toggle('is-scrolled', doc.scrollTop > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------- Section aktif ---------------- */
  var navLinks = $$('[data-nav]');
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------------- Katalog ---------------- */
  var items = Array.isArray(window.CATALOG_ITEMS) ? window.CATALOG_ITEMS : [];
  var grid = $('#katalog-grid');
  var empty = $('#katalog-empty');
  var filters = $('.filters');
  var status = $('#katalog-status');
  var rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Pilih warna teks (navy/putih) dengan kontras terbaik terhadap warna cover. */
  function inkFor(hex) {
    var h = String(hex || '#00BFFF').replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var rgb = [0, 2, 4].map(function (i) {
      var v = parseInt(h.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    var navyL = 0.0219; // luminans #062B3D
    var vsNavy = (L + 0.05) / (navyL + 0.05);
    var vsWhite = 1.05 / (L + 0.05);
    return vsNavy >= vsWhite ? '#062B3D' : '#FFFFFF';
  }

  function coverMark(category) {
    if (category === 'Jurnal') return '<path d="M6 4h12v16H6z M9 8h6 M9 12h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
    return '<path d="M4 6c3-1.5 5.5-1.5 8 .5v13c-2.5-2-5-2-8-.5zM20 6c-3-1.5-5.5-1.5-8 .5v13c2.5-2 5-2 8-.5z" fill="currentColor"/>';
  }

  function cardHTML(item) {
    var ink = inkFor(item.coverColor);
    var isWhite = /^#?f{3}(f{3})?$/i.test(item.coverColor);
    var shape = '';
    var border = isWhite ? 'box-shadow: inset 0 0 0 1px rgba(6,43,61,.15), 0 18px 28px -14px rgba(6,43,61,.45);' : '';
    return (
      '<li class="product">' +
        '<div class="product__stage" aria-hidden="true">' +
          '<div class="product__cover' + shape + '" style="background:' + escapeHTML(item.coverColor) + ';color:' + ink + ';' + border + '">' +
            '<span class="product__cover-cat">' + escapeHTML(item.category) + '</span>' +
            '<span class="product__cover-title">' + escapeHTML(item.title) + '</span>' +
            '<svg class="product__cover-mark" viewBox="0 0 24 24">' + coverMark(item.category) + '</svg>' +
          '</div>' +
        '</div>' +
        '<div class="product__body">' +
          '<span class="product__cat">' + escapeHTML(item.category) + '</span>' +
          '<h3 class="product__title">' + escapeHTML(item.title) + '</h3>' +
          (item.description ? '<p class="product__desc">' + escapeHTML(item.description) + '</p>' : '') +
          '<p class="product__price"><span class="sr-only">Harga: </span>' + rupiah.format(item.price) + '</p>' +
        '</div>' +
      '</li>'
    );
  }

  function renderCatalog(category) {
    var list = category && category !== 'Semua'
      ? items.filter(function (it) { return it.category === category; })
      : items;

    if (!list.length) {
      grid.innerHTML = '';
      slider.hidden = true;
      empty.hidden = false;
      status.textContent = 'Produk akan segera hadir.';
      return;
    }

    empty.hidden = true;
    slider.hidden = false;
    grid.innerHTML = list.map(cardHTML).join('');
    grid.scrollLeft = 0;
    status.textContent = list.length + ' produk ditampilkan' + (category && category !== 'Semua' ? ' untuk kategori ' + category : '') + '.';
    buildDots();
  }

  /* ---------------- Slider katalog ---------------- */
  var slider = $('#katalog-slider');
  var dotsWrap = $('.slider__dots', slider);
  var prevBtn = $('[data-dir="-1"]', slider);
  var nextBtn = $('[data-dir="1"]', slider);

  function cards() { return $$('.product', grid); }

  /** Lebar satu langkah geser = lebar kartu + gap. */
  function step() {
    var c = cards();
    if (c.length < 2) return grid.clientWidth;
    return c[1].offsetLeft - c[0].offsetLeft;
  }

  function maxScroll() { return grid.scrollWidth - grid.clientWidth; }

  function pageCount() {
    var s = step();
    return s > 0 ? Math.round(maxScroll() / s) + 1 : 1;
  }

  function buildDots() {
    var n = pageCount();
    var html = '';
    for (var i = 0; i < n; i++) html += '<span class="slider__dot"></span>';
    dotsWrap.innerHTML = html;
    updateSlider();
  }

  function updateSlider() {
    var max = maxScroll();
    var x = grid.scrollLeft;
    var fits = max <= 2;
    slider.classList.toggle('is-static', fits);
    prevBtn.disabled = x <= 2;
    nextBtn.disabled = x >= max - 2;
    var idx = Math.round(x / (step() || 1));
    $$('.slider__dot', dotsWrap).forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
  }

  [prevBtn, nextBtn].forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = Number(btn.getAttribute('data-dir'));
      grid.scrollBy({ left: dir * step(), behavior: 'smooth' });
      track('catalog_slide', { dir: dir });
    });
  });

  grid.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      grid.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * step(), behavior: 'smooth' });
    }
  });

  var sliderTick = false;
  grid.addEventListener('scroll', function () {
    if (!sliderTick) { sliderTick = true; requestAnimationFrame(function () { updateSlider(); sliderTick = false; }); }
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 150);
  });

  if (!items.length) filters.hidden = true;

  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]');
    if (!btn) return;
    $$('[data-filter]', filters).forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    renderCatalog(btn.getAttribute('data-filter'));
    track('catalog_filter', { category: btn.getAttribute('data-filter') });
  });

  renderCatalog('Semua');

  /* ---------------- CTA WhatsApp ---------------- */
  var waBtn = $('#wa-button');
  var waNote = $('#wa-note');
  var fallback = $('#wa-fallback');
  var number = String(CONFIG.WA_NUMBER || '').replace(/\D/g, '');

  function formatNumber(n) {
    // 6281234567890 → +62 812-3456-7890
    if (n.indexOf('62') === 0) {
      var rest = n.slice(2);
      return '+62 ' + rest.replace(/^(\d{3})(\d{4})(\d{0,5})$/, function (_, a, b, c) { return a + '-' + b + (c ? '-' + c : ''); });
    }
    return '+' + n;
  }

  if (number.length >= 9) {
    var href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(CONFIG.WA_MESSAGE);
    waBtn.href = href;
    waBtn.setAttribute('aria-label', 'Konsultasi via WhatsApp (membuka WhatsApp di tab atau aplikasi baru)');
    waNote.textContent = 'Biasanya kami membalas dalam beberapa jam. Ceritamu aman bersama kami.';
    fallback.hidden = false;
    $('#wa-number').textContent = formatNumber(number);

    waBtn.addEventListener('click', function () { track('wa_click', { location: 'konsultasi' }); });

    $('#wa-copy').addEventListener('click', function () {
      var btn = this;
      var text = '+' + number;
      var done = function () {
        btn.textContent = 'Tersalin ✓';
        btn.classList.add('is-done');
        $('#wa-copy-status').textContent = 'Nomor WhatsApp berhasil disalin.';
        track('wa_copy_number');
        setTimeout(function () { btn.textContent = 'Salin nomor'; btn.classList.remove('is-done'); }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text) && done(); });
      } else if (legacyCopy(text)) {
        done();
      }
    });
  } else {
    // Error state: nomor belum diisi → tombol nonaktif, tidak mengarah ke link rusak.
    waBtn.removeAttribute('href');
    waBtn.removeAttribute('target');
    waBtn.setAttribute('role', 'link');
    waBtn.setAttribute('aria-disabled', 'true');
    waBtn.classList.add('is-disabled');
    waBtn.setAttribute('aria-describedby', 'wa-note');
    waNote.textContent = 'Layanan konsultasi WhatsApp sedang disiapkan dan belum bisa dihubungi. Silakan kembali lagi nanti, ya.';
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------------- Lain-lain ---------------- */
  $('#year').textContent = new Date().getFullYear();
})();
