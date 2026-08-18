document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  if (header) {
    highlightActiveNav(header);
    initMobileNav(header);
  }

  initHeroSequence();
  initScrollReveal();
  initCountdown();
  initProgrammeTabs();
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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeroSequence() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const isHomeHero = !hero.className.split(/\s+/).some((cls) => cls.startsWith('hero--'));
  const sequenceSelectors = isHomeHero
    ? ['.hero__title', '.hero__tagline', '.hero__pills', '.countdown']
    : ['.hero-badge', '.hero__eyebrow', ':scope > .hero__content > .eyebrow', '.hero__title', '.hero__tagline', '.hero__tagline-upper', '.hero__kicker', '.hero__sub'];

  const sequenceTargets = sequenceSelectors
    .map((selector) => hero.querySelector(selector))
    .filter(Boolean);

  if (!sequenceTargets.length) return;

  if (prefersReducedMotion()) {
    sequenceTargets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  sequenceTargets.forEach((element, index) => {
    element.classList.add('hero-sequence-item');
    window.setTimeout(() => {
      element.classList.add('is-visible');
    }, 180 + index * 280);
  });
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll(`
    .info-strip__col,
    .about .eyebrow,
    .about .line-starline,
    .about .section-title,
    .about .lead,
    .feature-card,
    .programme-preview .eyebrow,
    .programme-preview .line-starline,
    .programme-preview .section-title,
    .preview-card,
    .programme-preview .section-actions,
    .venue-teaser .venue-media,
    .venue-teaser .venue-copy,
    .small-card,
    .registration-cta .section-title,
    .registration-cta .line-starline,
    .registration-cta .registration-text,
    .registration-cta .registration-email,
    .registration-cta .section-actions,
    .day-tabs,
    .day-panel,
    .registration-cta--strip .registration-cta__heading,
    .registration-cta--strip .registration-text,
    .registration-cta--strip .section-actions,
    .letter-card,
    .theme-callout,
    .invitation-info__card,
    .venue-detail-media,
    .venue-detail-copy,
    .experience-bhutan .eyebrow,
    .experience-bhutan .line-starline,
    .experience-bhutan .experience-title,
    .experience-bhutan .experience-text,
    .bhutan-card,
    .getting-to-bhutan .experience-eyebrow,
    .getting-to-bhutan .line-starline,
    .getting-to-bhutan .experience-title,
    .getting-card,
    .venue-cta__title,
    .venue-cta__text,
    .venue-cta .section-actions,
    .contact-info-card,
    .contact-event-card,
    .contact-form-card
  `);

  if (!revealTargets.length) return;

  const reduceMotion = prefersReducedMotion();
  revealTargets.forEach((element) => {
    element.classList.add('scroll-reveal');
    if (reduceMotion) {
      element.classList.add('is-visible');
    }
  });

  if (reduceMotion) return;

  document.querySelectorAll(`
    .info-strip__inner,
    .cards-grid,
    .preview-cards,
    .invitation-info__grid,
    .bhutan-attractions,
    .getting-grid,
    .contact-sidebar
  `).forEach((group) => {
    Array.from(group.children)
      .filter((child) => child.classList.contains('scroll-reveal'))
      .forEach((child, index) => {
        child.style.setProperty('--reveal-delay', `${index * 90}ms`);
      });
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

const PROGRAMME_DAYS = [
  {
    kicker: 'DAY 1',
    title: 'Hypertension',
    weekday: 'Friday',
    dateLabel: 'Friday, 19 September 2026',
    sessions: [
      { time: '08:30', title: 'Registration & Welcome Coffee', type: 'break' },
      { time: '09:00', title: "Inaugural Ceremony & Chairpersons' Address", type: 'session' },
      { time: '09:45', title: "Hypertension Guidelines 2026: What's New?", type: 'session' },
      { time: '10:30', title: 'Resistant Hypertension: Diagnosis & Management', type: 'session' },
      { time: '11:00', title: 'Tea Break & Networking', type: 'break' },
      { time: '11:30', title: 'Renal Denervation: Evidence & Practice', type: 'session' },
      { time: '12:15', title: 'Hypertension in Special Populations', type: 'session' },
      { time: '13:00', title: 'Lunch Break', type: 'break' },
      { time: '14:00', title: 'Target Organ Protection in Hypertension', type: 'session' },
      { time: '14:45', title: 'Interactive Case Discussions: Hypertension', type: 'session' },
      { time: '15:30', title: 'Tea Break', type: 'break' },
      { time: '16:00', title: 'Panel Discussion: Hypertension in South Asia', type: 'session' },
      { time: '17:00', title: 'End of Day 1', type: 'break' },
    ],
  },
  {
    kicker: 'DAY 2',
    title: 'Dyslipidemia & Prevention',
    weekday: 'Saturday',
    dateLabel: 'Saturday, 20 September 2026',
    theme: 'navy',
    sessions: [
      { time: '08:30', title: 'Morning Coffee & Networking', type: 'break' },
      { time: '09:00', title: 'Lipid Guidelines 2026: Key Updates', type: 'session' },
      { time: '09:45', title: 'PCSK9 Inhibitors: Real-World Evidence', type: 'session' },
      { time: '10:30', title: 'Cardiovascular Risk Calculators in South Asia', type: 'session' },
      { time: '11:00', title: 'Tea Break & Networking', type: 'break' },
      { time: '11:30', title: 'Preventive Cardiology: Lifestyle & Pharmacotherapy', type: 'session' },
      { time: '12:15', title: 'Statin Intolerance: Practical Approaches', type: 'session' },
      { time: '13:00', title: 'Lunch Break', type: 'break' },
      { time: '14:00', title: 'Triglycerides & Residual Risk', type: 'session' },
      { time: '14:45', title: 'Interactive Case Workshop: Dyslipidemia', type: 'session' },
      { time: '15:30', title: 'Tea Break', type: 'break' },
      { time: '16:00', title: 'Panel Discussion: Prevention Strategies for South Asia', type: 'session' },
      { time: '17:00', title: 'Congress Dinner & Cultural Evening', type: 'break' },
    ],
  },
  {
    kicker: 'DAY 3',
    title: 'Heart Failure & Future Directions',
    weekday: 'Sunday',
    dateLabel: 'Sunday, 21 September 2026',
    theme: 'gold',
    sessions: [
      { time: '08:30', title: 'Morning Coffee & Networking', type: 'break' },
      { time: '09:00', title: 'HFrEF & HFpEF: 2026 Updates', type: 'session' },
      { time: '09:45', title: 'SGLT2 Inhibitors & Beyond: Expanding Indications', type: 'session' },
      { time: '10:30', title: 'Device Therapy in Heart Failure', type: 'session' },
      { time: '11:00', title: 'Tea Break & Networking', type: 'break' },
      { time: '11:30', title: 'Emerging Therapeutics in Cardiovascular Medicine', type: 'session' },
      { time: '12:15', title: 'Artificial Intelligence in Cardiology', type: 'session' },
      { time: '13:00', title: 'Lunch Break', type: 'break' },
      { time: '14:00', title: 'Closing Symposium: The Future of CV Care in South Asia', type: 'session' },
      { time: '15:00', title: 'Valedictory Ceremony & Closing Address', type: 'session' },
      { time: '15:45', title: 'Farewell Tea', type: 'break' },
    ],
  },
];

function renderSchedule(day) {
  const list = document.getElementById('scheduleList');
  if (!list) return;

  list.replaceChildren();

  day.sessions.forEach((item) => {
    const row = document.createElement('li');
    row.className = `schedule-row schedule-row--${item.type}`;

    const time = document.createElement('span');
    time.className = 'schedule-row__time';
    time.textContent = item.time;

    const dot = document.createElement('span');
    dot.className = 'schedule-row__dot';
    dot.setAttribute('aria-hidden', 'true');

    const title = document.createElement('span');
    title.className = 'schedule-row__title';
    title.textContent = item.title;

    row.append(time, dot, title);
    list.appendChild(row);
  });
}

function showProgrammeDay(index, tabs, panel) {
  const day = PROGRAMME_DAYS[index];
  if (!day) return;

  tabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  document.getElementById('dayPanelKicker').textContent = day.kicker;
  document.getElementById('dayPanelTitle').textContent = day.title;
  document.getElementById('dayPanelDate').textContent = day.dateLabel;
  panel.setAttribute('aria-labelledby', tabs[index].id);
  panel.setAttribute('data-theme', day.theme || 'maroon');

  renderSchedule(day);
}

function initProgrammeTabs() {
  const tabsRoot = document.getElementById('dayTabs');
  const panel = document.getElementById('dayPanel');
  if (!tabsRoot || !panel) return;

  const tabs = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  showProgrammeDay(0, tabs, panel);

  tabsRoot.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !tabsRoot.contains(tab)) return;
    showProgrammeDay(Number(tab.dataset.day), tabs, panel);
  });

  tabsRoot.addEventListener('keydown', (event) => {
    const currentIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    tabs[nextIndex].focus();
    showProgrammeDay(nextIndex, tabs, panel);
  });
}
