import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContactLink {
  label: string;
  href: string;
  isDownload?: boolean;
}

const CONTACT_LINKS: ContactLink[] = [
  { label: 'EMAIL', href: 'mailto:malayilabhinav16@gmail.com' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/malayil-abhinav' },
  { label: 'GITHUB', href: 'https://github.com/Abhinavm055' },
  { label: 'RESUME', href: '/resume.pdf', isDownload: true }
];

export function ContactCommandCenter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Reveal headline & Let's Connect CTA
      gsap.fromTo('.contact-main-headline-wrap', { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-main-headline-wrap',
          start: 'top 85%',
        }
      });

      // Reveal link rows
      gsap.fromTo('.contact-link-row', { opacity: 0, x: 20 }, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact-links-column',
          start: 'top 80%',
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section relative w-full min-h-[90vh] py-28 px-6 md:px-12 flex items-center overflow-hidden bg-transparent select-none border-t border-white/5 z-10"
    >
      {/* Subtle Horizon Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-accent-blue/[0.04] to-transparent blur-md pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
        
        {/* ================= LEFT COLUMN: SECTION NUM ================= */}
        <div className="lg:col-span-2 self-start select-none">
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-accent-blue/80 uppercase">
            06 / Contact
          </span>
        </div>

        {/* ================= CENTER: HUGE TYPOGRAPHY & CTA ================= */}
        <div className="contact-main-headline-wrap opacity-0 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] font-bold tracking-tight text-text-light leading-[0.95] uppercase">
            LET'S BUILD<br />
            SOMETHING<br />
            <span className="text-accent-blue" style={{ textShadow: '0 0 35px rgba(207,226,255,0.18)' }}>MEANINGFUL.</span>
          </h2>

          {/* Large Premium Action Button */}
          <div className="pointer-events-auto mt-2">
            <a
              href="mailto:malayilabhinav16@gmail.com"
              className="btn-primary py-3 px-8 text-xs tracking-[0.2em] font-bold inline-block"
            >
              LET'S CONNECT
            </a>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LINKS ================= */}
        <div className="contact-links-column lg:col-span-3 flex flex-col gap-5 items-center lg:items-end justify-center w-full pointer-events-auto">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-row opacity-0 flex items-center gap-3 text-text-muted hover:text-accent-blue transition-all duration-300 font-sans text-xs font-bold tracking-[0.25em] py-1.5 border-b border-transparent hover:border-accent-blue/30 group"
            >
              {link.label === 'RESUME' && (
                <svg className="w-3.5 h-3.5 stroke-current mr-1" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              )}
              <span className="uppercase">{link.label}</span>
              {link.label !== 'RESUME' && (
                <span className="text-[9px] transform group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              )}
            </a>
          ))}
        </div>

      </div>

      {/* Credits Footer */}
      <footer className="absolute bottom-6 left-0 right-0 z-20 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-3 select-none text-[8px] font-mono tracking-[0.2em] text-text-muted/30">
        <span className="uppercase">M ABHINAV // PORTFOLIO</span>
        <span className="uppercase">© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        <span className="uppercase">COIMBATORE &bull; INDIA</span>
      </footer>
    </section>
  );
}

export default ContactCommandCenter;
