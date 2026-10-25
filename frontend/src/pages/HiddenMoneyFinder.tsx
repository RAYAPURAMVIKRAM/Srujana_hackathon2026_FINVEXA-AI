// src/pages/HiddenMoneyFinder.tsx
import { useState } from 'react'
import {
  Coins,
  Send,
  Clock,
  Sparkles,
  BellRing,
  Check,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Tilt3DCard from '../components/Tilt3DCard'

interface FriendDebt {
  id: string
  friendName: string
  avatarEmoji: string
  reason: string
  amount: number
  daysAgo: number
  whatsappPhone?: string
  isSettled: boolean
}

interface PendingRefund {
  id: string
  merchant: string
  logoEmoji: string
  amount: number
  orderId: string
  daysPending: number
  status: 'merchant_approved' | 'gateway_pending' | 'credited'
}

interface AutoDebitAlarm {
  id: string
  serviceName: string
  logoEmoji: string
  amount: number
  renewalDate: string
  frequency: string
  isCancelled: boolean
}

export default function HiddenMoneyFinder() {
  const { personaData } = useApp()
  const theme = personaData.theme

  // State for friend debts
  const [friendDebts, setFriendDebts] = useState<FriendDebt[]>([
    {
      id: 'fd-1',
      friendName: 'Rohit Sharma',
      avatarEmoji: '🏏',
      reason: 'Group Dinner at Biryani House',
      amount: 400,
      daysAgo: 14,
      whatsappPhone: '919876543210',
      isSettled: false,
    },
    {
      id: 'fd-2',
      friendName: 'Priya Patel',
      avatarEmoji: '🎨',
      reason: 'Shared Cab to Airport',
      amount: 350,
      daysAgo: 9,
      whatsappPhone: '919876543211',
      isSettled: false,
    },
    {
      id: 'fd-3',
      friendName: 'Ankit Verma',
      avatarEmoji: '💻',
      reason: 'Cinema Tickets & Popcorn',
      amount: 250,
      daysAgo: 21,
      whatsappPhone: '919876543212',
      isSettled: false,
    },
  ])

  // State for pending refunds
  const [refunds] = useState<PendingRefund[]>([
    {
      id: 'ref-1',
      merchant: 'Amazon India',
      logoEmoji: '📦',
      amount: 1100,
      orderId: 'OD-89412-AMZ',
      daysPending: 8,
      status: 'gateway_pending',
    },
    {
      id: 'ref-2',
      merchant: 'Swiggy Instamart',
      logoEmoji: '🛵',
      amount: 280,
      orderId: 'SW-00281-REF',
      daysPending: 4,
      status: 'merchant_approved',
    },
  ])

  // State for auto-debit alarms
  const [alarms, setAlarms] = useState<AutoDebitAlarm[]>([
    {
      id: 'adb-1',
      serviceName: 'Fitness Gym App Trial',
      logoEmoji: '🏋️',
      amount: 499,
      renewalDate: '28th of this month',
      frequency: 'Monthly',
      isCancelled: false,
    },
    {
      id: 'adb-2',
      serviceName: 'OTT Video Pass (Unused)',
      logoEmoji: '🎬',
      amount: 199,
      renewalDate: '30th of this month',
      frequency: 'Monthly',
      isCancelled: false,
    },
    {
      id: 'adb-3',
      serviceName: 'Cloud Storage 50GB Trial',
      logoEmoji: '☁️',
      amount: 130,
      renewalDate: '3rd of next month',
      frequency: 'Monthly',
      isCancelled: false,
    },
  ])

  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Calculations
  const activeDebtsTotal = friendDebts
    .filter(d => !d.isSettled)
    .reduce((acc, d) => acc + d.amount, 0)

  const activeRefundsTotal = refunds
    .filter(r => r.status !== 'credited')
    .reduce((acc, r) => acc + r.amount, 0)

  const activeAlarmsTotal = alarms
    .filter(a => !a.isCancelled)
    .reduce((acc, a) => acc + a.amount, 0)

  const deliverySurgeMonthly = 3200

  const grandRecoverableTotal =
    activeDebtsTotal + activeRefundsTotal + activeAlarmsTotal + Math.round(deliverySurgeMonthly * 0.7)

  // Actions
  const handleSettleDebt = (id: string) => {
    setFriendDebts(prev =>
      prev.map(d => (d.id === id ? { ...d, isSettled: !d.isSettled } : d))
    )
  }

  const handleSendReminder = (debt: FriendDebt) => {
    const text = `Hey ${debt.friendName}! Hope you're doing well. Just a gentle reminder about my ₹${debt.amount} share for ${debt.reason} from a few days ago. Whenever you get time, please UPI it to me. Thanks!`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleCopyReminder = (debt: FriendDebt) => {
    const text = `Hey ${debt.friendName}! Gentle reminder for ₹${debt.amount} for ${debt.reason}. Please UPI when free!`
    navigator.clipboard.writeText(text)
    setCopiedId(debt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCancelAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(a => (a.id === id ? { ...a, isCancelled: !a.isCancelled } : a))
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border mb-2"
          style={{
            borderColor: `${theme.primaryHex}50`,
            background: `${theme.primaryHex}15`,
            color: theme.primaryHex,
          }}
        >
          <Coins size={13} />
          <span>Hidden Leak & Refund Detector · Instant Money Recovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Hidden Money Finder
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          FINVEXA found forgotten friend splits, uncredited merchant refunds, and sneaky free-trial auto-debits that you can claim back right now without borrowing a Rupee.
        </p>
      </div>

      {/* Hero Recoverable Ticker Card */}
      <Tilt3DCard
        className="glass-card p-6 sm:p-8 border relative overflow-hidden"
        style={{
          borderColor: 'rgba(16, 185, 129, 0.4)',
          boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Total Money You Can Recover Today</span>
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mono">
              +₹{grandRecoverableTotal.toLocaleString('en-IN')}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Recovering this money immediately offsets your upcoming bills and keeps your rent money 100% untouched.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Friend Splits</span>
              <span className="text-base font-bold text-amber-400 mono">
                ₹{activeDebtsTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Pending Refunds</span>
              <span className="text-base font-bold text-blue-400 mono">
                ₹{activeRefundsTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Unused Subs</span>
              <span className="text-base font-bold text-rose-400 mono">
                ₹{activeAlarmsTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">1 AM Food Markups</span>
              <span className="text-base font-bold text-emerald-400 mono">
                ₹{Math.round(deliverySurgeMonthly * 0.7).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </Tilt3DCard>

      {/* Grid: 4 Interactive Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Forgotten Friend UPI Splits */}
        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <div>
                <h3 className="text-base font-bold text-white">Forgotten Friend UPI Splits</h3>
                <p className="text-xs text-slate-400">People who owe you money from group outings</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono">
              ₹{activeDebtsTotal} Pending
            </span>
          </div>

          <div className="space-y-3">
            {friendDebts.map(debt => (
              <div
                key={debt.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  debt.isSettled
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {debt.avatarEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{debt.friendName}</span>
                      <span className="text-amber-300 font-mono">₹{debt.amount}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {debt.reason} · <span className="text-slate-500">{debt.daysAgo} days ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!debt.isSettled && (
                    <>
                      <button
                        onClick={() => handleSendReminder(debt)}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                        title="Send pre-written reminder via WhatsApp"
                      >
                        <Send size={11} />
                        <span>Remind on WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleCopyReminder(debt)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        title="Copy reminder message"
                      >
                        {copiedId === debt.id ? <Check size={13} className="text-emerald-400" /> : '📋'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleSettleDebt(debt.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                      debt.isSettled
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                  >
                    {debt.isSettled ? 'Undo' : 'Mark as Paid'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Tilt3DCard>

        {/* Module 2: Pending Un-Credited Refunds */}
        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <div>
                <h3 className="text-base font-bold text-white">Pending Merchant Refunds</h3>
                <p className="text-xs text-slate-400">Money stuck between seller and your bank</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-400 font-mono">
              ₹{activeRefundsTotal} Pending
            </span>
          </div>

          <div className="space-y-3">
            {refunds.map(ref => (
              <div
                key={ref.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {ref.logoEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{ref.merchant}</span>
                      <span className="text-blue-300 font-mono">₹{ref.amount}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Order: {ref.orderId} · {ref.daysPending} days pending
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {ref.status === 'gateway_pending' ? 'Gateway Delay' : 'Approved by Seller'}
                  </span>
                  <button
                    onClick={() =>
                      alert(`Tracking ${ref.orderId}: Bank gateway ARN received. Expected credit in 48-72 hours.`)
                    }
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Check Status
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2">
            <Clock size={15} className="text-blue-400 shrink-0" />
            <span>
              RBI Guidelines mandate automatic compensation of ₹100/day if failed transactions are delayed beyond 5 business days.
            </span>
          </div>
        </Tilt3DCard>

        {/* Module 3: 1 AM Delivery Surge Markups */}
        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌙</span>
              <div>
                <h3 className="text-base font-bold text-white">1 AM Food & Surge Markups</h3>
                <p className="text-xs text-slate-400">Late night delivery surge and convenience fees</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              ₹3,200/mo Leaked
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Late Night Surge Charges (12 AM - 3 AM):</span>
              <span className="text-rose-400 font-bold font-mono">₹1,400</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Rain & High Demand Surcharges:</span>
              <span className="text-rose-400 font-bold font-mono">₹950</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Small Order & Packaging Markups:</span>
              <span className="text-rose-400 font-bold font-mono">₹850</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-400" />
              <span>Easy Fix: Meal Prep or Keep Quick Snacks at Home</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Keeping 4 packs of quick noodles or meal prep on Sunday saves <strong>₹2,400 every month</strong> instantly — almost 15% of your rent!
            </p>
          </div>
        </Tilt3DCard>

        {/* Module 4: Sneaky Free-Trial Auto-Debit Alarms */}
        <Tilt3DCard className="glass-card p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏰</span>
              <div>
                <h3 className="text-base font-bold text-white">Free-Trial Auto-Debit Alarms</h3>
                <p className="text-xs text-slate-400">Subscriptions about to charge your card/UPI</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              ₹{activeAlarmsTotal} Due Soon
            </span>
          </div>

          <div className="space-y-3">
            {alarms.map(alarm => (
              <div
                key={alarm.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alarm.isCancelled
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {alarm.logoEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{alarm.serviceName}</span>
                      <span className="text-rose-300 font-mono">₹{alarm.amount}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Renews: <strong className="text-amber-300">{alarm.renewalDate}</strong> ({alarm.frequency})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelAlarm(alarm.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold self-end sm:self-auto transition-colors ${
                    alarm.isCancelled
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {alarm.isCancelled ? '✓ Marked Cancelled' : 'Cancel Subscription'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <BellRing size={15} className="text-amber-400 shrink-0" />
            <span>
              Under RBI e-mandate rules, banks must send an SMS notification 24 hours before any recurring auto-debit charge.
            </span>
          </div>
        </Tilt3DCard>
      </div>
    </div>
  )
}
