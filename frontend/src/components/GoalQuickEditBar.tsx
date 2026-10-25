// src/components/GoalQuickEditBar.tsx
import React, { useState, useEffect } from 'react'
import { Target, IndianRupee, Clock, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function GoalQuickEditBar() {
  const { userGoal, simulator, persona, personaData, applyUserGoalToEntireApp, themeMode } = useApp()
  const theme = personaData.theme
  const isLight = themeMode === 'light'

  const [isOpen, setIsOpen] = useState(false)
  const [goalText, setGoalText] = useState(userGoal.title || '')
  const [goalAmount, setGoalAmount] = useState<number>(simulator.decisionCost || userGoal.targetAmount || 55000)
  const [goalDays, setGoalDays] = useState<number>(simulator.paymentDelayDays || 15)
  const [justSaved, setJustSaved] = useState(false)

  // Keep local state perfectly in sync whenever simulator or userGoal changes anywhere in the app
  useEffect(() => {
    if (userGoal?.title) setGoalText(userGoal.title)
    if (simulator?.decisionCost) setGoalAmount(simulator.decisionCost)
    if (simulator?.paymentDelayDays !== undefined) setGoalDays(simulator.paymentDelayDays)
  }, [userGoal.title, simulator.decisionCost, simulator.paymentDelayDays])

  const quickPresets: Record<string, { title: string; cost: number; days: number }[]> = {
    salaried: [
      {
        title: `Buy a ₹${(simulator?.decisionCost || 55000).toLocaleString('en-IN')} Laptop / Bike`,
        cost: simulator?.decisionCost || 55000,
        days: 60,
      },
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
    <div
      className={`w-full rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
        isLight
          ? 'bg-white border-2 border-slate-200 shadow-md text-slate-900'
          : 'bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg text-white'
      }`}
    >
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
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Active Goal & Simulation
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{
                  background: `${theme.primaryHex}15`,
                  color: isLight ? '#1e40af' : theme.primaryHex,
                  borderColor: `${theme.primaryHex}35`,
                }}
              >
                Syncs All Graphs
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className={`text-sm font-black truncate max-w-[260px] sm:max-w-md ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {userGoal.title || personaData.purchaseLabel}
              </span>
              <span className={`mono text-xs font-bold px-2 py-0.5 rounded-md ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                  : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
              }`}>
                ₹{simulator.decisionCost.toLocaleString('en-IN')}
              </span>
              <span className={`mono text-xs font-bold px-2 py-0.5 rounded-md ${
                isLight
                  ? 'text-amber-800 bg-amber-100 border border-amber-300'
                  : 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
              }`}>
                {simulator.paymentDelayDays} Days Delay
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
            isLight
              ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300'
              : 'text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15'
          }`}
        >
          <span>🎯 Edit My Goal & Amount</span>
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Expanded quick-edit form */}
      {isOpen && (
        <form onSubmit={handleApply} className={`mt-4 pt-4 border-t space-y-3 animate-fade-in ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Goal Title */}
            <div className="sm:col-span-6 space-y-1">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Goal Description / Order Name
              </label>
              <div className={`flex items-center rounded-xl px-3 py-2 border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 focus-within:border-blue-600'
                  : 'bg-slate-950/80 border-white/15 focus-within:border-emerald-500'
              }`}>
                <Target size={16} className={`mr-2 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={goalText}
                  onChange={e => setGoalText(e.target.value)}
                  placeholder="e.g. Buy a ₹65,000 MacBook Air"
                  className={`w-full text-xs font-semibold bg-transparent focus:outline-none ${
                    isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                  }`}
                />
              </div>
            </div>

            {/* Rupee Amount */}
            <div className="sm:col-span-3 space-y-1">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Goal Cost / Value (₹)
              </label>
              <div className={`flex items-center rounded-xl px-3 py-2 border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 focus-within:border-blue-600'
                  : 'bg-slate-950/80 border-white/15 focus-within:border-emerald-500'
              }`}>
                <IndianRupee size={16} className="text-emerald-500 mr-1 shrink-0" />
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={goalAmount}
                  onChange={e => setGoalAmount(Number(e.target.value) || 0)}
                  placeholder="55000"
                  className={`w-full text-xs font-bold bg-transparent focus:outline-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                />
              </div>
            </div>

            {/* Delay / Timeline Days */}
            <div className="sm:col-span-3 space-y-1">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Delay / Timeline (Days)
              </label>
              <div className={`flex items-center rounded-xl px-3 py-2 border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 focus-within:border-blue-600'
                  : 'bg-slate-950/80 border-white/15 focus-within:border-emerald-500'
              }`}>
                <Clock size={16} className="text-amber-500 mr-1.5 shrink-0" />
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={goalDays}
                  onChange={e => setGoalDays(Number(e.target.value) || 0)}
                  placeholder="22"
                  className={`w-full text-xs font-bold bg-transparent focus:outline-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="pt-2">
            <div className={`text-[11px] font-bold mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              One-Click Presets for {personaData.label}:
            </div>
            <div className="flex flex-wrap gap-2">
              {(quickPresets[persona] || quickPresets.salaried).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      : 'bg-slate-950/60 hover:bg-slate-950 border-white/10 hover:border-white/25 text-slate-300 hover:text-white'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Submit action */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 transition-all"
            >
              {justSaved ? (
                <>
                  <Check size={14} />
                  <span>Synced to All Graphs!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Update & Calibrate Everywhere</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
