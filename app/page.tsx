import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import ContactCtaSection from "@/components/sections/ContactCtaSection";
import HeroSection from "@/components/sections/HeroSection";
import PortfolioPreviewSection from "@/components/sections/PortfolioPreviewSection";
import ServicesPreviewSection from "@/components/sections/ServicesPreviewSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <ServicesPreviewSection />
      <PortfolioPreviewSection />
      <BlogPreviewSection />
      <ContactCtaSection />
    </>
  );
}
