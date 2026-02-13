import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ProjectSection from "@/components/sections/project-section";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import CertificateSection from "@/components/sections/certificate-section";
import StoicQuote from "@/components/ui/stoic-quote";
import { LombokExplore } from "@/components/ui/lombok-explore";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Quotes Section */}
      <StoicQuote />

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Certificates Section */}
      <section id="certificates">
        <CertificateSection />
      </section>

      {/* Projects Section */}
      <div id="projects">
        <ProjectSection />
      </div>

      {/* 3D Map Explorer */}
       <LombokExplore />

      <Footer />
    </main>
  );
}