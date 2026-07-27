import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Crimson Blade Cursor Component
 * 
 * Specs:
 * - Native browser cursor completely hidden on non-touch desktop devices.
 * - Motion-Revealed Blade: Custom Matte Crimson Red (#B22222) SVG samurai blade tip (20px).
 * - Invisible when stationary: Fades out completely to 0 opacity over 120ms when mouse movement stops.
 * - Movement: Zero-lag 1:1 position tracking, directional rotation interpolation along movement vector.
 * - Air Trail: 10-16px low-opacity crimson trail fading within 120ms on a GPU canvas overlay.
 * - Hover Effects:
 *   - Blade scales +15% (scale 1.15) and brightens (#FF2222).
 *   - Micro-idle ±3° sine wave rotation oscillation.
 *   - Hovered elements lift 3px (translate3d(0, -3px, 0)).
 * - Click Effect:
 *   - Blade extends 18px -> 30px -> 18px in 120ms.
 *   - Instant directional crimson slash line flash (<100ms).
 *   - No particles, sparks, or smoke.
 * - Fallbacks: Touch devices & prefers-reduced-motion restore native browser cursor.
 */

interface TrailSegment {
  x: number
  y: number
  time: number
  angle: number
}

interface ClickSlash {
  x: number
  y: number
  angle: number
  time: number
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)

  // DOM refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bladeRef  = useRef<HTMLDivElement | null>(null)
  const pathRef   = useRef<SVGPathElement | null>(null)

  // Motion tracking refs
  const mousePos      = useRef({ x: -100, y: -100 })
  const lastMousePos  = useRef({ x: -100, y: -100 })
  const lastMoveTime  = useRef(0)
  const isMoving      = useRef(false)
  const isFading      = useRef(false)

  // Rotation & scale refs
  const currentAngle  = useRef(0)
  const targetAngle   = useRef(0)
  const isHovering    = useRef(false)
  const currentHoveredEl = useRef<HTMLElement | null>(null)

  // Trail & slash data pools
  const trailSegments = useRef<TrailSegment[]>([])
  const clickSlashes   = useRef<ClickSlash[]>([])

  /* ── Check Touch / Mobile / Reduced Motion ──────────────── */
  useEffect(() => {
    const checkEligibility = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches ||
                      window.matchMedia('(hover: none)').matches ||
                      ('ontouchstart' in window)
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const isEligible = !isTouch && !isReducedMotion
      setEnabled(isEligible)

      if (isEligible) {
        document.documentElement.classList.add('has-custom-cursor')
      } else {
        document.documentElement.classList.remove('has-custom-cursor')
      }
    }

    checkEligibility()

    const mediaQueryTouch  = window.matchMedia('(pointer: coarse)')
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    mediaQueryTouch.addEventListener('change', checkEligibility)
    mediaQueryMotion.addEventListener('change', checkEligibility)

    return () => {
      mediaQueryTouch.removeEventListener('change', checkEligibility)
      mediaQueryMotion.removeEventListener('change', checkEligibility)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  /* ── Main Motion & Animation Loop ────────────────────── */
  useEffect(() => {
    if (!enabled) return

    const canvas  = canvasRef.current
    const bladeEl = bladeRef.current
    const pathEl  = pathRef.current
    if (!canvas || !bladeEl || !pathEl) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initial offscreen placement & hidden opacity
    gsap.set(bladeEl, { xPercent: -50, yPercent: -15, opacity: 0 })

    /* ── Mouse move handler: zero-lag position & motion reveal ── */
    const onMouseMove = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY
      const now = performance.now()

      mousePos.current = { x: mx, y: my }
      lastMoveTime.current = now

      // Zero-lag position update
      gsap.set(bladeEl, { x: mx, y: my })

      const dx = mx - lastMousePos.current.x
      const dy = my - lastMousePos.current.y
      const dist = Math.hypot(dx, dy)

      if (dist > 1.5) {
        // Calculate direction angle
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        targetAngle.current = angle

        // Reveal blade cursor immediately on motion
        if (!isMoving.current) {
          isMoving.current = true
          isFading.current = false
          gsap.killTweensOf(bladeEl, 'opacity')
          gsap.set(bladeEl, { opacity: 1 })
        }

        // Push segment to air trail pool
        trailSegments.current.push({
          x: mx,
          y: my,
          time: now,
          angle: angle,
        })

        lastMousePos.current = { x: mx, y: my }
      }
    }

    /* ── Mouse click handler: 18px -> 30px extension & directional slash line ── */
    const onMouseDown = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY

      // Reveal blade if stationary click occurs
      isMoving.current = true
      isFading.current = false
      gsap.killTweensOf(bladeEl, 'opacity')
      gsap.set(bladeEl, { opacity: 1 })

      // Push directional click slash
      clickSlashes.current.push({
        x: mx,
        y: my,
        angle: currentAngle.current,
        time: performance.now(),
      })

      // Blade length extension: 18px -> 30px (1.5x scaleY) -> 18px over 120ms
      gsap.killTweensOf(bladeEl, 'scaleY')
      gsap.timeline()
        .to(bladeEl, { scaleY: 1.5, duration: 0.06, ease: 'power2.out' })
        .to(bladeEl, { scaleY: isHovering.current ? 1.15 : 1.0, duration: 0.06, ease: 'power2.out' })
    }

    /* ── Interactive element hover response ── */
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const interactiveTarget = target.closest<HTMLElement>(
        'a, button, input, select, textarea, [role="button"], .btn, .nav-link, .glass-card, .skill-card, .hobby-card, .tech-chip, [data-cursor="hover"], [data-cursor="project"]'
      )

      if (interactiveTarget) {
        if (currentHoveredEl.current !== interactiveTarget) {
          if (currentHoveredEl.current) {
            currentHoveredEl.current.style.transform = ''
            currentHoveredEl.current.style.boxShadow = ''
            currentHoveredEl.current.style.transition = ''
          }

          currentHoveredEl.current = interactiveTarget
          isHovering.current = true

          // Hover element 3px lift
          interactiveTarget.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          interactiveTarget.style.transform  = 'translate3d(0, -3px, 0)'
          interactiveTarget.style.boxShadow  = '0 10px 24px rgba(0, 0, 0, 0.45), 0 0 1px rgba(178, 34, 34, 0.3)'

          // Blade scale +15% & color brighten
          gsap.to(bladeEl, { scale: 1.15, duration: 0.2, ease: 'power2.out' })
          if (pathEl) pathEl.setAttribute('fill', '#FF2222')
        }
      } else {
        if (currentHoveredEl.current) {
          currentHoveredEl.current.style.transform = ''
          currentHoveredEl.current.style.boxShadow = ''
          currentHoveredEl.current.style.transition = ''
          currentHoveredEl.current = null
        }
        isHovering.current = false
        gsap.to(bladeEl, { scale: 1.0, duration: 0.2, ease: 'power2.out' })
        if (pathEl) pathEl.setAttribute('fill', '#B22222')
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (!related || !currentHoveredEl.current?.contains(related)) {
        if (currentHoveredEl.current) {
          currentHoveredEl.current.style.transform = ''
          currentHoveredEl.current.style.boxShadow = ''
          currentHoveredEl.current.style.transition = ''
          currentHoveredEl.current = null
        }
        isHovering.current = false
        gsap.to(bladeEl, { scale: 1.0, duration: 0.2, ease: 'power2.out' })
        if (pathEl) pathEl.setAttribute('fill', '#B22222')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mouseout', onMouseOut, { passive: true })

    /* ── GSAP Ticker: Rotation lerp, idle fade-out, air trail & click slash ── */
    const tick = () => {
      const now = performance.now()

      // Motion stop detection: if no movement for > 40ms, start 120ms fade-out
      if (now - lastMoveTime.current > 40 && isMoving.current && !isFading.current) {
        isFading.current = true
        gsap.to(bladeEl, {
          opacity: 0,
          duration: 0.12, // 120ms fade-out
          ease: 'power2.out',
          onComplete: () => {
            isMoving.current = false
            isFading.current = false
          },
        })
      }

      // Smooth rotation interpolation
      currentAngle.current += (targetAngle.current - currentAngle.current) * 0.35

      // Add subtle ±3° idle rotation oscillation when hovering
      const idleOscillation = isHovering.current ? Math.sin(now * 0.008) * 3 : 0
      gsap.set(bladeEl, { rotation: currentAngle.current + idleOscillation })

      /* ── Canvas Rendering ── */
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 1. Air Trail (10-16px long, 120ms lifespan)
      const TRAIL_LIFESPAN = 120 // ms
      trailSegments.current = trailSegments.current.filter(s => now - s.time < TRAIL_LIFESPAN)

      const segs = trailSegments.current
      if (segs.length > 1) {
        for (let i = 1; i < segs.length; i++) {
          const s1 = segs[i - 1]
          const s2 = segs[i]
          const ageRatio = 1 - (now - s2.time) / TRAIL_LIFESPAN

          if (ageRatio <= 0) continue

          ctx.beginPath()
          ctx.moveTo(s1.x, s1.y)
          ctx.lineTo(s2.x, s2.y)
          ctx.strokeStyle = `rgba(178, 34, 34, ${ageRatio * 0.45})`
          ctx.lineWidth = 1.5
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }

      // 2. Click Directional Crimson Slash (<100ms instant flash)
      const SLASH_LIFESPAN = 90 // ms
      clickSlashes.current = clickSlashes.current.filter(s => now - s.time < SLASH_LIFESPAN)

      clickSlashes.current.forEach(slash => {
        const ageRatio = 1 - (now - slash.time) / SLASH_LIFESPAN
        const rad = (slash.angle - 90) * (Math.PI / 180)

        const startX = slash.x - Math.cos(rad) * 14
        const startY = slash.y - Math.sin(rad) * 14
        const endX   = slash.x + Math.cos(rad) * 14
        const endY   = slash.y + Math.sin(rad) * 14

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(255, 34, 34, ${ageRatio * 0.95})`
        ctx.lineWidth = 2.0
        ctx.lineCap = 'butt'
        ctx.stroke()
      })
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)

      if (currentHoveredEl.current) {
        currentHoveredEl.current.style.transform = ''
        currentHoveredEl.current.style.boxShadow = ''
        currentHoveredEl.current.style.transition = ''
      }
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* 10-16px Crimson Air Trail & Click Slash Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 999997,
        }}
      />

      {/* Crimson Samurai Blade Tip (20px Length x 10px Width, Flat #B22222) */}
      <div
        ref={bladeRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 20,
          pointerEvents: 'none',
          zIndex: 999999,
          transformOrigin: '50% 15%', // Sharp blade tip pivot point
          willChange: 'transform, opacity',
        }}
      >
        <svg
          width="10"
          height="20"
          viewBox="0 0 10 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sharp Samurai Blade Tip Geometry */}
          <path
            ref={pathRef}
            d="M5 0 L10 16 L5 20 L0 16 Z"
            fill="#B22222"
          />
        </svg>
      </div>
    </>
  )
}
