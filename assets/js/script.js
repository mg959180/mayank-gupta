const topbar = document.querySelector(".topbar");
const toggle = document.querySelector(".nav-toggle");
const menuLinks = document.querySelectorAll(".nav a, .nav-panel .hire-button");
const navDropdowns = document.querySelectorAll(".nav-dropdown");
const navDropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
const submenuGroups = document.querySelectorAll(".submenu-group");
const submenuGroupToggles = document.querySelectorAll(".submenu-group-toggle");
const typedRole = document.querySelector(".typed-role");
const hero = document.querySelector(".hero");
const profilePhoto = document.querySelector(".profile-pic img[data-local-src]");
const jobSummaries = document.querySelectorAll(".timeline-card .readmore");
const aboutDescriptions = document.querySelectorAll(".about-description.readmore");
const revealSections = document.querySelectorAll("main section");
const skillBars = document.querySelectorAll(".skills .bar div");
const quotationForm = document.querySelector("#quotation-form");

const emailConfig = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID"
};

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
    document.documentElement.style.setProperty("--hero-banner-image", 'url("../hero-banner.png")');
  };

  heroBanner.src = "../hero-banner.png";
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
  const resetSubmenus = () => {
    navDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
    });

    navDropdownToggles.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    submenuGroups.forEach((group) => {
      group.classList.remove("is-open");
    });

    submenuGroupToggles.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
  };

  const setMenuState = (isOpen) => {
    topbar.classList.toggle("menu-open", isOpen);
    document.documentElement.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (!isOpen) {
      resetSubmenus();
    }
  };

  toggle.addEventListener("click", () => {
    const isOpen = !topbar.classList.contains("menu-open");
    setMenuState(isOpen);
  });

  navDropdownToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const dropdown = button.closest(".nav-dropdown");
      const isOpen = dropdown.classList.toggle("is-open");

      button.setAttribute("aria-expanded", isOpen ? "true" : "false");

      if (!isOpen) {
        dropdown.querySelectorAll(".submenu-group").forEach((group) => {
          group.classList.remove("is-open");
        });

        dropdown.querySelectorAll(".submenu-group-toggle").forEach((groupButton) => {
          groupButton.setAttribute("aria-expanded", "false");
        });
      }
    });
  });

  submenuGroupToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".submenu-group");
      const isOpen = group.classList.toggle("is-open");

      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      setMenuState(false);
    }
  });
}

