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

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home Overview' },
  { to: '/simulator', icon: Sliders, label: 'Before-You-Spend' },
  { to: '/risk-matrix', icon: ShieldAlert, label: '6 Safety Checks' },
  { to: '/goal-strategy', icon: Target, label: 'My Goal & Strategy' },
  { to: '/leaks', icon: Coins, label: 'Hidden Money Finder' },
  { to: '/scanner', icon: ScanLine, label: 'AI Bill & Screenshot' },
  { to: '/rescue', icon: Lightbulb, label: '3 Easy Fixes' },
  { to: '/profile', icon: User, label: 'Profile & Security' },
]

export default function Sidebar() {
  const { personaData } = useApp()

  return (
    <aside
      className="hidden md:flex fixed left-0 top-14 h-[calc(100vh-56px)] w-60 flex-col z-40 bg-white text-slate-800 border-r border-slate-200 shadow-sm"
      style={{ backdropFilter: 'blur(16px)' }}
    >
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider px-3 mb-2 text-slate-400">
          Main Menu
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 group ${
                isActive
                  ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Indicator */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <NavLink
          to="/profile"
          className="block p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{personaData.emoji}</span>
            <div className="truncate">
              <div className="text-xs font-bold truncate text-slate-900">
                {personaData.label}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
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
