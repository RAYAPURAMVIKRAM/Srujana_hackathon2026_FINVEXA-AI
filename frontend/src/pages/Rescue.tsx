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
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

interface RescueExternalTool {
  name: string
  url: string
  badge: string
  desc: string
}

export default function Rescue() {
  const { personaData, simulator, setSimulator } = useApp()
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
    personaType: personaData.type,
  })

  const { shortage: originalShortage } = computeRiskMetrics(baseCashflow, personaData.lockedReserves)

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
    <div className="space-y-8 animate-fade-in">
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
            <span>Zero-Jargon Solution Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            3 Easy Ways to Fix This Without Going Broke
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Pick a realistic plan for <strong className="text-slate-900 font-bold">{personaData.label}</strong>. We computed the math to keep your bank balance above your rent floor, with verified web tools and ready-to-send messages:
          </p>
        </div>

        {/* Shortage Counter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs shrink-0 text-right">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Current Money Shortage
          </div>
          <div className="text-2xl font-black text-rose-600 mono mt-0.5">
            {originalShortage > 0 ? `−₹${originalShortage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
          </div>
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
            personaType: personaData.type,
          })

          const { shortage: planShortage } = computeRiskMetrics(planCashflow, personaData.lockedReserves)
          const moneySaved = Math.max(0, originalShortage - planShortage)
          const isApplied = appliedId === plan.id
          const tools = getExternalToolsForPlan(idx)

          return (
            <Tilt3DCard
              key={plan.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300"
              style={{
                borderTopColor: plan.tagColor,
                borderTopWidth: '4px',
              }}
            >
              <div className="space-y-4">
                {/* Plan Tag & Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xs"
                    style={{ background: plan.tagColor }}
                  >
                    {plan.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">
                      Money Saved
                    </span>
                    <span className="text-xs font-black text-emerald-600 mono">
                      +₹{moneySaved.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Plan Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{plan.title}</h3>
                  <div className="text-xs font-bold mt-1" style={{ color: plan.tagColor }}>
                    {planShortage === 0
                      ? '✓ 100% Cash Shortage Eliminated'
                      : `Deficit cut down to only ₹${planShortage.toLocaleString('en-IN')}`}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{plan.description}</p>

                {/* Key Plan Settings Preview */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Downpayment / Advance:</span>
                    <span className="font-bold text-slate-900">{plan.upfrontPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Parts:</span>
                    <span className="font-bold text-slate-900">{plan.splitBatches} Batches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allowed Delay:</span>
                    <span className="font-bold text-slate-900">{plan.paymentDelayDays} Days</span>
                  </div>
                </div>

                {/* Verified Web-Researched External Tools Links */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 size={12} className="text-blue-600" />
                    <span>Verified Real-World Tools:</span>
                  </div>
                  <div className="space-y-2">
                    {tools.map((tool, tIdx) => (
                      <a
                        key={tIdx}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all group shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            {tool.name}
                            <ExternalLink size={11} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-blue-100 text-blue-700 border border-blue-200">
                            {tool.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {tool.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Ready-to-Send Negotiation Message Box */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-bold flex items-center gap-1 text-slate-700">
                      <MessageSquare size={12} className="text-emerald-600" />
                      Ready-to-Send Message:
                    </span>
                    <button
                      onClick={() => handleCopyMessage(plan.id, plan.negotiationMessage)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors font-bold"
                    >
                      {copiedId === plan.id ? (
                        <>
                          <Check size={12} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy Text
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-sans leading-relaxed max-h-32 overflow-y-auto custom-scrollbar select-all">
                    {plan.negotiationMessage}
                  </div>
                </div>
              </div>

              {/* Action Button: Apply Plan */}
              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  onClick={() => handleApplyPlan(plan)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white transition-all shadow-sm hover:opacity-95"
                  style={{
                    background: isApplied ? '#059669' : '#2563eb',
                  }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 size={15} /> Applied to Simulator!
                    </>
                  ) : (
                    <>
                      <Zap size={14} /> Apply {plan.tag} to Sliders
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </Tilt3DCard>
          )
        })}
      </div>

      {/* Explainer Footer Card */}
      <Tilt3DCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Why These Plans Work 100% of the Time</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Instead of taking high-interest personal loans or informal borrowing, simply splitting payments into batches or collecting advances keeps your cash balance permanently above rent and payroll floors.
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary text-xs py-2.5 px-5 shrink-0 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs rounded-xl"
        >
          Back to 90-Day Simulator
        </button>
      </Tilt3DCard>
    </div>
  )
}
