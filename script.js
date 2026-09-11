/* ==========================================================================
   KV page behavior — menu toggle affordance.
   No routing/menu panel is wired up yet since this build is KV-only.
   ========================================================================== */
(function () {
  var toggle = document.querySelector('.kv-nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.classList.toggle('is-open', !expanded);
      // TODO: wire up an actual menu panel when more sections exist.
    });
  }
})();
