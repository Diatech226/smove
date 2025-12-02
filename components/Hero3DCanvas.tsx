"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function CoreSculpt() {
  const meshRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.28, 180, 32]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#0ea5e9"
          emissiveIntensity={0.22}
          metalness={0.25}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -0.7]} scale={0.7} castShadow receiveShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#a855f7" metalness={0.35} roughness={0.4} />
      </mesh>
    </group>
  );
}

function FloatingOrb({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) {
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8} floatingRange={[0.05, 0.35]}>
      <mesh position={position} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25 + delay * 0.05} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function OrbitRibbon({ radius = 2.6 }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 120; i += 1) {
      const angle = (i / 120) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, Math.sin(angle) * 0.08, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <group>
      {points.map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.22]} />
          <meshStandardMaterial color={idx % 6 === 0 ? "#22d3ee" : "#94a3b8"} emissive="#0ea5e9" emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3DCanvas() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const orbiters = useMemo(
    () => [
      { position: [2.3, 0.5, -0.8] as [number, number, number], color: "#7dd3fc", delay: 0 },
      { position: [-2.2, -0.4, 0.9] as [number, number, number], color: "#c4b5fd", delay: 1 },
      { position: [1.2, 1.1, 1.4] as [number, number, number], color: "#22d3ee", delay: 2 },
      { position: [-1.3, 1.0, -1.6] as [number, number, number], color: "#38bdf8", delay: 3 },
    ],
    []
  );

  const visibleOrbiters = isMobile ? orbiters.slice(0, 2) : orbiters;

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.35;
      groupRef.current.rotation.x = Math.cos(time * 0.12) * 0.18;
    }
  });

  return (
    <Canvas
      className="h-[360px] w-full md:h-[480px]"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      performance={{ min: 0.6 }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0b172a"]} />
        <PerspectiveCamera makeDefault position={[0, 0.4, 6]} fov={42} />

        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <spotLight position={[-6, 6, 2]} angle={0.7} penumbra={0.6} intensity={0.7} color="#8b5cf6" />

        <group ref={groupRef} position={[0, -0.2, 0]}>
          <CoreSculpt />
          <Float speed={1} floatIntensity={0.35} rotationIntensity={0.5}>
            <OrbitRibbon radius={isMobile ? 2.2 : 2.6} />
          </Float>
          {visibleOrbiters.map((orb) => (
            <FloatingOrb key={`${orb.position.join("-")}`} position={orb.position} color={orb.color} delay={orb.delay} />
          ))}
        </group>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate autoRotate autoRotateSpeed={0.6} />
      </Suspense>
    </Canvas>
  );
}
