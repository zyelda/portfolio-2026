"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles, RefreshCw, X, Check, ThumbsUp, ThumbsDown, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

const TECH_DATABASE = [
  { name: "Python", tags: ["language", "backend", "datascience", "snake", "blue", "yellow"] },
  { name: "JavaScript", tags: ["language", "frontend", "backend", "web", "yellow"] },
  { name: "TypeScript", tags: ["language", "frontend", "backend", "web", "types", "blue"] },
  { name: "React", tags: ["library", "frontend", "facebook", "blue", "atom"] },
  { name: "Next.js", tags: ["framework", "frontend", "fullstack", "react", "black", "white"] },
  { name: "Tailwind CSS", tags: ["framework", "css", "styling", "utility", "blue", "cyan"] },
  { name: "HTML", tags: ["language", "markup", "skeleton", "orange", "web"] },
  { name: "CSS", tags: ["language", "styling", "web", "blue"] },
  { name: "Docker", tags: ["tool", "devops", "container", "whale", "blue"] },
  { name: "Git", tags: ["tool", "version-control", "linus", "orange"] },
  { name: "Linux", tags: ["os", "kernel", "penguin", "open-source", "black"] },
  { name: "PHP", tags: ["language", "backend", "elephant", "purple", "web"] },
  { name: "Java", tags: ["language", "backend", "coffee", "enterprise", "red", "blue"] },
  { name: "SQL", tags: ["language", "database", "query", "data"] },
  { name: "C++", tags: ["language", "system", "performance", "blue"] },
];

const QUESTIONS = [
  { id: "language", text: "Apakah itu sebuah Bahasa Pemrograman?" },
  { id: "frontend", text: "Apakah sering digunakan untuk Frontend (Tampilan)?" },
  { id: "backend", text: "Apakah sering digunakan untuk Backend (Server)?" },
  { id: "styling", text: "Apakah berhubungan dengan Desain/Styling (CSS)?" },
  { id: "tool", text: "Apakah itu sebuah Tool / Software pendukung?" },
  { id: "blue", text: "Apakah identik dengan warna Biru?" },
  { id: "yellow", text: "Apakah identik dengan warna Kuning/Oranye?" },
  { id: "web", text: "Apakah teknologi ini fundamental untuk Web?" },
  { id: "framework", text: "Apakah itu sebuah Framework atau Library?" },
];

