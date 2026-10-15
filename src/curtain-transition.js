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
   * On page load: if navigated via curtain transition, play the smooth reveal split.
   * Top panel moves up (0% -> -100%), bottom panel moves down (0% -> 100%).
   */
  checkInitialReveal() {
    try {
      if (window.__curtainHandledByController) return;
      window.__curtainHandledByController = true;

      const isPending = sessionStorage.getItem('curtain_reveal_pending') === '1';
      const isAlreadyRevealing = document.documentElement.classList.contains('curtain-revealing');

      if (isPending || isAlreadyRevealing) {
        sessionStorage.removeItem('curtain_reveal_pending');
        window.__curtainJustRevealed = true;
        const color = sessionStorage.getItem('curtain_reveal_color') || getProjectColorFromUrl(window.location.pathname);
        sessionStorage.removeItem('curtain_reveal_color');
        this.setCurtainColor(color);

        // Keep early hold removed and start opening transition cleanly
        document.documentElement.classList.remove('curtain-opening');
        document.documentElement.classList.add('curtain-revealing');

        if (this.container) {
          this.container.className = 'curtain-page-transition is-active is-opening';
          this.container.setAttribute('aria-hidden', 'false');
        }

        // Allow animation to complete smoothly (450ms) before idling
        setTimeout(() => {
          document.documentElement.classList.remove('curtain-opening', 'curtain-revealing');
          if (this.container) {
            this.container.className = 'curtain-page-transition state-idle';
            this.container.setAttribute('aria-hidden', 'true');
          }
          this.isTransitioning = false;
        }, 500);
      } else {
        document.documentElement.classList.remove('curtain-opening', 'curtain-revealing');
      }
    } catch (e) {
      document.documentElement.classList.remove('curtain-opening', 'curtain-revealing');
    }

    // Safety watchdog for browser back/forward history cache
    window.addEventListener('pageshow', () => {
      document.documentElement.classList.remove('curtain-opening', 'curtain-revealing');
      if (this.container) {
        this.container.className = 'curtain-page-transition state-idle';
        this.container.setAttribute('aria-hidden', 'true');
      }
      this.isTransitioning = false;
    });
  }

  /**
   * Closes the curtain vertically using the destination project's theme color (0.35s),
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

    // Trigger keyframe closing animation (Top -> 0%, Bottom -> 0%)
    this.container.className = 'curtain-page-transition is-active is-closing';
    this.container.setAttribute('aria-hidden', 'false');

    // When fully closed in 0.32s, navigate to target page
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 320);
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

      // Check if it's pointing to the same page with an anchor hash (e.g. /index.html#hero or /index.html#work)
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
      const targetPath = href.split('?')[0].split('#')[0].replace(/\/$/, '');
      if (href.includes('#') && (targetPath === '' || targetPath === currentPath || (currentPath.endsWith('index.html') && targetPath === ''))) {
        // Same-page anchor navigation: let native/main.js handle it without curtain reload
        return;
      }

      const isCaseStudyLink = 
        link.classList.contains('cs-footer-btn-secondary') ||
        link.classList.contains('cs-footer-sublink') ||
        href.includes('nuveda-360') ||
        href.includes('nu360') ||
        href.includes('calf.html') ||
        href.includes('nu-coach.html') ||
        href.includes('phantasm.html') ||
        href.includes('resume-print.html') ||
        (href.includes('index.html') && !currentPath.endsWith('index.html')) ||
        (href === '/' && currentPath !== '/index.html' && currentPath !== '');

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
