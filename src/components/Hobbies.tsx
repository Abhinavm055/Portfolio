import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const hobbies = [
  {
    name: 'Football',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 6.9 17.3L12 12V2z" strokeDasharray="none" />
        <polygon points="12,2 16,8 12,12 8,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.1 19.3L8 12l4 0 4 0 2.9 7.3" />
      </svg>
    ),
    desc: 'The beautiful game — pitch awareness, team play, the rush of a perfect run.',
  },
  {
    name: 'Cricket',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
        <path d="M4 20L14 8" />
        <path d="M14 8l2-3 4 4-3 2-3-3z" />
        <path d="M19 21H17M21 21H19" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    desc: 'Cricket is strategy, patience, and the perfect delivery — the sport of patience.',
  },
  {
    name: 'Music',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    desc: 'Music is the language beneath language. Rhythm, melody, and feeling.',
  },
  {
    name: 'Singing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
        <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M19 10a7 7 0 0 1-14 0" />
        <path d="M12 19v3M9 22h6" />
      </svg>
    ),
    desc: 'Voice is the purest instrument. Every song is a small confession.',
  },
]

export default function Hobbies() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="hobbies" ref={ref} className="relative py-40" style={{ zIndex: 45 }}>
      {/* Top gradient reveal — lets background bleed through at transition */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
      {/* Solid fill below gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '80px', left: 0, right: 0, bottom: 0,
          background: 'var(--bg)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px', textAlign: 'center' }}
        >
          <div className="section-label" style={{ marginBottom: '16px' }}>Beyond the Code</div>
          <h2
            className="font-clash text-primary"
            style={{
              fontSize: 'clamp(38px, 5vw, 54px)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            When I'm Not<br />
            <span style={{ color: 'var(--accent)' }}>Coding</span>
          </h2>
        </motion.div>

        {/* Hobbies grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {hobbies.map((hobby, i) => (
            <motion.div
              key={hobby.name}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 1.1,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hobby-card"
            >
              <div style={{ color: 'var(--secondary)', transition: 'color 0.4s, filter 0.4s' }}>
                {hobby.icon}
              </div>
              <div
                className="font-clash"
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {hobby.name}
              </div>
              <p style={{ fontSize: '13px', textAlign: 'center', lineHeight: 1.6 }}>
                {hobby.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom landscape strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6 }}
          style={{
            marginTop: '64px',
            textAlign: 'center',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              letterSpacing: '0.4em',
              color: 'rgba(157,157,157,0.3)',
              textTransform: 'uppercase',
            }}
          >
            ─ ─ ─ &nbsp; Life beyond lines of code &nbsp; ─ ─ ─
          </div>
        </motion.div>

      </div>
    </section>
  )
}
