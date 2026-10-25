// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sliders,
  ShieldAlert,
  Coins,
  ScanLine,
  Lightbulb,
  User,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home Overview' },
  { to: '/simulator', icon: Sliders, label: 'Before-You-Spend' },
  { to: '/risk-matrix', icon: ShieldAlert, label: '6 Safety Checks' },
  { to: '/leaks', icon: Coins, label: 'Hidden Money Finder' },
  { to: '/scanner', icon: ScanLine, label: 'AI Bill & Screenshot' },
  { to: '/rescue', icon: Lightbulb, label: '3 Easy Fixes' },
  { to: '/profile', icon: User, label: 'Profile & Security' },
]

export default function Sidebar() {
  const { personaData, themeMode } = useApp()
  const theme = personaData.theme
  const isLight = themeMode === 'light'

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-14 h-[calc(100vh-56px)] w-60 flex-col z-40 transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 text-slate-800 border-r border-slate-200'
          : 'bg-slate-950/95 text-slate-200 border-r border-white/10'
      }`}
      style={{
        backdropFilter: 'blur(20px)',
      }}
    >
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider px-3 mb-2 text-slate-400">
          Navigation
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? isLight
                    ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-sm'
                    : 'text-white border shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`
            }
            style={({ isActive }) =>
              isActive && !isLight
                ? {
                    background: `${theme.primaryHex}20`,
                    borderColor: `${theme.primaryHex}50`,
                    boxShadow: `0 0 16px ${theme.primaryHex}30`,
                  }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? isLight
                        ? 'text-blue-600'
                        : 'text-white'
                      : isLight
                      ? 'text-slate-400 group-hover:text-slate-600'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  style={isActive && !isLight ? { color: theme.primaryHex } : undefined}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full shadow-sm"
                    style={{ background: isLight ? '#2563EB' : theme.primaryHex }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Indicator */}
      <div
        className={`p-3 border-t transition-colors ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800/80 bg-slate-900/50'
        }`}
      >
        <NavLink
          to="/profile"
          className={`block p-3 rounded-xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
              : 'border-slate-800 hover:border-slate-700'
          }`}
          style={
            !isLight
              ? {
                  borderColor: `${theme.primaryHex}30`,
                  background: `${theme.primaryHex}10`,
                }
              : {}
          }
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{personaData.emoji}</span>
            <div className="truncate">
              <div
                className={`text-[11px] font-bold truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {personaData.label}
              </div>
              <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <ShieldCheck size={10} />
                <span>Zero Jargon Engine</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
