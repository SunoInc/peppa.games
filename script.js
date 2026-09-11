/* ==========================================================================
   KV page behavior — italic-"i" wordmark detail + menu toggle affordance.
   No routing/menu panel is wired up yet since this build is KV-only.
   ========================================================================== */
(function () {
  // Wrap every "i" (and accented variants) in the headline with <em> so it
  // renders italic, echoing monopo's stylized wordmark treatment.
  document.querySelectorAll('[data-italic-i]').forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/([iíìîïĩ])/gi, '<em>$1</em>');
  });

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
