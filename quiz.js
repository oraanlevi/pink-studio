(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Option constants (single source of truth for display + comparison) ────
  var O = {
    Q1_NO_SITE:   "I don\u2019t have a website yet",
    Q1_OUTDATED:  "I have one, but it no longer reflects my brand",
    Q1_NO_CONV:   "I have one, but it\u2019s not bringing in clients",
    Q1_MAINTAIN:  "I have a good site \u2014 I just need help keeping it maintained",
    Q1_UNSURE:    "I\u2019m not sure yet",
    Q2_LAUNCH:    "Launch something I\u2019m genuinely proud of",
    Q2_FIX:       "Fix what\u2019s wrong and start getting more inquiries",
    Q2_DIAGNOSE:  "Understand what\u2019s holding my current site back before I invest more",
    Q2_MAINTAIN:  "Stop spending time and energy managing the site myself",
    Q3_SOON:      "I\u2019d like to start soon",
    Q3_MONTHS:    "Within the next 1\u20133 months",
    Q3_PLANNING:  "I\u2019m still planning \u2014 no rush",
    Q4_UNDER500:  "Under $500",
    Q4_500TO2K:   "$500\u2013$2,000",
    Q4_2KTO5K:    "$2,000\u2013$5,000",
    Q4_5KPLUS:    "$5,000+",
    Q4_UNSURE:    "I\u2019m not sure yet / I\u2019d rather not say"
  };

  // ── Questions ─────────────────────────────────────────────────────────────
  var QUESTIONS = [
    {
      id: 'q1', type: 'choice',
      q: 'Where are you starting from?',
      options: [O.Q1_NO_SITE, O.Q1_OUTDATED, O.Q1_NO_CONV, O.Q1_MAINTAIN, O.Q1_UNSURE]
    },
    {
      id: 'q2', type: 'choice',
      q: 'What does success look like for you in the next few months?',
      options: [O.Q2_LAUNCH, O.Q2_FIX, O.Q2_DIAGNOSE, O.Q2_MAINTAIN]
    },
    {
      id: 'q3', type: 'choice',
      q: 'What\u2019s your timeline?',
      options: [O.Q3_SOON, O.Q3_MONTHS, O.Q3_PLANNING]
    },
    {
      id: 'q4', type: 'choice',
      q: 'What\u2019s your rough investment range?',
      options: [O.Q4_UNDER500, O.Q4_500TO2K, O.Q4_2KTO5K, O.Q4_5KPLUS, O.Q4_UNSURE]
    },
    {
      id: 'name', type: 'text',
      q: 'One last thing \u2014 what\u2019s your name?',
      placeholder: 'Your name'
    }
  ];

  var TOTAL = QUESTIONS.length;

  // ── Service labels (for Formspree subject) ────────────────────────────────
  var LABELS = {
    signature: 'Signature Website',
    refresh:   'Website Refresh',
    audit:     'Website Audit',
    care:      'Monthly Care',
    letstalk:  "Let\u2019s Talk"
  };

  // ── Results ───────────────────────────────────────────────────────────────
  var RESULTS = {
    signature: {
      title:     function (n) { return n + ', you\u2019re ready for something built just for you.'; },
      desc:      'You\u2019re starting fresh \u2014 or you\u2019ve outgrown what you have. A Signature Website is designed and developed around your brand from the ground up. It\u2019s the right fit when you want a site that finally matches the level of your work.',
      price:     'From $4,000 \u00b7 3\u20134 weeks',
      credit:    null,
      primary:   { label: 'Book a Discovery Call', href: 'https://calendly.com/oraanlevi1/30min', external: true },
      secondary: { label: 'See what\u2019s included', href: '/services/signature/' }
    },
    refresh: {
      title:     function (n) { return n + ', your site has good bones. It just needs to catch up.'; },
      desc:      'You already have a foundation \u2014 it just doesn\u2019t feel like your brand anymore. A Website Refresh focuses on updating the design, hierarchy, and overall experience without unnecessarily starting over.',
      price:     'From $2,000',
      credit:    null,
      primary:   { label: 'Book a Discovery Call', href: 'https://calendly.com/oraanlevi1/30min', external: true },
      secondary: { label: 'See what\u2019s included', href: '/services/refresh/' }
    },
    audit: {
      title:     function (n) { return n + ', before you invest more, let\u2019s figure out exactly what needs fixing.'; },
      desc:      'You don\u2019t necessarily need to redesign everything. A Website Audit gives you a prioritized professional review of what\u2019s working, what\u2019s holding the site back, and what I\u2019d recommend changing next.',
      price:     '$199 \u00b7 delivered in approximately 1 week',
      credit:    'Your $199 Audit fee is credited toward a Website Refresh or Signature Website booked within 60 days.',
      primary:   { label: 'Book Your Audit', href: '/contact/', external: false },
      secondary: { label: 'See what\u2019s included', href: '/services/audit/' }
    },
    care: {
      title:     function (n) { return n + ', your site is in good shape. Let\u2019s keep it that way.'; },
      desc:      'You don\u2019t need another redesign. You need someone to handle the updates, fixes, and ongoing maintenance so your website stays polished without taking up your time.',
      price:     '$250/month',
      credit:    null,
      primary:   { label: 'Get Started', href: 'https://calendly.com/oraanlevi1/30min', external: true },
      secondary: { label: 'See what\u2019s included', href: '/services/care/' }
    },
    letstalk: {
      title:     function (n) { return n + ', this one\u2019s worth a conversation.'; },
      desc:      'Based on your answers, I don\u2019t want to recommend something you may not actually need. Let\u2019s talk about where you are and figure out the right next step.',
      price:     null,
      credit:    null,
      primary:   { label: 'Book a Free Discovery Call', href: 'https://calendly.com/oraanlevi1/30min', external: true },
      secondary: null
    }
  };

  // ── Recommendation logic ──────────────────────────────────────────────────
  function recommend(a) {
    var q1 = a.q1 || '';
    var q2 = a.q2 || '';
    var q4 = a.q4 || '';

    var noSite     = q1 === O.Q1_NO_SITE;
    var outdated   = q1 === O.Q1_OUTDATED;
    var notConvert = q1 === O.Q1_NO_CONV;
    var maintain   = q1 === O.Q1_MAINTAIN;
    var hasSite    = outdated || notConvert || maintain;

    var diagGoal   = q2 === O.Q2_DIAGNOSE;
    var launchGoal = q2 === O.Q2_LAUNCH;

    var budgetLow  = q4 === O.Q4_UNDER500;
    var budgetMid  = q4 === O.Q4_500TO2K;
    var budget2to5 = q4 === O.Q4_2KTO5K;
    var budget5k   = q4 === O.Q4_5KPLUS;
    var budgetHigh = budget2to5 || budget5k;
    var budgetUns  = q4 === O.Q4_UNSURE;

    // Care: site is in good shape, just needs upkeep
    if (maintain) return 'care';

    // No website: Audit is never appropriate (no site to audit)
    if (noSite) {
      return budgetHigh ? 'signature' : 'letstalk';
    }

    // Has site + wants diagnosis → always Audit
    if (hasSite && diagGoal) return 'audit';

    // Has site + under $500 or $500–$2k → Audit as accessible first step
    // (Refresh starts at $2k; Signature at $4k — both out of range)
    if (hasSite && (budgetLow || budgetMid)) return 'audit';

    // Outdated brand + appropriate budget → Refresh
    if (outdated) {
      return (budgetHigh || budgetUns) ? 'refresh' : 'letstalk';
    }

    // Not converting
    if (notConvert) {
      // High budget + wants fresh launch → Signature rebuild
      if (budget5k || (budget2to5 && launchGoal)) return 'signature';
      // High budget otherwise → Refresh (targeted improvement)
      if (budgetHigh) return 'refresh';
      // Unsure budget, conflicting signals
      return 'letstalk';
    }

    // "I'm not sure yet" or anything else unresolved
    return 'letstalk';
  }

  // ── HTML helper ───────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Inject modal HTML ─────────────────────────────────────────────────────
  var scrimEl = document.createElement('div');
  scrimEl.className = 'quiz-scrim';
  scrimEl.id = 'quizScrim';

  var cardEl = document.createElement('div');
  cardEl.className = 'quiz-card';
  cardEl.id = 'quizCard';
  cardEl.setAttribute('role', 'dialog');
  cardEl.setAttribute('aria-modal', 'true');
  cardEl.setAttribute('aria-label', 'Service recommendation quiz');
  cardEl.innerHTML =
    '<div class="quiz-handle"></div>' +
    '<div class="quiz-header" id="quizHeader">' +
      '<span class="quiz-progress" id="quizProgress" aria-live="polite"></span>' +
      '<button class="quiz-close" id="quizClose" aria-label="Close quiz">&times;</button>' +
    '</div>' +
    '<div class="quiz-body" id="quizBody"></div>';

  document.body.appendChild(scrimEl);
  document.body.appendChild(cardEl);

  // ── State ─────────────────────────────────────────────────────────────────
  var answers         = {};
  var stepIdx         = 0;
  var lastFocus       = null;

  // ── Elements ──────────────────────────────────────────────────────────────
  var scrim      = document.getElementById('quizScrim');
  var card       = document.getElementById('quizCard');
  var bodyEl     = document.getElementById('quizBody');
  var progressEl = document.getElementById('quizProgress');
  var headerEl   = document.getElementById('quizHeader');
  var closeBtn   = document.getElementById('quizClose');

  // ── Open / close ──────────────────────────────────────────────────────────
  function open() {
    answers  = {};
    stepIdx  = 0;
    lastFocus = document.activeElement;
    render();
    scrim.classList.add('open');
    card.classList.add('open');
    document.body.style.overflow = 'hidden';
    var delay = prefersReduced ? 0 : 380;
    setTimeout(function () {
      var first = card.querySelector('.quiz-opt, input, #qNext');
      if (first) first.focus();
    }, delay);
  }

  function close() {
    scrim.classList.remove('open');
    card.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ── Triggers ──────────────────────────────────────────────────────────────
  document.querySelectorAll('#quizTrigger, [data-quiz-trigger]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  scrim.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  // ── Keyboard: Escape + focus trap + arrow nav ─────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (!card.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'Tab') {
      var focusable = Array.from(card.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) { return el.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    // Arrow key navigation within option list
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var active = document.activeElement;
      if (!active || !active.classList.contains('quiz-opt')) return;
      e.preventDefault();
      var opts = Array.from(bodyEl.querySelectorAll('.quiz-opt'));
      var idx  = opts.indexOf(active);
      var next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      if (next >= 0 && next < opts.length) opts[next].focus();
    }
  });

  // ── Progress indicator ────────────────────────────────────────────────────
  function updateProgress(idx) {
    var isResult = idx >= TOTAL;
    if (isResult) {
      progressEl.textContent = '';
      headerEl.style.borderBottom = '1px solid transparent';
    } else {
      progressEl.textContent =
        String(idx + 1).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
      headerEl.style.borderBottom = '';
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    updateProgress(stepIdx);

    if (stepIdx >= TOTAL) {
      finish();
      return;
    }

    var step = QUESTIONS[stepIdx];

    var html = '<div class="quiz-step"><p class="quiz-q">' + esc(step.q) + '</p>';

    if (step.type === 'choice') {
      html += '<div class="quiz-opts">';
      step.options.forEach(function (o) {
        var sel = answers[step.id] === o ? ' sel' : '';
        html += '<button class="quiz-opt' + sel + '" data-v="' + esc(o) + '">' + esc(o) + '</button>';
      });
      html += '</div>';
    } else {
      html += '<input class="quiz-input" id="qInput" type="text" placeholder="'
        + esc(step.placeholder || '') + '" autocomplete="off" value="'
        + esc(answers[step.id] || '') + '" />';
    }

    html += '<div class="quiz-actions">';
    if (step.type === 'text') {
      html += '<button class="quiz-next" id="qNext">Continue \u2192</button>';
    }
    if (stepIdx > 0) {
      html += '<button class="quiz-back" id="qBack">\u2190 Back</button>';
    }
    html += '</div></div>';

    bodyEl.innerHTML = html;

    if (step.type === 'choice') {
      bodyEl.querySelectorAll('.quiz-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          answers[step.id] = btn.dataset.v;
          bodyEl.querySelectorAll('.quiz-opt').forEach(function (b) { b.classList.remove('sel'); });
          btn.classList.add('sel');
          setTimeout(advance, prefersReduced ? 0 : 260);
        });
      });
    }

    if (step.type === 'text') {
      var inp = document.getElementById('qInput');
      inp && inp.focus();
      var nextBtn = document.getElementById('qNext');
      nextBtn && nextBtn.addEventListener('click', function () {
        var v = document.getElementById('qInput');
        answers[step.id] = (v ? v.value : '').trim();
        advance();
      });
      inp && inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          answers[step.id] = inp.value.trim();
          advance();
        }
      });
    }

    var backBtn = document.getElementById('qBack');
    backBtn && backBtn.addEventListener('click', function () {
      stepIdx--;
      render();
    });
  }

  function advance() {
    stepIdx++;
    render();
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  function finish() {
    var rawName = (answers.name || '').trim();
    var name    = rawName.split(/\s+/)[0] || 'there';
    var service = recommend(answers);
    var rec     = RESULTS[service];

    // Formspree submission (fire-and-forget)
    try {
      var fd = new FormData();
      fd.append('_subject', 'Quiz \u2014 ' + (rawName || 'Unknown') + ' \u2014 ' + LABELS[service]);
      fd.append('name',            rawName || '');
      fd.append('q1_situation',    answers.q1 || '');
      fd.append('q2_goal',         answers.q2 || '');
      fd.append('q3_timeline',     answers.q3 || '');
      fd.append('q4_budget',       answers.q4 || '');
      fd.append('recommendation',  LABELS[service]);
      fetch('https://formspree.io/f/mbdejokw', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      });
    } catch (e) {}

    var html =
      '<div class="quiz-step quiz-result">' +
      '<span class="quiz-result-eye">Our recommendation</span>' +
      '<span class="quiz-result-title">' + esc(rec.title(name)) + '</span>' +
      '<p class="quiz-result-desc">' + esc(rec.desc) + '</p>';

    if (rec.price) {
      html += '<p class="quiz-result-price">' + esc(rec.price) + '</p>';
    }

    if (rec.credit) {
      html += '<p class="quiz-result-credit">' + esc(rec.credit) + '</p>';
    }

    var primaryTarget = rec.primary.external ? ' target="_blank" rel="noopener"' : '';
    html += '<a class="quiz-result-cta" href="' + esc(rec.primary.href) + '"' + primaryTarget + '>' +
              esc(rec.primary.label) + '</a>';

    if (rec.secondary) {
      html += '<a class="quiz-result-secondary" href="' + esc(rec.secondary.href) + '">' +
                esc(rec.secondary.label) + ' \u2192</a>';
    }

    html += '<button class="quiz-restart" id="quizRestart">Start over</button>';
    html += '</div>';

    bodyEl.innerHTML = html;

    document.getElementById('quizRestart').addEventListener('click', function () {
      answers  = {};
      stepIdx  = 0;
      render();
    });

    setTimeout(function () {
      var cta = bodyEl.querySelector('.quiz-result-cta');
      if (cta) cta.focus();
    }, 100);
  }

})();
