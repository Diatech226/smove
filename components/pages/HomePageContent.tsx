"use client";

import dynamic from "next/dynamic";

import ContactCtaSection from "@/components/sections/ContactCtaSection";
import HeroSection from "@/components/sections/HeroSection";
import ServicesPreviewSection from "@/components/sections/ServicesPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

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

export default function HomePageContent() {
  return (
    <div className="bg-slate-950">
      <HeroSection />
      <AboutPreviewSection />
      <ServicesPreviewSection />
      <PortfolioPreviewSection />
      <BlogPreviewSection />
      <TestimonialsSection />
      <ContactCtaSection />
    </div>
  );
}
