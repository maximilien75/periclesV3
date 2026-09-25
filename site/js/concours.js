// Pages concours : highlights the section being read in the sommaire (desktop column and mobile bar).
// Scrolling itself is plain anchor links + CSS scroll-margin, so the sommaire works without JavaScript.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('.toc-list a, .toc-mobile-list a');
    if (!links.length) return;

    var header = document.querySelector('.site-header');
    var mobileToc = document.querySelector('.toc-mobile');
    var numEl = document.querySelector('[data-toc-num]');
    var labelEl = document.querySelector('[data-toc-label]');
    var wide = window.matchMedia('(min-width: 900px)');

    var ids = [];
    var labels = {};
    Array.prototype.forEach.call(document.querySelectorAll('.toc-list a'), function (a) {
      var id = a.getAttribute('href').slice(1);
      ids.push(id);
      labels[id] = a.textContent;
    });
    var sections = ids.map(function (id) { return document.getElementById(id); });

    var active = null;
    function setActive(id) {
      if (id === active) return;
      active = id;
      Array.prototype.forEach.call(links, function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      if (numEl) numEl.textContent = ids.indexOf(id) + 1;
      if (labelEl) labelEl.textContent = labels[id];
    }

    var ticking = false;
    function update() {
      ticking = false;
      var headerH = header ? header.offsetHeight : 0;
      var offset = headerH + (wide.matches ? 120 : 110);
      var current = ids[0];
      sections.forEach(function (el, i) {
        if (el && el.getBoundingClientRect().top <= offset) current = ids[i];
      });
      // At the very bottom, the last section may be too short to reach the offset line.
      var last = sections[sections.length - 1];
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 &&
          last && last.getBoundingClientRect().top < window.innerHeight) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    if (mobileToc) {
      Array.prototype.forEach.call(mobileToc.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { mobileToc.open = false; });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  });
})();
