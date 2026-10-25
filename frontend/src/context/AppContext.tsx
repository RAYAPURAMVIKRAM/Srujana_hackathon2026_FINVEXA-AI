// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { type Language, translate } from '../i18n/translations'

export type PersonaType = 'salaried' | 'freelancer' | 'business' | 'enterprise'
export type ThemeMode = 'light' | 'dark'
export type EnterpriseCurrencyUnit = 'dual' | 'usd' | 'inr'

export function formatMoney(
  amount: number,
  personaType: PersonaType = 'salaried',
  unitMode: EnterpriseCurrencyUnit = 'dual'
): string {
  if (personaType !== 'enterprise' && Math.abs(amount) < 1_000_000) {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const isNegative = amount < 0
  const absAmt = Math.abs(amount)
  const sign = isNegative ? '-' : ''

  let usdStr = ''
  if (absAmt >= 1_000_000_000) {
    usdStr = `$${(absAmt / 1_000_000_000).toFixed(2)}B`
  } else if (absAmt >= 1_000_000) {
    usdStr = `$${Math.round(absAmt / 1_000_000)}M`
  } else if (absAmt >= 1_000) {
    usdStr = `$${Math.round(absAmt / 1_000)}K`
  } else {
    usdStr = `$${absAmt}`
  }

  // 1 USD = ₹84
  const inrCrores = Math.round((absAmt * 84) / 10_000_000)
  const inrStr = inrCrores >= 1000
    ? `₹${inrCrores.toLocaleString('en-IN')} Cr`
    : `₹${inrCrores} Cr`

  if (unitMode === 'usd') {
    return `${sign}${usdStr}`
  }
  if (unitMode === 'inr') {
    return `${sign}${inrStr}`
  }
  return `${sign}${usdStr} (${sign}${inrStr})`
}

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
  pitchTitle?: string
  pitchQuestion?: string
  pitchExplanation?: string
  checkNumber?: number
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
    story: 'Buy your planned goal without touching untouchable Hostel Rent & College Fees.',
    balance: 65000,
    monthlyIncome: 45000,
    lockedReserves: 18000,
    hiddenLeaks: 3400,
    creditScore: 710,
    incomeLabel: 'Monthly Salary / Pocket-Money',
    purchaseLabel: 'Laptop or Bike Purchase',
    defaultDecisionCost: 50000,
    sliderLabels: {
      decisionCost: 'Purchase Goal Price',
      paymentDelay: 'Salary / Allowance Delay (Days)',
      upfrontPercent: 'Downpayment Paid Right Now (%)',
      hiddenCost: 'Delivery & EMI Extra Charges (%)',
      splitBatches: 'Pay in Monthly Parts (Batches)',
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
        id: 'salary-delay-shock',
        title: 'Salary & Pocket Money Inflow Timing',
        plainTitle: 'Paycheck & Inflow Delay Squeeze',
        metricLabel: 'Only ₹3,400 Safety Room',
        warningText: 'If your salary or allowance is delayed by 8 days, you have only ₹3,400 left before commitments are due.',
        advice: 'Shows exactly when and how much money will be short by comparing when you spend vs. when money arrives.',
        severity: 'warning',
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
        title: 'Credit Score & Loan Trust (710)',
        plainTitle: 'Credit Card & Gadget EMI Trust',
        metricLabel: '710 / 850 Good Score',
        warningText: 'Good score for starter cards, but paying bills even 3 days late drops it below 650.',
        advice: 'Keep card usage below 30% to keep climbing to a 750+ score.',
        severity: 'safe',
      },
      {
        id: 'midnight-food',
        title: '1 AM Delivery Surge & Hidden Fees',
        plainTitle: '1 AM Late-Night Food Delivery Surge',
        metricLabel: '₹3,200 Spent on 1 AM Orders',
        warningText: 'You spent ₹3,200 on late-night food deliveries with surge pricing. That is almost 20% of your rent money!',
        advice: 'Order on ONDC to skip surge markups, or buy snacks beforehand to save ₹2,400 every month instantly.',
        severity: 'warning',
      },
      {
        id: 'forgotten-sub',
        title: 'Sneaky Free-Trial Auto-Debits',
        plainTitle: 'Forgotten Gym & App Trials',
        metricLabel: '₹199 / Month Silent Debit',
        warningText: 'A forgotten streaming and gym trial quietly auto-debited ₹199 with zero phone alert.',
        advice: 'Cancel before next renewal to protect your peace of mind and stop silent leaks.',
        severity: 'warning',
      },
      {
        id: 'friend-split',
        title: 'Friends Who Still Owe You Money',
        plainTitle: 'Friend Owes ₹400 for Dinner Split',
        metricLabel: '₹400 Pending on UPI',
        warningText: 'A close friend still owes you ₹400 from last Friday dinner that has not entered your bank.',
        advice: 'Tap 1-click WhatsApp Web reminder with auto-filled UPI link to collect it without feeling awkward.',
        severity: 'safe',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#2563eb',
        title: 'Wait 12 Days Until Salary Hits + Cancel 2 Subscriptions',
        description:
          'Postpone the purchase by 12 days until salary credits on the 1st. Cancel 2 unused app trials to free up ₹5,400 cash.',
        upfrontPercent: 30,
        splitBatches: 2,
        hiddenCostBuffer: 5,
        paymentDelayDays: 0,
        negotiationMessage:
          'Hey [Store/Seller], I really want to proceed with this purchase. Can you hold this piece for me until the 1st? I will make an advance on the 1st as soon as my monthly salary credits. Thanks!',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#059669',
        title: 'Split Purchase into 3 Zero-Cost Parts (Keep Rent Safe)',
        description:
          'Split the cost into 3 monthly parts. Your monthly income easily covers each installment while keeping your untouchable hostel rent 100% safe.',
        upfrontPercent: 33,
        splitBatches: 3,
        hiddenCostBuffer: 6,
        paymentDelayDays: 5,
        negotiationMessage:
          'Hi, could we set up a 3-part monthly payment for this purchase? I can pay the first part today and the remaining two parts on the 1st of the next two months. This keeps both parties protected!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#d97706',
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
    story: 'Buy a ₹45,000 Camera/Editing Laptop while a client is delaying my ₹65,000 payment by 22 days.',
    balance: 42000,
    monthlyIncome: 0,
    lockedReserves: 15000,
    hiddenLeaks: 2800,
    creditScore: 660,
    incomeLabel: 'Pending Client Payment (₹65,000)',
    purchaseLabel: '₹45,000 Camera / Laptop',
    defaultDecisionCost: 45000,
    sliderLabels: {
      decisionCost: 'Camera/Gear Price (₹45,000)',
      paymentDelay: 'How Many Days Client Pays Late (22 Days)',
      upfrontPercent: 'Advance Money Paid by Client (25%)',
      hiddenCost: 'Extra Tax & App Fees (10%)',
      splitBatches: 'Pay in Monthly Parts (2)',
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
        id: 'irregular-income',
        title: 'Rollercoaster Income Cashflow',
        plainTitle: 'You Will Be Short by ₹14,500 on the 18th',
        metricLabel: 'Shortfall on Day 18',
        warningText: 'Because the client pays 22 days late, you will run out of cash and be short on the 18th of this month.',
        advice: 'Ask for a 40% advance payment before you begin the final editing work.',
        severity: 'critical',
      },
      {
        id: 'studio-rent-countdown',
        title: 'Studio Rent Due in 10 Days',
        plainTitle: 'Studio Rent & High-Speed WiFi Due First',
        metricLabel: '₹15,000 Due in 10 Days',
        warningText: 'Your studio rent of ₹15,000 is due in 10 days before the client pays. If you buy the gear today, you cannot pay rent.',
        advice: 'Keep ₹15,000 locked in your bank so you do not get locked out of your studio.',
        severity: 'critical',
      },
      {
        id: 'delayed-invoice-trap',
        title: '22-Day Client Delay Trap',
        plainTitle: 'Waiting 22 Days for Client to Transfer Cash',
        metricLabel: '22 Days of Zero Inflow',
        warningText: 'Waiting 22 days with zero incoming cash means any unexpected emergency forces you to borrow from relatives.',
        advice: 'Send a Razorpay instant payment link for 25% advance right now.',
        severity: 'warning',
      },
      {
        id: 'tax-tds-cut',
        title: '10% TDS Tax Cut by Client',
        plainTitle: 'Client Cuts 10% TDS (₹6,500 Withheld)',
        metricLabel: '₹6,500 Cut Before Pay',
        warningText: 'Companies legally cut 10% TDS tax before paying you, so you only get ₹58,500 in hand instead of ₹65,000.',
        advice: 'File your income tax return on ClearTax to claim the entire ₹6,500 refund back into your account.',
        severity: 'warning',
      },
      {
        id: 'unverified-upi',
        title: 'Fake or Delayed Payment Proof',
        plainTitle: 'Client Sent WhatsApp Payment Screenshot',
        metricLabel: '₹65,000 NOT in Bank Yet',
        warningText: 'Your client sent a WhatsApp payment screenshot, but the money has NOT entered your bank yet. Fake payment slips are very common!',
        advice: 'Never send high-res original project files until the money actually shows up inside your official bank balance.',
        severity: 'critical',
      },
      {
        id: 'freelancer-score',
        title: 'Freelancer Bank Trust Score (660)',
        plainTitle: 'Approval for Credit Cards & Loans',
        metricLabel: '660 / 850 Fair Trust',
        warningText: 'Banks do not give easy loans to freelancers without regular salary slips unless you keep a healthy balance.',
        advice: 'Keeping at least ₹15,000 in your bank at all times unlocks instant online loan and credit card approvals.',
        severity: 'warning',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#2563eb',
        title: 'Ask Client for 40% Advance (₹26,000) Before Final Delivery',
        description:
          'Do not hand over final clean files until the client pays 40% (₹26,000). This gives you immediate money to buy your gear with zero debt!',
        upfrontPercent: 40,
        splitBatches: 2,
        hiddenCostBuffer: 8,
        paymentDelayDays: 5,
        negotiationMessage:
          'Hi [Client Name], the project draft is complete and ready for final delivery! As per my standard freelancing terms, please release the 40% milestone payment (₹26,000) so I can hand over full high-res files within 2 hours. Thanks!',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#059669',
        title: 'Offer ₹1,000 Quick-Pay Discount to Get Paid Today',
        description:
          'Tell the client you will give them a flat ₹1,000 discount if they pay today. You get ₹64,000 immediately instead of waiting 22 painful days.',
        upfrontPercent: 100,
        splitBatches: 1,
        hiddenCostBuffer: 5,
        paymentDelayDays: 0,
        negotiationMessage:
          'Hi [Client Name], I am offering a quick ₹1,000 instant-settlement discount if the invoice is cleared via UPI/IMPS today (₹64,000 net). Let me know and I will send the updated bill right away!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#d97706',
        title: 'Rent the Camera for ₹3,500 This Weekend & Buy Later',
        description:
          'Rent the camera body and lens for this weekend shoot for only ₹3,500. Buy the full ₹45,000 gear after the client’s ₹65,000 enters your bank account.',
        upfrontPercent: 20,
        splitBatches: 2,
        hiddenCostBuffer: 4,
        paymentDelayDays: 10,
        negotiationMessage:
          'Hi [Camera Rental Store], I need to rent the camera body and 50mm lens for a 2-day client shoot this weekend (₹3,500 total). Please share pickup timing and deposit details. Thanks!',
      },
    ],
  },

  business: {
    type: 'business',
    label: 'Small Business Owner (T-Shirt Shop)',
    emoji: '🏪',
    story: 'Accept a ₹1,00,000 T-Shirt Order where making the shirts costs ₹60,000, delivery costs ₹5,000 extra, and ₹20,000 Staff Salaries & Shop Rent must be paid first.',
    balance: 50000,
    monthlyIncome: 0,
    lockedReserves: 20000,
    hiddenLeaks: 5000,
    creditScore: 685,
    incomeLabel: 'Buyer Order Payment (₹1,00,000)',
    purchaseLabel: '₹60,000 Making T-Shirts (Raw Material & Printing)',
    defaultDecisionCost: 60000,
    sliderLabels: {
      decisionCost: 'Cost to Make the T-Shirts (₹60,000)',
      paymentDelay: 'How Many Days Buyer Pays Late (25 Days)',
      upfrontPercent: 'Advance Taken from Buyer (15%)',
      hiddenCost: 'Extra Delivery & Packing Cost (₹5,000 / 8%)',
      splitBatches: 'Split Order into Batches (1 or 2)',
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
        title: 'Running Out of Cash to Pay Workers',
        plainTitle: 'You Need ₹85,000 but Only Have ₹50,000 in Bank!',
        metricLabel: '₹35,000 Cash Shortage Alert',
        warningText: 'You have ₹50,000 in the bank, but making the shirts (₹60,000) + delivery (₹5,000) + worker salaries & rent (₹20,000) needs ₹85,000—so you will run out of money and be short by ₹35,000!',
        advice: 'Demand a 45% buyer advance upfront (₹45,000) to buy cotton and ink without touching worker salary money.',
        severity: 'critical',
      },
      {
        id: 'worker-salary-lock',
        title: 'Staff Salaries & Shop Rent Floor',
        plainTitle: 'Tailor Wages & Shop Rent Due on the 1st',
        metricLabel: '₹20,000 100% Untouchable',
        warningText: 'Your 2 tailors and shop landlord must be paid on the 1st of next month. If you do not pay them, your shop shuts down.',
        advice: 'Keep ₹20,000 locked in a separate bank account so production never stops.',
        severity: 'critical',
      },
      {
        id: 'repeat-late-buyer',
        title: 'Buyer Pays Late Every Single Time',
        plainTitle: 'This Buyer Paid 18 Days Late on Last 3 Orders',
        metricLabel: 'High Late Payment Danger',
        warningText: 'This wholesale buyer delayed paying you by 18 days on their last 3 orders. Do not trust verbal promises that they will pay on time.',
        advice: 'Do not put the shirts on the delivery tempo until the buyer shows a verified bank UTR number.',
        severity: 'critical',
      },
      {
        id: 'hidden-freight',
        title: 'Surprise Delivery & Packing Charges',
        plainTitle: 'Transporter Charges ₹5,000 Extra for Boxes',
        metricLabel: '₹5,000 Unplanned Delivery Cost',
        warningText: 'Transporters and parcel companies charge an extra ₹5,000 for heavy boxes and loading fees that you forgot to quote to the buyer.',
        advice: 'Add ₹5,000 delivery and packing charges clearly as a separate line on your invoice.',
        severity: 'warning',
      },
      {
        id: 'trade-credit',
        title: 'Cloth Supplier Credit Rating (685)',
        plainTitle: '14-Day Free Credit on Cotton Yarn',
        metricLabel: '685 / 850 Good Trade Rating',
        warningText: 'Cloth mills will give you 14 days of free credit to buy fabric if you always keep a clean bank balance.',
        advice: 'Pay the mill 25% down to get ₹40,000 in raw fabric today without paying full cash.',
        severity: 'safe',
      },
      {
        id: 'single-batch-risk',
        title: 'Sending All 1,000 Shirts in One Go',
        plainTitle: '100% Risk on a Single Delivery Truck',
        metricLabel: '100% Risk in 1 Shipment',
        warningText: 'If you send all 1,000 shirts in one delivery, the buyer can delay paying you for the entire ₹1,00,000 order.',
        advice: 'Split into 2 deliveries of 500 shirts: get paid for Batch 1 first before starting Batch 2.',
        severity: 'warning',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Plan A',
        tagColor: '#059669',
        title: 'Ask Buyer for 45% Advance (₹45,000) to Buy Fabric',
        description:
          'Get ₹45,000 advance from the buyer before printing a single shirt. Completely wipes out your ₹35,000 shortage and keeps tailor wages 100% safe!',
        upfrontPercent: 45,
        splitBatches: 1,
        hiddenCostBuffer: 8,
        paymentDelayDays: 10,
        negotiationMessage:
          'Dear [Buyer Name], thank you for the 1,000 pcs t-shirt order (₹1,00,000). To book premium combed cotton and printing slots, we require our standard 45% production advance (₹45,000). Remaining on delivery. Please approve so we can start dyeing today!',
      },
      {
        id: 'planB',
        tag: 'Plan B',
        tagColor: '#2563eb',
        title: 'Split Order into 2 Batches (Deliver 500 Shirts First)',
        description:
          'Deliver 500 shirts first, collect cash on delivery, and use that money to make the next 500 shirts without taking any loans!',
        upfrontPercent: 25,
        splitBatches: 2,
        hiddenCostBuffer: 8,
        paymentDelayDays: 15,
        negotiationMessage:
          'Hi [Buyer Name], to get shirts into your store faster, we propose delivering in 2 batches: 500 shirts this Friday (payment on delivery), and the remaining 500 shirts next week. This gets merchandise onto your shelves 5 days earlier!',
      },
      {
        id: 'planC',
        tag: 'Plan C',
        tagColor: '#d97706',
        title: 'Take 25% Advance + Get 14 Days Credit from Cloth Mill',
        description:
          'Collect ₹25,000 advance from the buyer and tell your cotton cloth supplier you will pay them the balance in 14 days after the buyer pays you.',
        upfrontPercent: 25,
        splitBatches: 2,
        hiddenCostBuffer: 6,
        paymentDelayDays: 5,
        negotiationMessage:
          'Respected [Cloth Mill Supplier], we are buying ₹40,000 in cotton fabric today for a confirmed corporate order. We will pay 25% today and the balance in 14 days. Thank you for your continued partnership!',
      },
    ],
  },

  enterprise: {
    type: 'enterprise',
    label: 'Enterprise Megaproject Treasury ($2.4B / ₹20,000 Cr Scale)',
    emoji: '🏛️',
    story: 'Global High-Speed Rail & Semiconductor Fab EPC Contract — Contract Value: $2.40 Billion (₹20,000 Cr)',
    balance: 850000000,
    monthlyIncome: 180000000,
    lockedReserves: 420000000,
    hiddenLeaks: 130000000,
    creditScore: 840,
    incomeLabel: 'Sovereign Milestone Inflows ($600M / ₹5,040 Cr)',
    purchaseLabel: 'Global High-Speed Rail & Semiconductor Fab EPC Contract ($2.40B / ₹20,000 Cr)',
    defaultDecisionCost: 1450000000,
    sliderLabels: {
      decisionCost: 'CapEx & Supplier Execution Cost ($1.45B / ₹12,180 Cr)',
      paymentDelay: 'Sovereign Milestone SLA Audit Delay (48 Days)',
      upfrontPercent: 'Client Mobilization Advance Received (15%)',
      hiddenCost: 'Unhedged FX, Steel Escalation & LD Penalties (9% / $130M)',
      splitBatches: 'Progressive EPC Milestone Tranches (1 to 6)',
    },
    theme: {
      name: 'Platinum Sovereign & Imperial Blue',
      meshClass: 'from-[#020b1e] via-[#091a3c] to-[#041228]',
      orb1: 'rgba(59, 130, 246, 0.40)',
      orb2: 'rgba(99, 102, 241, 0.30)',
      orb3: 'rgba(14, 165, 233, 0.35)',
      accentBorder: 'border-blue-400/50 hover:border-cyan-300',
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-500/10',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      buttonGradient: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 50%, #0f172a 100%)',
      primaryHex: '#3b82f6',
    },
    riskCards: [
      {
        id: 'treasury-waterfall',
        title: 'Multi-Currency Treasury Cash-Flow Waterfall',
        plainTitle: 'SAP S/4HANA & Oracle NetSuite Treasury Deficit',
        metricLabel: '-$340M (-₹2,856 Cr) Working-Capital Deficit',
        warningText: 'Multi-bank cash pool across JPMorgan, Citi & SBI Corporate plunges into a -$340M deficit on Day 42 before the $600M sovereign tranche arrives.',
        advice: 'Shows daily liquidity across ERP subsidiaries and highlights the exact -$340M (-₹2,856 Cr) deficit window.',
        severity: 'critical',
      },
      {
        id: 'debt-covenant-lock',
        title: 'Debt Covenant & DSCR Protection Lock',
        plainTitle: 'Senior Debt Service & 40,000-Staff Payroll Floor',
        metricLabel: '$420M (₹3,528 Cr) 100% Locked Floor',
        warningText: '$420M is legally ring-fenced for Senior Bond Coupon payments, 40,000 global employee payroll, and maintaining the mandatory 1.35x DSCR bank covenant.',
        advice: 'Breaching this floor triggers immediate loan acceleration, credit rating downgrade to junk status, and cross-default clauses.',
        severity: 'critical',
      },
      {
        id: 'sovereign-sla-lag',
        title: 'Counterparty Credit & Sovereign SLA Lag Analysis',
        plainTitle: '48-Day Sovereign Milestone Audit & Customs Lag',
        metricLabel: '48 Days Audit Sign-Off Lag',
        warningText: 'Historical EPC data reveals a 48-day lag on sovereign tranche sign-offs due to multi-ministry engineering audits and import customs clearance.',
        advice: 'Reviews buyer credit default swap (CDS) spread and negotiates irrevocable standby Letters of Credit (LC).',
        severity: 'critical',
      },
      {
        id: 'macro-fx-escalation',
        title: 'Macro FX, Commodity & Liquidated Damages (LD) Discovery',
        plainTitle: 'Unhedged FX Swings, Steel Inflation & 0.5%/wk LDs',
        metricLabel: '$130M (₹1,092 Cr) Contract Leaks',
        warningText: 'Flags $48M unhedged FX currency exposure, $52M Tier-2 supplier price escalation, and $30M Liquidated Damages penalty clauses in 400-page RFP.',
        advice: 'Lock 80% FX forward currency hedges and index commodity purchases to London Metal Exchange (LME) contracts.',
        severity: 'warning',
      },
      {
        id: 'enterprise-wire-swift',
        title: 'Enterprise Wire, SWIFT LC & ERP 3-Way Match Forensics',
        plainTitle: 'SWIFT MT700 LC & Multi-Million Invoice Match',
        metricLabel: 'SWIFT MT700 & ERP Match',
        warningText: 'Scans 400-page EPC contracts, SWIFT MT700 Letters of Credit, and supplier invoices to catch shell-company billing and IBAN spoofing.',
        advice: 'Requires cryptographic multi-sig authorization and automated ERP 3-way match before releasing multi-million dollar wires.',
        severity: 'safe',
      },
      {
        id: 'monte-carlo-stress',
        title: 'Monte Carlo Macro Stress-Tester',
        plainTitle: '10,000 Scenario Quantitative Stress Test',
        metricLabel: '99.2% Value at Risk (VaR)',
        warningText: 'Simulates 10,000 macro economic shocks: +5% currency devaluation, +60 day sovereign delay, and +12% commodity price surge.',
        advice: 'One-click shock buttons simulate [FX Shock +5%], [Sovereign Delay +60 Days], and [Steel/Chip Spike +12%].',
        severity: 'critical',
      },
    ],
    rescuePlans: [
      {
        id: 'planA',
        tag: 'Strategy A',
        tagColor: '#2563eb',
        title: '22% Mobilization Advance + 6-Tranche Progressive EPC Milestone Escrow',
        description:
          'Unlocks $528M (₹4,435 Cr) upfront against a Bank Guarantee and splits execution into 6 self-funding milestone tranches instead of a massive upfront CapEx burn.',
        upfrontPercent: 22,
        splitBatches: 6,
        hiddenCostBuffer: 3,
        paymentDelayDays: 10,
        negotiationMessage:
          'Pursuant to EPC Clause 14.2, Contractor requests execution of the 22% Mobilization Advance ($528,000,000) against an irrevocable Bank Guarantee, with remaining CapEx allocated across 6 progressive milestone escrow accounts.',
      },
      {
        id: 'planB',
        tag: 'Strategy B',
        tagColor: '#059669',
        title: 'Supply-Chain Reverse Factoring & Syndicated Letter of Credit (LC) Discounting',
        description:
          'Extends $450M of Tier-1 vendor payables by 60 days using bank-backed Letters of Credit (at SOFR + 110 bps) and discounts approved milestone invoices via institutional trade finance.',
        upfrontPercent: 18,
        splitBatches: 4,
        hiddenCostBuffer: 4,
        paymentDelayDays: 14,
        negotiationMessage:
          'Contractor proposes structured reverse factoring facility for Tier-1 engineering vendors under existing corporate credit lines, extending payables by 60 days while providing suppliers immediate non-recourse liquidity.',
      },
      {
        id: 'planC',
        tag: 'Strategy C',
        tagColor: '#d97706',
        title: '80% FX Forward Currency Hedge + Revolving Credit Facility (RCF) Liquidity Bridge',
        description:
          'Locks USD/INR and EUR/USD forward rates to eliminate $48M FX loss and activates a $250M syndicated RCF bridge for 28 days, keeping Senior Debt DSCR safely at 1.48x.',
        upfrontPercent: 20,
        splitBatches: 3,
        hiddenCostBuffer: 2,
        paymentDelayDays: 12,
        negotiationMessage:
          'Treasury mandate approved: Execution of ISDA master forward contracts hedging 80% of cross-border procurement currency exposure, supplemented by a 28-day syndicated Revolving Credit Facility drawdown.',
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

// Smart Goal Text & Amount Parser (handles "1.5 lakh", "80k", "₹80,000", "2 months", "45 days")
export function parseGoalTextAndAmount(
  rawText: string,
  customCost?: number,
  customDays?: number,
  personaType: PersonaType = 'salaried'
): { title: string; cost: number; days: number; category: string } {
  let cost = customCost && customCost > 0 ? customCost : 0
  let days = customDays && customDays > 0 ? customDays : 0
  const text = (rawText || '').trim()

  // 1. Amount parsing if not directly provided
  if (!cost) {
    // Check for "X billion" or "X b"
    const billionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:billion|b)\b/i)
    if (billionMatch) {
      cost = Math.round(parseFloat(billionMatch[1]) * 1_000_000_000)
    } else {
      // Check for "X crore" or "X cr" (converted to USD baseline for enterprise math)
      const crMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr)\b/i)
      if (crMatch) {
        cost = Math.round((parseFloat(crMatch[1]) * 10_000_000) / 84)
      } else {
        // Check for "X.Y lakh" or "X lakh" or "X lac"
        const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/i)
        if (lakhMatch) {
          cost = Math.round(parseFloat(lakhMatch[1]) * 100000)
        } else {
          // Check for "Xk" e.g. "80k", "55k"
          const kMatch = text.match(/(\d+(?:\.\d+)?)\s*k\b/i)
          if (kMatch) {
            cost = Math.round(parseFloat(kMatch[1]) * 1000)
          } else {
            // Check for numbers with commas or Rupee symbols e.g. "₹80,000", "80,000", "80000"
            const rupeeMatch = text.match(/(?:₹|rs\.?|inr|\$)?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i)
            if (rupeeMatch) {
              cost = parseInt(rupeeMatch[1].replace(/,/g, ''), 10)
            } else {
              // General number match
              const anyNum = text.replace(/,/g, '').match(/\b(\d+)\b/)
              if (anyNum) {
                const val = parseInt(anyNum[1], 10)
                if (val >= 1000) cost = val
                else if (val > 0 && val < 500) cost = val * 1000
              }
            }
          }
        }
      }
    }
  }

  // Fallback defaults per persona if still 0
  if (!cost || cost <= 0) {
    cost =
      personaType === 'enterprise'
        ? 1450000000
        : personaType === 'business'
        ? 100000
        : personaType === 'freelancer'
        ? 45000
        : 50000
  }

  // 2. Timeline parsing if not directly provided
  if (!days) {
    const monthMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:month|months|mo)\b/i)
    if (monthMatch) {
      days = Math.round(parseFloat(monthMatch[1]) * 30)
    } else {
      const weekMatch = text.match(/(\d+)\s*(?:week|weeks|wk)\b/i)
      if (weekMatch) {
        days = parseInt(weekMatch[1], 10) * 7
      } else {
        const dayMatch = text.match(/(\d+)\s*(?:day|days|d)\b/i)
        if (dayMatch) {
          days = parseInt(dayMatch[1], 10)
        }
      }
    }
  }

  if (!days || days <= 0) {
    days =
      personaType === 'enterprise'
        ? 48
        : personaType === 'business'
        ? 25
        : personaType === 'freelancer'
        ? 22
        : 8
  }

  // 3. Category inference
  const lower = text.toLowerCase()
  let category = 'general'
  if (lower.includes('rail') || lower.includes('epc') || lower.includes('megaproject') || lower.includes('contract') || lower.includes('infrastructure')) {
    category = 'enterprise'
  } else if (lower.includes('laptop') || lower.includes('phone') || lower.includes('camera') || lower.includes('pc') || lower.includes('macbook')) {
    category = 'tech'
  } else if (lower.includes('bike') || lower.includes('scooter') || lower.includes('car')) {
    category = 'vehicle'
  } else if (lower.includes('shirt') || lower.includes('order') || lower.includes('stock') || lower.includes('material')) {
    category = 'business'
  } else if (lower.includes('rent') || lower.includes('fee') || lower.includes('emergency')) {
    category = 'survival'
  }

  const cleanTitle =
    text ||
    (personaType === 'enterprise'
      ? 'Global High-Speed Rail & Semiconductor Fab EPC Contract ($2.40B / ₹20,000 Cr)'
      : personaType === 'business'
      ? '₹1,00,000 Corporate Order'
      : personaType === 'freelancer'
      ? '₹45,000 Camera Gear'
      : `₹${cost.toLocaleString('en-IN')} Laptop / Bike`)

  return { title: cleanTitle, cost, days, category }
}

