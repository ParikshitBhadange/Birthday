// Final script.js with timeline as regular section

// Enhanced scroll to section function
function scrollToSection(sectionId) {
  const tryScroll = () => {
    const section = document.getElementById(sectionId);
    if (section) {
      let top;

      // Special handling for finale section
      if (sectionId.toLowerCase() === "finale") {
        const offset = window.innerWidth < 768 ? 60 : 80;
        top = section.offsetTop - offset;
        
        // Ensure finale is initialized after scrolling
        setTimeout(() => {
          if (typeof initFinaleSection === "function") {
            initFinaleSection();
          }
        }, 500);
      } else if (sectionId.toLowerCase() === "timeline") {
        // Special handling for timeline section
        const offset = window.innerWidth < 768 ? 60 : 80;
        top = section.offsetTop - offset;
        
        // Ensure timeline is initialized after scrolling
        setTimeout(() => {
          if (typeof initTimelineSection === "function") {
            initTimelineSection();
          }
        }, 500);
      } else if (sectionId.toLowerCase() === "finally") {
        // Keep existing behavior for "finally"
        top = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        const offset = window.innerWidth < 768 ? 60 : 80;
        top = section.offsetTop - offset;
      }

      window.scrollTo({ top, behavior: 'smooth' });

      // Update active state
      updateActiveNavigation(sectionId);

      // Close mobile menu if open
      if (window.innerWidth < 1024) toggleMobileMenu?.(false);

      return true;
    }
    return false;
  };

  // Try now, or retry every 100ms up to 3 seconds
  if (!tryScroll()) {
    let attempts = 0;
    const interval = setInterval(() => {
      if (tryScroll() || attempts++ > 30) clearInterval(interval);
    }, 100);
  }
}

function updateActiveNavigation(sectionId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick')?.includes(sectionId)) {
      btn.classList.add('active');
    }
  });
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick')?.includes(sectionId)) {
      btn.classList.add('active');
    }
  });
}

// Enhanced letter trigger function
function triggerLetter() {
  scrollToSection('letter');
  
  setTimeout(() => {
    const letterSection = document.getElementById('letter');
    if (letterSection) {
      console.log('Letter section accessed');
    }
  }, 500);
}

// Hamburger functionality
let isMobileMenuOpen = false;

function toggleMobileMenu(forceState) {
  const menu = document.getElementById("mobile-menu");
  const menuBtn = document.getElementById("mobile-menu-btn");

  if (typeof forceState === "boolean") {
    isMobileMenuOpen = forceState;
  } else {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  if (isMobileMenuOpen) {
    menu.classList.remove("hidden");
    menuBtn.setAttribute('aria-expanded', 'true');
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  } else {
    menu.classList.add("hidden");
    menuBtn.setAttribute('aria-expanded', 'false');
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Close menu when clicking outside - ADD THIS TO YOUR script.js
document.addEventListener("click", (e) => {
  const nav = document.querySelector("nav");
  if (isMobileMenuOpen && nav && !nav.contains(e.target)) {
    toggleMobileMenu(false);
  }
});

// Auto-close menu when resizing to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024 && isMobileMenuOpen) {
    toggleMobileMenu(false);
  }
});

// Close menu after any nav click
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("mobile-nav-btn") &&
    isMobileMenuOpen
  ) {
    toggleMobileMenu(false);
  }
});

// Enhanced section observer
function initSectionObserver() {
  const sections = ['home', 'letter', 'gallery', 'quiz', 'timeline', 'finale'];
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        
        // Special initialization for sections when they come into view
        if (sectionId === 'finale' && typeof initFinaleSection === "function") {
          setTimeout(() => {
            initFinaleSection();
          }, 200);
        } else if (sectionId === 'timeline' && typeof initTimelineSection === "function") {
          setTimeout(() => {
            initTimelineSection();
          }, 200);
        }
        
        // Update active navigation
        updateActiveNavigation(sectionId);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -80px 0px'
  });

  const observeSections = () => {
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section && !section.dataset.observed) {
        observer.observe(section);
        section.dataset.observed = 'true';
      }
    });
  };

  observeSections();
  setTimeout(observeSections, 1000);
  setTimeout(observeSections, 3000);
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.triggerLetter = triggerLetter;
window.toggleMobileMenu = toggleMobileMenu;
window.updateActiveNavigation = updateActiveNavigation;

// Initialize section observer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSectionObserver);
} else {
  initSectionObserver();
}