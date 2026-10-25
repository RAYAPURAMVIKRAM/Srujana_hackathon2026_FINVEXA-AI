// src/pages/CommandCenter.tsx
import { useNavigate } from 'react-router-dom'
import {
  TrendingDown,
  AlertTriangle,
  CreditCard,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import { useApp, PERSONAS } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'
import KpiCard from '../components/KpiCard'
import Tilt3DCard from '../components/Tilt3DCard'
import Interactive3DFinancialCore from '../components/Interactive3DFinancialCore'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

export default function CommandCenter() {
  const { persona, setPersona, personaData, simulator, bankConsent } = useApp()
  const navigate = useNavigate()
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

  const { shortage, valleyDays } = computeRiskMetrics(cashflow, personaData.lockedReserves)

  const liquidityStatus =
    personaData.balance > personaData.lockedReserves * 1.5
      ? 'safe'
      : personaData.balance > personaData.lockedReserves
      ? 'warning'
      : 'critical'

  const stressStatus = shortage === 0 ? 'safe' : shortage < 20000 ? 'warning' : 'critical'
  const creditStatus =
    personaData.creditScore >= 700 ? 'safe' : personaData.creditScore >= 620 ? 'warning' : 'critical'

  const personaKeys: PersonaType[] = ['salaried', 'freelancer', 'business']

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Interactive 3D Hero Banner */}
      <Tilt3DCard
        className="glass-card p-6 md:p-8 relative overflow-hidden border"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: `0 12px 40px ${theme.orb1}`,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border"
              style={{
                borderColor: `${theme.primaryHex}50`,
                background: `${theme.primaryHex}15`,
                color: theme.primaryHex,
              }}
            >
              <Sparkles size={13} className="animate-spin" />
              <span>Universal Financial Digital Twin · Zero Jargon Edition</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                FINVEXA
              </h1>
              <p className="text-sm sm:text-base font-semibold mt-1 tracking-wide" style={{ color: theme.primaryHex }}>
                Universal Financial Digital Twin & Multi-Risk Decision Engine
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Test any big purchase, client invoice, or shop order in <strong>₹ Rupees</strong> before you spend a single Rupee. We simulate the next 90 days of your real life so you never get trapped by late payments or sneaky fees.
            </p>

            {/* Active Persona Story Box */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 backdrop-blur-md flex items-start gap-3">
              <span className="text-2xl mt-0.5">{personaData.emoji}</span>
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Current Real-Life Scenario ({personaData.label})
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  "{personaData.story}"
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => navigate('/simulator')}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 font-bold shadow-lg"
                style={{ background: theme.buttonGradient }}
              >
                <span>Launch 90-Day Money Simulator</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/rescue')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Flame size={14} className="text-amber-400" />
                <span>See 3 Easy Ways to Fix This</span>
              </button>
            </div>
          </div>

          {/* Hero Right 3D Interactive Core Widget */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-2">
            <Interactive3DFinancialCore
              shortage={shortage}
              size={240}
              label={`${personaData.label} Shield`}
            />
          </div>
        </div>
      </Tilt3DCard>

      {/* RBI Account Aggregator Live Feed Banner */}
      {bankConsent.isLinked && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>
              <strong className="text-white">RBI Account Aggregator Live Feed Active:</strong> {bankConsent.bankName} ({bankConsent.accountMasked})
            </span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 self-start sm:self-auto">
            100% Read-Only Protected · Sahamati Standard
          </span>
        </div>
      )}

      {/* 2. Plain-English KPI Cards (8th-Grade Language) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              Money Health Right Now
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live bank status with zero complex financial formulas
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {personaData.emoji} {personaData.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            label="Money Safe in Bank Right Now"
            value={`₹${personaData.balance.toLocaleString('en-IN')}`}
            sub={`Untouchable: ₹${personaData.lockedReserves.toLocaleString('en-IN')}`}
            status={liquidityStatus}
            icon={<CreditCard size={18} />}
            trend={
              liquidityStatus === 'safe'
                ? '↑ Safe balance above rent & fees'
                : '⚠ Very close to your untouchable money'
            }
          />
          <KpiCard
            label="How Much Money You Will Be Short Next Month"
            value={shortage > 0 ? `−₹${shortage.toLocaleString('en-IN')}` : '₹0'}
            sub={shortage > 0 ? `In the danger zone for ${valleyDays} days` : 'Zero cash shortage projected'}
            status={stressStatus}
            icon={<TrendingDown size={18} />}
            trend={
              shortage === 0
                ? '✓ 100% Cash-flow positive after all bills'
                : `Shortage of ₹${shortage.toLocaleString('en-IN')} if you buy today`
            }
          />
          <KpiCard
            label="Sneaky Hidden Fees & Forgotten Bills"
            value={`₹${personaData.hiddenLeaks.toLocaleString('en-IN')}/mo`}
            sub="Auto-debits, food delivery surge & fees"
            status="warning"
            icon={<AlertTriangle size={18} />}
            trend="Found 3 easy leaks you can cancel today"
          />
          <KpiCard
            label="Loan Trust Score & How to Get Approved Fast"
            value={`${personaData.creditScore} / 850`}
            sub="Bank & EMI credit trust rating"
            status={creditStatus}
            icon={<Zap size={18} />}
            trend={creditStatus === 'safe' ? 'Eligible for 0-paperwork approval' : 'Pay bills on time to hit 720+'}
          />
        </div>
      </div>

      {/* 3. 100% Unique Personas Selector */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">👥</span> Choose Your Life Situation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap a profile below to load completely different numbers, story, hidden risks, and smart rescue plans:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personaKeys.map(key => {
            const p = PERSONAS[key]
            const active = persona === key
            return (
              <Tilt3DCard
                key={key}
                onClick={() => setPersona(key)}
                className={`glass-card p-6 text-left cursor-pointer transition-all duration-300 border ${
                  active
                    ? 'border-white/40 shadow-2xl scale-[1.02]'
                    : 'border-slate-800/80 hover:border-slate-600'
                }`}
                style={{
                  background: active ? `${p.theme.primaryHex}15` : undefined,
                  boxShadow: active ? `0 0 30px ${p.theme.primaryHex}35` : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{p.emoji}</div>
                  {active ? (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border shadow-sm"
                      style={{ background: p.theme.buttonGradient, borderColor: 'rgba(255,255,255,0.4)' }}
                    >
                      Active Profile
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 hover:text-white transition-colors">
                      Switch →
                    </span>
                  )}
                </div>

                <div className="font-bold text-white text-base">{p.label}</div>
                <div className="text-xs mt-1.5 text-slate-300 font-medium leading-relaxed">
                  "{p.story}"
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Bank: ₹{(p.balance / 1000).toFixed(0)}K</span>
                  <span>Untouchable: ₹{(p.lockedReserves / 1000).toFixed(0)}K</span>
                  <span className="text-emerald-400 font-semibold">{p.purchaseLabel.split(' ')[0]}</span>
                </div>
              </Tilt3DCard>
            )
          })}
        </div>
      </div>

      {/* 4. Instant Action Callout */}
      <Tilt3DCard
        className="glass-card p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 border"
        style={{
          borderColor: 'rgba(255,255,255,0.12)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <h3 className="text-white font-bold text-base sm:text-lg">
              Want to see what happens before spending ₹{simulator.decisionCost.toLocaleString('en-IN')}?
            </h3>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Move sliders for <strong className="text-white">{personaData.sliderLabels.decisionCost}</strong> and{' '}
            <strong className="text-white">{personaData.sliderLabels.paymentDelay}</strong>. Our 90-day chart shows you the exact day your money drops, and gives you 3 easy solutions to fix it.
          </p>
        </div>
        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary shrink-0 text-xs py-3 px-6 flex items-center gap-2 font-bold shadow-lg"
          style={{ background: theme.buttonGradient }}
        >
          <span>Open Sliders & Charts</span>
          <ArrowRight size={16} />
        </button>
      </Tilt3DCard>
    </div>
  )
}
