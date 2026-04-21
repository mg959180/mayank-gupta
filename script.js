const topbar = document.querySelector(".topbar");
const toggle = document.querySelector(".nav-toggle");
const menuLinks = document.querySelectorAll(".nav a, .nav-panel .hire-button");
const typedRole = document.querySelector(".typed-role");
const hero = document.querySelector(".hero");
const profilePhoto = document.querySelector(".profile-pic img[data-local-src]");
const gallery = document.querySelector(".gallery");
const portfolioTabs = document.querySelectorAll(".portfolio-filter a");
const galleryCards = document.querySelectorAll(".gallery-card");
const jobSummaries = document.querySelectorAll(".timeline-card .readmore");
const aboutDescriptions = document.querySelectorAll(".about-description.readmore");
const revealSections = document.querySelectorAll("main section");
const skillBars = document.querySelectorAll(".skills .bar div");
let portfolioSwitchTimer = null;

if (revealSections.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  revealSections.forEach((section) => {
    section.classList.add("reveal-on-scroll");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => {
      section.classList.add("is-visible");
    });
  } else {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -80px 0px"
    });

    revealSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
}

if (skillBars.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  skillBars.forEach((bar) => {
    bar.dataset.targetWidth = bar.style.width || "0%";
    bar.style.width = prefersReducedMotion ? bar.dataset.targetWidth : "0%";
  });

  const animateSkillBars = () => {
    skillBars.forEach((bar, index) => {
      window.setTimeout(() => {
        bar.style.width = bar.dataset.targetWidth;
      }, index * 120);
    });
  };

  const resetSkillBars = () => {
    skillBars.forEach((bar) => {
      bar.style.width = "0%";
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    animateSkillBars();
  } else {
    const skills = document.querySelector(".skills");
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
        } else {
          resetSkillBars();
        }
      });
    }, {
      threshold: 0.35
    });

    if (skills) {
      skillsObserver.observe(skills);
    }
  }
}

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

if (jobSummaries.length) {
  const setCollapsedHeight = (summary) => {
    const lineHeight = parseFloat(window.getComputedStyle(summary).lineHeight);
    const collapsedHeight = lineHeight * 2;

    summary.style.setProperty("--readmore-collapsed-height", `${collapsedHeight}px`);
    summary.style.maxHeight = `${collapsedHeight}px`;
  };

  jobSummaries.forEach((summary, index) => {
    const button = document.createElement("button");
    const summaryId = summary.id || `job-summary-${index + 1}`;

    summary.id = summaryId;
    setCollapsedHeight(summary);
    summary.classList.add("is-collapsed");

    button.type = "button";
    button.className = "readmore-toggle";
    button.textContent = "Read More";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", summaryId);

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        summary.style.maxHeight = `${summary.scrollHeight}px`;

        requestAnimationFrame(() => {
          setCollapsedHeight(summary);
          summary.classList.add("is-collapsed");
        });
      } else {
        summary.classList.remove("is-collapsed");
        summary.style.maxHeight = `${summary.scrollHeight}px`;
        summary.closest(".timeline-card").scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      button.textContent = isExpanded ? "Read More" : "Read Less";
      button.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    });

    summary.insertAdjacentElement("afterend", button);
  });

  window.addEventListener("resize", () => {
    jobSummaries.forEach((summary) => {
      const isCollapsed = summary.classList.contains("is-collapsed");

      if (isCollapsed) {
        setCollapsedHeight(summary);
      } else {
        summary.style.maxHeight = `${summary.scrollHeight}px`;
      }
    });
  });
}

if (aboutDescriptions.length) {
  const setAboutCollapsedHeight = (description) => {
    const firstParagraph = description.querySelector("p");
    const lineHeight = parseFloat(window.getComputedStyle(firstParagraph || description).lineHeight);
    const collapsedLines = Number(description.dataset.collapsedLines) || 3;
    const collapsedHeight = lineHeight * collapsedLines;

    description.style.setProperty("--readmore-collapsed-height", `${collapsedHeight}px`);
    description.style.maxHeight = `${collapsedHeight}px`;
  };

  aboutDescriptions.forEach((description, index) => {
    const button = document.createElement("button");
    const descriptionId = description.id || `about-description-${index + 1}`;

    description.id = descriptionId;
    setAboutCollapsedHeight(description);
    description.classList.add("is-collapsed");

    button.type = "button";
    button.className = "readmore-toggle";
    button.textContent = "Read More";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", descriptionId);

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        description.style.maxHeight = `${description.scrollHeight}px`;

        requestAnimationFrame(() => {
          setAboutCollapsedHeight(description);
          description.classList.add("is-collapsed");
        });
      } else {
        description.classList.remove("is-collapsed");
        description.style.maxHeight = `${description.scrollHeight}px`;
        description.closest(".about-content").scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      button.textContent = isExpanded ? "Read More" : "Read Less";
      button.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    });

    description.insertAdjacentElement("afterend", button);
  });

  window.addEventListener("resize", () => {
    aboutDescriptions.forEach((description) => {
      const isCollapsed = description.classList.contains("is-collapsed");

      if (isCollapsed) {
        setAboutCollapsedHeight(description);
      } else {
        description.style.maxHeight = `${description.scrollHeight}px`;
      }
    });
  });
}
