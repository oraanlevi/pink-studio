window.addEventListener("DOMContentLoaded", () => {
  // Scroll progress
  const topbar   = document.getElementById("topbar");
  const progress = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    topbar.classList.toggle("scrolled", window.scrollY > 10);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = docH > 0 ? (window.scrollY / docH * 100) + "%" : "0%";
  }, { passive: true });

  // Hamburger
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", open);
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", !open);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
    });
  });
});
