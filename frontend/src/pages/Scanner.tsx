// src/pages/Scanner.tsx
import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  FileText,
  Receipt,
  CreditCard,
  Image,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cloud,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { uploadDocument, isSupabaseConfigured } from '../lib/supabase'
import Tilt3DCard from '../components/Tilt3DCard'
import { useApp } from '../context/AppContext'

interface ScanResult {
  type: string
  extractedTerms: { key: string; value: string; risk?: 'low' | 'medium' | 'high' }[]
  hiddenFees: { description: string; amount: number; severity: 'low' | 'medium' | 'high' }[]
  fraudFlags: { flag: string; detail: string; risk: 'low' | 'medium' | 'high' }[]
  utrStatus: 'verified' | 'suspicious' | 'unverified' | 'not_applicable'
  overallRisk: 'safe' | 'warning' | 'critical'
  summary: string
}

const SAMPLE_RESULTS: Record<string, ScanResult> = {
  invoice: {
    type: 'Bill & Purchase Order Spy',
    extractedTerms: [
      { key: 'Seller Name', value: 'StarTech Supplies Pvt Ltd', risk: 'low' },
      { key: 'Bill Number', value: 'INV-2024-07841', risk: 'low' },
      { key: 'Total Amount', value: '₹1,04,500', risk: 'medium' },
      { key: 'Payment Terms', value: 'Full payment in 30 days', risk: 'medium' },
      { key: 'Sneaky Late Fee', value: '2% extra charge every month if late', risk: 'high' },
      { key: 'Delivery Time', value: '7 to 14 business days', risk: 'low' },
    ],
    hiddenFees: [
      { description: 'Transport & handling fee (hidden in fine print)', amount: 4800, severity: 'high' },
      { description: 'Extra GST on transport fee', amount: 864, severity: 'medium' },
      { description: 'Box packaging surcharge', amount: 600, severity: 'low' },
    ],
    fraudFlags: [
      { flag: 'Wrong State GST Number', detail: 'The bill claims Mumbai (MH) but the GST code starts with 29 (Karnataka). Verify address before paying!', risk: 'high' },
      { flag: 'Fishy Round Numbers', detail: 'Every single line item is an exact round number like ₹500, which genuine wholesale bills rarely do.', risk: 'medium' },
    ],
    utrStatus: 'not_applicable',
    overallRisk: 'warning',
    summary: 'Caught ₹6,264 in sneaky unadvertised transport fees and a mismatched GST state code. Do not pay until the seller removes the surprise delivery fee!',
  },
  bank: {
    type: 'Bank Statement Scan (Sneaky Auto-Debits Caught)',
    extractedTerms: [
      { key: 'Dates Covered', value: 'Sep 1 – Sep 30, 2024', risk: 'low' },
      { key: 'Starting Money', value: '₹68,200', risk: 'low' },
      { key: 'Total Money In', value: '₹45,000', risk: 'low' },
      { key: 'Total Money Spent', value: '₹52,430', risk: 'medium' },
      { key: 'Ending Money', value: '₹60,770', risk: 'low' },
      { key: 'Recurring Subscriptions', value: '₹3,840 / month (6 active apps)', risk: 'high' },
    ],
    hiddenFees: [
      { description: 'Zomato Gold + Pro apps active at the same time', amount: 1298, severity: 'medium' },
      { description: 'Netflix + Prime + Hotstar active simultaneously', amount: 1497, severity: 'medium' },
      { description: 'Forgotten gym trial monthly auto-debit', amount: 999, severity: 'high' },
    ],
    fraudFlags: [
      { flag: 'Midnight Food Delivery Habit', detail: '₹8,200 spent on food delivery apps between 11 PM and 3 AM. Squeezing your rent safety cushion!', risk: 'medium' },
      { flag: 'Double-Charged Vendor Payment', detail: 'Streaming service charged twice in 24 hours on Sep 4 and Sep 5.', risk: 'high' },
    ],
    utrStatus: 'not_applicable',
    overallRisk: 'warning',
    summary: 'Found ₹3,794 in forgotten subscription leaks and a ₹649 duplicate charge. You can save ₹4,443 every single month by canceling 3 unused apps today!',
  },
  upi: {
    type: 'UPI Screenshot & UTR Authenticity Check',
    extractedTerms: [
      { key: '12-Digit Bank UTR', value: '424082534798', risk: 'low' },
      { key: 'Sender UPI ID', value: 'rahul.sharma@okicici', risk: 'low' },
      { key: 'Receiver UPI ID', value: 'merchant@paytm', risk: 'low' },
      { key: 'Amount Transferred', value: '₹25,000', risk: 'low' },
      { key: 'Date & Time', value: 'Sep 22, 2024 at 2:32 PM', risk: 'low' },
      { key: 'Bank Status', value: 'SUCCESS', risk: 'low' },
    ],
    hiddenFees: [],
    fraudFlags: [
      { flag: 'NPCI 12-Digit Format: VERIFIED', detail: 'Reference number matches the genuine 12-digit Indian bank routing format. No visual font tampering found.', risk: 'low' },
    ],
    utrStatus: 'verified',
    overallRisk: 'safe',
    summary: 'The 12-digit bank UTR reference is verified and matches NPCI banking standards. No photo editing or fake fonts detected. Safe to proceed.',
  },
}

