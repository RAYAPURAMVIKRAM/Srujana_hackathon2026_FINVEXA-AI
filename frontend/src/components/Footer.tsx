// src/components/Footer.tsx
import { Shield, Cloud, Sparkles, CheckCircle2 } from 'lucide-react'

interface FooterProps {
  onOpenAssetManager?: () => void
}

export default function Footer({ onOpenAssetManager }: FooterProps) {
  return (
    <footer className="mt-12 rounded-2xl bg-white border border-slate-200 p-6 text-slate-600 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Plain English Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 shadow-sm">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 tracking-wide flex items-center gap-2">
              <span>FINVEXA</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                8th-Grade Simple English
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Universal Financial Digital Twin & Multi-Risk Decision Engine
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Supabase Cloud Connected
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
            <Sparkles size={12} className="text-amber-500" />
            6 Zero-Jargon Safety Checks
          </span>
          {onOpenAssetManager && (
            <button
              onClick={onOpenAssetManager}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors font-semibold"
            >
              <Cloud size={12} className="text-blue-600" />
              Cloud Asset Manager
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
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
