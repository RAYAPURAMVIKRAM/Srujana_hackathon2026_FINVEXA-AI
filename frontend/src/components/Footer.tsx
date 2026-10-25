// src/components/Footer.tsx
import { Shield, Cloud, Sparkles, CheckCircle2 } from 'lucide-react'

interface FooterProps {
  onOpenAssetManager?: () => void
}

export default function Footer({ onOpenAssetManager }: FooterProps) {
  return (
    <footer className="mt-12 rounded-3xl bg-white border-2 border-yellow-300 p-6 text-slate-700 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Plain English Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-yellow-400 text-slate-950 border border-yellow-500 shadow-xs font-black">
            <Shield size={18} />
          </div>
          <div>
            <div className="text-sm font-black text-slate-950 tracking-wide flex items-center gap-2">
              <span>FINVEXA</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-yellow-100 text-yellow-950 border border-yellow-400">
                8th-Grade Simple English
              </span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Universal Financial Digital Twin & Multi-Risk Decision Engine
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Supabase Cloud Connected
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-950 border border-yellow-400 font-bold">
            <Sparkles size={12} className="text-yellow-700" />
            6 Zero-Jargon Safety Checks
          </span>
          {onOpenAssetManager && (
            <button
              onClick={onOpenAssetManager}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-900 border border-amber-300 transition-colors font-bold"
            >
              <Cloud size={12} className="text-amber-600" />
              Cloud Asset Manager
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-yellow-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 font-medium gap-2">
        <div>
          FINVEXA · Built for high-trust personal, freelance, and business cashflow decisions before you spend.
        </div>
        <div className="font-mono text-slate-700 font-bold">
          RBI Account Aggregator Compatible (Sahamati AA)
        </div>
      </div>
    </footer>
  )
}
