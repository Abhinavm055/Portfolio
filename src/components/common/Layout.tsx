import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { CursorProvider } from '../../hooks/useCursor.tsx';
import { CustomCursor } from '../cursor/CustomCursor';
import { SidebarNavigation } from '../navigation/SidebarNavigation';
import { useScrollProgress } from '../../hooks/useScrollProgress';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // RequestAnimationFrame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <CursorProvider>
      {/* Scroll indicator bar at the top of the page */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent-blue z-50 origin-left pointer-events-none"
        style={{ scaleX: scrollProgress }}
      />
      
      {/* Global Top-Left Brand Mark */}
      <div className="fixed top-8 left-8 md:top-12 md:left-14 z-50 select-none pointer-events-auto">
        <button
          onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-[10px] font-sans font-bold tracking-[0.35em] text-text-light uppercase hover:text-accent-blue transition-all duration-300 cursor-pointer bg-transparent border-none p-0 outline-none hover:scale-[1.02]"
        >
          M ABHINAV
        </button>
      </div>

      {/* Interactive trailing cursor */}
      <CustomCursor />
 
      {/* Floating sidebar navigation */}
      <SidebarNavigation />
      
      {/* Main content area */}
      <main className="flex-grow w-full relative z-10">
        {children}
      </main>
      
      {/* Premium minimal footer - Transparent so background shows through */}
      <footer className="w-full py-12 text-center text-text-muted/40 relative z-10 bg-transparent select-none border-t border-white/5">
        <div className="content-container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-widest font-sans font-medium uppercase">
            &copy; {new Date().getFullYear()} M ABHINAV. All rights reserved.
          </p>
          <div className="flex gap-6 text-[9px] tracking-[0.2em] font-semibold uppercase font-sans">
            <span>High Performance</span>
            <span className="text-white/10">&bull;</span>
            <span>Minimalist Code</span>
            <span className="text-white/10">&bull;</span>
            <span>Timeless Design</span>
          </div>
        </div>
      </footer>
    </CursorProvider>
  );
}

export default Layout;
