// Performance Analytics - Privacy-Focused
const analytics = {
  sessionStart: Date.now(),
  events: [],

  track(event, data = {}) {
    this.events.push({
      event,
      timestamp: Date.now(),
      data,
    });

    // Store locally for analysis
    localStorage.setItem("macrosight_analytics", JSON.stringify(this.events));
  },
};

// Track key interactions
document.addEventListener("DOMContentLoaded", () => {
  analytics.track("page_load", {
    page: "home",
    userAgent: navigator.userAgent.includes("Mobile") ? "mobile" : "desktop",
  });
});

document.addEventListener("mobile-menu-toggle", (e) => {
  analytics.track("mobile_menu_toggle", {
    action: e.detail.isActive ? "open" : "close",
  });
});

// Track CTA clicks
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    analytics.track("cta_click", {
      button: e.target.textContent.trim(),
      section: "hero",
    });
  });
});

// Track section visibility
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionName =
          entry.target.querySelector("h2")?.textContent || "unknown";
        analytics.track("section_view", { section: sectionName });
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".section").forEach((section) => {
  sectionObserver.observe(section);
});

// Track mobile nav clicks
document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    analytics.track("nav_click", {
      page: e.target.textContent.trim(),
      context: "mobile_menu",
    });
  });
});

// Track desktop nav clicks
document.querySelectorAll(".desktop-nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    analytics.track("nav_click", {
      page: e.target.textContent.trim(),
      context: "desktop_nav",
    });
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll-based header styling
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector("header");

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop;
});

// Performance optimization for mobile
if ("ontouchstart" in window) {
  document.body.classList.add("touch-device");
  analytics.track("device_type", { type: "touch" });

  // Add touch event handling for mobile nav
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("touchstart", function () {
      this.style.backgroundColor = "var(--color-accent)";
      this.style.color = "var(--color-bg)";
    });

    link.addEventListener("touchend", function () {
      setTimeout(() => {
        this.style.backgroundColor = "";
        this.style.color = "";
      }, 100);
    });
  });
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Animate sections on load
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".section > *");
  animatedElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
  });
});

// Track session duration on page unload
window.addEventListener("beforeunload", () => {
  const sessionDuration = Date.now() - analytics.sessionStart;
  analytics.track("session_end", {
    duration: sessionDuration,
    events_count: analytics.events.length,
  });
});
