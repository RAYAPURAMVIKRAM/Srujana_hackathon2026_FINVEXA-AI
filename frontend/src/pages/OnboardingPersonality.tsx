// src/pages/OnboardingPersonality.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FinvexaLogo from '../components/FinvexaLogo'
import { CheckCircle2, ArrowRight, Sparkles, User, IndianRupee, Target, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'

interface PersonalityOption {
  type: PersonaType
  emoji: string
  title: string
  subtitle: string
  description: string
  highlight: string
  defaultIncome: number
  color: string
  defaultGoal: string
  defaultAmount: number
  defaultDays: number
  goalChips: { title: string; cost: number; days: number }[]
}

const PERSONALITIES: PersonalityOption[] = [
  {
    type: 'salaried',
    emoji: '🎓',
    title: 'Student & Job Holder',
    subtitle: 'Pocket Money & Fixed Salary',
    description:
      'I want to manage salary or pocket money, buy a laptop or bike safely, catch 1 AM late-night food deliveries & forgotten free-trial auto-debits, and keep hostel rent & college fees 100% safe.',
    highlight: '₹18,000 Rent & Fees Locked · ₹3,200 Delivery Leak Protection',
    defaultIncome: 45000,
    color: '#a855f7',
    defaultGoal: 'Buy a laptop or bike in 2 months',
    defaultAmount: 50000,
    defaultDays: 60,
    goalChips: [
      { title: 'Buy a laptop or bike in 2 months', cost: 50000, days: 60 },
      { title: 'Save for a ₹75,000 electric bike in 4 months', cost: 75000, days: 120 },
      { title: 'Build a ₹25,000 emergency fund in 3 months', cost: 25000, days: 90 },
    ],
  },
  {
    type: 'freelancer',
    emoji: '💻',
    title: 'Freelancer & Creator',
    subtitle: 'Irregular Gig & Client Payments',
    description:
      'I have irregular client income, want to buy studio/camera gear safely, handle late client invoices (delayed 22+ days), and verify uncredited UPI screenshots before releasing project files.',
    highlight: '22-Day Invoice Delay Simulator · WhatsApp UPI Screenshot Spy',
    defaultIncome: 65000,
    color: '#f59e0b',
    defaultGoal: 'Buy ₹45,000 camera gear in 45 days',
    defaultAmount: 45000,
    defaultDays: 45,
    goalChips: [
      { title: 'Buy ₹45,000 camera gear in 45 days', cost: 45000, days: 45 },
      { title: 'Upgrade home studio for ₹60,000 in 3 months', cost: 60000, days: 90 },
      { title: 'Save 3 months living buffer of ₹40,000', cost: 40000, days: 90 },
    ],
  },
  {
    type: 'business',
    emoji: '🏪',
    title: 'Small Business Owner',
    subtitle: 'T-Shirt Shop / MSME / B2B Trader',
    description:
      'I run a shop or business, evaluate big customer orders (like a ₹1,00,000 T-shirt order), protect staff salaries & shop rent, and calculate hidden transport charges before accepting orders.',
    highlight: '₹35,000 Cash Shortage Alert · Worker Wage Lock · Multi-Batch Split',
    defaultIncome: 85000,
    color: '#10b981',
    defaultGoal: 'Take a ₹1,00,000 T-shirt bulk order in 30 days',
    defaultAmount: 60000,
    defaultDays: 25,
    goalChips: [
      { title: 'Take a ₹1,00,000 T-shirt order in 30 days', cost: 60000, days: 25 },
      { title: 'Buy ₹2,50,000 screen printing machine in 6 months', cost: 250000, days: 180 },
      { title: 'Stock ₹80,000 raw cotton fabric before festival season', cost: 80000, days: 45 },
    ],
  },
]

export default function OnboardingPersonality() {
  const navigate = useNavigate()
  const { authUser, userGoal, simulator, applyUserGoalToEntireApp } = useApp()

  const [name, setName] = useState(authUser?.name !== 'Guest Explorer' ? authUser?.name || '' : '')
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('salaried')
  const [income, setIncome] = useState<number>(45000)
  const [goalInput, setGoalInput] = useState<string>(
    userGoal?.title || 'Buy a laptop or bike in 2 months'
  )
  const [goalAmount, setGoalAmount] = useState<number>(
    userGoal?.targetAmount || simulator.decisionCost || 50000
  )
  const [goalDays, setGoalDays] = useState<number>(simulator.paymentDelayDays || 60)

  const currentOption = PERSONALITIES.find(p => p.type === selectedPersona) || PERSONALITIES[0]

  const handleSelect = (p: PersonalityOption) => {
    setSelectedPersona(p.type)
    setIncome(p.defaultIncome)
    setGoalInput(p.defaultGoal)
    setGoalAmount(p.defaultAmount)
    setGoalDays(p.defaultDays)
  }

  const handleNext = () => {
    // Sync directly to the entire app
    applyUserGoalToEntireApp(goalInput.trim(), goalAmount, goalDays)

    // Save temporary details in sessionStorage
    sessionStorage.setItem(
      'finvexa_temp_onboarding',
      JSON.stringify({
        name: name.trim() || 'Explorer',
        income,
        persona: selectedPersona,
        goal: goalInput.trim(),
        goalAmount,
        goalDays,
      })
    )
    navigate('/onboarding/bank-link')
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Background Radiant Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      {/* Header with Step Indicator */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <FinvexaLogo size={36} showWordmark={false} animated={false} themeMode="dark" />
          <span className="font-black text-white text-lg tracking-tight">FINVEXA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Step 1 of 2: Life Situation & Goals
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto py-6 space-y-6 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tell Us About Your Financial Life & Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Bank statements only show past history. Tell FINVEXA what you want to buy, save for, or accept next so we can simulate your future.
          </p>
        </div>

        {/* Input Details: Name & Monthly Inflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Your Full Name
            </label>
            <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 focus-within:border-emerald-500">
              <User size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Vikram Rayapuram"
                className="w-full text-sm font-semibold text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Monthly Income / Pocket Money Estimate
            </label>
            <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 focus-within:border-emerald-500">
              <IndianRupee size={16} className="text-slate-400 mr-1.5 shrink-0" />
              <input
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value) || 0)}
                placeholder="45000"
                className="w-full text-sm font-semibold text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Next Big Goal / Purchase Input + Explicit Amount & Timeline */}
        <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Target size={18} />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white">
                What do you want to buy, save for, or accept as an order next?
              </label>
              <p className="text-[11px] text-slate-400">
                Specify your goal name, exact ₹ budget, and timeline so FINVEXA accurately configures all simulator graphs and risk checks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Goal Text Box */}
            <div className="sm:col-span-6 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal / Purchase Name</span>
              <div className="rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 focus-within:border-blue-500">
                <input
                  type="text"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="e.g. Buy a laptop or bike in 2 months"
                  className="w-full text-xs font-bold text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Explicit ₹ Amount */}
            <div className="sm:col-span-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exact Cost (₹)</span>
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 focus-within:border-emerald-500">
                <IndianRupee size={15} className="text-emerald-400 mr-1 shrink-0" />
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={goalAmount}
                  onChange={e => setGoalAmount(Number(e.target.value) || 0)}
                  placeholder={String(goalAmount || 50000)}
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Explicit Timeline / Days */}
            <div className="sm:col-span-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days / Delay</span>
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 focus-within:border-amber-500">
                <Clock size={15} className="text-amber-400 mr-1.5 shrink-0" />
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={goalDays}
                  onChange={e => setGoalDays(Number(e.target.value) || 0)}
                  placeholder="60"
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Goal Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions:</span>
            {currentOption.goalChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setGoalInput(chip.title)
                  setGoalAmount(chip.cost)
                  setGoalDays(chip.days)
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all border ${
                  goalInput === chip.title
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                {chip.title}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Personality Cards */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Your Personality
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PERSONALITIES.map(p => {
              const isSelected = selectedPersona === p.type
              return (
                <div
                  key={p.type}
                  onClick={() => handleSelect(p)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 shadow-2xl scale-[1.02]'
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? p.color : undefined,
                    boxShadow: isSelected ? `0 0 25px ${p.color}35` : undefined,
                  }}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ background: p.color }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                  )}

                  <div className="space-y-3">
                    <span className="text-4xl block">{p.emoji}</span>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: p.color }}>
                        {p.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      ⚡ Key Protection:
                    </span>
                    <span className="text-[11px] font-semibold text-slate-200 leading-tight block mt-0.5">
                      {p.highlight}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-4xl mx-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles size={14} className="text-emerald-400" />
          <span>You can switch your personality & goals anytime later from your Profile.</span>
        </div>

        <button
          onClick={handleNext}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
          }}
        >
          <span>Next: Connect Your Bank Safely</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
