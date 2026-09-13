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

/* ─── Authentic Original Brand Tech icon SVGs with Brand Colors ─── */
const TechIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Java: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#EA2D2E" d="M9.1 19.8s-.9.1-1.3.1c-1.8 0-3.1-.7-3.1-1.8 0-.9.8-1.5 2-1.8l.5.6c-.7.2-1.1.5-1.1.8 0 .4.8.8 2.2.8.3 0 .6 0 .8-.1l-.1 1.4z" />
        <path fill="#5382A1" d="M8.8 17.5c-1.2.2-2.3.9-2.3 1.7 0 1.2 1.9 1.9 4.3 1.9 1.7 0 3.3-.4 3.9-1.1.3-.4.2-.8-.2-1.1l-.4.5c.2.2.3.4.1.5-.4.4-1.8.8-3.4.8-2 0-3.3-.5-3.3-1.1 0-.3.4-.6 1.1-.8l.2-1.4z" />
        <path fill="#E76F00" d="M14.6 15.6c1.1-.6 1.8-1.4 1.8-2.2 0-1.8-2.6-3.2-6.5-3.2-1.3 0-2.5.2-3.4.5l.3 1.1c.8-.3 1.9-.4 3.1-.4 3.2 0 5.1 1 5.1 2 0 .5-.5 1-1.3 1.4l.9.8z" />
        <path fill="#5382A1" d="M13.2 11.2c.6-.7.9-1.5.9-2.3 0-2-2.5-3.6-6.1-3.6-1 0-1.9.1-2.7.3l.3 1.1c.7-.2 1.5-.3 2.4-.3 2.8 0 4.7 1.1 4.7 2.4 0 .6-.3 1.2-.8 1.7l1.3.7z" />
      </svg>
    ),
    Python: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#3776AB" d="M11.9 2c-3.1 0-4.9 1.4-4.9 3.2v2.4h5v.8H5.1C3.3 8.4 2 10.1 2 12.5s1.4 4.1 3.2 4.1h1.9v-2.7c0-2 1.6-3.6 3.6-3.6h5V8.8c0-1.8-1.5-3.3-3.3-3.3h-.7V2c.1 0 .1 0 .2 0zm-1.8 1.6c.4 0 .8.4.8.8s-.4.8-.8.8-.8-.4-.8-.8.4-.8.8-.8z" />
        <path fill="#FFD43B" d="M12.1 22c3.1 0 4.9-1.4 4.9-3.2v-2.4h-5v-.8h6.9c1.8 0 3.1-1.7 3.1-4.1s-1.4-4.1-3.2-4.1h-1.9v2.7c0 2-1.6 3.6-3.6 3.6h-5v1.5c0 1.8 1.5 3.3 3.3 3.3h.7V22h-.2zM13.9 20.4c-.4 0-.8-.4-.8-.8s.4-.8.8-.8.8.4.8.8-.4.8-.8.8z" />
      </svg>
    ),
    C: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#A8B9CC" d="M12 2a10 10 0 1 0 7.1 17.1l-2.4-2.4A6.6 6.6 0 1 1 18.6 12h3.4A10 10 0 0 0 12 2z" />
        <path fill="#00599C" d="M12 6a6 6 0 1 0 4.2 10.2l-1.8-1.8A3.5 3.5 0 1 1 15.5 12H18A6 6 0 0 0 12 6z" />
      </svg>
    ),
    JavaScript: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect width="24" height="24" rx="3" fill="#F7DF1E" />
        <path fill="#000000" d="M6.8 19.5l1.6-1c.4.7.8 1.2 1.6 1.2.8 0 1.3-.3 1.3-1.4V10H13v8.3c0 2.2-1.3 3.2-3.1 3.2-1.7 0-2.7-.9-3.1-2zM14.9 19.3l1.6-1c.4.8 1.1 1.4 2.1 1.4 1 0 1.6-.5 1.6-1.2 0-.8-.7-1.1-1.8-1.6-1.6-.7-2.7-1.5-2.7-3.3 0-1.7 1.3-3 3.2-3 1.4 0 2.4.5 3.1 1.8l-1.5 1c-.3-.6-.8-1-1.6-1-.7 0-1.2.4-1.2 1 0 .7.5 1 1.6 1.5 1.8.8 2.9 1.6 2.9 3.4 0 2-1.5 3.2-3.6 3.2-2 0-3.3-1-3.7-2.2z" />
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect width="24" height="24" rx="3" fill="#3178C6" />
        <path fill="#FFFFFF" d="M3.7 12.3h4.6V20H10v-7.7h4.6V10H3.7v2.3zm12.3 7.2c1.3 0 2.3-.4 3-1l-.9-1.5c-.5.4-1.2.7-1.9.7-.9 0-1.4-.4-1.4-1 0-.6.5-.9 1.5-1.3 1.7-.7 2.6-1.4 2.6-2.8 0-1.8-1.4-2.8-3.3-2.8-1.4 0-2.4.4-3.1 1l.9 1.5c.5-.4 1.2-.7 1.9-.7.8 0 1.3.4 1.3.9 0 .6-.5.8-1.5 1.2-1.6.6-2.5 1.4-2.5 2.8 0 1.9 1.4 3 3.4 3z" />
      </svg>
    ),
    React: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
    Vite: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#41D1FF" d="M19.7 3.5L12.5 21l-7.2-17.5 14.4 0z" />
        <path fill="#BD34FE" d="M15.4 3.5L12 18.5 7.5 3.5h7.9z" />
        <path fill="#FFD43B" d="M13 3.5L7.5 14h4l-1 6.5 6-10h-4l1-7z" />
      </svg>
    ),
    'Tailwind CSS': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#38BDF8" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
      </svg>
    ),
    'Node.js': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#5FA04E" d="M12 2l9 5.2v10.4L12 23 3 17.6V7.2L12 2z" />
        <path fill="#FFFFFF" d="M12 4.5l6.5 3.7v7.5L12 19.5l-6.5-3.8V8.2L12 4.5z" />
        <path fill="#333333" d="M12 6.2l4.8 2.8v5.6L12 17.4l-4.8-2.8V9L12 6.2z" />
      </svg>
    ),
    'Spring Boot': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#6DB33F" d="M21.5 9.3c-.6-1.5-1.9-2.7-3.4-3.3L12.9 2.5c-.6-.3-1.3-.3-1.8 0L5.9 6c-1.5.6-2.8 1.8-3.4 3.3-.6 1.5-.6 3.2 0 4.7.6 1.5 1.9 2.7 3.4 3.3l5.2 3.5c.3.2.6.2.9.2s.6-.1.9-.2l5.2-3.5c1.5-.6 2.8-1.8 3.4-3.3.6-1.5.6-3.2 0-4.7z" />
        <path fill="#FFFFFF" d="M16.5 11.2c-.2-.7-.7-1.3-1.4-1.7-.7-.4-1.5-.5-2.2-.3-.5.1-.9.4-1.2.7-.4-.3-.8-.5-1.3-.5-.7 0-1.4.3-1.9.8-.5.5-.8 1.2-.8 1.9 0 1.5 1.2 2.7 2.7 2.7.5 0 1-.2 1.4-.4.4.5 1 .8 1.6.8 1.2 0 2.2-.9 2.4-2.1l-1.3-.2c-.1.6-.6 1-1.1 1-.4 0-.7-.2-.9-.5.5-.4.8-1 .8-1.7 0-.3-.1-.6-.2-.9l1.3-.1zm-4.7 2.4c-.7 0-1.3-.6-1.3-1.3 0-.4.2-.7.4-1 .3-.3.6-.4 1-.4.4 0 .7.1 1 .4.2.3.4.6.4 1 0 .7-.7 1.3-1.5 1.3z" />
      </svg>
    ),
    HTML: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#E34F26" d="M2.8 2l1.7 19.1 7.5 2.1 7.5-2.1 1.7-19.1H2.8z" />
        <path fill="#EF652A" d="M12 21.3l6.1-1.7 1.4-15.8H12v17.5z" />
        <path fill="#EBEBEB" d="M12 7.7H7.3l.3 3.6h4.4V7.7zm0 5.4H9.4l.2 2.4L12 16v2.1l-4.1-1.1-.3-4H12v.1z" />
        <path fill="#FFFFFF" d="M12 7.7v3.6h4.1l-.4 4.5L12 16.9v2.1l4.1-1.1.7-8.2l.2-2H12z" />
      </svg>
    ),
    CSS: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#1572B6" d="M2.8 2l1.7 19.1 7.5 2.1 7.5-2.1 1.7-19.1H2.8z" />
        <path fill="#33A9DC" d="M12 21.3l6.1-1.7 1.4-15.8H12v17.5z" />
        <path fill="#EBEBEB" d="M12 7.7H7.3l.3 3.6h4.4V7.7zm0 5.4H7.8l.3 3.6h3.9V13.1z" />
        <path fill="#FFFFFF" d="M12 7.7v3.6h4.1l-.4 4.5L12 16.9v2.1l4.1-1.1.7-8.2l.2-2H12z" />
      </svg>
    ),
    MySQL: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#00758F" d="M12.5 4.5c-4.4 0-8 3.6-8 8 0 2.2.9 4.2 2.3 5.7l1.1-1.1c-1.1-1.2-1.8-2.8-1.8-4.6 0-3.5 2.9-6.4 6.4-6.4 2.8 0 5.1 1.8 6 4.3l1.5-.5c-1.1-3.2-4.2-5.4-7.5-5.4z" />
        <path fill="#F29111" d="M17.8 12.5c0 2.9-2.4 5.3-5.3 5.3-1.6 0-3-.7-4-1.8l-1.1 1.1c1.3 1.4 3.1 2.3 5.1 2.3 3.8 0 6.9-3.1 6.9-6.9 0-.8-.1-1.5-.4-2.2l-1.5.5c.2.5.3 1.1.3 1.7z" />
      </svg>
    ),
    PostgreSQL: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#336791" d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6.1 9.1-.1-.7-.1-1.6.2-2.3l1.3-5.4c-.3-.7-.5-1.5-.5-2.4 0-2.3 1.3-4 3-4 1.4 0 2.1 1.1 2.1 2.3 0 1.4-.9 3.5-1.4 5.5-.4 1.7.8 3 2.5 3 3 0 5-3.2 5-7.1 0-3.7-2.7-6.3-6.5-6.3-4.4 0-7 3.3-7 6.7 0 1.3.5 2.8 1.2 3.6.1.2.1.3.1.5-.1.5-.4 1.7-.5 1.9-.1.3-.2.4-.6.2C4.8 15.5 4 13.5 4 11.8 4 7.6 7.4 3.8 13.5 3.8c5 0 8.5 3.6 8.5 7.9 0 5-3.1 8.8-7.5 8.8-1.5 0-2.9-.8-3.3-1.7l-.9 3.5c-.3 1.3-1.2 2.9-1.8 3.8 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ),
    'Firebase Firestore': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#FFA611" d="M4.6 17.5L7.2 2.6c.1-.5.7-.7 1-.3l3.5 6.5-7.1 8.7z" />
        <path fill="#F57C00" d="M12.5 10.4l2.5-4.8c.2-.4.8-.4 1 0l3.4 11.9-6.9-7.1z" />
        <path fill="#FFCA28" d="M4.6 17.5l7.5 4.2c.5.3 1.1.3 1.6 0l7.7-4.2-4.6-9.8-12.2 9.8z" />
      </svg>
    ),
    Git: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#F05032" d="M21.6 10.6l-8.2-8.2c-.8-.8-2-.8-2.8 0L8.7 4.3l3.5 3.5c.8-.3 1.8-.1 2.4.5.6.6.8 1.6.5 2.4l3.4 3.4c.8-.3 1.8-.1 2.4.5.8.8.8 2 0 2.8s-2 .8-2.8 0c-.6-.6-.8-1.6-.5-2.4l-3.2-3.2v5.2c.4.3.7.8.7 1.4 0 1.1-.9 2-2 2s-2-.9-2-2c0-.6.3-1.1.7-1.4V8.5c-.4-.3-.7-.8-.7-1.4 0-.7.3-1.3.8-1.6L4.3 8.7l-1.9 1.9c-.8.8-.8 2 0 2.8l8.2 8.2c.8.8 2 .8 2.8 0l8.2-8.2c.8-.8.8-2 0-2.8z" />
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    'VS Code': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#0065A9" d="M16.5 2L5 10.5 2 8l2-2 12.5-4L16.5 2z" />
        <path fill="#007ACC" d="M16.5 22L5 13.5 2 16l2 2 12.5 4L16.5 22z" />
        <path fill="#1F9CF0" d="M16.5 2L7 9.5l9.5 7.5 5.5-4.5V6.5L16.5 2z" />
      </svg>
    ),
    'IntelliJ IDEA': (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect width="24" height="24" rx="4" fill="#000000" />
        <path fill="#FE315D" d="M2.5 17.5l2.4-7.8L11 8.2l-3.3 9.3H2.5z" />
        <path fill="#FDB60D" d="M9.8 2.5l5.7 3.8-3.4 5.3-6.2-1.9L9.8 2.5z" />
        <path fill="#087CFA" d="M21.5 8.2L15.3 4.5l-4.2 6.8 6.5 4.5 3.9-7.6z" />
        <path fill="#21D789" d="M13.5 21.5l8-4.2-3.9-7.6-6.4 2.8 2.3 9z" />
        <rect x="5.5" y="16" width="6" height="2" fill="#FFFFFF" />
      </svg>
    ),
    Canva: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="11" fill="#00C4CC" />
        <path fill="#FFFFFF" d="M15.5 9.2c-.7-.8-1.7-1.2-2.8-1.2-2.3 0-4.2 1.8-4.2 4.1 0 2.2 1.8 4 4.1 4 1.2 0 2.3-.5 3-1.4l-1.3-1c-.5.6-1.1.9-1.7.9-1.3 0-2.4-1-2.4-2.5 0-1.4 1.1-2.6 2.5-2.6.7 0 1.2.3 1.6.7l1.2-1z" />
      </svg>
    ),
  }
  return <>{icons[name] ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18"><circle cx="12" cy="12" r="9" /></svg>}</>
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

