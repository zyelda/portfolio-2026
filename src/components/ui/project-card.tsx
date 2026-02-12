"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitCommit, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectProps {
  project: {
    title: string;
    description: string;
    tech_stack: string[];
    repo_link: string | null;
    demo_link: string | null;
    image_url: string | null;
    category: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectProps) {
  const [gitStats, setGitStats] = useState<any>(null);

  // Efek: Ambil data real-time dari GitHub API
  useEffect(() => {
    if (!project.repo_link) return;

    // Ekstrak username/repo dari link (misal: github.com/zyelda/nexus-osint)
    const match = project.repo_link.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const [_, owner, repo] = match;
      fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) { // Pastikan data valid
            setGitStats({
              stars: data.stargazers_count,
              lastPush: new Date(data.pushed_at).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric"
              }),
            });
          }
        })
        .catch((err) => console.error("GitHub API Error:", err));
    }
  }, [project.repo_link]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20 transition-all duration-300 h-full"
    >
      {/* Bagian Gambar dengan Efek Zoom saat Hover */}
      <div className="relative h-48 w-full overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        
        {/* Overlay Kategori */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-mono font-bold text-background bg-foreground/80 backdrop-blur-md rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Bagian Konten */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          {/* GitHub Stats (Real-time) */}
          {gitStats && (
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border/30">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{gitStats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{gitStats.lastPush}</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span key={tech} className="text-xs font-mono text-muted-foreground/80 bg-background/50 px-2 py-1 rounded border border-border/50">
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 4 && (
             <span className="text-xs font-mono text-muted-foreground px-1 py-1">+{project.tech_stack.length - 4}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/30">
          {project.repo_link && (
            <Link 
              href={project.repo_link} 
              target="_blank" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Source</span>
            </Link>
          )}
          {project.demo_link && (
            <Link 
              href={project.demo_link} 
              target="_blank" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors ml-auto"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}