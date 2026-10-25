// src/components/TopBar.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Cloud,
  Lock,
  User,
  RotateCcw,
  LogOut,
  Coins,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import FinvexaLogo from './FinvexaLogo'
import CloudAssetManager from './CloudAssetManager'
import RbiAccountAggregatorModal from './RbiAccountAggregatorModal'

export default function TopBar() {
  const navigate = useNavigate()
  const {
    persona,
    personaData,
    authUser,
    logout,
    bankConsent,
    resetOnboardingDemo,
  } = useApp()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const [isRbiModalOpen, setIsRbiModalOpen] = useState(false)

  const handleResetDemo = () => {
    resetOnboardingDemo()
    setShowUserMenu(false)
    navigate('/')
  }

  const handleSignOut = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 bg-slate-950/80 text-white border-b border-white/10 backdrop-blur-xl shadow-md"
      >
        <div className="flex items-center h-full px-3 sm:px-5 justify-between max-w-full">
          {/* Logo & Brand Wordmark */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 group"
          >
            <FinvexaLogo size={28} showText={false} themeMode="dark" />
            <div className="truncate">
              <div className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span className="text-white">FINVEXA</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 leading-tight font-semibold tracking-normal hidden md:block truncate">
                Smart Money Decisions Before You Spend
              </div>
            </div>
          </div>

          {/* Quick Bank & Security Live Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsRbiModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                bankConsent.isLinked
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900/60 text-slate-300 border border-white/10 hover:border-emerald-500/50'
              }`}
              title="RBI Account Aggregator (Sahamati Standard)"
            >
              <Lock size={12} className="text-emerald-400" />
              <span>
                {bankConsent.isLinked
                  ? `✅ ${bankConsent.bankName || 'Bank'} Synced`
                  : '🔒 Connect RBI AA Bank'}
              </span>
            </button>

            <button
              onClick={() => navigate('/leaks')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            >
              <Coins size={12} className="text-amber-400" />
              <span>Hidden Money: ₹{personaData.hiddenLeaks}/mo</span>
            </button>
          </div>

          {/* Right Action Tools: Cloud Assets + User Avatar Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cloud Assets Button */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all"
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-blue-400" />
              <span className="hidden sm:inline">☁️ Cloud</span>
            </button>

            {/* User Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/80 hover:bg-slate-900 text-white transition-all duration-150 shadow-xs"
              >
                {/* Avatar Icon */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs bg-blue-600"
                >
                  {authUser?.name ? authUser.name[0].toUpperCase() : 'V'}
                </div>

                {/* Name & Persona Pill */}
                <div className="text-left hidden sm:block leading-tight">
                  <div className="text-xs font-bold truncate max-w-[110px] text-white">
                    {authUser?.name || 'Vicky'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span>{personaData.emoji}</span>
                    <span className="truncate max-w-[90px]">
                      {persona === 'salaried'
                        ? 'Student/Job'
                        : persona === 'freelancer'
                        ? 'Freelancer'
                        : 'Small Biz'}
                    </span>
                  </div>
                </div>

                <ChevronDown size={13} className="text-slate-400 ml-0.5" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 p-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl text-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-white/10 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personaData.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-white">
                          {authUser?.name || 'Finvexa Member'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {authUser?.email || authUser?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold inline-flex items-center gap-1">
                      <ShieldCheck size={10} />
                      <span>Personality: {personaData.label}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/profile')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                    >
                      <User size={14} className="text-blue-400" />
                      <span>My Profile & Bank Security</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/leaks')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                    >
                      <Coins size={14} className="text-amber-400" />
                      <span>Hidden Money Finder</span>
                    </button>

                    <button
                      onClick={handleResetDemo}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Resets localStorage to re-experience Splash & Onboarding"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Demo (For Judges)</span>
                    </button>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
