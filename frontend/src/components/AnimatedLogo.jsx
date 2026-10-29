import React from "react";
import { Mic } from "lucide-react";

export default function AnimatedLogo({ className }) {
  return (
    <div className={`flex items-center gap-2 group ${className || ""}`}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors"
      >
        <Mic className="w-4 h-4" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        Answer<span className="text-cyan-400">Forge</span>
      </span>
    </div>
  );
}
