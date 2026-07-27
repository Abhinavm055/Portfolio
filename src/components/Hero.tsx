/**
 * Hero — Cinematic Three-Layer Parallax Landing Section
 *
 * Layer depths:
 *   Layer 1 (Back)   — CinematicBG mountains (handled in CinematicBG.tsx)
 *   Layer 2 (Middle) — "ABHINAV" typography: FIXED, no scroll movement
 *   Layer 3 (Front)  — Anime character: FIXED at the bottom, no scroll movement
 *
 * All layers are now static for a clean, locked composition.
 */
import { memo, useRef } from 'react'
import abhinavAnimeImg from '../assets/abhinav_anime.jpg'

interface HeroProps {
  isIntroComplete?: boolean
}

function Hero({ isIntroComplete: _isIntroComplete = false }: HeroProps) {
  const sectionRef   = useRef<HTMLElement>(null)
  const textRef      = useRef<HTMLDivElement>(null)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        zIndex: 10,
        userSelect: 'none',
      }}
    >
      {/* ── LAYER 2: ABHINAV TYPOGRAPHY (position: fixed — stays on screen while scrolling) ── */}
      <div
        ref={textRef}
        className="pointer-events-none"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          padding: '0 6vw',
          transform: 'translateY(-12vh)',
        }}
      >
        <h1
          className="font-shuriken"
          style={{
            fontSize:             'clamp(60px, 18vw, 260px)',
            fontWeight:           400,
            backgroundImage:      'linear-gradient(180deg, #FF6547 0%, #E5483F 15%, #991B1B 50%, #000000 95%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            letterSpacing:        '0.04em',
            lineHeight:           0.85,
            whiteSpace:           'nowrap',
            textTransform:        'uppercase',
            textAlign:            'center',
            maxWidth:             '96vw',
            filter:               'drop-shadow(0 8px 25px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 45px rgba(229, 72, 63, 0.45))',
          }}
        >
          ABHINAV
        </h1>
      </div>

      {/* ── LAYER 3: ANIME CHARACTER (fixed at bottom) ──── */}
      <div
        className="absolute flex items-end justify-center"
        style={{
          bottom:     0,
          left:       '50%',
          marginLeft: 'calc(-1 * clamp(320px, 45vw, 600px) / 2)',
          zIndex:     2,
          height:     'clamp(500px, 84vh, 900px)',
          width:      'clamp(320px, 45vw, 600px)',
        }}
      >
        <img
          src={abhinavAnimeImg}
          alt="Abhinav — Anime Character"
          decoding="async"
          className="h-full w-auto object-contain object-bottom"
          style={{
            filter:       'contrast(1.08) brightness(0.96)',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    </section>
  )
}

export default memo(Hero)
