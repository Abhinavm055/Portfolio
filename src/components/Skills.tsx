/**
 * Skills — Floating platforms with independent depth.
 *
 * Each skill card is assigned a random depth factor (0.85–1.15).
 * Mouse movement shifts cards by different amounts based on their depth,
 * creating a gentle 3D parallax platform effect.
 * Hover lifts an individual card via translate3d (GPU-only).
 */
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'

/* ─── SVG icons ────────────────────────────────────────────────── */
const SkillIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Java: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M8 18s-2 .5-2 1.5S8 21 12 21s6-.5 6-1.5S18 18 18 18" />
        <path d="M9.5 15c-1.5-1-2-3-1-5" />
        <path d="M11 12c1.5-2 1.5-4 0-6" />
        <path d="M14.5 15c1.5-1 2-3 1-5" />
        <path d="M10 9h4" />
      </svg>
    ),
    JavaScript: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 17v-6M12 17v-6" />
        <path d="M16 11v4c0 1-1 2-2 2s-2-1-2-2" />
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12H7v5M11 12h4a2 2 0 0 1 0 4h-4" />
        <path d="M14 17h1" />
      </svg>
    ),
    React: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
    'Node.js': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
        <path d="M12 2v18M4 6l8 4 8-4" />
      </svg>
    ),
    MySQL: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.5 3.5 3 8 3s8-1.5 8-3V6" />
        <path d="M4 12v6c0 1.5 3.5 3 8 3s8-1.5 8-3v-6" />
      </svg>
    ),
    PostgreSQL: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v12c0 1.5 3.5 3 8 3s8-1.5 8-3V6" />
        <path d="M16 12l2 5" />
      </svg>
    ),
    Firebase: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M5 21L8 7l4 4 3-8 4 18H5z" />
        <path d="M8 7l8 14" />
      </svg>
    ),
    Flutter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M14 2L4 12l4 4 10-10-4-4z" />
        <path d="M8 16l4 4 8-8" />
        <path d="M12 20l-4-4" />
      </svg>
    ),
    Git: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <path d="M6 8v8M6 8c4 0 7 1 7 6M13 14c0 2 2 4 5 4" />
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  }
  return (
    <span className="skill-icon">
      {icons[name] ?? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
        </svg>
      )}
    </span>
  )
}

/* ─── Data ─────────────────────────────────────────────────────── */
const categories = [
  { label: 'Backend',  skills: ['Java', 'Node.js'],                      accent: '#E5483F' },
  { label: 'Frontend', skills: ['React', 'JavaScript', 'TypeScript'],    accent: '#E5483F' },
  { label: 'Database', skills: ['MySQL', 'PostgreSQL', 'Firebase'],      accent: '#E5483F' },
  { label: 'Mobile',   skills: ['Flutter'],                              accent: '#E5483F' },
  { label: 'Tools',    skills: ['Git', 'GitHub'],                        accent: '#E5483F' },
]

/* ─── Assign stable depth factors (seeded per render — SSR-safe) ── */
const ALL_SKILLS = categories.flatMap(c => c.skills)
const DEPTHS: Record<string, number> = {}
let seed = 0
ALL_SKILLS.forEach(s => {
  // deterministic pseudo-random: 0.85 to 1.15
  DEPTHS[s] = 0.85 + ((seed * 0.618033988749) % 1) * 0.30
  seed++
})

/* ─── Component ─────────────────────────────────────────────────── */
export default function Skills() {
  const sectionRef  = useRef<HTMLElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const cardRefs    = useRef<Map<string, HTMLDivElement>>(new Map())
  const inView      = useInView(sectionRef, { once: true, margin: '-10%' })

  /* Mouse-driven platform drift */
  useEffect(() => {
    let mouseX = 0
    let mouseY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth)  * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      cardRefs.current.forEach((el, skill) => {
        const depth = DEPTHS[skill] ?? 1
        const dx = mouseX * 10 * (depth - 1)   // deeper cards shift more
        const dy = mouseY * 7  * (depth - 1)
        // Apply only if NOT hovered (hover has its own transform)
        if (!el.matches(':hover')) {
          el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
        }
      })
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-40"
      style={{ zIndex: 40 }}
    >
      {/* Top gradient reveal */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '80px', left: 0, right: 0, bottom: 0,
          background: 'var(--bg)', zIndex: 0, pointerEvents: 'none',
        }}
      />

      <div
        ref={gridRef}
        className="relative w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24"
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '72px' }}
        >
          <div className="section-label" style={{ marginBottom: '16px' }}>Technical Arsenal</div>
          <h2
            className="font-clash text-primary"
            style={{ fontSize: 'clamp(38px,5vw,54px)', letterSpacing: '-0.01em', lineHeight: 1.1 }}
          >
            Skills &<br />
            <span style={{ color: 'var(--accent)' }}>Technologies</span>
          </h2>
          <div className="divider" style={{ marginTop: '32px' }} />
        </motion.div>

        {/* Platform categories */}
        <div className="flex flex-col gap-16">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: ci * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <span className="section-label" style={{ color: 'var(--secondary)', minWidth: '100px' }}>
                  {cat.label}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <div className="flex flex-wrap gap-4">
                {cat.skills.map((skill, si) => (
                  <motion.div
                    key={skill}
                    ref={el => { if (el) cardRefs.current.set(skill, el) }}
                    id={`skill-${skill.toLowerCase().replace(/\./g, '-')}`}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{
                      duration: 0.8,
                      delay:    ci * 0.08 + si * 0.07,
                      ease:     [0.22, 1, 0.36, 1],
                    }}
                    className="skill-card will-change-transform"
                    style={{
                      minWidth: '110px',
                      flex:     '0 0 auto',
                      /* Depth hint via subtle shadow variance */
                      boxShadow: `0 ${Math.round(DEPTHS[skill] * 8)}px ${Math.round(DEPTHS[skill] * 20)}px rgba(0,0,0,${(DEPTHS[skill] * 0.4).toFixed(2)})`,
                    }}
                  >
                    <SkillIcon name={skill} />
                    <span className="skill-label">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
