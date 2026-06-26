import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function BeyondCodeGeometry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w - 0.5) * 2);
      my.set((e.clientY / h - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mx, my]);

  const springX = useSpring(mx, { stiffness: 9, damping: 21, mass: 1.7 });
  const springY = useSpring(my, { stiffness: 9, damping: 21, mass: 1.7 });

  const layer1X = useTransform(springX, [-1, 1], [-14, 14]);
  const layer1Y = useTransform(springY, [-1, 1], [-12, 12]);
  const layer2X = useTransform(springX, [-1, 1], [-24, 24]);
  const layer2Y = useTransform(springY, [-1, 1], [-20, 20]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      
      {/* Layer 1: Intersecting Arcs & Orbiting Waves */}
      <motion.div className="absolute inset-[-50px] w-[calc(100%+100px)] h-[calc(100%+100px)]" style={{ x: layer1X, y: layer1Y }}>
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
          
          {/* Wave curves (horizontal flowing paths) */}
          <path
            d="M -100 540 Q 480 340, 960 540 T 2020 540"
            fill="none"
            stroke="#DCE7FF"
            strokeWidth="0.65"
            opacity="0.045"
          />
          <path
            d="M -100 480 Q 480 680, 960 480 T 2020 480"
            fill="none"
            stroke="#DCE7FF"
            strokeWidth="0.4"
            opacity="0.035"
            strokeDasharray="4 8"
          />
          <path
            d="M -100 600 Q 480 400, 960 600 T 2020 600"
            fill="none"
            stroke="#DCE7FF"
            strokeWidth="0.35"
            opacity="0.03"
          />

          {/* Overlapping harmonic circles */}
          {[
            [700, 540, 360],
            [1220, 540, 360],
          ].map(([cx, cy, r], i) => (
            <circle
              key={`harmonic-c-${i}`}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#DCE7FF"
              strokeWidth="0.45"
              opacity="0.04"
              strokeDasharray={i === 0 ? "2 6" : "none"}
            />
          ))}
        </svg>
      </motion.div>

      {/* Layer 2: Geometric balance and composition guides */}
      <motion.div className="absolute inset-[-70px] w-[calc(100%+140px)] h-[calc(100%+140px)]" style={{ x: layer2X, y: layer2Y }}>
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
          
          {/* Large dynamic curves hinting at aesthetic composition */}
          <path
            d="M 200 900 A 700 700 0 0 1 1720 900"
            fill="none"
            stroke="#DCE7FF"
            strokeWidth="0.5"
            opacity="0.04"
          />
          <path
            d="M 200 180 A 700 700 0 0 0 1720 180"
            fill="none"
            stroke="#DCE7FF"
            strokeWidth="0.5"
            opacity="0.04"
            strokeDasharray="3 9"
          />

          {/* Center compass points */}
          {[
            [960, 180], [960, 900],
            [260, 540], [1660, 540]
          ].map(([cx, cy], i) => (
            <g key={`comp-point-${i}`} opacity="0.07">
              <circle cx={cx} cy={cy} r="3" fill="#DCE7FF" />
              <circle cx={cx} cy={cy} r="8" fill="none" stroke="#DCE7FF" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

export default BeyondCodeGeometry;
