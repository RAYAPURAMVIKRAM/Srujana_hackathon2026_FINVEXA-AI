// src/pages/OnboardingBankLink.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FinvexaLogo from '../components/FinvexaLogo'
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'

interface BankItem {
  id: string
  name: string
  shortName: string
  logoEmoji: string
  accountType: string
  color: string
}

const SUPPORTED_BANKS: BankItem[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    logoEmoji: '🏛️',
    accountType: 'Savings & Salary A/C',
    color: '#0284c7',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    logoEmoji: '🏦',
    accountType: 'SmartBanking & Salary',
    color: '#1d4ed8',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    logoEmoji: '💳',
    accountType: 'iMobile Digital Twin',
    color: '#ea580c',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    logoEmoji: '🏢',
    accountType: 'Priority & Current A/C',
    color: '#9f1239',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak 811',
    logoEmoji: '🛡️',
    accountType: 'Zero-Balance & MSME',
    color: '#dc2626',
  },
  {
    id: 'canara',
    name: 'Canara Bank',
    shortName: 'Canara Bank',
    logoEmoji: '🏛️',
    accountType: 'Retail & Business NetBanking',
    color: '#0369a1',
  },
  {
    id: 'upload',
    name: 'Upload Statement Only',
    shortName: 'CSV / PDF Upload',
    logoEmoji: '📄',
    accountType: 'Offline Mode (No NetBanking)',
    color: '#059669',
  },
]

export default function OnboardingBankLink() {
  const navigate = useNavigate()
  const { completeOnboarding, linkBankSuccess } = useApp()

  const [selectedBank, setSelectedBank] = useState<BankItem>(SUPPORTED_BANKS[1]) // Default HDFC
  const [permissions, setPermissions] = useState({
    readOnlyHistory: true,
    autoExpire30Days: true,
    instantRevoke: true,
  })
  const [otp, setOtp] = useState('8492')
  const [isVerifying, setIsVerifying] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState('')

  // Retrieve temporary onboarding details from step 1
  const getTempDetails = () => {
    try {
      const raw = sessionStorage.getItem('finvexa_temp_onboarding')
      if (raw) return JSON.parse(raw)
    } catch {
      // ignore
    }
    return { name: 'Explorer', income: 45000, persona: 'salaried' as PersonaType }
  }

  const handleFinishOnboarding = (skipBank = false) => {
    const details = getTempDetails()

    if (!skipBank) {
      setIsVerifying(true)
      setSyncProgress(20)
      setSyncStatus('Initiating RBI AA Sahamati Gateway handshake...')

      setTimeout(() => {
        setSyncProgress(55)
        setSyncStatus(`Verifying digital certificate for ${selectedBank.name}...`)
      }, 500)

      setTimeout(() => {
        setSyncProgress(85)
        setSyncStatus('Syncing 90-day anonymized ledger (AES-256 GCM)...')
      }, 950)

      setTimeout(() => {
        setSyncProgress(100)
        setSyncStatus('Calibration complete! Entering FINVEXA...')
        setIsVerifying(false)

        completeOnboarding(
          details.name,
          details.income,
          details.persona,
          details.goal,
          details.goalAmount,
          details.goalDays
        )
        linkBankSuccess(selectedBank.name, selectedBank.id, '•••• 4912')
        navigate('/dashboard')
      }, 1450)
    } else {
      completeOnboarding(
        details.name,
        details.income,
        details.persona,
        details.goal,
        details.goalAmount,
        details.goalDays
      )
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 10%, #FFFFFF 0%, #F8FAFC 60%, #EEF2F6 100%)',
      }}
    >
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <FinvexaLogo size={36} showWordmark={false} animated={false} themeMode="light" />
          <span className="font-black text-slate-900 text-lg tracking-tight">FINVEXA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Step 2 of 2: Bank Safety & Consent
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Read-Only · Zero Password Sharing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Connect Your Bank via RBI Account Aggregator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Regulated by the Reserve Bank of India (RBI). FINVEXA only monitors historical credits & debits to predict cash shortages. We can never move money or charge you.
          </p>
        </div>

        {/* Step A: Bank Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Step A: Select Your Institution
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SUPPORTED_BANKS.map(bank => {
              const isSelected = selectedBank.id === bank.id
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-md scale-[1.01]'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{bank.logoEmoji}</span>
                  <div className="truncate flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{bank.shortName}</span>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-emerald-500 ml-auto shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{bank.accountType}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step B: Privacy & Security Guarantees */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Lock size={15} className="text-emerald-600" />
            <span>Step B: Your 3 Legal Privacy Rights (Sahamati Standard)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.readOnlyHistory}
                onChange={e => setPermissions(p => ({ ...p, readOnlyHistory: e.target.checked }))}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Read-Only History</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Cannot withdraw or execute UPI transactions.
                </div>
              </div>
            </label>

            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.autoExpire30Days}
                onChange={e => setPermissions(p => ({ ...p, autoExpire30Days: e.target.checked }))}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Auto-Expire in 30 Days</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Consent automatically self-destructs after 30 days.
                </div>
              </div>
            </label>

            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.instantRevoke}
                onChange={e => setPermissions(p => ({ ...p, instantRevoke: e.target.checked }))}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">1-Click Instant Revoke</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Cancel access anytime from your profile with 1 tap.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Step C: OTP Verification Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound size={15} className="text-emerald-600" />
              <span>Step C: Authenticate with Demo OTP</span>
            </span>
            <button
              type="button"
              onClick={() => setOtp('8492')}
              className="text-[11px] font-bold text-emerald-600 hover:underline"
            >
              Use Demo OTP: 8492
            </button>
          </div>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="8492"
            className="w-full py-2.5 px-4 text-center font-mono text-xl font-bold tracking-widest text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
          />

          {isVerifying && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 animate-pulse">
              <div className="flex justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin text-emerald-600" />
                  <span>{syncStatus}</span>
                </span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-4xl mx-auto pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => navigate('/onboarding/personality')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Personality</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleFinishOnboarding(true)}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Skip Bank Linking for Now
          </button>

          <button
            onClick={() => handleFinishOnboarding(false)}
            disabled={isVerifying}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)',
            }}
          >
            <span>Verify & Enter FINVEXA</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
