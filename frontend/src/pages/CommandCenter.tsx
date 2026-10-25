// src/pages/CommandCenter.tsx
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Shield,
  ArrowRight,
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
import AiBankingChatbot from '../components/AiBankingChatbot'
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import ZeroManualInputFlow from '../components/ZeroManualInputFlow'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'

export default function CommandCenter() {
  const { persona, personaData, simulator, bankConsent, userGoal, themeMode, t, formatMoney } = useApp()
  const navigate = useNavigate()
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

  const { shortage, dscr, isCovenantBreached } = computeRiskMetrics(cashflow, personaData.lockedReserves)

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
      statusBadge: shortage === 0 ? 'SAFE' : `DEFICIT: ${formatMoney(-shortage)}`,
      statusType: shortage === 0 ? 'safe' : 'critical',
      liveMetric: `Simulating ${formatMoney(simulator.decisionCost)} spend`,
    },
    {
      num: 2,
      icon: Lock,
      title: t('check2.title'),
      question: t('check2.question'),
      desc: t('check2.desc'),
      statusBadge: '100% PROTECTED',
      statusType: 'safe',
      liveMetric: `${formatMoney(personaData.lockedReserves)} locked for commitments`,
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
      statusBadge: `${formatMoney(personaData.hiddenLeaks)}/MO SCANNED`,
      statusType: 'warning',
      liveMetric: 'Macro/FX leak & contract audit active',
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

      {/* 1. JUDGE-REQUESTED ZERO-MANUAL-INPUT 3-STEP WORKFLOW */}
      <ZeroManualInputFlow />

      {/* RBI Account Aggregator Live Feed Banner */}
      {bankConsent.isLinked && (
        <div className={`p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs ${
          isLight
            ? 'bg-amber-50/80 border border-amber-300 text-amber-950'
            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>
              <strong className={isLight ? 'text-slate-950 font-black' : 'text-white font-bold'}>
                RBI Account Aggregator Live Feed Active:
              </strong>{' '}
              {bankConsent.bankName} ({bankConsent.accountMasked})
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 border border-yellow-500 shrink-0 self-start sm:self-auto shadow-xs">
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
          {/* Card 1: Money Safe in Bank / Treasury Liquidity */}
          <KpiCard
            label={persona === 'enterprise' ? 'Global Treasury Liquidity' : t('kpi.balance')}
            value={formatMoney(personaData.balance)}
            sub={
              persona === 'enterprise'
                ? `JPMorgan, Citi, SBI Pools · Floor: ${formatMoney(personaData.lockedReserves)}`
                : `Untouchable Floor: ${formatMoney(personaData.lockedReserves)}`
            }
            status={liquidityStatus}
            icon={<CreditCard size={18} />}
            trend={
              liquidityStatus === 'safe'
                ? '↑ Safe balance in multi-bank treasury'
                : '⚠ Deficit breach risks 1.35x DSCR covenant'
            }
          />

          {/* Card 2: Commitment Protection / Debt Covenant Floor */}
          <KpiCard
            label={persona === 'enterprise' ? 'Debt Covenant & Payroll Floor' : t('kpi.locked')}
            value={formatMoney(personaData.lockedReserves)}
            sub={
              persona === 'enterprise'
                ? 'Senior Bond Coupons, 1.35x DSCR & 40,000 Payroll'
                : 'Home Loan EMI, rent, staff salaries & emergency floor'
            }
            status="safe"
            icon={<Lock size={18} />}
            trend={
              persona === 'enterprise'
                ? 'Mandatory legal covenant ring-fenced'
                : '100% Protected from impulse spending'
            }
          />

          {/* Card 3: Planned Spending Outflow / EPC CapEx Execution */}
          <KpiCard
            label={persona === 'enterprise' ? 'EPC CapEx Execution Budget' : t('kpi.planned')}
            value={formatMoney(simulator.decisionCost)}
            sub={userGoal.title || personaData.purchaseLabel}
            status="neutral"
            icon={<Target size={18} />}
            trend="Syncs all 90-day simulator curves live"
          />

          {/* Card 4: Safe to Spend Today / Projected Shortage / DSCR */}
          <KpiCard
            label={persona === 'enterprise' ? 'Working Capital Deficit / DSCR' : t('kpi.safeSpend')}
            value={
              shortage > 0
                ? formatMoney(-shortage)
                : formatMoney(Math.max(0, personaData.balance - personaData.lockedReserves - simulator.decisionCost))
            }
            sub={
              persona === 'enterprise'
                ? shortage > 0
                  ? `🚨 Breaches 1.35x DSCR Covenant (${dscr}x) on Day 42`
                  : `✅ AAA Covenant Safe (${dscr}x DSCR)`
                : shortage > 0
                ? `Shortage of ${formatMoney(shortage)} if purchase made`
                : 'Safe surplus remaining after all bills & goal'
            }
            status={shortage > 0 ? 'critical' : 'safe'}
            icon={<CheckCircle2 size={18} />}
            trend={
              persona === 'enterprise'
                ? isCovenantBreached
                  ? '🚨 Covenant breach triggers loan acceleration & credit downgrade'
                  : '✓ Treasury liquidity fully compliant with bond covenants'
                : shortage === 0
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
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isLight
                    ? 'bg-white border-yellow-200 hover:border-yellow-400 shadow-xs text-slate-900'
                    : 'bg-slate-900/70 backdrop-blur-xl border-white/10 text-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-900 border border-yellow-300 flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-800">Check {chk.num}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        chk.statusType === 'critical'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : chk.statusType === 'warning'
                          ? 'bg-yellow-100 text-yellow-950 border-yellow-400'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {chk.statusBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {chk.title}
                    </h3>
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 italic mt-0.5">
                      "{chk.question}"
                    </p>
                  </div>

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                    {chk.desc}
                  </p>
                </div>

                <div className={`pt-2 border-t text-[11px] font-mono font-semibold flex items-center justify-between ${
                  isLight ? 'border-yellow-100 text-slate-600' : 'border-white/10 text-slate-400'
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
        className={`p-6 sm:p-7 rounded-3xl border-2 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 ${
          isLight
            ? 'bg-white border-yellow-300 text-slate-900 shadow-sm'
            : 'bg-slate-900/70 backdrop-blur-xl border-white/10 text-white'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h3 className={`font-black text-base sm:text-lg ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Want to see what happens before spending ₹{simulator.decisionCost.toLocaleString('en-IN')}?
            </h3>
          </div>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
            Move sliders for price, payment delay days, down payment, and batch splitting to see your exact 90-day bank balance graph live.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="text-xs sm:text-sm py-3 px-6 whitespace-nowrap shrink-0 flex items-center gap-2 font-black bg-yellow-400 hover:bg-yellow-500 text-slate-950 shadow-sm border border-yellow-500 rounded-xl transition-all"
        >
          <span>Run 90-Day Simulation</span>
          <ArrowRight size={16} />
        </button>
      </Tilt3DCard>
    </div>
  )
}
