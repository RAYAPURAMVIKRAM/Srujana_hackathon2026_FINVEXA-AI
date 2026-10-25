// src/components/AiBankingChatbot.tsx
import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  User,
  Copy,
  Check,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Tilt3DCard from './Tilt3DCard'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

const QUICK_PROMPTS = [
  'Why was ₹250 or ₹50 deducted?',
  'How does UPI dispute / chargeback work?',
  'Can my bank reverse an auto-debit?',
  'Am I eligible for a zero-cost EMI loan?',
  'Explain RBI Account Aggregator safe consent',
  'How to avoid 1 AM food delivery surge charges?',
]

export default function AiBankingChatbot() {
  const { persona, personaData, bankConsent, themeMode } = useApp()
  const theme = personaData.theme
  const isLight = themeMode === 'light'

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your FINVEXA AI Banking & Account Assistant. I can explain unexpected bank charges, help resolve failed UPI transfers, assist with auto-debit cancellations, or verify zero-cost EMI loan safety for your ${personaData.label} account.\n\nType any question below or tap one of the quick prompts!`,
      timestamp: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          persona_type: persona,
          balance: personaData.balance,
          locked_reserves: personaData.lockedReserves,
          bank_name: bankConsent.bankName || 'Your Bank',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, botMsg])
        setIsLoading(false)
        return
      }
    } catch {
      // Backend offline or error -> smart instant fallback
    }

    // Instant Smart Fallback
    setTimeout(() => {
      let reply = ''
      const q = query.toLowerCase()

      if (q.includes('deduct') || q.includes('charge') || q.includes('fee') || q.includes('250') || q.includes('50') || q.includes('sms')) {
        reply = `Here is why your bank may have deducted charges recently:\n\n1. **Non-Maintenance of Minimum Balance (MAB)**: Most banks (SBI, HDFC, ICICI) charge ₹150–₹350 + GST if your average monthly balance falls below the threshold.\n2. **Annual Debit Card / SMS Alert Fees**: Banks deduct ₹150–₹250/year for ATM card renewal and ₹15–₹25/quarter for SMS alerts.\n3. **Pro Tip**: You can request your bank branch to convert your account to a **BSBDA (Basic Savings Bank Deposit / Zero Balance)** account where minimum balance penalties are strictly 100% prohibited by RBI rules!`
      } else if (q.includes('upi') || q.includes('failed') || q.includes('dispute') || q.includes('debited') || q.includes('utr')) {
        reply = `Here is what to do for UPI transaction issues:\n\n1. **Money Debited But Not Received (T+1 Rule)**: Under RBI's Harmonisation of Turn Around Time (TAT) circular, banks MUST auto-reverse failed UPI debits within T+1 working days. If delayed past T+1, the bank must pay you ₹100/day compensation!\n2. **Raise Dispute**: In your UPI app (GPay/PhonePe), tap the transaction and click 'Raise Dispute' using the 12-digit UTR number.\n3. **Official Complaint**: You can also report directly to your bank's nodal officer and the NPCI dispute portal at npci.org.in.`
      } else if (q.includes('auto debit') || q.includes('mandate') || q.includes('cancel') || q.includes('subscription')) {
        reply = `Here is how to stop an unwanted auto-debit:\n\n1. **In Google Pay / PhonePe**: Tap your Profile photo -> **Autopay / Mandates** -> Select the active mandate -> Click **Pause** or **Delete Mandate**.\n2. **In NetBanking**: Log in -> Search **e-Mandate Management / NACH** -> Revoke consent.\n3. **RBI Protection**: Banks must send you an alert 24 hours prior to debit. If debited without pre-debit alert, you can dispute the full amount with your bank.`
      } else if (q.includes('emi') || q.includes('loan') || q.includes('laptop') || q.includes('bike')) {
        reply = `Here is your Zero-Cost EMI & Loan eligibility breakdown for ${personaData.label}:\n\n1. **Your Current Safe Buffer**: You have ₹${personaData.balance.toLocaleString('en-IN')} safe balance and ₹${personaData.lockedReserves.toLocaleString('en-IN')} locked for essentials.\n2. **Zero-Cost EMI Truth**: A 'No Cost EMI' actually discounts the product price by the interest amount so your total payout equals the retail price. Always check for a hidden ₹199 + GST loan processing fee.\n3. **Golden Rule**: Keep your monthly EMI below 25% of your disposable income so your rent and emergency funds stay untouched.`
      } else if (q.includes('rbi') || q.includes('account aggregator') || q.includes('consent') || q.includes('safe')) {
        reply = `FINVEXA uses the official **RBI Account Aggregator (AA)** legal framework regulated under Master Direction NBFC-AA 2016:\n\n1. **100% Read-Only**: FINVEXA CANNOT withdraw, transfer, or move even ₹1 from your account.\n2. **No Credentials**: We never ask for or store your NetBanking password, debit card PIN, or UPI PIN.\n3. **Instant Revocation**: You can terminate your consent anytime in 1 click from your Profile page.`
      } else {
        reply = `Based on your ${personaData.label} profile (Safe in Bank: ₹${personaData.balance.toLocaleString('en-IN')}, Untouchable Locked: ₹${personaData.lockedReserves.toLocaleString('en-IN')}):\n\n• For unexpected charges, verify your recent bank statement or ask me about SMS/maintenance fees.\n• For failed UPI transactions, check your 12-digit UTR number and claim ₹100/day delay compensation.\n• To evaluate upcoming purchases safely, check the Before-You-Spend Simulator and 3 Easy Fixes tabs!`
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
      setIsLoading(false)
    }, 450)
  }

  return (
    <Tilt3DCard
      className={`glass-card rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200' : 'border-slate-800'
      }`}
      style={{
        boxShadow: !isLight ? `0 10px 40px -10px ${theme.primaryHex}20` : undefined,
      }}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ background: theme.buttonGradient }}
          >
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                FINVEXA AI Bank & Account Assistant
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live 24/7
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant Plain-English answers to bank deductions, UPI disputes, e-mandates & RBI rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>RBI AA Grounded · Zero Jargon</span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div
        className={`px-4 py-2.5 border-b overflow-x-auto no-scrollbar flex items-center gap-2 ${
          isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
          <HelpCircle size={13} className="text-blue-500" />
          <span>Quick Ask:</span>
        </div>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border shrink-0 ${
              isLight
                ? 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200 hover:border-blue-300 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-500'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="p-4 sm:p-5 h-80 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-white'
              }`}
              style={msg.sender === 'assistant' ? { background: theme.buttonGradient } : undefined}
            >
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : isLight
                  ? 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800 shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-500"
                    title="Copy answer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ background: theme.buttonGradient }}
            >
              <Bot size={13} />
            </div>
            <div
              className={`rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2 ${
                isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-900 border border-slate-800'
              }`}
            >
              <RefreshCw size={13} className="text-blue-500 animate-spin" />
              <span className="text-slate-400">Consulting Gemini & RBI Regulations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div
        className={`p-3 sm:p-4 border-t ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}
      >
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about bank charges, failed UPI, e-mandates, or zero-cost EMIs..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
              isLight
                ? 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                : 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50 shadow-md"
            style={{ background: theme.buttonGradient }}
          >
            <span>Ask AI</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </Tilt3DCard>
  )
}
