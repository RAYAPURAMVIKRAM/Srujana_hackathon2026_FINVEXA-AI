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
import { Sliders, TrendingUp, Info, Cloud, CheckCircle2, Loader2, Database, ShieldAlert, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { generateCashflow, computeRiskMetrics } from '../lib/cashflow'
import { saveScenario } from '../lib/supabase'
import Tilt3DCard from '../components/Tilt3DCard'
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
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <span className="mono text-xs font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          {display}
        </span>
      </div>
      <div className="relative pt-2 pb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-emerald-500/30 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
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
  return (
    <div className="glass p-3 rounded-xl min-w-[200px] border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-md">
      <div className="text-xs text-slate-400 mb-2 font-bold font-mono">Day {label} Timeline</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between items-center gap-4 py-0.5">
          <span className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}
          </span>
          <span className="mono text-xs font-bold text-white">
            ₹{Math.abs(p.value).toLocaleString('en-IN')}
            {p.value < 0 && <span className="text-rose-400"> (Shortage)</span>}
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
  const navigate = useNavigate()
  const theme = personaData.theme
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

  const stressStatus = shortage === 0 ? 'SAFE' : shortage < 20000 ? 'WARNING' : 'CRITICAL SHORTAGE'
  const stressColor = shortage === 0 ? '#10b981' : shortage < 20000 ? '#f59e0b' : '#f43f5e'

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sliders size={22} className="text-emerald-400" />
            90-Day Money Life Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {personaData.emoji} <strong className="text-white">{personaData.label}</strong> — "{personaData.story}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveScenario}
            disabled={saving}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2 shrink-0 font-bold"
            title="Save scenario to Supabase PostgreSQL database"
            style={{ background: theme.buttonGradient }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Cloud size={14} />}
            <span>Save to Supabase Cloud</span>
          </button>

          <div
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs mono shrink-0 border"
            style={{
              background: `rgba(${shortage === 0 ? '16,185,129' : shortage < 20000 ? '245,158,11' : '244,63,94'},0.15)`,
              color: stressColor,
              borderColor: `${stressColor}40`,
            }}
          >
            {stressStatus}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveStatus && (
        <div
          className="p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs animate-fade-in border shadow-lg"
          style={{
            background: saveStatus.type === 'cloud' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
            borderColor: saveStatus.type === 'cloud' ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.4)',
            color: saveStatus.type === 'cloud' ? '#34d399' : '#a5b4fc',
          }}
        >
          <div className="flex items-center gap-2 font-medium">
            {saveStatus.type === 'cloud' ? <Database size={15} /> : <CheckCircle2 size={15} />}
            <span>{saveStatus.message}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {saveStatus.type === 'cloud' ? 'Supabase Storage Online' : 'Local Storage'}
          </span>
        </div>
      )}

      {/* Main Grid: Sliders + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Dynamic 5 Sliders Panel */}
        <div className="xl:col-span-5 space-y-5">
          <Tilt3DCard className="glass-card p-6 space-y-5 border border-slate-700/80">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-sm font-bold text-white">Adjust Your Real-Life Numbers</span>
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
            <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lowest Bank Balance You Will Touch:</span>
                <span className="mono font-bold" style={{ color: stressColor }}>
                  ₹{stressMin.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Days Spent in the Danger Zone:</span>
                <span className="mono font-bold text-amber-400">{valleyDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">How Much Money You Will Be Short:</span>
                <span className="mono font-bold" style={{ color: stressColor }}>
                  {shortage > 0 ? `−₹${shortage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Untouchable Money (Rent & Fees):</span>
                <span className="mono font-bold text-slate-200">
                  ₹{personaData.lockedReserves.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {shortage > 0 && (
              <button
                onClick={() => navigate('/rescue')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-transform hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #d97706 100%)' }}
              >
                <ShieldAlert size={15} />
                <span>Fix ₹{shortage.toLocaleString('en-IN')} Shortage with 3 Easy Plans</span>
                <ArrowRight size={14} />
              </button>
            )}
          </Tilt3DCard>
        </div>

        {/* Right: Chart + 3D Core Panel */}
        <div className="xl:col-span-7 space-y-5">
          <Tilt3DCard className="glass-card p-6 border border-slate-700/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  What You Think Will Happen (Green) vs Real Life After Delays & Hidden Costs (Red)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Yellow line = Untouchable Money. Never let the red line fall below yellow!
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 glass px-2 py-1 rounded-lg shrink-0">
                <Info size={13} className="text-emerald-400" />
                <span>90-Day Simulation</span>
              </div>
            </div>

            {/* Recharts 90-Day Cash Flow Canvas */}
            <div className="w-full h-[280px] md:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="naiveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    label={{ value: 'Day', position: 'insideBottomRight', offset: -4, fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', color: '#cbd5e1', paddingTop: '10px' }}
                    formatter={value => (
                      <span className="text-xs font-medium text-slate-300">
                        {value === 'naive'
                          ? 'What You Think (No Delays)'
                          : value === 'stressed'
                          ? 'Real Life (After Delays & Fees)'
                          : value}
                      </span>
                    )}
                  />
                  <ReferenceLine
                    y={personaData.lockedReserves}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: `Untouchable Rent/Fees (₹${(personaData.lockedReserves / 1000).toFixed(0)}K)`,
                      position: 'top',
                      fill: '#fbbf24',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="naive"
                    name="naive"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#naiveGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    name="stressed"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#stressGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Plain-English Visual Guide */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>💡 How to read this chart in 5 seconds:</span>
              </div>
              <p>
                • <strong className="text-emerald-400">Green Line:</strong> The happy story in your head if everyone pays on time with zero surprise fees.
              </p>
              <p>
                • <strong className="text-rose-400">Red Line:</strong> Real life when salary or clients delay payment and delivery/bills hit your account.
              </p>
              <p>
                • <strong className="text-amber-400">Yellow Dashed Line:</strong> Your untouchable survival money for rent, fees, and food. Keep the red line above it!
              </p>
            </div>
          </Tilt3DCard>

          {/* Interactive Gyroscope Mini Core */}
          <Tilt3DCard className="glass-card p-5 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3D Shield Spin Frequency
              </div>
              <div className="text-sm font-semibold text-white">
                {shortage === 0
                  ? '🛡️ Stable & Safe — 0 Cash Shortage'
                  : `⚠️ Spinning Rapidly — ₹${shortage.toLocaleString('en-IN')} Shortage Detected`}
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                This 3D core spins faster and changes from Emerald to Crimson when you risk running out of cash. Try dragging it with your mouse!
              </p>
            </div>
            <Interactive3DFinancialCore
              shortage={shortage}
              size={130}
              label="Twin Pulse"
            />
          </Tilt3DCard>
        </div>
      </div>
    </div>
  )
}
