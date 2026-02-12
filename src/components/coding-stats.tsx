"use client";

import { useEffect, useState } from "react";
import { Code, Terminal } from "lucide-react";

export function CodingStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/wakatime")
      .then((res) => res.json())
      .then((data) => setStats(data.data));
  }, []);

  if (!stats) return <div className="text-xs text-muted-foreground animate-pulse">Loading system stats...</div>;

  return (
    <div className="flex flex-col gap-4 p-4 border border-border/50 rounded-xl bg-secondary/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-green-500" />
        <h3 className="text-sm font-semibold">Weekly Coding Activity</h3>
      </div>
      
      <div className="space-y-3">
        {stats.languages?.slice(0, 4).map((lang: any) => (
          <div key={lang.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{lang.name}</span>
              <span className="text-muted-foreground">{lang.text}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/80" 
                style={{ width: `${lang.percent}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 text-[10px] text-muted-foreground border-t border-border/30 flex justify-between">
        <span>Total: {stats.human_readable_total}</span>
        <span>Status: ACTIVE</span>
      </div>
    </div>
  );
}