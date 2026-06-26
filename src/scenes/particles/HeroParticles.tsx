import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1200;

  // Generate particle positions in a subtle double-wave shape
  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute particles across a wide flat horizontal grid
      const r = 2.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Gentle height modulation based on distance from center
      const y = Math.sin(r * 0.8) * 0.15 + (Math.random() - 0.5) * 0.08;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initY[i] = y;
    }
    return [pos, initY];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle global rotation
    pointsRef.current.rotation.y = time * 0.015;

    // Subtle wave animation on individual particles
    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = positionsAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      
      // Calculate a wave displacement based on distance, time, and coordinates
      const dist = Math.sqrt(x * x + z * z);
      arr[i * 3 + 1] = initialY[i] + Math.sin(dist * 0.7 - time * 0.6) * 0.12;
    }
    positionsAttr.needsUpdate = true;

    // Mouse parallax effect: smoothly rotate the scene based on cursor position
    const targetRotX = -state.pointer.y * 0.18;
    const targetRotY = state.pointer.x * 0.18;

    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.04);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY + time * 0.015, 0.04);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#2563EB"
        transparent
        opacity={0.35}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroParticles() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 2.5, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        {/* Ambient light to see standard components if added */}
        <ambientLight intensity={0.2} />
        
        {/* Subtle spotlight for soft background center glow */}
        <pointLight position={[0, 4, 2]} intensity={0.8} color="#2563EB" />
        
        <ParticleField />
      </Canvas>
    </div>
  );
}
