"use client";

import { useEffect, useState } from "react";
import { getStoicQuote } from "@/lib/stoic-service";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function StoicQuote() {
  const [quote, setQuote] = useState<string>("Loading ancient wisdom...");

  useEffect(() => {
    getStoicQuote().then(setQuote);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-6 py-12 text-center"
    >
      <div className="flex justify-center mb-4">
        <Quote className="w-8 h-8 text-primary/40" />
      </div>
      <p className="text-xl font-medium italic text-foreground/80 leading-relaxed tracking-tight">
        {quote}
      </p>
      <div className="mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto"></div>
    </motion.div>
  );
}