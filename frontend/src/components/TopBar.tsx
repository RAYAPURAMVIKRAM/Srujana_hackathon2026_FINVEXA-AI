// src/components/TopBar.tsx
import { Zap, LogOut, ChevronDown, Shield, Cloud, Lock } from 'lucide-react'
import { useApp, PERSONAS } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'
import { useState } from 'react'
import CloudAssetManager from './CloudAssetManager'
import RbiAccountAggregatorModal from './RbiAccountAggregatorModal'

export default function TopBar() {
  const { persona, setPersona, personaData, authUser, demoLogin, logout, bankConsent } = useApp()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const [isRbiModalOpen, setIsRbiModalOpen] = useState(false)

  const personaList: PersonaType[] = ['salaried', 'freelancer', 'business']

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{
          background: 'rgba(2,6,23,0.94)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center h-full px-2.5 sm:px-4 gap-2 sm:gap-3 lg:gap-4 justify-between max-w-full overflow-hidden">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: personaData.theme.buttonGradient }}
            >
              <Shield size={16} className="text-white" />
            </div>
            <div className="truncate">
              <div className="text-sm sm:text-base font-black text-white leading-none tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span>FINVEXA</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono font-normal bg-white/10 text-slate-300">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 leading-tight mt-0.5 font-semibold tracking-normal hidden md:block truncate">
                Universal Financial Digital Twin & Multi-Risk Decision Engine
              </div>
            </div>
          </div>

          {/* Swipeable 3 Persona Switcher (Horizontal scroll on mobile) */}
          <div className="flex items-center gap-1.5 flex-1 justify-center max-w-lg overflow-x-auto no-scrollbar py-1 px-1">
            <span className="text-[11px] text-slate-400 mr-1 hidden 2xl:block font-medium uppercase tracking-wider shrink-0">
              Profile:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {personaList.map(type => {
                const p = PERSONAS[type]
                const isActive = persona === type
                return (
                  <button
                    key={type}
                    onClick={() => setPersona(type)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                      isActive
                        ? 'text-white border shadow-lg scale-[1.03]'
                        : 'text-slate-400 border border-transparent hover:border-slate-700 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    style={{
                      background: isActive ? p.theme.buttonGradient : undefined,
                      borderColor: isActive ? 'rgba(255,255,255,0.3)' : undefined,
                      boxShadow: isActive ? `0 0 16px ${p.theme.primaryHex}50` : undefined,
                    }}
                  >
                    <span>{p.emoji}</span>
                    <span className="text-[11px] sm:text-xs">
                      {type === 'salaried'
                        ? 'Student/Job'
                        : type === 'freelancer'
                        ? 'Freelancer'
                        : 'Small Biz'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions: RBI AA Bank Link + Cloud Assets + Demo Login */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 🔒 RBI Account Aggregator (AA) Safe Bank Link Button */}
            <button
              onClick={() => setIsRbiModalOpen(true)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md ${
                bankConsent.isLinked
                  ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-400/50 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                  : 'text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/50'
              }`}
              title="RBI Safe Account Aggregator Bank Link"
            >
              {bankConsent.isLinked ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="hidden lg:inline">✅ RBI AA Synced (Read-Only)</span>
                  <span className="lg:hidden text-[11px]">✅ AA Synced</span>
                </>
              ) : (
                <>
                  <Lock size={12} className="text-emerald-400 shrink-0" />
                  <span className="hidden lg:inline">🔒 Link Bank (RBI Safe AA)</span>
                  <span className="lg:hidden text-[11px]">🔒 Link Bank</span>
                </>
              )}
            </button>

            {/* Cloud Asset Manager Button (Hidden on ultra-small mobile to prevent clutter) */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200"
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-emerald-400 animate-pulse" />
              <span className="hidden xl:inline">☁️ Cloud Assets</span>
              <span className="xl:hidden">☁️ Assets</span>
            </button>

            {!authUser ? (
              <button
                onClick={demoLogin}
                className="btn-primary text-xs py-1.5 px-2.5 sm:px-3 animate-glow-pulse flex items-center gap-1"
                style={{ fontSize: '11px' }}
              >
                <Zap size={12} />
                <span className="hidden sm:inline">⚡ Demo</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 transition-all duration-200"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {authUser.name[0]}
                  </div>
                  <span className="text-xs text-slate-300 font-medium hidden md:block">
                    {authUser.name}
                  </span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-10 w-44 glass-card p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                      <div className="text-xs font-semibold text-slate-300">{authUser.name}</div>
                      <div className="text-[10px] text-slate-500">{authUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                    >
                      <LogOut size={12} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cloud Asset Manager Modal */}
      <CloudAssetManager
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
      />

      {/* RBI Account Aggregator (AA) Safe Bank Consent Modal */}
      <RbiAccountAggregatorModal
        isOpen={isRbiModalOpen}
        onClose={() => setIsRbiModalOpen(false)}
      />
    </>
  )
}

