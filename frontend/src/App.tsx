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
      <div
        className={`min-h-screen transition-colors duration-500 ${
          isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'
        }`}
      >
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
      className={`min-h-screen transition-colors duration-500 relative overflow-x-hidden ${
        isLight
          ? 'bg-slate-100/90 text-slate-900'
          : `bg-slate-950 text-slate-100 bg-gradient-to-br ${theme.meshClass}`
      }`}
    >
      {/* Dynamic 3-Orb Radiant Aurora Mesh Background (Subtle in Dark mode, Pearl in Light) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orb 1: Top Left */}
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] transition-all duration-1000 animate-pulse ${
            isLight ? 'opacity-25 bg-blue-300' : 'opacity-70'
          }`}
          style={!isLight ? { background: theme.orb1 } : undefined}
        />
        {/* Orb 2: Center Right */}
        <div
          className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-[150px] transition-all duration-1000 ${
            isLight ? 'opacity-20 bg-emerald-200' : 'opacity-60'
          }`}
          style={!isLight ? { background: theme.orb2 } : undefined}
        />
        {/* Orb 3: Bottom Left / Center */}
        <div
          className={`absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full blur-[140px] transition-all duration-1000 animate-pulse ${
            isLight ? 'opacity-25 bg-purple-200' : 'opacity-65'
          }`}
          style={!isLight ? { background: theme.orb3 } : undefined}
        />
        {/* Fine Grain Grid overlay */}
        <div
          className={`absolute inset-0 bg-grid ${isLight ? 'opacity-10' : 'opacity-20'}`}
        />
      </div>

      <TopBar />
      <Sidebar />
      <BottomNav />

      {/* Main content area — responsive offset: 0px left on mobile, 240px on desktop; bottom padding for mobile bar */}
      <main className="relative z-10 min-h-screen transition-all duration-300 flex flex-col justify-between pt-14 md:pl-60 pb-24 md:pb-8">
        <div className="p-4 sm:p-5 lg:p-6 max-w-[1440px] w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<CommandCenter />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/leaks" element={<HiddenMoneyFinder />} />
            <Route path="/goal-strategy" element={<GoalStrategy />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/rescue" element={<Rescue />} />
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
