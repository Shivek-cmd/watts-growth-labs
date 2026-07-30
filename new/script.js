const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(max-width:860px)').matches;

/* TEMP PREVIEW SWITCH: true = autoplay the frame sequence on a loop like a normal video (scroll just
   advances slides as usual). Flip back to false to restore scroll-scrubbing on the hero+invite slide. */
const PREVIEW_AUTOPLAY = true;

/* ===================== HERO/INVITE FRAME-SEQUENCE SCRUB ===================== */
const FRAME_COUNT = 121;
const framePath = (i) => `assets/frames/frame-${String(i).padStart(3, '0')}.webp`;
const frameImages = [];
let framesReady = false;

const scrubCanvas = document.getElementById('scrub-canvas');
const scrubCtx = scrubCanvas ? scrubCanvas.getContext('2d') : null;
const heroLayerEl = document.getElementById('hero-layer');
const inviteLayerEl = document.getElementById('invite-layer');
const scrubHintEl = document.getElementById('scrub-hint');

let scrubProgress = 0;
let inviteEntered = false;

const HERO_FADE_START = 0.10, HERO_FADE_END = 0.28;
const INVITE_FADE_START = 0.60, INVITE_FADE_END = 0.85;

function drawFrame(progress) {
  if (!scrubCtx || !framesReady) return;
  const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
  const img = frameImages[idx];
  if (!img || !img.complete || !img.naturalWidth) return;
  const W = scrubCanvas.clientWidth;
  const H = scrubCanvas.clientHeight;
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  scrubCtx.clearRect(0, 0, W, H);
  scrubCtx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

function setupScrubCanvas() {
  if (!scrubCanvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    const rect = scrubCanvas.parentElement.getBoundingClientRect();
    scrubCanvas.width = rect.width * dpr;
    scrubCanvas.height = rect.height * dpr;
    scrubCanvas.style.width = rect.width + 'px';
    scrubCanvas.style.height = rect.height + 'px';
    scrubCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(scrubProgress);
  }
  resize();
  window.addEventListener('resize', resize);
}
setupScrubCanvas();

function preloadFrames(onDone) {
  let loaded = 0;
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    const settle = () => {
      loaded++;
      if (loaded === FRAME_COUNT) {
        framesReady = true;
        drawFrame(scrubProgress);
        onDone();
      }
    };
    img.onload = settle;
    img.onerror = settle;
    img.src = framePath(i);
    frameImages.push(img);
  }
}

function applyProgress(p) {
  scrubProgress = Math.min(1, Math.max(0, p));
  drawFrame(scrubProgress);

  const heroOp = scrubProgress <= HERO_FADE_START ? 1
    : scrubProgress >= HERO_FADE_END ? 0
    : 1 - (scrubProgress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START);
  const inviteOp = scrubProgress <= INVITE_FADE_START ? 0
    : scrubProgress >= INVITE_FADE_END ? 1
    : (scrubProgress - INVITE_FADE_START) / (INVITE_FADE_END - INVITE_FADE_START);

  gsap.set(heroLayerEl, { opacity: heroOp, pointerEvents: heroOp > 0.5 ? 'auto' : 'none' });
  gsap.set(inviteLayerEl, { opacity: inviteOp, pointerEvents: inviteOp > 0.5 ? 'auto' : 'none' });

  if (scrubHintEl) scrubHintEl.classList.toggle('hidden', scrubProgress > 0.03);

  if (inviteOp > 0.05 && !inviteEntered) {
    inviteEntered = true;
    enterInviteLayer();
  }
}

/* ===================== PRELOADER ===================== */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const minTimer = new Promise((res) => setTimeout(res, prefersReducedMotion ? 0 : 2900));
  const framesLoaded = new Promise((res) => preloadFrames(res));

  Promise.all([minTimer, framesLoaded]).then(() => {
    if (prefersReducedMotion) { pre.remove(); return; }
    gsap.to(pre, {
      y: '-100%',
      duration: 1.1,
      ease: 'power3.inOut',
      onComplete: () => pre.remove(),
    });
  });
});

