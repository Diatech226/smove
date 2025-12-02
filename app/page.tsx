"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import type { SectionKey } from "@/types/sections";

const backgroundMap: Record<SectionKey, { base: string; gradient: string }> = {
  hero: {
    base: "#fef3c7",
    gradient:
      "radial-gradient(circle at 20% 20%, rgba(250,204,21,0.25), transparent 32%), radial-gradient(circle at 82% 18%, rgba(59,130,246,0.22), transparent 30%)",
  },
  services: {
    base: "#fffef9",
    gradient:
      "radial-gradient(circle at 12% 8%, rgba(250,204,21,0.22), transparent 28%), radial-gradient(circle at 90% 12%, rgba(14,165,233,0.14), transparent 28%)",
  },
  portfolio: {
    base: "#0b1225",
    gradient:
      "radial-gradient(circle at 10% 20%, rgba(250,204,21,0.2), transparent 30%), radial-gradient(circle at 90% 10%, rgba(14,165,233,0.2), transparent 32%)",
  },
  process: {
    base: "#f8fafc",
    gradient:
      "radial-gradient(circle at 15% 15%, rgba(250,204,21,0.18), transparent 30%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.1), transparent 22%)",
  },
  testimonials: {
    base: "#fff9e6",
    gradient:
      "radial-gradient(circle at 25% 10%, rgba(250,204,21,0.22), transparent 30%), radial-gradient(circle at 80% 12%, rgba(59,130,246,0.12), transparent 28%)",
  },
  contact: {
    base: "#0f172a",
    gradient:
      "radial-gradient(circle at 20% 30%, rgba(250,204,21,0.18), transparent 34%), radial-gradient(circle at 82% 8%, rgba(59,130,246,0.26), transparent 32%)",
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");

  const layers = useMemo(
    () => Object.entries(backgroundMap) as [SectionKey, { base: string; gradient: string }][],
    []
  );

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="fixed inset-0 -z-20"
        animate={{ backgroundColor: backgroundMap[activeSection].base }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <div className="fixed inset-0 -z-10 opacity-80">
        <AnimatePresence initial={false}>
          {layers.map(([key, value]) => (
            <motion.div
              key={key}
              className="absolute inset-0"
              style={{ backgroundImage: value.gradient }}
              initial={{ opacity: activeSection === key ? 1 : 0 }}
              animate={{ opacity: activeSection === key ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <HeroSection onSectionIn={setActiveSection} />
        <ServicesSection onSectionIn={setActiveSection} />
        <PortfolioSection onSectionIn={setActiveSection} />
        <ProcessSection onSectionIn={setActiveSection} />
        <TestimonialsSection onSectionIn={setActiveSection} />
        <ContactSection onSectionIn={setActiveSection} />
      </div>
    </div>
  );
}
