// src/pages/SplashScreen.tsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FinvexaLogo from '../components/FinvexaLogo'
import { ChevronUp, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { authUser, isOnboardingDone } = useApp()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleProceed = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // Check existing session
    const hasSession = !!authUser || !!localStorage.getItem('finvexa_auth_session')
    const hasOnboarded = isOnboardingDone || localStorage.getItem('finvexa_onboarding_done') === 'true'

    setTimeout(() => {
      if (hasSession && hasOnboarded) {
        navigate('/dashboard')
      } else {
        navigate('/auth')
      }
    }, 450)
  }, [isTransitioning, authUser, isOnboardingDone, navigate])

  useEffect(() => {
    // Wheel scroll listener (scroll up or down)
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        handleProceed()
      }
    }

    // Touch swipe listener
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      if (Math.abs(touchStartY - touchEndY) > 20) {
        handleProceed()
      }
    }

    // Keydown listener (Space, Enter, ArrowUp/Down)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        handleProceed()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleProceed])

  return (
    <div
      onClick={handleProceed}
      className={`min-h-screen bg-white text-slate-900 flex flex-col justify-between items-center p-6 sm:p-10 select-none cursor-pointer transition-all duration-500 relative overflow-hidden ${
        isTransitioning ? 'opacity-0 -translate-y-8 scale-[0.98]' : 'opacity-100 translate-y-0'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F8FAFC 60%, #EEF2F6 100%)',
      }}
    >
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="pt-4 sm:pt-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
          <Sparkles size={13} className="text-emerald-500 animate-spin" />
          <span>India's 1st Pre-Spend Digital Twin Engine</span>
        </div>
      </div>

      {/* Center Hero: Logo & Animated Wordmark */}
      <div className="flex flex-col items-center justify-center my-auto py-8 max-w-xl text-center">
        {/* Animated FINVEXA SVG Diamond-Shield Logo */}
        <FinvexaLogo size={130} showWordmark={false} animated themeMode="light" />

        <div className="mt-6 space-y-3">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            FINVEXA
          </h1>

          <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Money Decisions Before You Spend
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed pt-1">
            Simulate 90 days of your real life in ₹ Rupees. Detect payment delays, fake UPI screenshots, and hidden fees before spending a single Rupee.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 w-full max-w-md pt-2">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
            <span className="text-lg">🛡️</span>
            <span className="text-[11px] font-bold text-slate-800 mt-1">Zero Jargon</span>
            <span className="text-[9px] text-slate-500">8th-Grade English</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
            <span className="text-lg">⚡</span>
            <span className="text-[11px] font-bold text-slate-800 mt-1">90-Day Twin</span>
            <span className="text-[9px] text-slate-500">Stress Testing</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
            <span className="text-lg">🔒</span>
            <span className="text-[11px] font-bold text-slate-800 mt-1">RBI Safe AA</span>
            <span className="text-[9px] text-slate-500">100% Read-Only</span>
          </div>
        </div>
      </div>

      {/* Bottom Bouncing Scroll/Tap Prompt */}
      <div className="pb-6 sm:pb-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs sm:text-sm font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 animate-bounce">
          <ChevronUp size={16} className="text-emerald-400" />
          <span>Scroll Up or Tap Anywhere to Continue</span>
          <ArrowRight size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>RBI Account Aggregator Compliant · Sahamati Standard</span>
        </div>
      </div>
    </div>
  )
}
