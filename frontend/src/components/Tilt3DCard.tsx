// src/components/Tilt3DCard.tsx
import React, { useRef, useState, useCallback } from 'react'

interface Tilt3DCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glareOpacity?: number
  maxTilt?: number
  scale?: number
  onClick?: () => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
}

export default function Tilt3DCard({
  children,
  className = '',
  style = {},
  glareOpacity = 0.18,
  maxTilt = 7,
  scale = 1.02,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>('')
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = -((y - centerY) / centerY) * maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) scale3d(${scale}, ${scale}, ${scale})`
      )

      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: glareOpacity,
      })
    },
    [maxTilt, scale, glareOpacity]
  )

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlarePos(prev => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative rounded-2xl transition-all duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Dynamic 3D Glare Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 75%)`,
        }}
      />
      {children}
    </div>
  )
}
