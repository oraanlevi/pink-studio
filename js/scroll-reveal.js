/**
 * Pink Web Studio — Scroll Reveal Utility
 *
 * Usage:
 *   data-reveal              — element fades in + slides up when it enters the viewport
 *   data-reveal-group="foo"  — elements in the same group stagger 100ms apart in DOM order
 *
 * Graceful degradation: this script adds the class `js` to <html> as its
 * very first action. The CSS that hides elements before reveal is scoped to
 * `.js [data-reveal]`, so if this script never loads, all content stays
 * fully visible at its natural opacity/position.
 */

document.documentElement.classList.add('js');

(function () {
  'use strict';

  var STAGGER_MS = 100;
  var THRESHOLD  = 0.1;
  var ROOT_MARGIN = '0px 0px -32px 0px';

  function reveal(el) {
    el.classList.add('is-revealed');
  }

  function init() {
    var allEls = Array.prototype.slice.call(
      document.querySelectorAll('[data-reveal]')
    );

    if (!allEls.length) return;

    // Assign stagger delays to grouped elements based on DOM order
    var groups = {};
    allEls.forEach(function (el) {
      var g = el.dataset.revealGroup;
      if (!g) return;
      if (!groups[g]) groups[g] = [];
      groups[g].push(el);
    });

    Object.keys(groups).forEach(function (key) {
      groups[key].forEach(function (el, i) {
        el.dataset.revealDelay = String(i * STAGGER_MS);
      });
    });

    // Set up the observer
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el    = entry.target;
        var delay = parseInt(el.dataset.revealDelay || '0', 10);
        if (delay > 0) {
          setTimeout(function () { reveal(el); }, delay);
        } else {
          reveal(el);
        }
        observer.unobserve(el);
      });
    }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });

    allEls.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