export function NeuralOracle({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [candidates, setCandidates] = useState(TECH_DATABASE);
  const [step, setStep] = useState(0);
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [gameState, setGameState] = useState<"INTRO" | "PLAYING" | "GUESSING" | "WIN" | "LOSE">("INTRO");
  const [guess, setGuess] = useState<any>(null);

  const resetGame = () => {
    setCandidates(TECH_DATABASE);
    setStep(0);
    setGameState("INTRO");
    setGuess(null);
    setCurrentQ(null);
  };

  const makeGuess = (finalCandidates: typeof TECH_DATABASE) => {
    if (finalCandidates.length > 0) {
      setGuess(finalCandidates[0]);
      setGameState("GUESSING");
    } else {
      setGameState("LOSE");
    }
  };

  const pickNextQuestion = useCallback((currentCandidates: typeof TECH_DATABASE) => {
    const relevantTags = new Set<string>();
    currentCandidates.forEach(c => c.tags.forEach(t => relevantTags.add(t)));
    const possibleQuestions = QUESTIONS.filter(q => relevantTags.has(q.id));
    
    if (possibleQuestions.length === 0 || currentCandidates.length <= 1) {
      makeGuess(currentCandidates);
      return;
    }

    const nextQ = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
    setCurrentQ(nextQ);
  }, []);

  const handleAnswer = (isYes: boolean) => {
    if (!currentQ) return;
    const nextCandidates = candidates.filter(c => {
      const hasTag = c.tags.includes(currentQ.id);
      return isYes ? hasTag : !hasTag;
    });

    setCandidates(nextCandidates);
    setStep(s => s + 1);

    if (nextCandidates.length <= 1) {
      makeGuess(nextCandidates);
    } else {
      pickNextQuestion(nextCandidates);
    }
  };

  const startGame = () => {
    setGameState("PLAYING");
    pickNextQuestion(TECH_DATABASE);
  };

  const progress = Math.min((step / 8) * 100, 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg bg-card/95 border-border p-0 overflow-hidden text-center flex flex-col items-center [&>button]:hidden shadow-2xl rounded-[40px] backdrop-blur-xl transition-colors duration-500">
        <VisuallyHidden><DialogTitle>Neural Oracle</DialogTitle></VisuallyHidden>
        
        {/* HEADER AREA */}
        <div className="w-full relative shrink-0">
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3 text-primary pl-2">
                   <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <BrainCircuit className="w-5 h-5 animate-pulse" />
                   </div>
                   <div className="text-left">
                      <span className="block font-black tracking-tighter text-sm uppercase">Neural Oracle</span>
                      <span className="block text-[9px] text-muted-foreground font-bold tracking-[0.2em]">SISTEM V1.0.4</span>
                   </div>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="bg-muted hover:bg-background transition-all p-2 rounded-full border border-border group cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:rotate-90 transition-transform duration-300"/>
                </button>
            </div>
            {gameState === "PLAYING" && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary"
                    />
                </div>
            )}
        </div>

        {/* INTERACTIVE BODY */}
        <div className="p-8 md:p-12 w-full min-h-[420px] flex flex-col items-center justify-center relative">
          
          <AnimatePresence mode="wait">
            {gameState === "INTRO" && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-xl rotate-12 relative z-10">
                       <Sparkles className="w-10 h-10 text-white -rotate-12" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground tracking-tight leading-tight">Analisis Pikiran Digital</h3>
                    <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed font-medium">
                        Pikirkan satu teknologi modern. Biarkan algoritma saya menebaknya.
                    </p>
                </div>
                <Button 
                    onClick={startGame} 
                    className="cursor-pointer group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl px-12 h-14 shadow-2xl shadow-primary/20 transition-all active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">MULAI ANALISIS <Zap className="w-4 h-4 fill-current" /></span>
                </Button>
              </motion.div>
            )}

            {gameState === "PLAYING" && currentQ && (
              <motion.div 
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center w-full"
              >
                 <div className="flex items-center gap-2 mb-8">
                    <Target className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground tracking-[0.4em] uppercase">Data Point {step + 1}</span>
                 </div>
                 
                 <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-12 px-2 leading-[1.2] tracking-tight min-h-[80px] flex items-center">
                    {currentQ.text}
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-5 w-full max-w-sm">
                    <Button 
                      onClick={() => handleAnswer(true)} 
                      variant="outline" 
                      className="group h-20 rounded-3xl border-2 border-border hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/50 transition-all font-black text-lg shadow-sm cursor-pointer"
                    >
                        <Check className="mr-3 w-6 h-6 text-green-500 group-hover:scale-125 transition-transform" /> YA
                    </Button>
                    <Button 
                      onClick={() => handleAnswer(false)} 
                      variant="outline" 
                      className="group h-20 rounded-3xl border-2 border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all font-black text-lg shadow-sm cursor-pointer"
                    >
                        <X className="mr-3 w-6 h-6 text-red-500 group-hover:scale-125 transition-transform" /> TIDAK
                    </Button>
                 </div>
                 <button 
                  onClick={() => pickNextQuestion(candidates)} 
                  className="mt-10 text-[10px] font-black text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors cursor-pointer"
                >
                    LEWATI PERTANYAAN
                 </button>
              </motion.div>
            )}

            {gameState === "GUESSING" && guess && (
               <motion.div
                 key="guess"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center gap-10"
               >
                  <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> Match Found
                      </div>
                      <h3 className="text-xl font-bold text-foreground opacity-70">Prediksi Akhir...</h3>
                  </div>

                  <div className="p-10 md:p-14 bg-gradient-to-br from-card to-muted/30 border-2 border-primary/30 rounded-[48px] shadow-2xl relative group overflow-hidden">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-[50px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                      <h2 className="relative text-5xl md:text-6xl font-black text-foreground tracking-tighter drop-shadow-sm">
                        {guess.name}
                      </h2>
                  </div>

                  <div className="flex gap-4 w-full max-w-[320px] relative z-20">
                      <Button onClick={() => setGameState("WIN")} className="flex-1 rounded-2xl h-14 font-black bg-green-600 hover:bg-green-700 shadow-lg cursor-pointer">
                          <ThumbsUp className="mr-2 w-4 h-4" /> BENAR
                      </Button>
                      <Button onClick={() => setGameState("LOSE")} variant="secondary" className="flex-1 rounded-2xl h-14 font-black cursor-pointer">
                          <ThumbsDown className="mr-2 w-4 h-4" /> SALAH
                      </Button>
                  </div>
               </motion.div>
            )}

            {(gameState === "WIN" || gameState === "LOSE") && (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="text-7xl">
                        {gameState === "WIN" ? "🧙‍♂️" : "🚧"}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-foreground tracking-tight">
                            {gameState === "WIN" ? "Tebakan Akurat!" : "Sistem Anomali"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-[280px] font-medium leading-relaxed opacity-80 italic">
                            {gameState === "WIN" 
                              ? "Pikiran Anda berhasil didekripsi oleh Neural V1." 
                              : "Input Anda berada di luar basis data standar kami."}
                        </p>
                    </div>
                    <Button onClick={resetGame} variant="outline" className="mt-4 rounded-2xl px-12 border-2 border-border hover:bg-muted font-black h-12 cursor-pointer">
                        <RefreshCw className="mr-2 w-4 h-4" /> MAIN LAGI
                    </Button>
                </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}