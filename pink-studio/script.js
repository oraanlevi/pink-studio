window.addEventListener("DOMContentLoaded", () => {

  // ===== Jewelry Intro =====

  const overlay = document.getElementById("introOverlay");
  const openBtn = document.getElementById("openStudioBtn");
  const skipBtn = document.getElementById("skipIntroBtn");

  const skipped = localStorage.getItem("skipIntro") === "true";

  const hideIntro = () => {
    overlay.classList.add("is-hidden");
    document.body.classList.remove("intro-open");
    document.body.style.overflow = "";
  };

  const showIntro = () => {
    document.body.classList.add("intro-open");
    document.body.style.overflow = "hidden";
  };

  if (!skipped) {
    showIntro();
  } else {
    overlay.classList.add("is-hidden");
  }

  openBtn.addEventListener("click", () => {
    document.body.classList.add("intro-open");

    setTimeout(() => {
      hideIntro();
    }, 500);
  });

  skipBtn.addEventListener("click", () => {
    localStorage.setItem("skipIntro", "true");
    hideIntro();
  });

  // ===== Page Reveal =====

  document.body.classList.remove("preload");

  document.querySelectorAll(".room, .btn, .link-card, .photo").forEach((el) => {
    el.addEventListener("mouseenter", () => el.classList.add("hovering"));
    el.addEventListener("mouseleave", () => el.classList.remove("hovering"));
  });

  const items = document.querySelectorAll(".reveal");
  const show = (el) => el.classList.add("is-visible");

  items.forEach((el) => {
    if (el.closest(".hero")) show(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
});
