const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(max-width:860px)').matches;

/* ===================== PRELOADER ===================== */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const mark = document.getElementById('preloader-mark');
  const navMark = document.querySelector('.nav-mark');

  if (prefersReducedMotion) {
    setTimeout(() => pre.classList.add('hidden'), 900);
    return;
  }

  navMark.style.opacity = '0';

  setTimeout(() => {
    const markRect = mark.getBoundingClientRect();
    const markStyle = getComputedStyle(mark);
    const startFontSize = parseFloat(markStyle.fontSize);

    document.body.appendChild(mark);
    Object.assign(mark.style, {
      position: 'fixed',
      left: markRect.left + 'px',
      top: markRect.top + 'px',
      width: markRect.width + 'px',
      height: markRect.height + 'px',
      margin: '0',
      zIndex: '10000',
      animation: 'none',
    });

    pre.classList.add('hidden');

    const navRect = navMark.getBoundingClientRect();
    const navStyle = getComputedStyle(navMark);
    const scale = parseFloat(navStyle.fontSize) / startFontSize;
    const dx = (navRect.left + navRect.width / 2) - (markRect.left + markRect.width / 2);
    const dy = (navRect.top + navRect.height / 2) - (markRect.top + markRect.height / 2);

    gsap.to(mark, {
      x: dx,
      y: dy,
      scale,
      letterSpacing: navStyle.letterSpacing,
      color: navStyle.color,
      duration: 1,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete: () => {
        navMark.style.opacity = '';
        mark.remove();
        pre.remove();
      },
    });
  }, 1650);
});

/* ===================== CUSTOM CURSOR ===================== */
const cursor = document.getElementById('cursor');
if (!isTouch) {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
  });
  document.querySelectorAll('a, button, .magnetic').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ===================== MAGNETIC BUTTONS ===================== */
if (!isTouch) {
  document.querySelectorAll('[data-magnetic]:not(.path-panel)').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.5, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ===================== SLIDE DECK CONTROLLER ===================== */
const slides = Array.from(document.querySelectorAll('.slide'));
const heroEl = slides[0], inviteEl = slides[1], ecosystemEl = slides[2], finalEl = slides[3], footerEl = slides[4];

let current = 0;
let animating = false;
const DUR = 1.5;
const OVERFLOW_TOLERANCE = 60; // ignore minor overflow so a slide doesn't require internal scrolling before it advances

function initSlides() {
  slides.forEach((s, i) => {
    gsap.set(s, { scale: 1, opacity: i === 0 ? 1 : 0, zIndex: i + 1 });
    s.style.pointerEvents = i === 0 ? 'auto' : 'none';
  });
}
initSlides();

function updateChrome() {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  document.getElementById('slide-back').classList.toggle('visible', current > 0);
  document.getElementById('slide-next').classList.toggle('hidden', current === slides.length - 1);
}
updateChrome();

/* ---- transition: iris / clip-path reveal ---- */
function irisTransition(leaving, entering, leavingIndex, index, finish) {
  const d = prefersReducedMotion ? 0.01 : DUR;
  const radius = 0.52 * Math.hypot(window.innerWidth, window.innerHeight);

  gsap.set(leaving, { clipPath: 'none', scale: 1, opacity: 1, zIndex: slides.length + 1 });
  gsap.set(entering, { clipPath: 'circle(0px at 50% 50%)', scale: 1, opacity: 1, zIndex: slides.length + 2 });
  gsap.to(entering, {
    clipPath: `circle(${radius}px at 50% 50%)`,
    duration: d,
    ease: 'power3.inOut',
    onComplete: () => {
      gsap.set(entering, { clipPath: 'none', zIndex: index + 1 });
      gsap.set(leaving, { opacity: 0, zIndex: leavingIndex + 1 });
      finish();
    },
  });
}

/* ---- transition: curtain wipe ---- */
function curtainTransition(leaving, entering, leavingIndex, index, finish) {
  const d = prefersReducedMotion ? 0.01 : DUR;
  const curtain = document.getElementById('curtain');
  const w = window.innerWidth;

  gsap.set(curtain, { x: -w });
  gsap.set(leaving, { opacity: 1, scale: 1, zIndex: slides.length + 1 });
  gsap.set(entering, { opacity: 0, scale: 1, zIndex: slides.length + 1 });

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(leaving, { opacity: 0, zIndex: leavingIndex + 1 });
      gsap.set(entering, { zIndex: index + 1 });
      finish();
    },
  });
  tl.to(curtain, { x: 0, duration: d * 0.42, ease: 'power2.in' });
  tl.set(leaving, { opacity: 0 });
  tl.set(entering, { opacity: 1 });
  tl.to(curtain, { x: w, duration: d * 0.42, ease: 'power3.out' });
}

