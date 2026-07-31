window.addEventListener("DOMContentLoaded", () => {

  // ===== Preload Remove =====
  document.body.classList.remove("preload");

  // ===== Reveal on Scroll =====
  const items = document.querySelectorAll(".reveal");
  const show  = (el) => el.classList.add("is-visible");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  items.forEach((el) => observer.observe(el));

  // ===== Sticky Nav + Scroll Progress =====
  const topbar   = document.getElementById("topbar");
  const progress = document.getElementById("scrollProgress");

  if (topbar && progress) {
    window.addEventListener("scroll", () => {
      topbar.classList.toggle("scrolled", window.scrollY > 10);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = docH > 0 ? (window.scrollY / docH * 100) + "%" : "0%";
    }, { passive: true });
  }

  // ===== Mobile Hamburger =====
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", open);
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", !open);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("is-open");
        mobileMenu.setAttribute("aria-hidden", "true");
      });
    });
  }

  // ===== Services Interactive Tabs =====
  const serviceTabs    = document.querySelectorAll(".service-tab");
  const serviceDetails = document.querySelectorAll(".svc-detail");

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = tab.dataset.idx;
      serviceTabs.forEach((t) => t.classList.remove("is-active"));
      serviceDetails.forEach((d) => d.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelector(`.svc-detail[data-idx="${idx}"]`).classList.add("is-active");
    });
  });

});
