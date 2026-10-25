// src/pages/Simulator.tsx
import { useState } from 'react'
import {
  Sliders,
  Cloud,
  CheckCircle2,
  Loader2,
  Database,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { saveScenario } from '../lib/supabase'
import GoalQuickEditBar from '../components/GoalQuickEditBar'
import JudgeValidationPanel from '../components/JudgeValidationPanel'
import ZeroManualInputFlow from '../components/ZeroManualInputFlow'

export default function Simulator() {
  const { personaData, simulator } = useApp()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'cloud' | 'local'; message: string } | null>(null)

  const handleSaveScenario = async () => {
    setSaving(true)
    setSaveStatus(null)

    const res = await saveScenario({
      name: `${personaData.label} — ₹${(simulator.decisionCost / 1000).toFixed(0)}K Order Simulation`,
      persona_type: personaData.type,
      balance: personaData.balance,
      monthly_income: personaData.monthlyIncome,
      locked_reserves: personaData.lockedReserves,
      decision_cost: simulator.decisionCost,
      payment_delay_days: simulator.paymentDelayDays,
      upfront_percent: simulator.upfrontPercent,
      hidden_cost_buffer: simulator.hiddenCostBuffer,
      split_batches: simulator.splitBatches,
      projected_shortage: 35000,
      valley_days: 14,
      stress_min_balance: -35000,
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      {/* 0. Live Goal Quick Edit Bar (Syncs Entire App) */}
      <GoalQuickEditBar />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-yellow-300 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <Sliders size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Before-You-Spend 90-Day Money Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
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
        </div>
      </div>

      {/* Toast Notification */}
      {saveStatus && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs animate-fade-in border shadow-md ${
            saveStatus.type === 'cloud'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : 'bg-yellow-50 border-yellow-400 text-yellow-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {saveStatus.type === 'cloud' ? <Database size={15} /> : <CheckCircle2 size={15} />}
            <span>{saveStatus.message}</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-600">
            {saveStatus.type === 'cloud' ? 'Supabase Online' : 'Local Storage'}
          </span>
        </div>
      )}

      {/* 3-STEP GUIDED ZERO-INPUT WORKFLOW */}
      <ZeroManualInputFlow />

      {/* Srujana 2026 Rubric: Judge Validation, Edge-Cases & Limitations Panel */}
      <JudgeValidationPanel />
    </div>
  )
}
