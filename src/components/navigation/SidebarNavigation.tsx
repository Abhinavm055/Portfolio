import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTIONS = [
  { id: 'hero', num: '01', name: 'Hero' },
  { id: 'about', num: '02', name: 'About' },
  { id: 'projects', num: '03', name: 'Projects' },
  { id: 'skills', num: '04', name: 'Tech Stack' },
  { id: 'hobbies', num: '05', name: 'Hobbies' },
  { id: 'contact', num: '06', name: 'Contact' },
];

export function SidebarNavigation() {
  const activeSection = useActiveSection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 md:right-14 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-5 select-none pointer-events-auto">
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        const isHovered = hoveredId === sec.id;
        const isVisible = isActive || isHovered;

        return (
          <div
            key={sec.id}
            className="flex items-center justify-end gap-3 cursor-pointer h-7 group"
            onMouseEnter={() => setHoveredId(sec.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleScrollTo(sec.id)}
          >
            {/* Section label - animates on hover or active */}
            <AnimatePresence>
              {isVisible && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={`text-[9px] font-sans font-bold tracking-[0.25em] uppercase whitespace-nowrap ${
                    isActive ? 'text-[#DCE7FF]' : 'text-[#F5F5F5]/60'
                  }`}
                  style={{
                    textShadow: isActive ? '0 0 8px rgba(220, 231, 255, 0.4)' : 'none',
                  }}
                >
                  {sec.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Index Number */}
            <span
              className={`text-[9px] font-mono font-bold tracking-widest transition-all duration-300 ease-out ${
                isActive
                  ? 'text-[#DCE7FF] scale-110'
                  : 'text-[#F5F5F5]/30 group-hover:text-[#F5F5F5] scale-100'
              }`}
              style={{
                textShadow: isActive ? '0 0 10px rgba(220, 231, 255, 0.8), 0 0 20px rgba(220, 231, 255, 0.3)' : 'none',
              }}
            >
              {sec.num}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarNavigation;
