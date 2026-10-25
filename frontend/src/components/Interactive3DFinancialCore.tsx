// src/components/Interactive3DFinancialCore.tsx
import { useEffect, useRef, useState } from 'react'

interface Interactive3DFinancialCoreProps {
  shortage?: number
  size?: number
  label?: string
  className?: string
}

export default function Interactive3DFinancialCore({
  shortage = 0,
  size = 280,
  label = 'FINVEXA 3D HOLOGRAPHIC CORE',
  className = '',
}: Interactive3DFinancialCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const rotationAngles = useRef({ x: 0.35, y: 0.5 })
  const [isInteracting, setIsInteracting] = useState(false)

  // Determine dynamic risk mode
  const riskMode: 'safe' | 'warning' | 'critical' =
    shortage === 0 ? 'safe' : shortage < 20000 ? 'warning' : 'critical'

  const colorConfig = {
    safe: {
      primary: '#10b981',
      secondary: '#059669',
      glow: 'rgba(16, 185, 129, 0.45)',
      speed: 0.012,
      statusText: 'SHIELD HEALTHY (0 DEFICIT)',
    },
    warning: {
      primary: '#f59e0b',
      secondary: '#d97706',
      glow: 'rgba(245, 158, 11, 0.55)',
      speed: 0.022,
      statusText: `MONEY SQUEEZE (-₹${shortage.toLocaleString('en-IN')})`,
    },
    critical: {
      primary: '#ef4444',
      secondary: '#dc2626',
      glow: 'rgba(239, 68, 68, 0.70)',
      speed: 0.038,
      statusText: `HIGH DEFICIT ALERT (-₹${shortage.toLocaleString('en-IN')})`,
    },
  }[riskMode]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let autoAngle = 0

    // Particle nodes for orbital rings
    const particles: Array<{ ring: number; angle: number; size: number }> = []
    for (let i = 0; i < 36; i++) {
      particles.push({
        ring: i % 3,
        angle: (i / 12) * Math.PI * 2,
        size: 1.5 + (i % 3),
      })
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const width = size
      const height = size
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      ctx.clearRect(0, 0, width, height)

      // Auto rotation when not dragging
      if (!isDraggingRef.current) {
        autoAngle += colorConfig.speed
        rotationAngles.current.y += colorConfig.speed * 0.4
      }

      const cx = width / 2
      const cy = height / 2
      const radius = size * 0.38

      const rotX = rotationAngles.current.x
      const rotY = rotationAngles.current.y

      // Helper: 3D point rotation and projection
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        // Rotate around X
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        // Perspective division
        const fov = 350
        const scale = fov / (fov + z2)
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale,
          z: z2,
        }
      }

      // Outer ambient glow
      const radialGlow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.3)
      radialGlow.addColorStop(0, colorConfig.glow)
      radialGlow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = radialGlow
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2)
      ctx.fill()

      // 1. Draw 3 concentric 3D Gyroscope Rings
      const ringConfigs = [
        { r: radius, tilt: 0, segments: 60, width: 2, alpha: 0.8 },
        { r: radius * 0.78, tilt: Math.PI / 3, segments: 48, width: 1.8, alpha: 0.65 },
        { r: radius * 0.56, tilt: -Math.PI / 3, segments: 40, width: 1.5, alpha: 0.5 },
      ]

      ringConfigs.forEach((rc, ringIdx) => {
        ctx.beginPath()
        ctx.strokeStyle = colorConfig.primary
        ctx.lineWidth = rc.width
        ctx.globalAlpha = rc.alpha

        for (let i = 0; i <= rc.segments; i++) {
          const theta = (i / rc.segments) * Math.PI * 2 + (ringIdx * 0.5 + autoAngle)
          // Ring plane tilting
          const rawX = rc.r * Math.cos(theta)
          const rawY = rc.r * Math.sin(theta) * Math.cos(rc.tilt)
          const rawZ = rc.r * Math.sin(theta) * Math.sin(rc.tilt)

          const pt = project(rawX, rawY, rawZ)
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()
      })

      // 2. Draw Orbiting Energy Particles
      particles.forEach(p => {
        p.angle += colorConfig.speed * (p.ring === 0 ? 1 : p.ring === 1 ? -1.3 : 1.7)
        const rc = ringConfigs[p.ring]
        const rawX = rc.r * Math.cos(p.angle)
        const rawY = rc.r * Math.sin(p.angle) * Math.cos(rc.tilt)
        const rawZ = rc.r * Math.sin(p.angle) * Math.sin(rc.tilt)

        const pt = project(rawX, rawY, rawZ)
        ctx.beginPath()
        ctx.globalAlpha = Math.max(0.2, (pt.z + 200) / 400)
        ctx.fillStyle = '#ffffff'
        ctx.arc(pt.x, pt.y, p.size * pt.scale, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Central 3D Floating Shield / Rupee Core
      ctx.globalAlpha = 1
      const coreZ = 15 * Math.sin(autoAngle * 2)
      const centerPt = project(0, 0, coreZ)

      // Hexagonal Shield Backing
      ctx.save()
      ctx.translate(centerPt.x, centerPt.y)
      ctx.scale(centerPt.scale, centerPt.scale)

      const shieldPoints = [
        { x: 0, y: -24 },
        { x: 22, y: -12 },
        { x: 18, y: 14 },
        { x: 0, y: 26 },
        { x: -18, y: 14 },
        { x: -22, y: -12 },
      ]

      ctx.beginPath()
      shieldPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      })
      ctx.closePath()

      // Shield fill gradient
      const shieldGrad = ctx.createLinearGradient(0, -24, 0, 26)
      shieldGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      shieldGrad.addColorStop(1, colorConfig.secondary)
      ctx.fillStyle = shieldGrad
      ctx.fill()

      // Shield border
      ctx.strokeStyle = colorConfig.primary
      ctx.lineWidth = 2.5
      ctx.shadowColor = colorConfig.primary
      ctx.shadowBlur = 15
      ctx.stroke()
      ctx.shadowBlur = 0

      // Glowing ₹ Rupee Symbol
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₹', 0, 1)

      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [shortage, size, colorConfig])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    setIsInteracting(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    rotationAngles.current.y += dx * 0.015
    rotationAngles.current.x += dy * 0.015
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    setIsInteracting(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true
      setIsInteracting(true)
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - lastMousePos.current.x
    const dy = e.touches[0].clientY - lastMousePos.current.y
    rotationAngles.current.y += dx * 0.015
    rotationAngles.current.x += dy * 0.015
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
    setIsInteracting(false)
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative cursor-grab active:cursor-grabbing transition-transform duration-200 touch-none"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <canvas
          ref={canvasRef}
          style={{ width: `${size}px`, height: `${size}px`, touchAction: 'none' }}
          className="rounded-full drop-shadow-2xl touch-none"
        />

        {/* Drag Hint Overlay */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider transition-opacity duration-300 pointer-events-none backdrop-blur-md ${
            isInteracting
              ? 'bg-white/20 text-white opacity-100'
              : 'bg-black/40 text-slate-400 opacity-60 hover:opacity-100'
          }`}
        >
          {isInteracting ? '🔄 Rotating 3D Core' : '👆 Drag or Touch to Spin'}
        </div>
      </div>

      {/* Real-time Status Badge */}
      <div className="mt-2 text-center">
        <div
          className="text-[11px] font-bold font-mono tracking-wider px-3 py-1 rounded-full inline-block border backdrop-blur-md"
          style={{
            color: colorConfig.primary,
            borderColor: `${colorConfig.primary}40`,
            background: `${colorConfig.primary}15`,
            boxShadow: `0 0 15px ${colorConfig.primary}25`,
          }}
        >
          {colorConfig.statusText}
        </div>
        <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">
          {label}
        </div>
      </div>
    </div>
  )
}
