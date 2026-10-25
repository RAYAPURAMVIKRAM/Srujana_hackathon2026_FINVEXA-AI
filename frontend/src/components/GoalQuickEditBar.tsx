// src/components/GoalQuickEditBar.tsx
import React, { useState } from 'react'
import { Target, IndianRupee, Clock, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function GoalQuickEditBar() {
  const { userGoal, simulator, persona, personaData, applyUserGoalToEntireApp } = useApp()
  const theme = personaData.theme

  const [isOpen, setIsOpen] = useState(false)
  const [goalText, setGoalText] = useState(userGoal.title || '')
  const [goalAmount, setGoalAmount] = useState<number>(simulator.decisionCost || userGoal.targetAmount || 55000)
  const [goalDays, setGoalDays] = useState<number>(simulator.paymentDelayDays || 15)
  const [justSaved, setJustSaved] = useState(false)

  const quickPresets: Record<string, { title: string; cost: number; days: number }[]> = {
    salaried: [
      { title: 'Buy a ₹55,000 Laptop / Bike', cost: 55000, days: 60 },
      { title: 'Save for ₹75,000 Electric Scooter', cost: 75000, days: 90 },
      { title: 'Build ₹30,000 Emergency Fund', cost: 30000, days: 45 },
    ],
    freelancer: [
      { title: 'Buy ₹45,000 Camera & Editing Gear', cost: 45000, days: 22 },
      { title: 'Upgrade Home Studio (₹65,000)', cost: 65000, days: 45 },
      { title: 'Save 3-Month Rent Buffer (₹40,000)', cost: 40000, days: 30 },
    ],
    business: [
      { title: 'Accept ₹1,00,000 T-Shirt Corporate Order', cost: 60000, days: 25 },
      { title: 'Buy ₹2,50,000 Screen Printing Machine', cost: 250000, days: 90 },
      { title: 'Stock ₹80,000 Cotton Yarn Before Diwali', cost: 80000, days: 30 },
    ],
  }

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    applyUserGoalToEntireApp(goalText, goalAmount, goalDays)
    setJustSaved(true)
    setTimeout(() => {
      setJustSaved(false)
      setIsOpen(false)
    }, 1200)
  }

  const handleSelectPreset = (p: { title: string; cost: number; days: number }) => {
    setGoalText(p.title)
    setGoalAmount(p.cost)
    setGoalDays(p.days)
    applyUserGoalToEntireApp(p.title, p.cost, p.days)
    setJustSaved(true)
    setTimeout(() => {
      setJustSaved(false)
      setIsOpen(false)
    }, 1200)
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg p-3 sm:p-4 transition-all duration-200">
      {/* Collapsed summary view */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{ background: theme.buttonGradient }}
          >
            <Target size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Active Goal & Simulation
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{
                  background: `${theme.primaryHex}15`,
                  color: theme.primaryHex,
                  borderColor: `${theme.primaryHex}35`,
                }}
              >
                Syncs All Graphs
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-sm font-black text-white truncate max-w-[260px] sm:max-w-md">
                {userGoal.title || personaData.purchaseLabel}
              </span>
              <span className="mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                ₹{simulator.decisionCost.toLocaleString('en-IN')}
              </span>
              <span className="mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                {simulator.paymentDelayDays} Days Delay
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>🎯 Edit My Goal & Amount</span>
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Expanded quick-edit form */}
      {isOpen && (
        <form onSubmit={handleApply} className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Goal Title */}
            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-bold text-slate-300">Goal Description / Order Name</label>
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2 focus-within:border-emerald-500">
                <Target size={16} className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={goalText}
                  onChange={e => setGoalText(e.target.value)}
                  placeholder="e.g. Buy a ₹65,000 MacBook Air"
                  className="w-full text-xs font-semibold text-white bg-transparent placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Rupee Amount */}
            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-300">Goal Cost / Value (₹)</label>
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2 focus-within:border-emerald-500">
                <IndianRupee size={16} className="text-emerald-400 mr-1 shrink-0" />
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={goalAmount}
                  onChange={e => setGoalAmount(Number(e.target.value) || 0)}
                  placeholder="55000"
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Delay / Timeline Days */}
            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-300">Delay / Timeline (Days)</label>
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2 focus-within:border-emerald-500">
                <Clock size={16} className="text-amber-400 mr-1.5 shrink-0" />
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={goalDays}
                  onChange={e => setGoalDays(Number(e.target.value) || 0)}
                  placeholder="22"
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400">Quick Test Scenarios:</span>
            {(quickPresets[persona] || quickPresets.salaried).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-400" />
              <span>Instantly recalculates 90-day cashflow, shortage day, 6 risks & rescue plans.</span>
            </span>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              style={{ background: justSaved ? '#059669' : theme.buttonGradient }}
            >
              {justSaved ? (
                <>
                  <Check size={14} />
                  <span>Applied to All Graphs & Sliders!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Apply Goal to Entire App</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