/* ===================== CURSOR DUST TRAIL ===================== */
function initCursorDust() {
  if (isTouch || prefersReducedMotion) return;
  const canvas = document.getElementById('cursor-dust');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const goldHex = getComputedStyle(document.documentElement).getPropertyValue('--bronze').trim() || '#c9a15e';
  const clean = goldHex.replace('#', '');
  const baseRgb = {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
  const goldRgb = baseRgb;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  let lastX = null, lastY = null;
  const STEP = 24; // px between puffs along the travelled path — keeps the trail gapless at any cursor speed

  function spawn(x, y, vx, vy) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: vx + (Math.random() - 0.5) * 0.3,
      vy: vy + (Math.random() - 0.5) * 0.3,
      r: 40 + Math.random() * 18,
      maxR: 60 + Math.random() * 24,
      life: 1,
      decay: Math.random() * 0.008 + 0.012,
    });
    if (particles.length > 90) particles.shift();
  }

  window.addEventListener('mousemove', (e) => {
    if (lastX === null) {
      spawn(e.clientX, e.clientY, 0, 0);
      lastX = e.clientX;
      lastY = e.clientY;
      return;
    }
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.round(dist / STEP));
    const vx = dx * 0.12;
    const vy = dy * 0.12;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      spawn(lastX + dx * t, lastY + dy * t, vx, vy);
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach((p) => {
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return;
      const eased = 1 - Math.pow(p.life, 2);
      const grown = p.r + (p.maxR - p.r) * eased;
      const alpha = p.life * 0.07;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, grown);
      grad.addColorStop(0, `rgba(${goldRgb.r},${goldRgb.g},${goldRgb.b},${alpha})`);
      grad.addColorStop(1, `rgba(${goldRgb.r},${goldRgb.g},${goldRgb.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, grown, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    particles = particles.filter((p) => p.life > 0);
    requestAnimationFrame(frame);
  }
  frame();
}
initCursorDust();

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
const heroInviteEl = slides[0], ecosystemEl = slides[1], finalEl = slides[2], footerEl = slides[3];

let current = 0;
let animating = false;
const DUR = 1.5;
const OVERFLOW_TOLERANCE = 60; // ignore minor overflow so a slide doesn't require internal scrolling before it advances
const SCRUB_SPEED = 0.00075; // wheel deltaY -> scrub progress

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
}
updateChrome();

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

  gsap.set([leaving, entering], { backfaceVisibility: 'hidden' });
  gsap.set(leaving, { rotateY: 0, opacity: 1, zIndex: slides.length + 1 });
  gsap.set(entering, { rotateY: dir * 90, opacity: 0, zIndex: slides.length + 2 });

  const tl = gsap.timeline({
    defaults: { duration: d, ease: 'power3.inOut' },
    onComplete: () => {
      gsap.set(leaving, { rotateY: 0, opacity: 0, zIndex: leavingIndex + 1, backfaceVisibility: 'visible' });
      gsap.set(entering, { rotateY: 0, zIndex: index + 1, backfaceVisibility: 'visible' });
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

let formHighlightTimeout = null;
function highlightInviteForm() {
  const form = document.getElementById('invite-form');
  if (!form) return;
  clearTimeout(formHighlightTimeout);
  form.classList.remove('form-highlight');
  void form.offsetWidth; // restart the animation if it's already mid-run
  form.classList.add('form-highlight');
  formHighlightTimeout = setTimeout(() => form.classList.remove('form-highlight'), 2100);
}

function focusInviteForm() {
  highlightInviteForm();
  const nameInput = document.querySelector('#invite-form input[name="name"]');
  if (nameInput) nameInput.focus({ preventScroll: true });
}

/* ---- fast-forward the scrub to the invite/form end state, from anywhere on the page ---- */
function applyAction() {
  if (current !== 0) {
    goTo(0); // finish() below snaps scrubProgress to 1 since we're arriving from a later slide
    setTimeout(focusInviteForm, (prefersReducedMotion ? 50 : DUR * 1000) + 150);
    return;
  }
  if (scrubProgress >= 0.999) { focusInviteForm(); return; }
  const proxy = { p: scrubProgress };
  gsap.to(proxy, {
    p: 1,
    duration: prefersReducedMotion ? 0.01 : Math.max(0.4, (1 - scrubProgress) * 1.1),
    ease: 'power2.inOut',
    onUpdate: () => applyProgress(proxy.p),
    onComplete: focusInviteForm,
  });
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
    if (index === 0 && leavingIndex > 0) applyProgress(1);
  };

  const pairKey = [leavingIndex, index].sort((a, b) => a - b).join('-');
  const transitions = {
    '0-1': curtainTransition,
    '1-2': flipTransition,
    '2-3': scaleTransition,
  };
  const run = transitions[pairKey] || scaleTransition;
  run(leaving, entering, leavingIndex, index, finish);
}

/* ---- input: wheel, touch, keyboard, explicit controls ---- */
function activeSlideEl() { return slides[current]; }

window.addEventListener('wheel', (e) => {
  if (animating) { e.preventDefault(); return; }

  if (!PREVIEW_AUTOPLAY && current === 0) {
    if (scrubProgress >= 1 && e.deltaY > 0) {
      const canScrollMore = inviteLayerEl.scrollHeight > inviteLayerEl.clientHeight + OVERFLOW_TOLERANCE;
      if (canScrollMore) {
        const atBottom = inviteLayerEl.scrollTop + inviteLayerEl.clientHeight >= inviteLayerEl.scrollHeight - 2;
        if (!atBottom) return;
      }
      e.preventDefault();
      goTo(1);
      return;
    }
    if (scrubProgress <= 0 && e.deltaY < 0) return;
    e.preventDefault();
    applyProgress(scrubProgress + e.deltaY * SCRUB_SPEED);
    return;
  }

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

  if (!PREVIEW_AUTOPLAY && current === 0) {
    if (dir === 1) {
      if (scrubProgress < 1) { applyProgress(scrubProgress + 0.22); return; }
      goTo(1);
      return;
    }
    if (scrubProgress > 0) { applyProgress(scrubProgress - 0.22); return; }
    return;
  }

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
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    if (!PREVIEW_AUTOPLAY && current === 0 && scrubProgress < 1) { applyProgress(scrubProgress + 0.18); return; }
    goTo(current + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    if (!PREVIEW_AUTOPLAY && current === 0 && scrubProgress > 0) { applyProgress(scrubProgress - 0.18); return; }
    goTo(current - 1);
  }
});

document.getElementById('slide-back').addEventListener('click', () => goTo(current - 1));
document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(el.dataset.goto, 10));
  });
});
document.querySelectorAll('[data-action="apply"]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    applyAction();
  });
});

/* ===================== PER-SLIDE ENTER ANIMATIONS (play once) ===================== */
const visited = new Set();
const enterFns = [null, enterEcosystem, enterFinal, enterFooter];
function playEnter(i) {
  if (visited.has(i)) return;
  visited.add(i);
  const fn = enterFns[i];
  fn && fn();
}

function enterHeroLayer() {
  gsap.to(heroLayerEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  gsap.to(heroLayerEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.6 });

  gsap.to(heroLayerEl.querySelectorAll('.hero-actions .btn'), {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1.4,
  });
}

function enterInviteLayer() {
  gsap.to(inviteLayerEl.querySelectorAll('.eyebrow'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to(inviteLayerEl.querySelectorAll('.mask .line'), { y: '0%', duration: 1.1, ease: 'power4.out', delay: 0.25 });
  gsap.to(inviteLayerEl.querySelectorAll('.reveal-fade'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
  gsap.to(inviteLayerEl.querySelectorAll('.form-field, .invite-form .btn'), {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 1.1,
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
  gsap.to(footerEl.querySelectorAll('.footer-col'), {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.35,
  });
}

visited.add(0);
enterHeroLayer();
applyProgress(0);

/* TEMP PREVIEW: play the frame sequence once, like a normal video, so it can be eyeballed without
   scrolling. Holds on the final frame instead of looping. Remove this block (and flip PREVIEW_AUTOPLAY
   above) once scroll-scrub is confirmed. */
if (PREVIEW_AUTOPLAY) {
  const CLIP_FPS = 24;
  const CLIP_DURATION_S = FRAME_COUNT / CLIP_FPS;
  let autoplayStart = null;
  function autoplayTick(ts) {
    if (autoplayStart === null) autoplayStart = ts;
    const elapsed = (ts - autoplayStart) / 1000;
    const t = Math.min(1, elapsed / CLIP_DURATION_S);
    applyProgress(t);
    if (t < 1) requestAnimationFrame(autoplayTick);
  }
  requestAnimationFrame(autoplayTick);
}

/* ===================== INVITE FORM ===================== */
const inviteForm = document.getElementById('invite-form');
if (inviteForm) {
  inviteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!inviteForm.checkValidity()) {
      inviteForm.reportValidity();
      return;
    }

    const success = document.getElementById('invite-form-success');
    gsap.to(inviteForm, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        inviteForm.style.display = 'none';
        success.classList.add('visible');
        gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      },
    });
  });
}
