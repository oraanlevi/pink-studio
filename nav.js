(function() {
  var toggles = document.querySelectorAll('.nav-dd-toggle');
  toggles.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var menu = btn.parentElement.querySelector('.nav-dd-menu');
      var isOpen = !menu.hidden;
      // Close all menus
      document.querySelectorAll('.nav-dd-menu').forEach(function(m) { m.hidden = true; });
      document.querySelectorAll('.nav-dd-toggle').forEach(function(b) {
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
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dd')) {
      document.querySelectorAll('.nav-dd-menu').forEach(function(m) { m.hidden = true; });
      document.querySelectorAll('.nav-dd-toggle').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        b.classList.remove('open');
      });
    }
  });
  // Close menus when a submenu link is clicked (mobile nav)
  document.querySelectorAll('.nav-dd-menu a').forEach(function(a) {
    a.addEventListener('click', function() {
      document.querySelectorAll('.nav-dd-menu').forEach(function(m) { m.hidden = true; });
    });
  });
})();
