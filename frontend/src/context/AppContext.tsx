// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react'

export type PersonaType = 'salaried' | 'freelancer' | 'business'
export type ThemeMode = 'light' | 'dark'

export interface AuthUser {
  id: string
  name: string
  email?: string
  phone?: string
  isGuest?: boolean
  monthlyIncome?: number
}

export interface SavedUserProfile {
  id: string
  identifier: string // phone or email or 'guest'
  name: string
  email?: string
  phone?: string
  isGuest?: boolean
  persona: PersonaType
  monthlyIncome: number
  onboardingDone: boolean
  bankConsent?: BankConsentState
  lastLoginAt: string
}

export interface SimulatorState {
  decisionCost: number
  paymentDelayDays: number
  upfrontPercent: number
  hiddenCostBuffer: number
  splitBatches: number
}

export interface RiskCardConfig {
  id: string
  title: string
  plainTitle: string
  metricLabel: string
  warningText: string
  advice: string
  severity: 'safe' | 'warning' | 'critical'
}

export interface RescuePlanConfig {
  id: string
  tag: string
  tagColor: string
  title: string
  description: string
  upfrontPercent: number
  splitBatches: number
  hiddenCostBuffer: number
  paymentDelayDays: number
  negotiationMessage: string
}

export interface PersonaTheme {
  name: string
  meshClass: string
  orb1: string
  orb2: string
  orb3: string
  accentBorder: string
  accentText: string
  accentBg: string
  badgeClass: string
  buttonGradient: string
  primaryHex: string
}

export interface PersonaData {
  type: PersonaType
  label: string
  emoji: string
  story: string
  balance: number
  monthlyIncome: number
  lockedReserves: number
  hiddenLeaks: number
  creditScore: number
  incomeLabel: string
  purchaseLabel: string
  defaultDecisionCost: number
  sliderLabels: {
    decisionCost: string
    paymentDelay: string
    upfrontPercent: string
    hiddenCost: string
    splitBatches: string
  }
  riskCards: RiskCardConfig[]
  rescuePlans: RescuePlanConfig[]
  theme: PersonaTheme
}

