// src/components/BottomNav.tsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sliders, ShieldAlert, ScanLine, Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/simulator', icon: Sliders, label: 'Simulator' },
  { to: '/risk-matrix', icon: ShieldAlert, label: '6 Risks' },
  { to: '/scanner', icon: ScanLine, label: 'AI Scan' },
  { to: '/rescue', icon: Lightbulb, label: '3 Fixes' },
]

export default function BottomNav() {
  const { personaData } = useApp()
  const theme = personaData.theme

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/90 border-t border-white/10 px-2 py-1.5 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
      style={{
        boxShadow: `0 -10px 30px rgba(0,0,0,0.7), 0 -1px 0 ${theme.primaryHex}25`,
      }}
    >
      {navItems.map(({ to, icon: Icon, label, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-200 relative group active:scale-95 ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Active Glow Pill Indicator */}
              {isActive && (
                <div
                  className="absolute -top-1.5 w-8 h-1 rounded-full shadow-lg"
                  style={{
                    background: theme.buttonGradient,
                    boxShadow: `0 0 10px ${theme.primaryHex}`,
                  }}
                />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                style={{
                  background: isActive ? `${theme.primaryHex}20` : 'transparent',
                }}
              >
                <Icon
                  size={20}
                  className="transition-colors"
                  style={{
                    color: isActive ? theme.primaryHex : undefined,
                  }}
                />
              </div>

              <span
                className={`text-[10px] font-semibold mt-0.5 tracking-tight ${
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
