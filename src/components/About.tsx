import { memo, useRef, useCallback, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import aboutImg from '../assets/about.png'
import aboutImg1 from '../assets/about1.png'

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const fadeUp = (delay: number) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: EASE } },
})

const stats = [
  { label: 'Location',     value: 'Coimbatore, India',    icon: '◎' },
  { label: 'Availability', value: 'Open to Opportunities', icon: '◉' },
  { label: 'Projects',     value: '4',                    icon: '◆' },
  { label: 'Status',       value: 'Fresher',               icon: '◈' },
]

/**
 * High-Performance Interactive Image Lens Component
 * - Preloads about1.png on mount to eliminate image decode delay.
 * - Uses requestAnimationFrame (rAF) with lerp for silky 120fps tracking.
 * - Updates DOM styles directly to avoid React re-renders during mouse motion.
 * - Supports responsive lens scaling and mobile touch gestures.
 */
/**
 * Procedural 90% Circular Organic Portal Path Generator
 * Generates an organic, nearly circular (~90% circular) silhouette
 * with subtle 10% undulating fluid waves and smooth quadratic curves.
 */
function createWavyStarPath(
  cx: number,
  cy: number,
  baseRadius: number,
  time: number
): string {
  if (baseRadius <= 0) return ''

  const pointsCount = 48 // Dense point sampling for pure bezier curves
  const points: { x: number; y: number }[] = []

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2

    // 90% circular base + subtle 10% organic portal ripples
    const wave1 = Math.cos(angle * 4 + time * 0.5) * (baseRadius * 0.05)
    const wave2 = Math.sin(angle * 6 - time * 0.4) * (baseRadius * 0.03)
    const wave3 = Math.cos(angle * 8 + time * 0.3) * (baseRadius * 0.02)

    const r = Math.max(25, baseRadius + wave1 + wave2 + wave3)

    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    })
  }

  // Smooth quadratic bezier spline connecting points into a seamless curved silhouette
  let d = ''
  const len = points.length
  const firstMidX = (points[len - 1].x + points[0].x) / 2
  const firstMidY = (points[len - 1].y + points[0].y) / 2
  d += `M ${firstMidX.toFixed(1)} ${firstMidY.toFixed(1)} `

  for (let i = 0; i < len; i++) {
    const curr = points[i]
    const next = points[(i + 1) % len]
    const midX = (curr.x + next.x) / 2
    const midY = (curr.y + next.y) / 2
    d += `Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)} `
  }

  d += 'Z'
  return d
}

