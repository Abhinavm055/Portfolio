import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * IntroScreen — Ultra-Fast 3-Second Multilingual Greeting Experience
 * 
 * Specs:
 * - Total duration: Exactly 3.0 seconds.
 * - Greetings stream: 2.2 seconds (35 greetings at ~60ms each).
 * - Smooth continuous counter: 000% -> 100% over 2.2s.
 * - Curtain reveal: 0.8 seconds (yPercent: -100, power4.inOut).
 */

const GREETINGS = [
  // ── Global Languages (Start) ──
  'Bonjour',       // French
  'こんにちは',     // Japanese
  'Hola',          // Spanish
  'Ciao',          // Italian
  'Hallo',         // German
  '안녕하세요',     // Korean
  'Olá',           // Portuguese
  'Привет',        // Russian
  '你好',           // Chinese
  'Hej',           // Swedish
  'Xin chào',      // Vietnamese
  'Merhaba',       // Turkish
  'สวัสดี',        // Thai
  'Γειά σου',      // Greek

  // ── Known & Cherished Greetings (Middle) ──
  'Hello',         // English
  'வணக்கம்',        // Tamil (Vanakkam)
  'നമസ്കാരം',       // Malayalam (Namaskaram)
  'नमस्कार',        // Marathi (Namaskar)
  'नमस्ते',         // Hindi (Namaste)
  'నమస్కారం',      // Telugu (Namaskaram)
  'ನಮಸ್ಕಾರ',       // Kannada (Namaskara)

  // ── Global Languages (End) ──
  'হ্যালো',         // Bengali
  'નમસ્તે',        // Gujarati
  'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',   // Punjabi
  'السلام علیکم',   // Urdu
  'مرحبا',         // Arabic
  'Hei',           // Finnish
  'Cześć',         // Polish
  'Ahoj',          // Czech
  'Szia',          // Hungarian
  'Salut',         // Romanian
  'Halo',          // Indonesian
  'Kamusta',       // Filipino
  'Jambo',         // Swahili
  'שלום',          // Hebrew
]

interface IntroScreenProps {
  onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef      = useRef<HTMLSpanElement | null>(null)
  const counterRef   = useRef<HTMLDivElement | null>(null)
  const [contentVisible, setContentVisible] = useState(true)

  // Disable scroll while Intro is active, restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Run Cinematic GSAP Timeline using gsap.context for React 18 / Strict Mode safety
  useEffect(() => {
    const container = containerRef.current
    const textEl    = textRef.current
    const counterEl = counterRef.current
    if (!container || !textEl) return

    const ctx = gsap.context(() => {
      // Set initial text state
      gsap.set(textEl, {
        opacity: 0,
        scale: 0.94,
        filter: 'blur(14px)',
        textShadow: '0 0 24px rgba(255, 255, 255, 0.45)',
      })

      const GREETINGS_DURATION = 2.2 // 2.2 seconds for greetings stream

      // Smooth continuous 0% -> 100% counter animation over 2.2s
      const counterObj = { value: 0 }
      gsap.to(counterObj, {
        value: 100,
        duration: GREETINGS_DURATION,
        ease: 'none',
        onUpdate: () => {
          if (counterEl) {
            const currentPct = Math.min(100, Math.floor(counterObj.value))
            counterEl.textContent = `${String(currentPct).padStart(3, '0')}%`
          }
        },
      })

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })

      // Animate 35 greetings in ultra-fast succession (~60ms per greeting)
      GREETINGS.forEach((greeting, index) => {
        tl.add(() => {
          if (textEl) textEl.textContent = greeting
        })

        // Ultra-fast smooth emergence (25ms)
        tl.to(textEl, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
          duration: 0.025,
          ease: 'power2.out',
        })

        // Micro hold (15ms)
        tl.to({}, { duration: 0.015 })

        // Immediate blur-fade out into next greeting (25ms)
        if (index < GREETINGS.length - 1) {
          tl.to(textEl, {
            opacity: 0,
            scale: 1.04,
            filter: 'blur(14px)',
            textShadow: '0 0 0px transparent',
            duration: 0.025,
            ease: 'power2.in',
          })
        } else {
          // Final greeting dissolves smoothly into pure black at 100%
          tl.to(textEl, {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(16px)',
            textShadow: '0 0 0px transparent',
            duration: 0.04,
            ease: 'power2.in',
          })
        }
      })

      // Upward curtain reveal (0.8s) -> Total Intro = 2.2s + 0.8s = 3.0s
      tl.to(container, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onStart: () => {
          setContentVisible(false)
        },
      })
    }, containerRef)

    return () => {
      ctx.revert() // Clean up timeline on unmount / Strict Mode re-render
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080808',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'transform',
        userSelect: 'none',
      }}
    >
      {contentVisible && (
        <>
          {/* Centered Multilingual Greeting Typography */}
          <span
            ref={textRef}
            style={{
              fontFamily: "Geist, 'Clash Display', 'Helvetica Neue', sans-serif",
              fontSize: 'clamp(44px, 8vw, 96px)',
              fontWeight: 600,
              color: '#F5F5F5',
              letterSpacing: '0.05em',
              lineHeight: 1,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              willChange: 'transform, opacity, filter',
            }}
          >
            {GREETINGS[0]}
          </span>

          {/* Bottom-Right Corner Continuous Loading Counter (000% -> 100%) */}
          <div
            ref={counterRef}
            style={{
              position: 'absolute',
              bottom: 'clamp(24px, 4vh, 48px)',
              right: 'clamp(24px, 4vw, 48px)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(11px, 1vw, 14px)',
              letterSpacing: '0.24em',
              color: 'rgba(255, 255, 255, 0.45)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            000%
          </div>
        </>
      )}
    </div>
  )
}
