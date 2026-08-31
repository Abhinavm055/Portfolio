/**
 * Projects — Premium Product Showcase
 *
 * One project visible at a time inside a large centered showcase box.
 * Arrow navigation triggers GSAP slide transitions (left/right, ~0.6s).
 * All project slides are pre-mounted in the DOM with display:none so
 * images are preloaded; only the active slide is display:flex.
 * isAnimating ref prevents any double-trigger during a transition.
 */
import { useRef, useState, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import projectMockup from '../assets/project_mockup_cric.png'

/* ─── Project Data ──────────────────────────────────────── */
const PROJECTS = [
  {
    id: '01',
    name: 'CricAuctionIPL',
    tagline: 'Real-Time IPL Auction Simulator',
    category: 'Full Stack Web Application',
    year: '2025',
    description:
      'Developed a real-time IPL auction platform that allows users to participate in live multiplayer auctions and AI-powered mock auctions. The application simulates the complete IPL player auction process with live bidding, team management, administrative controls, and a realistic auction experience.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Node.js'],
    status: { label: 'Production Ready', color: '#6ee7b7' },
    live: 'https://cricauctionipl.web.app/',
    source: 'https://github.com/Abhinavm055/CricAuctionIPL',
    image: projectMockup,
  },
  {
    id: '02',
    name: 'CoLiviMates',
    tagline: 'Roommate & Housing Finder Platform',
    category: 'Full Stack Web Application',
    year: '2024',
    description:
      'A full-stack roommate finding and co-living platform that connects like-minded people and makes finding suitable housing and roommates easier.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Neon PostgreSQL'],
    status: { label: 'Production Ready', color: '#6ee7b7' },
    live: 'https://co-livi-mates.vercel.app/',
    source: 'https://github.com/Abhinavm055/CoLiviMates',
    image: null,
  },
  {
    id: '03',
    name: 'AegisAI',
    tagline:
      'LLM-Augmented Multi-Agent Cyber Threat Intelligence and Automated Incident Response Platform',
    category: 'AI & Cybersecurity Platform',
    year: '2025',
    description:
      'AegisAI is an AI-powered cybersecurity platform that acts as an intelligent analysis and orchestration layer over existing security infrastructure. It analyzes security logs from multiple sources, correlates suspicious events, assesses threat severity, generates explainable AI-driven security insights, and enables policy-controlled automated responses such as IP blocking, user account locking, alerts, and incident creation.',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Spring Boot',
      'Java',
      'Python',
      'LLMs',
      'Multi-Agent AI',
      'PostgreSQL',
      'Docker',
    ],
    status: { label: 'Production Ready', color: '#6ee7b7' },
    live: 'https://aegisai-cyber.vercel.app/',
    source: 'https://github.com/Abhinavm055/AegisAI',
    image: null,
  },
  {
    id: '04',
    name: 'Talvyn',
    tagline: 'Career Intelligence & Job Application Assistant',
    category: 'Full Stack Career Intelligence Platform',
    year: '2025',
    description:
      'Built a full-stack career intelligence platform that combines a React/TypeScript SaaS dashboard with a Node.js/Express API, PostgreSQL/Prisma data layer, and Manifest V3 browser extension. Talvyn helps users discover and evaluate job opportunities, manage resumes and profiles, score jobs against their skills and career preferences, track applications, and automate repetitive application workflows.',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'React Router',
      'TanStack Query',
      'Zustand',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Prisma',
      'JWT',
      'Google OAuth',
      'Manifest V3',
      'Chrome Extension APIs',
    ],
    status: { label: 'Production Ready', color: '#6ee7b7' },
    live: 'https://talvyn.vercel.app/',
    source: 'https://github.com/Abhinavm055/Talvyn',
    image: null,
  },
]

const TOTAL = PROJECTS.length

