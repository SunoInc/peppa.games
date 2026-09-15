/* ==========================================================================
   Site menu — the top-right toggle opens a full-screen link panel
   (.menu-panel). Shared by the KV page and the legal pages.
   ========================================================================== */
(function () {
  var toggle = document.querySelector('.kv-nav__toggle');
  var panel = document.getElementById('site-menu');
  if (!toggle || !panel) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.classList.toggle('is-open', open);
    panel.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      var first = panel.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Same-page links (e.g. "Home" while already home) should still close the panel.
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
})();
