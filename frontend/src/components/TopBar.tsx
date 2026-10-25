// src/components/TopBar.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Cloud,
  Lock,
  Sun,
  Moon,
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
    themeMode,
    toggleThemeMode,
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

  const isLight = themeMode === 'light'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-14 transition-colors duration-300 ${
          isLight
            ? 'bg-white/90 text-slate-800 border-b border-slate-200 shadow-sm'
            : 'bg-slate-950/90 text-white border-b border-white/10'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center h-full px-3 sm:px-5 justify-between max-w-full">
          {/* Logo & Brand Wordmark */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 group"
          >
            <FinvexaLogo size={28} showText={false} />
            <div className="truncate">
              <div className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>FINVEXA</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-gradient-to-r from-blue-600/20 to-emerald-600/20 text-blue-600 border border-blue-500/30">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-500 leading-tight font-semibold tracking-normal hidden md:block truncate">
                Smart Money Decisions Before You Spend
              </div>
            </div>
          </div>

          {/* Quick Bank & Security Live Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsRbiModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                bankConsent.isLinked
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-400/40'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-emerald-500'
              }`}
              title="RBI Account Aggregator (Sahamati Standard)"
            >
              <Lock size={12} className="text-emerald-500" />
              <span>
                {bankConsent.isLinked
                  ? `✅ ${bankConsent.bankName || 'Bank'} Synced`
                  : '🔒 Connect RBI AA Bank'}
              </span>
            </button>

            <button
              onClick={() => navigate('/leaks')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-500/20 transition-all"
            >
              <Coins size={12} className="text-amber-500" />
              <span>Hidden Money: ₹{personaData.hiddenLeaks}/mo</span>
            </button>
          </div>

          {/* Right Action Tools: Theme Mode + Cloud Assets + User Avatar Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1-Click Light/Dark Toggle */}
            <button
              onClick={toggleThemeMode}
              className={`p-2 rounded-xl text-xs transition-all border ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  : 'bg-slate-800/80 text-amber-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={`Switch to ${isLight ? 'Radiant Dark' : 'Daylight Pearl'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Cloud Assets Button */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all"
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-blue-500" />
              <span className="hidden xl:inline">☁️ Cloud</span>
            </button>

            {/* User Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border transition-all duration-200 shadow-sm ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-100'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ background: personaData.theme.buttonGradient }}
                >
                  {authUser?.name ? authUser.name[0].toUpperCase() : 'V'}
                </div>

                {/* Name & Persona Pill */}
                <div className="text-left hidden sm:block leading-tight">
                  <div className="text-xs font-bold truncate max-w-[110px]">
                    {authUser?.name || 'Vicky'}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
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
                <div
                  className={`absolute right-0 top-12 w-64 p-2 rounded-2xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                >
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personaData.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {authUser?.name || 'Finvexa Member'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {authUser?.email || authUser?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
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
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={14} className="text-blue-500" />
                      <span>My Profile & Bank Security</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/leaks')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Coins size={14} className="text-amber-500" />
                      <span>Hidden Money Finder</span>
                    </button>

                    <button
                      onClick={handleResetDemo}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      title="Resets localStorage to re-experience Splash & Onboarding"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Demo (For Judges)</span>
                    </button>

                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
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
