import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ProjectSection from "@/components/sections/project-section";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import CertificateSection from "@/components/sections/certificate-section";
import StoicQuote from "@/components/ui/stoic-quote";
import { TerminalHacking } from "@/components/ui/terminal-hacking";
import { AnonymousForm } from "@/components/ui/anonymous-form";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <section id="home"><HeroSection /></section>
      <StoicQuote />
      <section id="about"><AboutSection /></section>
      <section id="certificates"><CertificateSection /></section>
      <div id="projects"><ProjectSection /></div>
      <section className="w-full">
        <TerminalHacking />
      </section>
      <AnonymousForm />

      <Footer />
    </main>
  );
}