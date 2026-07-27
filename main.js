// Nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.about-copy, .about-media, .services-head, .services-list li, .stat, .wtile, .work-head, .contact h2, .contact-sub, .contact-links, .role-card');
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

// Logo marquees — clone each track's items until it's wide enough for a
// seamless loop at any viewport width, instead of guessing a fixed copy count.
(function () {
  const tracks = document.querySelectorAll('[data-marquee]');
  if (!tracks.length) return;
  const PX_PER_SEC = 34;

  function ensureCoverage(track) {
    const container = track.parentElement;
    const originals = track._marqueeOriginals || (track._marqueeOriginals = [...track.children]);
    if (!originals.length) return;
    const setWidth = track._marqueeSetWidth || (track._marqueeSetWidth = (() => {
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
      return originals.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) + gap * originals.length;
    })());
    if (!setWidth) return;

    const needed = container.clientWidth * 2 + setWidth;
    let current = track.children.length / originals.length * setWidth;
    while (current < needed) {
      originals.forEach(el => {
        const clone = el.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      current += setWidth;
    }
    track.style.setProperty('--set-width', setWidth + 'px');
    track.style.setProperty('--marquee-duration', (setWidth / PX_PER_SEC) + 's');
  }

  function buildAll() { tracks.forEach(ensureCoverage); }
  window.addEventListener('load', buildAll);
  if (document.readyState === 'complete') buildAll();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildAll, 250);
  });
})();
