/**
 * Technologies — Three infinite marquee rows with premium pill design.
 *
 * Row 1: left → right (normal direction)
 * Row 2: right → left (reverse direction)
 * Row 3: left → right (normal direction)
 *
 * Hover pauses the entire row and slightly enlarges the hovered pill.
 * Pure CSS animation — no GSAP required.
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─── Tech icon SVGs ────────────────────────────────────────────── */
const TechIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Java: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M8 18s-2 .5-2 1.5S8 21 12 21s6-.5 6-1.5S18 18 18 18" /><path d="M9.5 15c-1.5-1-2-3-1-5M11 12c1.5-2 1.5-4 0-6M14.5 15c1.5-1 2-3 1-5M10 9h4" />
      </svg>
    ),
    JavaScript: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 17v-6M12 17v-6M16 11v4c0 1-1 2-2 2s-2-1-2-2" />
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12H7v5M11 12h4a2 2 0 0 1 0 4h-4M14 17h1" />
      </svg>
    ),
    React: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
    'Node.js': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" /><path d="M12 2v18M4 6l8 4 8-4" />
      </svg>
    ),
    Express: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M4 8h16M4 12h16M4 16h10" />
      </svg>
    ),
    Firebase: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M5 21L8 7l4 4 3-8 4 18H5z" /><path d="M8 7l8 14" />
      </svg>
    ),
    MySQL: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.5 3.5 3 8 3s8-1.5 8-3V6M4 12v6c0 1.5 3.5 3 8 3s8-1.5 8-3v-6" />
      </svg>
    ),
    PostgreSQL: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.5 3.5 3 8 3s8-1.5 8-3V6M16 12l2 5" />
      </svg>
    ),
    Neon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" />
      </svg>
    ),
    Flutter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2L4 12l4 4 10-10-4-4z" /><path d="M8 16l4 4 8-8M12 20l-4-4" />
      </svg>
    ),
    Git: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><path d="M6 8v8M6 8c4 0 7 1 7 6M13 14c0 2 2 4 5 4" />
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    'Tailwind CSS': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M12 6C9 6 7 7.5 6 10.5c1.5-2 3-2.75 4.5-2.25C11.3 8.6 11.94 9.3 12.6 10c1.05 1.1 2.27 2.4 4.9 2.4 3 0 5-1.5 6-4.5-1.5 2-3 2.75-4.5 2.25-.8-.25-1.44-.95-2.1-1.65C15.85 7.4 14.63 6 12 6z" />
        <path d="M6 13.5c-3 0-5 1.5-6 4.5 1.5-2 3-2.75 4.5-2.25.8.25 1.44.95 2.1 1.65C7.65 18.5 8.87 19.8 11.5 19.8c3 0 5-1.5 6-4.5-1.5 2-3 2.75-4.5 2.25-.8-.25-1.44-.95-2.1-1.65C9.85 14.8 8.63 13.5 6 13.5z" />
      </svg>
    ),
    HTML: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M4 3l1.5 16L12 21l6.5-2L20 3H4z" /><path d="M8 7h8M8.5 11h7l-.5 5-3.5 1-3.5-1-.25-3" />
      </svg>
    ),
    CSS: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M4 3l1.5 16L12 21l6.5-2L20 3H4z" /><path d="M8 7h8M8 11h8M9 15h6l-.5 3L12 19l-2.5-.8" />
      </svg>
    ),
    Vite: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" />
      </svg>
    ),
    'Android Studio': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="3" y="8" width="18" height="10" rx="2" /><path d="M7 8V6a5 5 0 0 1 10 0v2" /><circle cx="9" cy="13" r="1" fill="currentColor" /><circle cx="15" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  }
  return <>{icons[name] ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16"><circle cx="12" cy="12" r="9" /></svg>}</>
}

/* ─── Row data ──────────────────────────────────────────────────── */
const ROW1 = ['Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express']
const ROW2 = ['Firebase', 'MySQL', 'PostgreSQL', 'Neon', 'Flutter', 'Git']
const ROW3 = ['GitHub', 'Tailwind CSS', 'HTML', 'CSS', 'Vite', 'Android Studio']

/* ─── Marquee Row ───────────────────────────────────────────────── */
function MarqueeRow({
  techs,
  direction,
  speed = 40,
}: {
  techs: string[]
  direction: 'ltr' | 'rtl'
  speed?: number
}) {
  /* Duplicate the list so the loop is seamless */
  const doubled = [...techs, ...techs, ...techs]

  return (
    <div
      style={{
        overflow:  'hidden',
        width:     '100%',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
      onMouseEnter={(e) => {
        const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement
        if (inner) inner.style.animationPlayState = 'paused'
      }}
      onMouseLeave={(e) => {
        const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement
        if (inner) inner.style.animationPlayState = 'running'
      }}
    >
      <div
        className="marquee-inner"
        style={{
          display:   'flex',
          gap:       '12px',
          width:     'max-content',
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((tech, i) => (
          <TechPill key={`${tech}-${i}`} name={tech} />
        ))}
      </div>
    </div>
  )
}

/* ─── Tech Pill ─────────────────────────────────────────────────── */
function TechPill({ name }: { name: string }) {
  return (
    <div
      className="tech-pill"
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '8px',
        padding:      '10px 20px',
        background:   'var(--card)',
        border:       '1px solid var(--border)',
        borderRadius: '100px',
        fontFamily:   'JetBrains Mono, monospace',
        fontSize:     '13px',
        letterSpacing: '0.05em',
        color:        'var(--secondary)',
        whiteSpace:   'nowrap',
        transition:   'all 0.3s ease',
        cursor:       'default',
        flexShrink:   0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(229,72,63,0.5)'
        el.style.color       = 'var(--primary)'
        el.style.transform   = 'scale(1.07)'
        el.style.boxShadow   = '0 0 20px rgba(229,72,63,0.15)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.color       = 'var(--secondary)'
        el.style.transform   = 'scale(1)'
        el.style.boxShadow   = 'none'
      }}
    >
      <span style={{ color: 'var(--accent)', opacity: 0.7 }}>
        <TechIcon name={name} />
      </span>
      {name}
    </div>
  )
}

/* ─── Section ───────────────────────────────────────────────────── */
export default function Technologies() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center py-20"
      style={{ zIndex: 40, background: '#080808' }}
    >
      {/* Background */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, transparent, #080808)', zIndex: 0, pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '80px', left: 0, right: 0, bottom: 0, background: '#080808', zIndex: 0, pointerEvents: 'none' }} />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <div
          ref={headerRef}
          className="w-full max-w-[1400px] mx-auto"
          style={{ marginBottom: '64px', paddingLeft: 'clamp(10px, 1.5vw, 24px)', paddingRight: 'clamp(10px, 1.5vw, 24px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div className="section-label" style={{ marginBottom: '16px' }}>Technical Arsenal</div>
            <h2
              className="font-clash text-primary"
              style={{ fontSize: 'clamp(38px,5vw,54px)', letterSpacing: '-0.01em', lineHeight: 1.1 }}
            >
              Technologies I <span style={{ color: 'var(--accent)' }}>Work With</span>
            </h2>
            <div className="divider" style={{ marginTop: '32px' }} />
          </motion.div>
        </div>

        {/* Marquee rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <MarqueeRow techs={ROW1} direction="ltr" speed={35} />
          <MarqueeRow techs={ROW2} direction="rtl" speed={40} />
          <MarqueeRow techs={ROW3} direction="ltr" speed={30} />
        </motion.div>

      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes marquee-rtl {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
