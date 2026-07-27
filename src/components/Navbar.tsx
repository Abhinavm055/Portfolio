import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLenis } from './SmoothScroll'

const links = [
  { label: 'Home',  href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work',  href: '#projects' },
  { label: 'Tech',  href: '#technologies' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('home')
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'open-to-work', 'technologies', 'contact']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(href, { duration: 0.85 })
    } else {
      const id = href.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[9000] flex justify-center"
      style={{
        paddingTop:     '28px',
        paddingBottom:  '28px',
        background:     'transparent',
        backdropFilter: 'none',
      }}
    >
      <div className="flex items-center gap-10">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`nav-link ${active === link.href.replace('#', '') ? 'active' : ''}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
