import { getCurtainTransition } from './curtain-transition.js';
import { setupContactForm } from './contact-form.js';
import { initThemeController } from './theme-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme controller (Billy Sweeney style theme scrubber)
  initThemeController();

  // Initialize vertical curtain page transitions with portfolio royal blue
  const curtain = getCurtainTransition({ duration: 0.3, color: '#022EB4' });

  // Initialize interactive contact form
  setupContactForm(document);

  // Smooth keyboard navigation enhancement
  const inputs = document.querySelectorAll('input, textarea, button');
  inputs.forEach((el) => {
    el.addEventListener('focus', () => {
      el.parentElement?.classList.add('is-focused');
    });
    el.addEventListener('blur', () => {
      el.parentElement?.classList.remove('is-focused');
    });
  });
});
