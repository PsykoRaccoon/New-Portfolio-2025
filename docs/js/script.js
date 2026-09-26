document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal on scroll
    const fadeElements = document.querySelectorAll(".fade-in");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      fadeElements.forEach(el => observer.observe(el));
    } else {
      fadeElements.forEach(el => el.classList.add("show"));
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    function closeMenu() {
      navbar.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }

    if (menuToggle && navbar) {
      menuToggle.addEventListener("click", function () {
        const isOpen = navbar.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });

      navbar.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
    }

    // Highlight the nav link of the section in view
    const navLinks = navbar ? navbar.querySelectorAll("a[href^='#']") : [];
    const sections = Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach(section => sectionObserver.observe(section));
    }

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
      const isLight = theme === "light";
      if (isLight) {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }
      if (themeToggle) {
        themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      }
      if (themeColor) {
        themeColor.setAttribute("content", isLight ? "#f3f0e8" : "#141414");
      }
    }

    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        try {
          localStorage.setItem("theme", nextTheme);
        } catch (e) {}
      });
    }

    // Toast
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(text) {
      if (!toast) return;
      toast.textContent = text;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
    }

    // The raccoon: eyes follow the pointer
    const raccoon = document.getElementById("raccoon");
    const pupils = raccoon ? raccoon.querySelectorAll(".pupil") : [];
    const bubble = document.getElementById("bubble");

    function lookAt(x, y) {
      // How far a pupil can travel, relative to the raccoon's rendered size
      const maxOffset = raccoon.getBoundingClientRect().width * 0.016;
      pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const dx = x - (rect.left + rect.width / 2);
        const dy = y - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 300) * maxOffset;
        pupil.style.setProperty("--px", (dx / dist) * reach + "px");
        pupil.style.setProperty("--py", (dy / dist) * reach + "px");
      });
    }

    if (raccoon) {
      let frame;
      window.addEventListener("pointermove", e => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => lookAt(e.clientX, e.clientY));
      }, { passive: true });
      window.addEventListener("pointerdown", e => lookAt(e.clientX, e.clientY), { passive: true });

      // Blink every few seconds
      (function scheduleBlink() {
        setTimeout(() => {
          raccoon.classList.add("blink");
          setTimeout(() => raccoon.classList.remove("blink"), 140);
          scheduleBlink();
        }, 2500 + Math.random() * 3500);
      })();
    }

    // Poking the raccoon
    const pokeLines = [
      "Hi! I'm the raccoon.",
      "Yes, I follow your cursor.",
      "Hey, that tickles.",
      "Okay, stop poking me.",
      "I'm serious.",
      "One more and I'm telling Victor."
    ];
    let pokes = 0;
    let bubbleTimer;

    function say(text) {
      if (!bubble) return;
      bubble.textContent = text;
      bubble.classList.add("show");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove("show"), 2400);
    }

    if (raccoon) {
      raccoon.addEventListener("click", function () {
        raccoon.classList.remove("boop");
        void raccoon.offsetWidth; // restart the animation
        raccoon.classList.add("boop");

        if (pokes < pokeLines.length) {
          say(pokeLines[pokes]);
          pokes++;
        } else {
          pokes = 0;
          toggleCheat();
        }
      });

      raccoon.addEventListener("animationend", () => raccoon.classList.remove("boop", "spin"));
    }

    // Easter egg: Konami code (or poking the raccoon enough) toggles "raccoon mode"
    const roller = document.getElementById("roller");

    function toggleCheat() {
      const on = root.classList.toggle("cheat");
      showToast(on ? "Cheat unlocked: raccoon mode" : "Raccoon mode off");

      if (on && raccoon) {
        raccoon.classList.remove("boop");
        raccoon.classList.add("spin");
        say("You found me!");
      }

      if (on && roller && !reduceMotion) {
        roller.classList.remove("roll");
        void roller.offsetWidth;
        roller.classList.add("roll");
      }
    }

    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiStep = 0;

    document.addEventListener("keydown", function (e) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === konami[konamiStep]) {
        konamiStep++;
        if (konamiStep === konami.length) {
          konamiStep = 0;
          toggleCheat();
        }
      } else {
        konamiStep = key === konami[0] ? 1 : 0;
      }
    });

    // Game cards: play a clip on hover when the card has data-preview
    document.querySelectorAll(".game[data-preview]").forEach(card => {
      const src = card.dataset.preview;
      const media = card.querySelector(".media");
      const img = media && media.querySelector("img");
      if (!media || !img) return;

      card.classList.add("has-video");

      if (/\.gif$/i.test(src)) {
        const still = img.src;
        card.addEventListener("mouseenter", () => { img.src = src; });
        card.addEventListener("mouseleave", () => { img.src = still; });
        return;
      }

      let video;
      card.addEventListener("mouseenter", () => {
        if (!video) {
          video = document.createElement("video");
          video.src = src;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.setAttribute("aria-hidden", "true");
          media.insertBefore(video, img.nextSibling);
        }
        video.hidden = false;
        video.play().catch(() => {});
      });
      card.addEventListener("mouseleave", () => {
        if (!video) return;
        video.pause();
        video.hidden = true;
      });
    });
  });
