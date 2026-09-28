/**
 * Curated Luxury Theme Controller (Interactive Expand on Hover / Collapse on Mouseout)
 * Converted to Portfolio Native Design System Tokens & Aesthetics
 */

export const THEMES = [
  { id: 'signature-blue', label: 'Signature Blue', accent: '#022EB4' },
  { id: 'signature-blue', label: 'Royal Blue Light', accent: '#2563EB' },
  { id: 'obsidian-dark', label: 'Obsidian Midnight', accent: '#38BDF8' },
  { id: 'obsidian-dark', label: 'Obsidian Dark', accent: '#0EA5E9' },
  { id: 'electric-indigo', label: 'Electric Indigo', accent: '#A78BFA' },
  { id: 'electric-indigo', label: 'Twilight Violet', accent: '#818CF8' },
  { id: 'pastel-lilac', label: 'Pastel Lilac', accent: '#7C3AED' },
  { id: 'pastel-lilac', label: 'Wisteria Lavender', accent: '#9333EA' },
  { id: 'pastel-matcha', label: 'Pastel Matcha', accent: '#0D7A5F' },
  { id: 'pastel-matcha', label: 'Soft Sage Pine', accent: '#059669' },
  { id: 'pastel-blush', label: 'Pastel Blush', accent: '#E11D48' },
  { id: 'pastel-blush', label: 'Desert Peach', accent: '#F43F5E' },
  { id: 'warm-paper', label: 'Warm Terracotta', accent: '#C2410C' },
  { id: 'warm-paper', label: 'Editorial Sand', accent: '#EA580C' },
  { id: 'nordic-slate', label: 'Nordic Slate', accent: '#2563EB' },
  { id: 'nordic-slate', label: 'Arctic Glacier Ice', accent: '#0284C7' },
];

const STORAGE_KEY = 'naveen_portfolio_theme';
const STORAGE_INDEX_KEY = 'naveen_portfolio_theme_idx';

export class ThemeController {
  constructor() {
    this.currentIndex = 0;
    this.dockEl = null;
    this.capsuleEl = null;
    this.sliderEl = null;
    this.cycleBtn = null;
    this.sunIcon = null;
    this.tooltipEl = null;
    this.tooltipTextEl = null;
    this.tooltipDotEl = null;
    this.dots = [];
    this.tooltipTimeout = null;
    this.collapseTimeout = null;

    this.init();
  }

  init() {
    // 1. Read stored preference
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

    // 2. Immediately apply theme attribute to root
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
    this.sliderEl = document.getElementById('theme-range-slider');
    this.cycleBtn = document.getElementById('theme-cycle-btn');
    this.sunIcon = this.cycleBtn ? this.cycleBtn.querySelector('.theme-sun-icon') : null;
    this.tooltipEl = document.getElementById('theme-bar-tooltip');
    this.tooltipTextEl = document.getElementById('theme-tooltip-text');
    this.tooltipDotEl = document.getElementById('theme-tooltip-dot');
    this.dots = Array.from(document.querySelectorAll('.theme-dots-track .theme-dot'));

    // Sync initial state
    if (this.sliderEl) {
      this.sliderEl.value = String((THEMES.length - 1) - this.currentIndex);
    }
    this.updateUI(this.currentIndex);

    // =========================================================================
    // Hover to Expand, Mouseout to Collapse (with graceful debounce)
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
      this.scheduleHideTooltip();
      this.collapseTimeout = setTimeout(() => {
        this.dockEl.classList.remove('is-expanded');
      }, 180);
    });

    // Real-time vertical scrubbing on slider
    if (this.sliderEl) {
      this.sliderEl.addEventListener('input', (e) => {
        const raw = parseInt(e.target.value, 10);
        const idx = (THEMES.length - 1) - raw;
        this.applyTheme(idx, true);
        this.showTooltip(true);
      });

      this.sliderEl.addEventListener('pointerdown', () => {
        this.dockEl.classList.add('is-expanded');
        this.showTooltip(true);
      });

      this.sliderEl.addEventListener('pointerup', () => {
        this.scheduleHideTooltip();
      });
    }

    // Click on individual dots
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
        this.updateUI(this.currentIndex);
        this.scheduleHideTooltip();
      });
    });

    // Sun icon button: cycles themes, and allows tap toggle on mobile
    if (this.cycleBtn) {
      this.cycleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.dockEl.classList.contains('is-expanded')) {
          this.dockEl.classList.add('is-expanded');
        }
        const nextIdx = (this.currentIndex + 2) % THEMES.length;
        this.applyTheme(nextIdx, true);
        this.showTooltip(true);
        this.scheduleHideTooltip();
      });
    }

    // Close on click outside (mobile/touch)
    document.addEventListener('click', (e) => {
      if (this.dockEl && !this.dockEl.contains(e.target)) {
        this.dockEl.classList.remove('is-expanded');
        if (this.tooltipEl) this.tooltipEl.classList.remove('is-visible');
      }
    });

    // Keyboard shortcut: 'T' to cycle
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 't' || e.key === 'T') {
        const nextIdx = (this.currentIndex + 2) % THEMES.length;
        this.applyTheme(nextIdx, true);
        this.showTooltip(true);
        this.scheduleHideTooltip();
      }
    });
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
      if (this.tooltipEl) {
        this.tooltipEl.classList.remove('is-visible');
      }
    }, 1800);
  }

  previewTooltip(index) {
    const theme = THEMES[index];
    if (theme && this.tooltipTextEl) {
      this.tooltipTextEl.textContent = theme.label;
    }
    if (theme && this.tooltipDotEl) {
      this.tooltipDotEl.style.backgroundColor = theme.accent;
    }
    this.showTooltip(false);
  }

  applyTheme(index, save = true) {
    if (index < 0 || index >= THEMES.length) return;
    this.currentIndex = index;
    const theme = THEMES[index];

    // Apply data-theme attribute on <html>
    if (theme.id === 'signature-blue') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme.id);
    }

    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, theme.id);
        localStorage.setItem(STORAGE_INDEX_KEY, String(index));
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
    if (this.tooltipDotEl) {
      this.tooltipDotEl.style.backgroundColor = theme.accent;
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

    // Sun icon rotation and color match
    if (this.sunIcon) {
      this.sunIcon.style.transform = `rotate(${index * 22.5}deg)`;
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
