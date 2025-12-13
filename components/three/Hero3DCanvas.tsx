// file: components/three/Hero3DCanvas.tsx
"use client";

import { Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Hero3DCanvas failed to render", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-200 md:h-80 lg:h-96">
          <p className="px-4 text-center text-sm">Animation 3D indisponible. L'arrière-plan statique est affiché.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainSculpture({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || shouldReduceMotion) return;
    meshRef.current.rotation.y += delta * 0.35;
    meshRef.current.rotation.x += delta * 0.15;
  });

  return (
    <mesh ref={meshRef} castShadow position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[0.9, 0.24, 180, 16]} />
      <meshStandardMaterial color="#34d399" metalness={0.35} roughness={0.2} emissive="#0f172a" />
    </mesh>
  );
}

function FloatingSphere({ position, color, shouldReduceMotion }: { position: [number, number, number]; color: string; shouldReduceMotion: boolean }) {
  return (
    <Float
      speed={shouldReduceMotion ? 0.2 : 1.4}
      rotationIntensity={shouldReduceMotion ? 0.1 : 0.6}
      floatIntensity={shouldReduceMotion ? 0.2 : 1}
      position={position}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.35} emissive="#0b1221" />
      </mesh>
    </Float>
  );
}

export default function Hero3DCanvas() {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <CanvasErrorBoundary>
      <div className="h-64 w-full overflow-hidden rounded-3xl bg-slate-900/40 md:h-80 lg:h-96">
        <Canvas camera={{ position: [2.5, 1.6, 4.2], fov: 45 }} shadows dpr={[1, 2]}>
          <color attach="background" args={["#0b1221"]} />
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[3, 4, 2]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-3, -2, -4]} intensity={0.2} color="#22d3ee" />

          <MainSculpture shouldReduceMotion={shouldReduceMotion} />

          <group>
            <FloatingSphere position={[-1.8, 0.4, -0.6]} color="#22d3ee" shouldReduceMotion={shouldReduceMotion} />
            <FloatingSphere position={[1.5, 1.1, -1.2]} color="#a78bfa" shouldReduceMotion={shouldReduceMotion} />
            <FloatingSphere position={[0.2, -0.6, 1.2]} color="#f59e0b" shouldReduceMotion={shouldReduceMotion} />
          </group>

          <mesh rotation-x={-Math.PI / 2} position={[0, -1.1, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
          </mesh>

          <OrbitControls enablePan={false} enableZoom={false} autoRotate={!shouldReduceMotion} autoRotateSpeed={0.3} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
