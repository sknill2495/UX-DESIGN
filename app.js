/* ===================================================
   Navigation scroll state
=================================================== */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navMobile.classList.remove('open'))
);

/* ===================================================
   Hero background parallax & load animation
=================================================== */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('load', () => heroBg.classList.add('loaded'));

document.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
  }
}, { passive: true });

/* ===================================================
   Countdown timer  —  June 14 2026, 16:00 Tuscany (UTC+2)
=================================================== */
const weddingDate = new Date('2026-06-14T14:00:00Z'); // UTC

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function updateCountdown() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<span style="color:#fff;font-family:var(--font-ser);font-size:2rem;font-style:italic">Today is the day! ♡</span>';
    return;
  }
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);
  document.getElementById('days').textContent    = pad(days, 3);
  document.getElementById('hours').textContent   = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===================================================
   Intersection observer — reveal on scroll
=================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay * 1000);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const idx = siblings.indexOf(el);
  el.dataset.delay = (idx * 0.12).toFixed(2);
  revealObserver.observe(el);
});

/* ===================================================
   Animated floating petals
=================================================== */
const canvas = document.getElementById('petals-canvas');
const ctx    = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const COLORS = ['#e8c5b0', '#c9877a', '#f5e9d8', '#d4b98a', '#f0d6c4'];

class Petal {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * -H : -20;
    this.r  = 4 + Math.random() * 7;
    this.vx = (Math.random() - .5) * .8;
    this.vy = .4 + Math.random() * .9;
    this.va = (Math.random() - .5) * .015;
    this.a  = Math.random() * Math.PI * 2;
    this.alpha = .35 + Math.random() * .45;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.swing = Math.random() * Math.PI * 2;
    this.swingSpeed = .01 + Math.random() * .02;
    this.swingAmp   = 0.3 + Math.random() * .5;
  }
  update() {
    this.swing += this.swingSpeed;
    this.x += this.vx + Math.sin(this.swing) * this.swingAmp;
    this.y += this.vy;
    this.a += this.va;
    if (this.y > H + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const petals = Array.from({ length: 50 }, () => new Petal());

function animatePetals() {
  ctx.clearRect(0, 0, W, H);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animatePetals);
}
animatePetals();

/* ===================================================
   RSVP form submission
=================================================== */
const form    = document.getElementById('rsvp-form');
const success = document.getElementById('rsvp-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simple validation
  const fname = form.fname.value.trim();
  const lname = form.lname.value.trim();
  const email = form.email.value.trim();
  if (!fname || !lname || !email) {
    const firstEmpty = [form.fname, form.lname, form.email].find(f => !f.value.trim());
    firstEmpty.focus();
    firstEmpty.style.borderColor = '#c9877a';
    setTimeout(() => firstEmpty.style.borderColor = '', 2000);
    return;
  }

  // Simulate async submit
  const btn = form.querySelector('.rsvp-submit');
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
  }, 1200);
});

/* ===================================================
   Smooth scroll offset (compensate for fixed nav)
=================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
