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
  const [onHome, setOnHome]   = useState(true)
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
      setOnHome(current === 'home')
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

  /* Text colour: black on home (light bg), white on all other sections */
  const textColor = onHome ? '#000000' : '#ffffff'

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[9000] flex justify-center"
      style={{
        paddingTop:    '28px',
        paddingBottom: '28px',
        background:    'transparent',
        backdropFilter:'none',
      }}
    >
      <div className="flex items-center gap-10">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`nav-link ${active === link.href.replace('#', '') ? 'active' : ''}`}
            style={{
              fontFamily:    '"Cormorant Garamond", Georgia, serif',
              fontWeight:    600,
              fontSize:      'clamp(13px, 1.1vw, 16px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         textColor,
              transition:    'color 0.4s ease',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
