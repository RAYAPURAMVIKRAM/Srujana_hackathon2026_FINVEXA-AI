// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sliders,
  Coins,
  Target,
  ScanLine,
  Lightbulb,
  User,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function BottomNav() {
  const { themeMode, t } = useApp()
  const isLight = themeMode === 'light'

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/simulator', icon: Sliders, label: t('nav.simulator') },
    { to: '/goal-strategy', icon: Target, label: t('nav.goalStrategy') },
    { to: '/leaks', icon: Coins, label: t('nav.leaks') },
    { to: '/scanner', icon: ScanLine, label: t('nav.scanner') },
    { to: '/rescue', icon: Lightbulb, label: t('nav.rescue') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ]

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-1 py-1 flex justify-around items-center shadow-2xl backdrop-blur-xl transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-t border-slate-200 text-slate-900'
          : 'bg-slate-950/90 border-t border-white/10 text-white'
      }`}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 min-h-[46px] py-1 px-0.5 rounded-xl transition-all duration-150 relative ${
              isActive
                ? isLight
                  ? 'text-blue-700 font-bold'
                  : 'text-white font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Active Indicator Top Pill */}
              {isActive && (
                <div className="absolute -top-1 w-6 h-0.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-blue-500/20 text-blue-400'
                    : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? 'text-blue-500'
                      : isLight
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              <span
                className={`text-[9.5px] tracking-tight mt-0.5 leading-none truncate max-w-[48px] ${
                  isActive
                    ? isLight
                      ? 'text-blue-800 font-bold'
                      : 'text-white font-bold'
                    : isLight
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
