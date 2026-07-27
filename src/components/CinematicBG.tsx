/**
 * HeroCinematic — Seven-layer cinematic parallax background.
 *
 * Layer 01  Sky gradient          0.08× scroll
 * Layer 02  Glowing gradient disc  0.15× + scale 1→1.12 + mouse
 * Layer 03  Far mountains          0.25×
 * Layer 03b Mid mountains          0.30×
 * Layer 04  Fog (2 strips)         0.35× + slow random horizontal drift
 * Layer 07  Foreground grass       1.15× (fastest — exits first)
 * Canvas    Particles              40-55 glowing ash dots
 *
 * Rules: GPU-only (translate3d / scale). Never animate top/left/width/height.
 * Single GSAP ticker drives all DOM layer transforms.
 * Separate rAF loop drives canvas particle system.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useParallaxState } from './ParallaxEngine'

/* ─── particle helpers ─────────────────────────────────────── */
interface Particle {
  x: number; y: number; size: number
  speedX: number; speedY: number
  opacity: number; maxOpacity: number
  life: number; maxLife: number
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: h * (0.55 + Math.random() * 0.45),
    size: Math.random() * 1.4 + 0.2,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: -(Math.random() * 0.38 + 0.1),
    maxOpacity: Math.random() * 0.11 + 0.03,
    opacity: 0,
    life: 0,
    maxLife: Math.random() * 200 + 100,
  }
}

