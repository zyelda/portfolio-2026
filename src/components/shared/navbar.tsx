"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
// 1. Import CommandMenu
import { CommandMenu } from "@/components/command-menu"; // Sesuaikan path

export default function Navbar() {
    const [time, setTime] = useState("");
    const [scrolled, setScrolled] = useState(false);
    
    // 2. Buat State untuk kontrol menu
    const [openCommand, setOpenCommand] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
                    scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40" : "bg-transparent"
                )}
            >
                {/* Bagian Kiri (Logo) - Tetap */}
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">ONLINE</span>
                    </div>
                </div>

                {/* Bagian Tengah (Time) - Tetap */}
                <div className="hidden md:flex items-center gap-6 px-4 py-2 bg-background/50 border border-border/50 rounded-full backdrop-blur-sm">
                    <span className="text-xs font-mono text-primary animate-pulse">● LIVE</span>
                    <span className="text-xs font-mono">{time} WITA</span>
                </div>

                {/* Bagian Kanan (Trigger Button) */}
                <button 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-xs font-medium border border-border/50"
                    // 3. Ubah onClick untuk membuka CommandMenu
                    onClick={() => setOpenCommand(true)} 
                >
                    <span>Menu</span>
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </motion.header>

            {/* 4. Render CommandMenu di sini dan oper state-nya */}
            <CommandMenu open={openCommand} setOpen={setOpenCommand} />
        </>
    );
}