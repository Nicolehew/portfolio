// Nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.about-copy, .about-media, .services-head, .services-list li, .stat, .wtile, .work-head, .contact h2, .contact-sub, .contact-links');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => { el.classList.add('reveal'); obs.observe(el); });

// Lightbox — click any AI/Canva visual to expand to full view
(function () {
  const imgs = document.querySelectorAll('.ailab-gallery img, .ailab-post-media img');
  if (!imgs.length) return;
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = '<span id="lightbox-close" aria-label="Close">&times;</span><img id="lightbox-img" alt="Expanded view" />';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('#lightbox-img');
  const open = (src) => { lbImg.src = src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  imgs.forEach(im => {
    im.style.cursor = 'zoom-in';
    im.addEventListener('click', () => open(im.currentSrc || im.src));
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
