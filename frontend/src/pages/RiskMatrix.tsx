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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mb-2 shadow-xs"
            style={{
              borderColor: `${theme.primaryHex}40`,
              background: `${theme.primaryHex}10`,
              color: theme.primaryHex,
            }}
          >
            <Sparkles size={13} />
            <span>6-Risk Forensic Radar · Zero Jargon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            6 Risks & Exactly How to Fix Them
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Custom-built for <strong className="text-slate-900 font-bold">{personaData.label}</strong>. Every card breaks down:
            <span className="text-sky-700 font-bold"> (1) What AI Found</span>,
            <span className="text-rose-700 font-bold"> (2) Why It Hurts You in Simple English</span>, and
            <span className="text-emerald-700 font-bold"> (3) Actionable Fix Link</span>.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="bg-white px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-slate-200 shadow-xs shrink-0">
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ background: shortage === 0 ? '#059669' : '#dc2626' }}
          />
          <div className="text-xs">
            <div className="text-slate-500 uppercase font-mono text-[10px] font-bold">Real-Life Radar</div>
            <div className="font-black text-slate-900">
              {shortage === 0
                ? 'All 6 Checks Safe'
                : `₹${shortage.toLocaleString('en-IN')} Money Squeeze Detected`}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Life Shock Test Buttons */}
      <Tilt3DCard className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-700 font-medium">
            <span className="font-bold text-slate-900">⚡ Test Real-Life Surprises:</span> See what happens if things go wrong right now:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setSimulator({ paymentDelayDays: Math.min(60, simulator.paymentDelayDays + 10) })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Clock size={13} className="text-amber-600" />
              <span>+10 Days Late Pay</span>
            </button>
            <button
              onClick={() =>
                setSimulator({ hiddenCostBuffer: Math.min(25, simulator.hiddenCostBuffer + 6) })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <AlertTriangle size={13} className="text-rose-600" />
              <span>+₹5,000 Surprise Fee</span>
            </button>
            <button
              onClick={() =>
                setSimulator({
                  paymentDelayDays: personaData.type === 'salaried' ? 8 : personaData.type === 'freelancer' ? 22 : 25,
                  hiddenCostBuffer: 8,
                })
              }
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-xs"
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
            safe: { border: 'border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50', badge: 'SAFE', iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            warning: { border: 'border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', badge: 'WARNING', iconBg: 'bg-amber-50 text-amber-600 border-amber-200' },
            critical: { border: 'border-rose-200', text: 'text-rose-700', bg: 'bg-rose-50', badge: 'ALERT', iconBg: 'bg-rose-50 text-rose-600 border-rose-200' },
          }[rc.severity]

          return (
            <Tilt3DCard
              key={rc.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all duration-300 flex flex-col justify-between hover:shadow-md ${severityColors.border}`}
            >
              <div className="space-y-3.5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${severityColors.iconBg}`}>
                    {getIconForIndex(idx)}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${severityColors.bg} ${severityColors.text} border border-current`}
                  >
                    {severityColors.badge}
                  </span>
                </div>

                {/* Plain-English Titles */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{rc.plainTitle}</h3>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">{rc.title}</div>
                </div>

                {/* Metric Highlight */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-800">
                  {rc.metricLabel}
                </div>

                {/* Quick Warning Summary */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rc.warningText}</p>

                {/* 3 Explicit Breakdown Sections: What AI Found, Why It Hurts, Actionable Fix */}
                {isExpanded ? (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                    {/* Section 1: What AI Found */}
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                        <Search size={12} className="text-sky-600" />
                        <span>(1) What AI Found</span>
                      </div>
                      <p className="text-xs text-sky-900 leading-relaxed font-sans font-medium">
                        {details.aiFound}
                      </p>
                    </div>

                    {/* Section 2: Why It Hurts You in Simple English */}
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle size={12} className="text-rose-600" />
                        <span>(2) Why It Hurts You (Simple English)</span>
                      </div>
                      <p className="text-xs text-rose-900 leading-relaxed font-sans font-medium">
                        {details.whyItHurts}
                      </p>
                    </div>

                    {/* Section 3: Actionable Fix Link */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-emerald-600" />
                        <span>(3) Actionable Fix</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed font-sans font-medium">
                        {details.fixAction}
                      </p>

                      {details.isExternal ? (
                        <a
                          href={details.fixLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                        >
                          <span>{details.fixLinkText}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link
                          to={details.fixLink}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                        >
                          <span>{details.fixLinkText}</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic">
                    Tap below to see AI findings, impact, and verified fix link.
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => toggleExpand(rc.id)}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
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
