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
  const [showScaleMenu, setShowScaleMenu] = useState(false)
  const {
    persona,
    setPersona,
    personaData,
    authUser,
    logout,
    bankConsent,
    resetOnboardingDemo,
    themeMode,
    t,
  } = useApp()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const [isRbiModalOpen, setIsRbiModalOpen] = useState(false)

  const isLight = themeMode === 'light'

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
        className={`fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur-xl shadow-md transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 text-slate-900 border-b border-slate-200'
            : 'bg-slate-950/80 text-white border-b border-white/10'
        }`}
      >
        <div className="flex items-center h-full px-3 sm:px-5 justify-between max-w-full">
          {/* Logo & Brand Wordmark */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 group"
          >
            <FinvexaLogo size={28} showText={false} themeMode={themeMode} />
            <div className="truncate">
              <div className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>FINVEXA</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                  ₹ Twin
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-tight font-semibold tracking-normal hidden md:block truncate">
                {t('topbar.brandSubtitle')}
              </div>
            </div>
          </div>

          {/* Prominent Scale Switcher Pill in Top Bar */}
          <div className="relative">
            <button
              onClick={() => setShowScaleMenu(!showScaleMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                persona === 'enterprise'
                  ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 text-white border border-blue-400 shadow-blue-500/20 animate-pulse'
                  : persona === 'business'
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                  : persona === 'freelancer'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                  : isLight
                  ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:border-blue-400'
                  : 'bg-white/10 text-slate-200 border border-white/15 hover:border-blue-400'
              }`}
              title="Click to switch scale (₹10K to $10 Billion)"
            >
              <span>
                {persona === 'enterprise'
                  ? '🏛️ Enterprise ($2.4B / ₹20,000 Cr)'
                  : persona === 'business'
                  ? '🏪 SME (₹1L–₹5 Cr)'
                  : persona === 'freelancer'
                  ? '💻 Freelancer (₹45K–₹5L)'
                  : '🎓 Student / Individual (₹55K)'}
              </span>
              {persona === 'enterprise' && (
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                  👑 FLAGSHIP
                </span>
              )}
              <ChevronDown size={13} />
            </button>

            {/* Scale Switcher Dropdown */}
            {showScaleMenu && (
              <div
                className={`absolute left-0 mt-2 w-72 rounded-2xl p-2 shadow-2xl border z-50 animate-fade-in ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
                    : 'bg-slate-900 border-white/15 text-white shadow-black/80'
                }`}
              >
                <div className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select Universal Financial Scale
                </div>
                {[
                  { id: 'salaried' as const, label: '🎓 Individual / Student', scale: '₹55K Scale' },
                  { id: 'freelancer' as const, label: '💻 Freelancer / Studio', scale: '₹45K–₹5L Scale' },
                  { id: 'business' as const, label: '🏪 SME / Factory', scale: '₹1L–₹5 Cr Scale' },
                  {
                    id: 'enterprise' as const,
                    label: '🏛️ Enterprise Megaproject',
                    scale: '$2.4B / ₹20,000 Cr Scale',
                    badge: '👑 FLAGSHIP',
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPersona(opt.id)
                      setShowScaleMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      persona === opt.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="flex items-center gap-1.5">
                      {opt.badge && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black">
                          {opt.badge}
                        </span>
                      )}
                      <span className="font-mono text-[11px] opacity-80">{opt.scale}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Bank & Security Live Badges */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              onClick={() => setIsRbiModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                bankConsent.isLinked
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-emerald-500'
                  : 'bg-slate-900/60 text-slate-300 border border-white/10 hover:border-emerald-500/50'
              }`}
              title="RBI Account Aggregator (Sahamati Standard)"
            >
              <Lock size={12} className="text-emerald-500" />
              <span>
                {bankConsent.isLinked
                  ? `✅ ${bankConsent.bankName || 'Bank'} Synced`
                  : t('topbar.connectBank')}
              </span>
            </button>

            <button
              onClick={() => navigate('/leaks')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
            >
              <Coins size={12} className="text-amber-500" />
              <span>{t('topbar.hiddenMoney')}</span>
            </button>
          </div>

          {/* Right Action Tools: Cloud Assets + User Avatar Pill (sitting gracefully alongside GlobalTopControls) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 mr-0 sm:mr-[270px] lg:mr-[290px]">
            {/* 1. Cloud Assets Button */}
            <button
              onClick={() => setIsAssetManagerOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30'
              }`}
              title="Open Supabase Cloud Asset Manager"
            >
              <Cloud size={13} className="text-blue-500" />
              <span className="hidden sm:inline">☁️ {t('topbar.cloud')}</span>
            </button>

            {/* 4. User Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-150 shadow-xs ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                    : 'border-white/10 hover:border-white/20 bg-slate-900/80 hover:bg-slate-900 text-white'
                }`}
              >
                {/* Avatar Icon */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs bg-blue-600 shrink-0">
                  {authUser?.name ? authUser.name[0].toUpperCase() : 'V'}
                </div>

                {/* Name & Persona Pill */}
                <div className="text-left hidden sm:block leading-tight">
                  <div className={`text-xs font-bold truncate max-w-[100px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {authUser?.name || 'Vicky'}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>{personaData.emoji}</span>
                    <span className="truncate max-w-[85px]">
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
                  className={`absolute right-0 top-12 w-64 p-2 rounded-2xl border shadow-2xl z-50 animate-fade-in ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-slate-900/95 border-white/10 text-white backdrop-blur-xl'
                  }`}
                >
                  <div className="p-3 border-b border-slate-200 dark:border-white/10 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personaData.emoji}</span>
                      <div className="truncate">
                        <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {authUser?.name || 'Finvexa Member'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {authUser?.email || authUser?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold inline-flex items-center gap-1">
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
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                        isLight
                          ? 'hover:bg-slate-100 text-slate-700'
                          : 'hover:bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <User size={14} className="text-blue-500" />
                      <span>{t('topbar.profile')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/leaks')
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                        isLight
                          ? 'hover:bg-slate-100 text-slate-700'
                          : 'hover:bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Coins size={14} className="text-amber-500" />
                      <span>{t('nav.leaks')}</span>
                    </button>

                    <button
                      onClick={handleResetDemo}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Resets localStorage to re-experience Splash & Onboarding"
                    >
                      <RotateCcw size={14} />
                      <span>{t('topbar.resetDemo')}</span>
                    </button>

                    <div className="my-1 border-t border-slate-200 dark:border-white/10" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={14} />
                      <span>{t('topbar.signOut')}</span>
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
