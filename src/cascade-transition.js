/**
 * Great UI Cascade Page Transition (Up Animation, Single Colour Blue with Greeting)
 * Adapted faithfully from https://www.great-ui.com/r/cascade-page-transition.json
 * 
 * Features:
 * - 14 vertical columns spanning viewport with zero drop-shadow
 * - In-to-out V-pattern cascading stagger
 * - Sweeps UP from bottom (100% -> 0% -> -100%)
 * - Pure single brand blue (#022EB4)
 * - Greeting text: "Hi, how are you!"
 * - Exact cubic-bezier(0.76, 0, 0.24, 1)
 */

export const CASCADE_COLOR_BLUE = '#022EB4';
export const CASCADE_COLORS_SINGLE_BLUE = Array(14).fill(CASCADE_COLOR_BLUE);

export class CascadeTransitionController {
  constructor(options = {}) {
    this.columnsCount = options.columns || 14;
    this.colors = options.colors || CASCADE_COLORS_SINGLE_BLUE;
    this.duration = options.duration !== undefined ? options.duration : 0.52; // seconds
    this.staggerDelay = options.staggerDelay !== undefined ? options.staggerDelay : 0.028; // seconds
    this.container = document.getElementById('cascade-page-transition');
    this.columns = [];
    this.isTransitioning = false;

    this.initDOM();
  }

  initDOM() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'cascade-page-transition';
      this.container.className = 'cascade-page-transition state-covered is-active';
      this.container.setAttribute('aria-hidden', 'false');
      document.body.appendChild(this.container);
    }

    // Check if columns already exist from SSR / HTML markup
    const existingCols = this.container.querySelectorAll('.cascade-col');
    if (existingCols.length === this.columnsCount) {
      this.columns = Array.from(existingCols);
      // Ensure properties are properly set
      const centerIndex = (this.columnsCount - 1) / 2;
      const minDistance = this.columnsCount % 2 === 0 ? 0.5 : 0;
      this.columns.forEach((col, i) => {
        const distanceFromCenter = Math.abs(i - centerIndex);
        const delayMultiplier = distanceFromCenter - minDistance;
        const delay = Math.max(0, delayMultiplier * this.staggerDelay);
        col.style.setProperty('--cascade-delay', `${delay.toFixed(4)}s`);
        col.style.setProperty('--cascade-duration', `${this.duration}s`);
      });
      return;
    }

    // Otherwise generate them cleanly
    this.container.innerHTML = '';
    const centerIndex = (this.columnsCount - 1) / 2;
    const minDistance = this.columnsCount % 2 === 0 ? 0.5 : 0;
    this.columns = [];

    for (let i = 0; i < this.columnsCount; i++) {
      const col = document.createElement('div');
      col.className = 'cascade-col';
      col.setAttribute('data-col-index', i);

      // In-to-out V-pattern delay calculation from Great UI
      const distanceFromCenter = Math.abs(i - centerIndex);
      const delayMultiplier = distanceFromCenter - minDistance;
      const delay = Math.max(0, delayMultiplier * this.staggerDelay);

      col.style.setProperty('--cascade-delay', `${delay.toFixed(4)}s`);
      col.style.setProperty('--cascade-duration', `${this.duration}s`);
      col.style.width = `calc(${100 / this.columnsCount}% + 0.5px)`;

      this.container.appendChild(col);
      this.columns.push(col);
    }

    // Greeting text element if not already present
    if (!this.container.querySelector('.cascade-greeting-container')) {
      const greetingContainer = document.createElement('div');
      greetingContainer.className = 'cascade-greeting-container';
      greetingContainer.id = 'cascade-greeting';
      greetingContainer.innerHTML = `
        <h2 class="cascade-greeting-text" aria-label="Hi, how are you!">
          <span class="greeting-word" style="--word-index: 0;">Hi,</span>
          <span class="greeting-word" style="--word-index: 1;">how</span>
          <span class="greeting-word" style="--word-index: 2;">are</span>
          <span class="greeting-word" style="--word-index: 3;">you!</span>
        </h2>
      `;
      this.container.appendChild(greetingContainer);
    }
  }

  /**
   * Initial page load reveal:
   * Screen is ALREADY covered in pure blue with "Hi, how are you!".
   * Holds for holdMs, then cascades UPWARDS to reveal the hero section.
   */
  triggerInitialReveal({ holdMs = 1100, onComplete } = {}) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const maxMultiplier = Math.floor((this.columnsCount - 1) / 2);
    const maxStaggerMs = maxMultiplier * this.staggerDelay * 1000;
    const durationMs = this.duration * 1000;
    const exitTotalMs = durationMs + maxStaggerMs;

    this.container.classList.remove('state-idle', 'state-exiting');
    this.container.classList.add('state-covered', 'is-active');
    this.container.setAttribute('aria-hidden', 'false');

    // Hold greeting on the blue screen, then sweep UP to reveal hero
    setTimeout(() => {
      this.container.classList.remove('state-covered');
      this.container.classList.add('state-exiting');

      setTimeout(() => {
        this.container.classList.remove('is-active', 'state-exiting');
        this.container.classList.add('state-idle');
        this.container.setAttribute('aria-hidden', 'true');
        this.isTransitioning = false;

        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, exitTotalMs + 40);
    }, holdMs);
  }

  /**
   * Full Page Transition (e.g. view changes):
   * 1. Columns sweep UP from bottom to cover
   * 2. onCovered()
   * 3. Columns sweep UP off the top to reveal
   * 4. onComplete()
   */
  trigger({ onCovered, onComplete } = {}) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const maxMultiplier = Math.floor((this.columnsCount - 1) / 2);
    const maxStaggerMs = maxMultiplier * this.staggerDelay * 1000;
    const durationMs = this.duration * 1000;
    const enterTotalMs = durationMs + maxStaggerMs;

    this.container.classList.remove('state-idle', 'state-covered', 'state-exiting');
    this.container.classList.add('is-active');
    this.container.setAttribute('aria-hidden', 'false');

    void this.container.offsetWidth;

    requestAnimationFrame(() => {
      this.container.classList.add('state-covered');
    });

    setTimeout(() => {
      if (typeof onCovered === 'function') {
        onCovered();
      }

      setTimeout(() => {
        this.container.classList.remove('state-covered');
        this.container.classList.add('state-exiting');

        setTimeout(() => {
          this.container.classList.remove('is-active', 'state-exiting');
          this.container.classList.add('state-idle');
          this.container.setAttribute('aria-hidden', 'true');
          this.isTransitioning = false;

          if (typeof onComplete === 'function') {
            onComplete();
          }
        }, enterTotalMs + 40);
      }, 100);
    }, enterTotalMs);
  }

  hide() {
    if (this.container) {
      this.container.classList.remove('is-active', 'state-covered', 'state-exiting');
      this.container.classList.add('state-idle');
      this.container.setAttribute('aria-hidden', 'true');
      this.isTransitioning = false;
    }
  }
}

// Singleton helper instance
let cascadeInstance = null;
export function getCascadeTransition(options) {
  if (!cascadeInstance) {
    cascadeInstance = new CascadeTransitionController(options);
  }
  return cascadeInstance;
}
