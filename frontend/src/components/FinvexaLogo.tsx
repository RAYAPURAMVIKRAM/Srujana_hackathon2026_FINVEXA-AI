interface FinvexaLogoProps {
  size?: number
  showWordmark?: boolean
  showText?: boolean
  showSubtitle?: boolean
  animated?: boolean
  className?: string
  themeMode?: 'light' | 'dark'
}

export default function FinvexaLogo({
  size = 48,
  showWordmark = false,
  showText,
  showSubtitle = false,
  animated = true,
  className = '',
  themeMode = 'dark',
}: FinvexaLogoProps) {
  const isLight = themeMode === 'light'
  const displayWordmark = showText !== undefined ? showText : showWordmark

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className={`relative flex items-center justify-center ${
          animated ? 'animate-float' : ''
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* Ambient Glow behind the logo */}
        <div
          className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-700 pointer-events-none ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(37, 99, 235, 0.35) 50%, rgba(124, 58, 237, 0.2) 100%)',
            transform: 'scale(1.25)',
          }}
        />

        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="relative z-10 drop-shadow-lg overflow-visible"
        >
          <defs>
            {/* Outer Diamond-Shield Gradient */}
            <linearGradient id="finvexaShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />   {/* Royal Blue */}
              <stop offset="50%" stopColor="#10B981" />  {/* Emerald Green */}
              <stop offset="100%" stopColor="#7C3AED" /> {/* Electric Indigo */}
            </linearGradient>

            {/* Inner Glowing Pulse Gradient */}
            <linearGradient id="finvexaPulseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Star Glow Filter */}
            <filter id="finvexaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Diamond-Shield Plate */}
          <path
            d="M 50 6 L 88 32 L 76 82 L 50 94 L 24 82 L 12 32 Z"
            fill={isLight ? '#FFFFFF' : '#0B1120'}
            stroke="url(#finvexaShieldGrad)"
            strokeWidth="3.2"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />

          {/* Subtle Inner Accent Border */}
          <path
            d="M 50 14 L 80 35 L 70 76 L 50 86 L 30 76 L 20 35 Z"
            fill="none"
            stroke="url(#finvexaShieldGrad)"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="2 3"
          />

          {/* Animated Rising Financial Pulse Line -> Arrow */}
          <path
            d="M 28 62 L 38 62 L 44 48 L 52 70 L 60 38 L 72 38"
            fill="none"
            stroke="url(#finvexaPulseGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              animated
                ? {
                    strokeDasharray: 120,
                    strokeDashoffset: 0,
                    animation: 'pulseDraw 2.4s ease-in-out infinite',
                  }
                : undefined
            }
          />

          {/* Upward Growth Arrow Head at the end of the pulse */}
          <path
            d="M 68 44 L 73 38 L 68 33"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing 4-Point AI Star at Peak */}
          <g transform="translate(73, 26)" filter="url(#finvexaGlow)">
            <path
              d="M 0 -8 Q 1.5 -1.5 8 0 Q 1.5 1.5 0 8 Q -1.5 1.5 -8 0 Q -1.5 -1.5 0 -8 Z"
              fill="#FBBF24"
              className={animated ? 'animate-spin-slow' : ''}
              style={{ transformOrigin: '0 0' }}
            />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Optional Wordmark */}
      {displayWordmark && (
        <div className="mt-3 text-center animate-fade-in">
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            FINVEXA
          </div>
          {showSubtitle && (
            <div
              className={`text-xs sm:text-sm font-medium mt-1 tracking-wide ${
                isLight ? 'text-slate-600' : 'text-emerald-400'
              }`}
            >
              Smart Money Decisions Before You Spend
            </div>
          )}
        </div>
      )}

      {/* SVG Animation Styles */}
      <style>{`
        @keyframes pulseDraw {
          0% {
            stroke-dashoffset: 120;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -120;
            opacity: 0.8;
          }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
