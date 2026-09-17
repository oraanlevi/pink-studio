(function () {

  // ── Dropdown content ─────────────────────────────────────────────────────
  var DROPS = {
    websites: [
      { label: 'Signature Website', href: '/services/signature/' },
      { label: 'Website Refresh',   href: '/services/refresh/' },
      { label: 'Website Audit',     href: '/services/audit/' },
      { label: 'Monthly Support',   href: '/services/care/' },
    ],
    software: [
      { label: 'Client Portals',    href: '/software/' },
      { label: 'Internal Tools',    href: '/software/' },
      { label: 'Automation',        href: '/software/' },
      { label: 'Custom Software',   href: '/software/' },
    ],
    products: [
      { label: 'Forma',             href: '/forma/' },
    ],
    studio: [
      { label: 'About',             href: '/studio/' },
      { label: 'Process',           href: '/studio/' },
      { label: 'Reviews',           href: '/reviews/' },
    ],
  };

  function isDesktop() { return window.matchMedia('(min-width: 861px)').matches; }

  // ── Build the drop strip ─────────────────────────────────────────────────
  var mainNav = document.getElementById('mainNav');
  if (!mainNav) return;

  var drop = document.createElement('div');
  drop.className = 'nav-drop';
  drop.id = 'navDrop';
  var inner = document.createElement('div');
  inner.className = 'nav-drop-inner';
  drop.appendChild(inner);
  mainNav.parentNode.insertBefore(drop, mainNav.nextSibling);

  var closeTimer = null;

  function cancelClose() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  }

  function open(key) {
    cancelClose();
    var items = DROPS[key] || [];
    if (!items.length) return;
    inner.innerHTML = items.map(function (item) {
      return '<a class="nav-drop-link" href="' + item.href + '">' + item.label + '</a>';
    }).join('');
    drop.classList.add('open');
  }

  function scheduleClose() {
    cancelClose();
    closeTimer = setTimeout(function () {
      drop.classList.remove('open');
    }, 180);
  }

  // ── Hover on desktop nav items ────────────────────────────────────────────
  mainNav.querySelectorAll('.nav-item[data-drop]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (!isDesktop()) return;
      open(el.dataset.drop);
    });
    el.addEventListener('mouseleave', function () {
      if (!isDesktop()) return;
      scheduleClose();
    });
  });

  drop.addEventListener('mouseenter', cancelClose);
  drop.addEventListener('mouseleave', scheduleClose);

  // Close when clicking outside nav
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#mainNav') && !e.target.closest('#navDrop')) {
      cancelClose();
      drop.classList.remove('open');
    }
  });

  // ── Mobile sidebar ────────────────────────────────────────────────────────
  var ham   = document.getElementById('navHam');
  var mob   = document.getElementById('mobileNav');
  if (!ham || !mob) return;

  var scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  document.body.appendChild(scrim);

  var navHeader = document.createElement('div');
  navHeader.className = 'mobile-nav-header';
  navHeader.innerHTML = '<button class="mobile-nav-close" id="navClose" aria-label="Close menu">&#215;</button>';
  mob.insertBefore(navHeader, mob.firstChild);

  function openNav() {
    mob.classList.add('open');
    scrim.classList.add('open');
    ham.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    mob.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mob.classList.remove('open');
    scrim.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    mob.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', openNav);
  scrim.addEventListener('click', closeNav);
  document.getElementById('navClose')?.addEventListener('click', closeNav);

  mob.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

})();
