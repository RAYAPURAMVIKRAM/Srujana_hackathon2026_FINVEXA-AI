// src/pages/Profile.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  Trash2,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react'
import { useApp, PERSONAS } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'
import RbiAccountAggregatorModal from '../components/RbiAccountAggregatorModal'

export default function Profile() {
  const navigate = useNavigate()
  const {
    authUser,
    persona,
    setPersona,
    personaData,
    bankConsent,
    revokeBankConsent,
    resetOnboardingDemo,
    logout,
    themeMode,
    toggleThemeMode,
  } = useApp()

  const [isRbiModalOpen, setIsRbiModalOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  const personaList: PersonaType[] = ['salaried', 'freelancer', 'business']
  const isLight = themeMode === 'light'
  const theme = personaData.theme

  const handleResetDemo = () => {
    resetOnboardingDemo()
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-2 shadow-xs"
            style={{
              borderColor: `${theme.primaryHex}40`,
              background: `${theme.primaryHex}10`,
              color: theme.primaryHex,
            }}
          >
            <User size={13} />
            <span>Account, Financial Personality & Bank Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Profile & Security Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage your personal details, switch your life situation, and control RBI Account Aggregator consent.
          </p>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleThemeMode}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 flex items-center gap-2 transition-all shadow-xs"
        >
          <span>{isLight ? '🌙 Switch to Dark Theme' : '☀️ Switch to Pearl Light Theme'}</span>
        </button>
      </div>

      {/* Grid: User Card + Active Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* User Identity Card */}
        <Tilt3DCard className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xs bg-blue-600"
              >
                {authUser?.name ? authUser.name[0].toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {authUser?.name || 'Explorer'}
                </h3>
                <span className="text-xs text-slate-500 font-mono block truncate">
                  {authUser?.phone ? `+91 ${authUser.phone}` : authUser?.email || 'Guest Explorer'}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {authUser?.isGuest ? 'Guest Session' : 'Verified Member'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Monthly Inflow:</span>
                <span className="font-bold text-emerald-700 mono">
                  ₹{personaData.monthlyIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Untouchable Floor:</span>
                <span className="font-bold text-amber-700 mono">
                  ₹{personaData.lockedReserves.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-mono font-bold">FINVEXA v2.5</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </Tilt3DCard>

        {/* Current Personality Card */}
        <Tilt3DCard
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs md:col-span-2 flex flex-col justify-between"
          style={{
            borderTopColor: theme.primaryHex,
            borderTopWidth: '4px',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Financial Personality
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs text-white"
                style={{
                  background: theme.primaryHex,
                }}
              >
                {personaData.label}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-3xl mt-1">{personaData.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  "{personaData.story}"
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Your sliders, risk radar, and rescue strategies automatically adapt to this persona's real-life challenges.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Want to test a different life situation? Choose below:
            </span>
          </div>
        </Tilt3DCard>
      </div>

      {/* Switch Personality Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-600" />
          <span>Switch Your Personality Anytime</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personaList.map(type => {
            const p = PERSONAS[type]
            const isSelected = persona === type

            return (
              <Tilt3DCard
                key={type}
                onClick={() => setPersona(type)}
                className={`bg-white rounded-3xl p-5 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-blue-600 shadow-md scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{p.emoji}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.label}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                    {p.story}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Starting Balance:</span>
                  <span className="font-bold text-slate-900 mono">
                    ₹{p.balance.toLocaleString('en-IN')}
                  </span>
                </div>
              </Tilt3DCard>
            )
          })}
        </div>
      </div>

      {/* RBI Account Aggregator (AA) Bank Link Hub */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span>Bank Connection & RBI Safe Consent (Sahamati Standard)</span>
        </h2>

        <Tilt3DCard className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                🏛️
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{bankConsent.isLinked ? bankConsent.bankName : 'No Bank Linked Yet'}</span>
                  {bankConsent.isLinked && (
                    <span className="text-xs text-emerald-700 font-mono font-bold">
                      {bankConsent.accountMasked}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {bankConsent.isLinked
                    ? `Consent Token: ${bankConsent.consentId} · Auto-expires in ${bankConsent.expiresInDays} days`
                    : 'Connect an Indian bank account via RBI AA for 100% read-only real-time simulations.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {bankConsent.isLinked ? (
                <>
                  <button
                    onClick={() => setShowRevokeConfirm(true)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Trash2 size={13} />
                    <span>Revoke Consent</span>
                  </button>
                  <button
                    onClick={() => setIsRbiModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-xs"
                  >
                    Manage Token
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsRbiModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <Lock size={13} />
                  <span>Connect Bank Safely</span>
                </button>
              )}
            </div>
          </div>

          {/* Revoke confirmation box */}
          {showRevokeConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5">
              <div className="text-xs font-bold text-rose-900">
                Are you sure you want to revoke bank access?
              </div>
              <p className="text-xs text-rose-800">
                FINVEXA will instantly purge the read-only session token and revert to demo presets.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    revokeBankConsent()
                    setShowRevokeConfirm(false)
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Confirm Revoke
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              100% Read-Only Protected
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Zero NetBanking Password Sharing
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Sahamati AA Standard
            </span>
          </div>
        </Tilt3DCard>
      </div>

      {/* Hackathon Judge Action: Reset Onboarding */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <RotateCcw size={14} />
              <span>Hackathon Judge Demo Control</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Reset First-Time Onboarding & Splash Screen
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl font-medium">
              Pitching to judges? With 1 click, reset all stored sessions on this device to experience the pure white animated splash screen, smart login, and 2-step onboarding wizard again.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 shrink-0 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Flow</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-3 p-4 rounded-2xl bg-white border border-amber-300 space-y-2 shadow-xs">
            <div className="text-xs font-bold text-slate-900">
              Reset everything and go to Pure White Splash Screen?
            </div>
            <p className="text-xs text-slate-600">
              This clears `finvexa_auth_session` and `finvexa_onboarding_done` from this browser.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemo}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
              >
                Yes, Reset for Judge Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RBI Modal */}
      <RbiAccountAggregatorModal
        isOpen={isRbiModalOpen}
        onClose={() => setIsRbiModalOpen(false)}
      />
    </div>
  )
}
