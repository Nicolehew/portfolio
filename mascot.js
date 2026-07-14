// Nicole mascot — uses the real 3D rendered character art.
// Travels around the screen, hopping to a new corner each time you change
// section, switching pose (waving / presenting) and greeting per section.
// Self-contained: injects its own styles so it works on every page.

(function () {
  const STYLE = `
#mascot-wrap{position:fixed;top:0;left:0;z-index:900;
  transform:translate(-300px,-300px);
  transition:transform .9s cubic-bezier(.34,1.25,.5,1);will-change:transform;
  pointer-events:none;opacity:0;}
#mascot-wrap.ready{opacity:1;}
#mascot-char{cursor:pointer;pointer-events:auto;display:block;
  animation:m-float 3s ease-in-out infinite;transform-origin:50% 100%;}
#mascot-char:hover{animation-play-state:paused;}
#mascot-char.walk{animation:m-walk .9s ease-in-out;}
#m-img{width:98px;height:203px;object-fit:contain;display:block;
  filter:drop-shadow(0 10px 14px rgba(13,27,46,.35));}
@keyframes m-float{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-6px) rotate(1deg);}}
@keyframes m-walk{0%{transform:translateY(0) rotate(0);}
  20%{transform:translateY(-11px) rotate(-5deg);}50%{transform:translateY(0) rotate(0);}
  80%{transform:translateY(-11px) rotate(5deg);}100%{transform:translateY(0) rotate(0);}}
#mascot-bubble{position:absolute;bottom:100%;left:50%;margin-bottom:8px;
  transform:translateX(-50%) translateY(6px) scale(.9);transform-origin:bottom center;
  background:#fff;border:2px solid #c8a96e;border-radius:14px 14px 14px 4px;
  padding:.45rem .65rem;font:600 .68rem/1.35 Inter,system-ui,sans-serif;color:#0d1b2e;
  max-width:160px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.16);
  opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;}
#mascot-bubble.show{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}
@media(max-width:700px){#m-img{width:76px;height:157px;}}
@media(max-width:480px){#m-img{width:60px;height:124px;}#mascot-bubble{max-width:120px;font-size:.6rem;padding:.35rem .5rem;}}`;

  // Sections to track (in order) with the pose + greeting for each.
  const PLAN = [
    { sel: '.hero',          pose: 'm-wave.png?v=3',    msg: "Hi! I'm Nicole \u{1F44B}" },
    { sel: '#about',         pose: 'm-think.png?v=3',   msg: "A bit about me \u{1F4BC}" },
    { sel: '.roles-wrap',    pose: 'm-laptop.png?v=3',  msg: "My career so far \u{1F4BC}" },
    { sel: '#work',          pose: 'm-present.png?v=3', msg: "Here's what I do ✨" },
    { sel: '#case',          pose: 'm-laptop.png?v=3',  msg: "Real results \u{1F4C8}" },
    { sel: '#ai',            pose: 'm-present.png?v=3', msg: "AI + Canva creative ✨" },
    { sel: '#contact',       pose: 'm-wave.png?v=3',    msg: "Let's connect! \u{1F680}" },
    { sel: '.proj-hero',     pose: 'm-present.png?v=3', msg: "All my projects! \u{1F389}" },
    { sel: '.projects-grid', pose: 'm-laptop.png?v=3',  msg: "Click any image to view full size \u{1F50D}" },
  ];

  const CLICKS = [
    "Let's grow your brand! \u{1F680}",
    "Meta-certified \u{1F4AA}",
    "RM1.68 CPL? Yep, really!",
    "2,000 sign-ups in 10 days ✨",
    "MSc Distinction \u{1F393}",
  ];

  // Preload all poses so swaps are instant
  ['m-wave.png?v=3', 'm-think.png?v=3', 'm-present.png?v=3', 'm-laptop.png?v=3'].forEach(s => { const i = new Image(); i.src = s; });

  function inject() {
    const s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);
    const wrap = document.createElement('div');
    wrap.id = 'mascot-wrap';
    wrap.innerHTML = `<div id="mascot-bubble"></div>
      <div id="mascot-char"><img id="m-img" src="m-wave.png?v=3" alt="Nicole mascot"/></div>`;
    document.body.appendChild(wrap);
    return wrap;
  }

  function start() {
    const wrap = inject();
    const char = wrap.querySelector('#mascot-char');
    const img = wrap.querySelector('#m-img');
    const bubble = wrap.querySelector('#mascot-bubble');
    const present = PLAN.map(p => ({ ...p, el: document.querySelector(p.sel) })).filter(p => p.el);
    if (!present.length) return;

    let lastIdx = -1;

    function corners() {
      const W = window.innerWidth || document.documentElement.clientWidth || 1200;
      const H = window.innerHeight || document.documentElement.clientHeight || 800;
      const w = wrap.offsetWidth || 80, h = wrap.offsetHeight || 170;
      const m = 20;
      const navEl = document.querySelector('nav');
      const nav = (navEl && navEl.getBoundingClientRect().height) || 70;
      return [
        [W - w - m, nav + 12],                // top-right (hero — clear of headline/socials)
        [m, H - h - m],                       // bottom-left
        [W - w - m, H - h - m],               // bottom-right
        [m, Math.max(nav + 12, (H - h) / 2)], // mid-left
        [(W - w) / 2, H - h - m],             // bottom-centre
      ];
    }

    function moveTo(i, msg) {
      const p = present[i];
      if (p && img.getAttribute('src') !== p.pose) img.src = p.pose;
      const c = corners();
      const pos = c[i % c.length];
      wrap.classList.add('ready');
      wrap.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
      char.classList.remove('walk'); void char.offsetWidth; char.classList.add('walk');
      if (msg) showBubble(msg);
    }

    function showBubble(text) {
      bubble.textContent = text;
      bubble.classList.add('show');
      clearTimeout(bubble._t);
      bubble._t = setTimeout(() => bubble.classList.remove('show'), 3800);
    }

    // Initial placement (with fallbacks so it always lands)
    lastIdx = 0;
    requestAnimationFrame(() => moveTo(0, present[0].msg));
    setTimeout(() => moveTo(0, present[0].msg), 90);
    window.addEventListener('load', () => moveTo(lastIdx < 0 ? 0 : lastIdx));

    // Move when the section nearest the viewport centre changes
    function activeIndex() {
      const vc = (window.innerHeight || document.documentElement.clientHeight || 800) / 2;
      let bestI = 0, bestD = Infinity;
      present.forEach((p, i) => {
        const r = p.el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - vc);
        if (d < bestD) { bestD = d; bestI = i; }
      });
      return bestI;
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const i = activeIndex();
        if (i !== lastIdx) { lastIdx = i; moveTo(i, present[i].msg); }
      });
    }, { passive: true });

    window.addEventListener('resize', () => {
      const c = corners();
      const pos = c[(lastIdx < 0 ? 0 : lastIdx) % c.length];
      wrap.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
    });

    // Click to talk + little hop
    let ci = 0;
    char.addEventListener('click', () => {
      ci = (ci + 1) % CLICKS.length;
      showBubble(CLICKS[ci]);
      char.classList.remove('walk'); void char.offsetWidth; char.classList.add('walk');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
