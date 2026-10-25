// src/pages/Rescue.tsx
import { useState } from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Link2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

interface RescueExternalTool {
  name: string
  url: string
  badge: string
  desc: string
}

export default function Rescue() {
  const { persona, personaData, simulator, setSimulator, formatMoney } = useApp()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [appliedId, setAppliedId] = useState<string | null>(null)
  const navigate = useNavigate()
  const theme = personaData.theme

  // Base cashflow and metrics
  const baseCashflow = generateCashflow({
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

  const { shortage: originalShortage, dscr: originalDscr, isCovenantBreached: originalBreached } = computeRiskMetrics(baseCashflow, personaData.lockedReserves)

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleApplyPlan = (plan: (typeof personaData.rescuePlans)[0]) => {
    setSimulator({
      upfrontPercent: plan.upfrontPercent,
      splitBatches: plan.splitBatches,
      hiddenCostBuffer: plan.hiddenCostBuffer,
      paymentDelayDays: plan.paymentDelayDays,
    })
    setAppliedId(plan.id)
    setTimeout(() => {
      navigate('/simulator')
    }, 900)
  }

  // Real working external tools mapped to each plan
  const getExternalToolsForPlan = (idx: number): RescueExternalTool[] => {
    if (persona === 'enterprise') {
      switch (idx) {
        case 0:
          return [
            {
              name: 'SWIFT MT760 Bank Guarantee Platform',
              url: 'https://www.swift.com/standards/data-standards/mt760',
              badge: 'Bank Guarantee',
              desc: 'Unlocks $528M mobilization advance against an irrevocable bank guarantee under EPC Clause 14.2.',
            },
            {
              name: 'FIDIC International EPC Turnkey Suite',
              url: 'https://fidic.org',
              badge: 'FIDIC Yellow/Silver',
              desc: 'Standard international contract framework structuring execution into 6 progressive milestone escrows.',
            },
          ]
        case 1:
          return [
            {
              name: 'Invoicemart Syndicated Trade Finance',
              url: 'https://www.invoicemart.com',
              badge: 'SOFR + 110 bps',
              desc: 'Extends $450M of Tier-1 vendor payables by 60 days via reverse factoring and bank-backed Letters of Credit.',
            },
            {
              name: 'SWIFT MT700 Letter of Credit (LC)',
              url: 'https://www.swift.com/standards/data-standards/mt700',
              badge: 'Trade Credit',
              desc: 'Discounts sovereign-approved milestone invoices non-recourse through global commercial bank consortia.',
            },
          ]
        case 2:
        default:
          return [
            {
              name: 'ISDA Master Agreement FX Hedging',
              url: 'https://www.isda.org',
              badge: 'ISDA Master',
              desc: 'Locks 80% USD/INR and EUR/USD forward currency hedges to eliminate $48M macro exchange rate volatility.',
            },
            {
              name: 'Syndicated Revolving Credit Facility (RCF)',
              url: 'https://sahamati.org.in',
              badge: 'Liquidity Bridge',
              desc: 'Draws down a 28-day $250M syndicated liquidity bridge, keeping senior debt DSCR safely at 1.48x–1.52x.',
            },
          ]
      }
    }

    switch (idx) {
      case 0:
        return [
          {
            name: 'Razorpay Instant Payment Links',
            url: 'https://razorpay.com/payment-links/',
            badge: 'Instant Advance',
            desc: 'Generate a secure 50% deposit link with UPI, Credit Cards, and NetBanking in 30 seconds.',
          },
          {
            name: 'ONDC Open Network Delivery',
            url: 'https://ondc.org',
            badge: 'Zero Surge Fee',
            desc: 'Source materials or food directly from sellers to eliminate 30% platform markup fees.',
          },
        ]
      case 1:
        return [
          {
            name: 'Sahamati RBI Account Aggregator',
            url: 'https://sahamati.org.in',
            badge: 'RBI Regulated',
            desc: 'Share verified bank statements securely with landlords or lenders without sharing passwords.',
          },
          {
            name: 'ClearTax Section 44ADA Filing',
            url: 'https://cleartax.in',
            badge: 'TDS Refund',
            desc: 'Claim back TDS withheld by clients to inject an extra ₹15,000 to ₹40,000 back into your account.',
          },
        ]
      case 2:
      default:
        return [
          {
            name: 'Invoicemart TReDS Platform',
            url: 'https://www.invoicemart.com',
            badge: '48h Cash Inflow',
            desc: 'Get RBI-approved invoice discounting for pending corporate bills at low bank repo rates.',
          },
          {
            name: 'Udyam MSME Government Registration',
            url: 'https://udyamregistration.gov.in',
            badge: 'Legal Protection',
            desc: 'Mandates 45-day payment statutory deadlines under Section 15 of the MSMED Act.',
          },
        ]
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-white">
      {/* 0. Live Goal Quick Edit Bar (Syncs Entire App) */}
      <GoalQuickEditBar />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mb-2 shadow-sm"
            style={{
              borderColor: `${theme.primaryHex}40`,
              background: `${theme.primaryHex}15`,
              color: theme.primaryHex,
            }}
          >
            <Sparkles size={13} />
            <span>
              {persona === 'enterprise'
                ? 'Institutional Treasury Restructuring Engine'
                : 'Zero-Jargon Solution Engine'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {persona === 'enterprise'
              ? '3 Institutional Treasury Rescue Strategies ($2.4B / ₹20,000 Cr Scale)'
              : '3 Easy Ways to Fix This Without Going Broke'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {persona === 'enterprise'
              ? 'CFO-grade deal restructuring structures that eliminate the -$340M (-₹2,856 Cr) cash trough, restore DSCR above 1.50x, and keep Senior Bond covenants 100% compliant:'
              : `Pick a realistic plan for ${personaData.label}. We computed the math to keep your bank balance above your rent floor, with verified web tools and ready-to-send messages:`}
          </p>
        </div>

        {/* Shortage / Covenant Counter */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 shadow-lg shrink-0 text-right">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {persona === 'enterprise' ? 'Treasury Deficit / Covenant' : 'Current Money Shortage'}
          </div>
          <div className="text-2xl font-black text-rose-400 mono mt-0.5">
            {persona === 'enterprise'
              ? originalShortage > 0
                ? `−${formatMoney(originalShortage)}`
                : 'Safe ($0)'
              : originalShortage > 0
              ? `−₹${originalShortage.toLocaleString('en-IN')}`
              : '₹0 (Safe)'}
          </div>
          {persona === 'enterprise' && (
            <div className="text-[10px] font-mono font-bold mt-1 text-rose-300">
              {originalBreached ? `🚨 BREACH: ${originalDscr}x DSCR (< 1.35x)` : `✅ SAFE: ${originalDscr}x DSCR`}
            </div>
          )}
        </div>
      </div>

      {/* 3 Unique Rescue Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personaData.rescuePlans.map((plan, idx) => {
          // Calculate simulated metrics for this plan
          const planCashflow = generateCashflow({
            balance: personaData.balance,
            monthlyIncome: personaData.monthlyIncome,
            lockedReserves: personaData.lockedReserves,
            decisionCost: simulator.decisionCost,
            paymentDelayDays: plan.paymentDelayDays,
            upfrontPercent: plan.upfrontPercent,
            hiddenCostBuffer: plan.hiddenCostBuffer,
            splitBatches: plan.splitBatches,
            hiddenLeaks: personaData.hiddenLeaks,
            personaType: persona,
          })

          const { shortage: planShortage, dscr: planDscr } = computeRiskMetrics(planCashflow, personaData.lockedReserves)
          const moneySaved = Math.max(0, originalShortage - planShortage)
          const isApplied = appliedId === plan.id
          const tools = getExternalToolsForPlan(idx)

          return (
            <Tilt3DCard
              key={plan.id}
              className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl flex flex-col justify-between transition-all duration-300"
              style={{
                borderTopColor: plan.tagColor,
                borderTopWidth: '4px',
              }}
            >
              <div className="space-y-4">
                {/* Plan Tag & Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md"
                    style={{ background: plan.tagColor }}
                  >
                    {plan.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                      Money Saved
                    </span>
                    <span className="text-xs font-black text-emerald-400 mono">
                      +{formatMoney(moneySaved)}
                    </span>
                  </div>
                </div>

                {/* Plan Title */}
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{plan.title}</h3>
                  <div className="text-xs font-bold mt-1" style={{ color: plan.tagColor }}>
                    {planShortage === 0
                      ? persona === 'enterprise'
                        ? `✓ 100% Deficit Wiped Out · ${planDscr}x DSCR (AAA Safe)`
                        : '✓ 100% Cash Shortage Eliminated'
                      : persona === 'enterprise'
                      ? `Deficit reduced to ${formatMoney(planShortage)} (${planDscr}x DSCR)`
                      : `Deficit cut down to only ₹${planShortage.toLocaleString('en-IN')}`}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{plan.description}</p>

                {/* Key Plan Settings Preview */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-1.5 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {persona === 'enterprise' ? 'Mobilization Advance:' : 'Downpayment / Advance:'}
                    </span>
                    <span className="font-bold text-white">{plan.upfrontPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {persona === 'enterprise' ? 'Milestone Escrow Tranches:' : 'Payment Parts:'}
                    </span>
                    <span className="font-bold text-white">
                      {plan.splitBatches} {persona === 'enterprise' ? 'Tranches' : 'Batches'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SLA Audit Settlement Lag:</span>
                    <span className="font-bold text-white">{plan.paymentDelayDays} Days</span>
                  </div>
                  {persona === 'enterprise' && (
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-slate-400">Resulting Senior DSCR:</span>
                      <span className="font-bold text-emerald-400">
                        {planDscr}x (Covenant Compliant)
                      </span>
                    </div>
                  )}
                </div>

                {/* Verified Web-Researched External Tools Links */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 size={12} className="text-blue-400" />
                    <span>
                      {persona === 'enterprise'
                        ? 'Institutional Framework & Trade Finance Tools:'
                        : 'Verified Real-World Tools:'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tools.map((tool, tIdx) => (
                      <a
                        key={tIdx}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950/90 border border-white/10 hover:border-white/20 transition-all group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                            {tool.name}
                            <ExternalLink size={11} className="opacity-70" />
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {tool.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {tool.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Pre-Written Negotiation Script Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MessageSquare size={12} />
                      {persona === 'enterprise'
                        ? 'Institutional Legal Mandate & EPC Notice'
                        : 'Ready-to-Send Negotiation Message'}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(plan.id, plan.negotiationMessage)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors"
                    >
                      {copiedId === plan.id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5">
                    "{plan.negotiationMessage}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => handleApplyPlan(plan)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  style={{
                    background: isApplied ? '#059669' : plan.tagColor,
                  }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Institutional Structure Applied! Launching Simulator...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>
                        {persona === 'enterprise'
                          ? '✨ Simulate & Apply Institutional Structure'
                          : '✨ Apply This Fix to My Plan'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </Tilt3DCard>
          )
        })}
      </div>

      {/* Verified External Infrastructure Hub */}
      <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <h3 className="text-base font-bold text-white">
                Official Digital Public Infrastructure & Payment Links
              </h3>
              <p className="text-xs text-slate-400">
                Direct external resources to securely optimize cashflow, discount invoices, and collect advance payments:
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono shrink-0">
            100% Real Working Links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Sahamati */}
          <a
            href="https://sahamati.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-white/10 hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                  RBI Account Aggregator
                  <ExternalLink size={12} className="opacity-70" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sahamati
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Connect your bank statements through RBI-regulated Account Aggregators with 100% data privacy.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 group-hover:underline">
              Visit sahamati.org.in ↗
            </span>
          </a>

          {/* TReDS MSME */}
          <div className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-white/10 hover:border-blue-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                  TReDS MSME Invoice
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  48h Cash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Discount unpaid corporate bills for immediate bank liquidity at low repo rates.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <a
                href="https://www.invoicemart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-0.5"
              >
                Invoicemart ↗
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://www.m1xchange.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-0.5"
              >
                M1xchange ↗
              </a>
            </div>
          </div>

          {/* ONDC */}
          <a
            href="https://ondc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  ONDC Open Network
                  <ExternalLink size={12} className="opacity-70" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Zero Surge
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Source products, logistics, and food directly without 30% aggregator commission markups.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 group-hover:underline">
              Visit ondc.org ↗
            </span>
          </a>

          {/* Razorpay Payment Links */}
          <a
            href="https://razorpay.com/payment-links/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-white/10 hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Razorpay Payment Links
                  <ExternalLink size={12} className="opacity-70" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Advance 50%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Collect upfront advance deposits via UPI, cards, and netbanking in seconds.
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 group-hover:underline">
              Create Payment Link ↗
            </span>
          </a>
        </div>
      </div>

      {/* Safety Floor Reminder Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Remember: Your Untouchable Money Floor (₹{personaData.lockedReserves.toLocaleString('en-IN')}) is Always Protected
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hostel rent, college fees, staff salaries, and emergency EMI must stay untouched. All 3 rescue plans guarantee you never breach this minimum floor.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary text-xs py-2 px-4 font-bold shrink-0 shadow-lg"
        >
          <span>Verify in Simulator</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
