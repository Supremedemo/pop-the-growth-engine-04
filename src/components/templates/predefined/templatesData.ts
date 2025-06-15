
export type PredefinedTemplateCategory =
  | "Lead Generation"
  | "E-commerce"
  | "Mobile-First"
  | "Holiday/Seasonal"
  | "B2B";

export interface PredefinedTemplate {
  id: string;
  name: string;
  description: string;
  category: PredefinedTemplateCategory;
  icon: string; // lucide-react icon name, will use one from allowed icons list for now
  previewImage: string;
  config: any;
  features: string[];
  tags: string[];
}

// TODO: Update the icon field later as needed! (Currently allowed: arrow-down, arrow-up, circle-check, circle-minus, circle-plus, color-picker, image, pencil, pencil-line, plus, undo)

export const predefinedTemplates: PredefinedTemplate[] = [
  // Spin Wheel – Lead Generation
  {
    id: "fortune-spin-leadgen",
    name: "Fortune Spin Wheel",
    description: "Engaging spin wheel with configurable prizes, branding, and email capture.",
    category: "Lead Generation",
    icon: "circle-plus",
    previewImage: "/placeholder.svg",
    config: {
      segments: ["10% Off", "Free Shipping", "Try Again", "20% Off", "BONUS Prize", "5% Off"],
      probability: [0.2, 0.15, 0.3, 0.1, 0.1, 0.15],
      requireEmail: true,
      cta: "Spin Now!",
      brandColors: {},
      animationSpeed: "normal"
    },
    features: [
      "Brandable wheel", "Probability controls", "Email gating", "Confetti animation"
    ],
    tags: ["Spin Wheel", "Lead", "Game", "Prize"],
  },
  // Advanced Wheel – E-commerce
  {
    id: "discount-wheel-ecom",
    name: "Discount Prize Wheel",
    description: "E-commerce discount wheel for first-time or returning visitors.",
    category: "E-commerce",
    icon: "plus",
    previewImage: "/placeholder.svg",
    config: {
      segments: ["15% Off", "5% Off", "BOGO", "No Luck", "Mystery Prize"],
      probability: [0.25, 0.25, 0.15, 0.25, 0.1],
      audience: "new",
      utmTracking: true,
      brandColors: {},
      animationSpeed: "fast"
    },
    features: [
      "Audience targeting", "Discount offers", "Themeable", "Tracking code"
    ],
    tags: ["E-commerce", "Discount", "Game"],
  },
  // Scratch Card – Lead Gen
  {
    id: "scratch-card-lead",
    name: "Interactive Scratch Card",
    description: "Scratch to reveal instant win – captures email before reward unlock.",
    category: "Lead Generation",
    icon: "pencil-line",
    previewImage: "/placeholder.svg",
    config: {
      revealText: "Congratulations! You Win",
      prizeList: ["10% Off", "Mystery Gift", "Free Shipping"],
      captureBeforeReveal: true,
      animation: "sparkle",
      brandColors: {},
      effect: "brush"
    },
    features: [
      "Scratch animation", "Randomized prizes", "Email gating", "Instant reveal"
    ],
    tags: ["Scratch", "Lead", "Game"],
  },
  // Memory Game – Mobile
  {
    id: "memory-game-mobile",
    name: "Memory Card Game",
    description: "Fun memory matching game for mobile or desktop visitors with prize tiering.",
    category: "Mobile-First",
    icon: "circle-check",
    previewImage: "/placeholder.svg",
    config: {
      cards: 12,
      difficulty: "medium",
      timer: true,
      prizes: ["5% Off", "10% Off", "Try Again"],
      showLeaderboard: false,
      mobileOptimized: true,
      brandColors: {}
    },
    features: [
      "Mobile-first UI", "Timer mode", "Configurable cards", "Prize rewards"
    ],
    tags: ["Memory", "Game", "Mobile"],
  },
  // Multi-Step Lead Form – Lead Gen
  {
    id: "lead-multistep-form",
    name: "Multi-Step Lead Magnet",
    description: "High-converting multi-step popup form with progress indicator.",
    category: "Lead Generation",
    icon: "arrow-down",
    previewImage: "/placeholder.svg",
    config: {
      steps: [
        { headline: "Step 1", fields: ["email"] },
        { headline: "Step 2", fields: ["firstName", "company"] }
      ],
      showProgress: true,
      brandColors: {},
      cta: "Get Offer"
    },
    features: [
      "Multi-step form", "Progress bar", "Validation", "Auto-save"
    ],
    tags: ["Lead", "Multi-Step", "Form"],
  },
  // Quiz Popup – Lead/Seasonal
  {
    id: "quiz-popup-holiday",
    name: "Holiday Quiz Challenge",
    description: "Trivia quiz popup (holiday themed) with instant reward for right answers.",
    category: "Holiday/Seasonal",
    icon: "circle-plus",
    previewImage: "/placeholder.svg",
    config: {
      questions: [
        {
          question: "In what month is Black Friday?",
          options: ["November", "October", "December"],
          correct: 0
        }
      ],
      showProgress: true,
      resultPrizes: ["5% Off", "Free Shipping"],
      brandColors: {},
      animation: "fade"
    },
    features: [
      "Holiday theme", "Multiple choice", "Reward system", "Animated"
    ],
    tags: ["Quiz", "Game", "Holiday"],
  },
  // Countdown Timer – E-commerce
  {
    id: "timer-flash-sale",
    name: "Urgency Countdown Banner",
    description: "Real-time countdown popup for flash sales or limited stock.",
    category: "E-commerce",
    icon: "arrow-up",
    previewImage: "/placeholder.svg",
    config: {
      timeDuration: "01:30:00",
      actionUrl: "/shop-sale",
      saleText: "Flash Sale Ending Soon!",
      brandColors: {},
      animatedNumbers: true
    },
    features: [
      "Countdown timer", "One-click buy", "Urgency effect"
    ],
    tags: ["E-commerce", "Countdown", "Timer"],
  },
  // Product Recommender – E-commerce
  {
    id: "product-reco-ecommerce",
    name: "AI Product Recommender",
    description: "Popup showing products tailored to user’s behavior.",
    category: "E-commerce",
    icon: "image",
    previewImage: "/placeholder.svg",
    config: {
      products: [],
      showRating: true,
      smartTargeting: true,
      brandColors: {}
    },
    features: [
      "Smart AI recs", "Dynamic content", "Integration-ready"
    ],
    tags: ["E-commerce", "Product", "AI"],
  },
  // Cart Recovery – E-commerce
  {
    id: "cart-abandonment-popup",
    name: "Cart Abandonment Saver",
    description: "Motivates visitors to complete checkout with an incentive.",
    category: "E-commerce",
    icon: "plus",
    previewImage: "/placeholder.svg",
    config: {
      incentive: "10% Off",
      condition: "user-cart",
      cta: "Checkout Now",
      brandColors: {},
      animation: "shake"
    },
    features: [
      "Abandonment detection", "Exit intent", "Discount"
    ],
    tags: ["E-commerce", "Cart", "Discount"],
  },
  // Newsletter Signup – Mobile
  {
    id: "newsletter-fab-mobile",
    name: "Mobile Newsletter Signup",
    description: "Slide-up newsletter form optimized for mobile users.",
    category: "Mobile-First",
    icon: "plus",
    previewImage: "/placeholder.svg",
    config: {
      emailOnly: true,
      layout: "bottom-sheet",
      mobileOptimized: true,
      brandColors: {},
      cta: "Subscribe"
    },
    features: [
      "Mobile native look", "Quick subscribe", "Keyboard aware"
    ],
    tags: ["Newsletter", "Mobile", "SlideUp"],
  },
  // Exit Intent – Lead Generation
  {
    id: "exit-intent-capture",
    name: "Exit Intent Lead Capture",
    description: "Popup triggers when user moves to leave, capturing last-chance leads.",
    category: "Lead Generation",
    icon: "undo",
    previewImage: "/placeholder.svg",
    config: {
      trigger: "exit-intent",
      form: { email: true, name: false },
      offer: "Last chance 15% Off",
      brandColors: {},
      animation: "bounce"
    },
    features: [
      "Exit intent trigger", "Custom offer", "Lead form"
    ],
    tags: ["Exit", "Popup", "Lead"],
  },
  // Social Contest – Seasonal
  {
    id: "social-share-contest",
    name: "Social Sharing Contest Popup",
    description: "Encourage shares with instant win on share (holiday/seasonal promotion).",
    category: "Holiday/Seasonal",
    icon: "circle-plus",
    previewImage: "/placeholder.svg",
    config: {
      contestType: "share-to-win",
      prize: "Gift Box",
      theme: "holiday",
      networks: ["Facebook", "X", "Instagram"],
      brandColors: {}
    },
    features: [
      "Tracked shares", "Instant prizes", "Holiday theme"
    ],
    tags: ["Contest", "Social", "Holiday"],
  },
  // B2B Lead Capture
  {
    id: "b2b-lead-gen",
    name: "B2B Lead Capture Popup",
    description: "Professional lead gen with fields tailored to B2B audiences.",
    category: "B2B",
    icon: "circle-check",
    previewImage: "/placeholder.svg",
    config: {
      fields: ["name", "company", "workEmail"],
      offer: "Get Proposal",
      brandColors: {},
      crmConnect: true
    },
    features: [
      "B2B fields", "CRM Integration", "Validations"
    ],
    tags: ["Lead", "B2B", "Form"],
  },
  // Survey Popup – Lead/Seasonal
  {
    id: "survey-popup-lead",
    name: "Quick Survey Popup",
    description: "Ask for quick feedback or preferences with reward on completion.",
    category: "Lead Generation",
    icon: "pencil-line",
    previewImage: "/placeholder.svg",
    config: {
      questions: [
        { label: "How did you find us?", type: "select", options: ["Google", "Facebook", "Other"] }
      ],
      reward: "5% Off",
      brandColors: {},
    },
    features: [
      "Easy survey", "Multiple formats", "Reward system"
    ],
    tags: ["Survey", "Lead", "Popup"],
  },
  // Gamified Spin Wheel – Mobile
  {
    id: "mobile-gamified-spin",
    name: "Mobile-Optimized Spin Wheel",
    description: "Spin-to-win wheel with mobile touch gestures and haptic feedback.",
    category: "Mobile-First",
    icon: "arrow-down",
    previewImage: "/placeholder.svg",
    config: {
      segments: ["Win", "Try Again", "Discount"],
      touchSpin: true,
      showConfetti: true,
      showHaptic: true,
      brandColors: {}
    },
    features: [
      "Touch gestures", "Vibration", "Mobile-optimized animation"
    ],
    tags: ["Spin Wheel", "Mobile", "Game"],
  },
  // Seasonal Animated Wheel
  {
    id: "seasonal-spin-theme",
    name: "Seasonal Spin Wheel",
    description: "Holiday-themed spin wheel popup with seasonal icons and brandable elements.",
    category: "Holiday/Seasonal",
    icon: "circle-plus",
    previewImage: "/placeholder.svg",
    config: {
      segments: ["Gift", "Discount", "Surprise"],
      theme: "holiday",
      iconDecor: true,
      animation: "snowfall",
      brandColors: {}
    },
    features: [
      "Holiday design", "Animated icons", "Brandable"
    ],
    tags: ["Spin Wheel", "Seasonal", "Game"],
  },
  // B2B Webinar Registration
  {
    id: "b2b-webinar-popup",
    name: "Webinar Registration Popup",
    description: "Single-step registration for a B2B webinar, integrates with CRMs.",
    category: "B2B",
    icon: "plus",
    previewImage: "/placeholder.svg",
    config: {
      event: "Webinar: Grow Your Business",
      fields: ["name", "email", "company"],
      icsFile: true,
      crmConnect: true,
      brandColors: {}
    },
    features: [
      "CRM export", "Calendar invite", "B2B fields"
    ],
    tags: ["Webinar", "B2B", "Form"],
  },
  // Mobile Feedback
  {
    id: "mobile-feedback-popup",
    name: "Mobile Feedback Form",
    description: "Super simple one-question feedback form for mobile users.",
    category: "Mobile-First",
    icon: "pencil",
    previewImage: "/placeholder.svg",
    config: {
      question: "How was your experience?",
      type: "emoji",
      brandColors: {}
    },
    features: [
      "Tap feedback", "Emoji reactions", "Mobile UI"
    ],
    tags: ["Feedback", "Mobile", "Form"],
  },
];

