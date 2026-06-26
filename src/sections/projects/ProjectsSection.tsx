import { motion } from 'framer-motion';

interface Project {
  title: string;
  tagline: string;
  desc: string;
  tech: string[];
  image: string;
  demoUrl: string;
  sourceUrl: string;
}

const PROJECTS_DATA: Project[] = [
  {
    title: 'CricAuctionIPL',
    tagline: 'Real-Time Auction Simulator',
    desc: 'A fully multiplayer real-time auction simulator utilizing sub-second database listeners to sync live bidding states, team budgets, and player lists instantly.',
    tech: ['React', 'TypeScript', 'Firebase', 'Node.js'],
    image: '/cricauction.png',
    demoUrl: 'https://cricauctionipl.web.app/',
    sourceUrl: 'https://github.com/Abhinavm055/CricAuctionIPL',
  },
  {
    title: 'CoLiviMates',
    tagline: 'Roommate & Housing Matcher',
    desc: 'A roommate-first rental housing platform that matches users with compatible co-living partners based on lifestyle schedules, budget bounds, and cleanliness indices.',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'React'],
    image: '/colivimates.png',
    demoUrl: 'https://co-livi-mates.vercel.app/',
    sourceUrl: 'https://github.com/Abhinavm055/CoLiviMates',
  },
  {
    title: 'LifeOS',
    tagline: 'Wellness & Productivity Dashboard',
    desc: 'An integrated personal dashboard centralizing health telemetry, workout tracking, active schedule calendars, and daily habit reminders into a clean ecosystem.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Flutter'],
    image: '/lifeos.png',
    demoUrl: 'https://github.com/Abhinavm055',
    sourceUrl: 'https://github.com/Abhinavm055',
  },
];

export function ProjectsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section id="projects" className="py-24 md:py-32 bg-transparent text-text-light relative z-10">
      <div className="content-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="flex flex-col gap-12 md:gap-16"
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="flex flex-col select-none">
            <span className="section-subtitle-tag">03 / Projects</span>
            <h2 className="section-headline">Featured Products</h2>
            <p className="section-intro-text">
              A curated selection of software systems designed and developed to solve real-world problems.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS_DATA.map((project, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="flex flex-col h-full bg-[#0A0A0A]/45 border border-white/5 rounded-lg overflow-hidden group hover:border-white/12 hover:bg-[#0C0C0C]/70 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* 1. Large Screenshot (approx. 70% of card height relative to details) */}
                <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-white/5">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  {/* Subtle vignette over screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* 2. Project Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] font-semibold tracking-widest text-accent-blue/80 uppercase block mb-1">
                      {project.tagline}
                    </span>
                    <h3 className="text-xl font-medium text-text-light mb-3 select-all">
                      {project.title}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-text-muted font-sans select-none">
                      {project.desc}
                    </p>
                  </div>

                  <div className="mt-6">
                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View live demo of ${project.title}`}
                        className="btn-primary py-2 text-[10px] tracking-wider font-bold inline-flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(255,255,255,0.12)] cursor-pointer hover:-translate-y-0.5"
                      >
                        <span>View Demo</span>
                        <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View source code of ${project.title} on GitHub`}
                        className="btn-secondary py-2 text-[10px] tracking-wider font-bold inline-flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] cursor-pointer hover:-translate-y-0.5"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
