/**
 * Curated Luxury Theme Controller
 * Supports 9 Editorial Color Palettes including Pure Black OLED Dark Mode + Signature Blue Default
 * Features Live Mouse/Touch Drag Scrubbing, 50/50 Split-Circle Swatches, Swap Polarity (Invert), and Keyboard Shortcuts (T / I)
 */

export const THEMES = [
  {
    id: 'signature-blue',
    label: 'Signature Blue',
    primary: '#022EB4',
    secondary: '#FFFFFF',
    accent: '#022EB4',
    defaultMode: 'light'
  },
  {
    id: 'pure-black',
    label: 'Pure Black',
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#FFFFFF',
    defaultMode: 'dark'
  },
  {
    id: 'royal-cream',
    label: 'Royal Cream',
    primary: '#014BAA',
    secondary: '#F8F3F0',
    accent: '#014BAA',
    defaultMode: 'dark'
  },
  {
    id: 'wine-sand',
    label: 'Wine Sand',
    primary: '#7F011F',
    secondary: '#F5EBD0',
    accent: '#7F011F',
    defaultMode: 'dark'
  },
  {
    id: 'orange-milk',
    label: 'Orange Milk',
    primary: '#EC5E27',
    secondary: '#FDFDF1',
    accent: '#EC5E27',
    defaultMode: 'dark'
  },
  {
    id: 'plum-milk',
    label: 'Plum Milk',
    primary: '#381932',
    secondary: '#FFF3E6',
    accent: '#381932',
    defaultMode: 'dark'
  },
  {
    id: 'midnight-vanilla',
    label: 'Midnight Vanilla',
    primary: '#282B4A',
    secondary: '#EEEBDA',
    accent: '#282B4A',
    defaultMode: 'dark'
  },
  {
    id: 'cherry-alabaster',
    label: 'Cherry Alabaster',
    primary: '#890149',
    secondary: '#F3F3E7',
    accent: '#890149',
    defaultMode: 'dark'
  },
  {
    id: 'forest-leaf',
    label: 'Forest Leaf',
    primary: '#064734',
    secondary: '#E0FFC2',
    accent: '#064734',
    defaultMode: 'dark'
  }
];

const STORAGE_KEY = 'naveen_portfolio_theme';
const STORAGE_INDEX_KEY = 'naveen_portfolio_theme_idx';
const STORAGE_INVERTED_KEY = 'naveen_portfolio_theme_inverted';

export class ThemeController {
  constructor() {
    this.currentIndex = 0;
    this.isInverted = false;
    this.isDragging = false;
    this.dockEl = null;
    this.capsuleEl = null;
    this.trackEl = null;
    this.sliderEl = null;
    this.invertBtn = null;
    this.cycleBtn = null;
    this.sunIcon = null;
    this.tooltipEl = null;
    this.tooltipTextEl = null;
    this.tooltipBadgeEl = null;
    this.tooltipSwatchEl = null;
    this.dots = [];
    this.tooltipTimeout = null;
    this.collapseTimeout = null;

    this.init();
  }

