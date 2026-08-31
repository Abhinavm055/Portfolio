/**
 * OpenToWork — Premium "Open to Work" section for freshers.
 *
 * Replaces the Experience / Hobbies sections.
 * Features:
 *   - Premium glass card with animated status indicator
 *   - Role pills (Backend Dev, Software Engineering, etc.)
 *   - Animated accent line entrance
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const roles = [
  'Software Engineering',
  'Full Stack Development',
  'Backend Development',
  'AI / Software Projects',
  'Internships & Entry-Level Roles',
]

const highlights = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
        <path d="M12 2v18M4 6l8 4 8-4" />
      </svg>
    ),
    label: 'Software Engineering',
    value: 'Java · Python · C · System Design',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
    label: 'Full Stack & Backend',
    value: 'React · Node.js · Spring Boot · TS',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" />
      </svg>
    ),
    label: 'AI & Data Layer',
    value: 'Google Gemini · LLMs · PostgreSQL',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    label: 'Target Roles',
    value: 'Internships · Entry-Level · Remote / On-Site',
  },
]

export default function OpenToWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section
      id="open-to-work"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center py-20"
      style={{ zIndex: 42, background: '#080808' }}
    >
      {/* Top gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #080808)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '80px', left: 0, right: 0, bottom: 0,
          background: '#080808', zIndex: 0, pointerEvents: 'none',
        }}
      />

      <div
        className="relative w-full max-w-[1400px] mx-auto"
        style={{ zIndex: 1, paddingLeft: 'clamp(10px, 1.5vw, 24px)', paddingRight: 'clamp(10px, 1.5vw, 24px)' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ marginBottom: '64px' }}
        >
          <div className="section-label" style={{ marginBottom: '16px' }}>Opportunities</div>
          <h2
            className="font-clash text-primary"
            style={{ fontSize: 'clamp(38px,5vw,54px)', letterSpacing: '-0.01em', lineHeight: 1.1 }}
          >
            Open to <span style={{ color: 'var(--accent)' }}>Opportunities</span>
          </h2>
          <div className="divider" style={{ marginTop: '32px' }} />
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, delay: 0.1, ease: EASE }}
        >
          <div
            className="glass-card"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'var(--card)',
              border: '1px solid rgba(229,72,63,0.15)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(229,72,63,0.05)',
            }}
          >
            {/* Card top accent line */}
            <div
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent) 0%, rgba(229,72,63,0.3) 50%, transparent 100%)',
              }}
            />

            <div style={{ padding: 'clamp(32px, 5vh, 60px) clamp(28px, 5vw, 64px)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16">

                {/* Left — Main call */}
                <div className="flex flex-col gap-8">
                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '12px', height: '12px' }}>
                      <div
                        style={{
                          position:     'absolute',
                          inset:        0,
                          borderRadius: '50%',
                          background:   '#22c55e',
                          animation:    'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
                        }}
                      />
                      <div
                        style={{
                          position:     'absolute',
                          inset:        '2px',
                          borderRadius: '50%',
                          background:   '#16a34a',
                        }}
                      />
                    </div>
                    <span
                      className="section-label"
                      style={{ color: '#22c55e', fontSize: '12px' }}
                    >
                      Actively Seeking Opportunities
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-clash text-primary"
                      style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
                    >
                      Computer Science
                      <br />
                      Engineering Student
                    </h3>
                    <p
                      style={{
                        color:      'var(--secondary)',
                        fontSize:   '16px',
                        lineHeight: 1.8,
                        marginTop:  '16px',
                        maxWidth:   '460px',
                      }}
                    >
                      Computer Science Engineering student seeking career opportunities across Software Engineering,
                      Full Stack Development, and AI Projects. Ready to contribute, learn, and build high-impact solutions.
                    </p>
                  </div>

                  {/* Role pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {roles.map((role, i) => (
                      <motion.div
                        key={role}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.07, ease: EASE }}
                        style={{
                          padding:      '8px 16px',
                          border:       '1px solid var(--border)',
                          borderRadius: '100px',
                          fontFamily:   'JetBrains Mono, monospace',
                          fontSize:     '12px',
                          letterSpacing: '0.05em',
                          color:        'var(--secondary)',
                          background:   'var(--surface)',
                          transition:   'all 0.3s ease',
                          cursor:       'default',
                        }}
                        whileHover={{
                          borderColor: 'var(--accent)',
                          color:       'var(--accent)',
                          scale:       1.04,
                        }}
                      >
                        {role}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right — Highlights grid */}
                <div className="flex flex-col gap-4">
                  <div className="section-label" style={{ marginBottom: '8px', color: 'var(--secondary)' }}>
                    What I Bring
                  </div>
                  {highlights.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: EASE }}
                      style={{
                        display:      'flex',
                        alignItems:   'center',
                        gap:          '16px',
                        padding:      '16px 20px',
                        background:   'var(--surface)',
                        border:       '1px solid var(--border)',
                        borderRadius: '14px',
                        transition:   'border-color 0.3s ease',
                      }}
                    >
                      <div style={{ color: 'var(--accent)', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="stat-label" style={{ marginBottom: '3px' }}>{item.label}</div>
                        <div
                          className="font-mono"
                          style={{ fontSize: '13px', color: 'var(--primary)', letterSpacing: '0.03em' }}
                        >
                          {item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(2); }
        }
      `}</style>
    </section>
  )
}
