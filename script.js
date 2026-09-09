// ---- CONFIG ----
// Sept 10, 2026, 00:00 IST expressed in UTC (IST = UTC+5:30)
const UNLOCK_AT = Date.UTC(2026, 8, 9, 18, 30, 0);
const params = new URLSearchParams(window.location.search);
const isPreview = params.get('preview') === '1';

const lockScreen = document.getElementById('lock-screen');
const site = document.getElementById('site');
const countdownEl = document.getElementById('countdown');

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// palette used for petals + celebration bursts
const PETAL_COLORS = ['#D89AA0', '#F3D9DC', '#E7B85C', '#F08A7E', '#D8CDEA'];
const GLYPHS = ['\u2665', '\u2726', '\u273F']; // heart, sparkle, floral star

function showSite() {
  lockScreen.remove();
  site.hidden = false;
  initPetals();
  initReveal();
  initClosingHearts();
  // one orchestrated celebration the moment the doors open
  if (!REDUCE) setTimeout(celebrationShower, 500);
}

// ---- COUNTDOWN ----
let lastSeconds = null;
function renderCountdown(d, h, m, s) {
  const units = [
    { n: d, label: 'days' },
    { n: h, label: 'hours' },
    { n: m, label: 'mins' },
    { n: s, label: 'secs' },
  ];
  countdownEl.innerHTML = units.map(function (u, i) {
    const pulse = (i === 3 && u.n !== lastSeconds) ? ' pulse' : '';
    const num = String(u.n).padStart(2, '0');
    return '<div class="cd-unit' + pulse + '"><span class="cd-num">' + num +
           '</span><div class="cd-label">' + u.label + '</div></div>';
  }).join('');
  lastSeconds = s;
}

function tick() {
  const now = Date.now();
  const diff = UNLOCK_AT - now;
  if (diff <= 0) {
    showSite();
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  renderCountdown(d, h, m, s);
  requestAnimationFrame(() => setTimeout(tick, 250));
}

if (isPreview) {
  showSite();
} else {
  tick();
}

// ---- FLOATING PETALS ----
function initPetals() {
  if (REDUCE) return;
  const layer = document.querySelector('.petals');
  if (!layer) return;
  const count = window.innerWidth < 640 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const outer = document.createElement('div');
    outer.className = 'petal';
    outer.style.left = Math.random() * 100 + 'vw';
    outer.style.animationDuration = 9 + Math.random() * 11 + 's';
    outer.style.animationDelay = -Math.random() * 15 + 's';

    const inner = document.createElement('span');
    inner.className = 'inner';
    inner.style.animationDuration = 2.5 + Math.random() * 3 + 's';
    inner.style.animationDelay = -Math.random() * 3 + 's';

    // ~25% are glyphs (hearts / sparkles), the rest are soft petals
    if (Math.random() < 0.25) {
      const g = document.createElement('span');
      g.className = 'glyph';
      g.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      g.style.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      g.style.opacity = 0.5 + Math.random() * 0.4;
      g.style.fontSize = 12 + Math.random() * 12 + 'px';
      inner.appendChild(g);
    } else {
      const shape = document.createElement('span');
      shape.className = 'shape';
      const size = 8 + Math.random() * 10;
      shape.style.width = size + 'px';
      shape.style.height = size + 'px';
      shape.style.background = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      shape.style.opacity = 0.25 + Math.random() * 0.35;
      inner.appendChild(shape);
    }

    outer.appendChild(inner);
    layer.appendChild(outer);
  }
}

// ---- CELEBRATION BURSTS ----
function makePiece(x, y, glyph, color) {
  const el = document.createElement('span');
  el.className = 'burst-piece';
  el.textContent = glyph;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = color;
  el.style.fontSize = 14 + Math.random() * 16 + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  return el;
}

// a rising shower across the screen when the site unlocks
function celebrationShower() {
  const n = window.innerWidth < 640 ? 26 : 46;
  for (let i = 0; i < n; i++) {
    setTimeout(function () {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 20;
      const el = makePiece(x, y,
        GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]);
      el.style.setProperty('--bx', (Math.random() * 160 - 80) + 'px');
      el.style.setProperty('--by', -(window.innerHeight * (0.7 + Math.random() * 0.5)) + 'px');
      el.style.setProperty('--br', (Math.random() * 720 - 360) + 'deg');
      el.style.animationDuration = 2 + Math.random() * 1.6 + 's';
    }, i * 45);
  }
}

// a small radial pop at a point (button press, taps)
function popBurst(x, y, count) {
  if (REDUCE) return;
  const n = count || 14;
  for (let i = 0; i < n; i++) {
    const el = makePiece(x, y,
      GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]);
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 60 + Math.random() * 90;
    el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--by', Math.sin(angle) * dist - 30 + 'px');
    el.style.setProperty('--br', (Math.random() * 540 - 270) + 'deg');
  }
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => io.observe(t));
}

// ---- MEMORIES BUTTON ----
const openMemoriesBtn = document.getElementById('open-memories');
const timeline = document.getElementById('timeline');
if (openMemoriesBtn) {
  openMemoriesBtn.addEventListener('click', () => {
    timeline.hidden = false;
    openMemoriesBtn.style.display = 'none';
    setTimeout(() => {
      timeline.querySelectorAll('.reveal').forEach((el) => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
            }
          });
        }, { threshold: 0.15 });
        io.observe(el);
      });
      timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });
}

// ---- FUNNY BUTTON ----
const funnyBtn = document.getElementById('funny-button');
const funnyReveal = document.getElementById('funny-reveal');
if (funnyBtn) {
  funnyBtn.addEventListener('click', (e) => {
    const r = funnyBtn.getBoundingClientRect();
    popBurst(r.left + r.width / 2, r.top + r.height / 2, 18);
    funnyReveal.hidden = false;
    funnyReveal.classList.add('reveal', 'in');
    funnyBtn.style.display = 'none';
  });
}

// ---- CLOSING: tap to release hearts ----
function initClosingHearts() {
  const closing = document.getElementById('closing');
  if (!closing) return;
  if (!REDUCE) {
    const hint = document.createElement('p');
    hint.className = 'closing-hint';
    hint.textContent = 'tap anywhere \u2665';
    closing.appendChild(hint);
  }
  closing.addEventListener('pointerdown', (e) => {
    popBurst(e.clientX, e.clientY, 12);
  });
}

