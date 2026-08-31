import { memo, useRef, useState, useCallback, useEffect } from 'react'
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
function AboutImageLens() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const depthImgRef = useRef<HTMLImageElement>(null)
  const lensRingRef = useRef<HTMLDivElement>(null)
  
  const [isHovered, setIsHovered] = useState(false)
  const isHoveredRef = useRef(false)

  // Tracking refs for rAF loop
  const mousePosRef = useRef({ x: 0, y: 0 })
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
    if (!tiltRef.current || !depthImgRef.current || !lensRingRef.current) return

    // Interpolate tilt (lerp factor: 0.15)
    currentTiltRef.current.rx += (targetTiltRef.current.rx - currentTiltRef.current.rx) * 0.15
    currentTiltRef.current.ry += (targetTiltRef.current.ry - currentTiltRef.current.ry) * 0.15

    const { rx, ry } = currentTiltRef.current
    const { x, y } = mousePosRef.current
    const hovered = isHoveredRef.current
    const radius = window.innerWidth < 640 ? 100 : 140

    // Direct DOM style updates (zero React re-renders during movement)
    tiltRef.current.style.transform = hovered
      ? `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

    depthImgRef.current.style.clipPath = hovered
      ? `circle(${radius}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`
      : `circle(0px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`

    depthImgRef.current.style.opacity = hovered ? '1' : '0'

    lensRingRef.current.style.left = `${x.toFixed(1)}px`
    lensRingRef.current.style.top = `${y.toFixed(1)}px`
    lensRingRef.current.style.opacity = hovered ? '1' : '0'

    if (hovered || Math.abs(rx) > 0.01 || Math.abs(ry) > 0.01) {
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
    isHoveredRef.current = true
    setIsHovered(true)
    startLoop()
  }, [startLoop])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    setIsHovered(false)
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
    setIsHovered(true)
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
      data-cursor="hover"
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair group select-none"
      style={{
        maxHeight: '650px',
        borderRadius: '20px',
        perspective: '1000px',
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

        {/* Revealed Depth Layer Image: about1.png */}
        <img
          ref={depthImgRef}
          src={aboutImg1}
          alt="About Abhinav Depth Layer"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain max-h-[650px] block pointer-events-none"
          style={{
            opacity: 0,
            clipPath: 'circle(0px at 0px 0px)',
            transition: 'opacity 0.25s ease-out, clip-path 0.05s ease-out',
            willChange: 'clip-path, opacity',
          }}
        />

        {/* Lens Spotlight Ring & Reticle */}
        <div
          ref={lensRingRef}
          className="absolute pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255, 40, 40, 0.75)',
            boxShadow: '0 0 30px rgba(255, 34, 34, 0.45), inset 0 0 20px rgba(255, 34, 34, 0.2)',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            willChange: 'left, top, opacity',
          }}
        >
          {/* Subtle Precision Target Reticle */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
            <div className="w-3.5 h-[1px] bg-red-500 absolute" />
            <div className="h-3.5 w-[1px] bg-red-500 absolute" />
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div
          className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-2 pointer-events-none transition-all duration-300"
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            backdropFilter: 'blur(10px)',
            border: isHovered ? '1px solid rgba(255, 34, 34, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isHovered ? '#FF3333' : 'rgba(255, 255, 255, 0.65)',
            boxShadow: isHovered ? '0 0 15px rgba(255, 34, 34, 0.25)' : 'none',
          }}
        >
          <span
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: isHovered ? '#FF3333' : 'rgba(255, 255, 255, 0.4)',
              boxShadow: isHovered ? '0 0 8px #FF3333' : 'none',
            }}
          />
          {isHovered ? 'DEPTH REVEAL' : 'HOVER FOR DEPTH'}
        </div>
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
                  className="glass-card p-6 transition-all duration-300 hover:border-red-500/30 hover:-translate-y-1"
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

