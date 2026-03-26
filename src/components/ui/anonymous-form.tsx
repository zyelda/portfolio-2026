"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, CheckCircle2, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AnonymousForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("loading");

    try {
      // Tembak data ke tabel anonymous_messages di Supabase
      const { error } = await supabase
        .from("anonymous_messages")
        .insert([{ message: message.trim() }]);

      if (error) throw error;

      setStatus("success");
      setMessage("");
      
      // Balikin ke status awal setelah 3 detik
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Gagal ngirim pesan:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="w-full py-20 px-4 flex justify-center items-center bg-background transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-lg relative"
      >
        {/* Efek Glow di belakang form (khusus Dark Mode) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 dark:opacity-40 pointer-events-none"></div>
        
        <div className="relative bg-card dark:bg-zinc-950 border border-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <MessageSquare className="w-6 h-6" />
            <h3 className="text-xl font-black text-foreground">SECRET COMM CHANNEL</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Kirim pesan anonim. Identitas lu 100% aman dan dirahasiakan oleh sistem.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading" || status === "success"}
                placeholder="Ketik pesan rahasia lu di sini..."
                className="w-full min-h-[120px] p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all disabled:opacity-50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={!message.trim() || status === "loading" || status === "success"}
              className={`w-full font-bold transition-all duration-300 ${
                status === "success" ? "bg-green-600 hover:bg-green-700 text-white" : 
                status === "error" ? "bg-red-600 hover:bg-red-700 text-white" : 
                "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> KIRIM PESAN ANONIM
                  </motion.div>
                )}
                {status === "loading" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> ENCRYPTING & SENDING...
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> PESAN TERKIRIM
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> GAGAL MENGIRIM
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}