function AboutImageLens() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  
  // SVG Wavy Star element ref for direct 120fps GPU manipulation
  const wavyStarRef = useRef<SVGPathElement>(null)
  const portalGroupRef = useRef<SVGGElement>(null)

  const isHoveredRef = useRef(false)

  // Tracking refs for rAF loop (with smooth lerp pointer physics)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const smoothMousePosRef = useRef({ x: 0, y: 0 })
  const targetTiltRef = useRef({ rx: 0, ry: 0 })
  const currentTiltRef = useRef({ rx: 0, ry: 0 })
  const rafIdRef = useRef<number | null>(null)

  // Preload about1.png image asset immediately on mount
  useEffect(() => {
    const img = new Image()
    img.src = aboutImg1
  }, [])

  // Smooth rAF render loop
  const updateLoop = useCallback(() => {
    if (!tiltRef.current) return

    // Interpolate tilt (lerp factor: 0.12)
    currentTiltRef.current.rx += (targetTiltRef.current.rx - currentTiltRef.current.rx) * 0.12
    currentTiltRef.current.ry += (targetTiltRef.current.ry - currentTiltRef.current.ry) * 0.12

    // Smooth lerp for pointer coordinates (silky fluid inertia)
    smoothMousePosRef.current.x += (mousePosRef.current.x - smoothMousePosRef.current.x) * 0.18
    smoothMousePosRef.current.y += (mousePosRef.current.y - smoothMousePosRef.current.y) * 0.18

    const { rx, ry } = currentTiltRef.current
    const { x, y } = smoothMousePosRef.current
    const hovered = isHoveredRef.current
    const baseRadius = hovered
      ? (window.innerWidth < 640 ? 110 : 160)
      : 0
    const time = performance.now() * 0.001

    // Direct DOM style updates (zero React re-renders during movement)
    tiltRef.current.style.transform = hovered
      ? `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

    if (portalGroupRef.current) {
      portalGroupRef.current.style.opacity = hovered ? '1' : '0'
    }

    // Procedural 6-Corner Wavy Star path (slow, pure curves, no straight lines)
    if (hovered && wavyStarRef.current) {
      const starPathD = createWavyStarPath(x, y, baseRadius, time)
      wavyStarRef.current.setAttribute('d', starPathD)
    }

    const distMouse = Math.hypot(
      mousePosRef.current.x - smoothMousePosRef.current.x,
      mousePosRef.current.y - smoothMousePosRef.current.y
    )

    if (hovered || Math.abs(rx) > 0.01 || Math.abs(ry) > 0.01 || distMouse > 0.5) {
      rafIdRef.current = requestAnimationFrame(updateLoop)
    } else {
      rafIdRef.current = null
    }
  }, [])

  const startLoop = useCallback(() => {
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(updateLoop)
    }
  }, [updateLoop])

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage (-0.5 to 0.5) for tilt
    const px = (x / rect.width) - 0.5
    const py = (y / rect.height) - 0.5

    mousePosRef.current = { x, y }
    targetTiltRef.current = { rx: -py * 10, ry: px * 10 }

    startLoop()
  }, [startLoop])

  const handleMouseEnter = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    mousePosRef.current = { x, y }
    smoothMousePosRef.current = { x, y }
    isHoveredRef.current = true
    startLoop()
  }, [startLoop])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    targetTiltRef.current = { rx: 0, ry: 0 }
    startLoop()
  }, [startLoop])

  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    mousePosRef.current = { x, y }
    isHoveredRef.current = true
    startLoop()
  }, [startLoop])

  // Clean up rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      data-cursor="none"
      className="relative w-full h-full flex items-center justify-center overflow-hidden group select-none"
      style={{
        maxHeight: '650px',
        borderRadius: '20px',
        perspective: '1000px',
        cursor: 'none',
      }}
    >
      {/* 3D Tilt Wrapper */}
      <div
        ref={tiltRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      >
        {/* Base Layer Image: about.png */}
        <img
          src={aboutImg}
          alt="About Abhinav"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain max-h-[650px] block pointer-events-none"
        />

        {/* Authentic React Bits Glass Reveal Portal Effect */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <defs>
            {/* React Bits Frosted Glass Stipple Dispersion Filter */}
            <filter id="glassRevealNoise" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.075 0.14" numOctaves="4" result="frostedNoise" seed="42" />
              <feDisplacementMap in="SourceGraphic" in2="frostedNoise" scale="28" xChannelSelector="R" yChannelSelector="G" result="glassDisplaced" />
              <feGaussianBlur in="glassDisplaced" stdDeviation="1.5" />
            </filter>

            {/* Subtle frosted glass mask for smooth translucent transition */}
            <mask id="glassPortalMask" maskUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
              <rect x="-50%" y="-50%" width="200%" height="200%" fill="black" />
              <path
                ref={wavyStarRef}
                d=""
                fill="white"
                filter="url(#glassRevealNoise)"
              />
            </mask>

            {/* Micro Chromatic Dispersion Channel Filters for Organic Glass Refraction */}
            <filter id="glassDispersionRed" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="
                1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0" />
            </filter>
            <filter id="glassDispersionCyan" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="
                0 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0" />
            </filter>
          </defs>

          <g ref={portalGroupRef} style={{ opacity: 0, transition: 'opacity 0.25s ease-out' }}>
            {/* Subtle Red Refraction Edge (-2px, -1px offset) */}
            <image
              href={aboutImg1}
              xlinkHref={aboutImg1}
              x="-2"
              y="-1"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              mask="url(#glassPortalMask)"
              filter="url(#glassDispersionRed)"
              style={{ mixBlendMode: 'screen', opacity: 0.35 }}
            />

            {/* Subtle Cyan Refraction Edge (+2px, +1px offset) */}
            <image
              href={aboutImg1}
              xlinkHref={aboutImg1}
              x="2"
              y="1"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              mask="url(#glassPortalMask)"
              filter="url(#glassDispersionCyan)"
              style={{ mixBlendMode: 'screen', opacity: 0.35 }}
            />

            {/* Main True Color Glass Portal Reveal */}
            <image
              href={aboutImg1}
              xlinkHref={aboutImg1}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              mask="url(#glassPortalMask)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center"
      style={{
        backgroundColor: '#080808',
        zIndex:          20,
        paddingTop:      '80px',
        paddingBottom:   '80px',
      }}
    >
      <div className="relative w-full max-w-[1400px] mx-auto" style={{ zIndex: 1, paddingLeft: 'clamp(10px, 1.5vw, 24px)', paddingRight: 'clamp(10px, 1.5vw, 24px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-center">

          {/* LEFT (40%) — Dedicated About Image Container with Optimized Depth Lens */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="w-full flex items-center justify-center"
            style={{
              maxHeight: '650px',
              borderRadius: '20px',
            }}
          >
            <AboutImageLens />
          </motion.div>

          {/* RIGHT (60%) — Content & Typography */}
          <div className="flex flex-col gap-10">

            {/* Header: Section Label + ABOUT Display Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <div className="section-label" style={{ marginBottom: '16px' }}>
                Who I Am
              </div>
              <h2
                className="font-clash text-primary"
                style={{
                  fontSize:      'clamp(48px, 7vw, 90px)',
                  letterSpacing: '-0.03em',
                  lineHeight:    0.95,
                  color:         'var(--primary)',
                }}
              >
                ABOUT
              </h2>
              <div
                style={{
                  width:        '48px',
                  height:       '2px',
                  background:   'var(--accent)',
                  marginTop:    '24px',
                  borderRadius: '2px',
                }}
              />
            </motion.div>

            {/* Description Paragraph */}
            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              style={{
                color:      'var(--secondary)',
                fontSize:   '18px',
                lineHeight: 1.85,
                maxWidth:   '620px',
              }}
            >
              I'm a developer passionate about Software Development, UI/UX Designing, Fullstack Engineering, and AI.
              I work at the intersection of clean system architecture, intuitive design, and intelligent AI models —
              creating scalable products that solve real-world problems and deliver great user experiences.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              variants={fadeUp(0.35)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 gap-4"
              style={{ maxWidth: '500px' }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass-card p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1"
                  style={{ borderRadius: '14px', textAlign: 'center' }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span style={{ color: 'var(--accent)', fontSize: '16px' }}>{stat.icon}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <div className="stat-value" style={{ fontSize: stat.label === 'Location' ? '16px' : '22px' }}>{stat.value}</div>
                </div>
              ))}
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default memo(About)

