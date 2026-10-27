import React, { useState } from "react";
import {
  Mic,
  Volume2,
  Play,
  Pause,
  ArrowRight,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function Hero({ onOpenSignInModal, onScrollToDemo }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const samplePrompts = [
    {
      role: "Software Engineering",
      question:
        "How would you design a rate limiter to handle sudden traffic spikes across multiple microservices?",
    },
    {
      role: "Product Management",
      question:
        "How do you decide between shipping a quick MVP versus building a scalable architecture from day one?",
    },
    {
      role: "Behavioral & STAR",
      question:
        "Tell me about a time you had a major disagreement with a team member. How did you resolve it?",
    },
  ];

  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          samplePrompts[activePromptIndex].question,
        );
        utterance.rate = 0.96;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-grid-subtle relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Simple Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Powered by Gnani Speech-to-Text & Text-to-Speech</span>
        </div>

        {/* Clear Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          AI-Powered Spoken{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-300">
            Interview Practice
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Don't just type text answers. Speak aloud to realistic AI interview
          questions. Gnani’s speech engine transcribes your voice, flags filler
          words like "um" and "like", measures your speaking pace, and delivers
          instant actionable feedback.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onScrollToDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Try Live Voice Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenSignInModal}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Simple Audio Voice Sample Card */}
        <div className="mt-12 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 max-w-2xl mx-auto text-left shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-zinc-800 text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Hear Sample Question (Gnani TTS)</span>
            </span>
            <div className="flex gap-1">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePromptIndex(idx);
                    if (isPlayingAudio && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      setIsPlayingAudio(false);
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                    activePromptIndex === idx
                      ? "bg-zinc-800 text-cyan-300 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {p.role.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="shrink-0 w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              aria-label={isPlayingAudio ? "Pause sample" : "Play sample"}
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <p className="text-xs text-zinc-200 italic">
              "{samplePrompts[activePromptIndex].question}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
