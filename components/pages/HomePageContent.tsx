// file: components/pages/HomePageContent.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import ContactCtaSection from "@/components/sections/ContactCtaSection";
import HeroSection from "@/components/sections/HeroSection";
import ServicesPreviewSection from "@/components/sections/ServicesPreviewSection";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

const AboutPreviewSection = dynamic(() => import("@/components/sections/AboutPreviewSection"), {
  ssr: false,
});

const PortfolioPreviewSection = dynamic(
  () => import("@/components/sections/PortfolioPreviewSection"),
  { ssr: false },
);

const BlogPreviewSection = dynamic(() => import("@/components/sections/BlogPreviewSection"), {
  ssr: false,
});

type ActiveSection = "hero" | "about" | "services" | "portfolio" | "blog" | "contact";

export default function HomePageContent() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const shouldReduceMotion = useReducedMotionPref();

  const backgroundBySection = useMemo(
    () => ({
      hero: "radial-gradient(circle at 20% 20%, rgba(52,211,153,0.18), transparent 40%), linear-gradient(160deg, #0f172a, #020617)",
      about:
        "radial-gradient(circle at 80% 10%, rgba(168,139,250,0.18), transparent 38%), linear-gradient(160deg, #0b1221, #060b17)",
      services:
        "radial-gradient(circle at 50% 0%, rgba(14,165,233,0.2), transparent 40%), linear-gradient(150deg, #0b1221, #0f172a)",
      portfolio:
        "radial-gradient(circle at 70% 40%, rgba(59,130,246,0.15), transparent 42%), linear-gradient(150deg, #0a0f1c, #020617)",
      blog: "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.12), transparent 42%), linear-gradient(160deg, #0b1221, #0b1221)",
      contact:
        "radial-gradient(circle at 20% 80%, rgba(52,211,153,0.28), transparent 45%), linear-gradient(150deg, #0a1622, #03161b)",
    }),
    [],
  );

  return (
    <motion.div
      className="min-h-screen"
      initial={{ background: backgroundBySection.hero }}
      animate={shouldReduceMotion ? undefined : { background: backgroundBySection[activeSection] }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
    >
      <HeroSection onSectionIn={() => setActiveSection("hero")} />
      <AboutPreviewSection onSectionIn={() => setActiveSection("about")} />
      <ServicesPreviewSection onSectionIn={() => setActiveSection("services")} />
      <PortfolioPreviewSection onSectionIn={() => setActiveSection("portfolio")} />
      <BlogPreviewSection onSectionIn={() => setActiveSection("blog")} />
      <ContactCtaSection onSectionIn={() => setActiveSection("contact")} />
    </motion.div>
  );
}
