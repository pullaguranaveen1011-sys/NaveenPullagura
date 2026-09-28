import { getCascadeTransition } from './cascade-transition.js';
import { getCurtainTransition } from './curtain-transition.js';
import { setupContactForm } from './contact-form.js';
import { initThemeController } from './theme-controller.js';
import { PortfolioAIAssistant } from './ai-agent.js';

/**
 * Interactive behaviors & micro-interactions for Portfolio
 */
function initPortfolio() {
  initThemeController();
  const curtainTransition = getCurtainTransition({ duration: 0.3, color: '#022EB4' });
  const overlay = document.getElementById('work-intro-overlay');
  const typewriterEl = document.getElementById('typewriter-quote');
  const heroView = document.getElementById('view-hero');
  const workView = document.getElementById('view-work');
  const nuvedaProjectsView = document.getElementById('view-nuveda-projects');
  const phantasmProjectsView = document.getElementById('view-phantasm-projects');
  const resumeView = document.getElementById('view-resume');
  const resumeOverlay = document.getElementById('resume-intro-overlay');
  const navResume = document.getElementById('nav-resume');
  const aboutView = document.getElementById('view-about');
  const aboutOverlay = document.getElementById('about-intro-overlay');
  const navAbout = document.getElementById('nav-about');
  const contactView = document.getElementById('view-contact');
  const contactOverlay = document.getElementById('contact-intro-overlay');
  const navContact = document.getElementById('nav-contact');
  const aiChatView = document.getElementById('view-ai-chat');
  const aiTriggerBtn = document.getElementById('ai-chat-trigger-btn');
  const aiChatCloseBtn = document.getElementById('ai-chat-close-btn');
  let aiAssistant = null;
  let lastMainView = 'hero';
  const nu360CaseStudyView = document.getElementById('view-nu360-case-study');
  const csBackBtn = document.getElementById('cs-back-btn');
  const csBackBtnBottom = document.getElementById('cs-back-btn-bottom');
  const csScrollContainer = document.getElementById('cs-scroll-container');
  const navWork = document.getElementById('nav-work');
  const siteLogo = document.getElementById('site-logo');
  const ctaBtn = document.getElementById('hero-cta-btn');
  const projectsBackBtn = document.getElementById('projects-back-btn');
  const phantasmProjectsBackBtn = document.getElementById('phantasm-projects-back-btn');
  const phantasmShowcaseWrapper = document.getElementById('phantasm-showcase-wrapper');
  const showcaseWrapper = document.querySelector('.showcase-image-wrapper');
  const quoteText = '“Design is not just what it looks like and feels like. Design is how it works.”';

  let isIntroPlaying = false;
  let hasIntroPlayedOnce = false;
  let isAboutIntroPlaying = false;
  let hasAboutIntroPlayedOnce = false;
  let isContactIntroPlaying = false;
  let hasContactIntroPlayedOnce = false;
  let isResumeIntroPlaying = false;
  let hasResumeIntroPlayedOnce = false;
  let currentView = 'hero';
  let isTransitioning = false;
  let currentCompany = 'nuveda';
  let isCompanySwitching = false;

  const companies = ['nuveda', 'phantasm', 'dbase'];
  const cardElements = {
    nuveda: document.getElementById('case-study-nuveda'),
    phantasm: document.getElementById('case-study-phantasm'),
    dbase: document.getElementById('case-study-dbase')
  };
  const workCardsCarousel = document.getElementById('work-cards-carousel');
  const indicatorItems = document.querySelectorAll('.page-indicator-vertical .indicator-item');

  // ==========================================================================
  // Indicator State Synchronizer
  // ==========================================================================
  const updateIndicators = (companyName) => {
    const targetIdx = companies.indexOf(companyName);
    indicatorItems.forEach((btn) => {
      const btnCompany = btn.getAttribute('data-company');
      const btnIdx = companies.indexOf(btnCompany);
      const star = btn.querySelector('.star-shape');

      if (btnIdx < targetIdx) {
        // Previous company - completed state (soft blue)
        btn.classList.remove('active');
        btn.classList.add('completed');
        if (star) star.setAttribute('fill', '#A8A8FF');
      } else if (btnIdx === targetIdx) {
        // Current active company (vibrant blue)
        btn.classList.add('active');
        btn.classList.remove('completed');
        if (star) star.setAttribute('fill', '#0000FF');
      } else {
        // Upcoming company (unvisited grey)
        btn.classList.remove('active', 'completed');
        if (star) star.setAttribute('fill', '#DFDFDF');
      }
    });
  };

  // ==========================================================================
  // Company Experience Switcher (Desktop: Slide / Mobile: Horizontal Scroll)
  // ==========================================================================
  const switchCompany = (companyName, force = false) => {
    if (isCompanySwitching && !force) return;
    isCompanySwitching = true;
    currentCompany = companyName;
    const targetIdx = companies.indexOf(companyName);

    if (window.innerWidth > 1024) {
      // Desktop vertical animated transitions
      companies.forEach((comp, idx) => {
        const card = cardElements[comp];
        if (!card) return;

        if (idx < targetIdx) {
          card.classList.remove('is-active', 'is-leaving-down');
          card.classList.add('is-leaving-up');
        } else if (idx === targetIdx) {
          card.classList.remove('is-leaving-up', 'is-leaving-down');
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active', 'is-leaving-up');
          card.classList.add('is-leaving-down');
        }
      });

      if (force && targetIdx === 0) {
        if (cardElements.nuveda) cardElements.nuveda.classList.remove('is-leaving-up', 'is-leaving-down');
        if (cardElements.phantasm) cardElements.phantasm.classList.remove('is-leaving-up', 'is-leaving-down', 'is-active');
        if (cardElements.dbase) cardElements.dbase.classList.remove('is-leaving-up', 'is-leaving-down', 'is-active');
      }
    } else {
      // Mobile: Horizontal carousel scroll to targeted card
      if (workCardsCarousel) {
        const targetCard = cardElements[companyName];
        if (targetCard) {
          workCardsCarousel.scrollTo({
            left: targetCard.offsetLeft,
            behavior: force ? 'instant' : 'smooth'
          });
        }
      }
    }

    updateIndicators(companyName);

    setTimeout(() => {
      isCompanySwitching = false;
    }, 550);
  };

  // Listen to native horizontal swipe/scroll on mobile carousel
  if (workCardsCarousel) {
    let carouselScrollTimer = null;
    workCardsCarousel.addEventListener('scroll', () => {
      if (window.innerWidth > 1024) return;
      clearTimeout(carouselScrollTimer);
      carouselScrollTimer = setTimeout(() => {
        const scrollLeft = workCardsCarousel.scrollLeft;
        const cardWidth = workCardsCarousel.clientWidth || 1;
        const activeIdx = Math.min(companies.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
        const activeCompany = companies[activeIdx];

        if (activeCompany && currentCompany !== activeCompany) {
          currentCompany = activeCompany;
          updateIndicators(activeCompany);
        }
      }, 60);
    }, { passive: true });
  }

  // ==========================================================================
  // View State Switcher (Zero Scroll Jump, Silky Smooth Stage Transition)
  // ==========================================================================
  let workIntroTimers = [];
  let aboutIntroTimers = [];
  let contactIntroTimers = [];
  let resumeIntroTimers = [];

  const clearWorkIntroTimers = () => {
    workIntroTimers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    workIntroTimers = [];
  };

  const clearAboutIntroTimers = () => {
    aboutIntroTimers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    aboutIntroTimers = [];
  };

  const clearContactIntroTimers = () => {
    contactIntroTimers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    contactIntroTimers = [];
  };

  const clearResumeIntroTimers = () => {
    resumeIntroTimers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    resumeIntroTimers = [];
  };

  const dismissAllOverlays = () => {
    clearWorkIntroTimers();
    clearAboutIntroTimers();
    clearContactIntroTimers();
    clearResumeIntroTimers();
    isIntroPlaying = false;
    isAboutIntroPlaying = false;
    isContactIntroPlaying = false;
    isResumeIntroPlaying = false;
    isTransitioning = false;
    isCompanySwitching = false;
    if (overlay) {
      overlay.classList.remove('is-active', 'step-card', 'step-quote', 'is-exiting');
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (aboutOverlay) {
      aboutOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
      aboutOverlay.setAttribute('aria-hidden', 'true');
    }
    if (contactOverlay) {
      contactOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
      contactOverlay.setAttribute('aria-hidden', 'true');
    }
    if (resumeOverlay) {
      resumeOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
      resumeOverlay.setAttribute('aria-hidden', 'true');
    }
    if (typewriterEl) {
      typewriterEl.textContent = '';
    }
  };

  const deactivateAllViews = () => {
    const allViews = [
      heroView,
      workView,
      nuvedaProjectsView,
      phantasmProjectsView,
      nu360CaseStudyView,
      aboutView,
      resumeView,
      contactView,
      aiChatView,
    ];
    allViews.forEach((v) => {
      if (v) {
        v.classList.remove('is-active');
        v.setAttribute('aria-hidden', 'true');
      }
    });
    if (aiTriggerBtn) {
      aiTriggerBtn.classList.remove('is-chat-open');
    }
  };

  const switchToAIChat = () => {
    if (currentView !== 'ai-chat') {
      lastMainView = currentView;
    }
    dismissAllOverlays();
    deactivateAllViews();
    const targetChatView = aiChatView || document.getElementById('view-ai-chat');
    const targetTrigger = aiTriggerBtn || document.getElementById('ai-chat-trigger-btn');

    if (targetChatView) {
      targetChatView.classList.add('is-active');
      targetChatView.setAttribute('aria-hidden', 'false');
    }
    if (targetTrigger) {
      targetTrigger.classList.add('is-chat-open');
    }
    setActiveNavPill(null);
    currentView = 'ai-chat';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    if (aiAssistant) {
      aiAssistant.focusInput();
    }
  };

  const switchFromAIChatToLastView = () => {
    const targetTrigger = aiTriggerBtn || document.getElementById('ai-chat-trigger-btn');
    if (targetTrigger) {
      targetTrigger.classList.remove('is-chat-open');
    }
    switch (lastMainView) {
      case 'work':
        switchToWork(false);
        break;
      case 'nuveda-projects':
        switchToNuVedaProjects();
        break;
      case 'phantasm-projects':
        switchToPhantasmProjects();
        break;
      case 'about':
        switchToAbout(false);
        break;
      case 'resume':
        switchToResume(false);
        break;
      case 'contact':
        switchToContact(false);
        break;
      default:
        switchToHero();
        break;
    }
  };

  const setActiveNavPill = (activePill) => {
    [navWork, navAbout, navContact, navResume].forEach((p) => {
      if (p) p.classList.remove('active');
    });
    if (activePill) {
      activePill.classList.add('active');
    }
  };

  const switchToHero = () => {
    dismissAllOverlays();
    deactivateAllViews();
    if (heroView) {
      heroView.classList.add('is-active');
      heroView.setAttribute('aria-hidden', 'false');
    }
    setActiveNavPill(null);
    currentView = 'hero';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToWork = (withIntro = false) => {
    if (withIntro && overlay && !hasIntroPlayedOnce) {
      playWorkIntroSequence();
    } else {
      dismissAllOverlays();
      deactivateAllViews();
      if (workView) {
        workView.classList.add('is-active');
        workView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navWork);
      currentView = 'work';
      switchCompany('nuveda', true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchToNuVedaProjects = () => {
    dismissAllOverlays();
    deactivateAllViews();
    if (nuvedaProjectsView) {
      nuvedaProjectsView.classList.add('is-active');
      nuvedaProjectsView.setAttribute('aria-hidden', 'false');
    }
    setActiveNavPill(navWork);
    currentView = 'nuveda-projects';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToWorkFromProjects = () => {
    dismissAllOverlays();
    deactivateAllViews();
    if (workView) {
      workView.classList.add('is-active');
      workView.setAttribute('aria-hidden', 'false');
    }
    setActiveNavPill(navWork);
    currentView = 'work';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switchCompany('nuveda', true);
  };

  const switchToPhantasmProjects = () => {
    dismissAllOverlays();
    deactivateAllViews();
    if (phantasmProjectsView) {
      phantasmProjectsView.classList.add('is-active');
      phantasmProjectsView.setAttribute('aria-hidden', 'false');
    }
    setActiveNavPill(navWork);
    currentView = 'phantasm-projects';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToWorkFromPhantasmProjects = () => {
    dismissAllOverlays();
    deactivateAllViews();
    if (workView) {
      workView.classList.add('is-active');
      workView.setAttribute('aria-hidden', 'false');
    }
    setActiveNavPill(navWork);
    currentView = 'work';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switchCompany('phantasm', true);
  };

  const switchToAbout = (withIntro = false) => {
    if (withIntro && aboutOverlay && !hasAboutIntroPlayedOnce) {
      playAboutIntroSequence();
    } else {
      dismissAllOverlays();
      deactivateAllViews();
      if (aboutView) {
        aboutView.classList.add('is-active');
        aboutView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navAbout);
      currentView = 'about';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchToContact = (withIntro = false) => {
    if (withIntro && contactOverlay && !hasContactIntroPlayedOnce) {
      playContactIntroSequence();
    } else {
      dismissAllOverlays();
      deactivateAllViews();
      if (contactView) {
        contactView.classList.add('is-active');
        contactView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navContact);
      currentView = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchToResume = (withIntro = false) => {
    if (withIntro && resumeOverlay && !hasResumeIntroPlayedOnce) {
      playResumeIntroSequence();
    } else {
      dismissAllOverlays();
      deactivateAllViews();
      if (resumeView) {
        resumeView.classList.add('is-active');
        resumeView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navResume);
      currentView = 'resume';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchToNu360CaseStudy = () => {
    curtainTransition.navigate('/index.html', '#0D9488');
  };

  const switchBackToNuVedaProjects = () => {
    if (isTransitioning || isIntroPlaying) return;
    isTransitioning = true;

    if (nu360CaseStudyView) {
      nu360CaseStudyView.classList.remove('is-active');
      nu360CaseStudyView.setAttribute('aria-hidden', 'true');
    }
    if (nuvedaProjectsView) {
      nuvedaProjectsView.classList.add('is-active');
      nuvedaProjectsView.setAttribute('aria-hidden', 'false');
    }
    if (navWork) navWork.classList.add('active');
    currentView = 'nuveda-projects';
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      isTransitioning = false;
    }, 550);
  };

  // Comprehensive Hash & State Routing
  const handleRoute = (immediate = false) => {
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash === '#nu360-case-study' || hash === '#nu360') {
      switchToNu360CaseStudy();
    } else if (hash === '#resume') {
      switchToResume();
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else if (hash === '#phantasm-projects' || hash === '#phantasm' || search.includes('view=phantasm')) {
      if (immediate) {
        dismissAllOverlays();
        deactivateAllViews();
        if (phantasmProjectsView) {
          phantasmProjectsView.classList.add('is-active');
          phantasmProjectsView.setAttribute('aria-hidden', 'false');
        }
        if (navWork) navWork.classList.add('active');
        currentView = 'phantasm-projects';
        document.documentElement.classList.remove('preload-phantasm-projects');
      } else {
        switchToPhantasmProjects();
        document.documentElement.classList.remove('preload-phantasm-projects');
      }
    } else if (hash === '#nuveda-projects' || hash === '#projects' || search.includes('view=projects')) {
      if (immediate) {
        dismissAllOverlays();
        deactivateAllViews();
        if (nuvedaProjectsView) {
          nuvedaProjectsView.classList.add('is-active');
          nuvedaProjectsView.setAttribute('aria-hidden', 'false');
        }
        if (navWork) navWork.classList.add('active');
        currentView = 'nuveda-projects';
        document.documentElement.classList.remove('preload-nuveda-projects');
      } else {
        switchToNuVedaProjects();
        document.documentElement.classList.remove('preload-nuveda-projects');
      }
    } else if (hash === '#about' || search.includes('view=about')) {
      switchToAbout(false);
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else if (hash === '#contact' || search.includes('view=contact')) {
      switchToContact();
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else if (hash === '#work' || search.includes('view=work')) {
      switchToWork(false);
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else if (hash === '#ai-chat' || hash === '#ai' || search.includes('view=ai')) {
      switchToAIChat();
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else if (hash === '#hero' || !hash || hash === '#' || hash === '') {
      switchToHero();
      document.documentElement.classList.remove('preload-nuveda-projects');
    } else {
      switchToHero();
      document.documentElement.classList.remove('preload-nuveda-projects');
    }
  };

  // ==========================================================================
  // Great UI Cascade Page Transition (Upward Sweep, Single Colour Blue with Greeting)
  // ==========================================================================
  const cascadeTransition = getCascadeTransition({
    columns: 14,
    duration: 0.52,
    staggerDelay: 0.028,
  });

  const playHeroIntroSequence = () => {
    const hash = window.location.hash;
    const search = window.location.search;
    const isDirectOtherRoute = hash === '#work' || hash === '#nuveda-projects' || hash === '#projects' || hash === '#resume' || hash === '#about' || hash === '#contact' || search.includes('view=');
    const isCurtainTransition = sessionStorage.getItem('curtain_reveal_pending') === '1' || window.__curtainJustRevealed;

    if (isDirectOtherRoute || isCurtainTransition) {
      cascadeTransition.hide();
      return;
    }

    // Screen starts covered in pure blue with "Hi, how are you!", holds, then smoothly cascades UP to reveal hero
    cascadeTransition.triggerInitialReveal({ holdMs: 1000 });
  };

  playHeroIntroSequence();
  handleRoute(true);
  window.addEventListener('hashchange', () => handleRoute(false));
  window.addEventListener('popstate', () => handleRoute(false));


  // ==========================================================================
  // Full-Screen Cinematic Work Intro Orchestration
  // ==========================================================================
  const playWorkIntroSequence = () => {
    if (isIntroPlaying || !overlay) return;
    clearWorkIntroTimers();
    isIntroPlaying = true;
    hasIntroPlayedOnce = true;

    // Reset overlay state
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.remove('is-exiting', 'step-card', 'step-quote');
    if (typewriterEl) typewriterEl.textContent = '';

    // 1. Background expands from center immediately
    overlay.classList.add('is-active');

    // 2. Icon and Work title animate into centered position
    const t1 = setTimeout(() => {
      overlay.classList.add('step-card');
    }, 450);
    workIntroTimers.push(t1);

    // 3. Quote typing animation starts
    const t2 = setTimeout(() => {
      overlay.classList.add('step-quote');
      let charIndex = 0;
      const typeSpeed = 30;

      const typeInterval = setInterval(() => {
        if (!typewriterEl) {
          clearInterval(typeInterval);
          finishIntro();
          return;
        }

        charIndex++;
        typewriterEl.textContent = quoteText.slice(0, charIndex);

        if (charIndex >= quoteText.length) {
          clearInterval(typeInterval);

          // While still in overlay, swap views in the background seamlessly
          deactivateAllViews();
          if (workView) {
            workView.classList.add('is-active');
            workView.setAttribute('aria-hidden', 'false');
          }
          setActiveNavPill(navWork);
          currentView = 'work';
          window.scrollTo({ top: 0, behavior: 'instant' });

          // 4. Hold briefly, then reveal the work view smoothly
          const t3 = setTimeout(() => {
            finishIntro();
          }, 1100);
          workIntroTimers.push(t3);
        }
      }, typeSpeed);
      workIntroTimers.push(typeInterval);
    }, 1100);
    workIntroTimers.push(t2);

    const finishIntro = () => {
      overlay.classList.add('is-exiting');

      const tExit = setTimeout(() => {
        overlay.classList.remove('is-active', 'step-card', 'step-quote', 'is-exiting');
        overlay.setAttribute('aria-hidden', 'true');
        isIntroPlaying = false;
        switchCompany('nuveda', true);
      }, 700);
      workIntroTimers.push(tExit);
    };
  };

  // ==========================================================================
  // Full-Screen Cinematic About Intro Orchestration (Matching Image 1 Reference)
  // ==========================================================================
  const playAboutIntroSequence = (onComplete) => {
    if (isAboutIntroPlaying || !aboutOverlay) {
      if (onComplete) onComplete();
      return;
    }
    clearAboutIntroTimers();
    isAboutIntroPlaying = true;
    hasAboutIntroPlayedOnce = true;

    // Reset overlay state
    aboutOverlay.setAttribute('aria-hidden', 'false');
    aboutOverlay.classList.remove('is-exiting', 'step-card');

    // 1. Background expands from center immediately
    aboutOverlay.classList.add('is-active');

    // 2. Poster card frame smoothly scales into view
    const t1 = setTimeout(() => {
      aboutOverlay.classList.add('step-card');
    }, 450);
    aboutIntroTimers.push(t1);

    // 3. Switch views in the background while intro is visible
    const t2 = setTimeout(() => {
      deactivateAllViews();
      if (aboutView) {
        aboutView.classList.add('is-active');
        aboutView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navAbout);
      currentView = 'about';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1100);
    aboutIntroTimers.push(t2);

    // 4. Hold briefly, then dissolve out smoothly into the About card
    const t3 = setTimeout(() => {
      finishAboutIntro();
    }, 1800);
    aboutIntroTimers.push(t3);

    const finishAboutIntro = () => {
      aboutOverlay.classList.add('is-exiting');

      const tExit = setTimeout(() => {
        aboutOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
        aboutOverlay.setAttribute('aria-hidden', 'true');
        isAboutIntroPlaying = false;
        if (onComplete) onComplete();
      }, 700);
      aboutIntroTimers.push(tExit);
    };
  };

  // ==========================================================================
  // Full-Screen Cinematic Contact Intro Orchestration
  // ==========================================================================
  const playContactIntroSequence = (onComplete) => {
    if (isContactIntroPlaying || !contactOverlay) {
      if (onComplete) onComplete();
      return;
    }
    clearContactIntroTimers();
    isContactIntroPlaying = true;
    hasContactIntroPlayedOnce = true;

    // Reset overlay state
    contactOverlay.setAttribute('aria-hidden', 'false');
    contactOverlay.classList.remove('is-exiting', 'step-card');

    // 1. Background expands from center immediately
    contactOverlay.classList.add('is-active');

    // 2. Chat bubble icon & title frame smoothly scales into view
    const t1 = setTimeout(() => {
      contactOverlay.classList.add('step-card');
    }, 450);
    contactIntroTimers.push(t1);

    // 3. Switch views in the background while intro is visible
    const t2 = setTimeout(() => {
      deactivateAllViews();
      if (contactView) {
        contactView.classList.add('is-active');
        contactView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navContact);
      currentView = 'contact';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1100);
    contactIntroTimers.push(t2);

    // 4. Hold briefly, then dissolve out smoothly into the Contact card
    const t3 = setTimeout(() => {
      finishContactIntro();
    }, 1800);
    contactIntroTimers.push(t3);

    const finishContactIntro = () => {
      contactOverlay.classList.add('is-exiting');

      const tExit = setTimeout(() => {
        contactOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
        contactOverlay.setAttribute('aria-hidden', 'true');
        isContactIntroPlaying = false;
        if (onComplete) onComplete();
      }, 700);
      contactIntroTimers.push(tExit);
    };
  };

  // ==========================================================================
  // Full-Screen Cinematic Resume Intro Orchestration
  // ==========================================================================
  const playResumeIntroSequence = (onComplete) => {
    if (isResumeIntroPlaying || !resumeOverlay) {
      if (onComplete) onComplete();
      return;
    }
    clearResumeIntroTimers();
    isResumeIntroPlaying = true;
    hasResumeIntroPlayedOnce = true;

    // Reset overlay state
    resumeOverlay.setAttribute('aria-hidden', 'false');
    resumeOverlay.classList.remove('is-exiting', 'step-card');

    // 1. Background expands from center immediately
    resumeOverlay.classList.add('is-active');

    // 2. Star scroll icon & title frame smoothly scales into view
    const t1 = setTimeout(() => {
      resumeOverlay.classList.add('step-card');
    }, 450);
    resumeIntroTimers.push(t1);

    // 3. Switch views in the background while intro is visible
    const t2 = setTimeout(() => {
      deactivateAllViews();
      if (resumeView) {
        resumeView.classList.add('is-active');
        resumeView.setAttribute('aria-hidden', 'false');
      }
      setActiveNavPill(navResume);
      currentView = 'resume';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1100);
    resumeIntroTimers.push(t2);

    // 4. Hold briefly, then dissolve out smoothly into the Resume card
    const t3 = setTimeout(() => {
      finishResumeIntro();
    }, 1800);
    resumeIntroTimers.push(t3);

    const finishResumeIntro = () => {
      resumeOverlay.classList.add('is-exiting');

      const tExit = setTimeout(() => {
        resumeOverlay.classList.remove('is-active', 'step-card', 'is-exiting');
        resumeOverlay.setAttribute('aria-hidden', 'true');
        isResumeIntroPlaying = false;
        if (onComplete) onComplete();
      }, 700);
      resumeIntroTimers.push(tExit);
    };
  };

  // ==========================================================================
  // Event Listeners: Navigation, CTA, and Indicators
  // ==========================================================================
  if (navWork) {
    navWork.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentView === 'work') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      history.pushState(null, '', '#work');
      if (currentView === 'nuveda-projects' || currentView === 'phantasm-projects') {
        switchToWorkFromProjects();
      } else {
        switchToWork(!hasIntroPlayedOnce);
      }
    });
  }

  if (siteLogo) {
    siteLogo.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
      switchToHero();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', '#work');
      switchToWork(!hasIntroPlayedOnce);
    });
  }

  if (navAbout) {
    navAbout.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentView === 'about') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      history.pushState(null, '', '#about');
      switchToAbout(!hasAboutIntroPlayedOnce);
    });
  }

  if (navContact) {
    navContact.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentView === 'contact') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      history.pushState(null, '', '#contact');
      switchToContact(!hasContactIntroPlayedOnce);
    });
  }

  if (navResume) {
    navResume.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentView === 'resume') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      history.pushState(null, '', '#resume');
      switchToResume(!hasResumeIntroPlayedOnce);
    });
  }

  // Click on NuVeda Showcase image / thumbnail opens the 3-projects detail view
  const nuvedaShowcase = document.getElementById('nuveda-showcase-wrapper');
  if (nuvedaShowcase) {
    nuvedaShowcase.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', '#nuveda-projects');
      switchToNuVedaProjects();
    });
  }

  // Back button on NuVeda 3-projects view returns to the main case study card
  if (projectsBackBtn) {
    projectsBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', '#work');
      switchToWorkFromProjects();
    });
  }

  // Click on Phantasm Showcase image navigates directly to the Phantasm Case Study
  if (phantasmShowcaseWrapper) {
    phantasmShowcaseWrapper.addEventListener('click', (e) => {
      e.preventDefault();
      curtainTransition.navigate('/phantasm.html', '#78350F');
    });
  }

  // Click on NuVeda 360 project card navigates to /index.html
  const projectCardNu360 = document.getElementById('project-card-nu360');
  if (projectCardNu360) {
    projectCardNu360.addEventListener('click', (e) => {
      e.preventDefault();
      curtainTransition.navigate('/index.html', '#0D9488');
    });
    projectCardNu360.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        curtainTransition.navigate('/index.html', '#0D9488');
      }
    });
  }

  // Click on CALF 2.0 project card navigates to /calf.html
  const projectCardCalf = document.getElementById('project-card-calf');
  if (projectCardCalf) {
    projectCardCalf.addEventListener('click', (e) => {
      e.preventDefault();
      curtainTransition.navigate('/calf.html', '#FF6B00');
    });
    projectCardCalf.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        curtainTransition.navigate('/calf.html', '#FF6B00');
      }
    });
  }

  // Click on NU Coach project card navigates to /nu-coach.html
  const projectCardNuCoach = document.getElementById('project-card-nucoach');
  if (projectCardNuCoach) {
    projectCardNuCoach.addEventListener('click', (e) => {
      e.preventDefault();
      curtainTransition.navigate('/nu-coach.html', '#6366F1');
    });
    projectCardNuCoach.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        curtainTransition.navigate('/nu-coach.html', '#6366F1');
      }
    });
  }

  // NU 360 Case Study Back Buttons
  if (csBackBtn) {
    csBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchBackToNuVedaProjects();
    });
  }

  if (csBackBtnBottom) {
    csBackBtnBottom.addEventListener('click', (e) => {
      e.preventDefault();
      switchBackToNuVedaProjects();
    });
  }

  // Keyboard Escape listener to go back
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (currentView === 'nu360-case-study') {
        switchBackToNuVedaProjects();
      } else if (currentView === 'ai-chat') {
        switchFromAIChatToLastView();
      }
    }
  });

  // Smooth Anchor Scrolling inside Case Study Container
  const csAnchorLinks = document.querySelectorAll('.cs-anchor-link');
  csAnchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl && csScrollContainer) {
          e.preventDefault();
          const targetTop = targetEl.offsetTop - 70;
          csScrollContainer.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Diamond Indicator clicks
  indicatorItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCompany = btn.getAttribute('data-company') || 'nuveda';
      if (companies.includes(targetCompany)) {
        switchCompany(targetCompany);
      }
    });
  });

  // ==========================================================================
  // Instant-Sync Wheel Detection (Bidirectional scrolling between sections & companies)
  // ==========================================================================
  window.addEventListener('wheel', (e) => {
    if (isIntroPlaying || isAboutIntroPlaying || isContactIntroPlaying || isResumeIntroPlaying || isTransitioning || isCompanySwitching || currentView === 'nu360-case-study' || currentView === 'ai-chat') return;

    // Scrolling down from Hero -> Work view (NuVeda)
    if (currentView === 'hero' && e.deltaY > 15) {
      e.preventDefault();
      history.pushState(null, '', '#work');
      switchToWork(!hasIntroPlayedOnce);
      switchCompany('nuveda', true);
    }
    // In Work view:
    else if (currentView === 'work') {
      if (window.innerWidth <= 1024) return;
      const currentIdx = companies.indexOf(currentCompany);

      if (e.deltaY > 20) {
        // Scroll down to next company
        if (currentIdx < companies.length - 1) {
          e.preventDefault();
          switchCompany(companies[currentIdx + 1]);
        } else if (currentIdx === companies.length - 1) {
          // Reached last company (dbase) -> scroll down to About Me section!
          e.preventDefault();
          history.pushState(null, '', '#about');
          switchToAbout(!hasAboutIntroPlayedOnce);
        }
      } else if (e.deltaY < -20) {
        // Scroll up to previous company or hero
        if (currentIdx > 0) {
          e.preventDefault();
          switchCompany(companies[currentIdx - 1]);
        } else if (currentIdx === 0 && window.scrollY <= 10) {
          e.preventDefault();
          history.pushState(null, '', window.location.pathname);
          switchToHero();
        }
      }
    }
    // In About view:
    else if (currentView === 'about') {
      if (e.deltaY > 20) {
        // Scroll down to Resume
        e.preventDefault();
        history.pushState(null, '', '#resume');
        switchToResume(!hasResumeIntroPlayedOnce);
      } else if (e.deltaY < -20) {
        // Scroll up to Work (landing on dbase, the last company)
        e.preventDefault();
        history.pushState(null, '', '#work');
        switchToWork(false);
        switchCompany('dbase', true);
      }
    }
    // In Resume view:
    else if (currentView === 'resume') {
      if (e.deltaY < -20) {
        // Scroll up to About
        e.preventDefault();
        history.pushState(null, '', '#about');
        switchToAbout(false);
      }
    }
  }, { passive: false });

  // Mobile Touch Swipe Detection (Smooth & natural)
  let touchStartY = 0;
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isIntroPlaying || isAboutIntroPlaying || isContactIntroPlaying || isResumeIntroPlaying || isTransitioning || isCompanySwitching || currentView === 'nu360-case-study' || currentView === 'ai-chat') return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY - touchEndY;
    const diffX = Math.abs(touchStartX - touchEndX);

    // Only respond to predominantly vertical swipes (not diagonal or horizontal)
    if (diffX > Math.abs(diffY)) return;

    // Swipe up on Hero (scroll down to Work)
    if (currentView === 'hero' && diffY > 45) {
      history.pushState(null, '', '#work');
      switchToWork(!hasIntroPlayedOnce);
      switchCompany('nuveda', true);
    }
    // In Work view:
    else if (currentView === 'work') {
      const isMobile = window.innerWidth <= 1024;
      const isAtTop = window.scrollY <= 15;
      const currentIdx = companies.indexOf(currentCompany);

      if (!isMobile) {
        // Desktop / Laptop touch screens: vertical card switching
        if (diffY > 50) {
          if (currentIdx < companies.length - 1) {
            switchCompany(companies[currentIdx + 1]);
          } else if (currentIdx === companies.length - 1) {
            history.pushState(null, '', '#about');
            switchToAbout(!hasAboutIntroPlayedOnce);
          }
        } else if (diffY < -50) {
          if (currentIdx > 0) {
            switchCompany(companies[currentIdx - 1]);
          } else if (currentIdx === 0 && isAtTop) {
            history.pushState(null, '', window.location.pathname);
            switchToHero();
          }
        }
      } else {
        // Mobile screens:
        if (diffY > 60 && currentIdx === companies.length - 1) {
          history.pushState(null, '', '#about');
          switchToAbout(!hasAboutIntroPlayedOnce);
        } else if (diffY < -60 && isAtTop && currentIdx === 0) {
          history.pushState(null, '', window.location.pathname);
          switchToHero();
        }
      }
    }
    // In About view:
    else if (currentView === 'about') {
      if (diffY > 50) {
        history.pushState(null, '', '#resume');
        switchToResume(!hasResumeIntroPlayedOnce);
      } else if (diffY < -50) {
        history.pushState(null, '', '#work');
        switchToWork(false);
        switchCompany('dbase', true);
      }
    }
    // In Resume view:
    else if (currentView === 'resume') {
      if (diffY < -50) {
        history.pushState(null, '', '#about');
        switchToAbout(false);
      }
    }
  }, { passive: true });



  // ==========================================================================
  // Glitchless Track Roller (Products -> Software -> Apps -> Products...)
  // ==========================================================================
  const rollerViewport = document.getElementById('roller-viewport');
  const rollerTrack = document.getElementById('roller-track');

  if (rollerViewport && rollerTrack) {
    const items = rollerTrack.querySelectorAll('.roller-item');
    const totalUniqueWords = 3; // Products, Software, Apps
    let currentIndex = 0;

    const getItemWidth = (index) => {
      if (!items[index]) return 0;
      return items[index].getBoundingClientRect().width;
    };

    const getItemHeight = () => {
      return rollerViewport.offsetHeight || 76;
    };

    const setViewportWidth = (index) => {
      const width = getItemWidth(index);
      if (width > 0) {
        rollerViewport.style.width = `${Math.ceil(width)}px`;
      }
    };

    document.fonts.ready.then(() => {
      setViewportWidth(0);
    });
    setViewportWidth(0);

    window.addEventListener('resize', () => {
      const activeIdx = currentIndex % totalUniqueWords;
      setViewportWidth(activeIdx);
      const h = getItemHeight();
      rollerTrack.style.transition = 'none';
      rollerTrack.style.transform = `translateY(-${currentIndex * h}px)`;
      void rollerTrack.offsetHeight;
    });

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rollInterval = 3000;
    const transitionMs = 600;

    if (!isReducedMotion) {
      setInterval(() => {
        currentIndex++;
        const targetIndex = currentIndex;
        const targetWidthIndex = targetIndex % totalUniqueWords;

        setViewportWidth(targetWidthIndex);

        const itemH = getItemHeight();
        rollerTrack.style.transition = `transform ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        rollerTrack.style.transform = `translateY(-${targetIndex * itemH}px)`;

        if (targetIndex === totalUniqueWords) {
          setTimeout(() => {
            rollerTrack.style.transition = 'none';
            rollerTrack.style.transform = 'translateY(0px)';
            void rollerTrack.offsetHeight;
            currentIndex = 0;
            setViewportWidth(0);
          }, transitionMs + 20);
        }
      }, rollInterval);
    }
  }

  // Initialize interactive Contact Form
  if (contactView) {
    setupContactForm(contactView);
    const successWorkBtn = contactView.querySelector('#success-work-btn');
    if (successWorkBtn) {
      successWorkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#work');
        switchToWork(false);
      });
    }
  }

  // Initialize dedicated Naveen AI Assistant
  const chatViewEl = aiChatView || document.getElementById('view-ai-chat');
  const triggerBtnEl = aiTriggerBtn || document.getElementById('ai-chat-trigger-btn');
  const closeBtnEl = aiChatCloseBtn || document.getElementById('ai-chat-close-btn');

  if (chatViewEl) {
    aiAssistant = new PortfolioAIAssistant();

    if (triggerBtnEl) {
      triggerBtnEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentView === 'ai-chat') {
          switchFromAIChatToLastView();
        } else {
          switchToAIChat();
        }
      });
    }

    if (closeBtnEl) {
      closeBtnEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchFromAIChatToLastView();
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
