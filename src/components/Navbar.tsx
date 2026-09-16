import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLenis } from './SmoothScroll'

const links = [
  { label: 'Home',    href: '#home'         },
  { label: 'About',   href: '#about'        },
  { label: 'Work',    href: '#projects'     },
  { label: 'Tech',    href: '#technologies' },
  { label: 'Contact', href: '#contact'      },
]

export default function Navbar() {
  const [active, setActive]   = useState('home')
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'open-to-work', 'technologies', 'contact']
      let current = 'home'
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = id
          break
        }
      }
      setActive(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(href, { duration: 0.85 })
    } else {
      document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[9000] flex items-center justify-center px-8"
      style={{
        paddingTop:    'clamp(20px, 3vh, 32px)',
        paddingBottom: 'clamp(16px, 2.5vh, 28px)',
        background:    'transparent',
        backdropFilter:'none',
        pointerEvents: 'none',
      }}
    >
      {/* Center navigation links */}
      <div className="flex items-center gap-7 md:gap-11 pointer-events-auto">
        {links.map((link) => {
          const isActive = active === link.href.replace('#', '')
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="relative py-1 group tracking-[0.22em] uppercase transition-colors duration-300"
              style={{
                fontFamily:    '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                fontWeight:    500,
                fontSize:      'clamp(12px, 1.05vw, 15px)',
                color:         isActive ? '#FFFFFF' : 'rgba(235, 235, 235, 0.82)',
                textDecoration:'none',
              }}
            >
              {link.label}
              {/* Red active underline on HOME / current active section */}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-1 h-[1.5px] bg-[#E11D48]"
                  style={{ borderRadius: '1px' }}
                />
              )}
            </a>
          )
        })}
      </div>
    </motion.nav>
  )
}
