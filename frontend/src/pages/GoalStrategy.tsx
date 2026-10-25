// src/pages/GoalStrategy.tsx
import { useState } from 'react'
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

interface ResourceLink {
  title: string
  category: string
  url: string
  badge: string
  description: string
}

export default function GoalStrategy() {
  const navigate = useNavigate()
  const { persona, personaData, userGoal, updateUserGoal } = useApp()

  const [goalText, setGoalText] = useState(
    userGoal?.title ||
      (persona === 'salaried'
        ? 'Buy a ₹55,000 laptop in 2 months'
        : persona === 'freelancer'
        ? 'Buy a ₹45,000 camera gear in 45 days'
        : 'Accept a ₹1,00,000 T-Shirt order in 30 days')
  )
  const [amount, setAmount] = useState<number>(
    userGoal?.targetAmount || (persona === 'salaried' ? 55000 : persona === 'freelancer' ? 45000 : 100000)
  )
  const [months, setMonths] = useState<number>(userGoal?.targetMonths || 2)
  const [isAnalyzed, setIsAnalyzed] = useState(false)

  const handleAnalyzeGoal = () => {
    updateUserGoal({
      title: goalText,
      targetAmount: amount,
      targetMonths: months,
    })
    setIsAnalyzed(true)
  }

  // Preset goal chips per persona
  const goalPresets: Record<string, { title: string; amt: number; m: number }[]> = {
    salaried: [
      { title: 'Buy a ₹55,000 laptop in 2 months', amt: 55000, m: 2 },
      { title: 'Buy a ₹75,000 electric scooter in 4 months', amt: 75000, m: 4 },
      { title: 'Build ₹30,000 emergency fund in 3 months', amt: 30000, m: 3 },
    ],
    freelancer: [
      { title: 'Buy ₹45,000 camera gear in 45 days', amt: 45000, m: 1.5 },
      { title: 'Upgrade home studio for ₹60,000 in 3 months', amt: 60000, m: 3 },
      { title: 'Save 3 months living buffer (₹45,000)', amt: 45000, m: 3 },
    ],
    business: [
      { title: 'Accept ₹1,00,000 T-shirt order in 30 days', amt: 100000, m: 1 },
      { title: 'Buy ₹2,50,000 screen printing machine in 6 months', amt: 25000, m: 6 },
      { title: 'Stock ₹80,000 raw fabric before festive season', amt: 80000, m: 2 },
    ],
  }

  // Genuine web resources
  const resources: Record<string, ResourceLink[]> = {
    salaried: [
      {
        title: 'Internshala Paid Internships & Gigs',
        category: 'Side Income',
        url: 'https://internshala.com',
        badge: '₹8K–₹15K / Month',
        description: 'Verified part-time content, coding, and design gigs with stipend guarantees for students and job-seekers.',
      },
      {
        title: 'Unstop Student Competitions & Hackathons',
        category: 'Cash Prizes',
        url: 'https://unstop.com',
        badge: 'Cash Bounties',
        description: 'Compete in corporate hackathons and case studies with real cash prize pools to fund your tech gear.',
      },
      {
        title: 'ONDC Direct Food Ordering (Save 30% Surge)',
        category: 'Zero Surge Fee',
        url: 'https://ondc.org',
        badge: 'Save 30% on Food',
        description: 'Order food directly from local restaurants to eliminate ₹45–₹95 late-night delivery surge markups.',
      },
    ],
    freelancer: [
      {
        title: 'Contra Commission-Free Marketplace',
        category: '0% Platform Fee',
        url: 'https://contra.com',
        badge: 'Keep 100% Earnings',
        description: 'Create a modern portfolio and invoice clients globally without giving away 20% platform commissions.',
      },
      {
        title: 'Upwork Global Milestone Contracts',
        category: 'USD Client Work',
        url: 'https://www.upwork.com',
        badge: 'Escrow Protected',
        description: 'Find international clients with automatic milestone escrow deposits before work begins.',
      },
      {
        title: 'Razorpay Milestone Payment Links',
        category: 'Advance Tool',
        url: 'https://razorpay.com/payment-links/',
        badge: 'Instant Advance',
        description: 'Generate 40% upfront deposit links with UPI and card support before releasing project files.',
      },
    ],
    business: [
      {
        title: 'Invoicemart TReDS Platform (RXIL)',
        category: 'Instant Cash',
        url: 'https://www.invoicemart.com',
        badge: 'RBI Regulated',
        description: 'Auction corporate and PSU unpaid invoices to get paid within 48 hours instead of waiting 60–90 days.',
      },
      {
        title: 'M1xchange TReDS Invoice Exchange',
        category: 'Working Capital',
        url: 'https://www.m1xchange.com',
        badge: 'Quick Liquidity',
        description: 'Trade unpaid buyer bills for immediate liquidity at low bank interest rates without collateral.',
      },
      {
        title: 'GeM (Government e-Marketplace)',
        category: 'B2B Orders',
        url: 'https://gem.gov.in',
        badge: 'Zero Middlemen',
        description: 'Direct procurement portal to supply products and textiles directly to Indian government departments.',
      },
    ],
  }

  const activePresets = goalPresets[persona] || goalPresets.salaried
  const activeResources = resources[persona] || resources.salaried

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Target size={13} />
            <span>AI Goal Intelligence · Forward-Looking Digital Twin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            🎯 My Goal & Strategy Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Bank statements only show what already happened. Tell FINVEXA what you want to buy or achieve next, and our engine maps the safest way to get there:
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 self-start md:self-auto shrink-0 shadow-sm"
        >
          <span>Test in 90-Day Simulator</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 1. AI Goal Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
            🤖
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Tell FINVEXA: What do you want to buy, save for, or accept as a business order next?
            </h2>
            <p className="text-xs text-slate-500">
              Type your next purchase or pick a quick-fill example below:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-7">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Goal Description
            </label>
            <input
              type="text"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              placeholder="e.g. Buy a ₹55,000 laptop in 2 months"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cost / Target Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={handleAnalyzeGoal}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Search size={14} />
              <span>{isAnalyzed ? '✓ Analyzed' : 'Analyze Goal'}</span>
            </button>
          </div>
        </div>

        {/* 3 Quick-Fill Example Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles size={12} className="text-blue-600" />
            Quick Examples:
          </span>
          {activePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoalText(preset.title)
                setAmount(preset.amt)
                setMonths(preset.m)
                handleAnalyzeGoal()
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition-colors font-medium"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 2-COLUMN SIDE-BY-SIDE COMPARISON TABLE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Side-by-Side Comparison: Doing It Yourself vs. Following FINVEXA AI Strategy
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT COLUMN: Doing It Yourself (Without FINVEXA) */}
          <div className="bg-red-50/70 border border-red-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>❌ Doing It Yourself (Without FINVEXA)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 uppercase">
                High Risk
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-red-200 space-y-1 shadow-xs">
                <div className="text-[11px] font-bold text-red-700 uppercase">
                  Cash Shortage Alert
                </div>
                <div className="text-xl font-black text-red-600">
                  Runs into a Cash Shortage on Day 18
                </div>
                <p className="text-xs text-slate-600">
                  Because you pay upfront before getting paid, your account balance plunges into the red.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>
                    <strong>Puts Rent & Salaries in Danger:</strong> Your untouchable survival money (₹{personaData.lockedReserves.toLocaleString('en-IN')}) gets spent on the purchase.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>
                    <strong>Wastes ₹4,500+ on Hidden Fees:</strong> High-interest credit card revolving charges (36% APR), surge delivery markups, and forgotten trial auto-debits.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>
                    <strong>Takes 4 Months Longer to Recover:</strong> Paying penalties and emergency borrowing traps you in an ongoing cash squeeze.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Following FINVEXA AI Strategy */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>✅ Following FINVEXA AI Strategy</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                100% Protected
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-800 uppercase">
                  Zero Shortage Guarantee
                </div>
                <div className="text-xl font-black text-emerald-700">
                  ₹0 Cash Shortage Throughout Entire 90 Days
                </div>
                <p className="text-xs text-slate-600">
                  Using milestone downpayments and smart delivery splits keeps your bank green every single day.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>
                    <strong>Rent & Salaries 100% Locked & Safe:</strong> Your ₹{personaData.lockedReserves.toLocaleString('en-IN')} essential floor is never touched by the purchase.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>
                    <strong>Saves ₹4,500+ by Cutting Leaks:</strong> Cancels forgotten auto-debits, recovers friend splits via WhatsApp, and avoids expensive loan interest.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>
                    <strong>Reaches Goal on Time + ₹10,000 Buffer:</strong> Finish your purchase exactly on target with an extra ₹10,000 emergency buffer left in the bank!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GENUINE WAYS TO SAVE & EARN EXTRA MONEY */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              🌐 Genuine Ways to Save & Earn Extra Money (Matched to {personaData.label})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Direct Working Links · Verified Platforms
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activeResources.map((res, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {res.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {res.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-700 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Official Platform</span>
                  <ExternalLink size={13} className="text-blue-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
