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
    safe: { border: 'border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50', badge: 'SAFE', iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    warning: { border: 'border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', badge: 'WARNING', iconBg: 'bg-amber-50 text-amber-600 border-amber-200' },
    critical: { border: 'border-rose-200', text: 'text-rose-700', bg: 'bg-rose-50', badge: 'CRITICAL', iconBg: 'bg-rose-50 text-rose-600 border-rose-200' },
    neutral: { border: 'border-slate-200', text: 'text-blue-700', bg: 'bg-blue-50', badge: '', iconBg: 'bg-blue-50 text-blue-600 border-blue-200' },
  }

  const c = statusColors[status]

  return (
    <Tilt3DCard
      className={`bg-white rounded-2xl p-5 relative overflow-hidden border shadow-xs hover:shadow-md transition-all duration-300 ${c.border}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${c.iconBg}`}
        >
          {icon}
        </div>
        {status !== 'neutral' && (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${c.bg} ${c.text} border-current`}>
            {c.badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">{label}</div>
        <div className="text-2xl font-black text-slate-900 mt-1 mono tracking-tight">{value}</div>
        {sub && <div className="text-xs text-slate-500 font-medium mt-1">{sub}</div>}
        {trend && (
          <div className={`text-xs mt-2 font-bold ${c.text}`}>
            {trend}
          </div>
        )}
      </div>
    </Tilt3DCard>
  )
}