export const PERSONAS: Record<PersonaType, PersonaData> = {
  salaried: {
    type: 'salaried',
    label: 'Student & Job Holder',
    emoji: '👤',
    story: 'Planning to buy a ₹55,000 Laptop/Bike while keeping ₹18,000 Hostel Rent & College Fees safe.',
    balance: 65000,
    monthlyIncome: 45000,
    lockedReserves: 18000,
    hiddenLeaks: 3399,
    creditScore: 710,
    incomeLabel: 'Monthly Salary / Pocket-Money',
    purchaseLabel: '₹55,000 Laptop or Bike',
    defaultDecisionCost: 55000,
    sliderLabels: {
      decisionCost: 'Laptop / Bike Price',
      paymentDelay: 'Salary / Pocket-Money Delay',
      upfrontPercent: 'Downpayment Paid Right Now',
      hiddenCost: 'Extra EMI & Delivery Charges',
      splitBatches: 'Split into Monthly Parts',
    },
    theme: {
      name: 'Electric Violet & Cyber Cyan',
      meshClass: 'from-[#0b0416] via-[#150a2e] to-[#041122]',
      orb1: 'rgba(168, 85, 247, 0.35)',
      orb2: 'rgba(236, 72, 153, 0.25)',
      orb3: 'rgba(6, 182, 212, 0.30)',
      accentBorder: 'border-fuchsia-500/40 hover:border-violet-400',
      accentText: 'text-fuchsia-400',
      accentBg: 'bg-fuchsia-500/10',
      badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
      buttonGradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      primaryHex: '#a855f7',
    },
    riskCards: [
      {
        id: 'midnight-food',
        title: 'Midnight Food Delivery Trap',
        plainTitle: '1 AM Food Orders Squeezing Rent',
        metricLabel: '₹3,200 Spent on Late Deliveries',
        warningText: 'You spent ₹3,200 on late-night food deliveries during exam & work prep. That is almost 20% of your rent money!',
        advice: 'Meal prep 2 days a week or keep quick snacks at home to save ₹2,400 every month instantly.',
        severity: 'warning',
      },
      {
        id: 'forgotten-sub',
        title: 'Sneaky Free-Trial Auto-Debit',
        plainTitle: 'Forgotten Gym & App Auto-Debits',
        metricLabel: '₹199 / Month Silent Debit',
        warningText: 'A forgotten streaming & fitness trial auto-deducted ₹199 with zero phone notification.',
        advice: 'Cancel before the 28th to prevent next month’s charge and recover peace of mind.',
        severity: 'warning',
      },
      {
        id: 'friend-split',
        title: 'Unpaid Group Dinner Split',
        plainTitle: 'Friend Owes ₹400 for Dinner',
        metricLabel: '₹400 Pending on UPI',
        warningText: 'A close friend still owes ₹400 from last Friday’s group dinner split that hasn’t hit your bank.',
        advice: 'Tap 1-click UPI reminder to collect the ₹400 before making your downpayment.',
        severity: 'safe',
      },
      {
        id: 'rent-lock',
        title: 'Untouchable Rent & Fees Floor',
        plainTitle: 'Hostel Rent & College Exam Fees',
        metricLabel: '₹18,000 100% Untouchable',
        warningText: '₹18,000 is strictly locked for hostel rent and college exam fees due on the 5th.',
        advice: 'Never dip below this floor—hostels levy a ₹200/day late penalty for delayed rent.',
        severity: 'critical',
      },
      {
        id: 'student-credit',
        title: 'Student Loan Trust Score (710)',
        plainTitle: 'Credit Card & Laptop EMI Trust',
        metricLabel: '710 / 850 Good Score',
        warningText: 'Good score for starter cards, but paying college fees or bills even 3 days late drops it below 650.',
        advice: 'Setting up auto-pay from your salary keeps your score climbing toward 750+.',
        severity: 'safe',
      },
      {
        id: 'salary-delay-shock',
        title: 'Salary Delay Safety Buffer',
        plainTitle: '8-Day Paycheck Delay Squeeze',
        metricLabel: 'Only ₹3,400 Safety Room',
        warningText: 'If your allowance or salary is delayed by 8 days, you have only ₹3,400 in room before rent is due.',
        advice: 'Keep a ₹5,000 emergency buffer so late salary never threatens your hostel room.',
        severity: 'warning',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#a855f7',
        title: 'Wait 12 Days Until Salary Arrives + Cancel 2 Subscriptions',
        description:
          'Postpone the laptop/bike downpayment by 12 days until your salary/allowance hits on the 1st. Cancel the ₹199 trial and an unused streaming app to free up ₹5,400 in cash.',
        upfrontPercent: 30,
        splitBatches: 2,
        hiddenCostBuffer: 5,
        paymentDelayDays: 0,
        negotiationMessage:
          'Hey [Store/Seller], I really want to buy the ₹55,000 laptop/bike. Can you hold the model for me until the 1st of next month? I will make a 30% advance on the 1st as soon as my monthly salary credits. Thanks!',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#ec4899',
        title: 'Split Purchase into 3 Zero-Cost Parts (Keep Rent Safe)',
        description:
          'Split the ₹55,000 into 3 monthly parts of ₹18,333. Your monthly income easily covers each installment while keeping your ₹18,000 hostel rent 100% untouched.',
        upfrontPercent: 33,
        splitBatches: 3,
        hiddenCostBuffer: 6,
        paymentDelayDays: 5,
        negotiationMessage:
          'Hi, could we set up a 3-part monthly payment for the ₹55,000 purchase? I can pay ₹18,333 today and the remaining two parts on the 1st of the next two months. This keeps both parties protected!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#06b6d4',
        title: 'Pay 40% Down + Claim ₹1,500 Pending Splits & Refund',
        description:
          'Pay 40% (₹22,000) upfront today, collect the ₹400 friend dinner split, and claim your ₹1,100 pending shopping return refund to erase all cash squeeze.',
        upfrontPercent: 40,
        splitBatches: 2,
        hiddenCostBuffer: 4,
        paymentDelayDays: 0,
        negotiationMessage:
          'Hi! I am ready to pay ₹22,000 (40%) upfront right now today. Can we schedule the balance after delivery next week? Please share your QR or UPI ID for instant transfer.',
      },
    ],
  },

  freelancer: {
    type: 'freelancer',
    label: 'Freelancer & Creator',
    emoji: '💻',
    story: 'Buying a ₹45,000 Camera/Editing Upgrade while a client is delaying a ₹65,000 project payment by 22 days.',
    balance: 42000,
    monthlyIncome: 0,
    lockedReserves: 12000,
    hiddenLeaks: 2800,
    creditScore: 660,
    incomeLabel: 'Pending Client Invoices',
    purchaseLabel: '₹45,000 Camera & Lens Upgrade',
    defaultDecisionCost: 45000,
    sliderLabels: {
      decisionCost: 'Gear / Studio Upgrade Cost',
      paymentDelay: 'Client Payment Delay',
      upfrontPercent: 'Client Advance Collected',
      hiddenCost: 'Platform & Tax Deduction',
      splitBatches: 'Milestone Payments',
    },
    theme: {
      name: 'Sunset Amber & Coral Rose',
      meshClass: 'from-[#160803] via-[#240b15] to-[#14051f]',
      orb1: 'rgba(245, 158, 11, 0.35)',
      orb2: 'rgba(244, 63, 94, 0.25)',
      orb3: 'rgba(147, 51, 234, 0.30)',
      accentBorder: 'border-amber-500/40 hover:border-rose-400',
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500/10',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
      primaryHex: '#f59e0b',
    },
    riskCards: [
      {
        id: 'unverified-upi',
        title: 'Unverified UPI Payment Proof',
        plainTitle: 'Client Sent WhatsApp Screenshot',
        metricLabel: '₹65,000 NOT in Bank Yet',
        warningText: 'Client sent an unverified UPI screenshot that has not hit your bank account. Fake receipt scams are common!',
        advice: 'Never hand over unwatermarked high-res deliverables until the payment officially reflects in your bank.',
        severity: 'critical',
      },
      {
        id: 'studio-rent-countdown',
        title: 'Studio Rent Due in 10 Days',
        plainTitle: 'Studio Rent & High-Speed WiFi',
        metricLabel: '₹12,000 Rent Countdown: 10d',
        warningText: 'Your studio workspace rent of ₹12,000 is due in 10 days. If the client delays, you risk late lock-out fees.',
        advice: 'Keep ₹12,000 strictly ring-fenced so your creative workspace remains open.',
        severity: 'warning',
      },
      {
        id: 'irregular-income',
        title: 'Rollercoaster Gig Inflows',
        plainTitle: 'Zero Guaranteed Paycheck',
        metricLabel: '±60% Monthly Inflow Swings',
        warningText: 'Freelance revenue swings by over 60% month-to-month. Spending ₹45,000 today creates an immediate cash valley.',
        advice: 'Plan equipment purchases only after client invoices have officially cleared.',
        severity: 'warning',
      },
      {
        id: 'tax-tds-cut',
        title: 'Platform & 10% TDS Deduction',
        plainTitle: 'Taxes & Marketplace Cuts',
        metricLabel: '₹6,500 Withheld at Source',
        warningText: 'Corporate clients automatically deduct 10% TDS and platforms take processing cuts, shrinking your net payout.',
        advice: 'Factor in the 10% cut beforehand so you know your true in-hand cash.',
        severity: 'safe',
      },
      {
        id: 'freelancer-score',
        title: 'Freelancer Trust Score (660)',
        plainTitle: 'Equipment Loan Eligibility',
        metricLabel: '660 / 850 Moderate Score',
        warningText: 'Banks scrutinize freelancers without formal salary slips. Staying out of overdraft boosts your creditworthiness.',
        advice: 'Maintaining a 20% minimum balance unlocks instant zero-paperwork EMI approvals.',
        severity: 'warning',
      },
      {
        id: 'delayed-invoice-trap',
        title: '22-Day Delayed Invoice Trap',
        plainTitle: '₹15,000 Cash Danger Zone',
        metricLabel: '₹15,000 Shortfall if Bought Now',
        warningText: 'Buying the ₹45,000 camera today while waiting 22 days for ₹65,000 leaves you ₹15,000 below your safety floor.',
        advice: 'Use milestone billing to collect ₹26,000 upfront before purchasing gear.',
        severity: 'critical',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#f59e0b',
        title: 'Request 40% Milestone Payout Before Final Handoff',
        description:
          'Withhold high-res exports until the client releases a 40% milestone payment (₹26,000). Gives you immediate cash to buy gear with zero shortfall.',
        upfrontPercent: 40,
        splitBatches: 2,
        hiddenCostBuffer: 8,
        paymentDelayDays: 5,
        negotiationMessage:
          'Hi [Client Name], the project draft is complete and ready for final delivery! As per standard creative workflow, please release the 40% milestone payment (₹26,000) today so I can hand over full copyright and source files within 2 hours. Thanks!',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#f43f5e',
        title: 'Offer Client ₹1,000 Instant Pay Discount Today',
        description:
          'Offer the client a ₹1,000 discount if they settle the full invoice within 24 hours. You get ₹64,000 in your bank immediately without waiting 22 days.',
        upfrontPercent: 100,
        splitBatches: 1,
        hiddenCostBuffer: 5,
        paymentDelayDays: 0,
        negotiationMessage:
          'Hi [Client Name], I am offering a quick ₹1,000 prompt-settlement discount if the invoice is cleared via IMPS/UPI today (₹64,000 net). Let me know and I will reissue the discounted receipt right away!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#9333ea',
        title: 'Rent Gear for ₹3,500 This Week & Buy After ₹65,000 Clears',
        description:
          'Rent the camera body and lens for this weekend’s shoot for only ₹3,500. Buy the full ₹45,000 gear after the client’s ₹65,000 payment safely hits your account.',
        upfrontPercent: 20,
        splitBatches: 2,
        hiddenCostBuffer: 4,
        paymentDelayDays: 10,
        negotiationMessage:
          'Hi [Equipment Vendor], I need to rent the camera body and 50mm lens for a 2-day commercial shoot this weekend (₹3,500 total). Please share pickup timing and security deposit details.',
      },
    ],
  },

  business: {
    type: 'business',
    label: 'Small Business Owner (T-Shirt Shop)',
    emoji: '🏪',
    story: 'Taking a ₹1,00,000 T-Shirt Order where production costs ₹60,000, ₹20,000 Staff Salary & Shop Rent is due first, and delivery costs ₹5,000 extra.',
    balance: 50000,
    monthlyIncome: 0,
    lockedReserves: 20000,
    hiddenLeaks: 5000,
    creditScore: 685,
    incomeLabel: 'Buyer Order Payment (₹1,00,000)',
    purchaseLabel: '₹60,000 T-Shirt Production Order',
    defaultDecisionCost: 60000,
    sliderLabels: {
      decisionCost: 'Production Cost to Make Order',
      paymentDelay: 'Buyer Late Payment Delay',
      upfrontPercent: 'Advance Taken from Buyer',
      hiddenCost: 'Unseen Delivery & Packaging Cost',
      splitBatches: 'Split Order into Batches',
    },
    theme: {
      name: 'Emerald Neon & Royal Blue',
      meshClass: 'from-[#02140e] via-[#051c24] to-[#041029]',
      orb1: 'rgba(16, 185, 129, 0.35)',
      orb2: 'rgba(20, 184, 166, 0.25)',
      orb3: 'rgba(37, 99, 235, 0.30)',
      accentBorder: 'border-emerald-500/40 hover:border-teal-400',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      buttonGradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      primaryHex: '#10b981',
    },
    riskCards: [
      {
        id: 'cash-shortage-trap',
        title: '₹35,000 Working Capital Trap',
        plainTitle: 'Paying Factory Before Buyer Pays',
        metricLabel: '₹35,000 Cash Shortage Alert',
        warningText: 'Paying ₹60,000 for cloth and printing leaves you ₹35,000 short of paying your 2 tailors on the 1st.',
        advice: 'Demand a 45% buyer advance upfront to fund raw materials without depleting payroll.',
        severity: 'critical',
      },
      {
        id: 'hidden-freight',
        title: 'Hidden Freight & Packaging Shock',
        plainTitle: 'Sneaky Transporter Delivery Fee',
        metricLabel: '₹5,000 Extra Logistics Surcharge',
        warningText: 'Carriers charge an unbilled ₹5,000 volumetric packaging and express delivery fee on 1,000 shirts.',
        advice: 'Include a mandatory ₹5,000 line item for shipping in your official pro-forma invoice.',
        severity: 'warning',
      },
      {
        id: 'repeat-late-buyer',
        title: 'Repeat Late Buyer Risk',
        plainTitle: 'Buyer Paid 18 Days Late Past 3x',
        metricLabel: 'High Non-Payment Exposure',
        warningText: 'This wholesale buyer delayed settlement by 18 days on their previous 3 orders. High risk of cash freeze.',
        advice: 'Do not load the delivery truck without a bank UTR confirmation for 80%+ of the invoice.',
        severity: 'critical',
      },
      {
        id: 'worker-salary-lock',
        title: 'Staff Salaries & Shop Rent Lock',
        plainTitle: 'Tailor Wages & Store Rent',
        metricLabel: '₹20,000 100% Locked for Payroll',
        warningText: 'Shop rent and tailor wages must be paid on the 1st. Workshop shuts down if staff salaries are delayed.',
        advice: 'Keep ₹20,000 in an isolated current account so day-to-day operations never stall.',
        severity: 'critical',
      },
      {
        id: 'trade-credit',
        title: 'Supplier Trade Credit Score (685)',
        plainTitle: '30-Day Cotton Fabric Credit',
        metricLabel: '685 / 850 Good Trade Rating',
        warningText: 'Wholesale cloth mills offer 30 days of yarn credit if you maintain a 25% clean bank buffer.',
        advice: 'Pay the mill 25% down to unlock ₹40,000 in raw material credit for 14 days.',
        severity: 'safe',
      },
      {
        id: 'single-batch-risk',
        title: 'Single-Batch Delivery Vulnerability',
        plainTitle: 'All 1,000 Shirts in One Lot',
        metricLabel: '100% Risk on 1 Delivery Day',
        warningText: 'Delivering all 1,000 t-shirts in one lot concentrates 100% of your business risk on one single buyer check.',
        advice: 'Split into 2 deliveries of 500 shirts to get paid halfway through production.',
        severity: 'warning',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#10b981',
        title: 'Ask Buyer for 45% Advance (₹45,000) to Cover Production',
        description:
          'Secure a 45% advance (₹45,000) from the buyer before cutting cloth. Completely wipes out the ₹35,000 shortage and protects your ₹20,000 staff salary floor.',
        upfrontPercent: 45,
        splitBatches: 1,
        hiddenCostBuffer: 8,
        paymentDelayDays: 10,
        negotiationMessage:
          'Dear [Buyer Name], thank you for the 1,000 pcs t-shirt order (₹1,00,000). To procure premium cotton yarn and book press slots, we require a standard 45% production advance (₹45,000). Balance on dispatch. Please approve so we can start dyeing.',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#14b8a6',
        title: '2-Batch Split Delivery (500 Shirts First)',
        description:
          'Split the order into 2 batches of 500 shirts. Make Batch 1 first, collect cash on delivery, and self-fund Batch 2 with zero shortage.',
        upfrontPercent: 25,
        splitBatches: 2,
        hiddenCostBuffer: 8,
        paymentDelayDays: 15,
        negotiationMessage:
          'Hi [Buyer Name], to speed up your inventory, we propose delivering your order in 2 batches: 500 shirts by Friday (pay on delivery), and 500 shirts next week. This gets merchandise onto your shelves 5 days faster!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#2563eb',
        title: '25% Advance + 14 Extra Days from Cloth Supplier',
        description:
          'Collect 25% (₹25,000) advance from the buyer and negotiate 2 weeks of credit from your cotton yarn supplier.',
        upfrontPercent: 25,
        splitBatches: 2,
        hiddenCostBuffer: 6,
        paymentDelayDays: 5,
        negotiationMessage:
          'Respected [Cloth Supplier], we are purchasing ₹40,000 in combed cotton today for an ongoing corporate order. We will pay 25% upfront today and the balance in 14 days upon delivery. Thank you for your continued partnership.',
      },
    ],
  },
}

