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

export default function App() {
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const location = useLocation()

  // Dedicated full-screen routes without top/side navigation
  const isOnboardingOrSplash = [
    '/',
    '/auth',
    '/onboarding/personality',
    '/onboarding/bank-link',
  ].includes(location.pathname)

  if (isOnboardingOrSplash) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle crisp fintech grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid opacity-60" />

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
