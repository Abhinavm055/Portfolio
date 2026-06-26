import { useState, useEffect, lazy, Suspense } from 'react';
import { Layout, Hero, LoadingScreen } from './components';
import { PersistentScene } from './scenes/PersistentScene';
import { AnimatePresence } from 'framer-motion';

// Lazy load heavy components for optimized initial page speeds
const AboutSection = lazy(() => import('./sections/about/AboutSection').then(m => ({ default: m.AboutSection })));
const ProjectsSection = lazy(() => import('./sections/projects/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const SkillsSection = lazy(() => import('./sections/skills/SkillsSection').then(m => ({ default: m.SkillsSection })));
const BeyondCodeSection = lazy(() => import('./sections/beyondcode/BeyondCodeSection').then(m => ({ default: m.BeyondCodeSection })));
const ContactCommandCenter = lazy(() => import('./sections/contact/ContactCommandCenter').then(m => ({ default: m.ContactCommandCenter })));
const RecruiterMode = lazy(() => import('./components/recruiter/RecruiterMode').then(m => ({ default: m.RecruiterMode })));

// Sleek fallback skeleton loader matching luxury design
function SectionLoader() {
  return (
    <div className="w-full py-24 flex items-center justify-center bg-transparent">
      <div className="w-5 h-5 border border-white/5 border-t-accent-blue rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Toggle recruiter mode if user presses 'R' outside input fields
      if (
        e.key.toLowerCase() === 'r' &&
        !['INPUT', 'TEXTAREA'].includes(target.tagName) &&
        !e.ctrlKey && !e.metaKey && !e.altKey
      ) {
        setIsRecruiterMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Loading preloader sequence */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Persistent 3D environment in background */}
      {!isLoading && <PersistentScene />}

      {/* Main website layouts */}
      {!isLoading && (
        <>
          <AnimatePresence mode="wait">
            <Layout key="portfolio">
              <Hero />
              
              <Suspense fallback={<SectionLoader />}>
                <AboutSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <ProjectsSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <SkillsSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <BeyondCodeSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <ContactCommandCenter />
              </Suspense>
            </Layout>
          </AnimatePresence>

          {/* Fullscreen Recruiter Command Dashboard */}
          <AnimatePresence>
            {isRecruiterMode && (
              <Suspense fallback={null}>
                <RecruiterMode onExit={() => setIsRecruiterMode(false)} />
              </Suspense>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default App;
