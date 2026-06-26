import { motion } from 'framer-motion';

interface Hobby {
  title: string;
  emoji: string;
  icon: React.ReactNode;
}

const HOBBIES_DATA: Hobby[] = [
  {
    title: 'Football',
    emoji: '⚽',
    icon: (
      <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path d="M12 2a10 10 0 0 1 7.07 17.07M12 22A10 10 0 0 1 4.93 4.93" />
      </svg>
    ),
  },
  {
    title: 'Cricket',
    emoji: '🏏',
    icon: (
      <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Minimalist cricket bat & ball */}
        <line x1="18" y1="2" x2="6" y2="14" strokeWidth="2" />
        <line x1="6" y1="14" x2="3" y2="21" strokeWidth="3" />
        <circle cx="18" cy="18" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Singing',
    emoji: '🎤',
    icon: (
      <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    title: 'Music',
    emoji: '🎵',
    icon: (
      <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
];

export function BeyondCodeSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="hobbies" className="py-24 bg-transparent text-text-light relative z-10">
      <div className="content-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="flex flex-col gap-12 md:gap-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex flex-col select-none">
            <span className="section-subtitle-tag">05 / Beyond Code</span>
            <h2 className="section-headline">Hobbies</h2>
          </motion.div>

          {/* Compact Premium Glass Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HOBBIES_DATA.map((hobby, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 rounded-lg p-6 flex flex-col items-center text-center gap-4 group"
              >
                {/* SVG Icon */}
                <div className="text-text-muted group-hover:text-accent-blue transition-colors duration-300 transform group-hover:scale-105 transition-transform">
                  {hobby.icon}
                </div>

                {/* Title and Emoji */}
                <h3 className="text-sm font-semibold tracking-wider text-text-light uppercase select-none flex items-center gap-2">
                  <span>{hobby.emoji}</span>
                  <span>{hobby.title}</span>
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BeyondCodeSection;