interface AppContextType {
  themeMode: ThemeMode
  toggleThemeMode: () => void
  lang: Language
  setLang: (l: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  persona: PersonaType
  setPersona: (p: PersonaType, preserveActiveCost?: boolean) => void
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
  completeOnboarding: (
    name: string,
    monthlyIncome: number,
    selectedPersona: PersonaType,
    customGoalTitle?: string,
    customGoalCost?: number,
    customGoalDays?: number
  ) => void
  resetOnboardingDemo: () => void
  getSavedUserByIdentifier: (identifier: string) => SavedUserProfile | null
  userGoal: UserGoal
  updateUserGoal: (goal: Partial<UserGoal>) => void
  applyUserGoalToEntireApp: (rawGoalText: string, customCost?: number, customDays?: number) => void
  decisionCost: number
  decisionTitle: string
  delayDays: number
  paymentDelayDays: number
  enterpriseCurrencyUnit: EnterpriseCurrencyUnit
  setEnterpriseCurrencyUnit: (unit: EnterpriseCurrencyUnit) => void
  toggleEnterpriseCurrencyUnit: () => void
  formatMoney: (amount: number, customPersona?: PersonaType) => string
}

const DEFAULT_SIMULATOR: SimulatorState = {
  decisionCost: 50000,
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

  // Sync themeMode with HTML document element
  useEffect(() => {
    try {
      if (themeMode === 'light') {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      }
      document.documentElement.setAttribute('data-theme', themeMode)
    } catch {
      // ignore
    }
  }, [themeMode])

  // Multi-Language i18n State
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('finvexa_lang') as Language
      if (saved && ['en', 'hi', 'kn', 'te'].includes(saved)) return saved
    } catch {
      // ignore
    }
    return 'en'
  })

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    try {
      localStorage.setItem('finvexa_lang', l)
      document.documentElement.setAttribute('data-lang', l)
      document.documentElement.setAttribute('lang', l)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-lang', lang)
      document.documentElement.setAttribute('lang', lang)
    } catch {
      // ignore
    }
  }, [lang])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(lang, key, params)
    },
    [lang]
  )

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

  const [simulator, setSimulatorState] = useState<SimulatorState>(() => {
    try {
      const saved = localStorage.getItem('finvexa_simulator_state')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return DEFAULT_SIMULATOR
  })

  // Goal Strategy State
  const [userGoal, setUserGoalState] = useState<UserGoal>(() => {
    try {
      const saved = localStorage.getItem('finvexa_user_goal')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    const savedSimRaw = (() => {
      try {
        return localStorage.getItem('finvexa_simulator_state')
      } catch {
        return null
      }
    })()
    const savedCost = savedSimRaw ? JSON.parse(savedSimRaw).decisionCost || 50000 : 50000
    return {
      title: `Buy a ₹${savedCost.toLocaleString('en-IN')} laptop in 2 months`,
      targetAmount: savedCost,
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

    if (newGoal.targetAmount !== undefined) {
      setSimulatorState(prev => {
        const next = { ...prev, decisionCost: newGoal.targetAmount! }
        try {
          localStorage.setItem('finvexa_simulator_state', JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    }
  }, [])

  const applyUserGoalToEntireApp = useCallback(
    (rawGoalText: string, customCost?: number, customDays?: number) => {
      const parsed = parseGoalTextAndAmount(rawGoalText, customCost, customDays, persona)

      const updatedGoal: UserGoal = {
        title: parsed.title,
        targetAmount: parsed.cost,
        targetMonths: Math.max(1, Math.round(parsed.days / 30)),
        category: parsed.category,
        downpaymentPercent: simulator.upfrontPercent,
      }

      setUserGoalState(updatedGoal)
      try {
        localStorage.setItem('finvexa_user_goal', JSON.stringify(updatedGoal))
      } catch {
        // ignore
      }

      setSimulatorState(prev => {
        const nextSim: SimulatorState = {
          ...prev,
          decisionCost: parsed.cost,
          paymentDelayDays: parsed.days,
        }
        try {
          localStorage.setItem('finvexa_simulator_state', JSON.stringify(nextSim))
        } catch {
          // ignore
        }
        return nextSim
      })
    },
    [persona, simulator.upfrontPercent]
  )

  // Enterprise Currency Display Unit (Dual: $ & ₹, USD only, INR Crores only)
  const [enterpriseCurrencyUnit, setEnterpriseCurrencyUnitState] = useState<EnterpriseCurrencyUnit>(() => {
    try {
      const saved = localStorage.getItem('finvexa_enterprise_unit') as EnterpriseCurrencyUnit
      if (saved === 'dual' || saved === 'usd' || saved === 'inr') return saved
    } catch {
      // ignore
    }
    return 'dual'
  })

  const setEnterpriseCurrencyUnit = useCallback((unit: EnterpriseCurrencyUnit) => {
    setEnterpriseCurrencyUnitState(unit)
    try {
      localStorage.setItem('finvexa_enterprise_unit', unit)
    } catch {
      // ignore
    }
  }, [])

  const toggleEnterpriseCurrencyUnit = useCallback(() => {
    setEnterpriseCurrencyUnitState(prev => {
      const next: EnterpriseCurrencyUnit = prev === 'dual' ? 'usd' : prev === 'usd' ? 'inr' : 'dual'
      try {
        localStorage.setItem('finvexa_enterprise_unit', next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const setPersona = useCallback(
    (p: PersonaType, preserveActiveCost = false) => {
      setPersonaState(p)
      const nextCost =
        preserveActiveCost && simulator.decisionCost
          ? simulator.decisionCost
          : p === 'salaried'
          ? (simulator.decisionCost && simulator.decisionCost < 1_000_000 ? simulator.decisionCost : 50000)
          : p === 'freelancer'
          ? (simulator.decisionCost && simulator.decisionCost < 1_000_000 ? simulator.decisionCost : 45000)
          : p === 'business'
          ? (simulator.decisionCost && simulator.decisionCost < 100_000_000 ? simulator.decisionCost : 60000)
          : 1450000000 // Enterprise CapEx $1.45B
      const nextDays = p === 'salaried' ? 8 : p === 'freelancer' ? 22 : p === 'business' ? 25 : 48
      const nextSim: SimulatorState = {
        decisionCost: nextCost,
        paymentDelayDays: nextDays,
        upfrontPercent: p === 'enterprise' ? 15 : p === 'business' ? 15 : p === 'freelancer' ? 25 : 30,
        hiddenCostBuffer: p === 'enterprise' ? 9 : p === 'freelancer' ? 10 : 8,
        splitBatches: p === 'enterprise' ? 1 : p === 'business' ? 1 : 2,
      }
      setSimulatorState(nextSim)
      try {
        localStorage.setItem('finvexa_simulator_state', JSON.stringify(nextSim))
      } catch {
        // ignore
      }

      if (p === 'enterprise') {
        const entGoal: UserGoal = {
          title: 'Global High-Speed Rail & Semiconductor Fab EPC Contract ($2.40B / ₹20,000 Cr)',
          targetAmount: 1450000000,
          targetMonths: 12,
          category: 'enterprise',
          downpaymentPercent: 15,
        }
        setUserGoalState(entGoal)
        try {
          localStorage.setItem('finvexa_user_goal', JSON.stringify(entGoal))
        } catch {
          // ignore
        }
      }

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
    },
    [simulator.decisionCost]
  )

  const setSimulator = useCallback((s: Partial<SimulatorState>) => {
    setSimulatorState(prev => {
      const next = { ...prev, ...s }
      try {
        localStorage.setItem('finvexa_simulator_state', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })

    // Immediately propagate updated decisionCost to userGoal so the exact rupee number is synchronized everywhere
    if (s.decisionCost !== undefined) {
      setUserGoalState(prevGoal => {
        const updated = {
          ...prevGoal,
          targetAmount: s.decisionCost!,
        }
        try {
          localStorage.setItem('finvexa_user_goal', JSON.stringify(updated))
        } catch {
          // ignore
        }
        return updated
      })
    }
  }, [])

  // Dynamic personaData customized live with the active goal title & rupee figures
  const dynamicPersonaData = useMemo<PersonaData>(() => {
    const base = PERSONAS[persona]
    const currentCost = simulator.decisionCost || base.defaultDecisionCost
    const currentDays = simulator.paymentDelayDays || (persona === 'salaried' ? 8 : persona === 'freelancer' ? 22 : persona === 'business' ? 25 : 48)
    const goalName = userGoal.title || base.purchaseLabel

    if (persona === 'enterprise') {
      return {
        ...base,
        story: userGoal.title || base.story,
        purchaseLabel: userGoal.title || base.purchaseLabel,
        defaultDecisionCost: currentCost,
        sliderLabels: {
          ...base.sliderLabels,
          decisionCost: `CapEx Execution Cost (${formatMoney(currentCost, 'enterprise', enterpriseCurrencyUnit)})`,
          paymentDelay: `Sovereign Milestone SLA Delay (${currentDays} Days)`,
        },
        riskCards: base.riskCards.map((rc, idx) => ({
          ...rc,
          checkNumber: idx + 1,
        })),
        rescuePlans: base.rescuePlans,
      }
    }

    // Team Pitch Table 6 Core Checks mapping (Simple 8th-Grade Words)
    const pitchTableChecks = [
      {
        num: 1,
        title: 'Cash-Flow Prediction',
        question: 'Will you run out of money while doing the work?',
        explanation:
          'Shows exactly when and how much money will be short by comparing when you spend vs. when money arrives.',
      },
      {
        num: 2,
        title: 'Commitment Protection (Home Loan, Salaries & Rent)',
        question: 'Will money still be available for other needs?',
        explanation:
          'Locks and protects upcoming Home Loan EMIs, Staff Salaries, Rent, and college fees first.',
      },
      {
        num: 3,
        title: 'Customer & Incoming Payment Analysis',
        question: 'How reliable are your incoming payments?',
        explanation:
          'Checks past payment history and delays to tell you the exact advance % to ask for.',
      },
      {
        num: 4,
        title: 'Hidden-Cost Discovery',
        question: 'Did you forget any costs?',
        explanation:
          'Catches extra delivery charges, packaging fees, 1 AM food surge fees, and forgotten auto-debit subscriptions.',
      },
      {
        num: 5,
        title: 'Suspicious-Record & Fraud Alerts',
        question: 'Does anything look suspicious?',
        explanation:
          'Flags fake payment screenshots, repeated duplicate bills, or changed bank details for verification.',
      },
      {
        num: 6,
        title: 'Risk & Scenario Analysis',
        question: "What if things don't go as planned?",
        explanation:
          'Tests late payments, rising costs, or multiple expenses arriving together and compares safe options.',
      },
    ]

    // Dynamically update risk cards with user's exact numbers & goal name
    const customRiskCards = base.riskCards.map((rc, idx) => {
      const checkInfo = pitchTableChecks[idx] || pitchTableChecks[0]
      let wText = rc.warningText
      let mLabel = rc.metricLabel
      let pTitle = rc.plainTitle
      const advice = rc.advice

      if (persona === 'freelancer') {
        if (rc.id === 'unverified-upi') {
          mLabel = `₹${Math.round(currentCost * 1.3).toLocaleString('en-IN')} NOT in Bank Yet`
          wText = `Your client sent a WhatsApp payment screenshot for ₹${Math.round(currentCost * 1.3).toLocaleString('en-IN')}, but the money has NOT entered your bank yet.`
        } else if (rc.id === 'irregular-income') {
          const shortageAmt = Math.max(0, currentCost - (base.balance - base.lockedReserves))
          pTitle = `You Will Be Short by ₹${shortageAmt.toLocaleString('en-IN')} on Day ${Math.min(currentDays, 25)}`
          wText = `Because the client pays ${currentDays} days late, buying "${goalName}" (₹${currentCost.toLocaleString('en-IN')}) causes a ₹${shortageAmt.toLocaleString('en-IN')} cash squeeze.`
        }
      } else if (persona === 'business') {
        if (rc.id === 'cash-shortage-trap') {
          const shortageAmt = Math.max(0, currentCost + 25000 - base.balance)
          pTitle = `Needs ₹${(currentCost + 25000).toLocaleString('en-IN')} but Only Have ₹${base.balance.toLocaleString('en-IN')} in Bank!`
          mLabel = `₹${shortageAmt.toLocaleString('en-IN')} Cash Shortage Alert`
          wText = `Making costs (₹${currentCost.toLocaleString('en-IN')}) + delivery (₹5,000) + worker salaries & rent (₹20,000) needs ₹${(currentCost + 25000).toLocaleString('en-IN')}—so you will run out of money and be short by ₹${shortageAmt.toLocaleString('en-IN')}!`
        }
      } else {
        if (rc.id === 'rent-lock') {
          wText = `₹${base.lockedReserves.toLocaleString('en-IN')} is strictly locked for hostel rent. Buying "${goalName}" for ₹${currentCost.toLocaleString('en-IN')} must not touch this floor.`
        } else if (rc.id === 'salary-delay-shock') {
          wText = `If your salary or allowance is delayed by ${currentDays} days, buying "${goalName}" (₹${currentCost.toLocaleString('en-IN')}) leaves you very close to your rent floor.`
        }
      }

      return {
        ...rc,
        checkNumber: checkInfo.num,
        pitchTitle: checkInfo.title,
        pitchQuestion: checkInfo.question,
        pitchExplanation: checkInfo.explanation,
        warningText: wText,
        metricLabel: mLabel,
        plainTitle: pTitle,
        advice,
      }
    })

    // Dynamically update rescue plans with user's exact numbers & goal name
    const customRescuePlans = base.rescuePlans.map((rp, idx) => {
      let title = rp.title
      let desc = rp.description
      let msg = rp.negotiationMessage

      if (idx === 0) {
        const advPct = persona === 'business' ? 45 : 40
        const advAmt = Math.round(currentCost * (advPct / 100))
        title = `Ask for ${advPct}% Advance (₹${advAmt.toLocaleString('en-IN')}) Upfront`
        desc = `Secure ₹${advAmt.toLocaleString('en-IN')} advance before committing to "${goalName}". Wipes out cash squeeze and protects your rent/salaries!`
        msg = `Hi, to proceed with the "${goalName}" (₹${currentCost.toLocaleString('en-IN')}), our standard policy is a ${advPct}% advance (₹${advAmt.toLocaleString('en-IN')}). Please approve so we can start immediately!`
      } else if (idx === 1) {
        const parts = persona === 'salaried' ? 3 : 2
        const partAmt = Math.round(currentCost / parts)
        title = `Split "${goalName}" into ${parts} Parts (₹${partAmt.toLocaleString('en-IN')} Each)`
        desc = `Split ₹${currentCost.toLocaleString('en-IN')} into ${parts} monthly parts of ₹${partAmt.toLocaleString('en-IN')}. Keeps cashflow positive with zero loans.`
        msg = `Hi, could we set up a ${parts}-part payment for the ₹${currentCost.toLocaleString('en-IN')} "${goalName}"? I can pay ₹${partAmt.toLocaleString('en-IN')} upfront and the balance in ${parts - 1} installments.`
      } else if (idx === 2) {
        const downAmt = Math.round(currentCost * 0.25)
        title = `Pay 25% Down (₹${downAmt.toLocaleString('en-IN')}) + Balance on Delivery`
        desc = `Pay ₹${downAmt.toLocaleString('en-IN')} down today and schedule balance settlement after ${currentDays} days.`
        msg = `Hi! I am ready to pay ₹${downAmt.toLocaleString('en-IN')} (25% downpayment) today for "${goalName}". Can we settle the balance upon delivery in ${currentDays} days?`
      }

      return {
        ...rp,
        title,
        description: desc,
        negotiationMessage: msg,
      }
    })

    return {
      ...base,
      story: `Goal: "${goalName}" for ₹${currentCost.toLocaleString('en-IN')} (${currentDays} days timeline)`,
      purchaseLabel: `₹${currentCost.toLocaleString('en-IN')} ${goalName}`,
      defaultDecisionCost: currentCost,
      sliderLabels: {
        ...base.sliderLabels,
        decisionCost: `${goalName} Price (₹${currentCost.toLocaleString('en-IN')})`,
        paymentDelay:
          persona === 'salaried'
            ? `Salary / Allowance Delay (${currentDays} Days)`
            : persona === 'freelancer'
            ? `How Many Days Client Pays Late (${currentDays} Days)`
            : `How Many Days Buyer Pays Late (${currentDays} Days)`,
      },
      riskCards: customRiskCards,
      rescuePlans: customRescuePlans,
    }
  }, [persona, simulator.decisionCost, simulator.paymentDelayDays, userGoal.title, enterpriseCurrencyUnit])

  const appFormatMoney = useCallback(
    (amount: number, customPersona?: PersonaType) => {
      return formatMoney(amount, customPersona || persona, enterpriseCurrencyUnit)
    },
    [persona, enterpriseCurrencyUnit]
  )


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
  const completeOnboarding = useCallback(
    (
      name: string,
      monthlyIncome: number,
      selectedPersona: PersonaType,
      customGoalTitle?: string,
      customGoalCost?: number,
      customGoalDays?: number
    ) => {
      setPersonaState(selectedPersona)
      setIsOnboardingDone(true)

      const costToUse = customGoalCost || simulator.decisionCost || 50000
      const daysToUse = customGoalDays || simulator.paymentDelayDays || 15
      const titleToUse =
        customGoalTitle || (userGoal.title ? userGoal.title : `₹${costToUse.toLocaleString('en-IN')} Goal`)

      const updatedGoal: UserGoal = {
        title: titleToUse,
        targetAmount: costToUse,
        targetMonths: Math.max(1, Math.round(daysToUse / 30)),
        category: 'general',
        downpaymentPercent: 30,
      }
      setUserGoalState(updatedGoal)
      try {
        localStorage.setItem('finvexa_user_goal', JSON.stringify(updatedGoal))
      } catch {
        // ignore
      }

      const nextSim: SimulatorState = {
        decisionCost: costToUse,
        paymentDelayDays: daysToUse,
        upfrontPercent: selectedPersona === 'business' ? 15 : selectedPersona === 'freelancer' ? 25 : 30,
        hiddenCostBuffer: selectedPersona === 'freelancer' ? 10 : 8,
        splitBatches: selectedPersona === 'business' ? 1 : 2,
      }
      setSimulatorState(nextSim)
      try {
        localStorage.setItem('finvexa_simulator_state', JSON.stringify(nextSim))
      } catch {
        // ignore
      }

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
    },
    [simulator.decisionCost, simulator.paymentDelayDays, userGoal.title, bankConsent]
  )

  // Demo Login (One-click judge demo)
  const demoLogin = useCallback(() => {
    const demoJudge: AuthUser = {
      id: 'demo-judge-001',
      email: 'judge@finvexa.ai',
      name: 'Demo Judge',
      monthlyIncome: 45000,
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
        lang,
        setLang,
        t,
        persona,
        setPersona,
        personaData: dynamicPersonaData,
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
        applyUserGoalToEntireApp,
        decisionCost: simulator.decisionCost,
        decisionTitle: userGoal.title || dynamicPersonaData.purchaseLabel,
        delayDays: simulator.paymentDelayDays,
        paymentDelayDays: simulator.paymentDelayDays,
        enterpriseCurrencyUnit,
        setEnterpriseCurrencyUnit,
        toggleEnterpriseCurrencyUnit,
        formatMoney: appFormatMoney,
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

export const useAppContext = useApp
