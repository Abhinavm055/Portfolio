import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TelemetryOrbProps {
  activeTab: 'sleep' | 'diet' | 'workout' | 'habits' | 'ai';
}

const PARTICLE_COUNT = 750;

function MorphingParticles({ activeTab }: TelemetryOrbProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate target coordinates for each mode once
  const targets = useMemo(() => {
    const coords: Record<string, Float32Array> = {
      ai: new Float32Array(PARTICLE_COUNT * 3),
      sleep: new Float32Array(PARTICLE_COUNT * 3),
      diet: new Float32Array(PARTICLE_COUNT * 3),
      workout: new Float32Array(PARTICLE_COUNT * 3),
      habits: new Float32Array(PARTICLE_COUNT * 3),
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 1. AI Mode: Spherical Neural Network
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const sphereRadius = 1.5;
      coords.ai[i * 3] = sphereRadius * Math.cos(theta) * Math.sin(phi);
      coords.ai[i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi);
      coords.ai[i * 3 + 2] = sphereRadius * Math.cos(phi);

      // 2. Sleep Mode: Flowing Brainwave Ribbon
      const sleepPct = i / PARTICLE_COUNT;
      coords.sleep[i * 3] = (sleepPct - 0.5) * 4.2; // span width
      coords.sleep[i * 3 + 1] = Math.sin(sleepPct * Math.PI * 4) * 0.45; // sine wave
      coords.sleep[i * 3 + 2] = Math.sin(i * 456.789) * 0.25; // deterministic ribbon depth

      // 3. Diet Mode: Twisting Double Helix Structure
      const dietPct = i / PARTICLE_COUNT;
      const helixAngle = dietPct * Math.PI * 6; // 3 full twists
      const isAltStrand = i % 2 === 0;
      const strandOffset = isAltStrand ? Math.PI : 0;
      coords.diet[i * 3] = Math.cos(helixAngle + strandOffset) * 0.65;
      coords.diet[i * 3 + 1] = (dietPct - 0.5) * 3.0; // vertical span
      coords.diet[i * 3 + 2] = Math.sin(helixAngle + strandOffset) * 0.65;

      // 4. Workout Mode: Spinning Cone Vortex
      const workoutPct = i / PARTICLE_COUNT;
      const vortexAngle = workoutPct * Math.PI * 18;
      const vortexHeight = (workoutPct - 0.5) * 3.0;
      const vortexRadius = Math.abs(vortexHeight) * 0.45 + 0.15; // wide ends, narrow waist
      coords.workout[i * 3] = Math.cos(vortexAngle) * vortexRadius;
      coords.workout[i * 3 + 1] = vortexHeight;
      coords.workout[i * 3 + 2] = Math.sin(vortexAngle) * vortexRadius;

      // 5. Habits Mode: Concentric Orbit Rings
      const ringIdx = i % 3; // 3 distinct rings
      const pointsPerRing = PARTICLE_COUNT / 3;
      const idxInRing = Math.floor(i / 3);
      const ringRadius = 0.5 + ringIdx * 0.55;
      const ringAngle = (idxInRing / pointsPerRing) * Math.PI * 2;
      coords.habits[i * 3] = Math.cos(ringAngle) * ringRadius;
      coords.habits[i * 3 + 1] = Math.sin(i * 876.543) * 0.04; // flat plane
      coords.habits[i * 3 + 2] = Math.sin(ringAngle) * ringRadius;
    }

    return coords;
  }, []);

  // Set initial position to 'ai'
  const initialPositions = useMemo(() => {
    return new Float32Array(targets.ai);
  }, [targets]);

  // Index map for drawing network connections in lineSegments
  const lineIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT - 1; i++) {
      if (i % 8 === 0) continue; // break lines up for organic spacing
      indices.push(i, i + 1);
      
      if (i + 12 < PARTICLE_COUNT) {
        indices.push(i, i + 12);
      }
    }
    return new Uint16Array(indices);
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !groupRef.current) return;

    // 1. Dynamic speed & rotation adjustments based on mode
    let baseSpeed = 0.05;
    let targetXRot = 0;
    if (activeTab === 'sleep') {
      baseSpeed = 0.015;
    } else if (activeTab === 'workout') {
      baseSpeed = 0.22;
    } else if (activeTab === 'diet') {
      baseSpeed = 0.04;
    } else if (activeTab === 'habits') {
      baseSpeed = 0.03;
      targetXRot = 0.45; // tilt rings slightly towards camera
    } else if (activeTab === 'ai') {
      baseSpeed = 0.07;
    }

    // Apply smooth rotation transitions
    groupRef.current.rotation.y += baseSpeed * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetXRot, 0.05);

    // 2. Interpolate position buffers
    const targetArr = targets[activeTab];
    const pointsGeom = pointsRef.current.geometry;
    const pointsAttr = pointsGeom.attributes.position as THREE.BufferAttribute;
    const pointsArr = pointsAttr.array as Float32Array;

    const lerpFactor = 0.065; // speed of morphing

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      pointsArr[i] = THREE.MathUtils.lerp(pointsArr[i], targetArr[i], lerpFactor);
    }
    pointsAttr.needsUpdate = true;

    // 3. Mirror points positions to the line segment buffer
    if (lineRef.current) {
      const lineGeom = lineRef.current.geometry;
      const lineAttr = lineGeom.attributes.position as THREE.BufferAttribute;
      const lineArr = lineAttr.array as Float32Array;

      const indices = lineGeom.index?.array as Uint16Array;
      if (indices) {
        for (let idx = 0; idx < indices.length; idx++) {
          const ptIdx = indices[idx];
          lineArr[idx * 3] = pointsArr[ptIdx * 3];
          lineArr[idx * 3 + 1] = pointsArr[ptIdx * 3 + 1];
          lineArr[idx * 3 + 2] = pointsArr[ptIdx * 3 + 2];
        }
        lineAttr.needsUpdate = true;
      }

      // Fade connection line opacity based on mode
      const lineMat = lineRef.current.material as THREE.LineBasicMaterial;
      const targetOpacity = activeTab === 'ai' ? 0.22 : activeTab === 'diet' ? 0.12 : 0.04;
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetOpacity, 0.08);
    }
  });

  const linePositions = useMemo(() => {
    return new Float32Array(lineIndices.length * 3);
  }, [lineIndices]);

  return (
    <group ref={groupRef}>
      {/* 3D Morphing Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.026}
          color="#DCE7FF"
          transparent
          opacity={0.65}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3D Morphing Connection Lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lineIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#DCE7FF"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function TelemetryOrb({ activeTab }: TelemetryOrbProps) {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#DCE7FF" />
        <MorphingParticles activeTab={activeTab} />
      </Canvas>
    </div>
  );
}
export default TelemetryOrb;
