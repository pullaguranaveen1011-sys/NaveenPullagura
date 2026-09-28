/**
 * Great UI Vertical Curtain Page Transition (0.3s Fast Duration)
 * Project-Themed Colors & Zero-Glitch Navigation
 * 
 * Project Colors:
 * - NuVeda 360: #022EB4 (Signature Royal Blue)
 * - CALF 2.0: #FF6B00 (Enterprise Product Orange)
 * - NU Coach AI: #6366F1 (AI Electric Indigo)
 * - Portfolio Home: #022EB4 (Signature Blue)
 */

export const PROJECT_THEME_COLORS = {
  nuveda360: '#0D9488', // NuVeda 360 Signature Case Study Teal
  calf: '#FF6B00',      // CALF 2.0 Enterprise Product Orange
  nucoach: '#6366F1',   // NU Coach AI Electric Indigo
  phantasm: '#78350F',  // Phantasm Solutions Rich Warm Brown
  portfolio: '#022EB4', // Signature Portfolio Royal Blue
};

export function getProjectColorFromUrl(url) {
  if (!url) return PROJECT_THEME_COLORS.portfolio;
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  
  if (cleanUrl.includes('calf')) return PROJECT_THEME_COLORS.calf;
  if (cleanUrl.includes('nu-coach') || cleanUrl.includes('nucoach')) return PROJECT_THEME_COLORS.nucoach;
  if (cleanUrl.includes('phantasm') || cleanUrl.includes('smokewana')) return PROJECT_THEME_COLORS.phantasm;
  if (cleanUrl.includes('nu360') || cleanUrl.includes('nuveda-360') || cleanUrl.includes('nuveda360')) {
    return PROJECT_THEME_COLORS.nuveda360;
  }
  if (cleanUrl.includes('portfolio-home') || cleanUrl.includes('portfolio') || cleanUrl.endsWith('index.html') || cleanUrl === '/' || cleanUrl === '') {
    return PROJECT_THEME_COLORS.portfolio;
  }
  return PROJECT_THEME_COLORS.portfolio;
}

export class CurtainTransitionController {
  constructor(options = {}) {
    this.duration = options.duration !== undefined ? options.duration : 0.3; // 0.3s fast
    this.container = null;
    this.topPanel = null;
    this.bottomPanel = null;
    this.isTransitioning = false;

    this.initDOM();
    this.checkInitialReveal();
    this.attachLinkInterceptors();
  }

  initDOM() {
    let existing = document.getElementById('curtain-page-transition');
    if (existing) {
      this.container = existing;
      this.topPanel = this.container.querySelector('.curtain-panel-top');
      this.bottomPanel = this.container.querySelector('.curtain-panel-bottom');
    } else {
      this.container = document.createElement('div');
      this.container.id = 'curtain-page-transition';
      this.container.className = 'curtain-page-transition state-idle';
      this.container.setAttribute('aria-hidden', 'true');

      this.topPanel = document.createElement('div');
      this.topPanel.className = 'curtain-panel curtain-panel-top';

      this.bottomPanel = document.createElement('div');
      this.bottomPanel.className = 'curtain-panel curtain-panel-bottom';

      this.container.appendChild(this.topPanel);
      this.container.appendChild(this.bottomPanel);
      if (document.body) {
        document.body.appendChild(this.container);
      }
    }
  }

  setCurtainColor(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--curtain-active-color', color);
    if (this.topPanel) this.topPanel.style.backgroundColor = color;
    if (this.bottomPanel) this.bottomPanel.style.backgroundColor = color;
  }

