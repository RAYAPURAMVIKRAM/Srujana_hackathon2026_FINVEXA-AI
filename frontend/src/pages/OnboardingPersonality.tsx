// src/pages/OnboardingPersonality.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FinvexaLogo from '../components/FinvexaLogo'
import { CheckCircle2, ArrowRight, Sparkles, User, IndianRupee } from 'lucide-react'
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
  },
]

export default function OnboardingPersonality() {
  const navigate = useNavigate()
  const { authUser } = useApp()

  const [name, setName] = useState(authUser?.name !== 'Guest Explorer' ? authUser?.name || '' : '')
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('salaried')
  const [income, setIncome] = useState<number>(45000)

  const handleSelect = (p: PersonalityOption) => {
    setSelectedPersona(p.type)
    setIncome(p.defaultIncome)
  }

  const handleNext = () => {
    // Save temporary details in sessionStorage or state for step 2
    sessionStorage.setItem(
      'finvexa_temp_onboarding',
      JSON.stringify({
        name: name.trim() || 'Explorer',
        income,
        persona: selectedPersona,
      })
    )
    navigate('/onboarding/bank-link')
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 10%, #FFFFFF 0%, #F8FAFC 60%, #EEF2F6 100%)',
      }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />

      {/* Header with Step Indicator */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <FinvexaLogo size={36} showWordmark={false} animated={false} themeMode="light" />
          <span className="font-black text-slate-900 text-lg tracking-tight">FINVEXA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Step 1 of 2: Your Life Situation
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Tell Us About Your Financial Life
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            FINVEXA custom-calibrates every single simulation, warning, and rescue strategy to your exact situation.
          </p>
        </div>

        {/* Input Details: Name & Monthly Inflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Full Name
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <User size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Vikram Rayapuram"
                className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Income / Pocket Money Estimate
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <IndianRupee size={16} className="text-slate-400 mr-1.5 shrink-0" />
              <input
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value) || 0)}
                placeholder="45000"
                className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3 Personality Cards */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Your Personality
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {PERSONALITIES.map(p => {
              const isSelected = selectedPersona === p.type
              return (
                <div
                  key={p.type}
                  onClick={() => handleSelect(p)}
                  className={`p-5 sm:p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white shadow-xl scale-[1.02]'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                  style={{
                    borderColor: isSelected ? p.color : undefined,
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
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: p.color }}>
                        {p.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">
                      ⚡ Key Protection:
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800 leading-tight block mt-0.5">
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
      <div className="w-full max-w-4xl mx-auto pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles size={14} className="text-emerald-500" />
          <span>You can switch your personality anytime later from your Profile.</span>
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
