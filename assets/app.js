const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  const focusables = [...container.querySelectorAll(focusableSelector)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

const drawer = document.querySelector('[data-drawer]');
const drawerOverlay = document.querySelector('[data-drawer-overlay]');
const burger = document.querySelector('[data-burger]');
const drawerClose = document.querySelector('[data-drawer-close]');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  document.body.classList.add('no-scroll');
  const first = drawer.querySelector(focusableSelector);
  first?.focus();
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
  burger?.focus();
}

burger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

const modal = document.querySelector('[data-modal]');
const modalOverlay = document.querySelector('[data-modal-overlay]');
const modalOpens = document.querySelectorAll('[data-open-privacy]');
const modalCloses = document.querySelectorAll('[data-close-privacy]');

function openModal() {
  modal.classList.add('open');
  modalOverlay.classList.add('open');
  document.body.classList.add('no-scroll');
  modal.querySelector(focusableSelector)?.focus();
}
function closeModal() {
  modal.classList.remove('open');
  modalOverlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

modalOpens.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openModal(); }));
modalCloses.forEach(btn => btn.addEventListener('click', closeModal));
modalOverlay?.addEventListener('click', closeModal);

const langToggles = document.querySelectorAll('[data-lang-toggle]');
langToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const parent = toggle.closest('.lang');
    parent.classList.toggle('open');
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.lang.open').forEach(item => {
    if (!item.contains(e.target)) item.classList.remove('open');
  });
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    faqItems.forEach(other => {
      if (other !== item) other.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal?.classList.contains('open')) closeModal();
    if (drawer?.classList.contains('open')) closeDrawer();
  }
  if (e.key === 'Tab') {
    if (modal?.classList.contains('open')) trapFocus(modal, e);
    if (drawer?.classList.contains('open')) trapFocus(drawer, e);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.dataset.counter) {
        const end = Number(entry.target.dataset.counter);
        let current = 0;
        const step = Math.max(1, Math.ceil(end / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= end) {
            current = end;
            clearInterval(timer);
          }
          entry.target.textContent = current + (entry.target.dataset.suffix || '');
        }, 26);
      }
      if (entry.target.classList.contains('bar-fill')) {
        entry.target.style.width = entry.target.dataset.width;
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

[...document.querySelectorAll('.reveal, .counter, .bar-fill')].forEach(el => observer.observe(el));