  /**
   * On page load: if navigated via curtain transition, play the 0.3s reveal split.
   * Top panel moves up (0% -> -100%), bottom panel moves down (0% -> 100%).
   */
  checkInitialReveal() {
    try {
      if (sessionStorage.getItem('curtain_reveal_pending') === '1') {
        sessionStorage.removeItem('curtain_reveal_pending');
        window.__curtainJustRevealed = true;
        const color = sessionStorage.getItem('curtain_reveal_color') || getProjectColorFromUrl(window.location.pathname);
        sessionStorage.removeItem('curtain_reveal_color');
        this.setCurtainColor(color);

        // Clear any inline styles that could conflict with CSS keyframes
        if (this.topPanel) {
          this.topPanel.style.transition = '';
          this.topPanel.style.transform = '';
          this.topPanel.style.backgroundColor = color;
        }
        if (this.bottomPanel) {
          this.bottomPanel.style.transition = '';
          this.bottomPanel.style.transform = '';
          this.bottomPanel.style.backgroundColor = color;
        }

        // Remove early head hold lock
        document.documentElement.classList.remove('curtain-opening');

        // Trigger opening keyframe animation (Top -> -100%, Bottom -> 100%)
        this.container.className = 'curtain-page-transition is-active is-opening';
        this.container.setAttribute('aria-hidden', 'false');

        // Animation completes in 0.3s (plus 50ms buffer to ensure clean finish)
        const revealDurationMs = Math.round(this.duration * 1000) + 50;
        setTimeout(() => {
          this.container.className = 'curtain-page-transition state-idle';
          this.container.setAttribute('aria-hidden', 'true');
          if (this.topPanel) {
            this.topPanel.style.transition = '';
            this.topPanel.style.transform = '';
          }
          if (this.bottomPanel) {
            this.bottomPanel.style.transition = '';
            this.bottomPanel.style.transform = '';
          }
          this.isTransitioning = false;
        }, revealDurationMs);
      } else {
        document.documentElement.classList.remove('curtain-opening');
      }
    } catch (e) {
      document.documentElement.classList.remove('curtain-opening');
    }

    // Safety watchdog for browser back/forward history cache
    window.addEventListener('pageshow', () => {
      document.documentElement.classList.remove('curtain-opening');
      if (this.container) {
        this.container.className = 'curtain-page-transition state-idle';
        this.container.setAttribute('aria-hidden', 'true');
      }
      if (this.topPanel) {
        this.topPanel.style.transition = '';
        this.topPanel.style.transform = '';
      }
      if (this.bottomPanel) {
        this.bottomPanel.style.transition = '';
        this.bottomPanel.style.transform = '';
      }
      this.isTransitioning = false;
    });
  }

  /**
   * Closes the curtain vertically using the destination project's theme color (0.3s),
   * then navigates to targetUrl
   */
  navigate(targetUrl, explicitColor) {
    if (this.isTransitioning || !targetUrl) return;
    this.isTransitioning = true;

    // Safety timeout in case navigation is cancelled or delayed
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500);

    const color = explicitColor || getProjectColorFromUrl(targetUrl);
    this.setCurtainColor(color);

    try {
      sessionStorage.setItem('curtain_reveal_pending', '1');
      sessionStorage.setItem('curtain_reveal_color', color);
    } catch (e) {
      // Ignore
    }

    // Clear any inline styles that could conflict with CSS keyframes
    if (this.topPanel) {
      this.topPanel.style.transition = '';
      this.topPanel.style.transform = '';
      this.topPanel.style.backgroundColor = color;
    }
    if (this.bottomPanel) {
      this.bottomPanel.style.transition = '';
      this.bottomPanel.style.transform = '';
      this.bottomPanel.style.backgroundColor = color;
    }

    // Trigger keyframe closing animation (Top -> 0%, Bottom -> 0%)
    this.container.className = 'curtain-page-transition is-active is-closing';
    this.container.setAttribute('aria-hidden', 'false');

    // When fully closed in 0.3s, navigate to target page
    const navigateDelay = Math.round(this.duration * 1000);
    setTimeout(() => {
      window.location.href = targetUrl;
    }, navigateDelay);
  }

  /**
   * Intercepts "Next Case Study" buttons and cross-study navigation links
   */
  attachLinkInterceptors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }

      const isCaseStudyLink = 
        link.classList.contains('cs-footer-btn-secondary') ||
        link.classList.contains('cs-footer-sublink') ||
        href.includes('index.html') ||
        href.includes('calf.html') ||
        href.includes('nu-coach.html') ||
        href.includes('phantasm.html') ||
        href.includes('portfolio-home.html') ||
        href === '/' ||
        href === '/calf' ||
        href === '/nu-coach' ||
        href === '/phantasm';

      if (isCaseStudyLink) {
        e.preventDefault();
        e.stopPropagation();
        this.navigate(href);
      }
    }, { capture: true });
  }
}

// Singleton helper
let curtainInstance = null;
export function getCurtainTransition(options) {
  if (!curtainInstance) {
    curtainInstance = new CurtainTransitionController(options);
  }
  return curtainInstance;
}

// Auto-initialize singleton as soon as DOM is ready or loading
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getCurtainTransition();
    });
  } else {
    getCurtainTransition();
  }
}