/* ---- transition: 3D page flip ---- */
function flipTransition(leaving, entering, leavingIndex, index, finish) {
  const d = prefersReducedMotion ? 0.01 : DUR;
  const dir = index > leavingIndex ? 1 : -1;

  gsap.set(leaving, { rotateY: 0, opacity: 1, zIndex: slides.length + 1 });
  gsap.set(entering, { rotateY: dir * 90, opacity: 0, zIndex: slides.length + 2 });

  const tl = gsap.timeline({
    defaults: { duration: d, ease: 'power3.inOut' },
    onComplete: () => {
      gsap.set(leaving, { rotateY: 0, opacity: 0, zIndex: leavingIndex + 1 });
      gsap.set(entering, { rotateY: 0, zIndex: index + 1 });
      finish();
    },
  });
  tl.to(leaving, { rotateY: dir * -90, opacity: 0 }, 0);
  tl.to(entering, { rotateY: 0, opacity: 1 }, 0);
}

/* ---- transition: scale / box closing ---- */
function scaleTransition(leaving, entering, leavingIndex, index, finish) {
  const d = prefersReducedMotion ? 0.01 : DUR;

  gsap.set(entering, { scale: 0.42, opacity: 0, borderRadius: '48px', zIndex: slides.length + 2 });
  gsap.set(leaving, { zIndex: slides.length + 1 });

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(leaving, { scale: 1, opacity: 0, borderRadius: '0px', zIndex: leavingIndex + 1 });
      gsap.set(entering, { zIndex: index + 1 });
      finish();
    },
  });
  tl.to(leaving, { scale: 0.42, opacity: 0, borderRadius: '48px', duration: d * 0.5, ease: 'power2.in' }, 0);
  tl.to(entering, { scale: 1, opacity: 1, borderRadius: '0px', duration: d * 0.62, ease: 'power3.out' }, d * 0.42);
}

function goTo(index) {
  if (index < 0 || index > slides.length - 1 || index === current || animating) return;
  animating = true;
  const leavingIndex = current;
  const leaving = slides[leavingIndex];
  const entering = slides[index];

  leaving.style.pointerEvents = 'none';
  entering.style.pointerEvents = 'auto';

  const finish = () => {
    animating = false;
    current = index;
    updateChrome();
    playEnter(current);
  };

  const pairKey = [leavingIndex, index].sort((a, b) => a - b).join('-');
  const transitions = {
    '0-1': irisTransition,
    '1-2': curtainTransition,
    '2-3': flipTransition,
    '3-4': scaleTransition,
  };
  const run = transitions[pairKey] || scaleTransition;
  run(leaving, entering, leavingIndex, index, finish);
}

/* ---- input: wheel, touch, keyboard, explicit controls ---- */
function activeSlideEl() { return slides[current]; }

window.addEventListener('wheel', (e) => {
  if (animating) { e.preventDefault(); return; }
  const dir = e.deltaY > 0 ? 1 : -1;
  const el = activeSlideEl();
  const canScrollMore = el.scrollHeight > el.clientHeight + OVERFLOW_TOLERANCE;
  if (canScrollMore) {
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const atTop = el.scrollTop <= 2;
    if (dir === 1 && !atBottom) return;
    if (dir === -1 && !atTop) return;
  }
  e.preventDefault();
  goTo(current + dir);
}, { passive: false });

let touchStartY = null;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', (e) => {
  if (touchStartY === null || animating) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  touchStartY = null;
  if (Math.abs(dy) < 60) return;
  const dir = dy > 0 ? 1 : -1;
  const el = activeSlideEl();
  const canScrollMore = el.scrollHeight > el.clientHeight + OVERFLOW_TOLERANCE;
  if (canScrollMore) {
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const atTop = el.scrollTop <= 2;
    if (dir === 1 && !atBottom) return;
    if (dir === -1 && !atTop) return;
  }
  goTo(current + dir);
}, { passive: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
});

document.getElementById('slide-back').addEventListener('click', () => goTo(current - 1));
document.getElementById('slide-next').addEventListener('click', () => goTo(current + 1));
document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(el.dataset.goto, 10));
  });
});

/* ===================== PER-SLIDE ENTER ANIMATIONS (play once) ===================== */
const visited = new Set();
function playEnter(i) {
  if (visited.has(i)) return;
  visited.add(i);
  const fn = [enterHero, enterInvite, enterEcosystem, enterFinal, enterFooter][i];
  fn && fn();
}

function enterHero() {
  gsap.to(heroEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  gsap.to(heroEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.6 });

  gsap.to(heroEl.querySelectorAll('.hero-actions .btn'), {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1.4,
  });
}

