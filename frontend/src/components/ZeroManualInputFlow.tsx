import { useState, useId, useRef } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sliders,
  Check,
  Copy,
} from 'lucide-react'

export type PresetKey = 'tshirt' | 'freelancer' | 'laptop'
export type FixKey = 'advance' | 'batch' | 'credit'

interface PresetConfig {
  id: PresetKey
  name: string
  tag: string
  cost: number
  costLabel: string
  startingBalance: number
  lockedReserves: number
  delayDays: number
  upfrontPercent: number
  hiddenCostBuffer: number
  splitBatches: number
  expectedProfit: number
  shortageAmount: number
  crashDay: number
  checks: {
    title: string
    detail: string
    badge: string
    severity: 'danger' | 'warning' | 'safe'
    tagline: string
  }[]
  fixes: {
    id: FixKey
    title: string
    metric: string
    howItWorks: string
    advancePercent: number
    batches: number
    delayAdjust: number
  }[]
}

const PRESETS: Record<PresetKey, PresetConfig> = {
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Shop: ₹1,00,000 Order',
    tag: '🏪 Small Business (Default)',
    cost: 100000,
    costLabel: '₹1,00,000 (1,000 Custom Corporate T-Shirts)',
    startingBalance: 40000,
    lockedReserves: 20000,
    delayDays: 25,
    upfrontPercent: 10,
    hiddenCostBuffer: 8,
    splitBatches: 1,
    expectedProfit: 35000,
    shortageAmount: 35000,
    crashDay: 18,
    checks: [
      {
        title: 'Vendor Bank/IFSC Swap Check',
        detail: "🚨 Warning: Invoice from 'Apex Fabrics' shows a changed bank account (XXXX8820) compared to your last 5 paid bills (XXXX4491). Verify before paying!",
        badge: '🚨 BANK SWAP DETECTED',
        severity: 'danger',
        tagline: 'Cross-checked against your exported 12-month CSV ledger (Zero Bank API needed)',
      },
      {
        title: 'Duplicate Bill Check',
        detail: '⚠️ Invoice #INV-204 matches an existing paid entry in your CSV ledger dated 12 Oct.',
        badge: '⚠️ DUPLICATE ENTRY',
        severity: 'warning',
        tagline: 'Flags accidental double payments without requiring bank server access',
      },
      {
        title: 'Fake Screenshot / UTR Check',
        detail: 'Screenshot UTR 429811004912 is NOT found in your downloaded bank CSV—do not count as received cash.',
        badge: '🔍 UTR UNVERIFIED',
        severity: 'danger',
        tagline: 'Never start production until WhatsApp UTR settles in your exported statement',
      },
      {
        title: 'Commitment Protection',
        detail: '🔒 ₹20,000 locked for Staff Salaries, Shop Rent & Machinery EMI.',
        badge: '🔒 100% PROTECTED',
        severity: 'safe',
        tagline: 'Untouchable living floor ring-fenced from inventory raw material purchase',
      },
      {
        title: 'Hidden Cost Discovery',
        detail: '📦 ₹5,000 unquoted transport & packing cost detected from past similar wholesale orders.',
        badge: '📦 ₹5,000 SURCHARGE',
        severity: 'warning',
        tagline: 'Auto-extracted from past line-item delivery patterns in your historical bills',
      },
      {
        title: 'Customer Delay History',
        detail: '⏳ Buyer paid 18–25 days late on their last 3 invoices (Average: 25 days latency).',
        badge: '⏳ 25D DELAY RISK',
        severity: 'warning',
        tagline: 'Calculated from actual cleared timestamp vs invoice creation timestamp in CSV',
      },
    ],
    fixes: [
      {
        id: 'advance',
        title: 'Option A: Ask for 45% Advance (₹45,000)',
        metric: 'Covers the ₹35,000 shortage + leaves ₹10,000 buffer.',
        howItWorks: 'Buyer funds fabric & printing upfront; balance ₹55,000 paid upon delivery.',
        advancePercent: 45,
        batches: 1,
        delayAdjust: 25,
      },
      {
        id: 'batch',
        title: 'Option B: Split into 2 Batches of 500 Shirts',
        metric: 'Make Batch 1 (₹30,000), collect cash on delivery, and use it to fund Batch 2 with ₹0 shortage.',
        howItWorks: 'No need to demand huge advance. Self-funds production using milestone delivery.',
        advancePercent: 20,
        batches: 2,
        delayAdjust: 14,
      },
      {
        id: 'credit',
        title: 'Option C: 25% Advance + 14-Day Supplier Credit Extension',
        metric: '25% Advance (₹25,000) + supplier credit keeps bank balance above ₹15,000 across all 90 days.',
        howItWorks: 'Balances cashflow across both ends of the supply chain.',
        advancePercent: 25,
        batches: 1,
        delayAdjust: 11,
      },
    ],
  },
  freelancer: {
    id: 'freelancer',
    name: 'Freelancer: ₹65,000 Delayed Client Invoice',
    tag: '💻 Digital Creator',
    cost: 65000,
    costLabel: '₹65,000 (UI/UX Redesign Deliverables)',
    startingBalance: 30000,
    lockedReserves: 15000,
    delayDays: 30,
    upfrontPercent: 0,
    hiddenCostBuffer: 5,
    splitBatches: 1,
    expectedProfit: 28000,
    shortageAmount: 20000,
    crashDay: 20,
    checks: [
      {
        title: 'Vendor Bank/IFSC Swap Check',
        detail: '✅ Client payout details match previous 4 approved retainer contracts.',
        badge: '✅ BANK VERIFIED',
        severity: 'safe',
        tagline: 'Verified against your past freelancing deposit history',
      },
      {
        title: 'Duplicate Bill Check',
        detail: '✅ Milestone #2 invoice is distinct from previous sprint milestones.',
        badge: '✅ NO DUPLICATE',
        severity: 'safe',
        tagline: 'Contract milestone tracking prevents invoice confusion',
      },
      {
        title: 'Fake Screenshot / UTR Check',
        detail: 'Screenshot UTR 910284719201 is pending clearance in downloaded CSV.',
        badge: '⏳ PENDING SETTLEMENT',
        severity: 'warning',
        tagline: 'Do not transfer design source files until UTR appears in ledger',
      },
      {
        title: 'Commitment Protection',
        detail: '🔒 ₹15,000 locked for Apartment Rent, Groceries & Health Insurance.',
        badge: '🔒 RING-FENCED',
        severity: 'safe',
        tagline: 'Your living expenses are safeguarded from client delay shock',
      },
      {
        title: 'Hidden Cost Discovery',
        detail: '📦 ₹3,250 platform gateway & currency exchange conversion fee detected.',
        badge: '📦 ₹3,250 FX FEE',
        severity: 'warning',
        tagline: 'International payment platforms silently take 4.5% cut',
      },
      {
        title: 'Customer Delay History',
        detail: '⏳ Client net-30 terms actually take 34 days based on historical payments.',
        badge: '⏳ 30D DELAY',
        severity: 'warning',
        tagline: 'Accounting departments always pay after month-end approvals',
      },
    ],
    fixes: [
      {
        id: 'advance',
        title: 'Option A: 50% Milestone Advance (₹32,500)',
        metric: 'Eliminates ₹20,000 shortfall immediately and protects rent cushion.',
        howItWorks: 'Deliver wireframes on 50% upfront, final Figma tokens on completion.',
        advancePercent: 50,
        batches: 1,
        delayAdjust: 10,
      },
      {
        id: 'batch',
        title: 'Option B: 3 Weekly Sprint Invoices (₹21,666 each)',
        metric: 'Reduces maximum exposure to ₹0 shortage across all 90 days.',
        howItWorks: 'Weekly micro-deliverables ensure you get paid as you work.',
        advancePercent: 33,
        batches: 3,
        delayAdjust: 7,
      },
      {
        id: 'credit',
        title: 'Option C: Razorpay/Escrow 20% Instant Draw',
        metric: 'Keeps liquid cash above ₹12,000 during the 30-day corporate approval lag.',
        howItWorks: 'Use digital milestone contracts to avoid delayed client traps.',
        advancePercent: 20,
        batches: 1,
        delayAdjust: 12,
      },
    ],
  },
  laptop: {
    id: 'laptop',
    name: 'Individual: ₹55,000 Laptop Purchase',
    tag: '🎓 Student / Job Seeker',
    cost: 55000,
    costLabel: '₹55,000 (Coding Laptop + Accessories)',
    startingBalance: 45000,
    lockedReserves: 20000,
    delayDays: 0,
    upfrontPercent: 100,
    hiddenCostBuffer: 8,
    splitBatches: 1,
    expectedProfit: 12000,
    shortageAmount: 34000,
    crashDay: 10,
    checks: [
      {
        title: 'Vendor Bank/IFSC Swap Check',
        detail: '✅ Official electronics retailer verified against past debit card purchases.',
        badge: '✅ RETAILER OK',
        severity: 'safe',
        tagline: 'Recognized merchant in bank statement history',
      },
      {
        title: 'Duplicate Bill Check',
        detail: '✅ One-time purchase order with zero existing matching receipts.',
        badge: '✅ UNIQUE PURCHASE',
        severity: 'safe',
        tagline: 'Standard warranty registration verified',
      },
      {
        title: 'Fake Screenshot / UTR Check',
        detail: '✅ Merchant POS terminal instant debit verification active.',
        badge: '✅ INSTANT DEBIT',
        severity: 'safe',
        tagline: 'Direct card payment cleared via UPI/Netbanking',
      },
      {
        title: 'Commitment Protection',
        detail: '🚨 ₹20,000 College Semester Fees & Room Rent due in 12 days!',
        badge: '🚨 AT RISK',
        severity: 'danger',
        tagline: 'Buying the laptop outright eats into mandatory college fee money',
      },
      {
        title: 'Hidden Cost Discovery',
        detail: '📦 ₹4,400 extended warranty, laptop bag, and MS Office software add-on.',
        badge: '📦 ₹4,400 SURCHARGE',
        severity: 'warning',
        tagline: 'Retailers push high-margin add-ons at checkout counter',
      },
      {
        title: 'Customer Delay History',
        detail: '⏳ Next stipend / salary arrives in 24 days—creating a 14-day zero-cash danger zone.',
        badge: '⏳ 24D CASH GAP',
        severity: 'warning',
        tagline: 'Cashout gap occurs before next monthly income deposit',
      },
    ],
    fixes: [
      {
        id: 'advance',
        title: 'Option A: 3-Month 0% Cost EMI (₹18,333 / mo)',
        metric: 'Keeps ₹26,667 safe in your bank today, protecting college fees.',
        howItWorks: 'Pay in 3 equal monthly installments without touching emergency floor.',
        advancePercent: 33,
        batches: 3,
        delayAdjust: 0,
      },
      {
        id: 'batch',
        title: 'Option B: Refurbished / Buy-Back Route (₹36,000 net)',
        metric: 'Trades in old device, dropping shortage by ₹19,000 instantly.',
        howItWorks: 'Cuts initial outlay while still getting high-performance developer specs.',
        advancePercent: 65,
        batches: 1,
        delayAdjust: 0,
      },
      {
        id: 'credit',
        title: 'Option C: Postpone Purchase by 2 Weeks',
        metric: 'Waiting for next stipend ensures ₹0 shortfall and ₹15,000 liquid surplus.',
        howItWorks: 'Purchasing on Day 25 eliminates financial anxiety completely.',
        advancePercent: 100,
        batches: 1,
        delayAdjust: 15,
      },
    ],
  },
}

