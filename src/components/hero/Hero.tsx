import { useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { HeroPortraitWebGL } from './HeroPortraitWebGL';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Scroll animations for cinematic fade-out transitions
  const heroOpacity           = useTransform(scrollY, [0, 480], [1, 0]);
  const heroY                 = useTransform(scrollY, [0, 480], [0, -30]);
  const portraitScrollScale   = useTransform(scrollY, [0, 520], [1, 1.05]);
  const portraitScrollY       = useTransform(scrollY, [0, 520], [0, -40]);
  const portraitScrollOpacity = useTransform(scrollY, [0, 440], [1, 0]);
  const bgTextScrollOpacity   = useTransform(scrollY, [0, 380], [1, 0]);
  const bgTextScrollScale     = useTransform(scrollY, [0, 380], [1, 1.03]);
  const auraScale             = useTransform(scrollY, [0, 480], [1.0, 1.15]);
  const auraOpacity           = useTransform(scrollY, [0, 240, 440, 650], [0.18, 0.5, 0.95, 0]);

  // Mouse state
  const mouseXMotion = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 960
  );
  const mouseYMotion = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 540
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseXMotion.set(e.clientX);
    mouseYMotion.set(e.clientY);
  }, [mouseXMotion, mouseYMotion]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Spring settings for subtle mouse parallax drift
  const premiumCfg = { stiffness: 15, damping: 28, mass: 1.6 };

  const w = typeof window !== 'undefined' ? window.innerWidth  : 1920;
  const h = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Portrait parallax - capped at 12px maximum shift for stable feel
  const portraitX = useSpring(useTransform(mouseXMotion, [0, w], [-12, 12]), premiumCfg);
  const portraitY = useSpring(useTransform(mouseYMotion, [0, h], [-12, 12]), premiumCfg);

  // Stagger configurations
  const stagger = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };
  const fadeUp = {
    hidden:  { y: 15, opacity: 0 },
    visible: { y: 0,  opacity: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
  };
  const fadeIn = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section ref={sectionRef} id="hero" className="hero-section relative w-full h-screen overflow-hidden bg-transparent flex items-center justify-center">
      
      {/* ── LAYER 1: Massive Faded Background Typography (No mouse parallax translation, opacity reduced to 0.04) ─────────────────────── */}
      <motion.div
        className="hero-layer hero-layer--bg-type absolute inset-0 w-full h-full flex items-end justify-center pb-[10vh] pointer-events-none z-1"
        style={{ opacity: bgTextScrollOpacity, scale: bgTextScrollScale }}
      >
        <span className="hero-bg-text font-display font-bold text-[22vw] text-[#FAF9F6] opacity-[0.04] tracking-wider select-none">
          ABHINAV
        </span>
      </motion.div>

      {/* ── LAYER 2: Perfectly Centered Portrait & Aura (Portrait scaled by 20% and translated down 24px) ──────────────────────── */}
      <motion.div
        className="hero-layer hero-layer--portrait absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-2"
        style={{
          x: portraitX,
          y: portraitY,
          scale: portraitScrollScale,
          translateY: portraitScrollY,
          opacity: portraitScrollOpacity,
        }}
      >
        <div className="relative pointer-events-auto h-[58vh] max-h-[550px] aspect-[1122/1402] flex items-center justify-center translate-y-[24px]">
          {/* Soft Shadow behind the subject */}
          <motion.div
            className="absolute inset-0 z-0 select-none pointer-events-none"
            style={{
              scale: auraScale,
              opacity: auraOpacity,
            }}
          >
            <img 
              src="/profile.png" 
              alt="Subject Shadow" 
              className="w-full h-full object-contain"
              style={{
                filter: 'brightness(0) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.95)) blur(4px)',
              }}
            />
          </motion.div>

          <HeroPortraitWebGL />

          {/* Subtle bottom vignette to blend clothing edge into background */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-10"
          />
        </div>
      </motion.div>

      {/* ── LAYER 3: Left-aligned Brand Copy and Scroll Cue ───────────────── */}
      <motion.div
        className="hero-layer hero-layer--content absolute inset-0 w-full h-full flex items-center px-8 md:px-16 pointer-events-none z-10"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto flex flex-col justify-between h-full py-16 box-border relative"
        >
          {/* Main Hero Copy - Center Left */}
          <motion.div className="flex flex-col gap-5 mt-auto mb-16 pointer-events-auto md:-translate-x-[70px]" variants={fadeUp}>
            <p className="hero-content-main uppercase text-xs md:text-sm tracking-[0.25em] leading-[2.1] text-[#F5F5F5] font-light">
              I BUILD REAL-TIME SYSTEMS,<br />
              DIGITAL PRODUCTS, AND<br />
              HUMAN-CENTERED EXPERIENCES.
            </p>
            <p className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#DCE7FF] mt-2">
              Exploring. Building. Improving.
            </p>

            {/* CTAs row */}
            <div className="flex gap-4 mt-6 select-none">
              <button
                onClick={() => handleScrollTo('projects')}
                className="btn-primary py-2.5 px-6 text-[10px] tracking-wider font-bold cursor-pointer"
              >
                View Projects
              </button>
              <button
                onClick={() => handleScrollTo('contact')}
                className="btn-secondary py-2.5 px-6 text-[10px] tracking-wider font-bold cursor-pointer"
              >
                Contact
              </button>
            </div>
          </motion.div>

          {/* Scroll cue indicator at the bottom-left */}
          <motion.div className="flex items-center gap-4 mt-auto pointer-events-auto" variants={fadeIn}>
            <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#9CA3AF] uppercase">
              SCROLL TO EXPLORE
            </span>
            <div className="w-10 h-[1px] bg-[#DCE7FF]/45 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#DCE7FF] w-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
