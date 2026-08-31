(function () {

  // ── Inject overlay HTML ──────────────────────────────────────────────────
  var scrimEl = document.createElement('div');
  scrimEl.className = 'quiz-scrim';
  scrimEl.id = 'quizScrim';

  var cardEl = document.createElement('div');
  cardEl.className = 'quiz-card';
  cardEl.id = 'quizCard';
  cardEl.innerHTML = '<div class="quiz-handle"></div><div class="quiz-body" id="quizBody"></div>';

  document.body.appendChild(scrimEl);
  document.body.appendChild(cardEl);

  // ── Data ────────────────────────────────────────────────────────────────
  var MAIN = [
    { id: 'name',     type: 'text',   q: 'What\u2019s your name?',         placeholder: 'Your name' },
    { id: 'timeline', type: 'choice', q: 'What\u2019s your timeline?',      options: ['Still planning, no rush', '1\u20133 months', 'ASAP'] },
    { id: 'project',  type: 'choice', q: 'What kind of project?',           options: ['New website', 'Refresh my existing site', 'Website audit', 'Something else'] }
  ];

  var BRANCHES = {
    'New website': [
      { id: 'inspo',    type: 'choice', q: 'Do you have a feel for what it should look like?',      options: ['Yes, I have references', 'Somewhat, I have a direction', 'No, I need guidance'] },
      { id: 'brand',    type: 'choice', q: 'Do you have a brand and logo?',                         options: ['Yes, fully branded', 'I have some elements', 'Starting from scratch'] },
      { id: 'business', type: 'choice', q: 'What kind of business?',                                options: ['E-commerce / Shopify', 'Service business', 'Restaurant or hospitality', 'Creative studio', 'Other'] },
      { id: 'budget',   type: 'choice', q: 'What\u2019s the budget you\u2019re willing to invest?', options: ['Under $2,000', '$2,000\u2013$4,000', '$4,000\u2013$8,000', '$8,000+', 'Not sure yet'] }
    ],
    'Refresh my existing site': [
      { id: 'dislike', type: 'text',   q: 'What don\u2019t you like about your current site?',     placeholder: 'Tell us what feels off\u2026' },
      { id: 'broken',  type: 'choice', q: 'Is something broken or missing?',                       options: ['Yes', 'No', 'Not sure'] },
      { id: 'rebrand', type: 'choice', q: 'Planning to change your domain or logo?',               options: ['Yes', 'No', 'Maybe'] },
      { id: 'budget',  type: 'choice', q: 'What\u2019s the budget you\u2019re willing to invest?', options: ['Under $2,000', '$2,000\u2013$4,000', '$4,000\u2013$8,000', '$8,000+', 'Not sure yet'] }
    ],
    'Website audit': [
      { id: 'dislike', type: 'text', q: 'What don\u2019t you like about your current site?', placeholder: 'Tell us what\u2019s not working\u2026' }
    ],
    'Something else': [
      { id: 'desc', type: 'text', q: 'Tell us a bit more.', placeholder: 'What are you working on?' }
    ]
  };

  var RECS = {
    'New website':              { label: 'Signature Website', href: 'https://calendly.com/oraanlevi1/30min' },
    'Refresh my existing site': { label: 'Website Refresh',   href: 'https://calendly.com/oraanlevi1/30min' },
    'Website audit':            { label: 'Website Audit',     href: 'https://calendly.com/oraanlevi1/30min' },
    'Something else':           { label: 'something custom',  href: 'https://calendly.com/oraanlevi1/30min' }
  };

  // ── State ────────────────────────────────────────────────────────────────
  var answers = {}, stepIdx = 0, branch = [];

  function steps() { return MAIN.concat(branch); }
  function total()  { return steps().length; }

  // ── Elements ─────────────────────────────────────────────────────────────
  var scrim   = document.getElementById('quizScrim');
  var card    = document.getElementById('quizCard');
  var bodyEl  = document.getElementById('quizBody');

  // ── Open / close ─────────────────────────────────────────────────────────
  function open() {
    answers = {}; stepIdx = 0; branch = [];
    render();
    scrim.classList.add('open');
    card.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    scrim.classList.remove('open');
    card.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Wire every element with id="quizTrigger" on the page
  document.querySelectorAll('#quizTrigger, [data-quiz-trigger]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  scrim.addEventListener('click', close);

  // ── Render ───────────────────────────────────────────────────────────────
  function render() {
    var step = steps()[stepIdx];
    if (!step) { finish(); return; }

    var html = '<div class="quiz-step">'
      + '<p class="quiz-q">' + step.q + '</p>';

    if (step.type === 'choice') {
      html += '<div class="quiz-opts">';
      step.options.forEach(function (o) {
        var sel = answers[step.id] === o ? ' sel' : '';
        html += '<button class="quiz-opt' + sel + '" data-v="' + o + '">' + o + '</button>';
      });
      html += '</div>';
    } else {
      html += '<input class="quiz-input" id="qInput" type="text" placeholder="'
        + (step.placeholder || '') + '" autocomplete="off" value="'
        + (answers[step.id] || '') + '" />';
    }

    html += '<div class="quiz-actions">';
    if (step.type === 'text') html += '<button class="quiz-next" id="qNext">Continue \u2192</button>';
    if (stepIdx > 0) html += '<button class="quiz-back" id="qBack">\u2190 Back</button>';
    html += '</div></div>';

    bodyEl.innerHTML = html;

    if (step.type === 'choice') {
      bodyEl.querySelectorAll('.quiz-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          answers[step.id] = btn.dataset.v;
          bodyEl.querySelectorAll('.quiz-opt').forEach(function (b) { b.classList.remove('sel'); });
          btn.classList.add('sel');
          if (step.id === 'project') branch = BRANCHES[btn.dataset.v] || [];
          setTimeout(advance, 260);
        });
      });
    }

    if (step.type === 'text') {
      var inp = document.getElementById('qInput');
      inp && inp.focus();
      document.getElementById('qNext').addEventListener('click', function () {
        var inp2 = document.getElementById('qInput');
        answers[step.id] = inp2 ? inp2.value.trim() : '';
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
      if (stepIdx < MAIN.length) branch = [];
      render();
    });
  }

  function advance() {
    stepIdx++;
    if (stepIdx >= total()) finish();
    else render();
  }

  // ── Result ───────────────────────────────────────────────────────────────
  function finish() {
    try {
      var fd = new FormData();
      fd.append('_subject', 'Quiz \u2014 ' + (answers.name || 'Unknown') + ' \u2014 ' + (answers.project || ''));
      Object.keys(answers).forEach(function (k) { fd.append(k, answers[k]); });
      fetch('https://formspree.io/f/mbdejokw', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    } catch (e) {}

    var name    = answers.name ? answers.name.split(' ')[0] : 'there';
    var project = answers.project || 'Something else';
    var rec     = RECS[project] || RECS['Something else'];

    bodyEl.innerHTML = '<div class="quiz-step quiz-result">'
      + '<span class="quiz-result-eye">Our recommendation</span>'
      + '<span class="quiz-result-title">Hi ' + name + ',<br>sounds like<br><em>' + rec.label + '</em><br>is the right fit.</span>'
      + '<p class="quiz-result-desc">Let\u2019s talk through the details and make sure we\u2019re a great match.</p>'
      + '<a class="quiz-result-cta" href="' + rec.href + '" target="_blank" rel="noopener">Book a Free Call</a>'
      + '<a class="quiz-result-alt" href="/contact/">Or reach out directly \u2192</a>'
      + '</div>';
  }

})();
