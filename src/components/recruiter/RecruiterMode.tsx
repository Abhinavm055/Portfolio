import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface RecruiterModeProps {
  onExit: () => void;
}

// Custom Counter Hook
function AnimateCounter({ value, duration = 1.5, decimals = 1 }: { value: number; duration?: number; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(parseFloat(latest.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [value, duration, decimals]);

  return <span>{displayValue.toFixed(decimals)}</span>;
}

interface ProjectCatalogItem {
  name: string;
  category: 'fullstack' | 'ai' | 'other';
  tech: string;
  desc: string;
}

const PROJECTS_CATALOG: ProjectCatalogItem[] = [
  { name: 'LifeOS', category: 'ai', tech: 'Flutter, React, Node.js', desc: 'Personal life management and self-improvement platform featuring AI workout, diet, and day planners, sleep analysis, screen time, and habit tracking.' },
  { name: 'CricAuctionIPL', category: 'fullstack', tech: 'React, TypeScript, Firebase', desc: 'Real-time IPL cricket auction simulator enabling a multiplayer bidding experience, team squad management, live updates, and structured workflows.' },
  { name: 'ColiviMates', category: 'fullstack', tech: 'JavaScript, Node.js, PostgreSQL, Neon', desc: 'Roommate seeking and room rental platform enabling roommate matching, rental listings, housing discovery, and profile management with secure authentication.' }
];

export function RecruiterMode({ onExit }: RecruiterModeProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fullstack' | 'ai'>('all');

  const filteredProjects = PROJECTS_CATALOG.filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.category === activeFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-full bg-[#0A0A0A] z-[999] overflow-y-auto px-6 py-10 md:p-16 select-none font-sans text-[#F5F5F5]"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DCE7FF]/5 rounded-full blur-[100px] pointer-events-none" />
 
      {/* Header bar */}
      <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-center border-b border-[#DCE7FF]/10 pb-6 mb-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DCE7FF] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            EXECUTIVE DASHBOARD // READY
          </span>
        </div>
        <button
          onClick={onExit}
          className="px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F5F5F5] border border-[#DCE7FF]/35 bg-transparent hover:bg-[#DCE7FF]/15 transition-all duration-300 cursor-pointer"
        >
          Exit Dashboard
        </button>
      </div>
 
      {/* Dashboard Grid */}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Profile Card, Education, Action Buttons */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Executive Profile Card */}
          <div className="glass-premium rounded-2xl p-6 border border-[#DCE7FF]/15 relative overflow-hidden shadow-sm shadow-black/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-black/60 border border-[#DCE7FF]/30 flex items-center justify-center text-xl select-none shadow-sm">
                👔
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-[#F5F5F5] font-display">M Abhinav</h1>
                <span className="text-xs font-semibold text-[#DCE7FF] font-sans mt-0.5">Software Engineer</span>
              </div>
            </div>
 
            {/* Education details */}
            <div className="flex flex-col gap-3 border-t border-[#DCE7FF]/10 pt-4">
              <span className="text-[9px] font-bold text-[#DCE7FF] tracking-wider uppercase font-sans">Education</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#F5F5F5] leading-snug">B.E Computer Science & Engineering</span>
                <span className="text-[11px] text-[#9CA3AF]">Dr. N.G.P Institute of Technology</span>
                <span className="text-[10px] text-[#9CA3AF]/60 font-mono mt-0.5">Graduation: 2027</span>
              </div>
            </div>
 
            {/* CGPA Stat widget */}
            <div className="flex gap-4 border-t border-[#DCE7FF]/10 pt-4 mt-4 items-center">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[#DCE7FF] uppercase tracking-widest font-sans">CGPA</span>
                <span className="text-xl font-bold text-[#DCE7FF] font-mono">
                  <AnimateCounter value={8.5} />
                  <span className="text-xs text-[#9CA3AF]/60">/10</span>
                </span>
              </div>
              <div className="h-8 w-[1px] bg-[#DCE7FF]/10" />
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[#DCE7FF] uppercase tracking-widest font-sans">Projects</span>
                <span className="text-xl font-bold text-[#F5F5F5] font-mono">
                  <AnimateCounter value={3} decimals={0} />
                </span>
              </div>
            </div>
          </div>
 
          {/* Quick Contact & Action Hub */}
          <div className="glass-premium rounded-2xl p-6 border border-[#DCE7FF]/15 flex flex-col gap-3 shadow-sm">
            <span className="text-[9px] font-bold text-[#DCE7FF] tracking-wider uppercase font-sans mb-1">Recruiter Actions</span>
            
            {/* Download Resume - Solid Editorial CTA */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Resume Download initiated! (Simulated)'); }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] bg-[#F5F5F5] hover:bg-[#DCE7FF] border border-[#F5F5F5] hover:border-[#DCE7FF] transition-all duration-300 cursor-pointer shadow-sm"
            >
              Download Resume
            </a>
 
            {/* Email Contact */}
            <a
              href="mailto:malayilabhinav16@gmail.com"
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-[#F5F5F5] border border-[#DCE7FF]/35 bg-transparent hover:bg-[#DCE7FF]/10 transition-all duration-300 cursor-pointer"
            >
              Send Email
            </a>
 
            {/* Social Links Row */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <a
                href="https://www.linkedin.com/in/malayil-abhinav"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-lg text-center text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] border border-[#DCE7FF]/20 bg-transparent hover:border-[#DCE7FF] hover:text-[#F5F5F5] transition-all duration-300 cursor-pointer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Abhinavm055"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-lg text-center text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] border border-[#DCE7FF]/20 bg-transparent hover:border-[#DCE7FF] hover:text-[#F5F5F5] transition-all duration-300 cursor-pointer"
              >
                GitHub
              </a>
            </div>
          </div>
 
        </div>
 
        {/* Right Column: Skills, Projects, Achievements */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Skills Grid */}
          <div className="glass-premium rounded-2xl p-6 md:p-8 border border-[#DCE7FF]/15 flex flex-col gap-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#DCE7FF] tracking-wider uppercase font-sans block">
              Core Technical Skills
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Frontend */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-[#9CA3AF]/70 uppercase tracking-widest font-sans">Frontend UI/UX</span>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'].map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-black/60 border border-[#DCE7FF]/20 text-[#F5F5F5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
 
              {/* Backend */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-[#9CA3AF]/70 uppercase tracking-widest font-sans">Backend & Databases</span>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Spring Boot', 'Node.js', 'Firebase', 'MySQL', 'PostgreSQL'].map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-black/60 border border-[#DCE7FF]/20 text-[#F5F5F5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
 
          {/* Project Catalog with Interactive Filtering */}
          <div className="glass-premium rounded-2xl p-6 md:p-8 border border-[#DCE7FF]/15 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#DCE7FF]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#DCE7FF] tracking-wider uppercase font-sans block">
                  Featured Projects Catalog
                </span>
                <span className="text-[10px] text-[#9CA3AF] font-sans">Filter by software systems category</span>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-1.5 p-1 rounded-lg border border-[#DCE7FF]/20 bg-black/60 backdrop-blur-sm self-stretch md:self-auto justify-between">
                {(['all', 'fullstack', 'ai'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-[#DCE7FF] text-black'
                        : 'bg-transparent text-[#9CA3AF] hover:text-[#F5F5F5]'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'fullstack' ? 'Full Stack' : 'AI Systems'}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="flex flex-col gap-3 mt-2">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.name}
                  className="p-4 rounded-xl border border-[#DCE7FF]/10 bg-black/40 flex flex-col md:flex-row justify-between md:items-center gap-2 group hover:border-[#DCE7FF]/35 transition-colors duration-300"
                >
                  <div className="flex flex-col gap-1 max-w-xl">
                    <span className="text-sm font-bold text-[#F5F5F5] font-sans group-hover:text-[#DCE7FF] transition-colors duration-300">{proj.name}</span>
                    <span className="text-[11px] text-[#9CA3AF] font-sans leading-relaxed">{proj.desc}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono bg-[#0A0A0A]/60 border border-[#DCE7FF]/15 px-2 py-0.5 rounded self-start md:self-auto whitespace-nowrap">
                    {proj.tech}
                  </span>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="text-center py-6 text-xs text-[#9CA3AF] font-sans italic">
                  No projects fit this filter.
                </div>
              )}
            </div>
          </div>
 
          {/* Key Achievements */}
          <div className="glass-premium rounded-2xl p-6 md:p-8 border border-[#DCE7FF]/15 flex flex-col gap-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#DCE7FF] tracking-wider uppercase font-sans block">
              Professional Achievements
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-xs text-[#9CA3AF] font-sans leading-relaxed">
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-[#DCE7FF]/10 bg-black/40">
                <span className="text-[#DCE7FF] text-base select-none">📈</span>
                <div className="flex flex-col">
                  <strong className="text-[#F5F5F5] font-sans text-xs">CGPA Academic Metric</strong>
                  <span className="text-[11px] text-[#9CA3AF]/75 mt-0.5">Scored a consistent 8.5 CGPA during computer science coursework.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-[#DCE7FF]/10 bg-black/40">
                <span className="text-[#DCE7FF] text-base select-none">💡</span>
                <div className="flex flex-col">
                  <strong className="text-[#F5F5F5] font-sans text-xs">Full Stack Deployments</strong>
                  <span className="text-[11px] text-[#9CA3AF]/75 mt-0.5">Shipped multiple web applications combining frontend UIs and backplane DBs.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-[#DCE7FF]/10 bg-black/40">
                <span className="text-[#DCE7FF] text-base select-none">🚀</span>
                <div className="flex flex-col">
                  <strong className="text-[#F5F5F5] font-sans text-xs">Problem Solving Engine</strong>
                  <span className="text-[11px] text-[#9CA3AF]/75 mt-0.5">Strong data structures grasp and algorithmic code optimization.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-[#DCE7FF]/10 bg-black/40">
                <span className="text-[#DCE7FF] text-base select-none">⚡</span>
                <div className="flex flex-col">
                  <strong className="text-[#F5F5F5] font-sans text-xs">Real-Time Core Systems</strong>
                  <span className="text-[11px] text-[#9CA3AF]/75 mt-0.5">Implemented real-time database synchronization and event subscription listeners.</span>
                </div>
              </div>
            </div>
          </div>
 
        </div>
 
      </div>
    </motion.div>
  );
}
