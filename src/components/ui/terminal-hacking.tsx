"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Terminal, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Hash, 
  Activity, 
  Gift, 
  Mail 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WORD_LIST = [
  "LARAVEL", "GROWISE", "NETWORK", "HACKERS", "ROUTERS", 
  "MALWARE", "EXPLOIT", "PAYLOAD", "PROXIES", "ENCRYPT", 
  "DECRYPT", "SERVERS", "CLIENTS", "DOMAINS", "SOCKETS", 
  "THREADS", "SQLITES", "MONITOR", "SYSTEMS", "COMMAND", 
  "CONTROL", "BOTNETS"
];

export function TerminalHacking() {
  const [words, setWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(4);
  const [history, setHistory] = useState<{ msg: string; type: "info" | "error" | "success" }[]>([]);
  const [status, setStatus] = useState<"booting" | "playing" | "won" | "lost">("booting");
  const scrollRef = useRef<HTMLDivElement>(null);

  const initGame = useCallback(() => {
    setStatus("booting");
    setHistory([{ msg: "Mengautentikasi sesi...", type: "info" }]);
    
    setTimeout(() => {
      const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, 10);
      setWords(selectedWords);
      setTargetWord(selectedWords[Math.floor(Math.random() * selectedWords.length)]);
      setAttempts(4);
      setHistory(prev => [...prev, { msg: "Sistem siap, Masukkan kata.", type: "info" }]);
      setStatus("playing");
    }, 1200);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleGuess = (guess: string) => {
    if (status !== "playing") return;

    let likeness = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) likeness++;
    }

    if (guess === targetWord) {
      setHistory(prev => [...prev, { msg: `> ${guess}`, type: "info" }, { msg: "Akses diterima.", type: "success" }]);
      setStatus("won");
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setHistory(prev => [...prev, { msg: `> ${guess}`, type: "info" }, { msg: `Gagal. Kemiripan: ${likeness}/7`, type: "error" }]);

      if (newAttempts <= 0) {
        setHistory(prev => [...prev, { msg: "Sistem terkunci sementara.", type: "error" }]);
        setStatus("lost");
      }
    }
  };

  return (
    <section className="w-full min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 md:px-6 transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-10 w-full max-w-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
        >
          <Activity className="w-3 h-3" /> Security Challenge
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
          Neural <span className="text-primary">Validator</span>
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Pilih kata sandi yang tepat berdasarkan skor kemiripan karakter.
        </p>
      </div>

      {/* SECTION: PENJELASAN PERMAINAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2 text-primary">
            <div className="p-2 rounded-lg bg-primary/10">
              <Hash className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">1. Pilih Kata</h4>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Klik salah satu kata sandi dari daftar memori di sebelah kiri untuk mencoba akses.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2 text-primary">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">2. Cek Kemiripan</h4>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Skor <strong>Likeness</strong> menunjukkan berapa huruf yang tepat dan berada di posisi yang benar.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2 text-primary">
            <div className="p-2 rounded-lg bg-primary/10">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">3. Otorisasi</h4>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Gunakan petunjuk tersebut untuk menebak kata yang benar sebelum 4 kali percobaan habis.
          </p>
        </motion.div>
      </div>

      {/* MAIN INTERFACE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row md:h-[520px]"
      >
        
        {/* PANEL KATA (Kiri) */}
        <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-card to-background/30 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Percobaan</span>
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-7 h-1 rounded-full transition-all duration-500", 
                      i < attempts ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-muted"
                    )} 
                  />
                ))}
              </div>
            </div>
            <Hash className="w-5 h-5 text-muted-foreground/10" />
          </div>

          {status === "booting" ? (
            <div className="h-40 md:h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <RefreshCcw className="w-5 h-5 animate-spin text-primary" />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase opacity-50">Initializing...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {words.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(word)}
                  disabled={status !== "playing"}
                  className="group flex items-center text-foreground/70 hover:text-primary transition-all duration-200 cursor-pointer disabled:cursor-default py-1"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-all mr-3 shrink-0" />
                  <span className="text-[13px] md:text-sm font-mono font-bold tracking-[0.1em] uppercase truncate">
                    {word}
                  </span>
                  <ChevronRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
        

        {/* PANEL CONSOLE (Kanan) - FIXED WIDTH */}
        <div className="w-full md:w-[320px] md:min-w-[320px] bg-muted/10 backdrop-blur-sm p-6 flex flex-col relative h-[280px] md:h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 px-1 shrink-0">
            <Terminal className="w-3 h-3 text-primary/60" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Console Output</span>
          </div>
          
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide mb-2" ref={scrollRef}>
            <AnimatePresence mode="popLayout">
              {history.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "text-[10px] font-mono py-1.5 px-3 rounded-lg border break-words",
                    log.type === "info" && "bg-background/40 border-transparent text-muted-foreground",
                    log.type === "error" && "bg-red-500/5 border-red-500/10 text-red-500 font-medium",
                    log.type === "success" && "bg-primary/5 border-primary/10 text-primary font-bold"
                  )}
                >
                  {log.msg}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* OVERLAY HASIL */}
          <AnimatePresence>
            {status !== "playing" && status !== "booting" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center z-50 border-t md:border-t-0 md:border-l border-border"
              >
                {status === "won" ? (
                  <div className="w-full space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="px-2">
                      <h3 className="text-md font-bold mb-1">Diterima</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">Kode valid. Selamat, silahkan klaim hadiah lu.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl border border-border mt-2">
                      <Gift className="w-4 h-4 text-primary mx-auto mb-2 animate-bounce" />
                      <Button asChild className="w-full rounded-xl font-bold h-8 text-[10px]">
                        <a href="https://youtu.be/dQw4w9WgXcQ?si=VkKM92UhO7O81hEn" target="_blank">
                           <Mail className="w-3 h-3 mr-2" /> Klaim Hadiah
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="px-2">
                      <h3 className="text-md font-bold mb-1 text-red-500 uppercase tracking-tighter">Terkunci</h3>
                      <p className="text-[10px] text-muted-foreground">Upaya gagal melampaui batas. Harap muat ulang sistem.</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={initGame} 
                  variant="ghost"
                  className="mt-6 w-full text-[9px] font-bold tracking-[0.2em] hover:bg-muted h-8"
                >
                  <RefreshCcw className="w-3 h-3 mr-2" /> REBOOT_SYSTEM
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}