/* ─── Placeholder for projects without a screenshot ─────── */
function PlaceholderImage({ name }: { name: string }) {
  return (
    <div
      style={{
        width:          '100%',
        height:         '100%',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
        overflow:       'hidden',
        background:     '#0d0d0d',
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />
      <span
        style={{
          fontFamily:    'Clash Display, Georgia, serif',
          fontSize:      'clamp(32px, 5vw, 72px)',
          fontWeight:    700,
          color:         'rgba(255,255,255,0.035)',
          letterSpacing: '-0.04em',
          position:      'relative',
          zIndex:        1,
          userSelect:    'none',
        }}
      >
        {name}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const isAnimating  = useRef(false)
  const slideRefs    = useRef<(HTMLDivElement | null)[]>([])
  const activeIdxRef = useRef(0)

  // Keep ref in sync
  activeIdxRef.current = activeIdx

  /* ── GSAP slide transition with scale (0.98 -> 1), fade (0 -> 1), and horizontal slide ── */
  const goToProject = useCallback((targetIdx: number, direction: 'next' | 'prev') => {
    if (isAnimating.current || targetIdx === activeIdxRef.current) return
    if (targetIdx < 0 || targetIdx >= TOTAL) return

    const currentIdx = activeIdxRef.current
    const currentEl = slideRefs.current[currentIdx]
    const nextEl    = slideRefs.current[targetIdx]
    if (!currentEl || !nextEl) return

    isAnimating.current = true

    const xOut = direction === 'next' ? '-60px' : '60px'
    const xIn  = direction === 'next' ? '60px' : '-60px'

    // Prepare incoming slide
    gsap.set(nextEl, { x: xIn, opacity: 0, scale: 0.98, display: 'flex' })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentEl, { display: 'none', x: 0, opacity: 1, scale: 1 })
        setActiveIdx(targetIdx)
        isAnimating.current = false
      },
    })

    // Outgoing slide
    tl.to(currentEl, {
      x:        xOut,
      opacity:  0,
      scale:    0.98,
      duration: 0.7,
      ease:     'power2.inOut',
    }, 0)

    // Incoming slide
    tl.to(nextEl, {
      x:        0,
      opacity:  1,
      scale:    1,
      duration: 0.7,
      ease:     'power2.inOut',
    }, 0.04)
  }, [])

  const navigate = useCallback((direction: 'next' | 'prev') => {
    const nextIdx =
      direction === 'next'
        ? (activeIdxRef.current + 1) % TOTAL
        : (activeIdxRef.current - 1 + TOTAL) % TOTAL

    goToProject(nextIdx, direction)

    // Sync SceneSnapController
    window.dispatchEvent(
      new CustomEvent('portfolio:sync-project', {
        detail: { index: nextIdx },
      })
    )
  }, [goToProject])

  /* ── Event Listener for SceneSnapController horizontal scroll progression ── */
  useEffect(() => {
    const handleSetProject = (e: Event) => {
      const customEvt = e as CustomEvent<{ index: number; direction: 'next' | 'prev' }>
      if (typeof customEvt.detail?.index === 'number') {
        const target = customEvt.detail.index
        const dir = customEvt.detail.direction || (target > activeIdxRef.current ? 'next' : 'prev')
        goToProject(target, dir)
      }
    }

    window.addEventListener('portfolio:set-project', handleSetProject)
    return () => {
      window.removeEventListener('portfolio:set-project', handleSetProject)
    }
  }, [goToProject])

  /* ── Touch / Mouse Swipe Gestures ── */
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY
    touchStartX.current = clientX
    touchStartY.current = clientY
  }

  const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.PointerEvent).clientX
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.PointerEvent).clientY

    const deltaX = clientX - touchStartX.current
    const deltaY = clientY - touchStartY.current

    // Horizontal swipe threshold
    const SWIPE_THRESHOLD = 40
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        // Swiped right-to-left -> Next project
        navigate('next')
      } else {
        // Swiped left-to-right -> Previous project
        navigate('prev')
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <section
      id="projects"
      style={{
        position:        'relative',
        width:           '100%',
        height:          '100vh',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        background:      '#080808',
        zIndex:          30,
        padding:         'clamp(20px, 3vh, 40px) clamp(16px, 4vw, 48px)',
        boxSizing:       'border-box',
      }}
    >
      {/* ── Section label ── */}
      <h2
        className="font-clash"
        style={{
          position:      'absolute',
          top:           'clamp(10px, 1.8vh, 24px)',
          left:          'clamp(10px, 1.5vw, 24px)',
          fontSize:      'clamp(38px, 5vw, 54px)',
          letterSpacing: '-0.01em',
          lineHeight:    1.1,
          margin:        0,
        }}
      >
        <span style={{ color: '#FFFFFF' }}>My </span>
        <span style={{ color: '#B22222' }}>Works</span>
      </h2>

      {/* ── Counter & Chapter Dot Indicator ── */}
      <div
        style={{
          position:      'absolute',
          top:           'clamp(10px, 1.8vh, 24px)',
          right:         'clamp(10px, 1.5vw, 24px)',
          display:       'flex',
          alignItems:    'center',
          gap:           '14px',
        }}
      >
        {/* Dot Indicators */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              style={{
                width:        i === activeIdx ? '16px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                background:   i === activeIdx ? '#B22222' : 'rgba(255,255,255,0.18)',
                transition:   'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>

        {/* Text Counter */}
        <div
          style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '9px',
            letterSpacing: '0.28em',
            color:         'rgba(255,255,255,0.22)',
          }}
        >
          {String(activeIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SHOWCASE ROW  ←  chevron | card | chevron  →
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:         'clamp(24px, 3.5vw, 40px)',
          width:       '100%',
          maxWidth:    '1200px',
          marginTop:   'clamp(16px, 2.5vh, 28px)',
          flexShrink:  0,
        }}
      >
        {/* Left chevron */}
        <ChevronArrow id="projects-prev" direction="prev" onClick={() => navigate('prev')} />

        {/* ── SHOWCASE CARD ── */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handleTouchStart}
          onPointerUp={handleTouchEnd}
          style={{
            position:     'relative',
            flex:         '1 1 0',
            minWidth:     0,
            height:       'min(76vh, 680px)',
            borderRadius: '24px',
            border:       '1px solid #2a2a2a',
            overflow:     'hidden',
            background:   '#0e0e0e',
            boxShadow:    '0 32px 96px rgba(0,0,0,0.65), 0 8px 32px rgba(0,0,0,0.45)',
            touchAction:  'pan-y',
            userSelect:   'none',
          }}
        >
        {/* All slides pre-mounted for image preloading */}
        {PROJECTS.map((proj, i) => (
          <div
            key={proj.id}
            ref={(el) => { slideRefs.current[i] = el }}
            style={{
              position:      'absolute',
              inset:         0,
              display:       i === 0 ? 'flex' : 'none',
              flexDirection: 'column',
              willChange:    'transform, opacity',
            }}
          >
            {/* ── Image panel (top ~58%) ── */}
            <div
              data-cursor="project"
              style={{
                flex:        '0 0 48%',
                position:    'relative',
                overflow:    'hidden',
                borderBottom:'1px solid #1e1e1e',
                background:  '#0a0a0a',
              }}
            >
              {proj.image ? (
                <img
                  src={proj.image}
                  alt={`${proj.name} preview`}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width:     '100%',
                    height:    '100%',
                    objectFit: 'cover',
                    filter:    'brightness(0.82) contrast(1.05) saturate(0.88)',
                    display:   'block',
                  }}
                />
              ) : (
                <PlaceholderImage name={proj.name} />
              )}

              {/* Image overlay vignette */}
              <div
                style={{
                  position:   'absolute',
                  inset:      0,
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(14,14,14,0.6) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ── Info panel (bottom ~42%) ── */}
            <div
              style={{
                flex:          '1 1 0',
                display:       'flex',
                padding:       'clamp(20px, 3vh, 32px) clamp(24px, 3.5vw, 40px)',
                gap:           'clamp(24px, 3.5vw, 52px)',
                overflow:      'hidden',
              }}
            >
              {/* Left column: title + buttons row + subtitle + status + description */}
              <div
                style={{
                  flex:          '1 1 0',
                  display:       'flex',
                  flexDirection: 'column',
                  minWidth:      0,
                }}
              >
                {/* Project number */}
                <div
                  style={{
                    fontFamily:    'JetBrains Mono, monospace',
                    fontSize:      '10px',
                    letterSpacing: '0.3em',
                    color:         'rgba(255,255,255,0.24)',
                    marginBottom:  '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {proj.id} / {String(TOTAL).padStart(2, '0')}
                </div>

                {/* Title & Action Buttons Row (side-by-side without large gap) */}
                <div
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    flexWrap:       'wrap',
                    gap:            '20px',
                    marginBottom:   '10px',
                  }}
                >
                  <h2
                    className="font-clash"
                    style={{
                      fontSize:      'clamp(22px, 3vw, 36px)',
                      fontWeight:    600,
                      letterSpacing: '-0.03em',
                      lineHeight:    1.08,
                      color:         '#f0f0f0',
                      margin:        0,
                    }}
                  >
                    {proj.name}
                  </h2>

                  {/* Compact Action Buttons placed directly next to title */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ShowcaseButton
                      href={proj.live}
                      id={`projects-view-${proj.id}`}
                      label="View Project"
                      external
                      icon={
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M1 9L9 1M9 1H3.5M9 1V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      }
                    />
                    <ShowcaseButton
                      href={proj.source}
                      id={`projects-github-${proj.id}`}
                      label="Source Code"
                      external
                    />
                  </div>
                </div>

                {/* Subtitle & Status Badge Row */}
                <div
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '14px',
                    flexWrap:      'wrap',
                    marginBottom:  '18px',
                  }}
                >
                  <div
                    style={{
                      fontFamily:    'JetBrains Mono, monospace',
                      fontSize:      'clamp(9px, 0.75vw, 11px)',
                      letterSpacing: '0.22em',
                      color:         'rgba(255,255,255,0.3)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {proj.tagline}
                  </div>

                  <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px' }}>•</span>

                  {/* Status Badge next to subtitle */}
                  <div
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '6px',
                    }}
                  >
                    <span
                      style={{
                        width:        '6px',
                        height:       '6px',
                        borderRadius: '50%',
                        background:   proj.status.color,
                        flexShrink:   0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily:    'JetBrains Mono, monospace',
                        fontSize:      '9px',
                        letterSpacing: '0.22em',
                        color:         'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {proj.status.label}
                    </span>
                  </div>
                </div>

                {/* Description — complete text, high legibility */}
                <p
                  style={{
                    fontFamily:     'Geist, Helvetica Neue, Arial, sans-serif',
                    fontSize:       'clamp(13px, 1vw, 15px)',
                    lineHeight:     1.65,
                    color:          'rgba(255, 255, 255, 0.76)',
                    margin:         0,
                    display:        '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow:       'hidden',
                  }}
                >
                  {proj.description}
                </p>
              </div>

              {/* Right column: Year + Tech Stack */}
              <div
                style={{
                  flexShrink:    0,
                  width:         'clamp(120px, 14vw, 180px)',
                  display:       'flex',
                  flexDirection: 'column',
                  borderLeft:    '1px solid #1e1e1e',
                  paddingLeft:   'clamp(16px, 2vw, 28px)',
                  gap:           '16px',
                  overflowY:     'auto',
                  scrollbarWidth:'none',
                }}
              >
                {/* Year Section */}
                <div>
                  <div
                    style={{
                      fontFamily:    'JetBrains Mono, monospace',
                      fontSize:      '8px',
                      letterSpacing: '0.38em',
                      color:         'rgba(255,255,255,0.18)',
                      textTransform: 'uppercase',
                      marginBottom:  '6px',
                    }}
                  >
                    Year
                  </div>
                  <div
                    style={{
                      fontFamily:    'JetBrains Mono, monospace',
                      fontSize:      '12px',
                      letterSpacing: '0.12em',
                      color:         'rgba(255,255,255,0.65)',
                    }}
                  >
                    {proj.year}
                  </div>
                </div>

                {/* Stack Section */}
                <div>
                  <div
                    style={{
                      fontFamily:    'JetBrains Mono, monospace',
                      fontSize:      '8px',
                      letterSpacing: '0.38em',
                      color:         'rgba(255,255,255,0.18)',
                      textTransform: 'uppercase',
                      marginBottom:  '10px',
                    }}
                  >
                    Stack
                  </div>
                  <div
                    style={{
                      display:       'flex',
                      flexDirection: 'column',
                      gap:           'clamp(6px, 1vh, 9px)',
                    }}
                  >
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily:    'JetBrains Mono, monospace',
                          fontSize:      'clamp(10px, 0.82vw, 12px)',
                          letterSpacing: '0.04em',
                          color:         'rgba(255,255,255,0.38)',
                          whiteSpace:    'nowrap',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        {/* /SHOWCASE CARD */}

        {/* Right chevron */}
        <ChevronArrow id="projects-next" direction="next" onClick={() => navigate('next')} />
      </div>
      {/* /SHOWCASE ROW */}
    </section>
  )
}

/* ─── Chevron Arrow — bare, no background, vertically centered ─ */
function ChevronArrow({
  id,
  direction,
  onClick,
}: {
  id: string
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  const isNext = direction === 'next'

  return (
    <button
      id={id}
      onClick={onClick}
      aria-label={isNext ? 'Next project' : 'Previous project'}
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        background:      'none',
        border:          'none',
        padding:         '8px',
        cursor:          'none',
        color:           '#8A8A8A',
        opacity:         0.7,
        flexShrink:      0,
        transition:      'color 0.25s ease, opacity 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color     = '#ffffff'
        e.currentTarget.style.opacity   = '1'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color     = '#8A8A8A'
        e.currentTarget.style.opacity   = '0.7'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
    >
      {/* Chevron SVG — 30px, no shaft, just the > or < shape */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {isNext ? (
          <polyline
            points="9 6 15 12 9 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points="15 6 9 12 15 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

/* ─── Showcase Button ───────────────────────────────────── */
function ShowcaseButton({
  href,
  id,
  label,
  icon,
  external = false,
}: {
  href: string
  id: string
  label: string
  icon?: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      id={id}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '6px',
        padding:        '8px 16px',
        border:         '1px solid rgba(255,255,255,0.1)',
        borderRadius:   '7px',
        fontFamily:     'JetBrains Mono, monospace',
        fontSize:       'clamp(8px, 0.7vw, 10px)',
        letterSpacing:  '0.16em',
        color:          'rgba(255,255,255,0.4)',
        background:     'transparent',
        cursor:         'none',
        textDecoration: 'none',
        textTransform:  'uppercase',
        transition:     'border-color 0.25s ease, color 0.25s ease',
        whiteSpace:     'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
        e.currentTarget.style.color       = 'rgba(255,255,255,0.8)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.color       = 'rgba(255,255,255,0.4)'
      }}
    >
      {label}
      {icon}
    </a>
  )
}
