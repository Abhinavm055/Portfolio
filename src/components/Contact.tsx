/**
 * Contact — Cinematic Ending with Full Landscape Background.
 *
 * Background: assets/contact_landscape.png with rgba(8, 8, 8, 0.55) dark overlay.
 * Parallax: Subtle 15px upward drift slower than content.
 * Content: Centered editorial layout with Let's Connect heading, bio text, contact buttons, footer.
 */
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import contactLandscape from '../assets/contact_landscape.png'

gsap.registerPlugin(ScrollTrigger)

const contactLinks = [
  {
    label: 'Email',
    href:  'mailto:malayilabhinav16@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/in/malayil-abhinav',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <path d="M7 10v7M7 7v.01M12 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M12 10v7" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href:  'https://github.com/Abhinavm055',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label:   'Resume',
    href:    '/resume.pdf',
    primary: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' })

  /* Parallax: background drifts 15px slower than content */
  useEffect(() => {
    const section = sectionRef.current
    const bg      = bgRef.current
    if (!section || !bg) return

    const tween = gsap.to(bg, {
      y: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   true,
      },
    })

    return () => tween.scrollTrigger?.kill()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden h-[100dvh] flex flex-col justify-between"
      style={{
        backgroundColor: '#080808',
        zIndex:          50,
        paddingTop:      'clamp(32px, 5vh, 64px)',
        paddingBottom:   'clamp(20px, 3vh, 32px)',
        boxSizing:       'border-box',
      }}
    >
      {/* FULL LANDSCAPE BACKGROUND WITH 15PX PARALLAX DRIFT */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          backgroundImage:    `url(${contactLandscape})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat:   'no-repeat',
          zIndex:             0,
        }}
      >
        {/* Subtle dark overlay: rgba(8, 8, 8, 0.55) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(8, 8, 8, 0.55)',
          }}
        />
      </div>

      {/* CONTENT CONTAINER — CENTERED VERTICALLY & HORIZONTALLY */}
      <div
        className="relative w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 flex-1 flex flex-col justify-center items-center text-center"
        style={{ zIndex: 1, gap: 'clamp(20px, 3vh, 40px)' }}
      >
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
          className="section-label"
        >
          Let's Connect
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2
            className="font-clash text-primary"
            style={{
              fontSize:      'clamp(38px, 5.5vw, 76px)',
              letterSpacing: '-0.02em',
              lineHeight:    1.05,
              maxWidth:      '850px',
            }}
          >
            Ready to Build<br />
            <span style={{ color: 'var(--accent)' }}>Something</span><br />
            Remarkable?
          </h2>
        </motion.div>

        {/* Subtitle / Bio Text */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          style={{
            maxWidth:   '500px',
            color:      'var(--secondary)',
            fontSize:   'clamp(14px, 1.1vw, 16px)',
            lineHeight: 1.7,
          }}
        >
          I'm always open to new opportunities, collaborations, and interesting problems.
          If you think we'd work well together, let's talk.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-wrap gap-4 justify-center pt-1"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`contact-${link.label.toLowerCase()}`}
              target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={link.primary ? 'btn btn-primary' : 'btn'}
              style={{ padding: '12px 28px', fontSize: '13px' }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="relative w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.4 }}
          style={{
            width:       '100%',
            paddingTop:  '20px',
            borderTop:   '1px solid var(--border)',
            marginTop:   'auto',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-clash" style={{ fontSize: '24px', letterSpacing: '-0.01em', color: 'var(--primary)' }}>
              M. ABHINAV
            </div>
            <div className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--secondary)', textTransform: 'uppercase' }}>
              © 2025 · Software · Design · Fullstack · AI · India
            </div>
            <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(157,157,157,0.3)', textTransform: 'uppercase' }}>
              The Last Sun
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
