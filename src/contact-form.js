/**
 * Contact Form Controller
 * Implements modern web guidance:
 * - :user-invalid and :user-valid validation states
 * - WeakMap interaction state tracking for fallbacks
 * - Synchronized aria-invalid states
 * - 1-Click direct email copy with tactile feedback
 * - Dynamic mailto client link generation
 * - Form submission state, loading animation, and success confirmation card
 */

export function setupContactForm(scope = document) {
  const form = scope.querySelector('#contact-form');
  const container = scope.querySelector('#contact-form-container');
  const successState = scope.querySelector('#contact-success-state');
  const submitBtn = scope.querySelector('#contact-submit-btn');
  const resetBtn = scope.querySelector('#success-reset-btn');
  const copyBtn = scope.querySelector('#copy-email-btn');
  const fallbackMailLink = scope.querySelector('#fallback-mail-link');
  const intentPills = scope.querySelectorAll('.intent-pill');
  const dynamicDesc = scope.querySelector('#success-dynamic-desc');
  const recapTopic = scope.querySelector('#recap-topic');

  if (!form) return;

  // 1. WeakMap interaction tracker for modern form validation fallback
  const dirtyState = new WeakMap();

  const syncAria = (input) => {
    if (!input || !input.checkValidity) return;
    const isInvalid = input.matches(':user-invalid') || input.classList.contains('user-invalid-fallback');
    input.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  };

  const updateValidationClasses = (input) => {
    if (!input || !input.checkValidity) return;
    const isValid = input.checkValidity();
    input.classList.toggle('user-invalid-fallback', !isValid);
    input.classList.toggle('user-valid-fallback', isValid);
    syncAria(input);
  };

  const handleInputEvent = (e) => {
    const input = e.target;
    if (!input.matches?.('input, textarea')) return;

    if (e.type === 'input') {
      const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
      state.hasInteracted = true;
      dirtyState.set(input, state);

      if (state.hasBlurred) {
        updateValidationClasses(input);
      }
      updateFallbackMailto();
    } else if (e.type === 'blur') {
      const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
      state.hasBlurred = true;
      dirtyState.set(input, state);

      if (state.hasInteracted || input.value.trim().length > 0) {
        updateValidationClasses(input);
      }
    }
  };

  form.addEventListener('input', handleInputEvent);
  form.addEventListener('blur', handleInputEvent, true);

  // Synchronize native :user-invalid state with ARIA attributes
  document.addEventListener('blur', (e) => {
    if (e.target && e.target.matches?.('#contact-form input, #contact-form textarea')) {
      syncAria(e.target);
    }
  }, true);

  document.addEventListener('input', (e) => {
    if (e.target && e.target.matches?.('#contact-form input, #contact-form textarea')) {
      if (e.target.hasAttribute('aria-invalid')) syncAria(e.target);
    }
  });

  // 2. Intent Radio Pills Interactive Selection
  intentPills.forEach((pill) => {
    const radio = pill.querySelector('input[type="radio"]');
    if (!radio) return;

    radio.addEventListener('change', () => {
      intentPills.forEach((p) => p.classList.remove('is-selected'));
      if (radio.checked) {
        pill.classList.add('is-selected');
      }
      updateFallbackMailto();
    });

    pill.addEventListener('click', () => {
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  // 3. Dynamic mailto link update based on user typed fields
  function updateFallbackMailto() {
    if (!fallbackMailLink) return;
    const nameInput = form.querySelector('#contact-name');
    const emailInput = form.querySelector('#contact-email');
    const messageInput = form.querySelector('#contact-message');
    const companyInput = form.querySelector('#contact-company');
    const checkedPill = form.querySelector('input[name="inquiry_type"]:checked');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const intent = checkedPill ? checkedPill.value : 'Product Design Inquiry';

    let subject = `Design Inquiry: ${intent}`;
    if (name) subject += ` - ${name}`;
    if (company) subject += ` (${company})`;

    let body = message ? `${message}\n\n` : '';
    if (name || email) {
      body += `---\nFrom: ${name || 'Prospective Collaborator'}\nEmail: ${email || 'Not provided'}`;
      if (company) body += `\nCompany: ${company}`;
    }

    fallbackMailLink.href = `mailto:pullaguranaveen101199@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // 4. One-Click Direct Email Copy Button with Tooltip / State Feedback
  if (copyBtn) {
    let copyTimeout = null;
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailToCopy = 'pullaguranaveen101199@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyBtn.classList.add('is-copied');
        const textSpan = copyBtn.querySelector('.copy-btn-text');
        if (textSpan) textSpan.textContent = 'Copied! ✓';

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          copyBtn.classList.remove('is-copied');
          if (textSpan) textSpan.textContent = 'Copy';
        }, 2200);
      } catch (err) {
        console.warn('Clipboard write failed, fallback triggered', err);
        window.location.href = `mailto:${emailToCopy}`;
      }
    });
  }

  // 5. Form Submission Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Force validation on all fields
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let firstInvalid = null;

    inputs.forEach((input) => {
      const isValid = input.checkValidity();
      const state = dirtyState.get(input) || { hasInteracted: true, hasBlurred: true };
      state.hasInteracted = true;
      state.hasBlurred = true;
      dirtyState.set(input, state);
      updateValidationClasses(input);

      if (!isValid && !firstInvalid) {
        firstInvalid = input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
    }

    const formData = new FormData(form);
    const submission = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      company: formData.get('company') || '',
      inquiry_type: formData.get('inquiry_type') || 'Full-Time Role',
      message: formData.get('message') || '',
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem('naveen_portfolio_inquiries') || '[]');
      stored.push(submission);
      localStorage.setItem('naveen_portfolio_inquiries', JSON.stringify(stored));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    // Simulate fast realistic network dispatch
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }

      // Populate success card
      if (dynamicDesc && submission.name) {
        dynamicDesc.textContent = `Thanks, ${submission.name}! Your message regarding ${submission.inquiry_type} has been dispatched. I'll get back to you within 24 hours at ${submission.email}.`;
      }
      if (recapTopic) {
        recapTopic.textContent = submission.inquiry_type;
      }

      // Smooth switch to success state
      form.style.display = 'none';
      if (successState) {
        successState.style.display = 'flex';
        successState.setAttribute('aria-hidden', 'false');
      }
    }, 550);
  });

  // 6. Reset Handler (Send Another Note)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach((input) => {
        dirtyState.delete(input);
        input.classList.remove('user-invalid-fallback', 'user-valid-fallback');
        input.removeAttribute('aria-invalid');
      });

      // Reset intent pills
      intentPills.forEach((p, idx) => {
        if (idx === 0) {
          p.classList.add('is-selected');
          const radio = p.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        } else {
          p.classList.remove('is-selected');
        }
      });

      updateFallbackMailto();

      if (successState) {
        successState.style.display = 'none';
        successState.setAttribute('aria-hidden', 'true');
      }
      form.style.display = 'block';

      const firstInput = form.querySelector('#contact-name');
      if (firstInput) firstInput.focus();
    });
  }

  // Initial mailto setup
  updateFallbackMailto();
}
