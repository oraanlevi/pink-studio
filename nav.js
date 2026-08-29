(function () {

  // ── Data ────────────────────────────────────────────────────────────────
  var PROJECTS = [
    { label: 'Forma',        href: '/forma/',          img: '/assets/formahero.png',   cat: 'Software \u00b7 Full-Stack Product',           desc: 'Interior design operations software. Built from scratch.' },
    { label: 'Verde',        href: '/verde/',          img: '/assets/verde-hover.png', cat: 'Design Exploration \u00b7 Skincare & Beauty',  desc: 'An editorial commerce experience built around a single formula.' },
    { label: 'Le Loup',      href: '/le-loup/',        img: '/assets/loup.png',        cat: 'Website \u00b7 Private Members Club',           desc: 'Mystery, atmosphere, quiet exclusivity.' },
    { label: 'West & Stone', href: '/west-and-stone/', img: '/assets/stone.png',       cat: 'Website \u00b7 Home Goods & Interior Objects',  desc: 'Private, architectural, deliberate.' },
    { label: 'C\u00e9leste', href: '/celeste/',        img: '/assets/cel.png',         cat: 'Website \u00b7 Medical Aesthetics',             desc: 'Calm, trusted, quietly elegant.' },
    { label: 'June House',   href: '/june-house/',     img: '/assets/fashion.png',     cat: 'Website \u00b7 Interior Design Studio',         desc: 'Timeless, collected, quietly considered.' },
  ];

  var SERVICES = [
    { label: 'Signature Website', href: '/services/signature/', img: '/assets/SW.png', cat: 'Pink Web Studio', desc: 'Built from scratch, for you.',  meta: 'From $4,000' },
    { label: 'Website Refresh',   href: '/services/refresh/',   img: '/assets/WR.png', cat: 'Pink Web Studio', desc: 'Your site, elevated.',          meta: 'From $2,000' },
    { label: 'Website Audit',     href: '/services/audit/',     img: '/assets/WA.png', cat: 'Pink Web Studio', desc: 'Know exactly what to fix.',     meta: '$199' },
    { label: 'Monthly Support',   href: '/services/care/',      img: '/assets/MS.png', cat: 'Pink Web Studio', desc: 'Ongoing care, handled.',        meta: '$250 / mo' },
    { label: 'Custom Solutions',  href: '/contact/',            img: '/assets/CS.png', cat: 'Pink Web Studio', desc: 'Something beyond a website.',   meta: 'Custom pricing' },
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────
  function isDesktop() { return window.matchMedia('(min-width: 861px)').matches; }

  function renderRight(el, item, linkText, eyebrow) {
    var meta = item.meta
      ? '<span class="mega-meta">' + item.meta + '</span>'
      : '';
    el.innerHTML =
      '<span class="mega-cat">' + eyebrow + '</span>' +
      '<span class="mega-title">' + item.label + '</span>' +
      '<p class="mega-desc">' + item.desc + '</p>' +
      meta +
      '<a class="mega-link" href="' + item.href + '">' + linkText + ' \u2192</a>';
  }

  // ── Build panel ──────────────────────────────────────────────────────────
  function buildPanel(id, items, allHref, allText, linkText, eyebrow) {
    var panel = document.createElement('div');
    panel.className = 'mega-panel';
    panel.id = id;
    panel.setAttribute('hidden', '');

    // Left
    var left = document.createElement('div');
    left.className = 'mega-left';

    var navEl = document.createElement('nav');
    navEl.className = 'mega-nav';
    items.forEach(function (item, i) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (i === 0) a.classList.add('mega-active');
      navEl.appendChild(a);
    });

    var allLink = document.createElement('a');
    allLink.href = allHref;
    allLink.className = 'mega-all';
    allLink.textContent = allText;

    left.appendChild(navEl);
    left.appendChild(allLink);

    // Center
    var center = document.createElement('div');
    center.className = 'mega-center';
    var img = document.createElement('img');
    img.className = 'mega-img';
    img.src = items[0].img;
    img.alt = items[0].label;
    center.appendChild(img);

    // Right
    var right = document.createElement('div');
    right.className = 'mega-right';
    renderRight(right, items[0], linkText);

    panel.appendChild(left);
    panel.appendChild(center);
    panel.appendChild(right);

    return { panel: panel, navEl: navEl, img: img, right: right, items: items, linkText: linkText, eyebrow: eyebrow, activeIndex: 0 };
  }

  // ── Featured item update (soft fade) ─────────────────────────────────────
  var FADE_MS = 160;

  function setFeatured(data, index) {
    if (index === data.activeIndex) return;
    data.activeIndex = index;
    var item = data.items[index];

    data.navEl.querySelectorAll('a').forEach(function (a, i) {
      a.classList.toggle('mega-active', i === index);
    });

    data.img.classList.add('mega-fading');
    data.right.classList.add('mega-fading');

    setTimeout(function () {
      data.img.src = item.img;
      data.img.alt = item.label;
      renderRight(data.right, item, data.linkText, data.eyebrow);
      // Force reflow so removal of fading triggers CSS transition back in
      void data.img.offsetWidth;
      data.img.classList.remove('mega-fading');
      data.right.classList.remove('mega-fading');
    }, FADE_MS);
  }

  // ── Inject panels ────────────────────────────────────────────────────────
  var mainNav = document.getElementById('mainNav');
  if (!mainNav) return;

  var proj = buildPanel('megaProjects', PROJECTS, '/work/',     'View All Projects \u2192', 'View Project', 'Featured Project');
  var svc  = buildPanel('megaServices', SERVICES, '/services/', 'View All Services \u2192', 'View Service', 'Featured Service');

  // Initial right panel content (uses eyebrow)
  renderRight(proj.right, PROJECTS[0], proj.linkText, proj.eyebrow);
  renderRight(svc.right,  SERVICES[0], svc.linkText,  svc.eyebrow);

  mainNav.appendChild(proj.panel);
  mainNav.appendChild(svc.panel);

  // ── Hover on left nav items ───────────────────────────────────────────────
  function attachHovers(data) {
    data.navEl.querySelectorAll('a').forEach(function (a, i) {
      a.addEventListener('mouseenter', function () { setFeatured(data, i); });
    });
  }
  attachHovers(proj);
  attachHovers(svc);

  // ── Open / close ─────────────────────────────────────────────────────────
  var closeTimer = null;

  function cancelClose() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  }

  function scheduleClose() {
    cancelClose();
    closeTimer = setTimeout(function () {
      [proj.panel, svc.panel].forEach(function (p) { p.setAttribute('hidden', ''); });
    }, 150);
  }

  // Immediately show a panel — cancels any pending close and swaps cleanly
  function showPanel(data) {
    cancelClose();
    [proj.panel, svc.panel].forEach(function (p) { p.setAttribute('hidden', ''); });
    data.panel.removeAttribute('hidden');
  }

  // ── Desktop hover on nav-dd triggers ─────────────────────────────────────
  document.querySelectorAll('.nav-links .nav-dd').forEach(function (dd) {
    dd.addEventListener('mouseenter', function () {
      if (!isDesktop()) return;
      var href = dd.querySelector('.nav-dd-label').getAttribute('href');
      showPanel(href.indexOf('/work') !== -1 ? proj : svc);
    });
    dd.addEventListener('mouseleave', function () {
      if (!isDesktop()) return;
      scheduleClose();
    });
  });

  // Hovering inside the panel cancels the close timer
  [proj.panel, svc.panel].forEach(function (panel) {
    panel.addEventListener('mouseenter', cancelClose);
    panel.addEventListener('mouseleave', scheduleClose);
  });

  // ── Click outside nav closes mega ────────────────────────────────────────
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#mainNav')) {
      cancelClose();
      [proj.panel, svc.panel].forEach(function (p) { p.setAttribute('hidden', ''); });
    }
  });

  // ── Mobile dropdown toggles (existing behavior preserved) ────────────────
  document.querySelectorAll('.mobile-nav .nav-dd-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var menu = btn.parentElement.querySelector('.nav-dd-menu');
      var isOpen = !menu.hidden;
      document.querySelectorAll('.mobile-nav .nav-dd-menu').forEach(function (m) { m.hidden = true; });
      document.querySelectorAll('.mobile-nav .nav-dd-toggle').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.classList.remove('open');
      });
      if (!isOpen) {
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('open');
      }
    });
  });

  // Close mobile dropdowns when a submenu link is clicked
  document.querySelectorAll('.mobile-nav .nav-dd-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.querySelectorAll('.mobile-nav .nav-dd-menu').forEach(function (m) { m.hidden = true; });
    });
  });

})();
