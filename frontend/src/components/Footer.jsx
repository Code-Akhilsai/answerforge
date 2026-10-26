import React from "react";
import { Mic, Heart } from "lucide-react";

export default function Footer({ onOpenSignInModal }) {
  return (
    <footer className="bg-[#06080c] border-t border-zinc-800/80 py-10 text-zinc-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo & Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">
              Answer<span className="text-cyan-400">Forge</span>
            </span>
            <span className="text-zinc-500 ml-2 text-[11px]">
              &bull; Powered by Gnani.ai Speech APIs
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a href="#interactive-sandbox" className="hover:text-white transition-colors">Demo</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#gnani-tech" className="hover:text-white transition-colors">Gnani APIs</a>
          <button onClick={onOpenSignInModal} className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign In
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-zinc-500">
          Hackathon Edition &bull; {new Date().getFullYear()}
        </div>

      </div>
    </footer>
  );
}
