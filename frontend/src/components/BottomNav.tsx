// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sliders,
  ShieldAlert,
  Coins,
  ScanLine,
  Lightbulb,
  User,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/simulator', icon: Sliders, label: 'Sim' },
  { to: '/risk-matrix', icon: ShieldAlert, label: '6 Risks' },
  { to: '/leaks', icon: Coins, label: 'Leaks' },
  { to: '/scanner', icon: ScanLine, label: 'Scan' },
  { to: '/rescue', icon: Lightbulb, label: 'Fixes' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { personaData, themeMode } = useApp()
  const theme = personaData.theme
  const isLight = themeMode === 'light'

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl px-1.5 py-1 flex justify-around items-center transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-slate-950/95 border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]'
      }`}
      style={{
        boxShadow: !isLight
          ? `0 -10px 30px rgba(0,0,0,0.7), 0 -1px 0 ${theme.primaryHex}25`
          : undefined,
      }}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 min-h-[46px] py-1 px-0.5 rounded-xl transition-all duration-200 relative group active:scale-95 ${
              isActive
                ? isLight
                  ? 'text-blue-600 font-bold'
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
                <div
                  className="absolute -top-1 w-6 h-0.5 rounded-full"
                  style={{
                    background: isLight ? '#2563EB' : theme.buttonGradient,
                    boxShadow: !isLight ? `0 0 8px ${theme.primaryHex}` : undefined,
                  }}
                />
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'scale-105' : 'group-hover:scale-100'
                }`}
                style={{
                  background: isActive
                    ? isLight
                      ? 'rgba(37,99,235,0.1)'
                      : `${theme.primaryHex}25`
                    : 'transparent',
                }}
              >
                <Icon
                  size={18}
                  className="transition-colors"
                  style={{
                    color: isActive
                      ? isLight
                        ? '#2563EB'
                        : theme.primaryHex
                      : undefined,
                  }}
                />
              </div>

              <span
                className={`text-[9.5px] tracking-tight mt-0.5 leading-none ${
                  isActive
                    ? isLight
                      ? 'text-blue-700 font-bold'
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
