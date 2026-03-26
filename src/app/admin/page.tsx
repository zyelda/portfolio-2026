"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Lock, LogOut, Trash2, Mail, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Message = {
  id: string;
  message: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Cek Status Login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ambil data & Subscribe Real-time kalau udah login
  useEffect(() => {
    if (!session) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("anonymous_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setMessages(data);
    };

    fetchMessages();

    // Listener Real-time
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "anonymous_messages" },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "anonymous_messages" },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg("Akses ditolak. Kredensial tidak valid.");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const deleteMessage = async (id: string) => {
    // Karena udah pake RLS, cuma user login yang bisa ngehapus
    await supabase.from("anonymous_messages").delete().eq("id", id);
  };

  // --- TAMPILAN LOADING ---
  if (loading && !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // --- TAMPILAN LOGIN (SYSTEM LOCKED) ---
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl"
        >
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-foreground">RESTRICTED AREA</h1>
            <p className="text-sm text-muted-foreground mt-2">Login required to access Neural Dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg text-center font-bold">{errorMsg}</div>}
            <Input 
              type="email" 
              placeholder="Operator Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="bg-background border-border"
            />
            <Input 
              type="password" 
              placeholder="Passcode" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="bg-background border-border"
            />
            <Button type="submit" disabled={loading} className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "AUTHENTICATE"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- TAMPILAN DASHBOARD (JIKA BERHASIL LOGIN) ---
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Admin */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="font-bold">
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </header>

      {/* Konten Pesan */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" /> INBOX
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Pesan masuk secara real-time. Total: {messages.length} pesan.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
            <Mail className="w-12 h-12 mb-4 opacity-20" />
            <p>Belum ada pesan yang masuk, Komandan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-border pb-3">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {new Date(msg.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      <Button 
                        onClick={() => deleteMessage(msg.id)} 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}