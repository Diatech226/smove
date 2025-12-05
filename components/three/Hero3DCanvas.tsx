// file: components/three/Hero3DCanvas.tsx
"use client";

import { Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function MainSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
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

function FloatingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1} position={position}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.35} emissive="#0b1221" />
      </mesh>
    </Float>
  );
}

export default function Hero3DCanvas() {
  return (
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

        <MainSculpture />

        <group>
          <FloatingSphere position={[-1.8, 0.4, -0.6]} color="#22d3ee" />
          <FloatingSphere position={[1.5, 1.1, -1.2]} color="#a78bfa" />
          <FloatingSphere position={[0.2, -0.6, 1.2]} color="#f59e0b" />
        </group>

        <mesh rotation-x={-Math.PI / 2} position={[0, -1.1, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
        </mesh>

        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