if (quotationForm) {
  const submitButton = quotationForm.querySelector(".contact-button");
  const formStatus = quotationForm.querySelector(".form-status");
  const formFields = {
    name: quotationForm.elements.name,
    email: quotationForm.elements.email,
    phone: quotationForm.elements.phone,
    service: quotationForm.elements.service,
    projectDetails: quotationForm.elements.project_details
  };
  const stripRiskyPatterns = (value) => value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/(\b(select|insert|update|delete|drop|alter|truncate|union|exec)\b|--|\/\*|\*\/)/gi, "")
    .replace(/[<>"'`=\\]/g, "");

  const sanitizeText = (value) => stripRiskyPatterns(value)
    .replace(/\s+/g, " ")
    .trim();

  const sanitizeEmail = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, "")
    .trim();

  const sanitizePhone = (value) => value
    .replace(/[^\d+\-()\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const sanitizeService = (value) => {
    const allowedServices = [
      "static-website",
      "custom-website",
      "ecommerce",
      "database",
      "api",
      "support"
    ];

    return allowedServices.includes(value) ? value : "";
  };

  const sanitizeTextarea = (value) => stripRiskyPatterns(value)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sanitizeFormValues = () => {
    formFields.name.value = sanitizeText(formFields.name.value);
    formFields.email.value = sanitizeEmail(formFields.email.value);
    formFields.phone.value = sanitizePhone(formFields.phone.value);
    formFields.service.value = sanitizeService(formFields.service.value);
    formFields.projectDetails.value = sanitizeTextarea(formFields.projectDetails.value);
  };

  const validators = {
    name: (value) => {
      if (!value.trim()) {
        return "Please enter your full name.";
      }

      if (value.trim().length < 3) {
        return "Name must be at least 3 characters.";
      }

      return "";
    },
    email: (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value.trim()) {
        return "Please enter your email address.";
      }

      if (!emailPattern.test(value.trim())) {
        return "Please enter a valid email address.";
      }

      return "";
    },
    phone: (value) => {
      const phoneValue = value.trim();
      const digits = phoneValue.replace(/\D/g, "");

      if (!phoneValue) {
        return "Please enter your phone or WhatsApp number.";
      }

      if (digits.length < 10 || digits.length > 15) {
        return "Phone number must contain 10 to 15 digits.";
      }

      return "";
    },
    service: (value) => {
      if (!value) {
        return "Please select a service.";
      }

      return "";
    },
    projectDetails: (value) => {
      if (!value.trim()) {
        return "Please share your project requirements.";
      }

      if (value.trim().length < 20) {
        return "Project requirements must be at least 20 characters.";
      }

      return "";
    }
  };

  const setFormStatus = (message, type = "") => {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.classList.toggle("is-visible", Boolean(message));
    formStatus.classList.toggle("is-success", type === "success");
    formStatus.classList.toggle("is-error", type === "error");
  };

  const setFieldError = (field, message) => {
    const fieldWrapper = field.closest(".form-field");
    const errorMessage = fieldWrapper ? fieldWrapper.querySelector(".field-error") : null;

    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorMessage) {
      errorMessage.textContent = message;      
      errorMessage.classList.toggle("is-visible", Boolean(message));
    }
  };

  const validateField = (fieldKey) => {
    const field = formFields[fieldKey];
    const validator = validators[fieldKey];

    if (!field || !validator) {
      return true;
    }

    const errorMessage = validator(field.value);

    setFieldError(field, errorMessage);
    return !errorMessage;
  };

  const validateQuotationForm = () => {
    const fieldKeys = Object.keys(formFields);
    const invalidFieldKey = fieldKeys.reduce((firstInvalidKey, fieldKey) => {
      const isValid = validateField(fieldKey);

      return firstInvalidKey || (isValid ? "" : fieldKey);
    }, "");

    if (invalidFieldKey) {
      formFields[invalidFieldKey].focus();
      setFormStatus("Please fix the highlighted fields before sending.", "error");
      return false;
    }

    setFormStatus("");
    return true;
  };

  Object.keys(formFields).forEach((fieldKey) => {
    const field = formFields[fieldKey];

    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      if (fieldKey === "email") {
        field.value = sanitizeEmail(field.value);
      } else if (fieldKey === "phone") {
        field.value = sanitizePhone(field.value);
      } else if (fieldKey === "service") {
        field.value = sanitizeService(field.value);
      } else {
        field.value = field.value.replace(/[<>"'`=\\]/g, "");
      }

      validateField(fieldKey);
    });

    field.addEventListener("blur", () => {
      validateField(fieldKey);
    });
  });

  quotationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sanitizeFormValues();

    if (!validateQuotationForm()) {
      return;
    }

    if (!window.emailjs) {
      setFormStatus("Email service is not loaded. Please try again later.", "error");
      return;
    }

    if (emailConfig.publicKey.includes("YOUR_") || emailConfig.serviceId.includes("YOUR_") || emailConfig.templateId.includes("YOUR_")) {
      setFormStatus("Email setup is pending. Please add your EmailJS keys in script.js.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setFormStatus("Sending your hiring request...");

    emailjs.init({
      publicKey: emailConfig.publicKey
    });

    emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, quotationForm)
      .then(() => {
        quotationForm.reset();
        setFormStatus("Thank you. Your hiring request has been sent.", "success");
      })
      .catch(() => {
        setFormStatus("Sorry, your request could not be sent. Please email me directly.", "error");
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Hire Me";
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
