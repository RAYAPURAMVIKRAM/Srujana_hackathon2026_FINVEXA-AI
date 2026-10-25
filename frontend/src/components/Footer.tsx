// src/components/Footer.tsx
import { Shield, Cloud, Sparkles, CheckCircle2 } from 'lucide-react'

interface FooterProps {
  onOpenAssetManager?: () => void
}

export default function Footer({ onOpenAssetManager }: FooterProps) {
  return (
    <footer className="mt-12 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 text-slate-400 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Plain English Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 shadow-md">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>FINVEXA</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                8th-Grade Simple English
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Universal Financial Digital Twin & Multi-Risk Decision Engine
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            <CheckCircle2 size={13} className="text-emerald-400" />
            Supabase Cloud Connected
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-semibold">
            <Sparkles size={12} className="text-amber-400" />
            6 Zero-Jargon Safety Checks
          </span>
          {onOpenAssetManager && (
            <button
              onClick={onOpenAssetManager}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors font-semibold"
            >
              <Cloud size={12} className="text-blue-400" />
              Cloud Asset Manager
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>
          FINVEXA · Built for high-trust personal, freelance, and business cashflow decisions before you spend.
        </div>
        <div className="font-mono text-slate-400">
          RBI Account Aggregator Compatible (Sahamati AA)
        </div>
      </div>
    </footer>
  )
}
