import React, { useState, useEffect } from "react";
import { Mic, LogIn, Menu, X } from "lucide-react";

export default function Navbar({ onOpenSignInModal, onScrollToDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Live Demo", href: "#interactive-sandbox" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Gnani Voice Tech", href: "#gnani-tech" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800 shadow-xl py-3.5" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  Answer<span className="text-cyan-400">Forge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Gnani AI Voice
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Clean Sign In button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenSignInModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-300 hover:text-cyan-400 py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignInModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
