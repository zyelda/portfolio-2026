"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles, RefreshCw, X, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  { id: "styling", text: "Apakah berhubungan dengan Styling/Desain (CSS)?" },
  { id: "tool", text: "Apakah itu sebuah Tool / Software (bukan kodingan)?" },
  { id: "blue", text: "Apakah logonya berwarna Biru?" },
  { id: "yellow", text: "Apakah logonya berwarna Kuning/Oranye?" },
  { id: "web", text: "Apakah teknologi ini fundamental untuk Web?" },
  { id: "framework", text: "Apakah itu sebuah Framework/Library?" },
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

  const pickNextQuestion = (currentCandidates: typeof TECH_DATABASE) => {
    const relevantTags = new Set<string>();
    currentCandidates.forEach(c => c.tags.forEach(t => relevantTags.add(t)));
    
    const possibleQuestions = QUESTIONS.filter(q => relevantTags.has(q.id));
    
    if (possibleQuestions.length === 0 || currentCandidates.length <= 1) {
      makeGuess(currentCandidates);
      return;
    }

    const nextQ = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
    setCurrentQ(nextQ);
  };

  const handleAnswer = (isYes: boolean) => {
    if (!currentQ) return;

    const nextCandidates = candidates.filter(c => {
      const hasTag = c.tags.includes(currentQ.id);
      return isYes ? hasTag : !hasTag;
    });

    setCandidates(nextCandidates);
    setStep(s => s + 1);

    if (nextCandidates.length === 1) {
      makeGuess(nextCandidates);
    } else if (nextCandidates.length === 0) {
      setGameState("LOSE"); // Neural nyerah
    } else {
      pickNextQuestion(nextCandidates);
    }
  };

  const makeGuess = (finalCandidates: typeof TECH_DATABASE) => {
    if (finalCandidates.length > 0) {
      setGuess(finalCandidates[0]);
      setGameState("GUESSING");
    } else {
      setGameState("LOSE");
    }
  };

  const startGame = () => {
    setGameState("PLAYING");
    pickNextQuestion(TECH_DATABASE);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden text-center flex flex-col items-center [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Neural Oracle</DialogTitle></VisuallyHidden>
        
        <div className="w-full flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-900/50">
           <div className="flex items-center gap-2 text-purple-400">
              <BrainCircuit className="w-5 h-5" />
              <span className="font-mono font-bold tracking-widest text-sm">MIND READER</span>
           </div>
           <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-8 w-full min-h-[300px] flex flex-col items-center justify-center">
          
          <AnimatePresence mode="wait">
            
            {gameState === "INTRO" && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping"></div>
                   <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Tantang Neural V1</h3>
                    <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                        Pikirkan satu teknologi (Bahasa, Framework, Tool). Saya akan menebaknya dalam beberapa langkah.
                    </p>
                </div>
                <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 text-white w-full max-w-[200px]">
                    Mulai Tantangan
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
                 <span className="text-xs font-mono text-purple-500 mb-4">PERTANYAAN #{step + 1}</span>
                 <h3 className="text-xl font-bold text-white mb-8">{currentQ.text}</h3>
                 
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <Button onClick={() => handleAnswer(true)} variant="outline" className="h-14 border-zinc-700 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500">
                        <Check className="mr-2 w-4 h-4" /> YA
                    </Button>
                    <Button onClick={() => handleAnswer(false)} variant="outline" className="h-14 border-zinc-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500">
                        <X className="mr-2 w-4 h-4" /> TIDAK
                    </Button>
                 </div>
                 <button onClick={() => pickNextQuestion(candidates)} className="mt-6 text-xs text-zinc-600 hover:text-zinc-400 underline">
                    Saya tidak tahu
                 </button>
              </motion.div>
            )}

            {gameState === "GUESSING" && guess && (
               <motion.div
                 key="guess"
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center gap-6"
               >
                  <div className="text-center">
                      <span className="text-xs font-mono text-purple-500 block mb-2">ANALISIS SELESAI...</span>
                      <h3 className="text-2xl font-bold text-white">Apakah yang kamu pikirkan...</h3>
                  </div>

                  <div className="p-6 bg-zinc-900 border border-purple-500/50 rounded-2xl shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)]">
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {guess.name}
                      </h2>
                  </div>

                  <div className="flex gap-4 mt-4">
                      <Button onClick={() => setGameState("WIN")} className="bg-green-600 hover:bg-green-700">
                          <ThumbsUp className="mr-2 w-4 h-4" /> Benar!
                      </Button>
                      <Button onClick={() => setGameState("LOSE")} variant="secondary">
                          <ThumbsDown className="mr-2 w-4 h-4" /> Salah
                      </Button>
                  </div>
               </motion.div>
            )}

            {(gameState === "WIN" || gameState === "LOSE") && (
                <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    {gameState === "WIN" ? (
                        <>
                            <div className="text-5xl">😎</div>
                            <h3 className="text-xl font-bold text-white">Neural V1 Tidak Terkalahkan!</h3>
                            <p className="text-sm text-zinc-400">Teknologi itu mudah ditebak.</p>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl">😵‍💫</div>
                            <h3 className="text-xl font-bold text-white">Sistem Overload...</h3>
                            <p className="text-sm text-zinc-400">Kamu memikirkan sesuatu yang sangat langka!</p>
                        </>
                    )}
                    <Button onClick={resetGame} variant="outline" className="mt-4 border-zinc-700">
                        <RefreshCw className="mr-2 w-4 h-4" /> Main Lagi
                    </Button>
                </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}