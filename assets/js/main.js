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
    if (a.dataset.buy) return; // оставляем кнопкам "Купить" наши обработчики
    if (a.hostname && a.hostname !== window.location.hostname) {
      a.setAttribute('target', '_blank');
      const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      a.setAttribute('rel', rel.join(' '));
    }
  });

  // ---------- Buy modal: ЮKassa через n8n ----------
  initBuyModal();

  function initBuyModal() {
    const modal = document.getElementById('buyModal');
    if (!modal) return;

    const createPaymentUrl = modal.getAttribute('data-create-payment-url') || '';
    const dialog = modal.querySelector('.buy-modal__dialog');
    const titleEl = modal.querySelector('[data-buy-guide-title]');
    const priceEl = modal.querySelector('[data-buy-price]');
    const form = modal.querySelector('.buy-modal__form');
    const emailInput = modal.querySelector('#buyEmail');
    const consentInput = modal.querySelector('#buyConsent');
    const submitBtn = modal.querySelector('.buy-modal__submit');
    const errorEl = modal.querySelector('[data-buy-error]');

    let activeSlug = null;
    let lastFocus = null;

    function open(slug, title, price) {
      activeSlug = slug;
      titleEl.textContent = title || '';
      priceEl.textContent = price ? 'Цена: ' + price : '';
      errorEl.hidden = true;
      errorEl.textContent = '';
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      setTimeout(function () { emailInput.focus(); }, 60);
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // Делегируем клики по любым "Купить"
    document.addEventListener('click', function (e) {
      const a = e.target.closest('[data-buy]');
      if (!a) return;
      e.preventDefault();
      open(
        a.getAttribute('data-buy'),
        a.getAttribute('data-buy-title') || a.textContent.trim(),
        a.getAttribute('data-buy-price') || ''
      );
    });

    modal.querySelectorAll('[data-buy-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.hidden = true;
      errorEl.textContent = '';

      const email = (emailInput.value || '').trim();
      // Узкий, безопасный набор символов: предотвращает попадание кавычек/слэшей
      // в JSON-тело запроса, которое мы потом передаём в ЮKassa через n8n.
      const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
      if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
        showError('Введите корректный email — на него придёт PDF и чек.');
        emailInput.focus();
        return;
      }
      if (!consentInput.checked) {
        showError('Подтвердите согласие с офертой и политикой конфиденциальности.');
        return;
      }
      if (!createPaymentUrl) {
        showError('Приём платежей временно недоступен. Напишите нам на email — отправим вручную.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');

      const idempotenceKey = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'k-' + Date.now() + '-' + Math.random().toString(36).slice(2);

      fetch(createPaymentUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide_slug: activeSlug,
          email: email,
          idempotence_key: idempotenceKey,
          source_url: window.location.href
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          // n8n Respond node может вернуть либо чистый {confirmation_url},
          // либо сырой ответ ЮKassa {confirmation: {confirmation_url}},
          // либо массив [{...}] при режиме "All Items" — поддерживаем все три.
          const item = Array.isArray(data) ? data[0] : data;
          const url = item && (item.confirmation_url || (item.confirmation && item.confirmation.confirmation_url));
          if (!url) throw new Error('no confirmation_url');
          window.location.href = url;
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          showError('Не удалось создать платёж. Попробуйте ещё раз или напишите нам на email.');
        });
    });

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }
  }
})();
