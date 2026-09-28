/**
 * Naveen AI — Dedicated Conversational Intelligence Agent
 * Grounded exclusively on Naveen Pullagura's portfolio, case studies,
 * systems thinking philosophy, design principles, and career achievements.
 */

// =============================================================================
// Grounded Knowledge Base (Curated from verified case studies & resume)
// =============================================================================
const NAVEEN_KNOWLEDGE = {
  profile: {
    name: "Naveen Pullagura",
    title: "Product Designer · B2B SaaS & AI Systems",
    currentCompany: "NuVeda Learning (Lead Product Designer)",
    location: "Eluru, Andhra Pradesh, India",
    education: "Bachelor of Technology (B.Tech) in Engineering",
    email: "pullaguranaveen101199@gmail.com",
    phone: "+91 90323 53678",
    linkedin: "https://www.linkedin.com/in/naveen-pullagura-ab7217246/",
    behance: "https://www.behance.net/naveenpullagura",
    portfolioUrl: "https://naveenpullagura.vercel.app",
    summary:
      "Naveen is an engineering-rooted Product Designer who transforms complex enterprise chaos into intuitive, high-adoption SaaS products. With an engineering background, he breaks down massive multi-layered architectures into clear, modular components and pairs strong systems thinking with high-fidelity craft."
  },

  principles: [
    {
      number: "01",
      name: "LISTEN",
      quote: "Understand the work before redesigning the workflow.",
      detail:
        "Before sketching a single wireframe or component, Naveen embeds himself in user realities. He maps actual day-to-day friction, shadow workflows, and organizational pain points rather than relying on assumed requirements."
    },
    {
      number: "02",
      name: "CLARIFY",
      quote: "Turn complexity into confident, useful decisions.",
      detail:
        "Enterprise platforms are rife with cognitive overload. Naveen strips away unnecessary cognitive baggage, progressive-discloses advanced settings, and establishes transparent mental models so users never second-guess their actions."
    },
    {
      number: "03",
      name: "CRAFT",
      quote: "Carry intent from the system down to every detail.",
      detail:
        "Craft is not superficial decoration; it is systemic precision. From mathematical design token scales and WCAG 2.1 AA accessibility down to micro-interactions and 95% design-to-code fidelity with engineers, Naveen ensures the finished shipped product feels effortless."
    }
  ],

  caseStudies: {
    nuveda360: {
      title: "NuVeda 360",
      type: "0-to-1 SaaS Unbundling & Survey Generator",
      role: "Lead Product Designer (June 2025 – Present)",
      link: "/nuveda-360.html",
      problem:
        "NuVeda had a powerful multi-rater survey tool trapped inside a monolithic legacy LMS. It took users over 30 minutes of tedious manual entry to create a single 360-degree feedback survey, and enterprise buyers couldn't adopt it without purchasing the entire heavy LMS suite.",
      solution:
        "Naveen unbundled the survey tool into an autonomous, commercial B2B SaaS platform. He engineered an AI-assisted survey generator that crafts contextual competency surveys from natural language prompts, a 3-step white-label setup wizard completed in under 3 minutes, and a transparent credit-economy pay-per-response pricing model.",
      impact: [
        "90% reduction in survey creation time (from 30+ minutes down to 3 minutes).",
        "Streamlined buyer onboarding to under 3 minutes.",
        "Engineered a 100% white-label design token system allowing 100+ enterprise clients to rebrand instantly.",
        "Transitioned product from internal tool into a revenue-generating standalone SaaS."
      ],
      tags: ["SaaS Unbundling", "AI Survey Generator", "Tokens Studio", "Design Systems", "Credit Economy"]
    },

    calf: {
      title: "CALF 2.0",
      type: "Enterprise Learning Management System Overhaul",
      role: "Product Designer (NuVeda Learning)",
      link: "/calf.html",
      problem:
        "A legacy multi-tenant LMS suffered from multi-decade usability debt: 60+ critical navigation bottlenecks, confusing multi-tier permissions, and disjointed experiences across 4 disparate user archetypes (Admin, Manager, Facilitator, Learner).",
      solution:
        "Naveen spearheaded the end-to-end UX architecture overhaul. He unified navigation hierarchies, built role-tailored workspaces, designed real-time behavioral analytics dashboards, and introduced gamified learning loops (streaks, badges, tangible milestones) to drive voluntary learner retention.",
      impact: [
        "Eliminated 60+ legacy navigation bottlenecks and cognitive dead-ends.",
        "Delivered role-specific interfaces for 4 distinct enterprise personas.",
        "Increased learner completion rates through micro-interactions and gamification mechanics.",
        "Built a modular Figma library that boosted engineering sprint velocity by 20%."
      ],
      tags: ["Enterprise LMS", "Role-Based Access", "Gamification", "Multi-Tenant", "Analytics"]
    },

    nucoach: {
      title: "NU Coach",
      type: "AI Conversational Coaching & Roleplay Platform",
      role: "Product Designer (NuVeda Learning)",
      link: "/nu-coach.html",
      problem:
        "Traditional leadership and corporate sales training relied on passive video modules with near-zero behavioral change. An early AI prototype existed, but users felt alienated by sterile text prompts, unpredictable response latency, and lack of realistic tension.",
      solution:
        "Naveen redesigned NU Coach into a real-time conversational workplace coaching simulator. He designed voice-first roleplay scenarios (e.g., tough performance reviews, negotiation crises), modeled the 5 essential AI UI states (latency skeletons, streaming tokens, low confidence, graceful fallbacks, human-in-the-loop review), and added daily behavioral challenge streaks.",
      impact: [
        "Shifted training from passive video consumption to interactive real-time simulation.",
        "Solved user hesitation around non-deterministic AI outputs with transparent confidence scores.",
        "Engineered tactile voice-coaching feedback loops that measure tone, empathy, and clarity.",
        "Empowered enterprise leaders to practice high-stakes conversations safely."
      ],
      tags: ["AI UX", "Conversational AI", "Voice Simulation", "Non-Deterministic States", "Human-in-the-Loop"]
    },

    phantasm: {
      title: "Phantasm Solutions",
      type: "Warehouse Management System (WMS) & E-Commerce",
      role: "UI/UX Designer (July 2024 – January 2025)",
      link: "/phantasm.html",
      problem:
        "Industrial warehouse operators struggled with slow, error-prone barcode inventory counts, delayed batch order dispatching, and high checkout abandonment in companion e-commerce channels.",
      solution:
        "Naveen architected a high-density, low-latency WMS interface optimized for rapid scanning and bulk dispatching. Additionally, he rebuilt the e-commerce purchase funnel with streamlined category filtering and a friction-free 3-step checkout.",
      impact: [
        "Achieved 90%+ visual and functional fidelity in close front-end developer handoff.",
        "Reduced warehouse dispatch errors through high-contrast status feedback.",
        "Increased e-commerce checkout completion rates."
      ],
      tags: ["WMS Operations", "E-Commerce", "High-Density UX", "Developer Synergy"]
    },

    dbase: {
      title: "DBASE Solutions",
      type: "University ERP & Examination Platform",
      role: "Business Executive → UX Contributor (October 2023 – July 2024)",
      problem:
        "University professors and exam evaluators experienced frustratingly high error rates when entering multi-tier exam marks, leading to thousands of student dispute tickets.",
      solution:
        "Naveen conducted extensive on-campus field discovery, observed faculty grading workflows, and redesigned the evaluation task flow into an error-preventing stepped form with instant validation.",
      impact: [
        "Dramatically reduced grading input errors and examination support tickets.",
        "Proved the power of user discovery by advocating directly from campus observations."
      ],
      tags: ["User Research", "Campus ERP", "Stepped Form UX", "Field Discovery"]
    }
  },

  skills: {
    productDesign: [
      "End-to-End Product Architecture (0 to 1)",
      "B2B SaaS Systems Design",
      "User Journey Mapping & Task Flows",
      "Information Architecture & Usability Audits",
      "Interactive High-Fidelity Prototyping",
      "White-Label Design Token Architectures"
    ],
    aiUx: [
      "Conversational AI Interaction Models",
      "Voice Roleplay Simulations",
      "Non-Deterministic AI State Design (Latency, Streaming, Low-Confidence)",
      "Human-in-the-Loop Fallbacks & Guardrails",
      "AI Prompt-to-UI Generators"
    ],
    tools: [
      "Figma & FigJam",
      "Tokens Studio",
      "Claude Code & Gemini",
      "Antigravity",
      "CodeX & Jitter",
      "Semantic HTML5 & Modern CSS3"
    ],
    engineeringFidelity:
      "Because of his B.Tech Engineering foundation, Naveen speaks the language of software engineers. He writes clean HTML/CSS, understands component props and state boundaries, and consistently delivers 95%+ design-to-code fidelity with zero handoff confusion."
  }
};

