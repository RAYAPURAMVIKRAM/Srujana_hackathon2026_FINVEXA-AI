// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sliders,
  ShieldAlert,
  Coins,
  Target,
  ScanLine,
  Lightbulb,
  User,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Sidebar() {
  const { personaData, themeMode, t } = useApp()
  const isLight = themeMode === 'light'

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/simulator', icon: Sliders, label: t('nav.simulator') },
    { to: '/risk-matrix', icon: ShieldAlert, label: t('nav.riskMatrix') },
    { to: '/goal-strategy', icon: Target, label: t('nav.goalStrategy') },
    { to: '/leaks', icon: Coins, label: t('nav.leaks') },
    { to: '/scanner', icon: ScanLine, label: t('nav.scanner') },
    { to: '/rescue', icon: Lightbulb, label: t('nav.rescue') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ]

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-14 h-[calc(100vh-56px)] w-60 flex-col z-40 backdrop-blur-xl shadow-lg transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 text-slate-900 border-r border-slate-200'
          : 'bg-slate-950/80 text-white border-r border-white/10'
      }`}
    >
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`text-[10px] uppercase font-bold tracking-wider px-3 mb-2 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          Main Menu
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 group ${
                isActive
                  ? isLight
                    ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-sm font-bold'
                    : 'text-white bg-blue-600/20 border border-blue-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? 'text-blue-500'
                      : isLight
                      ? 'text-slate-500 group-hover:text-slate-800'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Indicator */}
      <div className={`p-3 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-900/40'}`}>
        <NavLink
          to="/profile"
          className={`block p-2.5 rounded-xl border transition-all shadow-sm ${
            isLight
              ? 'border-slate-200 hover:border-blue-400 bg-white'
              : 'border-white/10 hover:border-blue-400/50 bg-slate-900/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{personaData.emoji}</span>
            <div className="truncate">
              <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {personaData.label}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={10} />
                <span>Zero Jargon Radar</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