export interface BankConsentState {
  isLinked: boolean
  bankName: string | null
  bankId: string | null
  accountMasked: string | null
  consentId: string | null
  linkedAt: string | null
  expiresInDays: number
  permissions: {
    readOnlyHistory: boolean
    autoExpire30Days: boolean
    instantRevoke: boolean
  }
}

export interface UserGoal {
  title: string
  targetAmount: number
  targetMonths: number
  category: string
  downpaymentPercent?: number
}

interface AppContextType {
  themeMode: ThemeMode
  toggleThemeMode: () => void
  persona: PersonaType
  setPersona: (p: PersonaType) => void
  personaData: PersonaData
  simulator: SimulatorState
  setSimulator: (s: Partial<SimulatorState>) => void
  authUser: AuthUser | null
  setAuthUser: (u: AuthUser | null) => void
  demoLogin: () => void
  logout: () => void
  bankConsent: BankConsentState
  setBankConsent: React.Dispatch<React.SetStateAction<BankConsentState>>
  linkBankSuccess: (bankName: string, bankId: string, accountMasked?: string) => void
  revokeBankConsent: () => void
  isOnboardingDone: boolean
  loginAsReturningUser: (profile: SavedUserProfile) => void
  loginAsNewUser: (identifier: string, type: 'phone' | 'email' | 'guest', name?: string) => void
  completeOnboarding: (name: string, monthlyIncome: number, selectedPersona: PersonaType) => void
  resetOnboardingDemo: () => void
  getSavedUserByIdentifier: (identifier: string) => SavedUserProfile | null
  userGoal: UserGoal
  updateUserGoal: (goal: Partial<UserGoal>) => void
}

