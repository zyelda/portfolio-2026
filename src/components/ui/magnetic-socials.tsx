"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export default function MagneticSocials() {
    const socials = [
    { icon: <Github className="w-6 h-6" />, link: "https://github.com/zyelda", label: "GitHub" },
    { icon: <Linkedin className="w-6 h-6" />, link: "https://linkedin.com/in/aditias-zulmatoriq-5174752a6", label: "LinkedIn" },
    { icon: <Instagram className="w-6 h-6" />, link: "https://instagram.com/zoelmatoriq", label: "Instagram" },
    { icon: <Mail className="w-6 h-6" />, link: "mailto:zulmatoriq123@gmail.com", label: "Email" },
    ];

    return (
    <div className="flex gap-4 items-center">
        {socials.map((social, index) => (
        <MagneticItem key={index}>
            <Link 
            href={social.link} 
            target="_blank" 
            className="relative flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-colors"
            >
            {social.icon}
            </Link>
        </MagneticItem>
        ))}
    </div>
    );
}

function MagneticItem({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
    setPosition({ x: 0, y: 0 });
    };

    return (
    <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
        {children}
    </motion.div>
    );
}