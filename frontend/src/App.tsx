// src/App.tsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import CloudAssetManager from './components/CloudAssetManager'
import CommandCenter from './pages/CommandCenter'
import Simulator from './pages/Simulator'
import RiskMatrix from './pages/RiskMatrix'
import Scanner from './pages/Scanner'
import Rescue from './pages/Rescue'
import { useApp } from './context/AppContext'

export default function App() {
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false)
  const { personaData } = useApp()
  const theme = personaData.theme

  return (
    <div
      className={`min-h-screen text-slate-100 transition-colors duration-700 relative overflow-x-hidden bg-gradient-to-br ${theme.meshClass}`}
    >
      {/* Dynamic 3-Orb Radiant Aurora Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orb 1: Top Left */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] opacity-70 transition-all duration-1000 animate-pulse"
          style={{ background: theme.orb1 }}
        />
        {/* Orb 2: Center Right */}
        <div
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-[150px] opacity-60 transition-all duration-1000"
          style={{ background: theme.orb2 }}
        />
        {/* Orb 3: Bottom Left / Center */}
        <div
          className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full blur-[140px] opacity-65 transition-all duration-1000 animate-pulse"
          style={{ background: theme.orb3 }}
        />
        {/* Fine Grain Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <TopBar />
      <Sidebar />
      <BottomNav />

      {/* Main content area — responsive offset: 0px left on mobile, 240px on desktop; bottom padding for mobile bar */}
      <main className="relative z-10 min-h-screen transition-all duration-300 flex flex-col justify-between pt-14 md:pl-60 pb-24 md:pb-8">
        <div className="p-4 sm:p-5 lg:p-6 max-w-[1440px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/rescue" element={<Rescue />} />
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
