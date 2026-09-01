// KIEFER FILM — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initFilters();
  initLightbox();
  initWorkCards();
  initFontCycle();
  initInlineVideo();
  initCompareSliders();
});

/* Mobile nav toggle */
function initNav(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.mobile-menu');
  if(!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* Scroll reveal */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

/* Category filters (photography + projects) */
function initFilters(){
  const filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach(group => {
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector);
    const buttons = group.querySelectorAll('button');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;

        items.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  });
}

/* Lightbox for gallery + project items */
function initLightbox(){
  const lightbox = document.querySelector('.lightbox');
  if(!lightbox) return;

  const mediaEl = lightbox.querySelector('.lightbox__media');
  const videoWrap = lightbox.querySelector('.lightbox__video-wrap');
  const videoEl = lightbox.querySelector('.lightbox__video');
  const imgEl = lightbox.querySelector('.lightbox__img');
  const titleEl = lightbox.querySelector('.lightbox__title');
  const metaEl = lightbox.querySelector('.lightbox__cat');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const youtubeId = trigger.dataset.youtube;
      const imgSrc = trigger.dataset.img;

      if(youtubeId && videoWrap && videoEl){
        videoEl.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
        videoWrap.classList.add('is-active');
        mediaEl.classList.add('is-hidden');
        if(imgEl){ imgEl.classList.remove('is-active'); imgEl.src = ''; }
      } else if(imgSrc && imgEl){
        imgEl.src = imgSrc;
        imgEl.alt = trigger.dataset.title || '';
        imgEl.classList.add('is-active');
        mediaEl.classList.add('is-hidden');
        if(videoWrap && videoEl){ videoWrap.classList.remove('is-active'); videoEl.src = ''; }
      } else {
        if(videoWrap && videoEl){
          videoWrap.classList.remove('is-active');
          videoEl.src = '';
        }
        if(imgEl){ imgEl.classList.remove('is-active'); imgEl.src = ''; }
        mediaEl.classList.remove('is-hidden');
        const label = trigger.dataset.label || mediaEl.dataset.label || '';
        const ratio = trigger.dataset.ratio || '16/9';
        mediaEl.setAttribute('data-label', label);
        mediaEl.style.setProperty('--ratio', ratio);
      }

      titleEl.textContent = trigger.dataset.title || '';
      if(metaEl) metaEl.textContent = trigger.dataset.meta || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if(imgEl){ imgEl.classList.remove('is-active'); imgEl.src = ''; }
    if(videoWrap && videoEl){
      videoEl.src = '';
      videoWrap.classList.remove('is-active');
    }
  };
  closeBtn && closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
}

/* Expandable work rows on the projects page */
function initWorkCards(){
  const cards = document.querySelectorAll('.work-card[data-expand]');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.closest('a,button')) return;
    });
  });
}

/* Click-to-play video embed (replaces its own thumbnail, no modal) */
function initInlineVideo(){
  document.querySelectorAll('[data-inline-video]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.youtube;
      if(!id) return;
      const title = el.dataset.title || 'Video';
      el.innerHTML = `<iframe class="video-embed__iframe" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="${title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      el.classList.add('is-playing');
    }, { once: true });
  });
}

/* Before/after comparison sliders */
function initCompareSliders(){
  document.querySelectorAll('[data-compare]').forEach(el => {
    let dragging = false;

    const setPos = (clientX) => {
      const rect = el.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      el.style.setProperty('--pos', pct + '%');
      el.setAttribute('aria-valuenow', String(Math.round(pct)));
    };

    el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    el.setAttribute('aria-valuenow', '50');
    el.setAttribute('aria-label', el.dataset.compareLabel || 'Vorher/Nachher-Vergleich');
    el.setAttribute('tabindex', '0');

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    el.addEventListener('pointermove', (e) => {
      if(!dragging) return;
      setPos(e.clientX);
    });
    const stopDrag = () => { dragging = false; };
    el.addEventListener('pointerup', stopDrag);
    el.addEventListener('pointercancel', stopDrag);

    el.addEventListener('keydown', (e) => {
      const current = parseFloat(el.style.getPropertyValue('--pos')) || 50;
      if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        const next = Math.min(100, Math.max(0, current + (e.key === 'ArrowLeft' ? -5 : 5)));
        el.style.setProperty('--pos', next + '%');
        el.setAttribute('aria-valuenow', String(Math.round(next)));
        e.preventDefault();
      }
    });
  });
}

/* Rapid font-cycling on the hero "MOTION" word */
function initFontCycle(){
  const wrap = document.querySelector('.motion-wrap');
  const live = document.querySelector('.motion-live');
  if(!wrap || !live) return;

  const fonts = [
    "'Playfair Display', serif",
    "'Abril Fatface', serif",
    "'Cormorant Garamond', serif",
    "'Bebas Neue', sans-serif",
    "'Caveat', cursive",
    "'Fredoka', sans-serif",
    "'Bungee', sans-serif",
    "'Space Mono', monospace",
    "'Anton', sans-serif",
  ];

  let index = 0;
  let timer = null;

  wrap.addEventListener('mouseenter', () => {
    if(timer) return;
    timer = setInterval(() => {
      index = (index + 1) % fonts.length;
      live.style.fontFamily = fonts[index];
    }, 130);
  });

  wrap.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = null;
    live.style.fontFamily = '';
  });
}
