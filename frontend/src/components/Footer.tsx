// src/components/Footer.tsx
import { Shield, Cloud, Sparkles, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface FooterProps {
  onOpenAssetManager?: () => void
}

export default function Footer({ onOpenAssetManager }: FooterProps) {
  const { personaData } = useApp()
  const theme = personaData.theme

  return (
    <footer className="mt-16 border-t border-slate-800/80 pt-8 pb-12 text-slate-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Plain English Subtitle */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: theme.buttonGradient }}
          >
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>FINVEXA</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white/10 text-emerald-300">
                8th-Grade Simple English
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Universal Financial Digital Twin & Multi-Risk Decision Engine
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <CheckCircle2 size={13} className="text-emerald-400" />
            Supabase Cloud Connected
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium">
            <Sparkles size={12} className="text-amber-400" />
            6 Zero-Jargon Safety Checks
          </span>
          {onOpenAssetManager && (
            <button
              onClick={onOpenAssetManager}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Cloud size={12} className="text-emerald-400" />
              Cloud Asset Manager
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          © {new Date().getFullYear()} FINVEXA. Real-life cash stress simulation in ₹ Rupees for students, freelancers, and small business shops.
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <span>Port 5173 (Vite)</span>
          <span>•</span>
          <span>Port 8000 (FastAPI)</span>
          <span>•</span>
          <span>INR (₹) Standard</span>
        </div>
      </div>
    </footer>
  )
}
