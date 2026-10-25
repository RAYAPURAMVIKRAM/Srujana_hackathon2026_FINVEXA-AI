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
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
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
  const { persona, personaData, userGoal, updateUserGoal, themeMode } = useApp()
  const isLight = themeMode === 'light'
  const theme = personaData.theme

  const [isEditing, setIsEditing] = useState(false)
  const [goalText, setGoalText] = useState(userGoal?.title || 'Buy a ₹55,000 laptop in 2 months')
  const [amount, setAmount] = useState<number>(userGoal?.targetAmount || 55000)
  const [months, setMonths] = useState<number>(userGoal?.targetMonths || 2)

  const handleSaveGoal = () => {
    updateUserGoal({
      title: goalText,
      targetAmount: amount,
      targetMonths: months,
    })
    setIsEditing(false)
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
        title: 'Internshala Work-From-Home Internships',
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
        title: 'Apple Education Store & Student Unidays',
        category: 'Direct Savings',
        url: 'https://www.apple.com/in-edu/store',
        badge: 'Flat ₹10,000 Off',
        description: 'Get verified student discounts and free AirPods on MacBooks/iPads with college ID verification.',
      },
      {
        title: 'ONDC Open Network Food & Essentials',
        category: 'Zero Surge Fee',
        url: 'https://ondc.org',
        badge: 'Save 30% on Food',
        description: 'Order food directly from local restaurants to eliminate ₹45–₹95 late-night delivery surge markups.',
      },
    ],
    freelancer: [
      {
        title: 'Upwork Global Milestone Contracts',
        category: 'USD Client Work',
        url: 'https://www.upwork.com',
        badge: 'Escrow Protected',
        description: 'Find international clients with automatic milestone escrow deposits before work begins.',
      },
      {
        title: 'Contra Commission-Free Marketplace',
        category: '0% Platform Fee',
        url: 'https://contra.com',
        badge: 'Keep 100% Earnings',
        description: 'Create a modern portfolio and invoice clients globally without giving away 20% platform commissions.',
      },
      {
        title: 'Razorpay Payment Links & Advance Escrow',
        category: 'Payment Tool',
        url: 'https://razorpay.com/payment-links/',
        badge: 'Instant Advance',
        description: 'Generate 40% upfront deposit links with UPI and card support before releasing project files.',
      },
      {
        title: 'ClearTax Section 44ADA Presumptive Tax',
        category: 'Tax Refund',
        url: 'https://cleartax.in',
        badge: 'Claim 10% TDS Back',
        description: 'File under Section 44ADA to recover all 10% TDS deductions withheld by clients directly into your bank.',
      },
    ],
    business: [
      {
        title: 'GeM (Government e-Marketplace)',
        category: 'B2B Orders',
        url: 'https://gem.gov.in',
        badge: 'Zero Middlemen',
        description: 'Direct procurement portal to supply products and textiles directly to Indian government departments.',
      },
      {
        title: 'TReDS Invoice Discounting (RXIL / Invoicemart)',
        category: 'Working Capital',
        url: 'https://www.invoicemart.com',
        badge: 'RBI Regulated',
        description: 'Auction corporate and PSU unpaid invoices to get paid within 48 hours instead of waiting 60–90 days.',
      },
      {
        title: 'ONDC Business Network for Merchants',
        category: 'Retail Sales',
        url: 'https://ondc.org',
        badge: '0% Monopoly',
        description: 'List your catalog on the Open Network for Digital Commerce to reach buyers across Paytm, Magicpin, and pincodes.',
      },
      {
        title: 'Udyam MSME Registration Portal',
        category: 'Govt Subsidy',
        url: 'https://udyamregistration.gov.in',
        badge: 'CGTMSE Loans',
        description: 'Official free registration for collateral-free MSME bank loans up to ₹2 Crore at subsidized interest rates.',
      },
    ],
  }

  const activePresets = goalPresets[persona] || goalPresets.salaried
  const activeResources = resources[persona] || resources.salaried

  // Calculations for comparison
  const monthlyNeed = Math.round(amount / Math.max(1, months))
  const shortageRiskWithout = Math.max(0, amount - (personaData.balance - personaData.lockedReserves))
  const daysSavedWith = Math.min(45, Math.round(months * 14))
  const interestSaved = Math.round(amount * 0.14)

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border mb-2"
            style={{
              borderColor: `${theme.primaryHex}50`,
              background: `${theme.primaryHex}15`,
              color: theme.primaryHex,
            }}
          >
            <Target size={13} />
            <span>AI Goal Intelligence · Forward-Looking Digital Twin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Goal Strategy & Earner/Saver Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Bank statements only show the past. Here is your customized AI roadmap to achieve{' '}
            <strong className="text-white">"{goalText}"</strong> without crashing your bank balance:
          </p>
        </div>

        {/* Quick Simulator Link */}
        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 self-start md:self-auto shrink-0 shadow-lg"
          style={{ background: theme.buttonGradient }}
        >
          <span>Test in 90-Day Simulator</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 1. Interactive Goal Customizer Card */}
      <Tilt3DCard
        className={`glass-card p-5 sm:p-6 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md shrink-0"
              style={{ background: theme.buttonGradient }}
            >
              🎯
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Target Goal ({personaData.label})
              </div>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                {goalText}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
              <span className="text-slate-400">Target Cost: </span>
              <strong className="text-emerald-400 font-mono">₹{amount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
              <span className="text-slate-400">Timeline: </span>
              <strong className="text-blue-400">{months} Months</strong>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all ml-auto lg:ml-0"
            >
              {isEditing ? 'Cancel Edit' : '✏️ Change Goal'}
            </button>
          </div>
        </div>

        {/* Goal Edit Drawer */}
        {isEditing && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Goal Description
                </label>
                <input
                  type="text"
                  value={goalText}
                  onChange={e => setGoalText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Buy a ₹55,000 laptop in 2 months"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Cost (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold mr-1">Quick Presets:</span>
                {activePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGoalText(preset.title)
                      setAmount(preset.amt)
                      setMonths(preset.m)
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {preset.title.split(' in ')[0]}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSaveGoal}
                className="btn-primary text-xs py-2 px-5 font-bold shadow-md"
                style={{ background: theme.buttonGradient }}
              >
                Save & Recalculate AI Strategy
              </button>
            </div>
          </div>
        )}
      </Tilt3DCard>

      {/* 2. Side-by-Side Comparison: DIY vs. FINVEXA Strategy */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            Side-by-Side Comparison: Doing It Yourself vs. FINVEXA AI Strategy
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Card: Your Current Way Without FINVEXA */}
          <Tilt3DCard className="glass-card p-6 rounded-2xl border border-rose-500/40 bg-rose-950/20 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Your Current Way (Without FINVEXA)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                High Risk
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 space-y-1">
                <div className="text-[11px] font-bold text-rose-300 uppercase">Cash Squeeze Danger</div>
                <div className="text-base font-black text-rose-400">
                  {shortageRiskWithout > 0 ? `−₹${shortageRiskWithout.toLocaleString('en-IN')} Deficit Risk` : 'Zero Buffer Zone'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Buying without structured milestones wipes out your ₹{personaData.lockedReserves.toLocaleString('en-IN')} rent & emergency safety floor.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>3.5 Months Delayed:</strong> Cash is trapped in late-paying clients or unplanned food delivery leaks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>₹{interestSaved.toLocaleString('en-IN')} Wasted:</strong> High-interest credit card revolving balance (36% APR) or ₹199 hidden processing fees.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>Stress Level 85/100:</strong> High panic when rent or supplier payroll bounces on the 1st of the month.</span>
                </div>
              </div>
            </div>
          </Tilt3DCard>

          {/* Right Card: Following FINVEXA AI Strategy */}
          <Tilt3DCard className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Following FINVEXA AI Strategy</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                100% Protected
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
                <div className="text-[11px] font-bold text-emerald-300 uppercase">Cash Shortage Prevention</div>
                <div className="text-base font-black text-emerald-400">
                  ₹0 Cash Shortage · Rent 100% Untouched
                </div>
                <p className="text-[11px] text-slate-400">
                  Structured 40% milestone downpayment + ₹{personaData.hiddenLeaks.toLocaleString('en-IN')}/mo leaks recovered keeps your account green.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Saved {daysSavedWith} Days:</strong> Accelerated timeline by collecting pending refunds and splitting purchases into 2 batches.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>₹{interestSaved.toLocaleString('en-IN')} Kept in Pocket:</strong> Zero debt reliance through smart payment timing with counterparties.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Monthly Target:</strong> Save or set aside ₹{monthlyNeed.toLocaleString('en-IN')}/month comfortably within cashflow.</span>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </div>
      </div>

      {/* 3. Genuine Web-Researched Money Saving & Extra-Income Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Genuine Money-Saving & Side-Income Hub ({personaData.label})
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Direct Working Links · Zero Spam
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeResources.map((res, idx) => (
            <Tilt3DCard
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {res.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {res.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Official Platform</span>
                  <ExternalLink size={13} className="text-blue-400" />
                </a>
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </div>
    </div>
  )
}
