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
