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

    function checkFadeIn() {
      fadeElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
              el.classList.add("show");
          }
      });
  }

  window.addEventListener("scroll", checkFadeIn);
  checkFadeIn();
  
    fadeElements.forEach(el => observer.observe(el));
  });
  