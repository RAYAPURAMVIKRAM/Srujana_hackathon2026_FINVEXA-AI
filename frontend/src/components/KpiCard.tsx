// src/components/KpiCard.tsx
import React from 'react'
import Tilt3DCard from './Tilt3DCard'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  status?: 'safe' | 'warning' | 'critical' | 'neutral'
  icon: React.ReactNode
  trend?: string
}

export default function KpiCard({
  label,
  value,
  sub,
  status = 'neutral',
  icon,
  trend,
}: KpiCardProps) {
  const statusColors = {
    safe: {
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      badge: 'SAFE',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    warning: {
      border: 'border-amber-500/30 hover:border-amber-400/50',
      text: 'text-amber-400',
      bg: 'bg-amber-500/15',
      badge: 'WARNING',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    critical: {
      border: 'border-rose-500/30 hover:border-rose-400/50',
      text: 'text-rose-400',
      bg: 'bg-rose-500/15',
      badge: 'CRITICAL',
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    neutral: {
      border: 'border-white/10 hover:border-white/20',
      text: 'text-blue-400',
      bg: 'bg-blue-500/15',
      badge: '',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
  }

  const c = statusColors[status]

  return (
    <Tilt3DCard
      className={`bg-slate-900/70 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden border shadow-lg transition-all duration-300 ${c.border}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${c.iconBg}`}
        >
          {icon}
        </div>
        {status !== 'neutral' && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${c.bg} ${c.text} border-current`}
          >
            {c.badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">
          {label}
        </div>
        <div className="text-2xl font-black text-white mt-1 mono tracking-tight">
          {value}
        </div>
        {sub && <div className="text-xs text-slate-400 font-medium mt-1">{sub}</div>}
        {trend && (
          <div className={`text-xs mt-2 font-bold ${c.text}`}>
            {trend}
          </div>
        )}
      </div>
    </Tilt3DCard>
  )
}
