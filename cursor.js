/* ==========================================================================
   Cursor follower
   A small white dot that eases toward the real pointer position every
   frame (linear interpolation, not a 1:1 lock) so it trails smoothly
   rather than snapping. Only runs for devices with a real mouse — touch
   devices never fire hover, so the dot just stays hidden there.
   ========================================================================== */
(function () {
  var hasFineHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFineHover) return;

  var dot = document.querySelector('.cursor-dot');
  if (!dot) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var currentX = targetX;
  var currentY = targetY;
  var hasMoved = false;

  // Lower = more trailing lag, higher = tighter tracking. 0.18 reads as a
  // smooth, slightly lazy follow rather than an instant lock.
  var EASE = 0.10;

  window.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!hasMoved) {
      // snap on the very first move so it doesn't glide in from the center
      currentX = targetX;
      currentY = targetY;
      hasMoved = true;
      dot.classList.add('is-visible');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    dot.classList.remove('is-visible');
  });
  document.addEventListener('mouseenter', function () {
    if (hasMoved) dot.classList.add('is-visible');
  });

  window.addEventListener('mousedown', function () { dot.classList.add('is-pressed'); });
  window.addEventListener('mouseup', function () { dot.classList.remove('is-pressed'); });

  function apply(x, y) {
    dot.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  }

  if (reduceMotion) {
    // Skip the trailing animation entirely; just track 1:1.
    window.addEventListener('mousemove', function (e) {
      apply(e.clientX, e.clientY);
    }, { passive: true });
    return;
  }

  function tick() {
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;
    apply(currentX, currentY);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
