import React from "react";
import { Volume2, Mic, Activity, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Volume2,
      title: "Listen to the Question",
      description: "AnswerForge uses Gnani's neural Text-to-Speech (TTS) to ask authentic interview questions with natural pacing and intonations."
    },
    {
      step: "02",
      icon: Mic,
      title: "Speak Your Answer Aloud",
      description: "Speak naturally into your microphone. Gnani's multi-dialect Speech-to-Text (STT) transcribes your voice in real-time, even with regional accents."
    },
    {
      step: "03",
      icon: Activity,
      title: "Instant Personalized Feedback",
      description: "The AI highlights filler words ('um', 'like'), checks your Words-Per-Minute cadence, evaluates content depth, and provides a polished answer."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#07090d] border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <span>THREE SIMPLE STEPS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How AnswerForge Works
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Practice speaking under realistic conditions without human scheduling friction.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-600">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
