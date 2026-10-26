import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does Gnani's speech engine handle diverse Indian and regional accents?",
      a: "Standard Western voice models are calibrated on North American or British accents, which causes them to mishear Indian English phonetics, drop syllables, or hallucinate technical terms. Gnani's acoustic models are trained on over 10 million hours of multilingual speech across various Indian and global dialects. It achieves 99.2%+ transcription accuracy regardless of regional intonation."
    },
    {
      q: "Why can't I just practice with ChatGPT Voice Mode or Claude?",
      a: "Generic LLM voice modes are designed for casual conversational chats, not high-pressure interview evaluations. They lack specialized technical lexicons, do not measure your Words-Per-Minute (WPM), cannot calculate your filler word density (e.g., 'um', 'like', 'basically'), and do not score your answers against strict hiring rubrics like the STAR methodology or distributed systems SLO tradeoffs."
    },
    {
      q: "What is the voice latency during a practice session?",
      a: "AnswerForge leverages Gnani's bi-directional gRPC streaming architecture to deliver sub-180ms turn-around latency. This means the AI interviewer begins speaking almost immediately after you pause, eliminating the unnatural 3 to 5 second awkward delay common in typical LLM wrappers."
    },
    {
      q: "Is my spoken audio stored or used to train external AI models?",
      a: "No. Your audio is streamed ephemerally in RAM strictly for real-time transcription and acoustic metric calculation. We do not sell your audio, and we do not feed candidate responses into public training sets. All sessions are compliant with SOC-2 Type II, ISO 27001, and GDPR standards."
    },
    {
      q: "How does the platform grade behavioral questions using the STAR framework?",
      a: "Our linguistic parser detects the structural transitions in your spoken response: Situation (context setting), Task (problem constraints), Action (your personal technical decisions), and Result (quantified business impact). If your response spends 4 minutes on the situation and forgets to cite tangible metrics for the result, AnswerForge flags this in your scorecard."
    },
    {
      q: "Can I practice specific tracks like System Design or Engineering Management?",
      a: "Yes. AnswerForge has over 3,000+ calibrated scenarios spanning Distributed Systems Architecture, Frontend Performance, Product Sense, Data Engineering, Case Consulting, and Executive Leadership (including Amazon Leadership Principles and Google Googlyness)."
    }
  ];

  return (
    <section className="py-24 bg-[#090b10] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Everything you need to know about Gnani voice intelligence, privacy, and interview calibration.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
