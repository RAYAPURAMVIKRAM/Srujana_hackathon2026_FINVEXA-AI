// src/components/TopBar.tsx
import { Zap, LogOut, ChevronDown, Shield, Cloud } from 'lucide-react'
import { useApp, PERSONAS } from '../context/AppContext'
import type { PersonaType } from '../context/AppContext'
import { useState } from 'react'
import CloudAssetManager from './CloudAssetManager'

export default function TopBar() {
  const { persona, setPersona, personaData, authUser, demoLogin, logout } = useApp()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)

  const personaList: PersonaType[] = ['salaried', 'freelancer', 'business']

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{
          background: 'rgba(2,6,23,0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center h-full px-4 gap-3 lg:gap-4 justify-between">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2.5 min-w-[200px] lg:min-w-[340px]">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: personaData.theme.buttonGradient }}
            >
              <Shield size={16} className="text-white" />
            </div>
            <div className="truncate">
              <div className="text-base font-black text-white leading-none tracking-tight flex items-center gap-2">
                <span>FINVEXA</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-normal bg-white/10 text-slate-300">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 leading-tight mt-0.5 font-semibold tracking-normal hidden sm:block truncate">
                Universal Financial Digital Twin & Multi-Risk Decision Engine
              </div>
              <div className="text-[9px] text-emerald-400 leading-tight mt-0.5 font-semibold sm:hidden">
                Financial Digital Twin
              </div>
            </div>
          </div>

          {/* Dynamic 3 Persona Switcher */}
          <div className="flex items-center gap-1.5 flex-1 justify-center max-w-xl">
            <span className="text-[11px] text-slate-400 mr-1 hidden xl:block font-medium uppercase tracking-wider">
              Profile:
            </span>
            {personaList.map(type => {
              const p = PERSONAS[type]
              const isActive = persona === type
              return (
                <button
                  key={type}
                  onClick={() => setPersona(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
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
                  <span className="hidden md:inline">{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Actions: Cloud Asset Manager + Judge Demo / User */}
          <div className="flex items-center gap-2 min-w-fit">
            {/* Cloud Asset Manager Button */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">☁️ Cloud Asset Manager</span>
              <span className="sm:hidden">☁️ Assets</span>
            </button>

            {!authUser ? (
              <button
                onClick={demoLogin}
                className="btn-primary text-xs py-1.5 px-3 animate-glow-pulse flex items-center gap-1"
                style={{ fontSize: '12px' }}
              >
                <Zap size={13} />
                <span className="hidden sm:inline">⚡ 1-Click Judge Demo</span>
                <span className="sm:hidden">⚡ Demo</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {authUser.name[0]}
                  </div>
                  <span className="text-xs text-slate-300 font-medium hidden sm:block">
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
    </>
  )
}