  init() {
    // 1. Read stored preferences
    try {
      const storedIdx = localStorage.getItem(STORAGE_INDEX_KEY);
      if (storedIdx !== null) {
        const parsed = parseInt(storedIdx, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < THEMES.length) {
          this.currentIndex = parsed;
        }
      } else {
        const storedTheme = localStorage.getItem(STORAGE_KEY);
        if (storedTheme) {
          const idx = THEMES.findIndex((t) => t.id === storedTheme);
          if (idx !== -1) this.currentIndex = idx;
        }
      }

      const storedInverted = localStorage.getItem(STORAGE_INVERTED_KEY);
      this.isInverted = storedInverted === '1';
    } catch (e) {}

    // 2. Immediately apply theme attributes to root
    this.applyTheme(this.currentIndex, false);

    // 3. Bind DOM elements
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindDOM());
    } else {
      this.bindDOM();
    }
  }

  bindDOM() {
    this.dockEl = document.getElementById('theme-scrubber-dock');
    if (!this.dockEl) return;

    this.capsuleEl = document.getElementById('theme-capsule-bar');
    this.trackEl = document.getElementById('theme-dots-track');
    this.sliderEl = document.getElementById('theme-range-slider');
    this.invertBtn = document.getElementById('theme-invert-btn');
    this.cycleBtn = document.getElementById('theme-cycle-btn');
    this.sunIcon = this.cycleBtn ? this.cycleBtn.querySelector('.theme-sun-icon') : null;
    this.tooltipEl = document.getElementById('theme-bar-tooltip');
    this.tooltipTextEl = document.getElementById('theme-tooltip-text');
    this.tooltipBadgeEl = document.getElementById('theme-tooltip-badge');
    this.tooltipSwatchEl = document.getElementById('theme-tooltip-swatch');
    this.dots = Array.from(document.querySelectorAll('.theme-dots-track .theme-dot'));

    // Sync initial range value (inverted vertical orientation)
    if (this.sliderEl) {
      this.sliderEl.value = String((THEMES.length - 1) - this.currentIndex);
    }
    this.updateUI(this.currentIndex);

    // =========================================================================
    // Hover Expand & Graceful Mouseleave Collapse
    // =========================================================================
    this.dockEl.addEventListener('mouseenter', () => {
      if (this.collapseTimeout) {
        clearTimeout(this.collapseTimeout);
        this.collapseTimeout = null;
      }
      this.dockEl.classList.add('is-expanded');
      this.showTooltip(false);
    });

    this.dockEl.addEventListener('mouseleave', () => {
      if (this.isDragging) return;
      this.scheduleHideTooltip();
      this.collapseTimeout = setTimeout(() => {
        if (!this.isDragging) {
          this.dockEl.classList.remove('is-expanded');
        }
      }, 220);
    });

    // Invert Polarity Toggle Button
    if (this.invertBtn) {
      this.invertBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleInvert();
      });
    }

    // =========================================================================
    // Direct Mouse & Touch Drag Scrubbing between colors
    // =========================================================================
    this.setupPointerDrag();

    // Split-Circle Swatches Click & Hover
    this.dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          this.applyTheme(idx, true);
          this.showTooltip(true);
          this.scheduleHideTooltip();
        }
      });
      dot.addEventListener('mouseenter', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          this.previewTooltip(idx);
        }
      });
      dot.addEventListener('mouseleave', () => {
        if (!this.isDragging) {
          this.updateUI(this.currentIndex);
          this.scheduleHideTooltip();
        }
      });
    });

    // Cycle Button / Sun Icon
    if (this.cycleBtn) {
      this.cycleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.dockEl.classList.contains('is-expanded')) {
          this.dockEl.classList.add('is-expanded');
        }
        const nextIdx = (this.currentIndex + 1) % THEMES.length;
        this.applyTheme(nextIdx, true);
        this.showTooltip(true);
        this.scheduleHideTooltip();
      });
    }

    // Click outside to collapse dock (mobile & desktop)
    document.addEventListener('click', (e) => {
      if (this.dockEl && !this.dockEl.contains(e.target)) {
        this.dockEl.classList.remove('is-expanded');
        if (this.tooltipEl) this.tooltipEl.classList.remove('is-visible');
      }
    });

    // Keyboard Shortcuts: 'T' to cycle themes, 'I' to invert polarity
    window.addEventListener('keydown', (e) => {
      if (
        e.target &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const nextIdx = (this.currentIndex + 1) % THEMES.length;
        this.applyTheme(nextIdx, true);
        this.showTooltip(true);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        this.toggleInvert();
      }
    });
  }

  setupPointerDrag() {
    if (!this.capsuleEl) return;

    const getClosestIndex = (clientY) => {
      if (!this.dots.length) return this.currentIndex;
      let closestIdx = 0;
      let minDistance = Infinity;

      this.dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const dist = Math.abs(clientY - centerY);
        if (dist < minDistance) {
          minDistance = dist;
          const parsed = parseInt(dot.getAttribute('data-index'), 10);
          if (!isNaN(parsed)) closestIdx = parsed;
        }
      });
      return closestIdx;
    };

    const onPointerDown = (e) => {
      // Don't intercept invert button or sun button clicks
      if (
        (this.invertBtn && this.invertBtn.contains(e.target)) ||
        (this.cycleBtn && this.cycleBtn.contains(e.target))
      ) {
        return;
      }

      this.isDragging = true;
      this.dockEl.classList.add('is-expanded', 'is-dragging');
      document.body.classList.add('theme-scrubbing');

      try {
        this.capsuleEl.setPointerCapture(e.pointerId);
      } catch (err) {}

      const targetIdx = getClosestIndex(e.clientY);
      this.applyTheme(targetIdx, false);
      this.previewTooltip(targetIdx);
      this.showTooltip(false);
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const targetIdx = getClosestIndex(e.clientY);
      if (targetIdx !== this.currentIndex) {
        this.applyTheme(targetIdx, false);
      }
      this.previewTooltip(targetIdx);
      this.showTooltip(false);
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      this.dockEl.classList.remove('is-dragging');
      document.body.classList.remove('theme-scrubbing');

      try {
        if (this.capsuleEl.hasPointerCapture(e.pointerId)) {
          this.capsuleEl.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      // Save final selected theme
      this.applyTheme(this.currentIndex, true);
      this.scheduleHideTooltip();
    };

    this.capsuleEl.addEventListener('pointerdown', onPointerDown);
    this.capsuleEl.addEventListener('pointermove', onPointerMove);
    this.capsuleEl.addEventListener('pointerup', onPointerUp);
    this.capsuleEl.addEventListener('pointercancel', onPointerUp);
  }

  toggleInvert() {
    this.isInverted = !this.isInverted;
    this.applyTheme(this.currentIndex, true);
    this.showTooltip(true);
  }

  showTooltip(temporary = false) {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }
    if (this.tooltipEl) {
      this.tooltipEl.classList.add('is-visible');
    }
    if (temporary) {
      this.scheduleHideTooltip();
    }
  }

  scheduleHideTooltip() {
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      if (this.tooltipEl && !this.isDragging) {
        this.tooltipEl.classList.remove('is-visible');
      }
    }, 1900);
  }

  previewTooltip(index) {
    const theme = THEMES[index];
    if (!theme) return;

    if (this.tooltipTextEl) {
      this.tooltipTextEl.textContent = theme.label;
    }
    if (this.tooltipBadgeEl) {
      this.tooltipBadgeEl.textContent = this.isInverted ? 'Inverted' : 'Default';
    }
    if (this.tooltipSwatchEl) {
      this.tooltipSwatchEl.style.background = `linear-gradient(135deg, ${theme.primary} 50%, ${theme.secondary} 50%)`;
    }
    this.showTooltip(false);
  }

  applyTheme(index, save = true) {
    if (index < 0 || index >= THEMES.length) return;
    this.currentIndex = index;
    const theme = THEMES[index];

    // Determine dark vs light mode
    let mode;
    if (theme.id === 'signature-blue') {
      mode = this.isInverted ? 'dark' : 'light';
    } else {
      mode = this.isInverted ? 'light' : 'dark';
    }

    const root = document.documentElement;

    // Apply data-theme attribute
    if (theme.id === 'signature-blue' && !this.isInverted) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme.id);
    }

    // Apply mode & polarity
    root.setAttribute('data-mode', mode);
    if (this.isInverted) {
      root.setAttribute('data-inverted', 'true');
    } else {
      root.removeAttribute('data-inverted');
    }

    // Persist to localStorage
    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, theme.id);
        localStorage.setItem(STORAGE_INDEX_KEY, String(index));
        localStorage.setItem(STORAGE_INVERTED_KEY, this.isInverted ? '1' : '0');
      } catch (e) {}
    }

    this.updateUI(index);
  }

  updateUI(index) {
    const theme = THEMES[index];
    if (!theme) return;

    // Invert slider value for vertical orientation
    if (this.sliderEl) {
      const inverted = (THEMES.length - 1) - index;
      if (this.sliderEl.value !== String(inverted)) {
        this.sliderEl.value = String(inverted);
      }
    }

    // Update tooltip
    if (this.tooltipTextEl) {
      this.tooltipTextEl.textContent = theme.label;
    }
    if (this.tooltipBadgeEl) {
      this.tooltipBadgeEl.textContent = this.isInverted ? 'Inverted' : 'Default';
    }
    if (this.tooltipSwatchEl) {
      this.tooltipSwatchEl.style.background = `linear-gradient(135deg, ${theme.primary} 50%, ${theme.secondary} 50%)`;
    }

    // Update active dot in track
    if (this.dots.length) {
      this.dots.forEach((dot) => {
        const dotIdx = parseInt(dot.getAttribute('data-index'), 10);
        if (dotIdx === index) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    // Update Invert Button active status
    if (this.invertBtn) {
      this.invertBtn.classList.toggle('is-inverted', this.isInverted);
      this.invertBtn.setAttribute(
        'title',
        this.isInverted ? 'Swap Polarity to Default (I)' : 'Swap Polarity to Inverted (I)'
      );
    }

    // Sun icon rotation
    if (this.sunIcon) {
      this.sunIcon.style.transform = `rotate(${index * 40}deg)`;
    }
  }
}

// Global Singleton
let themeControllerInstance = null;
export function initThemeController() {
  if (!themeControllerInstance) {
    themeControllerInstance = new ThemeController();
  }
  return themeControllerInstance;
}

// Auto-run immediately to prevent flash of wrong theme
if (typeof window !== 'undefined') {
  initThemeController();
}
