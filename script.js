// ---- CONFIG ----
// Set to false once you're ready to send the real link — that turns the countdown lock back on.
const DEV_MODE = true;

// Sept 10, 2026, 00:00 IST expressed in UTC (IST = UTC+5:30)
const UNLOCK_AT = Date.UTC(2026, 8, 9, 18, 30, 0);
const params = new URLSearchParams(window.location.search);
const isPreview = DEV_MODE || params.get('preview') === '1';

const lockScreen = document.getElementById('lock-screen');
const site = document.getElementById('site');
const countdownEl = document.getElementById('countdown');

function showSite() {
  lockScreen.remove();
  site.hidden = false;
  initReveal();
  initProgress();
  initLightbox();
  initButterflies();
}

function tick() {
  const now = Date.now();
  const diff = UNLOCK_AT - now;
  if (diff <= 0) { showSite(); return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  requestAnimationFrame(() => setTimeout(tick, 250));
}

if (isPreview) { showSite(); } else { tick(); }

// ---- BUTTERFLIES ----
function initButterflies() {
  const layer = document.querySelector('.butterflies');
  if (!layer) return;
  const svgMarkup = `<svg viewBox="0 0 40 30" width="26" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15 C 10 0, 0 5, 5 15 C 0 25, 10 30, 20 15 Z" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="0.6"/>
    <path d="M20 15 C 30 0, 40 5, 35 15 C 40 25, 30 30, 20 15 Z" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="0.6"/>
    <line x1="20" y1="8" x2="20" y2="22" stroke="var(--frame)" stroke-width="1"/>
  </svg>`;
  const count = window.innerWidth < 640 ? 3 : 5;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'butterfly';
    b.innerHTML = svgMarkup;
    b.style.top = 10 + Math.random() * 70 + 'vh';
    b.style.left = '-40px';
    b.style.animationDuration = 16 + Math.random() * 10 + 's';
    b.style.animationDelay = Math.random() * 14 + 's';
    layer.appendChild(b);
  }
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((t) => io.observe(t));
}

// scroll reveal for elements that unhide later (inside the galleries section)
function observeReveals(root) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  root.querySelectorAll('.reveal').forEach((t) => io.observe(t));
}

// ---- SCROLL PROGRESS ----
function initProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
}

// ---- NOTE REVEAL ----
const openNoteBtn = document.getElementById('open-note');
const noteCard = document.getElementById('note-card');
if (openNoteBtn) {
  openNoteBtn.addEventListener('click', () => {
    noteCard.hidden = false;
    openNoteBtn.style.display = 'none';
    setTimeout(() => {
      noteCard.classList.add('in');
      noteCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 30);
  });
}

// ---- MEMORIES / GALLERIES BUTTON ----
const openMemoriesBtn = document.getElementById('open-memories');
const timeline = document.getElementById('timeline');
if (openMemoriesBtn) {
  openMemoriesBtn.addEventListener('click', () => {
    timeline.hidden = false;
    openMemoriesBtn.style.display = 'none';
    setTimeout(() => {
      observeReveals(timeline);
      timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });
}

// ---- LIGHTBOX ----
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  if (!lightbox) return;

  document.addEventListener('click', (e) => {
    const figure = e.target.closest('.framed-photo');
    if (figure) {
      const img = figure.querySelector('img');
      lightboxImg.src = img.src;
      lightboxCaption.textContent = figure.dataset.caption || '';
      lightbox.hidden = false;
      return;
    }
    if (e.target.closest('.lightbox')) {
      lightbox.hidden = true;
    }
  });
}
