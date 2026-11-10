(() => {
  'use strict';
  const button = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('site-navigation');
  function closeMenu() {
    navigation.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menu');
  }
  button.addEventListener('click', () => {
    const opened = navigation.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(opened));
    button.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a, button')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      button.focus();
    }
  });
  matchMedia('(min-width: 1051px)').addEventListener('change', closeMenu);
})();
