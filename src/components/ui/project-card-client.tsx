"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"; 
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X, Github, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// Tipe Data Project
export interface Project {
  id: number;
  title: string;
  description: string;
  original_desc?: string | null;
  tech_stack: string[];
  repo_link: string;
  demo_link?: string | null;
  stars?: number;
  last_updated?: string;
  image_url?: string | null;
  topics?: string[];
}

export default function ProjectClientView({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className="cursor-pointer"
          >
            <SimpleProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {/* Tombol Close Bawaan Dihilangkan dengan [&>button]:hidden */}
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border/50 rounded-2xl h-[85vh] md:h-auto flex flex-col [&>button]:hidden">
            
            <VisuallyHidden>
                <DialogTitle>{selectedProject?.title}</DialogTitle>
                <DialogDescription>Detail view for {selectedProject?.title}</DialogDescription>
            </VisuallyHidden>
            
            {selectedProject && (
                <div className="flex flex-col md:flex-row h-full">
                    {/* KIRI: Visual Pattern */}
                    <div className="w-full md:w-1/3 bg-zinc-950 flex items-center justify-center relative overflow-hidden p-6 border-b md:border-b-0 md:border-r border-border/50">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                        
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-4 mx-auto shadow-[0_0_30px_-10px_rgba(var(--primary),0.5)]">
                                <span className="text-4xl font-black text-white/80 uppercase">
                                    {selectedProject.title.substring(0, 2)}
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-muted-foreground inline-block">
                                REPO_ID: {selectedProject.id}
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Detail Info */}
                    <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col h-full bg-background relative overflow-y-auto">
                        
                        {/* TOMBOL CLOSE (Diperbaiki Simetris) */}
                        <button 
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-secondary/50 hover:bg-destructive hover:text-white transition-all duration-200 z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="mt-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-mono text-muted-foreground px-2 py-1 border border-border rounded">
                                    Updated: {selectedProject.last_updated}
                                </span>
                                {selectedProject.stars ? (
                                    <span className="text-xs font-mono text-yellow-500 px-2 py-1 border border-yellow-500/20 bg-yellow-500/10 rounded flex items-center gap-1">
                                        ★ {selectedProject.stars}
                                    </span>
                                ) : null}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight tracking-tight">
                                {selectedProject.title}
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider font-bold">
                                        DESCRIPTION
                                    </h4>
                                    <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-primary pl-4 py-1 bg-secondary/5 italic">
                                        "{selectedProject.description}"
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider font-bold">
                                        TECH STACK
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tech_stack?.map((tech) => (
                                            <span key={tech} className="px-2.5 py-1 bg-secondary border border-border/50 rounded-md text-xs font-medium text-foreground/80">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TOMBOL AKSI (Diperbaiki: Fixed Height agar Icon & Teks sejajar) */}
                        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                            <Link 
                                href={selectedProject.repo_link} 
                                target="_blank"
                                className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-semibold"
                            >
                                <Github className="w-4 h-4" />
                                <span>Repository</span>
                            </Link>
                            
                            {selectedProject.demo_link && (
                                <Link 
                                    href={selectedProject.demo_link} 
                                    target="_blank"
                                    className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold shadow-lg shadow-primary/20"
                                >
                                    <span>Live Demo</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function SimpleProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20 transition-all duration-300 min-h-[220px]"
        >
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0" />
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono bg-background/50 px-2 py-1 rounded border border-border/30 text-muted-foreground">
                            {tech}
                        </span>
                    ))}
                    {(project.tech_stack?.length || 0) > 3 && (
                        <span className="text-[10px] font-mono text-muted-foreground px-1 py-1">
                            +{project.tech_stack!.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}