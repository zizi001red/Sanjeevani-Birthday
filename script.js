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
  initPetals();
  initReveal();
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
  countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  requestAnimationFrame(() => setTimeout(tick, 250));
}

if (isPreview) {
  showSite();
} else {
  tick();
}

// ---- FLOATING PETALS ----
function initPetals() {
  const layer = document.querySelector('.petals');
  if (!layer) return;
  const colors = ['var(--rose)', 'var(--yellow)', 'var(--violet, var(--lavender))', 'var(--orange)', 'var(--mauve)'];
  const count = window.innerWidth < 640 ? 14 : 24;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.animationDuration = 6 + Math.random() * 8 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.opacity = 0.55 + Math.random() * 0.35;
    layer.appendChild(p);
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
  funnyBtn.addEventListener('click', () => {
    funnyReveal.hidden = false;
    funnyReveal.classList.add('reveal', 'in');
    funnyBtn.style.display = 'none';
  });
}
