/**
 * Technologies — Clean, Minimalist Technical Arsenal & Areas of Interest.
 *
 * Organized into structured editorial categories with subtle entrance animations,
 * refined typography, and sleek red accents matching the cinematic portfolio theme.
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TECH_CATEGORIES = [
  {
    num: '01',
    title: 'PROGRAMMING',
    items: ['Java', 'Python', 'C', 'JavaScript', 'TypeScript'],
  },
  {
    num: '02',
    title: 'WEB DEVELOPMENT',
    items: ['HTML', 'CSS', 'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Spring Boot'],
  },
  {
    num: '03',
    title: 'DATABASES',
    items: ['MySQL', 'PostgreSQL', 'Firebase Firestore'],
  },
  {
    num: '04',
    title: 'TOOLS & PLATFORMS',
    items: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'Canva'],
  },
]

const AREAS_OF_INTEREST = [
  'Artificial Intelligence',
  'Web Development',
  'Full Stack Development',
  'Software Engineering',
  'UI/UX Design',
]

export default function Technologies() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center py-20"
      style={{ zIndex: 40, background: '#080808' }}
    >
      {/* Background gradients */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, #080808)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#080808',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        className="relative w-full max-w-[1400px] mx-auto"
        style={{
          zIndex: 1,
          paddingLeft: 'clamp(16px, 4vw, 48px)',
          paddingRight: 'clamp(16px, 4vw, 48px)',
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ marginBottom: 'clamp(32px, 4vh, 52px)' }}
        >
          <div className="section-label" style={{ marginBottom: '12px' }}>
            Technical Arsenal
          </div>
          <h2
            className="font-clash text-primary"
            style={{
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Core <span style={{ color: 'var(--accent)' }}>Technologies</span> & Stack
          </h2>
          <div className="divider" style={{ marginTop: '24px' }} />
        </motion.div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {TECH_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.1,
                ease: EASE,
              }}
              className="glass-card"
              style={{
                borderRadius: '16px',
                padding: 'clamp(20px, 2.5vw, 28px)',
                background: 'rgba(14, 14, 14, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
            >
              {/* Category Number & Title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    {cat.num}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>/</span>
                  <h3
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--primary)',
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Technology Items Pill Container */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cat.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 'clamp(11px, 0.85vw, 13px)',
                      letterSpacing: '0.04em',
                      color: 'rgba(255, 255, 255, 0.78)',
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.25s ease',
                      userSelect: 'none',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Areas of Interest Subsection */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          style={{
            marginTop: 'clamp(28px, 3.5vh, 44px)',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              Areas of Interest
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AREAS_OF_INTEREST.map((area) => (
                <div
                  key={area}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 'clamp(11px, 0.85vw, 13px)',
                    letterSpacing: '0.04em',
                    color: 'rgba(255, 255, 255, 0.65)',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '100px',
                    padding: '6px 16px',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'inline-block',
                    }}
                  />
                  {area}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