/* ─── component ─────────────────────────────────────────────── */
export default function HeroCinematic() {
  const skyRef      = useRef<HTMLDivElement>(null)
  const discRef     = useRef<HTMLDivElement>(null)
  const mtnFarRef   = useRef<HTMLDivElement>(null)
  const mtnMidRef   = useRef<HTMLDivElement>(null)
  const fogRef      = useRef<HTMLDivElement>(null)
  const fog2Ref     = useRef<HTMLDivElement>(null)
  const grassRef    = useRef<HTMLDivElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const stateRef    = useParallaxState()

  /* ── GSAP ticker — all DOM layer parallax ──────────────────── */
  useEffect(() => {
    let fogX  = 0
    let fog2X = 0
    // Slow random drift speeds (px / frame at 60 FPS)
    let fogSpeed  = 0.06
    let fog2Speed = -0.04

    let vh = window.innerHeight || 1

    const handleResize = () => {
      vh = window.innerHeight || 1
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const tick = () => {
      const sy      = window.scrollY
      const prog    = Math.min(sy / vh, 1)
      const { mouse } = stateRef.current

      /* Layer 01 — Sky (0.04× — barely moves, feels infinity far) */
      if (skyRef.current)
        skyRef.current.style.transform = `translate3d(0,${-sy * 0.04}px,0)`

      /* Layer 02 — Glowing disc (0.06× + scale + mouse parallax) */
      if (discRef.current) {
        const scale = 1 + prog * 0.10
        const mx    = mouse.x * 18
        const my    = -sy * 0.06 + mouse.y * 10
        discRef.current.style.transform = `translate3d(${mx}px,${my}px,0) scale(${scale})`
      }

      /* Layer 03 — Far mountains (0.08× — very slow, feels very distant) */
      if (mtnFarRef.current)
        mtnFarRef.current.style.transform = `translate3d(0,${-sy * 0.08}px,0)`

      /* Layer 03b — Mid mountains (0.12× — slightly faster than far) */
      if (mtnMidRef.current)
        mtnMidRef.current.style.transform = `translate3d(0,${-sy * 0.12}px,0)`

      /* Layer 04 — Fog (0.14× + very slow random horizontal drift) */
      if (Math.random() < 0.003) fogSpeed  = 0.04 + Math.random() * 0.08
      if (Math.random() < 0.003) fog2Speed = -(0.03 + Math.random() * 0.07)
      fogX  += fogSpeed
      fog2X += fog2Speed
      if (fogRef.current)
        fogRef.current.style.transform = `translate3d(${fogX}px,${-sy * 0.14}px,0)`
      if (fog2Ref.current)
        fog2Ref.current.style.transform = `translate3d(${fog2X}px,${-sy * 0.11}px,0)`

      /* Layer 07 — Foreground grass silhouette (0.50× — exits before character) */
      if (grassRef.current)
        grassRef.current.style.transform = `translate3d(0,${-sy * 0.50}px,0)`
    }

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', handleResize)
    }
  }, [stateRef])

  /* ── rAF — canvas particle system ─────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let rawMx = window.innerWidth / 2
    let rawMy = window.innerHeight * 0.7

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => { rawMx = e.clientX; rawMy = e.clientY }
    window.addEventListener('mousemove', onMouse, { passive: true })

    /* init 55 staggered particles */
    let parts: Particle[] = Array.from({ length: 55 }, () => {
      const p = createParticle(canvas.width, canvas.height)
      p.life = Math.floor(Math.random() * p.maxLife * 0.8)
      return p
    })

    const updateP = (p: Particle) => {
      /* subtle mouse attraction */
      const dx = rawMx - p.x
      const dy = rawMy - p.y
      const d  = Math.sqrt(dx * dx + dy * dy)
      if (d < 200 && d > 0) {
        p.speedX += (dx / d) * 0.001
        p.speedY += (dy / d) * 0.0005
      }
      p.speedX *= 0.993
      if (p.speedY > -0.04) p.speedY = -0.04
      p.x += p.speedX
      p.y += p.speedY
      p.life++

      const r   = p.life / p.maxLife
      const base = r < 0.2
        ? (r / 0.2) * p.maxOpacity
        : r > 0.7
        ? ((1 - r) / 0.3) * p.maxOpacity
        : p.maxOpacity
      /* fade particles as hero scrolls away */
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 2.5))
      p.opacity = base * fade
    }

    const drawP = (p: Particle) => {
      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.fillStyle   = 'rgba(229,100,60,1)'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const isDead = (p: Particle) => p.life >= p.maxLife || p.y < 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      parts = parts.filter(p => !isDead(p))
      const w = canvas.width, h = canvas.height
      while (parts.length < 55) parts.push(createParticle(w, h))
      parts.forEach(p => { updateP(p); drawP(p) })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
    }
  }, [])

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ── LAYER 01 — Sky gradient (0.08×) ────────────────────── */}
      <div
        ref={skyRef}
        className="will-change-transform"
        style={{
          position: 'absolute',
          top: '-15%', left: 0, right: 0, height: '130%',
          background:
            'linear-gradient(to bottom,' +
            '#090909 0%,' +
            '#0F0808 20%,' +
            '#1A0A0A 40%,' +
            '#3A0E0E 54%,' +
            '#5E1E1E 65%,' +
            '#8B2A18 73%,' +
            '#A83E2E 80%,' +
            '#C44A2A 86%,' +
            '#A83E2E 91%,' +
            '#090909 100%)',
        }}
      />

      {/* Ambient sun glow — static, no parallax */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 85% 50% at 50% 72%,' +
            'rgba(255,120,40,0.18) 0%,' +
            'rgba(229,72,63,0.08) 40%,' +
            'transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── LAYER 02 — Glowing gradient disc (0.15×) ───────────── */}
      {/*   Centred via left+margin so transform is animation-only  */}
      <div
        ref={discRef}
        className="will-change-transform"
        style={{
          position:     'absolute',
          left:         '50%',
          top:          '63%',
          width:        'clamp(260px,36vw,560px)',
          height:       'clamp(260px,36vw,560px)',
          marginLeft:   'calc(clamp(260px,36vw,560px) / -2)',
          marginTop:    'calc(clamp(260px,36vw,560px) / -2)',
          background:   'radial-gradient(ellipse at center,' +
            'rgba(255,160,60,0.55) 0%,' +
            'rgba(229,72,63,0.32) 28%,' +
            'rgba(180,50,30,0.15) 58%,' +
            'transparent 100%)',
          borderRadius: '50%',
          filter:       'blur(60px)',
        }}
      />

      {/* ── LAYER 03 — Far mountains (0.25×) ───────────────────── */}
      <div
        ref={mtnFarRef}
        className="will-change-transform"
        style={{ position: 'absolute', top: '-10%', left: 0, right: 0, height: '120%' }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mtnFarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#120606" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0A0303" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0 702 L72 558 L173 630 L259 522 L360 594
               L461 495 L547 562 L633 468 L720 540 L806 459
               L907 524 L993 477 L1080 580 L1166 509 L1253 594
               L1339 522 L1440 612 L1440 900 L0 900 Z"
            fill="url(#mtnFarGrad)"
          />
        </svg>
      </div>

      {/* ── LAYER 03b — Mid mountains (0.30×) ──────────────────── */}
      <div
        ref={mtnMidRef}
        className="will-change-transform"
        style={{ position: 'absolute', top: '-10%', left: 0, right: 0, height: '120%' }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <path
            d="M0 792 L115 666 L216 720 L331 630 L432 684
               L547 603 L634 666 L749 585 L835 657 L936 612
               L1037 684 L1152 630 L1253 702 L1354 648 L1440 720
               L1440 900 L0 900 Z"
            fill="#0A0303"
          />
        </svg>
      </div>

      {/* ── LAYER 04 — Fog strips (0.35× + drift) ──────────────── */}
      {/* Wide div (220 % of vw) so horizontal drift stays in bounds */}
      <div
        ref={fogRef}
        className="will-change-transform"
        style={{
          position: 'absolute',
          left: '-60%', top: 0,
          width: '220%', height: '100%',
          background: 'radial-gradient(ellipse 55% 9% at 50% 66%,' +
            'rgba(130,45,20,0.18) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={fog2Ref}
        className="will-change-transform"
        style={{
          position: 'absolute',
          left: '-60%', top: 0,
          width: '220%', height: '100%',
          background: 'radial-gradient(ellipse 65% 7% at 45% 72%,' +
            'rgba(55,14,7,0.22) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── LAYER 07 — Foreground grass silhouette (1.15×) ─────── */}
      <div
        ref={grassRef}
        className="will-change-transform"
        style={{ position: 'absolute', top: '-10%', left: 0, right: 0, height: '120%' }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <path
            d="M-10 900 L-10 806 L12 800 L24 808 L36 799 L48 807
               L62 798 L76 806 L92 797 L108 805 L126 796 L144 803
               L164 795 L184 802 L206 793 L228 800 L252 791 L276 798
               L302 789 L328 796 L356 787 L384 794 L414 785 L444 792
               L476 783 L508 789 L542 780 L576 787 L612 778 L648 784
               L686 776 L724 782 L764 774 L804 780 L846 772 L888 778
               L932 770 L976 776 L1022 768 L1068 774 L1116 766 L1164 772
               L1214 764 L1264 770 L1316 762 L1368 768 L1450 761 L1450 900 Z"
            fill="#060202"
          />
        </svg>
      </div>

      {/* ── Particles canvas (z above mountains, below hero content) */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
      />
    </div>
  )
}
