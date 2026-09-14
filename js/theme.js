'use strict';
// Executado antes do CSS para evitar um clarão ao navegar com o tema escuro salvo.
(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('igarassu-theme') === 'dark') theme = 'dark';
  } catch {
    /* Preferência opcional. */
  }
  document.documentElement.dataset.theme = theme;
})();