// =============================================================================
// Natural Language Response Generators
// =============================================================================

/**
 * Clean markdown formatter for chat bubbles
 */
function renderMarkdown(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Links: [Text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="ai-chat-link" target="_self">$1</a>');
  // Unordered list items: • or -
  html = html.replace(/^[•\-\*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="ai-chat-list">$1</ul>');
  // Paragraph line breaks
  html = html.replace(/\n\n+/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');

  return `<p>${html}</p>`;
}

/**
 * Intelligent Query Matcher & Intent Classification
 */
function generateAIResponse(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  const isTelugu = /[\u0C00-\u0C7F]/.test(rawQuery) || query.includes('telugu') || query.includes('telugulo');

  // =========================================================================
  // 1. FREELANCING / CONTRACT / CONSULTING QUERIES (High Priority)
  // =========================================================================
  const isFreelanceQuery = 
    query.includes('freelance') ||
    query.includes('freelancing') ||
    query.includes('freelancer') ||
    query.includes('contract') ||
    query.includes('consult') ||
    query.includes('consulting') ||
    query.includes('side project') ||
    query.includes('hourly') ||
    query.includes('part-time') ||
    query.includes('part time') ||
    query.includes('project work') ||
    query.includes('hire for project') ||
    query.includes('collaborate') ||
    query.includes('work together') ||
    query.includes('client work') ||
    query.includes('ఫ్రీలాన్స్') ||
    query.includes('ఫ్రీలాన్సింగ్') ||
    query.includes('ఫ్రీలాన్సర్') ||
    query.includes('కాంట్రాక్ట్') ||
    query.includes('కన్సల్టింగ్') ||
    query.includes('ప్రాజెక్ట్ చేస్తాడా') ||
    query.includes('ప్రాజెక్ట్స్ చేస్తాడా') ||
    query.includes('ప్రాజెక్ట్ చేస్తారా') ||
    query.includes('ప్రాజెక్ట్స్ చేస్తారా') ||
    query.includes('పని చేస్తాడా') ||
    query.includes('చేస్తాడా');

  if (isFreelanceQuery) {
    if (isTelugu) {
      return `**అవును, నవీన్ ఖచ్చితంగా ఫ్రీలాన్సింగ్ మరియు కాంట్రాక్ట్ ప్రాజెక్ట్స్ చేస్తారు!**

మీ ప్రాజెక్ట్ గురించి నవీన్‌ను నేరుగా సంప్రదించండి:
• **ఫోన్ / వాట్సాప్**: [+91 90323 53678](tel:+919032353678)
• **ఈమెయిల్**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **కాంటాక్ట్ ఫారమ్**: [ఇక్కడ క్లిక్ చేసి మెసేజ్ పంపండి](/contact.html)
• **లింక్డ్‌ఇన్**: [Naveen Pullagura](https://www.linkedin.com/in/naveen-pullagura-ab7217246/)`;
    }

    return `**Yes, Naveen takes on select freelance projects, contracts, and design consulting!**

Connect with him directly to discuss your project:
• **Phone / WhatsApp**: [+91 90323 53678](tel:+919032353678)
• **Email**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **Direct Message**: [Open Contact Form](/contact.html)
• **LinkedIn**: [Naveen Pullagura](https://www.linkedin.com/in/naveen-pullagura-ab7217246/)`;
  }

  // =========================================================================
  // 2. TELUGU QUERIES (Short & Straight to the Point)
  // =========================================================================
  if (isTelugu) {
    if (query.includes('ఎవరు') || query.includes('who') || query.includes('గురించి') || query.includes('పరిచయం') || query.includes('profile')) {
      return `**నవీన్ పుల్లగూర** — లీడ్ ప్రొడక్ట్ డిజైనర్ (B2B SaaS & AI సిస్టమ్స్), NuVeda Learning.
• ఇంజనీరింగ్ (B.Tech) బ్యాక్‌గ్రౌండ్ & సిస్టమ్స్ థింకింగ్.
• NuVeda 360, CALF 2.0, NU Coach రూపకర్త.
• సంప్రదించడానికి: [కాంటాక్ట్ పేజీ](/contact.html) లేదా [+91 90323 53678](tel:+919032353678).`;
    }

    if (query.includes('ఫిలాసఫీ') || query.includes('ఆలోచన') || query.includes('thinking') || query.includes('principles') || query.includes('సూత్రాలు')) {
      return `నవీన్ డిజైన్ ఫిలాసఫీ — 3 సూత్రాలు:
1. **LISTEN**: సమస్యను పూర్తిగా అర్థం చేసుకున్నాకే రీడిజైన్ చేయడం.
2. **CLARIFY**: గందరగోళాన్ని తొలగించి సరళమైన నిర్ణయాలు ఇవ్వడం.
3. **CRAFT**: టోకెన్ల నుండి కోడ్ వరకు 95%+ పర్ఫెక్ట్ క్వాలిటీ అందించడం.`;
    }

    if (query.includes('నువేదా') || query.includes('nuveda') || query.includes('360')) {
      return `**NuVeda 360** — 0-to-1 SaaS అన్‌బండ్లింగ్:
• సర్వే క్రియేషన్ సమయాన్ని **90% తగ్గించారు** (30 నిమిషాల నుండి 3 నిమిషాలకు).
• AI సర్వే జనరేటర్ & 100% వైట్-లేబుల్ టోకెన్ సిస్టమ్ డిజైన్ చేశారు.
👉 [కేస్ స్టడీ చదవండి](/nuveda-360.html)`;
    }

    if (query.includes('కాంటాక్ట్') || query.includes('ఫోన్') || query.includes('contact') || query.includes('email') || query.includes('మెయిల్') || query.includes('హైర్')) {
      return `నవీన్‌ను నేరుగా సంప్రదించండి:
• **ఫోన్ / వాట్సాప్**: [+91 90323 53678](tel:+919032353678)
• **ఈమెయిల్**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **మెసేజ్ పంపండి**: [కాంటాక్ట్ ఫారమ్](/contact.html)
• **లొకేషన్**: ఏలూరు, ఆంధ్రప్రదేశ్ (రిమోట్ / హైబ్రిడ్).`;
    }

    // Extra / Out of Scope Telugu Query
    return `ఈ ప్రశ్నకు లేదా ఇతర వివరాల కోసం నేరుగా నవీన్‌ను సంప్రదించండి:
• **ఫోన్**: [+91 90323 53678](tel:+919032353678)
• **ఈమెయిల్**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **కాంటాక్ట్ ఫారమ్**: [మెసేజ్ పంపండి](/contact.html)
నవీన్ మీకు వెంటనే స్పందిస్తారు!`;
  }

  // =========================================================================
  // 3. GREETINGS & CASUAL INTROS
  // =========================================================================
  if (/^(hi|hello|hey|namaste|greetings|hola|yo|sup)\b/i.test(query)) {
    return `Hello! I'm Naveen's AI assistant. 
Ask me about his **case studies**, **design philosophy**, **freelancing availability**, or **contact details**.`;
  }

  // =========================================================================
  // 4. WHO IS NAVEEN / BACKGROUND / SUMMARY
  // =========================================================================
  if (
    query.includes('who is naveen') ||
    query.includes('about naveen') ||
    query.includes('tell me about yourself') ||
    query.includes('background') ||
    query.includes('summary') ||
    query.includes('bio')
  ) {
    return `**Naveen Pullagura** is a **Product Designer** specializing in **B2B SaaS & AI Systems**, currently leading design at **NuVeda Learning**.
• **Foundation**: B.Tech Engineering paired with strong systems-thinking and 95%+ dev fidelity.
• **Key Work**: NuVeda 360 (90% faster surveys), CALF 2.0 (enterprise LMS), and NU Coach (voice AI).
• **Open to**: Full-time roles, contracts, and freelance projects.
👉 [View Case Studies](/portfolio-home.html#work) or [Contact Naveen](/contact.html)`;
  }

  // =========================================================================
  // 5. DESIGN PHILOSOPHY & PRINCIPLES (Prompt Card 2)
  // =========================================================================
  if (
    query.includes('philosophy') ||
    query.includes('way of thinking') ||
    query.includes('how do you think') ||
    query.includes('design process') ||
    query.includes('principles') ||
    query.includes('listen clarify craft') ||
    query.includes('approach')
  ) {
    return `Naveen's design philosophy follows **3 core principles**:
1. **01 — LISTEN**: *Understand the work before redesigning the workflow.* Ground designs in real operational pain.
2. **02 — CLARIFY**: *Turn complexity into confident decisions.* Strip cognitive load for clear choices.
3. **03 — CRAFT**: *Carry intent down to every detail.* Maintain token consistency and 95%+ engineering fidelity.`;
  }

  // =========================================================================
  // 6. NUVEDA 360 CASE STUDY (Prompt Card 1)
  // =========================================================================
  if (
    query.includes('nuveda 360') ||
    query.includes('nuveda') ||
    query.includes('360') ||
    query.includes('unbundling') ||
    query.includes('survey generator') ||
    query.includes('90%')
  ) {
    return `**NuVeda 360 — 0-to-1 SaaS Unbundling & AI Survey Generator**:
• **Problem**: Feedback tool was trapped in a heavy LMS; took 30+ minutes of manual matrix entry.
• **Solution**: Unbundled into an autonomous B2B SaaS with an AI prompt-to-survey engine and white-label tokens.
• **Impact**: **90% reduction in survey creation time** (from 30+ mins to under 3 mins).
👉 [Read NuVeda 360 Case Study](/nuveda-360.html)`;
  }

  // =========================================================================
  // 7. CALF 2.0 CASE STUDY
  // =========================================================================
  if (
    query.includes('calf') ||
    query.includes('lms') ||
    query.includes('learning management') ||
    query.includes('roles')
  ) {
    return `**CALF 2.0 — Enterprise LMS Architecture Overhaul**:
• **Problem**: 60+ legacy navigation bottlenecks across 4 personas (Admin, Manager, Facilitator, Learner).
• **Solution**: Role-tailored workspaces, gamified learning loops (streaks, badges), and real-time analytics.
• **Impact**: Eliminated bottlenecks, boosted learner retention, and accelerated dev sprint velocity by 20%.
👉 [Read CALF 2.0 Case Study](/calf.html)`;
  }

  // =========================================================================
  // 8. NU COACH & AI SYSTEMS DESIGN (Prompt Card 3)
  // =========================================================================
  if (
    query.includes('nu coach') ||
    query.includes('nucoach') ||
    query.includes('ai systems') ||
    query.includes('ai design') ||
    query.includes('voice') ||
    query.includes('roleplay') ||
    query.includes('conversational')
  ) {
    return `**NU Coach — AI Voice Coaching & Roleplay Platform**:
• **Problem**: Passive video training failed; early AI prototypes had sterile prompts and erratic latency.
• **Solution**: Voice-first roleplay with the **5 essential AI UI states** (latency, streaming, low confidence, graceful fallbacks, human-in-the-loop).
• **Impact**: Safe, tactile practice for high-stakes enterprise conversations (negotiation, performance).
👉 [Read NU Coach Case Study](/nu-coach.html)`;
  }

  // =========================================================================
  // 9. METRICS & BUSINESS ROI (Prompt Card 4)
  // =========================================================================
  if (
    query.includes('metric') ||
    query.includes('roi') ||
    query.includes('impact') ||
    query.includes('result') ||
    query.includes('number') ||
    query.includes('business') ||
    query.includes('efficiency')
  ) {
    return `Key measurable business outcomes:
• **90% Workflow Speed**: Slashed 360° survey creation from 30+ mins to <3 mins in NuVeda 360.
• **20% Sprint Velocity**: Modular Figma token libraries for faster engineering shipping.
• **95% Code Fidelity**: Direct CSS token architecture eliminating handoff friction.
• **60+ Bottlenecks Removed**: Overhauled enterprise LMS navigation in CALF 2.0.`;
  }

  // =========================================================================
  // 10. PHANTASM SOLUTIONS & WMS
  // =========================================================================
  if (
    query.includes('phantasm') ||
    query.includes('warehouse') ||
    query.includes('wms') ||
    query.includes('e-commerce') ||
    query.includes('ecommerce')
  ) {
    return `**Phantasm Solutions — Warehouse Management & E-Commerce**:
• **WMS**: High-density barcode scanning, real-time inventory tracking, and batch dispatching.
• **E-Commerce**: Streamlined 3-step checkout funnel that reduced cart abandonment.
• **Result**: 90%+ design-to-code fidelity with zero handoff confusion.
👉 [View Phantasm Showcase](/phantasm.html)`;
  }

  // =========================================================================
  // 11. TOOLS & TECH STACK
  // =========================================================================
  if (
    query.includes('tool') ||
    query.includes('software') ||
    query.includes('figma') ||
    query.includes('stack') ||
    query.includes('code') ||
    query.includes('front-end') ||
    query.includes('development')
  ) {
    return `Naveen's core toolkit:
• **Design**: Figma (Tokens Studio, Variables, Auto-Layout), FigJam.
• **AI Tools**: Claude Code, Antigravity, Gemini.
• **Code & Tokens**: HTML5, Modern CSS3, JavaScript, Design Token JSON.
• **Strength**: Engineering background enabling 95%+ dev fidelity.`;
  }

  // =========================================================================
  // 12. CONTACT / HIRE NAVEEN / AVAILABILITY
  // =========================================================================
  if (
    query.includes('contact') ||
    query.includes('hire') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('reach') ||
    query.includes('available') ||
    query.includes('job') ||
    query.includes('resume')
  ) {
    return `Connect directly with Naveen:
• **Phone / WhatsApp**: [+91 90323 53678](tel:+919032353678)
• **Email**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **Direct Message**: [Open Contact Form](/contact.html)
• **LinkedIn**: [Naveen Pullagura](https://www.linkedin.com/in/naveen-pullagura-ab7217246/)
• **Resume**: Download the verified 1-page PDF from the **Resume** tab.`;
  }

  // =========================================================================
  // 13. OUT OF SCOPE / EXTRA QUESTIONS (Courteous Reply + Direct Contact Info)
  // =========================================================================
  return `I specialize in Naveen's product design work and portfolio case studies. For this question, extra inquiries, or project discussions, please reach out to Naveen directly:

• **Phone / WhatsApp**: [+91 90323 53678](tel:+919032353678)
• **Email**: [pullaguranaveen101199@gmail.com](mailto:pullaguranaveen101199@gmail.com)
• **Direct Message**: [Open Contact Form](/contact.html)
• **LinkedIn**: [Naveen Pullagura](https://www.linkedin.com/in/naveen-pullagura-ab7217246/)

He'll be happy to assist you directly!`;
}

// =============================================================================
// AI Chat Interface Controller Class
// =============================================================================

export class PortfolioAIAssistant {
  constructor(options = {}) {
    this.container = document.getElementById('view-ai-chat');
    this.messagesContainer = document.getElementById('ai-chat-messages');
    this.inputField = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-chat-send-btn');
    this.closeBtn = document.getElementById('ai-chat-close-btn');
    this.triggerBtn = document.getElementById('ai-chat-trigger-btn');
    this.clearBtn = document.getElementById('ai-chat-clear-btn');
    this.suggestedChips = document.querySelectorAll('.ai-prompt-chip');

    this.onViewChange = options.onViewChange || null;
    this.isResponding = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Send button event
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleUserSubmit());
    }

    // Input Enter key event
    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSubmit();
        }
      });
    }

    // Clear chat button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.resetConversation());
    }

    // Delegated click for suggestion prompt chips (even dynamically inserted ones)
    if (this.messagesContainer) {
      this.messagesContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.ai-prompt-chip');
        if (chip) {
          const query = chip.getAttribute('data-prompt') || chip.textContent.trim();
          this.submitQuery(query);
        }
      });
    }

    // External chips
    this.suggestedChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-prompt') || chip.textContent.trim();
        this.submitQuery(query);
      });
    });
  }

  focusInput() {
    if (this.inputField) {
      setTimeout(() => {
        this.inputField.focus();
      }, 350);
    }
  }

  handleUserSubmit() {
    if (!this.inputField) return;
    const text = this.inputField.value.trim();
    if (!text || this.isResponding) return;

    this.inputField.value = '';
    this.submitQuery(text);
  }

  submitQuery(queryText) {
    if (!queryText || this.isResponding) return;
    this.isResponding = true;

    // Remove center welcome hero when active conversation begins
    if (this.messagesContainer) {
      const heroView = this.messagesContainer.querySelector('.ai-center-hero-view');
      if (heroView) {
        heroView.remove();
        this.messagesContainer.classList.add('has-messages');
      }
    }

    // 1. Append User Message
    this.appendMessage('user', queryText);

    // 2. Show Typing Indicator
    const typingIndicator = this.showTypingIndicator();

    // 3. Generate response with realistic human-like streaming delay
    const responseText = generateAIResponse(queryText);

    setTimeout(() => {
      // Remove typing indicator
      if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
      }

      // Stream the response token-by-token
      this.streamAIMessage(responseText);
    }, 450);
  }

  appendMessage(sender, text) {
    if (!this.messagesContainer) return null;

    const row = document.createElement('div');
    row.className = `ai-msg-row ai-msg-${sender}`;

    if (sender === 'user') {
      row.innerHTML = `
        <div class="ai-msg-bubble user-bubble">
          <div class="ai-msg-content">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="ai-avatar-circle" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div class="ai-msg-bubble agent-bubble">
          <div class="ai-sender-tag">Naveen AI</div>
          <div class="ai-msg-content">${renderMarkdown(text)}</div>
        </div>
      `;
    }

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return null;

    const row = document.createElement('div');
    row.className = 'ai-msg-row ai-msg-agent ai-typing-indicator-row';
    row.innerHTML = `
      <div class="ai-avatar-circle" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <div class="ai-msg-bubble agent-bubble is-typing">
        <span class="ai-dot"></span>
        <span class="ai-dot"></span>
        <span class="ai-dot"></span>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  streamAIMessage(fullText) {
    if (!this.messagesContainer) {
      this.isResponding = false;
      return;
    }

    const row = document.createElement('div');
    row.className = 'ai-msg-row ai-msg-agent';
    row.innerHTML = `
      <div class="ai-avatar-circle" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <div class="ai-msg-bubble agent-bubble">
        <div class="ai-sender-tag">Naveen AI</div>
        <div class="ai-msg-content" id="streaming-content"></div>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    const contentEl = row.querySelector('#streaming-content');
    contentEl.removeAttribute('id');

    // Break into tokens / words for silky smooth streaming effect
    const words = fullText.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    const streamInterval = setInterval(() => {
      if (currentIdx < words.length) {
        accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        contentEl.innerHTML = renderMarkdown(accumulated);
        currentIdx++;
        this.scrollToBottom();
      } else {
        clearInterval(streamInterval);
        this.isResponding = false;
        this.scrollToBottom();
      }
    }, 18);
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  resetConversation() {
    if (!this.messagesContainer) return;

    this.messagesContainer.classList.remove('has-messages');
    this.messagesContainer.innerHTML = `
      <!-- Center Hero Suggested Prompts Layout (Matches User Design Screenshot) -->
      <div class="ai-center-hero-view" id="ai-center-hero-view">
        <h2 class="ai-hero-headline">I can help you know more about Naveen</h2>
        
        <div class="ai-suggested-prompts-section">
          <span class="ai-suggested-kicker">SUGGESTED PROMPTS</span>
          <div class="ai-prompts-grid-2x2">
            <button type="button" class="ai-grid-card ai-prompt-chip" data-prompt="Tell me about the NuVeda 360 SaaS project">
              <h3 class="ai-grid-card-title">NuVeda 360</h3>
              <p class="ai-grid-card-desc">Ask about the 0-to-1 SaaS architecture.</p>
            </button>
            <button type="button" class="ai-grid-card ai-prompt-chip" data-prompt="What is Naveen's design philosophy and core principles?">
              <h3 class="ai-grid-card-title">Design Philosophy &amp; Principles</h3>
              <p class="ai-grid-card-desc">Explore Naveen's core design principles.</p>
            </button>
            <button type="button" class="ai-grid-card ai-prompt-chip" data-prompt="How does Naveen design AI interaction models in NU Coach?">
              <h3 class="ai-grid-card-title">AI Systems &amp; NU Coach</h3>
              <p class="ai-grid-card-desc">Ask about AI interaction models and NU Coach.</p>
            </button>
            <button type="button" class="ai-grid-card ai-prompt-chip" data-prompt="What are Naveen's key enterprise metrics and business outcomes?">
              <h3 class="ai-grid-card-title">Metrics &amp; Business ROI</h3>
              <p class="ai-grid-card-desc">Ask about impact and business outcomes.</p>
            </button>
          </div>
        </div>
      </div>
    `;
    this.scrollToBottom();
  }
}
