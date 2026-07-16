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
  });