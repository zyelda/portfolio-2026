"use client";

import { useEffect, useState } from "react";
import { Music, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpotifyNowPlaying() {
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/now-playing");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Lanyard fetch error");
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const isPlaying = data?.isPlaying;

  return (
    <div className="w-full flex justify-center items-center py-4">
      <a
        href={isPlaying ? data.songUrl : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group relative flex items-center gap-5 p-4 overflow-hidden transition-all duration-700",
          "w-full max-w-[380px] rounded-[24px] border bg-card/20 backdrop-blur-2xl",
          isPlaying 
            ? "border-green-500/20 shadow-2xl shadow-green-500/5 cursor-pointer" 
            : "cursor-default opacity-40 grayscale"
        )}
        onClick={(e) => !isPlaying && e.preventDefault()}
      >
        {/* --- AMBIENT GLOW EFFECT --- */}
        {isPlaying && (
          <>
            {/* Cahaya Utama yang Berdenyut */}
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-green-500/10 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse delay-700" />
            
            {/* Soft Glow di Area Tengah */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </>
        )}

        {/* --- VINYL DISK --- */}
        <div className="relative z-20 w-16 h-16 shrink-0 flex items-center justify-center">
          {isPlaying ? (
            <div className="relative w-full h-full p-1 rounded-full bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-[spin_12s_linear_infinite]">
              <img
                src={data.albumImageUrl}
                alt={data.album}
                className="w-full h-full object-cover rounded-full opacity-90"
              />
              {/* Vinyl Grooves & Hole */}
              <div className="absolute inset-0 rounded-full border-[8px] border-black/5 pointer-events-none" />
              <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-[#121212] border border-white/10 shadow-inner flex items-center justify-center">
                 <div className="w-1 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-muted/10 flex items-center justify-center border border-white/5 shadow-inner">
              <Music className="w-6 h-6 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* --- CONTENT --- */}
        <div className="relative z-20 flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
             <span className={cn(
               "text-[9px] font-bold uppercase tracking-[0.3em]",
               isPlaying ? "text-green-500/80 animate-pulse" : "text-muted-foreground/30"
             )}>
               {isPlaying ? "Vibing Now" : "Sleeping"}
             </span>
          </div>

          <h4 className="text-[14px] font-bold truncate text-foreground/90 group-hover:text-green-400 transition-colors duration-500 tracking-tight">
            {isPlaying ? data.title : "Not Playing"}
          </h4>
          <p className="text-[11px] text-muted-foreground/60 truncate font-medium mt-0.5">
            {isPlaying ? data.artist : "Spotify"}
          </p>
        </div>

        {/* --- ACTION ICON --- */}
        {isPlaying && (
          <div className="relative z-20 pr-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
             <ExternalLink className="w-4 h-4 text-green-500/50" />
          </div>
        )}

        {/* --- BOTTOM BORDER BEAM --- */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        )}
      </a>
    </div>
  );
}