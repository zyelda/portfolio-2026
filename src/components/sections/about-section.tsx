"use client";

import { motion } from "framer-motion";
import { 
  Code2, 
  Cpu, 
  Globe, 
  GraduationCap, 
  Heart, 
  MapPin, 
  Terminal, 
  Zap 
} from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";

export default function AboutSection() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto" id="about">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <Terminal className="w-8 h-8 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            System Identity
          </span>
        </h2>
        <p className="text-muted-foreground">
          Mengenal lebih dalam tentang operator di balik sistem ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">

        {/* 1. BIOGRAPHY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 p-6 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-colors flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Cpu className="w-5 h-5" />
            <span className="font-mono text-sm font-bold">BIO DATA</span>
          </div>
          <p className="text-lg leading-relaxed text-foreground/90">
            Halo, saya <span className="font-bold text-white">Aditias Zulmatoriq</span>. 
            Seorang mahasiswa Teknik Informatika yang memiliki ketertarikan mendalam pada 
            <span className="text-blue-400"> Tech Enthusiast</span> dan 
            <span className="text-purple-400"> Fullstack Development</span>.
            <br /><br />
            Saya suka membangun sistem yang kompleks namun memiliki antarmuka yang bersih (Clean UI). 
            Saat ini sedang fokus mengembangkan tools keamanan siber dan platform web modern.
          </p>
        </motion.div>

        {/* 2. LOCATION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden p-6 rounded-2xl bg-zinc-900 border border-border/50 group"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 text-green-500">
              <MapPin className="w-5 h-5" />
              <span className="font-mono text-xs">CURRENT LOCATION</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Lombok, ID</h3>
              <p className="text-xs text-zinc-400 mt-1">Mataram City</p>
              <p className="text-xs text-green-500 mt-2 animate-pulse">● Active</p>
            </div>
          </div>
        </motion.div>

        {/* 3. TECH STACK */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="row-span-2 p-6 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Code2 className="w-5 h-5" />
            <span className="font-mono text-sm font-bold">TECH ARSENAL</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2">CORE</p>
              <div className="flex flex-wrap gap-2">
                <TechBadge name="Next.js 15" />
                <TechBadge name="React" />
                <TechBadge name="TypeScript" />
                <TechBadge name="Tailwind CSS" />
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">BACKEND & DB</p>
              <div className="flex flex-wrap gap-2">
                <TechBadge name="Laravel" />
                <TechBadge name="Python" />
                <TechBadge name="Supabase" />
                <TechBadge name="PostgreSQL" />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">TOOLS & SECURITY</p>
              <div className="flex flex-wrap gap-2">
                <TechBadge name="Git" />
                <TechBadge name="Docker" />
                <TechBadge name="OSINT Framework" />
                <TechBadge name="Burp Suite" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. EDUCATION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 p-6 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2 mb-6 text-primary">
            <GraduationCap className="w-5 h-5" />
            <span className="font-mono text-sm font-bold">ACADEMIC LOG</span>
          </div>
          
          <div className="space-y-6 border-l-2 border-border/50 ml-2 pl-6">
            <div className="relative">
              <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></span>
              <h4 className="text-foreground font-bold">Teknik Informatika</h4>
              <p className="text-sm text-muted-foreground">Universitas Mataram • 2023 - Sekarang</p>
              <p className="text-sm mt-2">Fokus pada Software Engineering.</p>
            </div>
            
            <div className="relative">
              <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-muted-foreground border-2 border-background"></span>
              <h4 className="text-foreground font-bold">Internship (PKL)</h4>
              <p className="text-sm text-muted-foreground">BLiP • Jan 2026 - Feb 2026</p>
              <p className="text-sm mt-2">Pengalaman magang menangani infrastruktur jaringan dan pengembangan web.</p>
            </div>
          </div>
        </motion.div>

        {/* 5. HOBBIES & INTERESTS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/20 hover:border-green-500/40 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-green-400">
              <Heart className="w-5 h-5" />
              <span className="font-mono text-sm font-bold">SIDE QUESTS</span>
            </div>
            <Globe className="w-12 h-12 text-green-500/20" />
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
             <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                <h5 className="font-bold text-sm">Hiking & Nature</h5>
                <p className="text-xs text-muted-foreground">Founder "Jejak Pendaki". Menikmati alam untuk reset pikiran.</p>
             </div>
             <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                <h5 className="font-bold text-sm">Gaming & CTF</h5>
                <p className="text-xs text-muted-foreground">Capture The Flag player dan penikmat game strategi.</p>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}