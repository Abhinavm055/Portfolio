import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = [
  'LEARN',
  'BUILD',
  'GROW',
  'HELP',
  'THE ASCENT',
  'ABHINAV',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Numeric count up logic
  useEffect(() => {
    let current = 0;
    const duration = 2000; // ms
    const intervalTime = 30; // ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      current += step + Math.random() * 2.0;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
      }
      setProgress(Math.min(100, Math.floor(current)));
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Text cycling logic
  useEffect(() => {
    if (progress >= 100) return;

    const index = Math.min(
      Math.floor((progress / 100) * WORDS.length),
      WORDS.length - 1
    );
    if (index !== wordIndex) {
      gsap.to(wordRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          setWordIndex(index);
          gsap.fromTo(
            wordRef.current,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' }
          );
        },
      });
    }
  }, [progress, wordIndex]);

  // Outro transition when progress reaches 100%
  useEffect(() => {
    if (progress < 100) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to([wordRef.current, counterRef.current, progressBarRef.current], {
      opacity: 0,
      y: -30,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.inOut',
    });

    tl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      },
      '-=0.15'
    );
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#0A0A0A] z-[9999] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
    >
      {/* Top Section */}
      <div className="flex justify-between items-center w-full">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#DCE7FF] font-sans">
          ABHINAV
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-[#9CA3AF] font-sans">
          DIGITAL MUSEUM
        </span>
      </div>

      {/* Middle Word Cycling */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="h-12 overflow-hidden flex items-center justify-center">
          <div
            ref={wordRef}
            className="text-xl md:text-2xl font-bold tracking-[0.25em] text-[#F5F5F5] font-display text-center uppercase"
          >
            {WORDS[wordIndex]}
          </div>
        </div>
      </div>

      {/* Bottom Counter & Bar */}
      <div className="w-full flex flex-col gap-4">
        {/* Progress Bar Container */}
        <div className="w-full h-[2px] bg-[#121212] relative overflow-hidden" ref={progressBarRef}>
          <div
            className="h-full bg-[#DCE7FF] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest font-sans">
              Curating Experience
            </span>
            <span className="text-[9px] text-[#9CA3AF]/60 font-mono">
              react.gsap.framer-motion.lenis
            </span>
          </div>

          <div
            ref={counterRef}
            className="text-6xl md:text-8xl font-semibold font-display text-[#F5F5F5] leading-none tracking-tighter"
          >
            {String(progress).padStart(3, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}
