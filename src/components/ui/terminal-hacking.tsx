"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Terminal, RefreshCcw, ShieldAlert, ShieldCheck, Info, Gift, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Kamus kata sandi (Semua WAJIB 7 huruf biar game-nya adil)
const WORD_LIST = [
  "LARAVEL", "GROWISE", "NETWORK", "HACKERS", "ROUTERS", 
  "MALWARE", "EXPLOIT", "PAYLOAD", "PROXIES", "ENCRYPT", 
  "DECRYPT", "SERVERS", "CLIENTS", "DOMAINS", "SOCKETS", 
  "THREADS", "SQLITES", "MONITOR", "SYSTEMS", "COMMAND", 
  "CONTROL", "BOTNETS"
];

const SYMBOLS = "!@#$%^&*()-=_+[]{}|;:,.<>?/";

export function TerminalHacking() {
  const [words, setWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(4);
  const [history, setHistory] = useState<{ msg: string; type: "info" | "error" | "success" }[]>([]);
  const [status, setStatus] = useState<"booting" | "playing" | "won" | "lost">("booting");
  const scrollRef = useRef<HTMLDivElement>(null);

  const initGame = useCallback(() => {
    setStatus("booting");
    setHistory([{ msg: "...", type: "info" }]);
    
    setTimeout(() => {
      const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, 10);
      const target = selectedWords[Math.floor(Math.random() * selectedWords.length)];
      
      setWords(selectedWords);
      setTargetWord(target);
      setAttempts(4);
      setHistory(prev => [
        ...prev, 
        { msg: "ENTER PASSWORD TO UNLOCK.", type: "info" }
      ]);
      setStatus("playing");
    }, 1500);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

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
      setHistory(prev => [
        ...prev,
        { msg: `> ${guess}`, type: "info" },
        { msg: "EXACT MATCH! ACCESS GRANTED.", type: "success" }
      ]);
      setStatus("won");
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setHistory(prev => [
        ...prev,
        { msg: `> ${guess}`, type: "info" },
        { msg: `ENTRY DENIED. LIKENESS=${likeness}/7`, type: "error" }
      ]);

      if (newAttempts <= 0) {
        setHistory(prev => [
          ...prev,
          { msg: "TERMINAL LOCKED. SYSTEM COMPROMISED.", type: "error" }
        ]);
        setStatus("lost");
      }
    }
  };

  const getMemAddress = (index: number) => `0x${(61440 + index * 12).toString(16).toUpperCase()}`;

  return (
    <section className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center py-20 border-t border-border overflow-hidden transition-colors duration-500">
      
      {/* JUDUL DAN INSTRUKSI */}
      <div className="text-center mb-10 relative z-10 w-full max-w-2xl px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-foreground drop-shadow-md flex items-center justify-center gap-3 mb-6"
        >
          NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">BREACH</span>
        </motion.h2>

        {/* BOX INSTRUKSI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-card dark:bg-zinc-900 border border-border rounded-xl p-5 text-left shadow-lg"
        >
          <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-500 font-bold">
            <Info className="w-5 h-5" />
            <span>CARA BERMAIN:</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Tebak password (7 huruf) dengan mengklik kata yang tersedia di Terminal.</li>
            <li>Jika salah, sistem akan menampilkan skor <span className="text-green-600 dark:text-green-400 font-bold">Likeness</span>.</li>
            <li><strong>Likeness = 3/7</strong> artinya ada 3 huruf yang <strong>tepat dan posisinya benar</strong>.</li>
            <li>Pecahkan sebelum kesempatan habis untuk mendapat <span className="text-primary font-bold">Hadiah Rahasia!</span></li>
          </ul>
        </motion.div>
      </div>

      {/* GAME CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl px-4"
      >
        <div className="flex flex-col md:flex-row h-[500px] bg-card dark:bg-zinc-950 rounded-xl overflow-hidden font-mono text-sm border-2 border-border shadow-2xl">
          
          {/* LEFT PANEL: The Grid */}
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <span className="text-foreground font-bold">ATTEMPTS LEFT:</span>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-3 h-5 rounded-sm ${i < attempts ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-muted"}`} />
                ))}
              </div>
            </div>

            {status === "booting" ? (
              <div className="h-4/5 flex flex-col items-center justify-center text-green-500 animate-pulse gap-3">
                <Terminal className="w-10 h-10" /> 
                <span className="font-bold tracking-widest">BOOTING SYSTEM...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground">
                {words.map((word, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-foreground/40 hidden sm:inline-block">{getMemAddress(idx)}</span>
                    <span className="text-foreground/30 select-none hidden md:inline">
                      {SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length))}
                    </span>
                    <button
                      onClick={() => handleGuess(word)}
                      disabled={status !== "playing"}
                      className="text-foreground hover:text-background hover:bg-green-500 px-2 py-0.5 rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground uppercase tracking-widest font-bold"
                    >
                      {word}
                    </button>
                    <span className="text-foreground/30 select-none hidden md:inline">
                      {SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Terminal Output */}
          <div className="w-full md:w-[350px] bg-muted/30 dark:bg-black/40 p-6 flex flex-col relative">
            <div className="flex-1 overflow-y-auto space-y-2 pr-2" ref={scrollRef}>
              <AnimatePresence>
                {history.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      ${log.type === "info" ? "text-foreground/80" : ""}
                      ${log.type === "error" ? "text-red-500 font-bold" : ""}
                      ${log.type === "success" ? "text-green-500 font-bold" : ""}
                    `}
                  >
                    {log.msg}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* OVERLAY: Menang / Kalah */}
            {status !== "playing" && status !== "booting" && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-t md:border-t-0 md:border-l border-border z-20">
                {status === "won" ? (
                  <>
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-2 animate-bounce" />
                    <h3 className="text-xl font-black text-green-500 mb-1">ACCESS GRANTED</h3>
                    <p className="text-muted-foreground text-xs mb-4">Mainframe Unlocked.</p>
                    
                    {/* KOTAK HADIAH (REWARD) */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 w-full shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold mb-2">
                        <Gift className="w-5 h-5 animate-pulse" />
                        <span>REWARD UNLOCKED</span>
                      </div>
                      <p className="text-xs text-foreground mb-3 font-sans">
                        GGWP! Lu berhasil nge-hack sistem ini. Sebagai hadiah, lu dapat jalur <strong>VIP Direct Access</strong>
                      </p>
                      <a 
                        href="https://youtu.be/dQw4w9WgXcQ?si=gWmDhCT9N92E28RZ" 
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm font-sans"
                      >
                        <Mail className="w-4 h-4" /> Klaim Hadiah
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold text-red-500 mb-2">LOCKOUT INITIATED</h3>
                    <p className="text-muted-foreground mb-6">Security breach detected. Terminal locked.</p>
                  </>
                )}
                
                <Button 
                  onClick={initGame} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> REBOOT TERMINAL
                </Button>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
}