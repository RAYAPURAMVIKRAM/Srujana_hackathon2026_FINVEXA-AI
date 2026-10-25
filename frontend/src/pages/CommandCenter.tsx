// src/pages/CommandCenter.tsx
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Shield,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Activity,
  UserCheck,
  Search,
  AlertTriangle,
  GitCompare,
  Target,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import KpiCard from '../components/KpiCard'
import Tilt3DCard from '../components/Tilt3DCard'
import Interactive3DFinancialCore from '../components/Interactive3DFinancialCore'
import AiBankingChatbot from '../components/AiBankingChatbot'
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

export default function CommandCenter() {
  const { personaData, simulator, bankConsent, userGoal, themeMode, t } = useApp()
  const navigate = useNavigate()
  const theme = personaData.theme
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
    personaType: personaData.type,
  })

  const { shortage } = computeRiskMetrics(cashflow, personaData.lockedReserves)

  const liquidityStatus =
    personaData.balance > personaData.lockedReserves * 1.5
      ? 'safe'
      : personaData.balance > personaData.lockedReserves
      ? 'warning'
      : 'critical'

  // Team Pitch Table: 6 Core Checks definitions
  const pitchChecks = [
    {
      num: 1,
      icon: Activity,
      title: t('check1.title'),
      question: t('check1.question'),
      desc: t('check1.desc'),
      statusBadge: shortage === 0 ? 'SAFE' : `DEFICIT: ₹${shortage.toLocaleString('en-IN')}`,
      statusType: shortage === 0 ? 'safe' : 'critical',
      liveMetric: `Simulating ₹${simulator.decisionCost.toLocaleString('en-IN')} spend`,
    },
    {
      num: 2,
      icon: Lock,
      title: t('check2.title'),
      question: t('check2.question'),
      desc: t('check2.desc'),
      statusBadge: '100% PROTECTED',
      statusType: 'safe',
      liveMetric: `₹${personaData.lockedReserves.toLocaleString('en-IN')} locked for EMIs & rent`,
    },
    {
      num: 3,
      icon: UserCheck,
      title: t('check3.title'),
      question: t('check3.question'),
      desc: t('check3.desc'),
      statusBadge: `${simulator.paymentDelayDays}D DELAY TESTED`,
      statusType: simulator.paymentDelayDays > 15 ? 'warning' : 'safe',
      liveMetric: `Requires ${simulator.upfrontPercent}% advance`,
    },
    {
      num: 4,
      icon: Search,
      title: t('check4.title'),
      question: t('check4.question'),
      desc: t('check4.desc'),
      statusBadge: `₹${personaData.hiddenLeaks}/MO SCANNED`,
      statusType: 'warning',
      liveMetric: 'Delivery surge & auto-debits audited',
    },
    {
      num: 5,
      icon: AlertTriangle,
      title: t('check5.title'),
      question: t('check5.question'),
      desc: t('check5.desc'),
      statusBadge: 'VERIFICATION ACTIVE',
      statusType: 'safe',
      liveMetric: 'UTR & bank ledger match verified',
    },
    {
      num: 6,
      icon: GitCompare,
      title: t('check6.title'),
      question: t('check6.question'),
      desc: t('check6.desc'),
      statusBadge: '3 FIXES READY',
      statusType: 'safe',
      liveMetric: 'Delay, surge & multi-batch calibrated',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 0. Live Goal Quick Edit Bar (Syncs Entire App) */}
      <GoalQuickEditBar />

      {/* 1. Interactive 3D Hero Banner */}
      <Tilt3DCard
        className={`p-6 md:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isLight
            ? 'bg-white border-2 border-slate-200 text-slate-900 shadow-md'
            : 'bg-slate-900/70 backdrop-blur-xl border-white/10 text-white'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-8 space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm"
              style={{
                borderColor: `${theme.primaryHex}40`,
                background: `${theme.primaryHex}15`,
                color: isLight ? '#1e40af' : theme.primaryHex,
              }}
            >
              <Sparkles size={13} className="animate-spin text-blue-500" />
              <span>{t('hero.badge')}</span>
            </div>

            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                FINVEXA
              </h1>
              <p
                className="text-sm sm:text-base font-bold mt-1 tracking-wide"
                style={{ color: isLight ? '#1e40af' : theme.primaryHex }}
              >
                {t('hero.subtitle')}
              </p>
            </div>

            <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              {t('hero.desc')}
            </p>

            {/* Active Persona Story Box */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-md ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-slate-950/60 border-white/10 text-white'
            }`}>
              <span className="text-2xl mt-0.5">{personaData.emoji}</span>
              <div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Current Real-Life Scenario ({personaData.label})
                </div>
                <div className={`text-sm font-semibold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  "{personaData.story}"
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => navigate('/simulator')}
                className="text-xs py-2.5 px-5 flex items-center gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl transition-all"
              >
                <span>{t('hero.launchSim')}</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/rescue')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 shadow-sm ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
                }`}
              >
                <Flame size={14} className="text-amber-500" />
                <span>{t('hero.seeFixes')}</span>
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
        <div className={`p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md ${
          isLight
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>
              <strong className={isLight ? 'text-emerald-950 font-bold' : 'text-white font-bold'}>
                RBI Account Aggregator Live Feed Active:
              </strong>{' '}
              {bankConsent.bankName} ({bankConsent.accountMasked})
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 shrink-0 self-start sm:self-auto">
            100% Read-Only Protected · Sahamati Standard
          </span>
        </div>
      )}

      {/* 2. Plain-English KPI Cards (Dynamic With Decision Cost) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Shield size={18} className="text-emerald-500" />
              <span>Money Health Right Now</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Live bank status updated in ₹ Rupees · Zero complex financial formulas
            </p>
          </div>
          <span className={`text-xs font-bold hidden sm:inline-block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {personaData.emoji} {personaData.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Money Safe in Bank */}
          <KpiCard
            label={t('kpi.balance')}
            value={`₹${personaData.balance.toLocaleString('en-IN')}`}
            sub={`Untouchable Floor: ₹${personaData.lockedReserves.toLocaleString('en-IN')}`}
            status={liquidityStatus}
            icon={<CreditCard size={18} />}
            trend={
              liquidityStatus === 'safe'
                ? '↑ Safe balance in your bank'
                : '⚠ Very close to your untouchable money'
            }
          />

          {/* Card 2: Commitment Protection */}
          <KpiCard
            label={t('kpi.locked')}
            value={`₹${personaData.lockedReserves.toLocaleString('en-IN')}`}
            sub="Home Loan EMI, rent, staff salaries & emergency floor"
            status="safe"
            icon={<Lock size={18} />}
            trend="100% Protected from impulse spending"
          />

          {/* Card 3: Planned Spending Outflow (Dynamically Synced with decisionCost) */}
          <KpiCard
            label={t('kpi.planned')}
            value={`₹${simulator.decisionCost.toLocaleString('en-IN')}`}
            sub={userGoal.title || personaData.purchaseLabel}
            status="neutral"
            icon={<Target size={18} />}
            trend="Syncs all 90-day simulator curves live"
          />

          {/* Card 4: Safe to Spend Today / Projected Shortage */}
          <KpiCard
            label={t('kpi.safeSpend')}
            value={
              shortage > 0
                ? `-₹${shortage.toLocaleString('en-IN')}`
                : `₹${Math.max(0, personaData.balance - personaData.lockedReserves - simulator.decisionCost).toLocaleString('en-IN')}`
            }
            sub={
              shortage > 0
                ? `Shortage of ₹${shortage.toLocaleString('en-IN')} if purchase made`
                : 'Safe surplus remaining after all bills & goal'
            }
            status={shortage > 0 ? 'critical' : 'safe'}
            icon={<CheckCircle2 size={18} />}
            trend={
              shortage === 0
                ? '✓ Spend freely without breaking emergency fund'
                : '⚠ Buying now will push you into cash shortage'
            }
          />
        </div>
      </div>

      {/* 3. Team Pitch Table: 6 Core Checks Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Shield size={18} className="text-blue-500" />
              <span>6 Core Safety Checks (Pitch Table Sync)</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Every order & spending decision calibrated against all 6 financial defenses
            </p>
          </div>
          <button
            onClick={() => navigate('/risk-matrix')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open 6 Risk Cards</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pitchChecks.map((chk, i) => {
            const Icon = chk.icon
            return (
              <Tilt3DCard
                key={i}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isLight
                    ? 'bg-white border-2 border-slate-200 shadow-md text-slate-900'
                    : 'bg-slate-900/70 backdrop-blur-xl border-white/10 text-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-500">Check {chk.num}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        chk.statusType === 'critical'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : chk.statusType === 'warning'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {chk.statusBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {chk.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 italic mt-0.5">
                      "{chk.question}"
                    </p>
                  </div>

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                    {chk.desc}
                  </p>
                </div>

                <div className={`pt-2 border-t text-[11px] font-mono font-semibold flex items-center justify-between ${
                  isLight ? 'border-slate-100 text-slate-600' : 'border-white/10 text-slate-400'
                }`}>
                  <span>{chk.liveMetric}</span>
                  <ArrowRight size={12} className="text-slate-400" />
                </div>
              </Tilt3DCard>
            )
          })}
        </div>
      </div>

      {/* 4. AI Banking & Account Support Assistant */}
      <div>
        <AiBankingChatbot />
      </div>

      {/* 5. Dynamic Before-You-Spend Callout Banner (Exact Rupee Value) */}
      <Tilt3DCard
        className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          isLight
            ? 'bg-white border-2 border-slate-200 text-slate-900 shadow-md'
            : 'bg-slate-900/70 backdrop-blur-xl border-white/10 text-white'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h3 className={`font-bold text-base sm:text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Want to see what happens before spending ₹{simulator.decisionCost.toLocaleString('en-IN')}?
            </h3>
          </div>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
            Move sliders for price, payment delay days, down payment, and batch splitting to see your exact 90-day bank balance graph live.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="text-xs sm:text-sm py-3 px-6 whitespace-nowrap shrink-0 flex items-center gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl transition-all"
        >
          <span>Run 90-Day Simulation</span>
          <ArrowRight size={16} />
        </button>
      </Tilt3DCard>
    </div>
  )
}
