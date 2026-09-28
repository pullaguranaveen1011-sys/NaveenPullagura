import { getCurtainTransition, getProjectColorFromUrl } from './curtain-transition.js';
import { initThemeController } from './theme-controller.js';

/**
 * Interactive controller for Case Study pages (NuVeda 360, CALF 2.0, NU Coach)
 * Features:
 * 1. Smart-hiding top navbar (slides up on scroll-down, reveals on scroll-up)
 * 2. Closed 4-sided container card with internal smooth scrolling
 * 3. Floating Whisper Reading Pill (appears when reading down, circular progress ring, one-tap top jump)
 * 4. 5K Retina Lightbox Zoom (clicks on screenshots smoothly zooms into high-DPI modal)
 * 5. Live White-Label Re-Themer Sandbox (live interactive token re-skinning)
 * 6. Before / After Split Comparison Slider (draggable handle for legacy vs overhaul)
 * 7. Great UI Vertical Curtain Page Transition (0.3s fast between Case Studies)
 */
function initCaseStudy() {
  // Initialize theme controller so theme persists across all case studies
  initThemeController();

  // Initialize Great UI Vertical Curtain Page Transition (0.3s Fast Duration with dynamic project color)
  const projectColor = getProjectColorFromUrl(window.location.pathname);
  const curtain = getCurtainTransition({ duration: 0.3, color: projectColor });

  const navbar = document.getElementById('cs-navbar');
  const progressFill = document.getElementById('cs-progress-fill');
  const navLinks = document.querySelectorAll('.nav-pills-group .nav-pill');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const containerCard = document.querySelector('.cs-container-card');

  let lastScrollTop = 0;
  const scrollThreshold = 8;
  const topSafeZone = 50;

  // ==========================================================================
  // 1. Injected Floating Whisper Reading Pill
  // ==========================================================================
  let whisperPill = document.getElementById('cs-whisper-pill');
  if (!whisperPill) {
    whisperPill = document.createElement('div');
    whisperPill.className = 'cs-whisper-pill';
    whisperPill.id = 'cs-whisper-pill';
    whisperPill.setAttribute('role', 'button');
    whisperPill.setAttribute('aria-label', 'Return to top of case study');
    whisperPill.innerHTML = `
      <div class="cs-whisper-ring-wrap" aria-hidden="true">
        <svg class="cs-whisper-ring-svg" viewBox="0 0 24 24">
          <circle class="cs-whisper-ring-bg" cx="12" cy="12" r="10"></circle>
          <circle class="cs-whisper-ring-fill" id="cs-whisper-ring" cx="12" cy="12" r="10"></circle>
        </svg>
      </div>
      <span class="cs-whisper-label" id="cs-whisper-text">Overview</span>
      <span class="cs-whisper-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </span>
    `;
    document.body.appendChild(whisperPill);

    whisperPill.addEventListener('click', () => {
      if (containerCard) {
        containerCard.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (navbar) {
        navbar.classList.remove('is-hidden');
        document.body.classList.remove('nav-hidden');
      }
      document.body.classList.remove('whisper-active');
    });
  }

  const whisperRing = document.getElementById('cs-whisper-ring');
  const whisperText = document.getElementById('cs-whisper-text');
  const ringCircumference = 2 * Math.PI * 10; // ~62.83

  const isMobileScreen = () => window.innerWidth <= 768;

  // ==========================================================================
  // 2. Reading Progress, Smart Header Hide/Reveal & ScrollSpy
  // ==========================================================================
  const handleScroll = () => {
    const isMobile = isMobileScreen();
    const scrollTop = (!isMobile && containerCard)
      ? containerCard.scrollTop
      : (window.scrollY || document.documentElement.scrollTop);

    const docHeight = (!isMobile && containerCard)
      ? (containerCard.scrollHeight - containerCard.clientHeight)
      : (document.documentElement.scrollHeight - document.documentElement.clientHeight);

    // Reading Progress Fill
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) {
      progressFill.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // Whisper Circular Progress
    if (whisperRing) {
      const ringOffset = ringCircumference - (Math.min(100, Math.max(0, scrollPercent)) / 100) * ringCircumference;
      whisperRing.style.strokeDashoffset = `${ringOffset}`;
    }

    // Smart-Hiding Navigation Bar & Whisper Pill Reveal
    if (navbar) {
      if (scrollTop <= topSafeZone) {
        navbar.classList.remove('is-hidden');
        document.body.classList.remove('nav-hidden');
        document.body.classList.remove('whisper-active');
      } else if (scrollTop > lastScrollTop + scrollThreshold) {
        // User scrolling down to read -> hide top navbar for focus, reveal whisper pill
        navbar.classList.add('is-hidden');
        document.body.classList.add('nav-hidden');
        if (scrollTop > 220) {
          document.body.classList.add('whisper-active');
        }
      } else if (scrollTop < lastScrollTop - scrollThreshold) {
        // User scrolling up -> reveal top navbar, hide whisper pill
        navbar.classList.remove('is-hidden');
        document.body.classList.remove('nav-hidden');
        document.body.classList.remove('whisper-active');
      }
    }
    lastScrollTop = Math.max(0, scrollTop);

    // ScrollSpy: Active Section Tracker
    const isAtBottom = docHeight > 0 && scrollTop >= (docHeight - 60);
    let currentSectionId = '';
    let currentSectionTitle = '';

    if (isAtBottom) {
      const allSections = Array.from(sections);
      if (allSections.length > 0) {
        const lastSec = allSections[allSections.length - 1];
        currentSectionId = lastSec.getAttribute('id');
        const h = lastSec.querySelector('h2, h1');
        currentSectionTitle = h ? h.textContent.trim() : currentSectionId;
      }
    } else if (!isMobile && containerCard) {
      const cardRect = containerCard.getBoundingClientRect();
      sections.forEach((section) => {
        const id = section.getAttribute('id');
        if (!id) return;
        const relTop = section.getBoundingClientRect().top - cardRect.top;
        if (relTop <= 170) {
          currentSectionId = id;
          const h = section.querySelector('h2, h1');
          currentSectionTitle = h ? h.textContent.trim() : id;
        }
      });
    } else {
      sections.forEach((section) => {
        const id = section.getAttribute('id');
        if (!id) return;
        const sectionTop = section.getBoundingClientRect().top + scrollTop - 170;
        if (scrollTop >= sectionTop) {
          currentSectionId = id;
          const h = section.querySelector('h2, h1');
          currentSectionTitle = h ? h.textContent.trim() : id;
        }
      });
    }

    if (!currentSectionId && sections.length > 0) {
      currentSectionId = sections[0].getAttribute('id');
      const h = sections[0].querySelector('h2, h1');
      currentSectionTitle = h ? h.textContent.trim() : currentSectionId;
    }

    if (whisperText && currentSectionTitle) {
      // Clean display text (shorten if necessary)
      const cleanTitle = currentSectionTitle.split('—')[0].split(':')[0].trim();
      whisperText.textContent = cleanTitle || 'Overview';
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const targetId = href ? href.replace('#', '') : '';
      if (targetId === currentSectionId ||
          ((currentSectionId === 'hero' || currentSectionId === 'overview') && (targetId === 'hero' || targetId === 'overview'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Attach scroll listeners
  if (containerCard) {
    containerCard.addEventListener('scroll', handleScroll, { passive: true });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();

  // Smooth Scrolling for Navigation Links with Container Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const isMobile = isMobileScreen();
        if (!isMobile && containerCard) {
          const cardRect = containerCard.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const targetScrollTop = containerCard.scrollTop + (targetRect.top - cardRect.top) - 18;
          containerCard.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        } else {
          const headerOffset = 76;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Back to Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isMobile = isMobileScreen();
      if (!isMobile && containerCard) {
        containerCard.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (navbar) {
        navbar.classList.remove('is-hidden');
        document.body.classList.remove('nav-hidden');
      }
      document.body.classList.remove('whisper-active');
    });
  }

  // Smooth Wheel Delegation from Gutters to Container Card (Desktop only)
  if (containerCard) {
    window.addEventListener('wheel', (e) => {
      if (!isMobileScreen() && !containerCard.contains(e.target)) {
        containerCard.scrollTop += e.deltaY;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 3. 5K Retina Lightbox Zoom Modal
  // ==========================================================================
  let lightboxModal = document.getElementById('cs-lightbox-modal');
  if (!lightboxModal) {
    lightboxModal = document.createElement('div');
    lightboxModal.id = 'cs-lightbox-modal';
    lightboxModal.className = 'cs-lightbox-modal';
    lightboxModal.innerHTML = `
      <div class="cs-lightbox-container">
        <button type="button" class="cs-lightbox-close" id="cs-lightbox-close-btn" aria-label="Close image zoom">✕</button>
        <img src="" alt="" class="cs-lightbox-img" id="cs-lightbox-img" />
        <div class="cs-lightbox-caption" id="cs-lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightboxModal);

    const closeBtn = document.getElementById('cs-lightbox-close-btn');
    const closeLightbox = () => {
      lightboxModal.classList.remove('is-open');
    };

    closeBtn && closeBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  const lightboxImg = document.getElementById('cs-lightbox-img');
  const lightboxCaption = document.getElementById('cs-lightbox-caption');

  const openLightbox = (imgSrc, imgAlt) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt || 'Zoomed design preview';
    if (lightboxCaption) {
      lightboxCaption.textContent = imgAlt || '5K Retina Architecture Preview';
    }
    lightboxModal.classList.add('is-open');
  };

  // Wire all showcase images to the Lightbox (support high-speed thumbnail + full-res zoom)
  const zoomableImages = document.querySelectorAll('.cs-showcase-image, .cs-hero-clean-img, [data-zoomable="true"]');
  zoomableImages.forEach((img) => {
    img.setAttribute('title', 'Click to inspect in 5K Retina Lightbox');
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full-src') || img.getAttribute('src');
      openLightbox(fullSrc, img.getAttribute('alt'));
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCaseStudy);
} else {
  initCaseStudy();
}

