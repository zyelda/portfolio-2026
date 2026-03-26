"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "system";
  content: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Halo bro! Gw **Neural V1** Asisten yang punya portfolio ini. Ada yang mau lu tanyain soal Toriq?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: "system", content: data.reply }]);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      setMessages((prev) => [...prev, { role: "system", content: "Sori bro, server gw lagi ngadat nih." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            // Support Light/Dark Mode untuk Container Utama
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-sm text-foreground">Neural Assistant</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 text-sm max-w-[90%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar Bubble */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted border-border text-foreground"
                  )}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  {/* Chat Bubble & Markdown */}
                  <div className={cn(
                    "p-3 rounded-2xl overflow-hidden",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/80 border border-border text-foreground rounded-tl-none"
                  )}>
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      // Styling Markdown yang support Light/Dark Mode
                      <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>strong]:text-purple-600 dark:[&>strong]:text-purple-400 [&>strong]:font-bold [&>ul]:list-disc [&>ul]:pl-4">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-pulse text-muted-foreground" />
                  </div>
                  <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none border border-border text-xs flex items-center gap-1">
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}/>
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}/>
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}/>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-muted/30">
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..." 
                  className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}