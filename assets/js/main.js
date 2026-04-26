// Special English — minimal interactivity (no framework)
(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.querySelector('.site-header__toggle');
  const nav = document.querySelector('.site-header__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Submenu toggle (keyboard accessibility)
  document.querySelectorAll('.has-submenu > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const li = btn.parentElement;
      const expanded = li.getAttribute('aria-expanded') === 'true';
      li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // Close submenu on outside click
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-submenu').forEach(function (li) {
      if (!li.contains(e.target)) li.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // External links: open in new tab + add rel
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    if (a.hostname && a.hostname !== window.location.hostname) {
      a.setAttribute('target', '_blank');
      const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('nofollow') && a.dataset.buy) rel.push('nofollow');
      a.setAttribute('rel', rel.join(' '));
    }
  });
})();
