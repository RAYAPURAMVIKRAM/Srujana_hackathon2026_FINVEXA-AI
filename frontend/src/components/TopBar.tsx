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
        className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/95 text-slate-800 border-b border-slate-200 shadow-xs"
        style={{ backdropFilter: 'blur(16px)' }}
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
                <span className="text-slate-900">FINVEXA</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 leading-tight font-semibold tracking-normal hidden md:block truncate">
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
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-emerald-500'
              }`}
              title="RBI Account Aggregator (Sahamati Standard)"
            >
              <Lock size={12} className="text-emerald-600" />
              <span>
                {bankConsent.isLinked
                  ? `✅ ${bankConsent.bankName || 'Bank'} Synced`
                  : '🔒 Connect RBI AA Bank'}
              </span>
            </button>

            <button
              onClick={() => navigate('/leaks')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all"
            >
              <Coins size={12} className="text-amber-600" />
              <span>Hidden Money: ₹{personaData.hiddenLeaks}/mo</span>
            </button>
          </div>

          {/* Right Action Tools: Cloud Assets + User Avatar Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cloud Assets Button */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-blue-600" />
              <span className="hidden sm:inline">☁️ Cloud</span>
            </button>

            {/* User Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-all duration-150 shadow-xs"
              >
                {/* Avatar Icon */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs bg-blue-600"
                >
                  {authUser?.name ? authUser.name[0].toUpperCase() : 'V'}
                </div>

                {/* Name & Persona Pill */}
                <div className="text-left hidden sm:block leading-tight">
                  <div className="text-xs font-bold truncate max-w-[110px] text-slate-900">
                    {authUser?.name || 'Vicky'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
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
                <div className="absolute right-0 top-12 w-64 p-2 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personaData.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-slate-900">
                          {authUser?.name || 'Finvexa Member'}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {authUser?.email || authUser?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold inline-flex items-center gap-1">
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
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors text-slate-700 hover:text-slate-900"
                    >
                      <User size={14} className="text-blue-600" />
                      <span>My Profile & Bank Security</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/leaks')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors text-slate-700 hover:text-slate-900"
                    >
                      <Coins size={14} className="text-amber-600" />
                      <span>Hidden Money Finder</span>
                    </button>

                    <button
                      onClick={handleResetDemo}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Resets localStorage to re-experience Splash & Onboarding"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Demo (For Judges)</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
