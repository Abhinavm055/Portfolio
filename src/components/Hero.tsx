/**
 * Hero — Full-screen Home.png with name + scramble-role overlay on the right
 */
import { memo, useEffect, useRef, useState } from 'react'
import homeImg from '../assets/Home.png'

/* ── Scramble config ───────────────────────────────────── */
const ROLES = [
  'Full Stack Developer',
  'Backend Developer',
  'Software Developer',
  'AI Developer',
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'
const FRAME_INTERVAL  = 35   // ms between each scramble frame
const SETTLE_SPEED    = 2.5  // how many frames before next char settles

interface HeroProps {
  isIntroComplete?: boolean
}

/* ── Scramble hook ─────────────────────────────────────── */
function useScrambleText(target: string) {
  const [display, setDisplay] = useState(target)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef    = useRef(0)

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    frameRef.current = 0

    intervalRef.current = setInterval(() => {
      const frame = frameRef.current
      const settled = Math.floor(frame / SETTLE_SPEED)

      setDisplay(
        target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < settled)  return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )

      frameRef.current++
      if (settled >= target.length) {
        clearInterval(intervalRef.current!)
        setDisplay(target)
      }
    }, FRAME_INTERVAL)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [target])

  return display
}

/* ── Component ─────────────────────────────────────────── */
function Hero({ isIntroComplete: _isIntroComplete = false }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0)
  const scrambled = useScrambleText(ROLES[roleIndex])

  /* Cycle roles every 3.2 s */
  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex(i => (i + 1) % ROLES.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="home"
      style={{
        position:   'fixed',
        inset:      0,
        width:      '100vw',
        height:     '100vh',
        zIndex:     10,
        userSelect: 'none',
        overflow:   'hidden',
        margin:     0,
        padding:    0,
        backgroundColor: '#991B1B',
      }}
    >
      {/* ── Full-bleed non-draggable background image ── */}
      <img
        src={homeImg}
        alt="Abhinav"
        decoding="async"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          display:        'block',
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center center',
          userSelect:     'none',
          WebkitUserSelect: 'none',
          pointerEvents:  'none',
        }}
      />

      {/* ── TOP-LEFT EDITORIAL TYPOGRAPHY ── */}
      <div
        className="hidden md:flex flex-col items-start"
        style={{
          position:   'absolute',
          top:        'clamp(28px, 4.5vh, 48px)',
          left:       'clamp(24px, 3.5vw, 56px)',
          zIndex:     20,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily:    '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize:      'clamp(11px, 0.95vw, 13px)',
            lineHeight:    1.4,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(235, 235, 235, 0.88)',
            fontWeight:    500,
          }}
        >
          <div>BUILD</div>
          <div>LEARN</div>
          <div>IMPROVE</div>
          <div>REPEAT</div>
        </div>
        {/* Subtle separator underline */}
        <div
          style={{
            width:           '32px',
            height:          '1px',
            backgroundColor: 'rgba(235, 235, 235, 0.5)',
            marginTop:       '8px',
          }}
        />
      </div>

      {/* ── BOTTOM-LEFT EDITORIAL TYPOGRAPHY ── */}
      <div
        className="hidden md:block"
        style={{
          position:   'absolute',
          bottom:     'clamp(28px, 4.5vh, 48px)',
          left:       'clamp(24px, 3.5vw, 56px)',
          zIndex:     20,
          pointerEvents: 'none',
          fontFamily:    '"Cormorant Garamond", "Playfair Display", Georgia, serif',
          fontSize:      'clamp(11px, 0.95vw, 13px)',
          lineHeight:    1.4,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'rgba(235, 235, 235, 0.82)',
          fontWeight:    500,
        }}
      >
        <div>CODE</div>
        <div>IDEAS</div>
        <div>INTO</div>
        <div>IMPACT</div>
      </div>

      {/* ── MAIN CONTENT — CENTER-RIGHT HERO STACK ── */}
      <div
        style={{
          position:       'absolute',
          top:            '50%',
          right:          'clamp(24px, 7vw, 120px)',
          transform:      'translateY(-50%)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'flex-start',
          maxWidth:       'min(540px, 92vw)',
          zIndex:         20,
        }}
      >
        {/* Subheading Greeting */}
        <div
          style={{
            fontFamily:    '"JetBrains Mono", monospace',
            fontSize:      'clamp(11px, 1.1vw, 14px)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         'rgba(235, 235, 235, 0.85)',
            fontWeight:    400,
            marginBottom:  'clamp(4px, 1vh, 8px)',
          }}
        >
          HELLO, I'M
        </div>

        {/* Large Bold Display Name */}
        <h1
          style={{
            fontFamily:    '"Alfa Slab One", "Ultra", serif',
            fontWeight:    400,
            fontStyle:     'normal',
            fontSize:      'clamp(44px, 6.2vw, 88px)',
            lineHeight:    0.95,
            letterSpacing: '0.04em',
            color:         '#0A0A0A',
            margin:        0,
            textTransform: 'uppercase',
            textShadow:    '0 1px 2px rgba(0, 0, 0, 0.25)',
          }}
        >
          ABHINAV
        </h1>

        {/* Role line with divider */}
        <div
          className="flex items-center gap-3 w-full"
          style={{
            marginTop:    'clamp(10px, 1.6vh, 18px)',
            marginBottom: 'clamp(14px, 2vh, 22px)',
          }}
        >
          <div
            style={{
              fontFamily:    '"JetBrains Mono", monospace',
              fontSize:      'clamp(12px, 1.25vw, 17px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(245, 245, 245, 0.95)',
              fontWeight:    400,
              whiteSpace:    'nowrap',
            }}
          >
            {scrambled}
          </div>
          <div
            className="flex-1"
            style={{
              height:          '1px',
              backgroundColor: 'rgba(235, 235, 235, 0.55)',
              maxWidth:        'clamp(60px, 8vw, 110px)',
            }}
          />
        </div>

        {/* Editorial Subtitle */}
        <p
          style={{
            fontFamily:    '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontStyle:     'italic',
            fontSize:      'clamp(15px, 1.4vw, 20px)',
            lineHeight:    1.5,
            color:         'rgba(235, 235, 235, 0.85)',
            margin:        0,
            marginBottom:  'clamp(20px, 3vh, 32px)',
            maxWidth:      '440px',
            fontWeight:    400,
            letterSpacing: '0.02em',
          }}
        >
          I build systems, products and experiences across the stack.
        </p>

        {/* EXPLORE MY WORK Button */}
        <a
          href="#projects"
          className="group inline-flex items-center justify-between transition-all duration-300 hover:scale-[1.03]"
          style={{
            border:          '1px solid rgba(235, 235, 235, 0.45)',
            backgroundColor: 'rgba(25, 0, 0, 0.25)',
            backdropFilter:  'blur(6px)',
            padding:         'clamp(10px, 1.4vh, 14px) clamp(22px, 2.4vw, 36px)',
            textDecoration:  'none',
            color:           '#FFFFFF',
            fontFamily:      '"JetBrains Mono", monospace',
            fontSize:        'clamp(10px, 0.9vw, 12px)',
            letterSpacing:   '0.22em',
            textTransform:   'uppercase',
            gap:             '18px',
          }}
        >
          <span>EXPLORE MY WORK</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </a>
      </div>

      {/* ── BOTTOM-RIGHT SOCIAL MEDIA ICONS ── */}
      <div
        style={{
          position:      'absolute',
          bottom:        'clamp(24px, 4vh, 42px)',
          right:         'clamp(64px, 7.5vw, 110px)',
          display:       'flex',
          alignItems:    'center',
          gap:           'clamp(16px, 1.8vw, 24px)',
          zIndex:        25,
        }}
      >
        {/* GitHub */}
        <a
          href="https://github.com/Abhinavm055"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/malayil-abhinav"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" />
            <path d="M7 10v7M7 7v.01M12 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M12 10v7" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/vox.abhi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:malayilabhinav16@gmail.com"
          aria-label="Email"
          className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </a>
      </div>

      {/* ── FAR-RIGHT VERTICAL SCROLL INDICATOR ── */}
      <div
        className="hidden md:flex flex-col items-center gap-2"
        style={{
          position:      'absolute',
          right:         'clamp(16px, 2.2vw, 36px)',
          bottom:        'clamp(28px, 4.5vh, 52px)',
          zIndex:        25,
          pointerEvents: 'none',
        }}
      >
        {/* Top vertical indicator line */}
        <div
          style={{
            width:           '1px',
            height:          'clamp(60px, 9vh, 90px)',
            backgroundColor: 'rgba(235, 235, 235, 0.4)',
          }}
        />

        {/* Vertical SCROLL text */}
        <div
          style={{
            writingMode:    'vertical-rl',
            textOrientation:'mixed',
            fontFamily:     '"JetBrains Mono", monospace',
            fontSize:       '10px',
            letterSpacing:  '0.28em',
            textTransform:  'uppercase',
            color:          'rgba(235, 235, 235, 0.82)',
            paddingTop:     '8px',
            paddingBottom:  '6px',
          }}
        >
          SCROLL
        </div>

        {/* Downward arrow symbol */}
        <div
          style={{
            fontSize:   '11px',
            color:      'rgba(235, 235, 235, 0.85)',
            transform:  'rotate(90deg)',
          }}
        >
          ←
        </div>
      </div>
    </section>
  )
}

export default memo(Hero)
