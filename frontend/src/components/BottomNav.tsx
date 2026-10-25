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

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/simulator', icon: Sliders, label: 'Sim' },
  { to: '/goal-strategy', icon: Target, label: 'Goals' },
  { to: '/leaks', icon: Coins, label: 'Leaks' },
  { to: '/scanner', icon: ScanLine, label: 'Scan' },
  { to: '/rescue', icon: Lightbulb, label: 'Fixes' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 border-t border-white/10 px-1 py-1 flex justify-around items-center shadow-2xl backdrop-blur-xl"
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 min-h-[46px] py-1 px-0.5 rounded-xl transition-all duration-150 relative ${
              isActive
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Active Indicator Top Pill */}
              {isActive && (
                <div className="absolute -top-1 w-6 h-0.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
              </div>

              <span
                className={`text-[9.5px] tracking-tight mt-0.5 leading-none ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
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
