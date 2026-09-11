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

  // Each blob drifts along its own independent path — a slow primary sweep
  // (fx/fy, full loop roughly every 15-25s) plus a faster, smaller secondary
  // wobble (fx2/fy2) layered on top so the motion reads as organic liquid
  // turbulence rather than a single clean circle. NOTE: fx/fy are angular
  // frequencies in rad/s — period = 2*PI / f, so keep them in the ~0.2-0.45
  // range for a "flowing" feel; anything much smaller reads as static.
  var blobs = [
    { cx: 0.22, cy: 0.28, rx: 0.58, ry: 0.58, ax: 0.24, ay: 0.20, fx: 0.26, fy: 0.21, ax2: 0.06, ay2: 0.07, fx2: 0.62, fy2: 0.55, p: 0.0, color: 'rgba(80, 96, 66, 0.9)' },    // olive
    { cx: 0.68, cy: 0.55, rx: 0.62, ry: 0.62, ax: 0.22, ay: 0.26, fx: 0.19, fy: 0.29, ax2: 0.07, ay2: 0.06, fx2: 0.48, fy2: 0.66, p: 1.7, color: 'rgba(150, 122, 80, 0.85)' }, // bronze
    { cx: 0.80, cy: 0.20, rx: 0.44, ry: 0.44, ax: 0.20, ay: 0.22, fx: 0.33, fy: 0.24, ax2: 0.05, ay2: 0.05, fx2: 0.71, fy2: 0.58, p: 3.1, color: 'rgba(226, 190, 128, 0.6)' }, // amber highlight
    { cx: 0.35, cy: 0.75, rx: 0.52, ry: 0.52, ax: 0.19, ay: 0.24, fx: 0.22, fy: 0.17, ax2: 0.06, ay2: 0.07, fx2: 0.53, fy2: 0.44, p: 4.4, color: 'rgba(50, 64, 46, 0.8)' },    // deep olive
    { cx: 0.55, cy: 0.40, rx: 0.68, ry: 0.68, ax: 0.14, ay: 0.14, fx: 0.14, fy: 0.16, ax2: 0.04, ay2: 0.04, fx2: 0.37, fy2: 0.41, p: 2.2, color: 'rgba(12, 10, 8, 0.6)' }     // dark sweep (multiply)
  ];

  function drawBlob(b, t) {
    var x = (b.cx
      + Math.sin(t * b.fx + b.p) * b.ax
      + Math.sin(t * b.fx2 + b.p * 2.1) * b.ax2) * width;
    var y = (b.cy
      + Math.cos(t * b.fy + b.p * 1.3) * b.ay
      + Math.cos(t * b.fy2 + b.p * 1.7) * b.ay2) * height;
    var pulse = 1 + 0.1 * Math.sin(t * 0.3 + b.p);
    var r = Math.max(width, height) * b.rx * pulse;

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
