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
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import JudgeValidationPanel from '../components/JudgeValidationPanel'
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
  const { persona, personaData, simulator, setSimulator, themeMode, formatMoney } = useApp()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const isLight = themeMode === 'light'

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
    personaType: persona,
  })

  const { shortage, dscr, isCovenantBreached } = computeRiskMetrics(cashflow, personaData.lockedReserves)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  // Deep dive risk details per risk id
  const getRiskDetails = (id: string): RiskFixDetails => {
    switch (id) {
      case 'treasury-waterfall':
        return {
          aiFound: 'ERP Treasury sync across SAP S/4HANA & Oracle NetSuite reveals a -$340M (-₹2,856 Cr) liquidity deficit window spanning Days 38 to 46 before the $600M milestone arrives.',
          whyItHurts: 'Breaches the mandatory 1.35x Debt Service Coverage Ratio (DSCR) senior bond covenant, exposing the firm to immediate loan acceleration and credit rating downgrade.',
          fixAction: 'Deploy Strategy A (22% Mobilization Advance + 6-Tranche Escrow) or Strategy B (Supply-Chain Reverse Factoring) to eliminate the cash trough.',
          fixLink: '/rescue',
          fixLinkText: 'Open Institutional Rescue Strategies (/rescue)',
          isExternal: false,
        }

      case 'debt-covenant-lock':
        return {
          aiFound: '$420M (₹3,528 Cr) senior bond coupons, 1.35x DSCR covenant floor, and 40,000-employee global payroll ring-fenced.',
          whyItHurts: 'Touching this reserve triggers immediate cross-default clauses with syndicated lending consortia.',
          fixAction: 'Lock liquidity covenants into irrevocable escrow accounts before signing high-CapEx procurement orders.',
          fixLink: '/simulator',
          fixLinkText: 'Inspect Treasury Reserves in Simulator',
          isExternal: false,
        }

      case 'sovereign-sla-lag':
        return {
          aiFound: '48-day counterparty milestone release delay detected across sovereign engineering audit boards and customs clearance.',
          whyItHurts: 'Delays $600M incoming milestone cash while Tier-1 turbine and semiconductor suppliers demand immediate payment.',
          fixAction: 'Require irrevocable standby Letters of Credit (LC) and index payment milestones to independent engineer inspection sign-offs.',
          fixLink: '/scanner',
          fixLinkText: 'Run SWIFT MT700 Forensics (/scanner)',
          isExternal: false,
        }

      case 'macro-fx-escalation':
        return {
          aiFound: '$130M (₹1,092 Cr) in unhedged currency exposure (EUR/USD/INR 4.2% swings), commodity steel escalation, and 0.5%/wk Liquidated Damages (LD) clauses in 400-page RFP contract.',
          whyItHurts: 'Eats into contract profit margins and turns a projected +$530M surplus into an operating shortfall.',
          fixAction: 'Execute 80% FX forward hedges under ISDA master agreements and index vendor contracts to LME steel benchmarks.',
          fixLink: '/rescue',
          fixLinkText: 'Apply 80% FX Hedge Structure (/rescue)',
          isExternal: false,
        }

      case 'enterprise-wire-swift':
        return {
          aiFound: 'Scanned 400-page EPC contract, SWIFT MT700 Letters of Credit, and supplier invoices for shell-company and IBAN spoofing risks.',
          whyItHurts: 'Multi-million dollar unauthorized wires or forged Bank Guarantees can cause unrecoverable balance sheet damage.',
          fixAction: 'Mandate cryptographic ERP 3-way matching and dual treasury officer approval for all wires exceeding $1,000,000.',
          fixLink: '/scanner',
          fixLinkText: 'Inspect EPC Contract Scanner (/scanner)',
          isExternal: false,
        }

      case 'monte-carlo-stress':
        return {
          aiFound: '10,000 quantitative Monte Carlo macroeconomic simulations show 99.2% Value-at-Risk under concurrent FX and supply chain shocks.',
          whyItHurts: 'Multiple systemic disruptions arriving simultaneously breach debt covenants if liquidity buffers are uncalibrated.',
          fixAction: 'Click the one-click shock buttons above to stress-test your treasury against +5% FX shocks, +60d milestone delays, and +12% commodity spikes.',
          fixLink: '/simulator',
          fixLinkText: 'Run Stress Test in Simulator (/simulator)',
          isExternal: false,
        }

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

      default:
        return {
          aiFound: `Calculated from your active purchase plan of ${formatMoney(simulator.decisionCost)} with a ${simulator.paymentDelayDays}-day settlement lag.`,
          whyItHurts: 'Payment lags without milestone advance coverage force you to absorb supplier and living costs out of your own thin emergency pocket.',
          fixAction: 'Use RBI-regulated TReDS or milestone invoice links to convert 45% of order value into upfront working cash today.',
          fixLink: 'https://www.invoicemart.com',
          fixLinkText: 'Invoicemart TReDS Portal',
          isExternal: true,
        }
    }
  }

  const getIconForIndex = (idx: number) => {
    switch (idx) {
      case 0:
        return <Eye size={18} />
      case 1:
        return <Clock size={18} />
      case 2:
        return <TrendingDown size={18} />
      case 3:
        return <Lock size={18} />
      case 4:
        return <CreditCard size={18} />
      case 5:
        return <Package size={18} />
      default:
        return <Zap size={18} />
    }
  }

  return (
    <div className={`space-y-6 sm:space-y-8 animate-fade-in ${isLight ? 'text-slate-900' : 'text-white'}`}>
      {/* 0. Live Goal Quick Edit Bar (Syncs Entire App) */}
      <GoalQuickEditBar />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {persona === 'enterprise'
                ? '6 Institutional Megaproject Risk Defenses'
                : '6 Real-Life Money Safety Checks'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {personaData.emoji} <strong className="text-white">{personaData.label}</strong>: We scanned your transactions and simulated your upcoming contract execution to flag hidden systemic traps before they strike:
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/rescue"
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2 shrink-0 font-bold shadow-lg"
          >
            <Sparkles size={14} />
            <span>{persona === 'enterprise' ? 'See 3 Institutional Fixes' : 'See 3 Easy Fixes'}</span>
          </Link>
          <div
            className={`px-3 py-1.5 rounded-xl font-bold text-xs mono shrink-0 border ${
              shortage === 0
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {persona === 'enterprise'
              ? isCovenantBreached
                ? `🚨 BREACH: −${formatMoney(shortage)} (${dscr}x DSCR)`
                : `✅ AAA COVENANT SAFE (${dscr}x DSCR)`
              : shortage === 0
              ? '✓ 0 Traps Triggered'
              : `⚠ Potential Deficit: ₹${shortage.toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>

      {/* Monte Carlo Macro Stress-Tester / Quick Life Shock Test Buttons */}
      <Tilt3DCard className="bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-medium">
            <span className="font-bold text-white">
              {persona === 'enterprise'
                ? '📊 Monte Carlo Macro Stress-Tester:'
                : '⚡ Test Real-Life Surprises:'}
            </span>{' '}
            {persona === 'enterprise'
              ? 'Inject instant economic shocks to test covenant robustness:'
              : 'See what happens if things go wrong right now:'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {persona === 'enterprise' ? (
              <>
                <button
                  onClick={() =>
                    setSimulator({ hiddenCostBuffer: simulator.hiddenCostBuffer + 5 })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Simulate 5% USD/EUR/INR Currency Devaluation Shock"
                >
                  <Zap size={13} className="text-amber-400" />
                  <span>⚡ FX Currency Shock +5%</span>
                </button>
                <button
                  onClick={() =>
                    setSimulator({ paymentDelayDays: Math.min(120, simulator.paymentDelayDays + 60) })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Simulate 60 Days Sovereign Milestone Sign-Off Delay"
                >
                  <Clock size={13} className="text-rose-400" />
                  <span>⏳ Sovereign Delay +60 Days</span>
                </button>
                <button
                  onClick={() =>
                    setSimulator({ hiddenCostBuffer: simulator.hiddenCostBuffer + 12 })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Simulate 12% Global Steel & Chip Commodity Price Surge"
                >
                  <TrendingDown size={13} className="text-indigo-400" />
                  <span>📈 Commodity Spike +12%</span>
                </button>
                <button
                  onClick={() =>
                    setSimulator({
                      paymentDelayDays: 48,
                      hiddenCostBuffer: 9,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 transition-colors shadow-sm"
                >
                  Reset Macro Shock
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    setSimulator({ paymentDelayDays: Math.min(60, simulator.paymentDelayDays + 10) })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Clock size={13} className="text-amber-400" />
                  <span>+10 Days Late Pay</span>
                </button>
                <button
                  onClick={() =>
                    setSimulator({ hiddenCostBuffer: Math.min(25, simulator.hiddenCostBuffer + 6) })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <AlertTriangle size={13} className="text-rose-400" />
                  <span>+₹5,000 Surprise Fee</span>
                </button>
                <button
                  onClick={() =>
                    setSimulator({
                      paymentDelayDays: personaData.type === 'salaried' ? 8 : personaData.type === 'freelancer' ? 22 : 25,
                      hiddenCostBuffer: 8,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 transition-colors shadow-sm"
                >
                  Reset to Normal
                </button>
              </>
            )}
          </div>
        </div>
      </Tilt3DCard>

      {/* 6 Unique Expandable Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {personaData.riskCards.map((rc, idx) => {
          const isExpanded = expandedId === rc.id
          const details = getRiskDetails(rc.id)
          const severityColors = {
            safe: {
              border: 'border-emerald-500/30 hover:border-emerald-400/50',
              text: 'text-emerald-400',
              bg: 'bg-emerald-500/15',
              badge: 'SAFE',
              iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            },
            warning: {
              border: 'border-amber-500/30 hover:border-amber-400/50',
              text: 'text-amber-400',
              bg: 'bg-amber-500/15',
              badge: 'WARNING',
              iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            },
            critical: {
              border: 'border-rose-500/30 hover:border-rose-400/50',
              text: 'text-rose-400',
              bg: 'bg-rose-500/15',
              badge: 'ALERT',
              iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
            },
          }[rc.severity]

          return (
            <Tilt3DCard
              key={rc.id}
              className={`bg-slate-900/70 backdrop-blur-xl rounded-3xl p-5 border shadow-xl transition-all duration-300 flex flex-col justify-between ${severityColors.border}`}
            >
              <div className="space-y-3.5">
                {/* Card Header with Check Number & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${severityColors.iconBg}`}>
                      {getIconForIndex(idx)}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono">
                        Pitch Check #{rc.checkNumber || idx + 1}
                      </span>
                      <h3 className={`text-sm sm:text-base font-black leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {rc.pitchTitle || rc.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${severityColors.bg} ${severityColors.text} border border-current`}
                  >
                    {severityColors.badge}
                  </span>
                </div>

                {/* Team Pitch Table Question Callout */}
                {rc.pitchQuestion && (
                  <div className={`p-2.5 rounded-xl border font-medium text-xs ${
                    isLight 
                      ? 'bg-blue-50 border-blue-200 text-blue-950 font-semibold' 
                      : 'bg-blue-950/40 border-blue-500/30 text-blue-200'
                  }`}>
                    <span className="text-amber-500 font-black mr-1">❓</span>
                    <span className="italic">"{rc.pitchQuestion}"</span>
                  </div>
                )}

                {/* Pitch Table Core Simple Explanation */}
                {rc.pitchExplanation && (
                  <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {rc.pitchExplanation}
                  </p>
                )}

                {/* Metric Highlight */}
                <div className={`p-2.5 rounded-xl font-mono text-xs font-bold ${
                  isLight 
                    ? 'bg-slate-100 border border-slate-200 text-emerald-700' 
                    : 'bg-slate-950/80 border border-white/10 text-emerald-400'
                }`}>
                  {rc.metricLabel}
                </div>

                {/* Dynamic Scenario Warning */}
                <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {rc.warningText}
                </p>

                {/* 3 Explicit Breakdown Sections: What AI Found, Why It Hurts, Actionable Fix */}
                {isExpanded ? (
                  <div className={`pt-3 border-t space-y-3 animate-in fade-in duration-200 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    {/* Section 1: What AI Found */}
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isLight 
                        ? 'bg-sky-50 border-sky-200 text-sky-950' 
                        : 'bg-sky-950/40 border-sky-500/30 text-sky-100'
                    }`}>
                      <div className="text-[11px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                        <Search size={12} />
                        <span>(1) What AI Found</span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans font-medium">
                        {details.aiFound}
                      </p>
                    </div>

                    {/* Section 2: Why It Hurts You in Simple English */}
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isLight 
                        ? 'bg-rose-50 border-rose-200 text-rose-950' 
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-100'
                    }`}>
                      <div className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle size={12} />
                        <span>(2) Why It Hurts You (Simple English)</span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans font-medium">
                        {details.whyItHurts}
                      </p>
                    </div>

                    {/* Section 3: Actionable Fix Link */}
                    <div className={`p-3 rounded-xl border space-y-2 ${
                      isLight 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                        : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                    }`}>
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle size={12} />
                        <span>(3) Actionable Fix</span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans font-medium">
                        {details.fixAction}
                      </p>

                      {details.isExternal ? (
                        <a
                          href={details.fixLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
                        >
                          <span>{details.fixLinkText}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link
                          to={details.fixLink}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
                        >
                          <span>{details.fixLinkText}</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`text-[11px] italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Tap below to see AI findings, impact, and verified fix link.
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => toggleExpand(rc.id)}
                className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${
                  isLight 
                    ? 'border-slate-200 text-slate-700 hover:text-slate-950' 
                    : 'border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <span>{isExpanded ? '▲ Hide 3-Part Breakdown' : '▼ Expand (AI Findings, Impact & Fix)'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </Tilt3DCard>
          )
        })}
      </div>

      {/* Srujana 2026 Rubric: Judge Validation, Edge-Cases & Limitations Panel */}
      <JudgeValidationPanel />
    </div>
  )
}