function enterInvite() {
  gsap.to(inviteEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to(inviteEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.1, ease: 'power4.out', delay: 0.25 });
  gsap.to(inviteEl.querySelectorAll('.reveal-fade'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
  inviteEl.querySelectorAll('.benefit').forEach((b, i) => {
    setTimeout(() => b.classList.add('in-view'), 700 + i * 120);
  });
}

function enterEcosystem() {
  gsap.to(ecosystemEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to(ecosystemEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.25 });
  gsap.to(ecosystemEl.querySelectorAll('.reveal-fade'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.6 });
}

function enterFinal() {
  gsap.to(finalEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to(finalEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.1, ease: 'power4.out', delay: 0.25 });
  gsap.to(finalEl.querySelectorAll('.reveal-fade'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 });
}

function enterFooter() {
  gsap.to(footerEl.querySelector('.footer-inner'), { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.15 });
}

playEnter(0);

/* ===================== CANVAS SETUP HELPER ===================== */
function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  return { ctx, resize };
}

/* ---- perspective floor grid receding into depth ---- */
function initGridCanvas() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const { ctx } = setupCanvas(canvas);
  let W, H;
  function dims() { W = canvas.parentElement.clientWidth; H = canvas.parentElement.clientHeight; }
  dims();
  window.addEventListener('resize', dims);

  let offset = 0;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    offset += 0.12;

    const horizon = H * 0.3;
    const vpX = W / 2;
    const lineCount = 22;

    for (let i = 0; i < lineCount; i++) {
      const t = ((i * 40 + offset) % (lineCount * 40)) / (lineCount * 40);
      const y = horizon + t * t * (H - horizon) * 1.3;
      if (y > H) continue;
      const spread = (y - horizon) / (H - horizon);
      const halfW = spread * W * 0.85;
      ctx.globalAlpha = Math.max(0, 1 - spread) * 0.14;
      ctx.strokeStyle = '#c9a15e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vpX - halfW, y);
      ctx.lineTo(vpX + halfW, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    const rays = 12;
    for (let i = 0; i <= rays; i++) {
      const xBase = (i / rays) * W;
      ctx.strokeStyle = 'rgba(201,161,94,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vpX, horizon);
      ctx.lineTo(xBase, H);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  frame();
}

/* ---- ambient drifting particles ---- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const { ctx } = setupCanvas(canvas);
  let W, H;
  function dims() { W = canvas.parentElement.clientWidth; H = canvas.parentElement.clientHeight; }
  dims();
  window.addEventListener('resize', dims);

  const COUNT = window.innerWidth < 700 ? 28 : 55;
  const nodes = Array.from({ length: COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00025,
    vy: (Math.random() - 0.5) * 0.00025,
    r: Math.random() * 1.3 + 0.5,
  }));

  let mx = 0.5, my = 0.5;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach((n) => {
      n.x += n.vx + (mx - 0.5) * 0.00004;
      n.y += n.vy + (my - 0.5) * 0.00004;
      if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0;
      if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(245,244,240,0.4)';
      ctx.arc(n.x * W, n.y * H, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

/* ===================== HERO LAYER PANELS — mouse parallax depth ===================== */
function initLayerParallax() {
  const layers = gsap.utils.toArray('.layer-panel');
  if (!layers.length || isTouch) return;
  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth) || 0.3;
      gsap.to(el, { x: mx * 50 * depth, y: my * 50 * depth, duration: 0.7, ease: 'power2.out' });
    });
  });
}

/* ===================== GROWTH TRAJECTORY LINE ===================== */
function initTrajectory() {
  const path = document.getElementById('trajectory-path');
  const dot = document.getElementById('trajectory-dot');
  if (!path || !dot) return;
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2.4,
    ease: 'power2.inOut',
    delay: 0.5,
    onComplete: runDot,
  });

  function runDot() {
    let t = 0;
    function frame() {
      t += 0.0018;
      if (t > 1) t = 0;
      const point = path.getPointAtLength(t * length);
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      requestAnimationFrame(frame);
    }
    frame();
  }
}

/* ===================== CANVAS: soft drifting gradient blobs (invite / ecosystem) ===================== */
function initBlobCanvas(id, hue) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const { ctx } = setupCanvas(canvas);
  let W, H;
  function dims() { W = canvas.parentElement.clientWidth; H = canvas.parentElement.clientHeight; }
  dims();
  window.addEventListener('resize', dims);

  const blobs = Array.from({ length: 3 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.35 + Math.random() * 0.25,
    t: Math.random() * 1000,
    speed: 0.0025 + Math.random() * 0.002,
    hue: hue + i * 12,
  }));

  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f0f11';
    ctx.fillRect(0, 0, W, H);

    blobs.forEach((b) => {
      b.t += b.speed;
      const x = (0.5 + Math.sin(b.t) * 0.28) * W;
      const y = (0.5 + Math.cos(b.t * 0.8) * 0.28) * H;
      const r = b.r * Math.max(W, H);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `hsla(${b.hue}, 55%, 55%, 0.16)`);
      grad.addColorStop(1, 'hsla(0,0%,0%,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  frame();
}

initGridCanvas();
initParticleCanvas();
initTrajectory();
initLayerParallax();
initBlobCanvas('invite-canvas', 38);
initBlobCanvas('ecosystem-canvas', 30);