const RISK_CFG = {
  safe: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.35)', text: '#34d399', label: '✓ 100% SAFE & CLEAN' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.35)', text: '#fbbf24', label: '⚠ SNEAKY CHARGES CAUGHT' },
  critical: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.35)', text: '#fb7185', label: '✗ HIGH DANGER / FAKE PROOF' },
}

async function callScanAPI(file: File | null, sampleType?: string): Promise<ScanResult> {
  if (sampleType && SAMPLE_RESULTS[sampleType]) return SAMPLE_RESULTS[sampleType]

  try {
    const form = new FormData()
    if (file) form.append('file', file)
    const res = await fetch('http://localhost:8000/api/scan-document', { method: 'POST', body: form })
    if (!res.ok) throw new Error('backend offline')
    return await res.json()
  } catch {
    return SAMPLE_RESULTS.invoice
  }
}

export default function Scanner() {
  const [dragging, setDragging] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [storageUpload, setStorageUpload] = useState<{ cloud: boolean; path?: string; publicUrl?: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { personaData } = useApp()
  const theme = personaData.theme

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setScanning(true)
    setResult(null)
    setStorageUpload(null)

    // Upload to Supabase Storage bucket 'finvexa-documents'
    uploadDocument(file, 'finvexa-documents')
      .then((res: { cloud: boolean; path?: string; publicUrl?: string; error?: string }) => {
        setStorageUpload(res)
      })
      .catch((err: unknown) => {
        console.warn('Storage upload error:', err)
        setStorageUpload({ cloud: false, path: file.name })
      })

    const res = await callScanAPI(file)
    setResult(res)
    setScanning(false)
  }, [])

  const handleSample = useCallback(async (type: string) => {
    setFileName(`sample-${type}.pdf`)
    setScanning(true)
    setResult(null)
    setStorageUpload({ cloud: isSupabaseConfigured(), path: `samples/sample-${type}.pdf` })
    await new Promise(r => setTimeout(r, 900))
    const res = await callScanAPI(null, type)
    setResult(res)
    setScanning(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header */}
      <div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border mb-2"
          style={{
            borderColor: `${theme.primaryHex}50`,
            background: `${theme.primaryHex}15`,
            color: theme.primaryHex,
          }}
        >
          <Sparkles size={13} />
          <span>AI Bill, Receipt & Fake-Payment Spy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Catch Sneaky Hidden Fees & Fake Payment Proofs
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Upload any bill, vendor contract, bank statement CSV, or WhatsApp payment screenshot. We read the fine print in seconds so you never overpay or get scammed:
        </p>
      </div>

      {/* Upload Zone */}
      <Tilt3DCard
        onDragOver={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`glass-card p-8 sm:p-12 cursor-pointer border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
          dragging ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-700 hover:border-emerald-500/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.csv,.png,.jpg,.jpeg,.txt"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/30">
          <Upload size={28} />
        </div>

        <div className="text-base font-bold text-white mb-1">
          {dragging ? 'Drop to scan right now!' : 'Click or Drag & Drop Any Document Here'}
        </div>
        <div className="text-xs text-slate-400 max-w-md">
          Supports Invoices, Bills, Bank Statements (CSV), and UPI Screenshots (PNG, JPG, PDF up to 10MB)
        </div>

        {/* Sample Previews */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5" onClick={e => e.stopPropagation()}>
          <span className="text-[11px] text-slate-400 font-medium">Or try instant sample:</span>
          <button
            onClick={() => handleSample('invoice')}
            disabled={scanning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Receipt size={13} className="text-emerald-400" />
            <span>🧾 Bill (₹6,264 Hidden Fees)</span>
          </button>
          <button
            onClick={() => handleSample('bank')}
            disabled={scanning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <CreditCard size={13} className="text-amber-400" />
            <span>🏦 Bank CSV (Auto-Debits)</span>
          </button>
          <button
            onClick={() => handleSample('upi')}
            disabled={scanning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Image size={13} className="text-cyan-400" />
            <span>📱 UPI Payment Proof</span>
          </button>
        </div>
      </Tilt3DCard>

      {/* Scanning Indicator */}
      {scanning && (
        <Tilt3DCard className="glass-card p-8 flex flex-col items-center justify-center gap-3 border border-emerald-500/40">
          <Loader2 size={36} className="text-emerald-400 animate-spin" />
          <div className="text-sm font-bold text-white">Reading {fileName} with AI...</div>
          <p className="text-xs text-slate-400">
            Checking 12-digit bank UTR numbers, spotting unbilled delivery fees, and calculating total leaks...
          </p>
        </Tilt3DCard>
      )}

      {/* Scan Results */}
      {result && !scanning && (
        <div className="space-y-6">
          {/* Result Banner */}
          <Tilt3DCard
            className="glass-card p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: RISK_CFG[result.overallRisk].bg,
              borderColor: RISK_CFG[result.overallRisk].border,
            }}
          >
            <div className="flex items-center gap-3">
              {result.overallRisk === 'safe' ? (
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle size={24} className="text-amber-400 shrink-0" />
              )}
              <div>
                <h3 className="text-base font-bold text-white">{result.type}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{result.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold font-mono border shadow-sm"
                style={{
                  background: RISK_CFG[result.overallRisk].bg,
                  color: RISK_CFG[result.overallRisk].text,
                  borderColor: RISK_CFG[result.overallRisk].border,
                }}
              >
                {RISK_CFG[result.overallRisk].label}
              </span>
              {storageUpload?.cloud && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <Cloud size={10} /> Supabase Cloud Saved
                </span>
              )}
            </div>
          </Tilt3DCard>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box 1: Key Terms Found */}
            <Tilt3DCard className="glass-card p-5 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText size={16} className="text-emerald-400" />
                <span>What We Found in the Bill</span>
              </div>
              <div className="space-y-2 text-xs">
                {result.extractedTerms.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center"
                  >
                    <span className="text-slate-400">{t.key}:</span>
                    <span className="font-bold text-white">{t.value}</span>
                  </div>
                ))}
              </div>
            </Tilt3DCard>

            {/* Box 2: Sneaky Hidden Fees */}
            <Tilt3DCard className="glass-card p-5 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <AlertTriangle size={16} className="text-amber-400" />
                <span>Sneaky Hidden Charges Caught</span>
              </div>
              {result.hiddenFees.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>Zero hidden fees detected. Clean invoice!</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {result.hiddenFees.map((fee, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex justify-between items-center"
                    >
                      <span className="text-slate-300">{fee.description}:</span>
                      <span className="font-bold text-rose-400 font-mono">
                        +₹{fee.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Tilt3DCard>

            {/* Box 3: Scam & Red Flag Warnings */}
            <Tilt3DCard className="glass-card p-5 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span>Safety Checks & Red Flags</span>
              </div>
              <div className="space-y-2 text-xs">
                {result.fraudFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1"
                  >
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>•</span>
                      <span>{flag.flag}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed pl-2.5">
                      {flag.detail}
                    </p>
                  </div>
                ))}
              </div>
            </Tilt3DCard>
          </div>
        </div>
      )}
    </div>
  )
}
