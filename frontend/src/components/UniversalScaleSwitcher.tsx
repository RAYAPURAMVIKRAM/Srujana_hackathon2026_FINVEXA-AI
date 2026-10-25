// src/components/UniversalScaleSwitcher.tsx
import React from 'react'
import {
  GraduationCap,
  Laptop,
  Store,
  Building2,
  ArrowRightLeft,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { useApp, type PersonaType } from '../context/AppContext'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

interface Props {
  compact?: boolean
  showCovenantBadge?: boolean
}

export default function UniversalScaleSwitcher({ compact = false, showCovenantBadge = true }: Props) {
  const {
    persona,
    setPersona,
    enterpriseCurrencyUnit,
    setEnterpriseCurrencyUnit,
    toggleEnterpriseCurrencyUnit,
    themeMode,
    personaData,
    simulator,
  } = useApp()

  const isLight = themeMode === 'light'

  // Compute live DSCR & Covenant status for the active state
  const cashflowPoints = generateCashflow({
    balance: personaData.balance,
    monthlyIncome: personaData.monthlyIncome,
    lockedReserves: personaData.lockedReserves,
    decisionCost: simulator.decisionCost || personaData.defaultDecisionCost,
    paymentDelayDays: simulator.paymentDelayDays,
    upfrontPercent: simulator.upfrontPercent,
    hiddenCostBuffer: simulator.hiddenCostBuffer,
    splitBatches: simulator.splitBatches,
    hiddenLeaks: personaData.hiddenLeaks,
    personaType: persona,
  })

  const { dscr, isCovenantBreached } = computeRiskMetrics(cashflowPoints, personaData.lockedReserves)

  const tiers: {
    id: PersonaType
    label: string
    sublabel: string
    scaleText: string
    icon: React.ReactNode
    badge?: string
    color: string
    activeGradient: string
  }[] = [
    {
      id: 'salaried',
      label: 'Individual / Student',
      sublabel: 'Hostel Rent & Laptop',
      scaleText: '₹55K Scale',
      icon: <GraduationCap size={16} />,
      color: '#3b82f6',
      activeGradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'freelancer',
      label: 'Freelancer / Studio',
      sublabel: 'Studio Rent & Invoices',
      scaleText: '₹45K–₹5L Scale',
      icon: <Laptop size={16} />,
      color: '#f59e0b',
      activeGradient: 'from-amber-500 to-rose-500',
    },
    {
      id: 'business',
      label: 'SME / Factory',
      sublabel: 'Payroll & T-Shirt B2B',
      scaleText: '₹1L–₹5 Cr Scale',
      icon: <Store size={16} />,
      color: '#10b981',
      activeGradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'enterprise',
      label: 'Enterprise Megaproject',
      sublabel: 'High-Speed Rail & Semi Fab EPC',
      scaleText: '$2.4B / ₹20,000 Cr Scale',
      icon: <Building2 size={16} />,
      badge: '👑 FLAGSHIP',
      color: '#0284c7',
      activeGradient: 'from-blue-700 via-sky-600 to-indigo-800',
    },
  ]

  return (
    <div
      className={`w-full rounded-2xl p-2.5 sm:p-3 transition-all duration-300 shadow-lg ${
        persona === 'enterprise'
          ? isLight
            ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-400 text-slate-900 shadow-blue-200/50'
            : 'bg-gradient-to-r from-blue-950/70 via-slate-950/80 to-indigo-950/70 border border-blue-500/40 text-white shadow-blue-950/50'
          : isLight
          ? 'bg-white border-2 border-slate-200 text-slate-900'
          : 'bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white'
      }`}
    >
      {/* Top Header Row: Title & Enterprise Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold">
            ⚡
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black tracking-wider uppercase ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                UNIVERSAL SCALE SWITCHER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/30">
                ₹10K → $10B Institutional Engine
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Covenant Controls when Enterprise is active */}
        {persona === 'enterprise' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Dual Currency Unit Switcher */}
            <div className="flex items-center rounded-xl p-0.5 border border-blue-400/30 bg-blue-500/10 text-xs font-bold">
              <span className="px-2 text-[10px] text-blue-400 uppercase hidden sm:inline">
                Currency:
              </span>
              <button
                type="button"
                onClick={() => setEnterpriseCurrencyUnit('dual')}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
                  enterpriseCurrencyUnit === 'dual'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Display both USD ($B) and INR Crores (₹ Cr)"
              >
                Dual ($ &amp; ₹)
              </button>
              <button
                type="button"
                onClick={() => setEnterpriseCurrencyUnit('usd')}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
                  enterpriseCurrencyUnit === 'usd'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Display in US Dollars ($ Millions / Billions)"
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => setEnterpriseCurrencyUnit('inr')}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
                  enterpriseCurrencyUnit === 'inr'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Display in Indian Rupee Crores (₹ Crores)"
              >
                ₹ INR (Cr)
              </button>
              <button
                type="button"
                onClick={toggleEnterpriseCurrencyUnit}
                className="p-1 text-blue-400 hover:text-blue-300"
                title="Toggle Currency Mode"
              >
                <ArrowRightLeft size={12} />
              </button>
            </div>

            {/* Live FX Badge */}
            <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold hidden md:inline">
              Live FX: 1 USD = ₹84.00
            </span>

            {/* Debt Covenant Status Badge */}
            {showCovenantBadge && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all ${
                  isCovenantBreached
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                }`}
                title={
                  isCovenantBreached
                    ? 'Senior Debt Covenant Breached! DSCR has fallen below the mandatory 1.35x bank threshold.'
                    : 'Senior Debt Covenant Safe! DSCR remains comfortably above 1.35x.'
                }
              >
                {isCovenantBreached ? <ShieldAlert size={13} /> : <ShieldCheck size={13} />}
                <span>
                  {isCovenantBreached
                    ? `🚨 COVENANT BREACH (${dscr}x DSCR)`
                    : `✅ AAA COVENANT SAFE (${dscr}x DSCR)`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4-Tier Interactive Scale Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tiers.map(tier => {
          const isActive = persona === tier.id
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setPersona(tier.id)}
              className={`relative text-left p-2.5 rounded-xl border transition-all duration-200 group flex flex-col justify-between ${
                isActive
                  ? `bg-gradient-to-r ${tier.activeGradient} text-white shadow-md border-transparent scale-[1.01]`
                  : isLight
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-blue-300'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge for Flagship */}
              {tier.badge && (
                <span
                  className={`absolute -top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm tracking-wide ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-blue-600 text-white font-bold'
                  }`}
                >
                  {tier.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`p-1 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isLight
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tier.icon}
                  </span>
                  <span className="text-xs font-black tracking-tight leading-snug">
                    {tier.label}
                  </span>
                </div>
                {!compact && (
                  <div
                    className={`text-[10px] leading-tight truncate ${
                      isActive
                        ? 'text-white/80'
                        : isLight
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {tier.sublabel}
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/10">
                <span
                  className={`text-[11px] font-mono font-black ${
                    isActive
                      ? 'text-white'
                      : isLight
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-100'
                  }`}
                >
                  {tier.scaleText}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isLight
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {isActive ? 'Active' : 'Switch'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
