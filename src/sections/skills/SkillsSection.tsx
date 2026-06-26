import { motion } from 'framer-motion';

interface SkillGroup {
  category: string;
  items: string[];
}

const SKILLS_DATA: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: ['Java', 'JavaScript', 'TypeScript', 'C', 'Python'],
  },
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'Tailwind CSS', 'React.js', 'Vite'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Firebase Authentication'],
  },
  {
    category: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'Neon PostgreSQL', 'Firebase Firestore'],
  },
  {
    category: 'Mobile',
    items: ['Flutter (Learning)', 'Android Studio'],
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub'],
  },
];

export function SkillsSection() {
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
    <section id="skills" className="py-24 bg-transparent text-text-light relative z-10">
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
            <span className="section-subtitle-tag">04 / Tech Stack</span>
            <h2 className="section-headline">Core Technologies</h2>
            <p className="section-intro-text">
              The languages, frameworks, databases, and development engines I use to build scalable digital products.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILLS_DATA.map((group, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="minimal-card flex flex-col gap-5 border border-white/5 hover:border-white/10"
              >
                {/* Category Title */}
                <h3 className="text-xs font-semibold tracking-[0.2em] text-accent-blue/80 uppercase select-none">
                  {group.category}
                </h3>

                {/* Tech Chips List */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill, skillIdx) => (
                    <span key={skillIdx} className="tech-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SkillsSection;
