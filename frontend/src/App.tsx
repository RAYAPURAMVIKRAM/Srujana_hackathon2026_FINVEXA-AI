// src/App.tsx
import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import CloudAssetManager from './components/CloudAssetManager'
import SplashScreen from './pages/SplashScreen'
import Auth from './pages/Auth'
import OnboardingPersonality from './pages/OnboardingPersonality'
import OnboardingBankLink from './pages/OnboardingBankLink'
import CommandCenter from './pages/CommandCenter'
import Simulator from './pages/Simulator'
import RiskMatrix from './pages/RiskMatrix'
import HiddenMoneyFinder from './pages/HiddenMoneyFinder'
import Scanner from './pages/Scanner'
import Rescue from './pages/Rescue'
import Profile from './pages/Profile'
import GoalStrategy from './pages/GoalStrategy'
import { useApp } from './context/AppContext'

export default function App() {
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const { personaData, themeMode } = useApp()
  const location = useLocation()
  const theme = personaData.theme
  const isLight = themeMode === 'light'

  // Dedicated full-screen routes without top/side navigation
  const isOnboardingOrSplash = [
    '/',
    '/auth',
    '/onboarding/personality',
    '/onboarding/bank-link',
  ].includes(location.pathname)

  if (isOnboardingOrSplash) {
    return (
      <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white selection:text-white'}`}>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding/personality" element={<OnboardingPersonality />} />
          <Route path="/onboarding/bank-link" element={<OnboardingBankLink />} />
        </Routes>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative overflow-x-hidden ${
        isLight
          ? 'bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900'
          : `bg-slate-950 text-slate-100 bg-gradient-to-br ${theme.meshClass} selection:bg-blue-500/30 selection:text-white`
      }`}
    >
      {/* Dynamic 3-Orb Radiant Aurora Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {!isLight ? (
          <>
            {/* Orb 1: Top Left */}
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] opacity-70 animate-pulse transition-all duration-1000"
              style={{ background: theme.orb1 }}
            />
            {/* Orb 2: Center Right */}
            <div
              className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-[150px] opacity-60 transition-all duration-1000"
              style={{ background: theme.orb2 }}
            />
            {/* Orb 3: Bottom Left / Center */}
            <div
              className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full blur-[140px] opacity-65 animate-pulse transition-all duration-1000"
              style={{ background: theme.orb3 }}
            />
            {/* Fine Grain Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-25" />
          </>
        ) : (
          <>
            {/* Soft subtle ambient tint for Light Mode */}
            <div className="absolute top-0 right-1/4 w-[36rem] h-[36rem] rounded-full blur-[160px] opacity-25 bg-blue-200 pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[36rem] h-[36rem] rounded-full blur-[160px] opacity-20 bg-emerald-100 pointer-events-none" />
          </>
        )}
      </div>

      <TopBar />
      <Sidebar />
      <BottomNav />

      {/* Main content area — responsive offset: 0px left on mobile, 240px on desktop; bottom padding for mobile bar */}
      <main className="relative z-10 min-h-screen transition-all duration-300 flex flex-col justify-between pt-16 md:pl-60 pb-24 md:pb-8">
        <div className="p-4 sm:p-5 lg:p-6 max-w-[1440px] w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<CommandCenter />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/leaks" element={<HiddenMoneyFinder />} />
            <Route path="/goal-strategy" element={<GoalStrategy />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/document-scanner" element={<Navigate to="/scanner" replace />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/rescue-optimizer" element={<Navigate to="/rescue" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Persistent FINVEXA Plain-English Footer */}
          <Footer onOpenAssetManager={() => setIsAssetManagerOpen(true)} />
        </div>
      </main>

      <CloudAssetManager
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
      />
    </div>
  )
}
