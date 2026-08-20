// KIEFER FILM — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initFilters();
  initLightbox();
  initWorkCards();
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
  const titleEl = lightbox.querySelector('.lightbox__title');
  const metaEl = lightbox.querySelector('.lightbox__cat');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const label = trigger.dataset.label || mediaEl.dataset.label || '';
      const ratio = trigger.dataset.ratio || '16/9';
      mediaEl.setAttribute('data-label', label);
      mediaEl.style.setProperty('--ratio', ratio);
      titleEl.textContent = trigger.dataset.title || '';
      if(metaEl) metaEl.textContent = trigger.dataset.meta || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
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
