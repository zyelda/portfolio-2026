import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ProjectSection from "@/components/sections/project-section";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import CertificateSection from "@/components/sections/certificate-section";
import StoicQuote from "@/components/ui/stoic-quote";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      {/* Hero Section (Client Component) */}
      <section id="home">
        <HeroSection />
      </section>

      <StoicQuote />

      {/* About Section (Bento Grid) */}
      <section id="about">
        <AboutSection />
      </section>

      {/* CERTIFICATES (3D TILT) */}
      <section id="certificates">
        <CertificateSection />
      </section>

      {/* Projects Section (Server Component) */}
      <div id="projects">
        <ProjectSection />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}