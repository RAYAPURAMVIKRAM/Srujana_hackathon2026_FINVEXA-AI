// src/pages/HiddenMoneyFinder.tsx
import { useState } from 'react'
import {
  Coins,
  Clock,
  Sparkles,
  Users,
  ExternalLink,
  Laptop,
  Smartphone,
  AlertCircle,
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

interface PublicVenueBill {
  id: string
  venueName: string
  category: string
  emoji: string
  amount: number
  date: string
  detectedReason: string
}

export default function HiddenMoneyFinder() {
  const { personaData } = useApp()
  const theme = personaData.theme

  // Public Venue Detection
  const [detectedVenue, setDetectedVenue] = useState<PublicVenueBill | null>({
    id: 'venue-1',
    venueName: 'Mainland China Restaurant & Lounge',
    category: 'Dining Out',
    emoji: '🥢',
    amount: 1800,
    date: 'Saturday, 9:45 PM',
    detectedReason: 'Bill is 4.2x above your solo dining average with restaurant MCC 5812',
  })
  const [isSplittingVenue, setIsSplittingVenue] = useState(false)
  const [splitCount, setSplitCount] = useState(3)
  const [friendName, setFriendName] = useState('Rahul')
  const [friendPhone, setFriendPhone] = useState('9876543210')

  // Friend Debts
  const [friendDebts, setFriendDebts] = useState<FriendDebt[]>([
    {
      id: 'debt-1',
      friendName: 'Aman Sharma',
      avatarEmoji: '🍕',
      reason: 'Weekend Pizza & Biryani Split',
      amount: 400,
      daysAgo: 14,
      whatsappPhone: '919876543210',
      isSettled: false,
    },
    {
      id: 'debt-2',
      friendName: 'Priya Verma',
      avatarEmoji: '🚕',
      reason: 'Late Night Airport Uber Fare',
      amount: 600,
      daysAgo: 7,
      whatsappPhone: '919876543211',
      isSettled: false,
    },
    {
      id: 'debt-3',
      friendName: 'Rohan Mehta',
      avatarEmoji: '💻',
      reason: 'Cinema Tickets & Popcorn',
      amount: 250,
      daysAgo: 21,
      whatsappPhone: '919876543212',
      isSettled: false,
    },
  ])

  // Pending refunds
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

  // Auto-debit alarms
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

  const handleSendReminderWeb = (nameStr: string, amt: number, reason: string, phoneStr?: string) => {
    const cleanPhone = (phoneStr || '9876543210').replace(/\D/g, '').slice(-10)
    const text = `Hey ${nameStr}! Hope you're doing well. Just a quick reminder about my ₹${amt} share for ${reason}. Whenever free, please UPI it to me. Thanks!`
    const url = `https://web.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleSendReminderMobile = (nameStr: string, amt: number, reason: string, phoneStr?: string) => {
    const cleanPhone = (phoneStr || '9876543210').replace(/\D/g, '').slice(-10)
    const text = `Hey ${nameStr}! Hope you're doing well. Quick reminder for ₹${amt} for ${reason}. Please UPI when free!`
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleCancelAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(a => (a.id === id ? { ...a, isCancelled: !a.isCancelled } : a))
    )
  }

  const handleAddSplitToDebts = () => {
    if (!detectedVenue) return
    const eachShare = Math.round(detectedVenue.amount / splitCount)
    const newDebt: FriendDebt = {
      id: `split-${Date.now()}`,
      friendName: friendName.trim() || 'Friend',
      avatarEmoji: detectedVenue.emoji,
      reason: `${detectedVenue.venueName} (${splitCount}-way split)`,
      amount: eachShare,
      daysAgo: 1,
      whatsappPhone: `91${friendPhone.replace(/\D/g, '').slice(-10)}`,
      isSettled: false,
    }
    setFriendDebts(prev => [newDebt, ...prev])
    setIsSplittingVenue(false)
    setDetectedVenue(null)
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
          FINVEXA scans your statement timestamps to catch high-value public hangout bills, uncredited merchant refunds, and sneaky auto-debits before they drain your balance.
        </p>
      </div>

      {/* WHY FINVEXA BEATS PHONEPE BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border border-blue-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <div className="font-bold text-white text-sm">
              Why FINVEXA Beats PhonePe & Google Pay Split Bill
            </div>
            <div className="text-slate-300 text-xs mt-0.5">
              PhonePe only lets you split <em>after</em> you manually remember to ask at the billing counter. FINVEXA automatically scans your statement for high-ticket dining and entertainment debits so you never forget to collect your share!
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 shrink-0">
          Automatic Detection
        </span>
      </div>

      {/* PUBLIC VENUE BILL DETECTED POPUP CARD */}
      {detectedVenue && (
        <Tilt3DCard className="glass-card p-5 sm:p-6 border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 to-slate-900/90 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl shrink-0">{detectedVenue.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    🎉 Public Venue Hangout Bill Detected!
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    High Outing Bill
                  </span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">
                  {detectedVenue.venueName} · <span className="text-amber-300 font-mono">₹{detectedVenue.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {detectedVenue.date} · {detectedVenue.detectedReason}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDetectedVenue(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                👤 Just Me (Solo)
              </button>
              <button
                onClick={() => setIsSplittingVenue(true)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
              >
                <Users size={14} />
                <span>👥 Group Split! Recover My Money</span>
              </button>
            </div>
          </div>

          {/* Interactive Split Drawer */}
          {isSplittingVenue && (
            <div className="pt-2 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Split Among How Many People?
                  </label>
                  <select
                    value={splitCount}
                    onChange={e => setSplitCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value={2}>2 People (₹{Math.round(detectedVenue.amount / 2)} each)</option>
                    <option value={3}>3 People (₹{Math.round(detectedVenue.amount / 3)} each)</option>
                    <option value={4}>4 People (₹{Math.round(detectedVenue.amount / 4)} each)</option>
                    <option value={5}>5 People (₹{Math.round(detectedVenue.amount / 5)} each)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Friend Name
                  </label>
                  <input
                    type="text"
                    value={friendName}
                    onChange={e => setFriendName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Friend WhatsApp Phone (10 digits)
                  </label>
                  <input
                    type="tel"
                    value={friendPhone}
                    onChange={e => setFriendPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons: WhatsApp Web & Mobile */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-xs text-amber-300 font-bold">
                  Each Friend's Share: ₹{Math.round(detectedVenue.amount / splitCount)}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      handleSendReminderWeb(
                        friendName,
                        Math.round(detectedVenue.amount / splitCount),
                        detectedVenue.venueName,
                        friendPhone
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-all"
                    title="Opens WhatsApp Web in a new tab"
                  >
                    <Laptop size={13} />
                    <span>Send via WhatsApp Web (Desktop)</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSendReminderMobile(
                        friendName,
                        Math.round(detectedVenue.amount / splitCount),
                        detectedVenue.venueName,
                        friendPhone
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-md transition-all"
                    title="Opens WhatsApp App"
                  >
                    <Smartphone size={13} />
                    <span>WhatsApp App</span>
                  </button>

                  <button
                    onClick={handleAddSplitToDebts}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                  >
                    Save to Tracker
                  </button>
                </div>
              </div>
            </div>
          )}
        </Tilt3DCard>
      )}

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
              Recovering this money immediately offsets your upcoming bills and keeps your rent floor 100% untouched.
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
                        onClick={() =>
                          handleSendReminderWeb(
                            debt.friendName,
                            debt.amount,
                            debt.reason,
                            debt.whatsappPhone
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                        title="Send via WhatsApp Web"
                      >
                        <Laptop size={11} />
                        <span>Web</span>
                      </button>
                      <button
                        onClick={() =>
                          handleSendReminderMobile(
                            debt.friendName,
                            debt.amount,
                            debt.reason,
                            debt.whatsappPhone
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                        title="Send via WhatsApp App"
                      >
                        <Smartphone size={11} />
                        <span>App</span>
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
              RBI Guidelines mandate automatic compensation of ₹100/day if failed transactions are delayed beyond T+1 business days.
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
                <p className="text-xs text-slate-400">Statement debit spikes between 11 PM and 3 AM</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              ₹3,200/mo Leaked
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>How AI Detected This from Your Statement:</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregator debits with timestamps from 11 PM to 3:30 AM contain hidden ₹45–₹95 late-night fees and 20% menu price inflations.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Late Night Surge Charges (12 AM - 3 AM):</span>
              <span className="text-rose-400 font-bold font-mono">₹1,400</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Rain & High Demand Surcharges:</span>
              <span className="text-rose-400 font-bold font-mono">₹950</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Packaging & Platform Fees:</span>
              <span className="text-rose-400 font-bold font-mono">₹850</span>
            </div>
          </div>

          {/* AI Web Researched Alternative */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
            <div className="font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                <span>AI Web Alternative: Order via ONDC Direct</span>
              </span>
              <a
                href="https://ondc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>ondc.org</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Order directly through ONDC-backed apps (Paytm, Magicpin) where local restaurants charge <strong>0% commission and zero surge fees</strong>, saving you ₹2,400 every month!
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
                <p className="text-xs text-slate-400">Recurring e-mandates flagged from ₹1/₹2 setup debits</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              ₹{activeAlarmsTotal} Due Soon
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>How AI Detected This from Your Statement:</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Initial ₹1 or ₹2 mandate authorization entries were detected. These free trials auto-convert into full monthly subscriptions after 14–30 days.
            </p>
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

          {/* AI Web Researched Alternative */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-blue-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>AI Saving Hack: Student & Family Bundles</span>
              </span>
              <a
                href="https://www.amazon.in/prime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Amazon Prime Student</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Use your college email (.edu / college ID) to claim 50% cashback on Amazon Prime and Apple Music, saving ₹1,200/year.
            </p>
          </div>
        </Tilt3DCard>
      </div>
    </div>
  )
}
