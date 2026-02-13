"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Award, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import certsData from "@/data/certificates.json";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  color: string;
  file: string;
}

export default function CertificateSection() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certificates = certsData as Certificate[];

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <Award className="w-8 h-8 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Certified Competence
          </span>
        </h2>
        <p className="text-muted-foreground">
          Klik kartu untuk melihat dokumen sertifikat asli (PDF).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {certificates.map((cert, i) => (
          <div key={i} onClick={() => setSelectedCert(cert.file)}>
            <TiltCard cert={cert} />
          </div>
        ))}
      </div>

      {/* MODAL PDF VIEWER */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 bg-zinc-950 border-zinc-800 overflow-hidden flex flex-col [&>button]:hidden">
            
            <VisuallyHidden>
                <DialogTitle>Certificate Viewer</DialogTitle>
            </VisuallyHidden>

            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <span className="text-sm font-mono text-muted-foreground">DOC VIEWER</span>
                <button 
                    onClick={() => setSelectedCert(null)}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 w-full h-full bg-zinc-900 relative">
                {selectedCert ? (
                    <iframe 
                        src={`${selectedCert}#toolbar=0&navpanes=0`} 
                        className="w-full h-full border-none"
                        title="Certificate PDF"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        File not found.
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TiltCard({ cert }: { cert: Certificate }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x);
    const ySpring = useSpring(y);
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = (e.clientX - rect.left) * 32.5;
      const mouseY = (e.clientY - rect.top) * 32.5;
      const rX = (mouseY / height - 32.5 / 2) * -1;
      const rY = mouseX / width - 32.5 / 2;
      x.set(rX);
      y.set(rY);
    };
  
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };
  
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", transform }}
        className="relative h-64 w-full rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-shadow"
      >
        <div style={{ transform: "translateZ(50px)" }} className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${cert.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4 shadow-lg`}>
            <Award className="text-white w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
          <p className="text-sm text-zinc-400 font-mono">{cert.issuer} • {cert.date}</p>
        </div>
        <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
          <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{cert.description}</p>
          <div className="flex items-center gap-2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
            <span>VIEW DOCUMENT</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    );
  }