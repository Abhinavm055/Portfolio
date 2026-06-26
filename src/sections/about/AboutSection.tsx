import { motion } from 'framer-motion';

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="about" className="py-24 md:py-32 bg-transparent text-text-light relative z-10">
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
            <span className="section-subtitle-tag">02 / About</span>
            <h2 className="section-headline">About</h2>
          </motion.div>

          {/* Clean Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Left Column: Short Introduction */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="text-2xl sm:text-3xl font-light text-text-light select-none">
                I'm Abhinav,
              </h3>
              <p className="text-base sm:text-lg font-light leading-relaxed text-text-muted font-sans">
                Computer Science student passionate about backend development and creating modern digital experiences.
              </p>
            </motion.div>

            {/* Right Column: Focus Areas */}
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <h4 className="text-xs font-semibold tracking-[0.25em] text-accent-blue/80 uppercase select-none">
                Current Focus
              </h4>
              <ul className="flex flex-col gap-4 pl-0 list-none">
                {['Backend Development', 'System Design', 'Full Stack Development'].map((focus, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm sm:text-base font-light text-text-muted font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
