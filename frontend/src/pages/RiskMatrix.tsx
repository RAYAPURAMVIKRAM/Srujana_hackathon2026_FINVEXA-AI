// src/pages/RiskMatrix.tsx
import { useState } from 'react'
import {
  ShieldAlert,
  Eye,
  TrendingDown,
  Lock,
  CreditCard,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  AlertTriangle,
  Package,
  ExternalLink,
  ArrowRight,
  Search,
  CheckCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

interface RiskFixDetails {
  aiFound: string
  whyItHurts: string
  fixAction: string
  fixLink: string
  fixLinkText: string
  isExternal: boolean
}

export default function RiskMatrix() {
  const { personaData, simulator, setSimulator } = useApp()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const theme = personaData.theme

  const cashflow = generateCashflow({
    balance: personaData.balance,
    monthlyIncome: personaData.monthlyIncome,
    lockedReserves: personaData.lockedReserves,
    decisionCost: simulator.decisionCost,
    paymentDelayDays: simulator.paymentDelayDays,
    upfrontPercent: simulator.upfrontPercent,
    hiddenCostBuffer: simulator.hiddenCostBuffer,
    splitBatches: simulator.splitBatches,
    hiddenLeaks: personaData.hiddenLeaks,
    personaType: personaData.type,
  })

  const { shortage } = computeRiskMetrics(cashflow, personaData.lockedReserves)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  // Deep dive risk details per risk id
  const getRiskDetails = (id: string): RiskFixDetails => {
    switch (id) {
      case 'midnight-food':
      case 'fraud-tamper':
      case 'cash-inflow-delay':
        return {
          aiFound: 'AI identified 12 transactions after 11:30 PM with delivery markups averaging ₹65 to ₹95 per order, plus repeated small weekend UPI transfers.',
          whyItHurts: 'Late-night cravings and surge pricing quietly drain ₹3,200/month. That is money that could have paid 25% of your semester exam fees or hostel rent.',
          fixAction: 'Order directly through ONDC food apps without middleman surge charges, or set a 10 PM UPI wallet spend cap.',
          fixLink: 'https://ondc.org',
          fixLinkText: 'Explore ONDC Zero-Surge Network',
          isExternal: true,
        }

      case 'forgotten-sub':
      case 'gst-mismatch':
      case 'vendor-price-creep':
        return {
          aiFound: 'Detected 3 recurring e-mandate debits (₹199, ₹130, ₹699) that occurred at odd hours with zero SMS warning from the merchant.',
          whyItHurts: 'Forgotten free trials become permanent monthly drains. Over a year, ₹1,028/month turns into ₹12,336 given away for apps you rarely open.',
          fixAction: 'Review your RBI Account Aggregator e-mandate registry and cancel unauthorized subscription tokens with one click.',
          fixLink: 'https://sahamati.org.in',
          fixLinkText: 'Sahamati RBI e-Mandate Framework',
          isExternal: true,
        }

      case 'friend-split':
      case 'invoice-discounting':
      case 'supplier-pay-squeeze':
        return {
          aiFound: 'Found ₹1,800 group hangout bill with ₹1,250 pending from 3 friends for over 14 days, with no follow-up reminder sent.',
          whyItHurts: 'Absorbing group dining and movie bills because it feels awkward to ask forces you to delay your own savings goals and tech upgrades.',
          fixAction: 'Open the FINVEXA Hidden Money Finder to generate polite WhatsApp Web reminders with auto-filled UPI payment links.',
          fixLink: '/leaks',
          fixLinkText: 'Open WhatsApp Split Reminder (/leaks)',
          isExternal: false,
        }

      case 'rent-lock':
      case 'cash-reserve-lock':
      case 'raw-material-runout':
        return {
          aiFound: `Untouchable reserve floor of ₹${personaData.lockedReserves.toLocaleString('en-IN')} flagged. Your simulated purchase temporarily dips balance within ₹2,500 of this danger line.`,
          whyItHurts: 'When your balance breaches the rent floor, any bounced auto-debit triggers a ₹590 ECS dishonour penalty and landlord follow-ups.',
          fixAction: 'Lock your survival money into a separate zero-fee digital savings pot before making any major gadget or inventory purchase.',
          fixLink: 'https://sahamati.org.in',
          fixLinkText: 'RBI Safe Account Separation Guide',
          isExternal: true,
        }

      case 'credit-utilization':
      case 'cibil-score-dip':
      case 'working-capital-score':
        return {
          aiFound: 'Simulated 78% credit limit utilization on single card with multiple recent buy-now-pay-later (BNPL) micro-enquiries.',
          whyItHurts: 'Using more than 35% of your available credit limit can drag your CIBIL score down by 25 to 40 points, making future vehicle or education loans much more expensive.',
          fixAction: 'Check your official CIBIL bureau report for free and keep card utilization strictly under 30% using milestone installment splits.',
          fixLink: 'https://www.cibil.com/freecibilscore',
          fixLinkText: 'Official Free CIBIL Bureau Portal',
          isExternal: true,
        }

      case 'stress-shock':
      case 'client-ghosting':
      case 'festive-inventory-shortage':
      default:
        return {
          aiFound: `Stress testing reveals that a 10-day delay in incoming payments turns your projected balance from +₹12,400 to a deficit of −₹${(shortage || 4800).toLocaleString('en-IN')}.`,
          whyItHurts: 'Relying on "clients paying on the exact 1st" creates high anxiety. One delayed payment forces you into emergency borrowing at 24% to 36% APR.',
          fixAction: 'Test your exact cashflow curve on our 90-day simulator and apply a 3-part milestone rescue plan.',
          fixLink: '/simulator',
          fixLinkText: 'Run 90-Day Cashflow Stress Simulator',
          isExternal: false,
        }
    }
  }

  // Icons for the 6 checks
  const getIconForIndex = (idx: number) => {
    switch (idx) {
      case 0:
        return <ShieldAlert size={20} className="text-rose-400" />
      case 1:
        return <Eye size={20} className="text-amber-400" />
      case 2:
        return <TrendingDown size={20} className="text-cyan-400" />
      case 3:
        return <Lock size={20} className="text-emerald-400" />
      case 4:
        return <CreditCard size={20} className="text-violet-400" />
      case 5:
        return <Package size={20} className="text-teal-400" />
      default:
        return <Zap size={20} className="text-yellow-400" />
    }
  }

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header */}
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
            <Sparkles size={13} />
            <span>6-Risk Forensic Radar · Zero Jargon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            6 Risks & Exactly How to Fix Them
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Custom-built for <strong className="text-white">{personaData.label}</strong>. Every card breaks down:
            <span className="text-cyan-300 font-semibold"> (1) What AI Found</span>,
            <span className="text-amber-300 font-semibold"> (2) Why It Hurts You in Simple English</span>, and
            <span className="text-emerald-300 font-semibold"> (3) Actionable Fix Link</span>.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="glass-card px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-slate-700 shrink-0">
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ background: shortage === 0 ? '#10b981' : '#f43f5e' }}
          />
          <div className="text-xs">
            <div className="text-slate-400 uppercase font-mono text-[10px]">Real-Life Radar</div>
            <div className="font-bold text-white">
              {shortage === 0
                ? 'All 6 Checks Safe'
                : `₹${shortage.toLocaleString('en-IN')} Money Squeeze Detected`}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Life Shock Test Buttons */}
      <Tilt3DCard className="glass-card p-4 sm:p-5 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-medium">
            <span className="font-bold text-white">⚡ Test Real-Life Surprises:</span> See what happens if things go wrong right now:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setSimulator({ paymentDelayDays: Math.min(60, simulator.paymentDelayDays + 10) })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Clock size={13} />
              <span>+10 Days Late Pay</span>
            </button>
            <button
              onClick={() =>
                setSimulator({ hiddenCostBuffer: Math.min(25, simulator.hiddenCostBuffer + 6) })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle size={13} />
              <span>+₹5,000 Surprise Fee</span>
            </button>
            <button
              onClick={() =>
                setSimulator({
                  paymentDelayDays: personaData.type === 'salaried' ? 8 : personaData.type === 'freelancer' ? 22 : 25,
                  hiddenCostBuffer: 8,
                })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-colors"
            >
              Reset to Normal
            </button>
          </div>
        </div>
      </Tilt3DCard>

      {/* 6 Unique Expandable Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {personaData.riskCards.map((rc, idx) => {
          const isExpanded = expandedId === rc.id
          const details = getRiskDetails(rc.id)
          const severityColors = {
            safe: { border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'SAFE' },
            warning: { border: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'WARNING' },
            critical: { border: 'border-rose-500/40', text: 'text-rose-400', bg: 'bg-rose-500/10', badge: 'ALERT' },
          }[rc.severity]

          return (
            <Tilt3DCard
              key={rc.id}
              className={`glass-card p-5 border transition-all duration-300 flex flex-col justify-between ${severityColors.border}`}
            >
              <div className="space-y-3.5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700 shrink-0">
                    {getIconForIndex(idx)}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${severityColors.bg} ${severityColors.text} border border-current`}
                  >
                    {severityColors.badge}
                  </span>
                </div>

                {/* Plain-English Titles */}
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{rc.plainTitle}</h3>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{rc.title}</div>
                </div>

                {/* Metric Highlight */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs font-bold text-slate-200">
                  {rc.metricLabel}
                </div>

                {/* Quick Warning Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">{rc.warningText}</p>

                {/* 3 Explicit Breakdown Sections: What AI Found, Why It Hurts, Actionable Fix */}
                {isExpanded ? (
                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                    {/* Section 1: What AI Found */}
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Search size={12} />
                        <span>(1) What AI Found</span>
                      </div>
                      <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
                        {details.aiFound}
                      </p>
                    </div>

                    {/* Section 2: Why It Hurts You in Simple English */}
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle size={12} />
                        <span>(2) Why It Hurts You (Simple English)</span>
                      </div>
                      <p className="text-xs text-rose-100/90 leading-relaxed font-sans">
                        {details.whyItHurts}
                      </p>
                    </div>

                    {/* Section 3: Actionable Fix Link */}
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle size={12} />
                        <span>(3) Actionable Fix</span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                        {details.fixAction}
                      </p>

                      {details.isExternal ? (
                        <a
                          href={details.fixLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                        >
                          <span>{details.fixLinkText}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link
                          to={details.fixLink}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                        >
                          <span>{details.fixLinkText}</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    Tap below to see AI findings, impact, and verified fix link.
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => toggleExpand(rc.id)}
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>{isExpanded ? '▲ Hide 3-Part Breakdown' : '▼ Expand (AI Findings, Impact & Fix)'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </Tilt3DCard>
          )
        })}
      </div>
    </div>
  )
}
