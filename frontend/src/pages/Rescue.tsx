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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

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

  return (
    <div className="space-y-8 animate-fade-in">
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
            <span>Zero-Jargon Solution Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            3 Easy Ways to Fix This Without Going Broke
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Pick a realistic plan for <strong className="text-white">{personaData.label}</strong>. We computed the math to keep your bank balance above your rent floor, with ready-to-send messages for WhatsApp & Email:
          </p>
        </div>

        {/* Shortage Counter */}
        <div className="glass-card p-4 rounded-2xl border border-slate-700/80 shrink-0 text-right">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Current Money Shortage
          </div>
          <div className="text-2xl font-black text-rose-400 mono mt-0.5">
            {originalShortage > 0 ? `−₹${originalShortage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
          </div>
        </div>
      </div>

      {/* 3 Unique Rescue Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personaData.rescuePlans.map((plan) => {
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

          return (
            <Tilt3DCard
              key={plan.id}
              className="glass-card p-6 border flex flex-col justify-between transition-all duration-300"
              style={{
                borderColor: `${plan.tagColor}40`,
                boxShadow: `0 8px 30px ${plan.tagColor}20`,
              }}
            >
              <div className="space-y-4">
                {/* Plan Tag & Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 shadow-md"
                    style={{ background: plan.tagColor }}
                  >
                    {plan.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Money Saved
                    </span>
                    <span className="text-xs font-bold text-emerald-400 mono">
                      +₹{moneySaved.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Plan Title */}
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{plan.title}</h3>
                  <div className="text-xs font-semibold mt-1" style={{ color: plan.tagColor }}>
                    {planShortage === 0
                      ? '✓ 100% Cash Shortage Eliminated'
                      : `Deficit cut down to only ₹${planShortage.toLocaleString('en-IN')}`}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{plan.description}</p>

                {/* Key Plan Settings Preview */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Downpayment / Advance:</span>
                    <span className="font-bold text-white">{plan.upfrontPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Parts:</span>
                    <span className="font-bold text-white">{plan.splitBatches} Batches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allowed Delay:</span>
                    <span className="font-bold text-white">{plan.paymentDelayDays} Days</span>
                  </div>
                </div>

                {/* Ready-to-Send Negotiation Message Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold flex items-center gap-1 text-slate-300">
                      <MessageSquare size={12} className="text-emerald-400" />
                      Ready-to-Send Message:
                    </span>
                    <button
                      onClick={() => handleCopyMessage(plan.id, plan.negotiationMessage)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors font-bold"
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
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[11px] text-slate-300 font-sans leading-relaxed max-h-36 overflow-y-auto custom-scrollbar select-all">
                    {plan.negotiationMessage}
                  </div>
                </div>
              </div>

              {/* Action Button: Apply Plan */}
              <div className="pt-5 mt-5 border-t border-slate-800">
                <button
                  onClick={() => handleApplyPlan(plan)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white transition-all shadow-md hover:scale-[1.02]"
                  style={{
                    background: isApplied ? '#10b981' : theme.buttonGradient,
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
      <Tilt3DCard className="glass-card p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Why These Plans Work 100% of the Time</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Instead of taking high-interest loans, simply splitting payments into batches or collecting advances keeps your cash balance permanently above rent and payroll floors.
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary text-xs py-2.5 px-5 shrink-0 font-bold"
          style={{ background: theme.buttonGradient }}
        >
          Back to 90-Day Simulator
        </button>
      </Tilt3DCard>
    </div>
  )
}
