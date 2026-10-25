// src/pages/HiddenMoneyFinder.tsx
import { useState } from 'react'
import {
  Coins,
  Clock,
  Users,
  ExternalLink,
  Laptop,
  Smartphone,
  Contact,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import GoalQuickEditBar from '../components/GoalQuickEditBar'

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
  detectionNote: string
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

  // 3 Detected Public Venue Hangout Bills
  const [venueBills, setVenueBills] = useState<PublicVenueBill[]>([
    {
      id: 'venue-1',
      venueName: 'Mainland China Restaurant & Lounge',
      category: 'Dining Out',
      emoji: '🥢',
      amount: 1800,
      date: 'Saturday, 9:45 PM',
      detectedReason: 'Bill is 4.2x above your solo dining average with restaurant MCC 5812',
    },
    {
      id: 'venue-2',
      venueName: 'PVR Cinemas (Movie & Popcorn Combo)',
      category: 'Movies & Entertainment',
      emoji: '🍿',
      amount: 1200,
      date: 'Sunday, 4:15 PM',
      detectedReason: 'Cinema multiplex charge for 3 ticket seats and combo tub',
    },
    {
      id: 'venue-3',
      venueName: 'Phoenix Mall Food Court & Gaming',
      category: 'Mall Hangout',
      emoji: '🛍️',
      amount: 2400,
      date: 'Friday, 8:30 PM',
      detectedReason: 'Unusually high single swipe at public weekend hangout venue',
    },
  ])

  // Active splitting state for each venue card
  const [activeSplitId, setActiveSplitId] = useState<string | null>('venue-1')
  const [splitCounts, setSplitCounts] = useState<Record<string, number>>({
    'venue-1': 3,
    'venue-2': 3,
    'venue-3': 4,
  })
  const [friendNames, setFriendNames] = useState<Record<string, string>>({
    'venue-1': 'Rahul',
    'venue-2': 'Sneha',
    'venue-3': 'Amit',
  })
  const [friendPhones, setFriendPhones] = useState<Record<string, string>>({
    'venue-1': '9876543210',
    'venue-2': '9876543211',
    'venue-3': '9876543212',
  })

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
      detectionNote: 'Detected via ₹2 test mandate verification in statement that turned into auto-debit.',
    },
    {
      id: 'adb-2',
      serviceName: 'OTT Video Pass (Unused)',
      logoEmoji: '🎬',
      amount: 199,
      renewalDate: '30th of this month',
      frequency: 'Monthly',
      isCancelled: false,
      detectionNote: 'Zero video streaming activity detected on registered email for over 45 days.',
    },
    {
      id: 'adb-3',
      serviceName: 'Cloud Storage 50GB Trial',
      logoEmoji: '☁️',
      amount: 130,
      renewalDate: '3rd of next month',
      frequency: 'Monthly',
      isCancelled: false,
      detectionNote: 'Free promotion expired; auto-debited quietly at 2:14 AM without SMS notification.',
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

  const handleDismissVenue = (id: string) => {
    setVenueBills(prev => prev.filter(v => v.id !== id))
  }

  const handlePickContact = async (venueId: string) => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel']
        const opts = { multiple: false }
        const contacts = await (navigator as any).contacts.select(props, opts)
        if (contacts && contacts[0]) {
          if (contacts[0].name?.[0]) {
            setFriendNames(prev => ({ ...prev, [venueId]: contacts[0].name[0] }))
          }
          if (contacts[0].tel?.[0]) {
            setFriendPhones(prev => ({
              ...prev,
              [venueId]: contacts[0].tel[0].replace(/\D/g, '').slice(-10),
            }))
          }
        }
      } catch {
        // user cancelled or rejected
      }
    } else {
      alert('Contact picker is available on supported mobile browsers. You can type the 10-digit phone number directly!')
    }
  }

  const handleAddSplitToDebts = (bill: PublicVenueBill) => {
    const count = splitCounts[bill.id] || 3
    const name = friendNames[bill.id] || 'Friend'
    const phone = friendPhones[bill.id] || '9876543210'
    const eachShare = Math.round(bill.amount / count)

    const newDebt: FriendDebt = {
      id: `split-${Date.now()}`,
      friendName: name.trim() || 'Friend',
      avatarEmoji: bill.emoji,
      reason: `${bill.venueName} (${count}-way split)`,
      amount: eachShare,
      daysAgo: 1,
      whatsappPhone: `91${phone.replace(/\D/g, '').slice(-10)}`,
      isSettled: false,
    }
    setFriendDebts(prev => [newDebt, ...prev])
    handleDismissVenue(bill.id)
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Quick Goal & Amount Bar */}
      <GoalQuickEditBar />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Coins size={13} />
            <span>AI Leak Radar & Receivable Hunter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hidden Money Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Finding money that rightfully belongs to <strong className="text-slate-200">{personaData.label}</strong>: forgotten subscriptions, delayed refunds, uncollected friend splits, and late-night food surge leaks.
          </p>
        </div>

        {/* Big Total Recoverable Pill */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-right shrink-0 backdrop-blur-md">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Total Money to Recover
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
            +₹{grandRecoverableTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* PROMINENT PUBLIC HANGOUT GROUP BILL DETECTED ALERT BOX */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-amber-200">
                🎉 Public Hangout Group Bill Detected!
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {venueBills.length} High Bills Found
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium leading-relaxed">
              Forgot to split at the counter? Our AI detected unusually high restaurant, movie theater, and mall hangout transactions from your bank statements where you paid the whole bill:
            </p>
          </div>
        </div>

        {/* 3 Detected Public Bills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {venueBills.map(bill => {
            const isSplitting = activeSplitId === bill.id
            const count = splitCounts[bill.id] || 3
            const name = friendNames[bill.id] || 'Friend'
            const phone = friendPhones[bill.id] || '9876543210'
            const eachShare = Math.round(bill.amount / count)

            return (
              <div
                key={bill.id}
                className="bg-slate-900/80 rounded-xl border border-white/10 p-4 shadow-lg flex flex-col justify-between space-y-3 backdrop-blur-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{bill.emoji}</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      ₹{bill.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                    {bill.venueName}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {bill.date} · {bill.category}
                  </div>
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/20 rounded-lg p-2 mt-2 leading-relaxed">
                    🔍 {bill.detectedReason}
                  </p>
                </div>

                {/* Solo vs Group Split Action Buttons */}
                {!isSplitting ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleDismissVenue(bill.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
                    >
                      👤 Solo Bill
                    </button>
                    <button
                      onClick={() => setActiveSplitId(bill.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      👥 Group Split - Recover Money
                    </button>
                  </div>
                ) : (
                  /* Interactive Split Calculator Inside Card */
                  <div className="pt-3 border-t border-amber-500/20 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Split with how many friends?
                      </label>
                      <select
                        value={count}
                        onChange={e =>
                          setSplitCounts(prev => ({
                            ...prev,
                            [bill.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-xs font-bold text-white"
                      >
                        <option value={2}>2 People (₹{Math.round(bill.amount / 2)} each)</option>
                        <option value={3}>3 People (₹{Math.round(bill.amount / 3)} each)</option>
                        <option value={4}>4 People (₹{Math.round(bill.amount / 4)} each)</option>
                        <option value={5}>5 People (₹{Math.round(bill.amount / 5)} each)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Friend Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={e =>
                            setFriendNames(prev => ({
                              ...prev,
                              [bill.id]: e.target.value,
                            }))
                          }
                          placeholder="Name"
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-slate-400">
                            Phone (10-Digit)
                          </label>
                          <button
                            onClick={() => handlePickContact(bill.id)}
                            className="text-[10px] text-cyan-400 font-bold hover:underline flex items-center gap-0.5"
                            title="Pick from mobile contacts"
                          >
                            <Contact size={10} />
                            <span>Contacts</span>
                          </button>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e =>
                            setFriendPhones(prev => ({
                              ...prev,
                              [bill.id]: e.target.value,
                            }))
                          }
                          placeholder="9876543210"
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-bold flex justify-between items-center">
                      <span>Each Share:</span>
                      <span className="font-mono text-sm font-black text-emerald-400">₹{eachShare}</span>
                    </div>

                    {/* WhatsApp Web Button & Save */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() =>
                          handleSendReminderWeb(name, eachShare, bill.venueName, phone)
                        }
                        className="w-full py-2 px-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-colors"
                        title="Opens WhatsApp Web in a new browser tab"
                      >
                        <Laptop size={13} />
                        <span>💻 Send Reminder on WhatsApp Web</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            handleSendReminderMobile(name, eachShare, bill.venueName, phone)
                          }
                          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-1 transition-colors"
                        >
                          <Smartphone size={11} />
                          <span>App</span>
                        </button>
                        <button
                          onClick={() => handleAddSplitToDebts(bill)}
                          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                        >
                          Save Debt
                        </button>
                        <button
                          onClick={() => setActiveSplitId(null)}
                          className="py-1.5 px-2 rounded-lg text-[11px] text-slate-400 hover:bg-slate-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 2-Column Section: 1 AM Surge + Subscriptions Leak Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: 1 AM Food Surge Radar */}
        <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛵</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  1 AM Late-Night Food Delivery Surges
                </h3>
                <div className="text-xs text-slate-400">
                  Found from statement timestamps: 12 orders between 11:30 PM and 3:15 AM with MCC 5814
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
              ₹3,200 Leaked/Mo
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" />
              <span>Statement Forensic Findings:</span>
            </div>
            <p className="leading-relaxed">
              Delivery platforms tack on a <strong className="text-amber-300">₹45–₹95 late-night fee + rain markup + platform handling fees</strong> for midnight orders. Over a typical month, this bleeds ₹3,200 that quietly squeezes your buffer.
            </p>
          </div>

          {/* Actionable Web Solution */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-blue-300">
                Verified Way to Stop Surge Fees:
              </div>
              <div className="text-xs text-slate-400">
                Order directly through ONDC food apps with 0% platform surge markups.
              </div>
            </div>
            <a
              href="https://ondc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 shrink-0 transition-colors"
            >
              <span>Explore ONDC</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Card 2: Free-Trial Auto-Debit Alarms */}
        <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Sneaky Free-Trial Auto-Debit Alarms
                </h3>
                <div className="text-xs text-slate-400">
                  Found via ₹1/₹2 mandate authorization checks in bank statement that turned into recurring charges
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              ₹828/Mo Leaked
            </span>
          </div>

          {/* Alarms List */}
          <div className="space-y-2.5">
            {alarms.map(alarm => (
              <div
                key={alarm.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  alarm.isCancelled
                    ? 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60'
                    : 'bg-slate-950/70 border-white/10 text-slate-300 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{alarm.logoEmoji}</span>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{alarm.serviceName}</span>
                      {alarm.isCancelled && (
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">
                          (CANCELLED)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{alarm.detectionNote}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-white">
                    ₹{alarm.amount}/mo
                  </span>
                  <button
                    onClick={() => handleCancelAlarm(alarm.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      alarm.isCancelled
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {alarm.isCancelled ? 'Undone' : 'Cancel Mandate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sahamati RBI AA Tool Link */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Cancel All Silent Mandates via RBI AA:
              </div>
              <div className="text-xs text-slate-400">
                Use the Sahamati Account Aggregator consent dashboard to revoke bank e-mandates with 1 tap.
              </div>
            </div>
            <a
              href="https://sahamati.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 shrink-0 transition-colors"
            >
              <span>Revoke on Sahamati</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Friends Receivable Debt Tracker */}
      <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Active Friends Split Receivable Tracker
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
            ₹{activeDebtsTotal.toLocaleString('en-IN')} Due to You
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {friendDebts.map(debt => (
            <div
              key={debt.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                debt.isSettled
                  ? 'bg-slate-950/40 border-white/5 opacity-60'
                  : 'bg-slate-950/80 border-white/10 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{debt.avatarEmoji}</span>
                    <span className="text-xs font-bold text-white">{debt.friendName}</span>
                  </div>
                  <span className="font-mono text-sm font-black text-amber-400">
                    ₹{debt.amount}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{debt.reason}</div>
                <div className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                  Pending for {debt.daysAgo} days
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                <button
                  onClick={() =>
                    handleSendReminderWeb(
                      debt.friendName,
                      debt.amount,
                      debt.reason,
                      debt.whatsappPhone
                    )
                  }
                  className="flex-1 py-1 px-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20"
                >
                  <Laptop size={11} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleSettleDebt(debt.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5"
                >
                  {debt.isSettled ? 'Reopen' : '✓ Received'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
