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
  CheckCircle2,
  Package,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border mb-2"
            style={{
              borderColor: `${theme.primaryHex}50`,
              background: `${theme.primaryHex}15`,
              color: theme.primaryHex,
            }}
          >
            <Sparkles size={13} />
            <span>6-Check Safety Radar · Zero Complex Math</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            6 Things That Could Go Wrong With Your Money
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Custom-built for <strong className="text-white">{personaData.label}</strong>. We scanned your scenario for fake proofs, unexpected fees, rent traps, and payment delays:
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

      {/* 6 Unique Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {personaData.riskCards.map((rc, idx) => {
          const isExpanded = expandedId === rc.id
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
              <div className="space-y-3">
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

                {/* Warning Text */}
                <p className="text-xs text-slate-300 leading-relaxed">{rc.warningText}</p>

                {/* Expandable Actionable Advice */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5 animate-fade-in text-emerald-300">
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>How to fix this easily:</span>
                    </div>
                    <p className="text-slate-300 pl-4">{rc.advice}</p>
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => toggleExpand(rc.id)}
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
              >
                <span>{isExpanded ? 'Hide Advice' : 'View Fix Advice'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </Tilt3DCard>
          )
        })}
      </div>
    </div>
  )
}
