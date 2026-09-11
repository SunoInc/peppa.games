/* ==========================================================================
   KV fluid backdrop
   Canvas-based generative "liquid metal / marbling" animation, styled after
   monopo.vn's hero: a near-black base with slow, organic olive / bronze /
   amber blobs blended with 'screen', plus a soft dark sweep for depth.
   No external assets — everything is drawn procedurally so it stays cheap
   and license-clean.
   ========================================================================== */
(function () {
  var canvas = document.getElementById('kv-fluid');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Each blob drifts along its own independent, slow Lissajous-style path
  // so the composition never feels like it's looping on a fixed cycle.
  var blobs = [
    { cx: 0.22, cy: 0.28, rx: 0.55, ry: 0.55, ax: 0.10, ay: 0.08, fx: 0.021, fy: 0.017, p: 0.0, color: 'rgba(70, 84, 60, 0.85)' },   // olive
    { cx: 0.68, cy: 0.55, rx: 0.60, ry: 0.60, ax: 0.09, ay: 0.11, fx: 0.015, fy: 0.023, p: 1.7, color: 'rgba(138, 112, 74, 0.80)' }, // bronze
    { cx: 0.80, cy: 0.20, rx: 0.42, ry: 0.42, ax: 0.08, ay: 0.09, fx: 0.026, fy: 0.019, p: 3.1, color: 'rgba(216, 180, 120, 0.55)' },// amber highlight
    { cx: 0.35, cy: 0.75, rx: 0.50, ry: 0.50, ax: 0.07, ay: 0.10, fx: 0.018, fy: 0.014, p: 4.4, color: 'rgba(46, 58, 42, 0.75)' },  // deep olive
    { cx: 0.55, cy: 0.40, rx: 0.65, ry: 0.65, ax: 0.06, ay: 0.06, fx: 0.011, fy: 0.013, p: 2.2, color: 'rgba(12, 10, 8, 0.55)' }    // dark sweep (multiply)
  ];

  function drawBlob(b, t) {
    var x = (b.cx + Math.sin(t * b.fx + b.p) * b.ax) * width;
    var y = (b.cy + Math.cos(t * b.fy + b.p * 1.3) * b.ay) * height;
    var r = Math.max(width, height) * b.rx;

    var grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (b.ry / b.rx), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(t) {
    ctx.clearRect(0, 0, width, height);

    // base
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#07070a';
    ctx.fillRect(0, 0, width, height);

    // light blobs
    ctx.globalCompositeOperation = 'screen';
    for (var i = 0; i < 4; i++) drawBlob(blobs[i], t);

    // dark sweep for depth / contrast band
    ctx.globalCompositeOperation = 'multiply';
    drawBlob(blobs[4], t);

    ctx.globalCompositeOperation = 'source-over';
  }

  var start = null;
  function frame(ts) {
    if (start === null) start = ts;
    var t = (ts - start) / 1000; // seconds
    render(t);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    render(0);
  } else {
    requestAnimationFrame(frame);
  }
})();
