// src/components/GlobalTopControls.tsx
import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, Globe } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Language } from '../i18n/translations'

interface LangItem {
  code: Language
  label: string
  flag: string
  title: string
}

const LANGUAGES: LangItem[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧', title: 'English' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳', title: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳', title: 'Kannada' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', title: 'Hindi' },
]

export default function GlobalTopControls() {
  const { themeMode, toggleThemeMode, lang: contextLang, setLang } = useApp()

  // Track active theme locally and in sync with documentElement
  const [isLight, setIsLight] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('finvexa_theme') || localStorage.getItem('finvexa_theme_mode')
      if (saved) return saved === 'light'
      return document.documentElement.classList.contains('light-mode') || document.documentElement.classList.contains('light')
    } catch {
      return false
    }
  })

  // Synchronize on mount and handle initial class setup
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('finvexa_theme') || localStorage.getItem('finvexa_theme_mode')
      const targetIsLight = savedTheme ? savedTheme === 'light' : themeMode === 'light'
      setIsLight(targetIsLight)
      if (targetIsLight) {
        document.documentElement.classList.add('light-mode', 'light')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.remove('light-mode', 'light')
        document.documentElement.classList.add('dark')
      }
    } catch {
      // ignore
    }
  }, [themeMode])

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    const nextIsLight = !isLight
    setIsLight(nextIsLight)
    const nextThemeStr = nextIsLight ? 'light' : 'dark'

    try {
      if (nextIsLight) {
        document.documentElement.classList.add('light-mode', 'light')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.remove('light-mode', 'light')
        document.documentElement.classList.add('dark')
      }
      localStorage.setItem('finvexa_theme', nextThemeStr)
      localStorage.setItem('finvexa_theme_mode', nextThemeStr)
    } catch {
      // ignore
    }

    if ((themeMode === 'light') !== nextIsLight) {
      toggleThemeMode()
    }
  }

  // Handle Language Switch (Instant Local UI Dictionary + Google Translate Full-Page DOM)
  const handleLanguageChange = useCallback((targetLang: Language) => {
    // 1. Update internal app state for instant translated UI components
    setLang(targetLang)

    // 2. Programmatically configure Google Translate cookies and DOM select
    try {
      const hostname = window.location.hostname
      const path = '/'

      if (targetLang === 'en') {
        // Clear or reset cookie
        document.cookie = `googtrans=/en/en; path=${path};`
        document.cookie = `googtrans=/en/en; path=${path}; domain=${hostname};`
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${hostname};`
      } else {
        document.cookie = `googtrans=/en/${targetLang}; path=${path};`
        document.cookie = `googtrans=/en/${targetLang}; path=${path}; domain=${hostname};`
      }

      // Dispatch change event to Google Translate widget dropdown if rendered
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
      if (combo) {
        combo.value = targetLang
        combo.dispatchEvent(new Event('change'))
      } else {
        // If Google Translate element is still initializing, re-trigger
        const initFn = (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit
        if (typeof initFn === 'function') {
          try {
            initFn()
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('Language translate engine notice:', err)
    }
  }, [setLang])

  return (
    <aside
      aria-label="Global View and Accessibility Controls"
      className="fixed top-2.5 sm:top-3 right-3 sm:right-4 z-[9999] flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-xl border select-none bg-slate-900/90 text-white border-white/20 dark:bg-slate-900/90 dark:text-white dark:border-white/20"
      style={{
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.92)',
        borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)',
        boxShadow: isLight
          ? '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)'
          : '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* 1. Theme Toggle: ☀️ Light / 🌙 Dark */}
      <button
        type="button"
        onClick={handleToggleTheme}
        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs ${
          isLight
            ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
            : 'bg-indigo-500/25 text-indigo-200 hover:bg-indigo-500/40 border border-indigo-500/40'
        }`}
        title={isLight ? 'Switch to Dark Mode (🌙 Dark)' : 'Switch to Light Mode (☀️ Light)'}
        aria-label="Toggle theme mode"
      >
        {isLight ? (
          <>
            <Moon size={14} className="text-indigo-700" />
            <span className="font-extrabold text-[11px] sm:text-xs">🌙 Dark</span>
          </>
        ) : (
          <>
            <Sun size={14} className="text-amber-400" />
            <span className="font-extrabold text-[11px] sm:text-xs">☀️ Light</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div
        className="w-[1px] h-5 transition-colors"
        style={{ backgroundColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)' }}
      />

      {/* 2. Language Switcher Pills: 🇬🇧 EN | 🇮🇳 తెలుగు | 🇮🇳 ಕನ್ನಡ | 🇮🇳 हिन्दी */}
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Select interface language">
        <span
          className="text-[10px] hidden lg:inline-flex items-center gap-0.5 px-1 font-semibold"
          style={{ color: isLight ? '#64748b' : '#94a3b8' }}
        >
          <Globe size={11} />
        </span>

        {LANGUAGES.map(item => {
          const isActive = contextLang === item.code
          return (
            <button
              key={item.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => handleLanguageChange(item.code)}
              title={item.title}
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1 active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50 scale-[1.02]'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              <span className="text-[12px] leading-none">{item.flag}</span>
              <span className="tracking-tight text-[11px] sm:text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
