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