// Generate simple 90-day curve based on params
function computeWorkflowCashflow(
  preset: PresetConfig,
  customParams: {
    cost: number
    delayDays: number
    upfrontPercent: number
    hiddenCostBuffer: number
    splitBatches: number
  },
  appliedFix: FixKey | null
) {
  const points = []
  const { startingBalance, lockedReserves } = preset
  const { cost, delayDays, upfrontPercent, hiddenCostBuffer, splitBatches } = customParams

  // If a fix was applied, compute safe parameters
  const effUpfront = appliedFix === 'advance' ? 45 : appliedFix === 'batch' ? 25 : appliedFix === 'credit' ? 30 : upfrontPercent
  const effBatches = appliedFix === 'batch' ? 2 : splitBatches
  const effDelay = appliedFix === 'credit' ? Math.max(8, delayDays - 14) : appliedFix ? Math.min(12, delayDays) : delayDays

  const rawMaterialCost = Math.round(cost * 0.65)
  const hiddenCostAmt = Math.round(cost * (hiddenCostBuffer / 100))
  const monthlySalaryOutflow = Math.round(lockedReserves * 0.6)

  for (let day = 0; day <= 90; day += 3) {
    // 1. Naive Expected Curve (On Paper: client pays, ignoring delays and surprise costs)
    let naive = startingBalance
    if (day >= 5) {
      naive = startingBalance + cost - rawMaterialCost
    }
    if (day >= 30) naive += 15000
    if (day >= 60) naive += 20000

    // 2. Real-Life Stressed Curve
    let stressed = startingBalance

    // Day 5: Pay raw materials (or Batch 1 if split)
    if (day >= 5) {
      const batchDivisor = effBatches > 1 ? effBatches : 1
      const initialOutlay = Math.round(rawMaterialCost / batchDivisor)
      const upfrontCollected = Math.round(cost * (effUpfront / 100))
      stressed = stressed - initialOutlay + upfrontCollected
    }

    // Day 10: Hidden transport & delivery cost hits
    if (day >= 10) {
      stressed -= hiddenCostAmt
    }

    // Day 15: Staff salaries and shop rent due strictly
    if (day >= 15) {
      stressed -= monthlySalaryOutflow
    }

    // Day 18 to Day (18 + delay): Buyer payment arrives
    const paymentArrivalDay = 15 + effDelay
    if (day >= paymentArrivalDay) {
      const balanceOwed = cost - Math.round(cost * (effUpfront / 100))
      stressed += balanceOwed
    }

    // Day 45: Month 2 normal income
    if (day >= 45) {
      stressed += 25000 - monthlySalaryOutflow
    }

    // Day 75: Month 3 normal income
    if (day >= 75) {
      stressed += 30000 - monthlySalaryOutflow
    }

    points.push({
      day,
      naive: Math.round(naive),
      stressed: Math.round(stressed),
    })
  }

  return points
}

