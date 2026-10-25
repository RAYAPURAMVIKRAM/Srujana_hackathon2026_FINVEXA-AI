// src/components/RbiAccountAggregatorModal.tsx
import { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  KeyRound,
  RefreshCw,
  FileCheck2,
  Trash2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

interface RbiAccountAggregatorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface BankOption {
  id: string
  name: string
  shortName: string
  logoEmoji: string
  type: string
  color: string
}

const INDIAN_BANKS: BankOption[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    logoEmoji: '🏛️',
    type: 'Savings & Salary A/C',
    color: '#0284c7',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    logoEmoji: '🏦',
    type: 'SmartBanking & Salary',
    color: '#1d4ed8',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    logoEmoji: '💳',
    type: 'iMobile Digital A/C',
    color: '#ea580c',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    logoEmoji: '🏢',
    type: 'Priority & Current A/C',
    color: '#9f1239',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak 811',
    logoEmoji: '🛡️',
    type: 'Zero-Balance & MSME',
    color: '#dc2626',
  },
  {
    id: 'gstn',
    name: 'GSTN Business Ledger',
    shortName: 'GSTN Ledger',
    logoEmoji: '📜',
    type: 'Govt Invoices & E-Way Bills',
    color: '#059669',
  },
]

export default function RbiAccountAggregatorModal({
  isOpen,
  onClose,
}: RbiAccountAggregatorModalProps) {
  const { bankConsent, linkBankSuccess, revokeBankConsent } = useApp()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedBank, setSelectedBank] = useState<BankOption>(INDIAN_BANKS[1]) // Default HDFC
  const [permissions, setPermissions] = useState({
    readOnlyHistory: true,
    autoExpire30Days: true,
    instantRevoke: true,
  })
  const [otp, setOtp] = useState('8492')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStepText, setSyncStepText] = useState('')
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  if (!isOpen) return null

  const handleStartSync = () => {
    setIsSyncing(true)
    setSyncProgress(15)
    setSyncStepText('Initiating secure Sahamati AA Gateway handshake...')

    setTimeout(() => {
      setSyncProgress(45)
      setSyncStepText('Verifying RBI FIP digital signature & token...')
    }, 450)

    setTimeout(() => {
      setSyncProgress(80)
      setSyncStepText('Fetching 90-day read-only encrypted statement payload...')
    }, 900)

    setTimeout(() => {
      setSyncProgress(100)
      setSyncStepText('AES-256 payload verified! Cash safety floor calibrated.')
      setIsSyncing(false)
      linkBankSuccess(selectedBank.name, selectedBank.id, '•••• 4912')
      onClose()
    }, 1450)
  }

  const handleRevoke = () => {
    revokeBankConsent()
    setShowRevokeConfirm(false)
    setStep(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900/95 backdrop-blur-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-7 relative transition-all text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 shadow-md">
            <Lock size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                RBI Safe Account Aggregator (AA)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sahamati Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Legal, encrypted, and 100% read-only banking data consent under Reserve Bank of India (RBI) NBFC-AA Master Directives.
            </p>
          </div>
        </div>

        {/* Legal Non-Negotiable Badge */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300 mb-6 shadow-md">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
          <span className="font-semibold text-[11px] sm:text-xs">
            100% Read-Only • RBI Regulated Account Aggregator (Sahamati Standard) • Zero Password Sharing
          </span>
        </div>

        {/* ALREADY CONNECTED VIEW */}
        {bankConsent.isLinked ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl border border-white/10 shadow-md">
                    🏛️
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{bankConsent.bankName}</span>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {bankConsent.accountMasked}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Consent Token: <span className="font-mono text-slate-300 font-semibold">{bankConsent.consentId}</span>
                    </div>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>Active</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Linked Date</span>
                  <span className="text-slate-200 font-bold">{bankConsent.linkedAt || 'Today'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Auto-Expires In</span>
                  <span className="text-amber-400 font-bold">{bankConsent.expiresInDays} Days</span>
                </div>
              </div>
            </div>

            {/* Active Permissions List */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5 text-xs">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <FileCheck2 size={14} className="text-emerald-400" />
                <span>Your Active Privacy Guarantees:</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] pl-5 list-disc font-medium">
                <li><strong className="text-white">View-Only:</strong> Cannot withdraw, transfer, or authorize any payments.</li>
                <li><strong className="text-white">Zero Storage of Credentials:</strong> Neither netbanking passwords nor ATM PINs are ever requested.</li>
                <li><strong className="text-white">Auto-Termination:</strong> Access expires automatically in 30 days.</li>
              </ul>
            </div>

            {/* Revoke confirmation / actions */}
            {showRevokeConfirm ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-3">
                <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                  <AlertCircle size={15} />
                  <span>Are you sure you want to revoke bank access?</span>
                </div>
                <p className="text-xs text-rose-300/80">
                  FINVEXA will immediately delete the read-only authorization token. Real-time cashflow simulations will revert to demo presets.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowRevokeConfirm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevoke}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    Yes, Revoke Consent Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setShowRevokeConfirm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Trash2 size={14} />
                  <span>1-Click Revoke Consent</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-transform"
                >
                  Done (Keep Active)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 3-STEP LINKING FLOW */
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-5 px-1">
              {[
                { s: 1, label: 'Select Bank' },
                { s: 2, label: 'Privacy Control' },
                { s: 3, label: 'OTP Verify' },
              ].map(item => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-emerald-600 text-white shadow-md'
                        : step > item.s
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      step === item.s ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: SELECT BANK */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step 1: Choose Your Financial Institution
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INDIAN_BANKS.map(bank => {
                    const isSelected = selectedBank.id === bank.id
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-md scale-[1.01]'
                            : 'bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{bank.logoEmoji}</span>
                        <div className="truncate flex-1">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{bank.shortName}</span>
                            {isSelected && (
                              <CheckCircle2 size={13} className="text-emerald-400 ml-auto shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{bank.type}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">
                    Selected: <strong className="text-white">{selectedBank.name}</strong>
                  </span>
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-transform bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                  >
                    <span>Next: Choose Permissions</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRIVACY & PERMISSION CHECKLIST */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step 2: Control Your Financial Permissions
                </div>

                <div className="space-y-2.5">
                  {/* Checklist Item 1 */}
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors shadow-md">
                    <input
                      type="checkbox"
                      checked={permissions.readOnlyHistory}
                      onChange={e =>
                        setPermissions(p => ({ ...p, readOnlyHistory: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Read-Only Transaction History</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                          Zero Fund Movement
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        FINVEXA can only view historical balance debits and salary credits to predict cash valleys. It is technically impossible to move funds.
                      </p>
                    </div>
                  </label>

                  {/* Checklist Item 2 */}
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors shadow-md">
                    <input
                      type="checkbox"
                      checked={permissions.autoExpire30Days}
                      onChange={e =>
                        setPermissions(p => ({ ...p, autoExpire30Days: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Auto-Expire Consent in 30 Days</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                          Auto-Destruct
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Consent automatically expires on Day 30 unless explicitly renewed by you.
                      </p>
                    </div>
                  </label>

                  {/* Checklist Item 3 */}
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors shadow-md">
                    <input
                      type="checkbox"
                      checked={permissions.instantRevoke}
                      onChange={e =>
                        setPermissions(p => ({ ...p, instantRevoke: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>1-Click Instant Revoke Anytime</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                          Sahamati Standard
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        You can immediately pull back access with a single tap from the navigation bar.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-transform bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                  >
                    <span>Proceed to OTP Verify</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DEMO OTP VERIFICATION */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step 3: Authenticate with Safe OTP
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-white">Enter Demo RBI AA OTP:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp('8492')}
                      className="text-[11px] text-cyan-400 hover:underline font-mono font-bold"
                    >
                      Fill Demo: 8492
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="8492"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-400 shadow-inner"
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 text-center font-medium">
                    Simulating OTP sent to your Aadhaar/Mobile linked to <strong className="text-white">{selectedBank.shortName}</strong>.
                  </div>
                </div>

                {/* Animated Encrypted Sync Progress */}
                {isSyncing ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw size={14} className="animate-spin text-emerald-400" />
                        <span>{syncStepText}</span>
                      </span>
                      <span>{syncProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                        style={{ width: `${syncProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleStartSync}
                      disabled={otp.length < 4}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-transform bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                    >
                      <Lock size={14} />
                      <span>Verify with Demo OTP (8492)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>Protected by 256-bit Sahamati AA Tokenization</span>
          <span className="flex items-center gap-1 text-slate-400">
            <span>RBI AA Directives 2016-2026</span>
          </span>
        </div>
      </div>
    </div>
  )
}
