/**
 * Technologies — Four alternating infinite marquee rows with premium pill design.
 *
 * Row 1: left → right (ltr) - Programming (Java, Python, C, JavaScript, TypeScript)
 * Row 2: right → left (rtl) - Web Frameworks (React, Vite, Tailwind CSS, Node.js, Spring Boot)
 * Row 3: left → right (ltr) - Web & DB (HTML, CSS, MySQL, PostgreSQL, Firebase Firestore)
 * Row 4: right → left (rtl) - Tools & Platforms (Git, GitHub, VS Code, IntelliJ IDEA, Canva)
 *
 * Hover pauses the row and highlights the hovered pill.
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─── 100% Official Devicon Vector Brand Logos ─── */
const TechIcon = ({ name }: { name: string }) => {
  const iconClasses: Record<string, string> = {
    Java: 'devicon-java-plain colored',
    Python: 'devicon-python-plain colored',
    C: 'devicon-c-plain colored',
    JavaScript: 'devicon-javascript-plain colored',
    TypeScript: 'devicon-typescript-plain colored',
    React: 'devicon-react-original colored',
    Vite: 'devicon-vitejs-plain colored',
    'Tailwind CSS': 'devicon-tailwindcss-original colored',
    'Node.js': 'devicon-nodejs-plain colored',
    'Spring Boot': 'devicon-spring-original colored',
    HTML: 'devicon-html5-plain colored',
    CSS: 'devicon-css3-plain colored',
    MySQL: 'devicon-mysql-original colored',
    PostgreSQL: 'devicon-postgresql-plain colored',
    'Firebase Firestore': 'devicon-firebase-plain colored',
    Git: 'devicon-git-plain colored',
    GitHub: 'devicon-github-original',
    'VS Code': 'devicon-vscode-plain colored',
    'IntelliJ IDEA': 'devicon-intellij-plain colored',
    Canva: 'devicon-canva-original colored',
  }

  const cls = iconClasses[name]
  if (cls) {
    return <i className={`${cls} text-[20px] leading-none inline-flex items-center justify-center`} />
  }

  return <i className="devicon-devicon-plain text-[20px] leading-none inline-flex items-center justify-center" />
}

/* ─── 4 Row data ────────────────────────────────────────────────── */
const ROW1 = ['Java', 'Python', 'C', 'JavaScript', 'TypeScript']
const ROW2 = ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Spring Boot']
const ROW3 = ['HTML', 'CSS', 'MySQL', 'PostgreSQL', 'Firebase Firestore']
const ROW4 = ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'Canva']

/* ─── Marquee Row ───────────────────────────────────────────────── */
function MarqueeRow({
  techs,
  direction,
  speed = 32,
}: {
  techs: string[]
  direction: 'ltr' | 'rtl'
  speed?: number
}) {
  /* Duplicate list for seamless loop */
  const doubled = [...techs, ...techs, ...techs, ...techs]

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
          gap:       '14px',
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
        gap:          '10px',
        padding:      '10px 22px',
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
        el.style.borderColor = 'rgba(220,38,38,0.5)'
        el.style.color       = 'var(--primary)'
        el.style.transform   = 'scale(1.06)'
        el.style.boxShadow   = '0 0 20px rgba(220,38,38,0.2)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.color       = 'var(--secondary)'
        el.style.transform   = 'scale(1)'
        el.style.boxShadow   = 'none'
      }}
    >
      <span className="flex items-center justify-center flex-shrink-0">
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

      <div className="relative w-full" style={{ zIndex: 1 }}>

        {/* Header */}
        <div
          ref={headerRef}
          className="w-full max-w-[1400px] mx-auto"
          style={{ marginBottom: '52px', paddingLeft: 'clamp(10px, 1.5vw, 24px)', paddingRight: 'clamp(10px, 1.5vw, 24px)' }}
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

        {/* 4 Marquee Rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <MarqueeRow techs={ROW1} direction="ltr" speed={30} />
          <MarqueeRow techs={ROW2} direction="rtl" speed={32} />
          <MarqueeRow techs={ROW3} direction="ltr" speed={28} />
          <MarqueeRow techs={ROW4} direction="rtl" speed={30} />
        </motion.div>

      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}

