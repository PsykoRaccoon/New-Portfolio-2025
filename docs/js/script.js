document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }); 
  
    fadeElements.forEach(el => observer.observe(el));

    // Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
      menuToggle.addEventListener("click", function () {
        const isOpen = navbar.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", isOpen);
      });

      navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function () {
          navbar.classList.remove("nav-open");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    function applyTheme(theme) {
      if (theme === "light") {
        root.setAttribute("data-theme", "light");
        themeToggle.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "Cambiar a modo oscuro");
      } else {
        root.removeAttribute("data-theme");
        themeToggle.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "Cambiar a modo claro");
      }
    }

    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme === "light" ? "light" : "dark");

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        const isLight = root.getAttribute("data-theme") === "light";
        const nextTheme = isLight ? "dark" : "light";
        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
      });
    }
  });