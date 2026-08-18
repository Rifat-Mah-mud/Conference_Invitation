document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  highlightActiveNav(header);
  initMobileNav(header);

  initCountdown();
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

/**
 * Countdown helper.
 * @param {Date|string|number} targetDate - Target time (local JS Date, ISO string with TZ, or timestamp ms)
 * @returns {{days:number, hours:number, minutes:number, seconds:number}} remaining time components
 */
function getCountdown(targetDate) {
  const targetMs = targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();
  const nowMs = Date.now();

  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function initCountdown() {
  const boxes = document.getElementById('countdownBoxes');
  const begunEl = document.getElementById('countdownBegun');
  if (!boxes || !begunEl) return;

  const dayEl = document.getElementById('countDays');
  const hourEl = document.getElementById('countHours');
  const minuteEl = document.getElementById('countMinutes');
  const secondEl = document.getElementById('countSeconds');

  const target = new Date('2026-09-19T00:00:00+06:00'); // Bhutan time (UTC+6)

  const render = () => {
    const remaining = getCountdown(target);
    if (!remaining) {
      boxes.hidden = true;
      begunEl.hidden = false;
      return;
    }

    dayEl.textContent = String(remaining.days);
    hourEl.textContent = String(remaining.hours).padStart(2, '0');
    minuteEl.textContent = String(remaining.minutes).padStart(2, '0');
    secondEl.textContent = String(remaining.seconds).padStart(2, '0');
  };

  render();
  window.setInterval(render, 1000);
}
