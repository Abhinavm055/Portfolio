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
      }}
    >
      {/* ── Full-bleed background image ── */}
      <img
        src={homeImg}
        alt="Abhinav"
        decoding="async"
        style={{
          display:        'block',
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center center',
        }}
      />

      {/* ── Text overlay — right side ── */}
      <div
        style={{
          position:       'absolute',
          top:            '50%',
          right:          'clamp(40px, 8vw, 120px)',
          transform:      'translateY(-50%)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'flex-end',
          gap:            'clamp(8px, 1.5vh, 18px)',
          pointerEvents:  'none',
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontFamily:    '"Alfa Slab One", "Ultra", serif',
            fontWeight:    400,
            fontStyle:     'normal',
            fontSize:      'clamp(48px, 6.5vw, 100px)',
            lineHeight:    1,
            letterSpacing: '0.04em',
            color:         '#000000',
            margin:        0,
            textAlign:     'right',
            whiteSpace:    'nowrap',
            textTransform: 'uppercase',
          }}
        >
          ABHINAV
        </h1>

        {/* Divider */}
        <div
          style={{
            width:           'clamp(70px, 9vw, 160px)',
            height:          '2px',
            backgroundColor: '#000000',
            opacity:         0.6,
          }}
        />

        {/* Scramble role */}
        <p
          style={{
            fontFamily:    '"JetBrains Mono", monospace',
            fontWeight:    400,
            fontSize:      'clamp(12px, 1.4vw, 20px)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         '#000000',
            margin:        0,
            textAlign:     'right',
            whiteSpace:    'nowrap',
            minWidth:      '22ch',   /* prevents layout shift on role change */
          }}
        >
          {scrambled}
        </p>
      </div>
    </section>
  )
}

export default memo(Hero)
