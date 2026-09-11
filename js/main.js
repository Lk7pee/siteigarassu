"use strict";
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  document.body.classList.add('js-enabled');
  const config = typeof SITE_CONFIG === 'undefined' ? {} : SITE_CONFIG;
  const themeButton = $('.theme-toggle');
  function syncThemeButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    themeButton.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    const themeColor = $('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? '#120c16' : '#39164f';
  }
  syncThemeButton();
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('igarassu-theme', theme); } catch { /* O modo funciona mesmo sem armazenamento. */ }
    syncThemeButton();
  });
  const menuButton = $('.menu-toggle');
  const nav = $('.nav');
  const backdrop = $('.menu-backdrop');
  const mobile = matchMedia('(max-width: 1099px)');
  const dropdownButton = $('.dropdown-toggle');
  const dropdown = $('.dropdown-menu');
  let menuOpen = false;
  function closeDropdown() { dropdown.hidden = true; dropdownButton.setAttribute('aria-expanded', 'false'); }
  function setMenu(open, restoreFocus = true) {
    menuOpen = open;
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    backdrop.hidden = !open;
    $('main').inert = open;
    $('.site-footer').inert = open;
    themeButton.inert = open;
    if (open) $('a', nav).focus();
    else { closeDropdown(); if (restoreFocus) menuButton.focus(); }
  }
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  backdrop.addEventListener('click', () => setMenu(false));
  mobile.addEventListener('change', () => setMenu(false, false));
  dropdownButton.addEventListener('click', () => {
    const expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    dropdownButton.setAttribute('aria-expanded', String(!expanded));
    dropdown.hidden = expanded;
  });
  document.addEventListener('click', event => { if (!event.target.closest('.dropdown')) closeDropdown(); });
  nav.addEventListener('focusout', event => { if (!event.relatedTarget?.closest('.dropdown')) closeDropdown(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!dropdown.hidden) { closeDropdown(); dropdownButton.focus(); }
      else if (menuOpen) setMenu(false);
    }
    if (event.key === 'Tab' && menuOpen) {
      const focusable = [menuButton, ...$$('a[href],button', nav).filter(el => el.getClientRects().length)];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06 });
    $$('.reveal').forEach(el => { el.style.setProperty('--delay', `${Number(el.dataset.delay) || 0}ms`); observer.observe(el); });
  }
  const progress = $('.scroll-progress');
  let scrollPending = false;
  function updateScroll() {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
    $('.site-header').classList.toggle('scrolled', scrollY > 16);
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll);
  updateScroll();
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  $$('.accordion details').forEach((el, i) => {
    const summary = $('summary', el), answer = $('.answer', el);
    answer.id = `answer-${i}`;
    summary.setAttribute('aria-controls', answer.id);
    summary.setAttribute('aria-expanded', String(el.open));
    el.addEventListener('toggle', () => { summary.setAttribute('aria-expanded', String(el.open)); });
  });
  function safeUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url : null; } catch { return null; }
  }
  $$('[data-config-link]').forEach(el => {
    const key = el.dataset.configLink, url = safeUrl(config[key]);
    if (!url) return;
    if (key === 'whatsapp' && !['wa.me', 'api.whatsapp.com'].includes(url.hostname)) return;
    if (key === 'instagram' && !['instagram.com', 'www.instagram.com'].includes(url.hostname)) return;
    el.href = url.href; el.target = '_blank'; el.rel = 'noopener noreferrer'; el.hidden = false;
    const pending = $(`[data-pending="${key}"]`); if (pending) pending.hidden = true;
  });
  if (config.encarregadoDados && $('[data-dpo]')) $('[data-dpo]').textContent = config.encarregadoDados;
  const origin = safeUrl(config.siteUrl);
  if (origin) {
    const path = location.pathname.split('/').pop() || 'index.html';
    const url = new URL(path, origin.href.endsWith('/') ? origin.href : `${origin.href}/`).href;
    const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = url; document.head.append(canonical);
    const og = document.createElement('meta'); og.setAttribute('property', 'og:url'); og.content = url; document.head.append(og);
  }
  const institutional = $('[data-institutional-image]');
  if (institutional) {
    const fallback = () => { institutional.hidden = true; $('.institutional-fallback').hidden = false; };
    const showImage = () => { institutional.hidden = false; $('.institutional-fallback').hidden = true; };
    // Verifica a imagem antes de substituir o painel, sem exibir um ícone quebrado.
    const loadInstitutional = () => {
      const candidate = new Image();
      candidate.onload = showImage;
      candidate.onerror = fallback;
      candidate.src = institutional.src;
    };
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { loadInstitutional(); imageObserver.disconnect(); }
      }, {rootMargin: '200px'});
      imageObserver.observe(institutional.parentElement);
    } else loadInstitutional();
  }
  const form = $('#contact-form');
  if (!form) return;
  form.noValidate = true;
  const params = new URLSearchParams(location.search);
  const service = params.get('servico');
  if ([...$('#servico').options].some(o => o.value === service)) $('#servico').value = service;
  if (params.has('assunto')) $('#assunto').value = params.get('assunto').slice(0, 160);
  const fields = $$('input,select,textarea', form);
  function validateField(el) {
    let error = '';
    if (el.type === 'checkbox' ? !el.checked : !el.value.trim()) error = el.type === 'checkbox' ? 'Confirme a ciência da Política de Privacidade.' : 'Preencha este campo.';
    else if (el.type === 'email' && el.validity.typeMismatch) error = 'Informe um e-mail válido.';
    else if (el.type === 'tel' && !/^\+?[\d\s().-]+$/.test(el.value)) error = 'Informe um telefone válido.';
    else if (el.type === 'tel' && (el.value.replace(/\D/g, '').length < 10 || el.value.replace(/\D/g, '').length > 15)) error = 'Informe o telefone com DDD.';
    el.setAttribute('aria-invalid', String(Boolean(error)));
    $(`#${el.id}-error`).textContent = error;
    return !error;
  }
  fields.forEach(el => {
    el.addEventListener('blur', () => { if (el.value || el.getAttribute('aria-invalid') === 'true') validateField(el); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
    el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
  });
  function submitContactForm(event) {
    event.preventDefault();
    // TODO: conectar ao serviço/backend responsável pelo envio, caso um serviço seja definido.
    const results = fields.map(validateField);
    if (results.includes(false)) {
      $('#form-status').textContent = 'Revise os campos indicados antes de continuar.';
      fields[results.indexOf(false)].focus(); return;
    }
    const subject = $('#assunto').value.trim();
    const body = `Nome: ${$('#nome').value.trim()}\nE-mail: ${$('#email').value.trim()}\nTelefone: ${$('#telefone').value.trim()}\nServiço: ${$('#servico').selectedOptions[0].textContent}\n\n${$('#mensagem').value.trim()}`;
    const gmail = new URL('https://mail.google.com/mail/');
    gmail.search = new URLSearchParams({view: 'cm', fs: '1', to: 'serventiaregistraldeigarassu@gmail.com', su: subject, body}).toString();
    $('#form-status').textContent = 'Mensagem preparada. Conclua o envio no Gmail. Nenhuma mensagem foi enviada automaticamente. Se a nova aba não abrir, utilize o link abaixo.';
    let continueLink = $('#gmail-continue');
    if (!continueLink) {
      continueLink = document.createElement('a');
      continueLink.id = 'gmail-continue'; continueLink.className = 'text-link';
      continueLink.target = '_blank'; continueLink.rel = 'noopener noreferrer';
      continueLink.textContent = 'Continuar no Gmail ↗';
      $('#form-status').after(continueLink);
    }
    continueLink.href = gmail.href;
    window.open(gmail.href, '_blank', 'noopener,noreferrer');
  }
  form.addEventListener('submit', submitContactForm);
})();
