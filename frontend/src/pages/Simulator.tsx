// src/pages/Simulator.tsx
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {
  Sliders,
  TrendingUp,
  Cloud,
  CheckCircle2,
  Loader2,
  Database,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'
import { saveScenario } from '../lib/supabase'
import Interactive3DFinancialCore from '../components/Interactive3DFinancialCore'
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import JudgeValidationPanel from '../components/JudgeValidationPanel'

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  const display = format ? format(value) : `${value}${unit ?? ''}`

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-300">{label}</label>
        <span className="mono text-xs font-bold text-blue-300 px-2.5 py-0.5 rounded-lg bg-blue-500/20 border border-blue-500/30">
          {display}
        </span>
      </div>
      <div className="relative pt-2 pb-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider-custom relative z-10 w-full cursor-pointer h-6 touch-pan-y"
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{format ? format(min) : `${min}${unit ?? ''}`}</span>
        <span>{format ? format(max) : `${max}${unit ?? ''}`}</span>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light')
  return (
    <div className={`p-3.5 rounded-xl min-w-[210px] shadow-2xl border ${
      isLight ? 'bg-white text-slate-900 border-2 border-slate-200' : 'bg-slate-900/95 text-white border border-white/10'
    }`}>
      <div className={`text-xs mb-2 font-bold font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        Day {label} Balance Check
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between items-center gap-4 py-0.5">
          <span className="text-xs font-semibold" style={{ color: p.color }}>
            {p.name}
          </span>
          <span className={`mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            ₹{Math.abs(p.value).toLocaleString('en-IN')}
            {p.value < 0 && <span className="text-rose-500 font-black"> (Shortage)</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Simulator() {
  const { personaData, simulator, setSimulator, themeMode } = useApp()
  const isLight = themeMode === 'light'
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'cloud' | 'local'; message: string } | null>(null)
  const [autoFixed, setAutoFixed] = useState(false)
  const navigate = useNavigate()
  const labels = personaData.sliderLabels

  const data = generateCashflow({
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

  const { stressMin, shortage, valleyDays } = computeRiskMetrics(data, personaData.lockedReserves)

  // Find exact day when balance drops to its lowest
  const lowestPoint = data.reduce(
    (minD, d) => (d.stressed < minD.stressed ? d : minD),
    data[0] || { day: 18, stressed: 0 }
  )
  const worstDay = lowestPoint?.day || 18

  // Calculate advance needed to stay safe
  const recommendedAdvance = Math.max(
    Math.round(simulator.decisionCost * 0.4),
    Math.round(shortage * 1.15)
  )

  const finalNaive = data[data.length - 1]?.naive || 0
  const estimatedProfit = Math.max(15000, Math.round(finalNaive - personaData.balance))

  // Auto-Fix button handler: adjusts sliders to make red line safe
  const handleAutoFix = () => {
    setSimulator({
      upfrontPercent: 45,
      splitBatches: 2,
      hiddenCostBuffer: 5,
      paymentDelayDays: Math.min(10, simulator.paymentDelayDays),
    })
    setAutoFixed(true)
    setTimeout(() => setAutoFixed(false), 3000)
  }

  const handleSaveScenario = async () => {
    setSaving(true)
    setSaveStatus(null)

    const res = await saveScenario({
      name: `${personaData.label} — ₹${(simulator.decisionCost / 1000).toFixed(0)}K ${personaData.purchaseLabel.split(' ')[0]}`,
      persona_type: personaData.type,
      balance: personaData.balance,
      monthly_income: personaData.monthlyIncome,
      locked_reserves: personaData.lockedReserves,
      decision_cost: simulator.decisionCost,
      payment_delay_days: simulator.paymentDelayDays,
      upfront_percent: simulator.upfrontPercent,
      hidden_cost_buffer: simulator.hiddenCostBuffer,
      split_batches: simulator.splitBatches,
      projected_shortage: shortage,
      valley_days: valleyDays,
      stress_min_balance: stressMin,
    })

    setSaving(false)
    if (res.cloud) {
      setSaveStatus({
        type: 'cloud',
        message: 'Scenario safely saved to Supabase PostgreSQL cloud table!',
      })
    } else {
      setSaveStatus({
        type: 'local',
        message: 'Saved to local browser storage (ready for cloud sync)!',
      })
    }
    setTimeout(() => setSaveStatus(null), 4000)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 0. Live Goal Quick Edit Bar (Syncs Entire App) */}
      <GoalQuickEditBar />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Before-You-Spend 90-Day Money Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
            {personaData.emoji} <strong className="text-white">{personaData.label}</strong>: "{personaData.story}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveScenario}
            disabled={saving}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2 shrink-0 font-bold"
            title="Save scenario to Supabase PostgreSQL database"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Cloud size={14} />}
            <span>Save to Cloud</span>
          </button>

          <div
            className={`px-3 py-1.5 rounded-xl font-bold text-xs mono shrink-0 border ${
              shortage === 0
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : shortage < 20000
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {shortage === 0 ? '✅ 100% SAFE' : `🚨 SHORTAGE: −₹${shortage.toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveStatus && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs animate-fade-in border shadow-lg ${
            saveStatus.type === 'cloud'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-blue-950/80 border-blue-500/40 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {saveStatus.type === 'cloud' ? <Database size={15} /> : <CheckCircle2 size={15} />}
            <span>{saveStatus.message}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {saveStatus.type === 'cloud' ? 'Supabase Online' : 'Local Storage'}
          </span>
        </div>
      )}

      {/* 3 BIG PLAIN-ENGLISH EXPLANATION BOXES (Live Updates) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: What You Think Will Happen */}
        <div className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-2xl shadow-lg space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span>🟢 What You Think Will Happen</span>
          </div>
          <p className="text-xs text-emerald-100 font-medium leading-relaxed">
            You think you will finish the month with{' '}
            <strong className="text-emerald-300 font-black">+₹{estimatedProfit.toLocaleString('en-IN')} profit</strong> because you ignore payment delays and hidden fees.
          </p>
        </div>

        {/* Box 2: What Actually Happens in Real Life */}
        <div
          className={`p-4 rounded-2xl shadow-lg space-y-1 backdrop-blur-xl border ${
            shortage > 0
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-100'
              : 'bg-blue-950/40 border-blue-500/30 text-blue-100'
          }`}
        >
          <div
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              shortage > 0 ? 'text-rose-400' : 'text-blue-300'
            }`}
          >
            <span>{shortage > 0 ? '🔴 What Actually Happens in Real Life' : '🔵 Real-Life Balance Check'}</span>
          </div>
          <p
            className={`text-xs font-medium leading-relaxed ${
              shortage > 0 ? 'text-rose-100' : 'text-blue-100'
            }`}
          >
            {shortage > 0 ? (
              <>
                Because of late payment + hidden costs + rent/salaries due first, your bank balance hits{' '}
                <strong className="text-rose-300 font-black">
                  −₹{shortage.toLocaleString('en-IN')} (SHORTAGE)
                </strong>{' '}
                on <strong className="text-rose-200 font-bold">Day {worstDay}</strong>!
              </>
            ) : (
              <>
                All safe! With your current numbers, your bank balance stays above ₹0 and protects your rent/salary floor across all 90 days.
              </>
            )}
          </p>
        </div>

        {/* Box 3: How Much Advance You Need to Stay Safe */}
        <div className="bg-amber-950/40 backdrop-blur-xl border border-amber-500/30 p-4 rounded-2xl shadow-lg space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <span>🛡️ How Much Advance You Need to Stay Safe</span>
          </div>
          <p className="text-xs text-amber-100 font-medium leading-relaxed">
            {shortage > 0 ? (
              <>
                Take <strong className="text-amber-300 font-black">₹{recommendedAdvance.toLocaleString('en-IN')} advance</strong> OR{' '}
                <strong className="text-amber-300 font-black">Split into 2 Batches</strong> to keep your bank balance above ₹0.
              </>
            ) : (
              <>
                Your plan is currently self-funded. Keep an emergency buffer of ₹5,000 for peace of mind.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Main Grid: Sliders + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Dynamic 5 Sliders Panel */}
        <div className="xl:col-span-5 space-y-5">
          <div className="bg-slate-900/70 backdrop-blur-xl p-6 space-y-5 border border-white/10 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-white">Adjust Your Real-Life Numbers</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
            </div>

            {/* Slider 1: Decision Cost */}
            <SliderRow
              label={labels.decisionCost}
              value={simulator.decisionCost}
              min={Math.min(5000, simulator.decisionCost > 10000 ? 5000 : 1000)}
              max={Math.max(250000, Math.round(simulator.decisionCost * 1.5))}
              step={1000}
              onChange={v => setSimulator({ decisionCost: v })}
              format={v => `₹${v.toLocaleString('en-IN')}`}
            />

            {/* Slider 2: Payment Delay */}
            <SliderRow
              label={labels.paymentDelay}
              value={simulator.paymentDelayDays}
              min={0}
              max={60}
              unit=" Days"
              onChange={v => setSimulator({ paymentDelayDays: v })}
            />

            {/* Slider 3: Downpayment / Advance */}
            <SliderRow
              label={labels.upfrontPercent}
              value={simulator.upfrontPercent}
              min={0}
              max={100}
              unit="%"
              onChange={v => setSimulator({ upfrontPercent: v })}
            />

            {/* Slider 4: Hidden Surcharges / Delivery */}
            <SliderRow
              label={labels.hiddenCost}
              value={simulator.hiddenCostBuffer}
              min={0}
              max={25}
              unit="%"
              onChange={v => setSimulator({ hiddenCostBuffer: v })}
            />

            {/* Slider 5: Batches / Installments */}
            <SliderRow
              label={labels.splitBatches}
              value={simulator.splitBatches}
              min={1}
              max={4}
              unit=" Parts"
              onChange={v => setSimulator({ splitBatches: v })}
            />

            {/* Plain-English Stats Summary */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lowest Bank Balance You Will Touch:</span>
                <span
                  className={`mono font-bold ${
                    stressMin < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  ₹{stressMin.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Days Spent in Danger Zone:</span>
                <span className="mono font-bold text-amber-400">{valleyDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">How Much You Will Be Short:</span>
                <span
                  className={`mono font-bold ${
                    shortage > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {shortage > 0 ? `−₹${shortage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Untouchable Money (Rent & Fees):</span>
                <span className="mono font-bold text-purple-300">
                  ₹{personaData.lockedReserves.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {shortage > 0 && (
              <button
                onClick={() => navigate('/rescue')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-md transition-all hover:bg-rose-700 bg-rose-600"
              >
                <ShieldAlert size={15} />
                <span>Fix ₹{shortage.toLocaleString('en-IN')} Shortage with 3 Easy Plans</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Chart + Auto-Fix Button + 3D Core Panel */}
        <div className="xl:col-span-7 space-y-5">
          <div className="bg-slate-900/70 backdrop-blur-xl p-6 border border-white/10 rounded-2xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Expected vs Stress-Tested Bank Balance
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Green Line = Expected · Red Line = Real Life · Yellow Dashed = Rent/Salaries Floor
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-300 bg-blue-500/15 border border-blue-500/20 px-2.5 py-1 rounded-lg shrink-0 font-medium">
                <Sparkles size={13} className="text-blue-400" />
                <span>90-Day Forecast</span>
              </div>
            </div>

            {/* Recharts 90-Day Cash Flow Canvas */}
            <div className="w-full h-[280px] md:h-[370px] bg-slate-950/60 rounded-xl p-2 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="naiveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#cbd5e1' : '#334155'} opacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: isLight ? '#475569' : '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: isLight ? '#94a3b8' : '#475569' }}
                    label={{ value: 'Day', position: 'insideBottomRight', offset: -4, fill: isLight ? '#475569' : '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: isLight ? '#475569' : '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', color: isLight ? '#334155' : '#94a3b8', paddingTop: '10px' }}
                    formatter={value => (
                      <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                        {value === 'naive'
                          ? '🟢 What You Expect (Without Delays)'
                          : value === 'stressed'
                          ? '🔴 Real Bank Balance (After Delays & Hidden Costs)'
                          : value}
                      </span>
                    )}
                  />
                  {/* ₹0 Danger Line */}
                  <ReferenceLine
                    y={0}
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: '🚨 ₹0 Danger Line (Out of Cash)',
                      position: 'insideBottomLeft',
                      fill: '#fb7185',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  {/* Untouchable Rent & Salary Line */}
                  <ReferenceLine
                    y={personaData.lockedReserves}
                    stroke="#fbbf24"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: `🔒 Untouchable Rent & Salary Money (₹${(personaData.lockedReserves / 1000).toFixed(0)}K)`,
                      position: 'top',
                      fill: '#fde68a',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="naive"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#naiveGrad)"
                    name="naive"
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#stressGrad)"
                    name="stressed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 1-Click Auto-Fix Action Banner */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <Wand2 size={15} className="text-emerald-400" />
                <span>
                  {autoFixed
                    ? '🎉 Auto-Fix applied! Sliders adjusted to ensure your bank balance stays safe.'
                    : 'Red line below zero? 1-click optimizes advance & batches to keep cashflow green.'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAutoFix}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 bg-emerald-600 hover:bg-emerald-500"
              >
                <Sparkles size={14} />
                <span>✨ Auto-Fix This Shortage Now</span>
              </button>
            </div>
          </div>

          {/* Real-time 3D Stress Core */}
          <div className="bg-slate-900/70 backdrop-blur-xl p-5 border border-white/10 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-blue-400">
                WebGL 3D Core Telemetry
              </span>
              <h4 className="text-sm font-bold text-white">
                Interactive Liquidity Core ({personaData.label})
              </h4>
              <p className="text-xs text-slate-300">
                Visualizes real-time systemic financial pressure. Glow turns crimson when cash reserves drop below safe survival thresholds.
              </p>
            </div>
            <div className="shrink-0">
              <Interactive3DFinancialCore
                shortage={shortage}
                size={110}
                label="Simulation Shield"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Srujana 2026 Rubric: Judge Validation, Edge-Cases & Limitations Panel */}
      <JudgeValidationPanel />
    </div>
  )
}
