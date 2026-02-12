"use client";

import Image from "next/image";
import { CodingStats } from "@/components/coding-stats";
import MagneticSocials from "@/components/ui/magnetic-socials";

export default function HeroSection() {
    const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
    };

    const handleContact = () => {
    window.open("https://wa.me/6285237949283", "_blank");
    };

    return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-20">
        <div className="absolute inset-0 z-0 h-full w-full bg-background bg-grid-white/[0.05]"></div>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        
        <div className="text-left space-y-8 order-2 lg:order-1">
            <div className="inline-block px-3 py-1 text-xs font-mono text-green-500 bg-green-500/10 rounded-full border border-green-500/20 animate-pulse">
            ● ONLINE
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            BUILDING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                DIGITAL REALITY.
            </span>
            </h1>
            <p className="max-w-md text-muted-foreground text-lg">
            Fullstack Developer & Tech Enthusiast. Membangun arsitektur web modern.
            </p>
            <MagneticSocials />

            <div className="flex gap-4 pt-4">
            <button 
                onClick={scrollToProjects}
                className="px-8 py-3 bg-foreground text-background font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform duration-200"
            >
                View Projects
            </button>
            <button 
                onClick={handleContact}
                className="px-8 py-3 border border-border/50 bg-background/50 backdrop-blur rounded-lg hover:bg-secondary/50 transition-colors"
            >
                Contact Me
            </button>
            </div>
        </div>

        <div className="relative order-1 lg:order-2 flex flex-col items-center lg:items-end space-y-6">

            <div className="relative w-64 h-64 md:w-80 md:h-80 group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-background shadow-2xl">
                <Image 
                src="/profile.png" 
                alt="Profile Picture"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                priority
                />
            </div>

            <div className="absolute bottom-4 -left-4 bg-background/80 backdrop-blur border border-border px-4 py-2 rounded-lg text-xs font-mono shadow-lg">
                Aditias Zulmatoriq
                <br/>
                <span className="text-green-500">● Available for Hire</span>
            </div>
            </div>

            <div className="relative w-full max-w-xs">
                <div className="relative bg-background border border-border rounded-xl shadow-2xl overflow-hidden p-1">
                <CodingStats />
                </div>
            </div>

        </div>

        </div>
    </section>
  );
}