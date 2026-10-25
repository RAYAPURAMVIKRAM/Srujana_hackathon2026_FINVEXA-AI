// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sliders, ShieldAlert, ScanLine, Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home Overview', exact: true },
  { to: '/simulator', icon: Sliders, label: '90-Day Simulator' },
  { to: '/risk-matrix', icon: ShieldAlert, label: '6 Safety Checks' },
  { to: '/scanner', icon: ScanLine, label: 'Bill & Fee Spy' },
  { to: '/rescue', icon: Lightbulb, label: '3 Easy Fix Plans' },
]

export default function Sidebar() {
  const { personaData } = useApp()
  const theme = personaData.theme

  return (
    <aside
      className="hidden md:flex fixed left-0 top-14 h-[calc(100vh-56px)] w-60 flex-col z-40 transition-all duration-300"
      style={{
        background: 'rgba(2, 6, 23, 0.94)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <nav className="flex-1 py-4 px-2 md:px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 md:px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'text-white border shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`
            }
            style={({ isActive }) =>
              isActive
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
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  style={isActive ? { color: theme.primaryHex } : undefined}
                />
                <span className="hidden md:block truncate">{label}</span>
                {isActive && (
                  <div
                    className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full shadow-sm"
                    style={{ background: theme.primaryHex }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Indicator */}
      <div className="hidden md:block p-3 border-t border-slate-800/80">
        <div
          className="glass-card p-3 rounded-xl border"
          style={{
            borderColor: `${theme.primaryHex}30`,
            background: `${theme.primaryHex}10`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{personaData.emoji}</span>
            <div className="truncate">
              <div className="text-[11px] font-bold text-white truncate">
                {personaData.label}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Zero Jargon Mode Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
