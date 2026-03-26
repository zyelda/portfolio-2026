"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan lu punya utility cn bawaan shadcn

export function SpotifyNowPlaying() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await fetch("/api/now-playing");
      const json = await res.json();
      setData(json);
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); 
    return () => clearInterval(interval);
  }, []);

  const isPlaying = data?.isPlaying;

  return (
    <div className="w-full py-4 px-4 flex justify-center items-center">
      <a 
        href={isPlaying ? data.songUrl : undefined} 
        target="_blank" 
        rel="noopener noreferrer"
        /* LOGIC DI SINI: Kalau gak main, matikan hover dan ganti kursor */
        className={cn(
          "flex items-center gap-4 p-3 bg-card/50 border border-border rounded-2xl transition-all group w-full max-w-[300px] shadow-sm",
          isPlaying 
            ? "hover:bg-muted/50 cursor-pointer border-green-500/20 shadow-green-500/5" 
            : "cursor-default opacity-80"
        )}
        /* Tambahan biar bener-bener gak bisa di-klik secara sistem */
        onClick={(e) => !isPlaying && e.preventDefault()}
      >
        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg border border-border">
          {isPlaying ? (
            <img 
              src={data.albumImageUrl} 
              alt={data.album} 
              className="w-full h-full object-cover animate-spin-slow" 
              style={{ animationDuration: '10s' }} 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold text-green-500 flex items-center gap-1">
            {isPlaying ? (
              <>
                <span className="flex gap-0.5 h-3 items-end">
                  <span className="w-0.5 bg-green-500 animate-[bounce_1s_infinite]" />
                  <span className="w-0.5 bg-green-500 animate-[bounce_0.7s_infinite]" />
                  <span className="w-0.5 bg-green-500 animate-[bounce_1.3s_infinite]" />
                </span>
                NOW PLAYING
              </>
            ) : (
              <span className="text-muted-foreground/60 uppercase tracking-widest">Offline</span>
            )}
          </p>
          <h4 className="text-sm font-bold truncate text-foreground">
            {isPlaying ? data.title : "Not Listening"}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {isPlaying ? data.artist : "Spotify"}
          </p>
        </div>
      </a>
    </div>
  );
}