export default function ZeroManualInputFlow() {
  const [activePreset, setActivePreset] = useState<PresetKey>('tshirt')
  const [appliedFix, setAppliedFix] = useState<FixKey | null>(null)
  const [isSlidersOpen, setIsSlidersOpen] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedFileName, setExtractedFileName] = useState<string | null>(null)
  const [copiedFixId, setCopiedFixId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const preset = PRESETS[activePreset]

  // Custom tweakable parameters (hidden inside accordion)
  const [customCost, setCustomCost] = useState(preset.cost)
  const [customDelay, setCustomDelay] = useState(preset.delayDays)
  const [customUpfront, setCustomUpfront] = useState(preset.upfrontPercent)
  const [customHidden, setCustomHidden] = useState(preset.hiddenCostBuffer)
  const [customBatches, setCustomBatches] = useState(preset.splitBatches)

  // Switch preset helper
  const handleSelectPreset = (key: PresetKey) => {
    setActivePreset(key)
    const p = PRESETS[key]
    setCustomCost(p.cost)
    setCustomDelay(p.delayDays)
    setCustomUpfront(p.upfrontPercent)
    setCustomHidden(p.hiddenCostBuffer)
    setCustomBatches(p.splitBatches)
    setAppliedFix(null)
  }

  // File drop / upload helper
  const handleSimulateDrop = (fileName: string) => {
    setIsExtracting(true)
    setTimeout(() => {
      setIsExtracting(false)
      setExtractedFileName(fileName)
      const lower = fileName.toLowerCase()
      if (lower.includes('freelancer')) {
        handleSelectPreset('freelancer')
      } else if (lower.includes('laptop') || lower.includes('student')) {
        handleSelectPreset('laptop')
      } else {
        handleSelectPreset('tshirt')
      }
    }, 500)
  }

  // Apply fix handler
  const handleApplyFix = (fixId: FixKey) => {
    setAppliedFix(fixId)
    const targetFix = preset.fixes.find(f => f.id === fixId)
    if (targetFix) {
      setCustomUpfront(targetFix.advancePercent)
      setCustomBatches(targetFix.batches)
      setCustomDelay(targetFix.delayAdjust)
    }
  }

  // Reset to original scenario
  const handleReset = () => {
    setAppliedFix(null)
    setCustomCost(preset.cost)
    setCustomDelay(preset.delayDays)
    setCustomUpfront(preset.upfrontPercent)
    setCustomHidden(preset.hiddenCostBuffer)
    setCustomBatches(preset.splitBatches)
  }

  const handleCopyNegotiation = (fixId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFixId(fixId)
    setTimeout(() => setCopiedFixId(null), 2000)
  }

  // Generate cashflow data points
  const chartData = computeWorkflowCashflow(
    preset,
    {
      cost: customCost,
      delayDays: customDelay,
      upfrontPercent: customUpfront,
      hiddenCostBuffer: customHidden,
      splitBatches: customBatches,
    },
    appliedFix
  )

  const isSafeNow = appliedFix !== null || (customUpfront >= 40 && customDelay <= 12)
  const lowestStressed = chartData.reduce((min, d) => (d.stressed < min ? d.stressed : min), chartData[0]?.stressed || 0)

  const rawNaiveGradId = useId()
  const naiveGradId = `wfNaiveGrad_${rawNaiveGradId.replace(/:/g, '')}`
  const rawStressGradId = useId()
  const stressGradId = `wfStressGrad_${rawStressGradId.replace(/:/g, '')}`

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      {/* Visual Header Banner */}
      <div className="bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-yellow-100 text-yellow-950 border border-yellow-400 mb-2">
              <Sparkles size={13} className="text-yellow-600 animate-spin" />
              <span>JUDGE-REQUESTED 3-STEP FLOW · ZERO MANUAL TYPING REQUIRED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              3-Step Before-You-Spend Decision Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Drop an invoice or pick a sample order below. FINVEXA-AI simulates your real bank balance across 90 days and fixes cash shortages in 1 click.
            </p>
          </div>

          {/* Safe vs Deficit Status Badge */}
          <div
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border shadow-xs shrink-0 flex items-center gap-2 ${
              isSafeNow
                ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                : 'bg-rose-50 text-rose-950 border-rose-400 animate-pulse'
            }`}
          >
            {isSafeNow ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>✅ SAFE: Bank Balance Stays Above ₹0</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-rose-600" />
                <span>🚨 SHORTAGE: −₹{Math.abs(lowestStressed).toLocaleString('en-IN')} on Day {preset.crashDay}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: 1-Click Auto-Extract (Zero Manual Typing Required) */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-yellow-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950">
                STEP 1: 1-Click Auto-Extract (Zero Manual Typing Required)
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Drop your Purchase Order / Invoice or tap an instant sample below to auto-fill everything in 0.5s.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 self-start sm:self-auto">
            100% Deterministic · Zero Hallucination
          </span>
        </div>

        {/* Hidden File Input for Real Testing with sample_data */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleSimulateDrop(file.name)
          }}
        />

        {/* Clean Yellow & White Dropzone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            handleSimulateDrop(file ? file.name : 'tshirt_order_ledger.csv')
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-amber-300 hover:border-yellow-500 bg-amber-50/50 hover:bg-amber-50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group relative"
        >
          {isExtracting ? (
            <div className="flex flex-col items-center justify-center gap-2 py-3">
              <div className="w-9 h-9 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-900">
                ⚡ Auto-extracting vendor line items, terms & comparing with CSV ledger...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/30 text-amber-900 border border-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload size={22} className="text-slate-950" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">
                  📄 Drop Purchase Order / Invoice PDF or Ledger CSV (AI Auto-Fills Everything — Zero Manual Typing)
                </p>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {extractedFileName ? (
                    <strong className="text-emerald-700">✓ Extracted: {extractedFileName}</strong>
                  ) : (
                    'Supports PDF, Images & CSV · Extracts buyer terms, hidden logistics fees, and bank details in <1 sec'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3 Instant Sample Buttons */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
            Or Click An Instant Real-Life Scenario:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'tshirt' as const, label: '🏪 T-Shirt Shop: ₹1,00,000 Order', subtitle: '1,000 corporate shirts · 25-day buyer lag' },
              { id: 'freelancer' as const, label: '💻 Freelancer: ₹65,000 Delayed Client Invoice', subtitle: 'UI/UX contract · 30-day net terms' },
              { id: 'laptop' as const, label: '🎓 Individual: ₹55,000 Laptop Purchase', subtitle: 'Coding laptop · Semester fees due' },
            ].map(item => {
              const isActive = activePreset === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPreset(item.id)}
                  type="button"
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all font-bold text-xs flex flex-col justify-between gap-1 shadow-xs ${
                    isActive
                      ? 'bg-yellow-400 border-yellow-500 text-slate-950 ring-2 ring-yellow-400/50 shadow-md scale-[1.01]'
                      : 'bg-white border-yellow-200 text-slate-700 hover:bg-yellow-50 hover:text-slate-950 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{item.label}</span>
                    {isActive && <Check size={16} className="text-slate-950 shrink-0" />}
                  </div>
                  <span className={`text-[11px] ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                    {item.subtitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Collapsible Accordion: Sliders Hidden By Default */}
        <div className="border border-yellow-200 rounded-2xl overflow-hidden bg-amber-50/30">
          <button
            type="button"
            onClick={() => setIsSlidersOpen(!isSlidersOpen)}
            className="w-full px-4 py-3 text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center justify-between bg-amber-50/70 hover:bg-amber-100/70 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sliders size={15} className="text-yellow-600" />
              <span>⚙️ Want to tweak numbers manually? Click to open sliders (Optional)</span>
            </span>
            <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
              {isSlidersOpen ? 'Hide Sliders' : 'Zero Typing Mode Active'}
              {isSlidersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {isSlidersOpen && (
            <div className="p-5 border-t border-yellow-200 space-y-4 bg-white animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Order Cost */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Order Value / Expense</span>
                    <span className="font-mono text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-lg border border-yellow-300">
                      ₹{customCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={250000}
                    step={5000}
                    value={customCost}
                    onChange={e => setCustomCost(Number(e.target.value))}
                    className="slider-custom"
                  />
                </div>

                {/* 2. Delay Days */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Buyer Delay Latency</span>
                    <span className="font-mono text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-lg border border-yellow-300">
                      {customDelay} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={1}
                    value={customDelay}
                    onChange={e => setCustomDelay(Number(e.target.value))}
                    className="slider-custom"
                  />
                </div>

                {/* 3. Upfront Advance */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Advance / Downpayment</span>
                    <span className="font-mono text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-lg border border-yellow-300">
                      {customUpfront}% (₹{Math.round((customCost * customUpfront) / 100).toLocaleString('en-IN')})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={customUpfront}
                    onChange={e => setCustomUpfront(Number(e.target.value))}
                    className="slider-custom"
                  />
                </div>

                {/* 4. Hidden Logistics Buffer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Hidden Delivery & Packing</span>
                    <span className="font-mono text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-lg border border-yellow-300">
                      {customHidden}% (₹{Math.round((customCost * customHidden) / 100).toLocaleString('en-IN')})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={customHidden}
                    onChange={e => setCustomHidden(Number(e.target.value))}
                    className="slider-custom"
                  />
                </div>

                {/* 5. Split Batches */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Split Production Batches</span>
                    <span className="font-mono text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-lg border border-yellow-300">
                      {customBatches} {customBatches > 1 ? 'Batches' : 'Single Batch'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={1}
                    value={customBatches}
                    onChange={e => setCustomBatches(Number(e.target.value))}
                    className="slider-custom"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2: Instant 90-Day Cash Position & Practical Ledger Check (Side-by-Side) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Crisp White/Yellow Step 2 Header Banner */}
        <div className="bg-white text-slate-900 border-2 border-yellow-400 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3.5">
          <span className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-base shadow-xs shrink-0">
            2
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-950">
              STEP 2: Instant 90-Day Cash Position &amp; Practical Ledger Check (Side-by-Side)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Graph on left proves the exact day you hit cash shortage. Audit on right verifies bills against your exported CSV ledger (Zero Bank API required).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT CARD: Clean 90-Day Graph (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-yellow-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-950">
                  90-Day Real Bank Balance vs Paper Balance
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Green = On Paper · Red = Real Bank Reality · Amber Dashed = Locked Living Reserve
                </p>
              </div>

              {appliedFix && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors self-start sm:self-auto"
                >
                  <RotateCcw size={12} />
                  <span>Reset to Deficit View</span>
                </button>
              )}
            </div>

            {/* Recharts Canvas */}
            <div className="w-full h-[300px] sm:h-[340px] bg-[#FFFDF7] rounded-2xl p-2 border border-yellow-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id={naiveGradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id={stressGradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isSafeNow ? '#16a34a' : '#e11d48'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isSafeNow ? '#16a34a' : '#e11d48'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FDE047" opacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    label={{ value: 'Day', position: 'insideBottomRight', offset: -4, fill: '#475569', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <YAxis
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="p-3 bg-white border-2 border-yellow-300 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-black text-slate-900 border-b border-yellow-200 pb-1">
                            Day {label} Balance Check
                          </div>
                          {payload.map((p: any) => (
                            <div key={p.dataKey} className="flex justify-between gap-3 font-semibold">
                              <span style={{ color: p.color }}>{p.name}:</span>
                              <span className="font-mono font-bold text-slate-900">
                                ₹{Math.abs(p.value).toLocaleString('en-IN')}
                                {p.value < 0 && <span className="text-rose-600 font-black"> (Shortfall)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    formatter={value => (
                      <span className="text-xs font-bold text-slate-800">
                        {value === 'naive'
                          ? `🟢 Expected Balance (On Paper: +₹${preset.expectedProfit.toLocaleString('en-IN')})`
                          : isSafeNow
                          ? '✅ Real Bank Balance (Safe: Cash Stays Above ₹0)'
                          : `🔴 Real Bank Balance (Hits −₹${preset.shortageAmount.toLocaleString('en-IN')} on Day ${preset.crashDay})`}
                      </span>
                    )}
                  />

                  {/* ₹0 Danger line */}
                  <ReferenceLine
                    y={0}
                    stroke="#e11d48"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: '🚨 ₹0 Danger Line (Zero Cash in Bank)',
                      position: 'insideBottomLeft',
                      fill: '#be123c',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />

                  {/* Locked reserves floor line */}
                  <ReferenceLine
                    y={preset.lockedReserves}
                    stroke="#d97706"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: `🔒 ₹${(preset.lockedReserves / 1000).toFixed(0)}K Locked Floor (Salaries & Rent)`,
                      position: 'top',
                      fill: '#b45309',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="naive"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fill={`url(#${naiveGradId})`}
                    name="naive"
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    stroke={isSafeNow ? '#16a34a' : '#e11d48'}
                    strokeWidth={3}
                    fill={`url(#${stressGradId})`}
                    name="stressed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Visual Callout Cards Under Graph */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3">
                <div className="text-[11px] font-black uppercase text-emerald-800 flex items-center gap-1">
                  <span>🟢 On Paper (Naive Profit)</span>
                </div>
                <div className="text-sm font-black text-emerald-950 mt-0.5">
                  +₹{preset.expectedProfit.toLocaleString('en-IN')} Profit
                </div>
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                  Assumes instant payment & zero delivery surprise costs.
                </p>
              </div>

              <div
                className={`border rounded-2xl p-3 transition-colors ${
                  isSafeNow
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="text-[11px] font-black uppercase flex items-center gap-1">
                  <span>{isSafeNow ? '✅ Bank Reality (Safe)' : '🔴 Real Bank Balance Reality'}</span>
                </div>
                <div className="text-sm font-black mt-0.5">
                  {isSafeNow ? '✅ Stays Above ₹0 (+₹10,000 Buffer)' : `Hits −₹${preset.shortageAmount.toLocaleString('en-IN')} on Day ${preset.crashDay}`}
                </div>
                <p className="text-[11px] font-medium mt-0.5">
                  {isSafeNow
                    ? 'Fix active: Cashflow survives rent, delivery & delays safely.'
                    : `Shortage caused by ₹20k rent/salaries, ₹5k delivery & ${customDelay}d buyer delay.`}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: 6 Simple Checks — Practical No-Bank-API Fraud Check (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="border-b border-yellow-200 pb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-950 border border-yellow-400 mb-1">
                <Shield size={11} className="text-yellow-700" />
                <span>PRACTICAL AUDIT · ZERO BANK API REQUIRED</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-950">
                6 Real Ledger & Fraud Defenses
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Cross-checks uploaded invoices against your own downloaded CSV statement.
              </p>
            </div>

            <div className="space-y-2.5">
              {preset.checks.map((chk, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all ${
                    chk.severity === 'danger'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : chk.severity === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-white text-slate-950 font-black text-[10px] flex items-center justify-center border shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-black text-xs text-slate-950">{chk.title}</span>
                    </div>
                    <span
                      className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                        chk.severity === 'danger'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : chk.severity === 'warning'
                          ? 'bg-yellow-200 text-yellow-950 border-yellow-400'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {chk.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 mt-1.5 leading-snug">
                    {chk.detail}
                  </p>

                  <div className="mt-1 text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <span>💡 {chk.tagline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 3: 1-Click Safe Fix ("How to Accept This Order Safely") */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-yellow-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              3
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950">
                STEP 3: 1-Click Safe Fix ("How to Accept This Order Safely")
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Tap "✨ Apply This Fix" on any solution below. Watch the red crash line on the graph instantly turn green!
              </p>
            </div>
          </div>

          {appliedFix && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-700" />
                <span>Fix Active on Graph</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* 3 Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {preset.fixes.map(fix => {
            const isApplied = appliedFix === fix.id
            return (
              <div
                key={fix.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 shadow-xs ${
                  isApplied
                    ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-400/50 shadow-md'
                    : 'bg-white border-yellow-200 hover:border-yellow-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-950 border border-yellow-300">
                      {fix.id === 'advance' ? '⭐ RECOMMENDED' : fix.id === 'batch' ? '🛡️ ZERO-ARGUMENT' : '🤝 COLLABORATIVE'}
                    </span>
                    {isApplied && (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-slate-950">
                    {fix.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-slate-900 leading-snug">
                    {fix.metric}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {fix.howItWorks}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-yellow-100">
                  <button
                    type="button"
                    onClick={() => handleApplyFix(fix.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isApplied
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 hover:shadow-md'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check size={14} />
                        <span>✓ Fix Applied (Green Safe)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-slate-950" />
                        <span>✨ Apply This Fix</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNegotiation(
                        fix.id,
                        `Hi, regarding our order: To start fabric production without delivery delays, we require ${fix.metric}. Let us know so we can lock in the delivery date!`
                      )
                    }
                    className="w-full py-1.5 px-3 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy size={12} />
                    <span>
                      {copiedFixId === fix.id ? 'Copied script to clipboard!' : 'Copy WhatsApp Message to Buyer'}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
