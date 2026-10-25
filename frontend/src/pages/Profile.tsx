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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border mb-2"
            style={{
              borderColor: `${theme.primaryHex}50`,
              background: `${theme.primaryHex}15`,
              color: theme.primaryHex,
            }}
          >
            <User size={13} />
            <span>Account, Financial Personality & Bank Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Profile & Security Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your personal details, switch your life situation, and control RBI Account Aggregator consent.
          </p>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleThemeMode}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/20 text-white flex items-center gap-2 transition-all shadow-md"
        >
          <span>{isLight ? '🌙 Switch to Dark Theme' : '☀️ Switch to Pearl Light Theme'}</span>
        </button>
      </div>

      {/* Grid: User Card + Active Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* User Identity Card */}
        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl"
                style={{ background: theme.buttonGradient }}
              >
                {authUser?.name ? authUser.name[0].toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <h3 className="text-base font-bold text-white truncate">
                  {authUser?.name || 'Explorer'}
                </h3>
                <span className="text-xs text-slate-400 font-mono block truncate">
                  {authUser?.phone ? `+91 ${authUser.phone}` : authUser?.email || 'Guest Explorer'}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {authUser?.isGuest ? 'Guest Session' : 'Verified Member'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Inflow:</span>
                <span className="font-bold text-emerald-400 mono">
                  ₹{personaData.monthlyIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Untouchable Floor:</span>
                <span className="font-bold text-amber-400 mono">
                  ₹{personaData.lockedReserves.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">FINVEXA v2.5</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </Tilt3DCard>

        {/* Current Personality Card */}
        <Tilt3DCard
          className="glass-card p-6 border md:col-span-2 flex flex-col justify-between"
          style={{
            borderColor: `${theme.primaryHex}40`,
            boxShadow: `0 8px 30px ${theme.orb1}`,
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Financial Personality
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm"
                style={{
                  background: theme.buttonGradient,
                  color: '#FFFFFF',
                }}
              >
                {personaData.label}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-3xl mt-1">{personaData.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  "{personaData.story}"
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Your sliders, risk radar, and rescue strategies automatically adapt to this persona's real-life challenges.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400">
              Want to test a different life situation? Choose below:
            </span>
          </div>
        </Tilt3DCard>
      </div>

      {/* Switch Personality Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-400" />
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
                className={`glass-card p-5 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-400 bg-white/10 shadow-xl scale-[1.01]'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
                style={{
                  borderColor: isSelected ? p.theme.primaryHex : undefined,
                  boxShadow: isSelected ? `0 0 24px ${p.theme.primaryHex}40` : undefined,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{p.emoji}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.label}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {p.story}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Starting Balance:</span>
                  <span className="font-bold text-white mono">
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
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Bank Connection & RBI Safe Consent (Sahamati Standard)</span>
        </h2>

        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                🏛️
              </div>
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>{bankConsent.isLinked ? bankConsent.bankName : 'No Bank Linked Yet'}</span>
                  {bankConsent.isLinked && (
                    <span className="text-xs text-emerald-400 font-mono">
                      {bankConsent.accountMasked}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
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
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Revoke Consent</span>
                  </button>
                  <button
                    onClick={() => setIsRbiModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  >
                    Manage Token
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsRbiModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)' }}
                >
                  <Lock size={13} />
                  <span>Connect Bank Safely</span>
                </button>
              )}
            </div>
          </div>

          {/* Revoke confirmation box */}
          {showRevokeConfirm && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
              <div className="text-xs font-bold text-rose-300">
                Are you sure you want to revoke bank access?
              </div>
              <p className="text-xs text-rose-200/80">
                FINVEXA will instantly purge the read-only session token and revert to demo presets.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    revokeBankConsent()
                    setShowRevokeConfirm(false)
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Confirm Revoke
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              100% Read-Only Protected
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Zero NetBanking Password Sharing
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Sahamati AA Standard
            </span>
          </div>
        </Tilt3DCard>
      </div>

      {/* Hackathon Judge Action: Reset Onboarding */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <RotateCcw size={14} />
              <span>Hackathon Judge Demo Control</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Reset First-Time Onboarding & Splash Screen
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Pitching to judges? With 1 click, reset all stored sessions on this device to experience the pure white animated splash screen, smart login, and 2-step onboarding wizard again.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 shrink-0 flex items-center gap-1.5 transition-all shadow-md"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Flow</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2">
            <div className="text-xs font-bold text-white">
              Reset everything and go to Pure White Splash Screen?
            </div>
            <p className="text-xs text-slate-400">
              This clears `finvexa_auth_session` and `finvexa_onboarding_done` from this browser.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemo}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
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
