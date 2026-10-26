// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Header scroll state
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
sections.forEach(sec => sectionObserver.observe(sec));

// Project galleries: thumbnails swap the main image
document.querySelectorAll('.case-gallery').forEach(gallery => {
  const mainImg = gallery.querySelector('.gallery-main img');
  const caption = gallery.querySelector('.gallery-caption');
  const thumbs = gallery.querySelectorAll('.gallery-thumbs button');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.caption;
      caption.textContent = thumb.dataset.caption;
    });
  });
  gallery.querySelector('.gallery-main').addEventListener('click', () => {
    const index = [...thumbs].findIndex(t => t.classList.contains('is-active'));
    openLightbox(thumbs, Math.max(index, 0));
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let lightboxItems = [];
let lightboxIndex = 0;

function showLightboxItem(i) {
  lightboxIndex = (i + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[lightboxIndex];
  lightboxImg.src = item.dataset.src;
  lightboxImg.alt = item.dataset.caption;
  lightboxCaption.textContent = item.dataset.caption;
}
function openLightbox(items, i) {
  lightboxItems = [...items];
  lightbox.querySelectorAll('.lightbox-nav').forEach(b => b.hidden = lightboxItems.length < 2);
  showLightboxItem(i);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showLightboxItem(lightboxIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showLightboxItem(lightboxIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxItem(lightboxIndex - 1);
  if (e.key === 'ArrowRight') showLightboxItem(lightboxIndex + 1);
});
