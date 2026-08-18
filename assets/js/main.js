document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  highlightActiveNav(header);
  initMobileNav(header);
});

function getPageId(header) {
  if (header.dataset.page) {
    return header.dataset.page;
  }

  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const map = {
    '': 'home',
    'index.html': 'home',
    'programme.html': 'programme',
    'invitation.html': 'invitation',
    'venue.html': 'venue',
    'contact.html': 'contact',
  };

  return map[file] || 'home';
}

function highlightActiveNav(header) {
  const pageId = getPageId(header);
  header.querySelectorAll('.site-nav a[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === pageId;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initMobileNav(header) {
  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('#site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('nav-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
      setOpen(false);
    }
  });
}
