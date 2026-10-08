/* =========================================================
   Mohan K — Portfolio  |  script.js
   Vanilla JavaScript only. No libraries, no build step.
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ------------------------------------------------------
     1. PRELOADER
  ------------------------------------------------------ */
  window.addEventListener('load', () => {
    const pl = $('#preloader');
    if (!pl) return;
    setTimeout(() => pl.classList.add('hide'), 420);
    setTimeout(() => { pl.style.display = 'none'; }, 1200);
  });

  /* ------------------------------------------------------
     2. THEME TOGGLE  (remembers choice)
  ------------------------------------------------------ */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('mk-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  $('#themeToggle')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('mk-theme', next);
  });

  /* ------------------------------------------------------
     3. HEADER + MOBILE NAV + SCROLL PROGRESS
  ------------------------------------------------------ */
  const header   = $('#header');
  const navLinks = $('#navLinks');
  const hamburger= $('#hamburger');
  const progress = $('#scrollProgress');
  const toTop    = $('#toTop');

  const closeMenu = () => {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('stuck', y > 30);
    toTop?.classList.toggle('show', y > 600);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

    spyScroll();
  };

  /* scroll-spy: highlight the section you are reading */
  const sections = $$('main section[id]');
  function spyScroll() {
    const pos = window.scrollY + window.innerHeight * 0.32;
    let current = sections[0]?.id;
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    $$('.nav-link').forEach(l =>
      l.classList.toggle('active', l.getAttribute('href') === '#' + current)
    );
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ------------------------------------------------------
     4. CURSOR GLOW (desktop only)
  ------------------------------------------------------ */
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------
     5. TYPEWRITER — hero role
  ------------------------------------------------------ */
  const roles = [
    'Full-Stack Web Developer',
    'React.js Developer',
    'Python & Firebase Developer',
    'UI / UX Focused Coder',
    'MCA Postgraduate'
  ];
  const typedEl = $('#typed');

  if (typedEl) {
    let rIndex = 0, cIndex = 0, deleting = false;

    (function type() {
      const word = roles[rIndex];
      typedEl.textContent = word.slice(0, cIndex);

      let delay = deleting ? 42 : 88;

      if (!deleting && cIndex === word.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && cIndex === 0) {
        deleting = false;
        rIndex = (rIndex + 1) % roles.length;
        delay = 320;
      }
      cIndex += deleting ? -1 : 1;
      setTimeout(type, delay);
    })();
  }

  /* ------------------------------------------------------
     6. TECH MARQUEE
  ------------------------------------------------------ */
  const techs = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Python', 'Firebase',
                 'Firestore', 'Cloudinary', 'Razorpay', 'Tailwind CSS', 'Bootstrap',
                 'Git & GitHub', 'Vercel', 'REST APIs', 'Responsive Design'];

  const track = $('#marqueeTrack');
  if (track) {
    const items = techs.map(t => `<span class="mq-item"><i></i>${t}</span>`).join('');
    track.innerHTML = items + items;      /* duplicated for a seamless loop */
  }

  /* ------------------------------------------------------
     7. SCROLL REVEAL
  ------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  const observeReveals = () => $$('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
  observeReveals();

  /* ------------------------------------------------------
     8. ANIMATED COUNTERS
  ------------------------------------------------------ */
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const start = performance.now();

      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('.count').forEach(el => countObserver.observe(el));

  /* ------------------------------------------------------
     9. SKILL BARS
  ------------------------------------------------------ */
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const level = item.dataset.level || 0;
      item.querySelector('.bar i').style.width = level + '%';
      obs.unobserve(item);
    });
  }, { threshold: 0.35 });

  $$('.bar-item').forEach(el => barObserver.observe(el));

  /* ------------------------------------------------------
     10. PROJECTS — data, render, filter, modal
  ------------------------------------------------------ */
  const projects = [
    {
      id: 'code-student-portal',
      title: 'Code Student Portal',
      type: 'Web Application',
      cat: 'web',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.6 8.6 12 4.4l9.4 4.2-9.4 4.2z"/><path d="M6.2 10.7V15c0 1.5 2.6 2.6 5.8 2.6s5.8-1.1 5.8-2.6v-4.3"/><path d="M20.6 9.2v4.6"/></svg>`,
      tagline: 'A complete student management portal with authentication, records and dashboards.',
      desc: 'A full-featured student portal built for managing learner data end to end. Students sign up with email or Google, log in securely through Firebase Auth, and see their own personalised dashboard, while admin users review records, messages and activity history from a protected panel.',
      features: [
        'Firebase Authentication with email/password and Google sign-in',
        'Role based access: student view vs. admin dashboard',
        'CRUD records stored in Cloud Firestore, updated live',
        'Responsive dashboard with search and filtering',
        'Secure, rule-guarded data access'
      ],
      tech: ['React.js', 'Firebase', 'Firestore', 'CSS3'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    },
    {
      id: 'my-gallery',
      title: 'My Gallery',
      type: 'Media Web App',
      cat: 'web',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.4" width="18" height="15.2" rx="3"/><circle cx="8.6" cy="9.6" r="1.7"/><path d="m4 17.4 4.6-4.4 3.4 3.3 3.2-3 4.8 4.3"/></svg>`,
      tagline: 'Cloud-powered photo gallery with uploads, transforms and fast delivery.',
      desc: 'A modern image gallery where users upload photos straight from the browser. Files are pushed to Cloudinary with automatic optimisation and responsive transformations, so albums load fast on any device and every image is served in the right size.',
      features: [
        'Drag & drop multi-image upload',
        'Cloudinary storage with automatic compression',
        'Responsive transform URLs for every screen size',
        'Album grouping and lazy-loaded grid',
        'Smooth lightbox viewing experience'
      ],
      tech: ['React.js', 'Cloudinary', 'Firebase', 'CSS Grid'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    },
    {
      id: 'codelab-ultra',
      title: 'CodeLab Ultra',
      type: 'Product Platform',
      cat: 'web',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.4" y="5.2" width="19.2" height="13.6" rx="3"/><path d="M2.4 10h19.2"/><path d="M6 14.6h4"/></svg>`,
      tagline: 'E-commerce style platform with Razorpay checkout and mobile verification.',
      desc: 'A production-style web platform that handles real transactions. Orders are created in Firestore, paid through Razorpay checkout with server-side signature verification, and confirmed against an OTP-verified mobile number. Admin gets a live order and message table.',
      features: [
        'Razorpay payment gateway with signature verification',
        'Mobile number OTP verification before order confirmation',
        'Firestore order history per user',
        'Admin panel with live orders and contact messages',
        'Fully responsive, mobile-first checkout flow'
      ],
      tech: ['React.js', 'Razorpay', 'Firebase', 'Python'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    },
    {
      id: 'apple-3d-game',
      title: 'Apple 3D Game',
      type: 'Browser Game',
      cat: 'game',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.6 8h8.8a4.9 4.9 0 0 1 0 9.8H7.6a4.9 4.9 0 0 1 0-9.8z"/><path d="M7.4 12.9h2.4M8.6 11.7v2.4"/><circle cx="15.6" cy="12" r="1"/><circle cx="17.6" cy="14" r="1"/></svg>`,
      tagline: 'A lightweight 3D browser game with scoring, levels and sound.',
      desc: 'An interactive 3D style browser game built with pure JavaScript and CSS 3D transforms. The player collects targets against the clock, difficulty ramps up per level, and a local high-score board keeps the competition going.',
      features: [
        'Real-time keyboard and touch controls',
        'Score, timer and progressive difficulty levels',
        'CSS 3D transform based rendering — no game engine',
        'Local storage high-score tracking',
        'Works on desktop and mobile browsers'
      ],
      tech: ['JavaScript', 'CSS3 3D', 'HTML5 Audio', 'LocalStorage'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    },
    {
      id: 'karpagam-trader',
      title: 'Karpagam Trader',
      type: 'Business Website',
      cat: 'web',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 8h13.2l1 11.4H4.4z"/><path d="M9 8V6.6a3 3 0 0 1 6 0V8"/></svg>`,
      tagline: 'A clean business website for a local trading company.',
      desc: 'A professional business presence built for a trading firm — product catalogue, enquiry capture and contact details, all tuned for fast loading and easy updates by non-technical staff.',
      features: [
        'Product / service catalogue layout',
        'Enquiry form with validation and email delivery',
        'SEO friendly semantic markup',
        'Click-to-call and WhatsApp actions for mobile users',
        'Lightweight, high Lighthouse performance score'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    },
    {
      id: 'portfolio-v1',
      title: 'Developer Portfolio v1',
      type: 'Portfolio Site',
      cat: 'ui',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.8" y="4.4" width="18.4" height="15.2" rx="2.8"/><path d="M2.8 9.2h18.4"/><path d="M8.4 9.2v10.4"/><path d="M11.4 12.6h6.6M11.4 15.8h4.4"/></svg>`,
      tagline: 'Version one of my personal developer portfolio.',
      desc: 'The first edition of this portfolio — designed, coded and deployed from scratch. It shipped with scroll animations, a project showcase, certificate gallery and a Firebase backed contact form. This redesign is the next iteration on top of it.',
      features: [
        'Animated hero with custom cursor effects',
        'Project modal with live preview links',
        'Certificate gallery with full-screen viewer',
        'Firebase Firestore contact inbox',
        'Deployed on Vercel'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Firebase', 'Vercel'],
      live: 'https://mohan-k-nov8.vercel.app/',
      code: 'https://github.com/'
    }
  ];

  const grid = $('#projectsGrid');
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m0 0-5-5m5 5-5 5" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  if (grid) {
    grid.innerHTML = projects.map(p => `
      <button class="proj-card reveal" data-reveal data-id="${p.id}" data-cat="${p.cat}"
              aria-label="Open details for ${p.title}">
        <div class="proj-top">
          <span class="proj-type">${p.type}</span>
          <span class="proj-ico" aria-hidden="true">${p.icon}</span>
        </div>
        <div class="proj-body">
          <h3>${p.title}</h3>
          <p>${p.tagline}</p>
          <div class="proj-foot">
            <div class="chips">${p.tech.slice(0, 3).map(t => `<span>${t}</span>`).join('')}</div>
            <span class="proj-more">Details ${arrow}</span>
          </div>
        </div>
      </button>`).join('');
    observeReveals();
  }

  /* filter */
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('.proj-card').forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* project modal */
  const modal = $('#projectModal');
  let lastFocus = null;

  function openProject(id) {
    const p = projects.find(x => x.id === id);
    if (!p || !modal) return;

    lastFocus = document.activeElement;
    $('#pmHero').innerHTML = p.icon;
    $('#pmTag').textContent = p.type;
    $('#pmTitle').textContent = p.title;
    $('#pmDesc').textContent = p.desc;
    $('#pmFeatures').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
    $('#pmTech').innerHTML = p.tech.map(t => `<span>${t}</span>`).join('');
    $('#pmLive').href = p.live;
    $('#pmCode').href = p.code;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  }

  document.addEventListener('click', e => {
    const card = e.target.closest('.proj-card');
    if (card) openProject(card.dataset.id);
  });

  /* ------------------------------------------------------
     11. CERTIFICATE LIGHTBOX
  ------------------------------------------------------ */
  const lightbox = $('#lightbox');

  document.addEventListener('click', e => {
    const thumb = e.target.closest('.cert-thumb');
    if (!thumb) return;

    $('#lbImg').src = thumb.dataset.img;
    $('#lbImg').alt = thumb.dataset.title + ' certificate';
    $('#lbTitle').textContent = thumb.dataset.title;
    $('#lbSub').textContent = thumb.dataset.sub;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  /* close handlers for both overlays */
  $$('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      if (modal?.classList.contains('open')) closeModal(modal);
      if (lightbox?.classList.contains('open')) closeModal(lightbox);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal?.classList.contains('open')) closeModal(modal);
    if (lightbox?.classList.contains('open')) closeModal(lightbox);
  });

  /* ------------------------------------------------------
     12. CONTACT FORM — validation + mailto hand-off
     (Swap sendMessage() for a real API / Firebase call later)
  ------------------------------------------------------ */
  const form = $('#contactForm');
  const status = $('#formStatus');

  const rules = {
    name:    v => v.trim().length >= 2 || 'Please enter your name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || 'Enter a valid email address.',
    mobile:  v => v.trim() === '' || /^[6-9]\d{9}$/.test(v.trim().replace(/\D/g, '')) || 'Enter a valid 10-digit mobile number.',
    subject: v => v.trim().length >= 3 || 'Please add a subject.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const field = input.closest('.field');
    const errEl = field.querySelector('.err');
    const valid = result === true;
    field.classList.toggle('invalid', !valid);
    if (!valid && errEl) errEl.textContent = result;
    return valid;
  }

  if (form) {
    $$('input, textarea', form).forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = $$('input, textarea', form);
      const allValid = inputs.map(validateField).every(Boolean);

      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status bad';
        $('.field.invalid input, .field.invalid textarea', form)?.focus();
        return;
      }

      const btn = $('#submitBtn');
      const label = $('.btn-label', btn);
      btn.disabled = true;
      label.textContent = 'Sending...';

      const data = Object.fromEntries(new FormData(form).entries());

      setTimeout(() => {
        const body = `Name: ${data.name}%0AEmail: ${data.email}%0AMobile: ${data.mobile || '-'}%0A%0A${data.message}`;
        window.location.href =
          `mailto:mohantn617@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + data.subject)}&body=${body}`;

        status.textContent = 'Thanks! Your mail app is opening with the message ready to send.';
        status.className = 'form-status ok';
        label.textContent = 'Send Message';
        btn.disabled = false;
        form.reset();
      }, 700);
    });
  }

  /* ------------------------------------------------------
     13. FOOTER YEAR + SMOOTH ANCHORS
  ------------------------------------------------------ */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 66;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

})();
