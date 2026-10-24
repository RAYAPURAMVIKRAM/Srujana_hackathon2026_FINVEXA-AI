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
    safe: { glow: 'rgba(16,185,129,0.25)', border: 'rgba(16,185,129,0.35)', text: '#34d399', badge: 'SAFE' },
    warning: { glow: 'rgba(245,158,11,0.25)', border: 'rgba(245,158,11,0.35)', text: '#fbbf24', badge: 'WARNING' },
    critical: { glow: 'rgba(244,63,94,0.25)', border: 'rgba(244,63,94,0.35)', text: '#fb7185', badge: 'CRITICAL' },
    neutral: { glow: 'rgba(99,102,241,0.18)', border: 'rgba(51,65,85,0.5)', text: '#818cf8', badge: '' },
  }

  const c = statusColors[status]

  return (
    <Tilt3DCard
      className="glass-card p-5 relative overflow-hidden"
      style={{
        boxShadow: `0 8px 32px ${c.glow}`,
        borderColor: c.border,
      }}
    >
      {/* Subtle background glow orb */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-25 blur-xl pointer-events-none"
        style={{ background: c.text }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
          style={{
            background: `rgba(${
              status === 'safe'
                ? '16,185,129'
                : status === 'warning'
                ? '245,158,11'
                : status === 'critical'
                ? '244,63,94'
                : '99,102,241'
            },0.15)`,
            color: c.text,
          }}
        >
          {icon}
        </div>
        {status !== 'neutral' && (
          <span className={`badge-${status === 'safe' ? 'safe' : status === 'warning' ? 'warning' : 'critical'}`}>
            {c.badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{label}</div>
        <div className="text-2xl font-black text-white mt-1 mono tracking-tight">{value}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
        {trend && (
          <div className="text-xs mt-2 font-medium" style={{ color: c.text }}>
            {trend}
          </div>
        )}
      </div>
    </Tilt3DCard>
  )
}
