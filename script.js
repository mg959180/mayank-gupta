const topbar = document.querySelector(".topbar");
const toggle = document.querySelector(".nav-toggle");
const menuLinks = document.querySelectorAll(".nav a, .nav-panel .hire-button");
const typedRole = document.querySelector(".typed-role");
const hero = document.querySelector(".hero");
const profilePhoto = document.querySelector(".profile-pic img[data-local-src]");
const gallery = document.querySelector(".gallery");
const portfolioTabs = document.querySelectorAll(".portfolio-filter a");
const galleryCards = document.querySelectorAll(".gallery-card");
let portfolioSwitchTimer = null;

if (hero) {
  const heroBanner = new Image();

  heroBanner.onload = () => {
    document.documentElement.style.setProperty("--hero-banner-image", 'url("assets/hero-banner.jpg")');
  };

  heroBanner.src = "assets/hero-banner.jpg";
}

if (profilePhoto) {
  const localProfileSrc = profilePhoto.dataset.localSrc;
  const candidateProfile = new Image();

  candidateProfile.onload = () => {
    profilePhoto.src = localProfileSrc;
  };

  candidateProfile.src = localProfileSrc;
}

if (typedRole) {
  const roles = [
    "Software Engineer",
    "Backend Developer",
    "Laravel Developer",
    "Full Stack Developer"
  ];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (prefersReducedMotion.matches) {
    typedRole.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    typedRole.textContent = "";

    const typeRole = () => {
      const currentRole = roles[roleIndex];
      typedRole.textContent = currentRole.slice(0, charIndex);

      let delay = isDeleting ? 55 : 95;

      if (!isDeleting && charIndex === currentRole.length) {
        delay = 1400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 260;
      } else {
        charIndex += isDeleting ? -1 : 1;
      }

      window.setTimeout(typeRole, delay);
    };

    window.setTimeout(typeRole, 300);
  }
}

if (topbar && toggle) {
  const setMenuState = (isOpen) => {
    topbar.classList.toggle("menu-open", isOpen);
    document.documentElement.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = !topbar.classList.contains("menu-open");
    setMenuState(isOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      setMenuState(false);
    }
  });
}

if (portfolioTabs.length && galleryCards.length) {
  const animateVisibleCards = () => {
    const visibleCards = Array.from(galleryCards).filter((card) => !card.classList.contains("is-hidden"));

    visibleCards.forEach((card, index) => {
      card.classList.remove("is-entering");
      card.style.animationDelay = "0ms";
      void card.offsetWidth;
      card.style.animationDelay = `${index * 55}ms`;
      card.classList.add("is-entering");

      window.setTimeout(() => {
        card.classList.remove("is-entering");
        card.style.animationDelay = "0ms";
      }, 420 + index * 55);
    });
  };

  portfolioTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();

      const selectedFilter = tab.dataset.filter || "all";

      portfolioTabs.forEach((item) => {
        item.classList.toggle("active", item === tab);
      });

      if (portfolioSwitchTimer) {
        window.clearTimeout(portfolioSwitchTimer);
      }

      if (gallery) {
        gallery.classList.add("is-switching");
      }

      portfolioSwitchTimer = window.setTimeout(() => {
        galleryCards.forEach((card) => {
          const categories = (card.dataset.category || "").split(" ").filter(Boolean);
          const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);
          card.classList.toggle("is-hidden", !shouldShow);
        });

        requestAnimationFrame(() => {
          if (gallery) {
            gallery.classList.remove("is-switching");
          }
          animateVisibleCards();
        });
      }, 140);
    });
  });
}