const DEFAULT_SIMULATOR: SimulatorState = {
  decisionCost: 55000,
  paymentDelayDays: 8,
  upfrontPercent: 30,
  hiddenCostBuffer: 8,
  splitBatches: 2,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme Mode
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('finvexa_theme_mode') as ThemeMode
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // ignore
    }
    return 'dark'
  })

  const toggleThemeMode = useCallback(() => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('finvexa_theme_mode', next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  // Onboarding Done state
  const [isOnboardingDone, setIsOnboardingDone] = useState<boolean>(() => {
    try {
      return localStorage.getItem('finvexa_onboarding_done') === 'true'
    } catch {
      return false
    }
  })

  // Auth User
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('finvexa_auth_session')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return null
  })

  // Persona State
  const [persona, setPersonaState] = useState<PersonaType>(() => {
    try {
      const savedUser = localStorage.getItem('finvexa_auth_session')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        if (parsed.persona && PERSONAS[parsed.persona as PersonaType]) {
          return parsed.persona as PersonaType
        }
      }
    } catch {
      // ignore
    }
    return 'salaried'
  })

  const [simulator, setSimulatorState] = useState<SimulatorState>(DEFAULT_SIMULATOR)

  // Goal Strategy State
  const [userGoal, setUserGoalState] = useState<UserGoal>(() => {
    try {
      const saved = localStorage.getItem('finvexa_user_goal')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return {
      title: 'Buy a ₹55,000 laptop in 2 months',
      targetAmount: 55000,
      targetMonths: 2,
      category: 'tech',
      downpaymentPercent: 30,
    }
  })

  const updateUserGoal = useCallback((newGoal: Partial<UserGoal>) => {
    setUserGoalState(prev => {
      const updated = { ...prev, ...newGoal }
      try {
        localStorage.setItem('finvexa_user_goal', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }, [])

  const setPersona = useCallback((p: PersonaType) => {
    setPersonaState(p)
    if (p === 'salaried') {
      setSimulatorState({
        decisionCost: 55000,
        paymentDelayDays: 8,
        upfrontPercent: 30,
        hiddenCostBuffer: 8,
        splitBatches: 2,
      })
    } else if (p === 'freelancer') {
      setSimulatorState({
        decisionCost: 45000,
        paymentDelayDays: 22,
        upfrontPercent: 25,
        hiddenCostBuffer: 10,
        splitBatches: 2,
      })
    } else {
      setSimulatorState({
        decisionCost: 60000,
        paymentDelayDays: 25,
        upfrontPercent: 15,
        hiddenCostBuffer: 8,
        splitBatches: 1,
      })
    }

    // Also update saved user session if exists
    try {
      const session = localStorage.getItem('finvexa_auth_session')
      if (session) {
        const parsed = JSON.parse(session)
        parsed.persona = p
        localStorage.setItem('finvexa_auth_session', JSON.stringify(parsed))

        const savedUsersRaw = localStorage.getItem('finvexa_saved_users')
        if (savedUsersRaw) {
          const users: Record<string, SavedUserProfile> = JSON.parse(savedUsersRaw)
          const key = parsed.phone || parsed.email || parsed.id
          if (users[key]) {
            users[key].persona = p
            localStorage.setItem('finvexa_saved_users', JSON.stringify(users))
          }
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const setSimulator = useCallback((s: Partial<SimulatorState>) => {
    setSimulatorState(prev => ({ ...prev, ...s }))
  }, [])

  const [bankConsent, setBankConsent] = useState<BankConsentState>(() => {
    try {
      const saved = localStorage.getItem('finvexa_bank_consent')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return {
      isLinked: false,
      bankName: null,
      bankId: null,
      accountMasked: null,
      consentId: null,
      linkedAt: null,
      expiresInDays: 30,
      permissions: {
        readOnlyHistory: true,
        autoExpire30Days: true,
        instantRevoke: true,
      },
    }
  })

  const linkBankSuccess = useCallback((bankName: string, bankId: string, accountMasked = '•••• 4912') => {
    const consent: BankConsentState = {
      isLinked: true,
      bankName,
      bankId,
      accountMasked,
      consentId: `AA-RBI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      linkedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiresInDays: 30,
      permissions: {
        readOnlyHistory: true,
        autoExpire30Days: true,
        instantRevoke: true,
      },
    }
    setBankConsent(consent)
    try {
      localStorage.setItem('finvexa_bank_consent', JSON.stringify(consent))

      // Also persist to current session & saved users
      const session = localStorage.getItem('finvexa_auth_session')
      if (session) {
        const parsed = JSON.parse(session)
        const key = parsed.phone || parsed.email || parsed.id
        const savedUsersRaw = localStorage.getItem('finvexa_saved_users')
        if (savedUsersRaw) {
          const users: Record<string, SavedUserProfile> = JSON.parse(savedUsersRaw)
          if (users[key]) {
            users[key].bankConsent = consent
            localStorage.setItem('finvexa_saved_users', JSON.stringify(users))
          }
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const revokeBankConsent = useCallback(() => {
    const resetConsent: BankConsentState = {
      isLinked: false,
      bankName: null,
      bankId: null,
      accountMasked: null,
      consentId: null,
      linkedAt: null,
      expiresInDays: 30,
      permissions: {
        readOnlyHistory: true,
        autoExpire30Days: true,
        instantRevoke: true,
      },
    }
    setBankConsent(resetConsent)
    try {
      localStorage.removeItem('finvexa_bank_consent')
      const session = localStorage.getItem('finvexa_auth_session')
      if (session) {
        const parsed = JSON.parse(session)
        const key = parsed.phone || parsed.email || parsed.id
        const savedUsersRaw = localStorage.getItem('finvexa_saved_users')
        if (savedUsersRaw) {
          const users: Record<string, SavedUserProfile> = JSON.parse(savedUsersRaw)
          if (users[key]) {
            users[key].bankConsent = resetConsent
            localStorage.setItem('finvexa_saved_users', JSON.stringify(users))
          }
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Helper: Find saved user by phone or email
  const getSavedUserByIdentifier = useCallback((identifier: string): SavedUserProfile | null => {
    try {
      const clean = identifier.trim().toLowerCase()
      const savedUsersRaw = localStorage.getItem('finvexa_saved_users')
      if (!savedUsersRaw) return null
      const users: Record<string, SavedUserProfile> = JSON.parse(savedUsersRaw)
      return users[clean] || Object.values(users).find(u => u.identifier.toLowerCase() === clean || u.email?.toLowerCase() === clean || u.phone === clean) || null
    } catch {
      return null
    }
  }, [])

  // Login as returning user
  const loginAsReturningUser = useCallback((profile: SavedUserProfile) => {
    const user: AuthUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      isGuest: profile.isGuest,
      monthlyIncome: profile.monthlyIncome,
    }
    setAuthUser(user)
    setPersona(profile.persona)
    setIsOnboardingDone(true)

    if (profile.bankConsent?.isLinked) {
      setBankConsent(profile.bankConsent)
      try {
        localStorage.setItem('finvexa_bank_consent', JSON.stringify(profile.bankConsent))
      } catch {
        // ignore
      }
    }

    try {
      localStorage.setItem('finvexa_auth_session', JSON.stringify({ ...user, persona: profile.persona }))
      localStorage.setItem('finvexa_onboarding_done', 'true')
    } catch {
      // ignore
    }
  }, [setPersona])

  // Login as new user / guest
  const loginAsNewUser = useCallback((identifier: string, type: 'phone' | 'email' | 'guest', name = '') => {
    const isGuest = type === 'guest'
    const cleanId = isGuest ? `guest_${Date.now()}` : identifier.trim()
    const displayName = isGuest ? 'Guest Explorer' : name || (type === 'email' ? identifier.split('@')[0] : `User ${identifier.slice(-4)}`)

    const user: AuthUser = {
      id: `usr_${Date.now()}`,
      name: displayName,
      email: type === 'email' ? cleanId : undefined,
      phone: type === 'phone' ? cleanId : undefined,
      isGuest,
      monthlyIncome: 45000,
    }
    setAuthUser(user)
    setIsOnboardingDone(false)

    try {
      localStorage.setItem('finvexa_auth_session', JSON.stringify(user))
      localStorage.removeItem('finvexa_onboarding_done')
    } catch {
      // ignore
    }
  }, [])

  // Complete onboarding wizard
  const completeOnboarding = useCallback((name: string, monthlyIncome: number, selectedPersona: PersonaType) => {
    setPersona(selectedPersona)
    setIsOnboardingDone(true)

    setAuthUser(prev => {
      const updated: AuthUser = {
        id: prev?.id || `usr_${Date.now()}`,
        name: name || prev?.name || 'Explorer',
        email: prev?.email,
        phone: prev?.phone,
        isGuest: prev?.isGuest,
        monthlyIncome,
      }

      // Persist to session and saved_users
      try {
        localStorage.setItem('finvexa_auth_session', JSON.stringify({ ...updated, persona: selectedPersona }))
        localStorage.setItem('finvexa_onboarding_done', 'true')

        const key = updated.phone || updated.email || updated.id
        const savedUsersRaw = localStorage.getItem('finvexa_saved_users')
        const users: Record<string, SavedUserProfile> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {}
        users[key] = {
          id: updated.id,
          identifier: key,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          isGuest: updated.isGuest,
          persona: selectedPersona,
          monthlyIncome,
          onboardingDone: true,
          bankConsent,
          lastLoginAt: new Date().toISOString(),
        }
        localStorage.setItem('finvexa_saved_users', JSON.stringify(users))
      } catch {
        // ignore
      }

      return updated
    })
  }, [setPersona, bankConsent])

  // Demo Login (One-click judge demo)
  const demoLogin = useCallback(() => {
    const demoJudge: AuthUser = {
      id: 'demo-judge-001',
      email: 'judge@finvexa.ai',
      name: 'Demo Judge',
      monthlyIncome: 55000,
    }
    setAuthUser(demoJudge)
    setPersona('salaried')
    setIsOnboardingDone(true)

    try {
      localStorage.setItem('finvexa_auth_session', JSON.stringify({ ...demoJudge, persona: 'salaried' }))
      localStorage.setItem('finvexa_onboarding_done', 'true')
    } catch {
      // ignore
    }
  }, [setPersona])

  // Reset Onboarding (For hackathon pitch demo)
  const resetOnboardingDemo = useCallback(() => {
    setAuthUser(null)
    setIsOnboardingDone(false)
    revokeBankConsent()
    try {
      localStorage.removeItem('finvexa_auth_session')
      localStorage.removeItem('finvexa_onboarding_done')
      localStorage.removeItem('finvexa_bank_consent')
    } catch {
      // ignore
    }
  }, [revokeBankConsent])

  // Logout
  const logout = useCallback(() => {
    setAuthUser(null)
    try {
      localStorage.removeItem('finvexa_auth_session')
    } catch {
      // ignore
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        themeMode,
        toggleThemeMode,
        persona,
        setPersona,
        personaData: PERSONAS[persona],
        simulator,
        setSimulator,
        authUser,
        setAuthUser,
        demoLogin,
        logout,
        bankConsent,
        setBankConsent,
        linkBankSuccess,
        revokeBankConsent,
        isOnboardingDone,
        loginAsReturningUser,
        loginAsNewUser,
        completeOnboarding,
        resetOnboardingDemo,
        getSavedUserByIdentifier,
        userGoal,
        updateUserGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
