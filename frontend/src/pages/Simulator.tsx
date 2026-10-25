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
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <span className="mono text-xs font-bold text-blue-700 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200">
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
      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        <span>{format ? format(min) : `${min}${unit ?? ''}`}</span>
        <span>{format ? format(max) : `${max}${unit ?? ''}`}</span>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white p-3.5 rounded-xl min-w-[210px] border border-slate-200 shadow-xl">
      <div className="text-xs text-slate-500 mb-2 font-bold font-mono">Day {label} Balance Check</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between items-center gap-4 py-0.5">
          <span className="text-xs font-semibold" style={{ color: p.color }}>
            {p.name}
          </span>
          <span className="mono text-xs font-bold text-slate-900">
            ₹{Math.abs(p.value).toLocaleString('en-IN')}
            {p.value < 0 && <span className="text-red-600"> (Shortage)</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Simulator() {
  const { personaData, simulator, setSimulator } = useApp()
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

    setTimeout(() => {
      setSaveStatus(null)
    }, 4500)
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Sliders size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Before-You-Spend 90-Day Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            {personaData.emoji} <strong className="text-slate-900">{personaData.label}</strong>: "{personaData.story}"
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
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : shortage < 20000
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {shortage === 0 ? '✅ 100% SAFE' : `🚨 SHORTAGE: −₹${shortage.toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveStatus && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs animate-fade-in border shadow-sm ${
            saveStatus.type === 'cloud'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {saveStatus.type === 'cloud' ? <Database size={15} /> : <CheckCircle2 size={15} />}
            <span>{saveStatus.message}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {saveStatus.type === 'cloud' ? 'Supabase Online' : 'Local Storage'}
          </span>
        </div>
      )}

      {/* 3 BIG PLAIN-ENGLISH EXPLANATION BOXES (Live Updates) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: What You Think Will Happen */}
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <span>🟢 What You Think Will Happen</span>
          </div>
          <p className="text-xs text-emerald-950 font-medium leading-relaxed">
            You think you will finish the month with{' '}
            <strong className="text-emerald-700 font-black">+₹{estimatedProfit.toLocaleString('en-IN')} profit</strong> because you ignore payment delays and hidden fees.
          </p>
        </div>

        {/* Box 2: What Actually Happens in Real Life */}
        <div
          className={`p-4 rounded-2xl shadow-xs space-y-1 border ${
            shortage > 0
              ? 'bg-red-50/90 border-red-200'
              : 'bg-blue-50/80 border-blue-200'
          }`}
        >
          <div
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              shortage > 0 ? 'text-red-700' : 'text-blue-700'
            }`}
          >
            <span>{shortage > 0 ? '🔴 What Actually Happens' : '🔵 Real-Life Balance Check'}</span>
          </div>
          <p
            className={`text-xs font-medium leading-relaxed ${
              shortage > 0 ? 'text-red-950' : 'text-blue-950'
            }`}
          >
            {shortage > 0 ? (
              <>
                Because of late payment + hidden costs + rent/salaries due first, your bank balance hits{' '}
                <strong className="text-red-700 font-black">
                  −₹{shortage.toLocaleString('en-IN')} (SHORTAGE)
                </strong>{' '}
                on <strong className="text-red-800 font-bold">Day {worstDay}</strong>!
              </>
            ) : (
              <>
                All safe! With your current numbers, your bank balance stays above ₹0 and protects your rent/salary floor across all 90 days.
              </>
            )}
          </p>
        </div>

        {/* Box 3: How Much Advance You Need to Stay Safe */}
        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <span>🛡️ How to Stay 100% Safe</span>
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed">
            {shortage > 0 ? (
              <>
                Take <strong className="text-amber-800 font-black">₹{recommendedAdvance.toLocaleString('en-IN')} advance</strong> OR{' '}
                <strong className="text-amber-800 font-black">Split into 2 Batches</strong> to keep your bank balance above ₹0.
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
          <div className="bg-white p-6 space-y-5 border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Adjust Your Real-Life Numbers</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
            </div>

            {/* Slider 1: Decision Cost */}
            <SliderRow
              label={labels.decisionCost}
              value={simulator.decisionCost}
              min={10000}
              max={250000}
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
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Lowest Bank Balance You Will Touch:</span>
                <span
                  className={`mono font-bold ${
                    stressMin < 0 ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  ₹{stressMin.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Days Spent in Danger Zone:</span>
                <span className="mono font-bold text-amber-700">{valleyDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">How Much You Will Be Short:</span>
                <span
                  className={`mono font-bold ${
                    shortage > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {shortage > 0 ? `−₹${shortage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Untouchable Money (Rent & Fees):</span>
                <span className="mono font-bold text-slate-800">
                  ₹{personaData.lockedReserves.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {shortage > 0 && (
              <button
                onClick={() => navigate('/rescue')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-sm transition-all hover:bg-red-700 bg-red-600"
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
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Expected vs Stress-Tested Bank Balance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Green Line = Expected · Red Line = Real Life · Yellow Dashed = Rent/Salaries Floor
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 font-medium">
                <Sparkles size={13} className="text-blue-600" />
                <span>90-Day Forecast</span>
              </div>
            </div>

            {/* Recharts 90-Day Cash Flow Canvas */}
            <div className="w-full h-[280px] md:h-[370px] bg-slate-50/50 rounded-xl p-2 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="naiveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Day', position: 'insideBottomRight', offset: -4, fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', color: '#475569', paddingTop: '10px' }}
                    formatter={value => (
                      <span className="text-xs font-semibold text-slate-700">
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
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: '🚨 ₹0 Danger Line (Out of Cash)',
                      position: 'insideBottomLeft',
                      fill: '#b91c1c',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  {/* Untouchable Rent & Salary Line */}
                  <ReferenceLine
                    y={personaData.lockedReserves}
                    stroke="#d97706"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: `🔒 Untouchable Rent & Salary Money (₹${(personaData.lockedReserves / 1000).toFixed(0)}K)`,
                      position: 'top',
                      fill: '#b45309',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="naive"
                    name="naive"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#naiveGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    name="stressed"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fill="url(#stressGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 1-Click Auto-Fix Shortage Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {shortage > 0 ? (
                  <span>
                    Red line dipped below safety floor. Click Auto-Fix to rebalance sliders instantly:
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Red line is currently in the safe zone!
                  </span>
                )}
              </div>

              <button
                onClick={handleAutoFix}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 ${
                  autoFixed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Wand2 size={14} />
                <span>{autoFixed ? '✓ Shortage Fixed Live!' : '✨ Auto-Fix This Shortage Now'}</span>
              </button>
            </div>

            {/* Plain-English Visual Guide */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>💡 How to read this chart in 5 seconds:</span>
              </div>
              <p>
                • <strong className="text-emerald-700">Green Line:</strong> The happy story in your head if everyone pays on time with zero surprise fees.
              </p>
              <p>
                • <strong className="text-red-700">Red Line:</strong> Real life when client/buyer delays payment and surprise fees hit your bank.
              </p>
              <p>
                • <strong className="text-amber-700">Yellow Dashed Line:</strong> Your untouchable survival money for rent, fees, and wages. Keep the red line above it!
              </p>
            </div>
          </div>

          {/* Interactive Gyroscope Mini Core */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3D Shield Spin Frequency
              </div>
              <div className="text-sm font-bold text-slate-900">
                {shortage === 0
                  ? '🛡️ Stable & Safe — 0 Cash Shortage'
                  : `⚠️ Spinning Rapidly — ₹${shortage.toLocaleString('en-IN')} Shortage Detected`}
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                This 3D financial core spins faster and changes from Emerald to Crimson when you risk running out of cash. Drag it with your mouse to test!
              </p>
            </div>
            <Interactive3DFinancialCore
              shortage={shortage}
              size={120}
              label="Twin Pulse"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
