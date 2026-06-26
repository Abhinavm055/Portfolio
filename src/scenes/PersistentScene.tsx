import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  fadeSpeed: number;
  maxAlpha: number;
  label: string;
}

export function PersistentScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize tiny particles (nodes)
    const particleCount = Math.min(25, Math.floor((width * height) / 60000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        size: Math.random() * 0.8 + 0.4, // Tiny floating particles
        alpha: Math.random() * 0.4 + 0.1,
        fadeSpeed: (Math.random() * 0.001 + 0.0003) * (Math.random() > 0.5 ? 1 : -1),
        maxAlpha: Math.random() * 0.5 + 0.2,
        label: `[0.${Math.floor(Math.random() * 100)}]`,
      });
    }

    const lines = [
      { yOffset: 0.30, amp: 15, speed: 0.0001, phase: 0 },
      { yOffset: 0.60, amp: 20, speed: 0.00008, phase: Math.PI / 4 },
      { yOffset: 0.85, amp: 12, speed: 0.00012, phase: Math.PI }
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Extremely slow animation speed increment
      time += 0.3;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // 1. Draw Static Blueprint Grid Lines (delicate architectural backdrop)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.4;
      const gridSpacing = 100;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Thin Flowing Lines
      ctx.lineWidth = 0.4;
      lines.forEach((line) => {
        ctx.beginPath();
        const baseHeight = height * line.yOffset;
        const mouseInfluence = (mouse.y - baseHeight) * 0.01;
        
        ctx.moveTo(0, baseHeight + Math.sin(time * line.speed + line.phase) * line.amp + mouseInfluence);

        const segments = 5;
        const segmentWidth = width / segments;
        for (let i = 1; i <= segments; i++) {
          const x = i * segmentWidth;
          const mouseDistX = Math.abs(mouse.x - x);
          const mousePush = mouseDistX < 200 ? (1 - mouseDistX / 200) * 8 * (mouse.y > baseHeight ? -1 : 1) : 0;
          
          const y = baseHeight + 
            Math.sin(time * line.speed + line.phase + i * 0.8) * line.amp + 
            mousePush + 
            mouseInfluence;

          const cpX1 = x - segmentWidth / 2;
          const cpY1 = baseHeight + Math.sin(time * line.speed + line.phase + i * 0.8 - 0.4) * line.amp + mouseInfluence;
          const cpX2 = x - segmentWidth / 4;
          const cpY2 = y;

          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
      });

      // 3. Draw Tiny Particles (Nodes)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Very slight mouse pull
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (1 - dist / 150) * 0.03;
          p.x += dx * force * 0.05;
          p.y += dy * force * 0.05;
        }

        p.alpha += p.fadeSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.02) p.fadeSpeed *= -1;
        p.alpha = Math.max(0.01, Math.min(p.maxAlpha, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.45})`;
        ctx.fill();

        // Draw blueprint crosshair "+" on select nodes
        if (p.size > 0.9) {
          ctx.beginPath();
          ctx.moveTo(p.x - 3, p.y);
          ctx.lineTo(p.x + 3, p.y);
          ctx.moveTo(p.x, p.y - 3);
          ctx.lineTo(p.x, p.y + 3);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.35})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        // Draw label text
        if (p.size > 1.0 && dist < 200) {
          ctx.font = '6px monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.25})`;
          ctx.fillText(p.label, p.x + 6, p.y + 2);
        }
      });

      // 4. Blueprint Node Connections
      const connectDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const opacity = (1 - dist / connectDist) * 0.18;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.35;
            ctx.stroke();

            // Dotted circle around the midpoint (very subtle intersection point)
            if (dist < 80 && Math.random() > 0.999) {
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              
              ctx.beginPath();
              ctx.arc(midX, midY, 6, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
              ctx.lineWidth = 0.3;
              ctx.setLineDash([1, 1]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 25% Dark Overlay for readability */}
      <div className="absolute inset-0 w-full h-full bg-black/25 z-[1]" />

      {/* GPU Accelerated Canvas Layer (Delicate architectural board opacity ~0.10) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[2] opacity-[0.10] mix-blend-screen"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
    </div>
  );
}

export default PersistentScene;
