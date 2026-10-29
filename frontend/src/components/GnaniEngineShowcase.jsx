import React, { useState } from "react";
import {
  Cpu,
  Globe2,
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Radio,
  ArrowRight,
} from "lucide-react";

export default function GnaniEngineShowcase({ onOpenPracticeModal }) {
  const [activeTab, setActiveTab] = useState("stt");

  const engineFeatures = [
    {
      title: "Phonetic Dialect Invariance",
      icon: Globe2,
      subtitle: "Zero degradation across Indian & Global English accents",
      description:
        "Generic Silicon Valley voice models frequently fail on regional Indian accents or mishear technical phonetics. Gnani's acoustic engine is calibrated on 10M+ hours of multilingual speech, accurately transcribing diverse accents with over 99.2% precision.",
    },
    {
      title: "Sub-180ms Round-trip Streaming",
      icon: Zap,
      subtitle: "Eliminates awkward 4-second LLM silence pauses",
      description:
        "Standard voice wrappers take 3,000ms+ to transcribe, prompt, and synthesize voice. AnswerForge uses Gnani's bi-directional gRPC streaming to achieve conversational turn-around under 180ms, replicating real human interview cadence.",
    },
    {
      title: "Engineered Technical Lexicons",
      icon: Cpu,
      subtitle: "Custom phonetic vocabulary for tech, finance & cloud",
      description:
        "Speech models often hallucinate jargon into common English words (transcribing 'Kubernetes' as 'Cooper net is' or 'Kafka' as 'café'). Gnani's specialized language model handles 50,000+ domain terms seamlessly.",
    },
    {
      title: "Enterprise Audio Privacy",
      icon: ShieldCheck,
      subtitle: "Zero audio retention for training, encrypted in flight",
      description:
        "Your answers are processed strictly ephemerally in RAM and wiped post-session. Never stored to train external models. Compliant with SOC-2 Type II, ISO 27001, and GDPR standards.",
    },
  ];

  return (
    <section id="gnani-engine" className="py-24 bg-[#090b10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE GNANI.AI VOICE ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Generic Voice Wrappers Fail in High-Stakes Tech Interviews
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Most "AI mock interview" tools slap generic browser speech onto
            standard text LLMs. Here is why AnswerForge's integration with
            Gnani's enterprise conversational stack creates an authentic
            interview experience.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {engineFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="card-elevated rounded-2xl p-6 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    {feat.title}
                  </h3>
                  <div className="text-xs font-medium text-cyan-400/90 mb-3">
                    {feat.subtitle}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix Table (Realistic & Professional) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/50">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Architecture Comparison: Conversational Voice Stack</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Benchmarked Oct 2026
                </span>
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Evaluated against real candidate spoken audio containing
                multi-regional accents and technical terminology.
              </div>
            </div>
            <button
              onClick={onOpenPracticeModal}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Test Benchmark in Live Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/30 text-zinc-400 font-mono">
                  <th className="py-3.5 px-5 font-semibold">
                    Evaluation Criteria
                  </th>
                  <th className="py-3.5 px-5 font-bold text-cyan-400 bg-cyan-950/20 border-x border-cyan-900/30">
                    AnswerForge (Gnani Core)
                  </th>
                  <th className="py-3.5 px-5 font-semibold text-zinc-400">
                    Standard Text Bots (ChatGPT / Claude)
                  </th>
                  <th className="py-3.5 px-5 font-semibold text-zinc-400">
                    Generic Web Speech Wrappers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-4 px-5 font-medium text-white">
                    End-to-End Voice Latency
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-cyan-300 bg-cyan-950/10 border-x border-cyan-900/20">
                    140ms - 180ms (Conversational Flow)
                  </td>
                  <td className="py-4 px-5 text-zinc-400 font-mono">
                    N/A (Text typing only)
                  </td>
                  <td className="py-4 px-5 text-amber-400/80 font-mono">
                    2,800ms - 4,500ms (High lag)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-white">
                    Indian & Global Accent Robustness
                  </td>
                  <td className="py-4 px-5 font-medium text-emerald-300 bg-cyan-950/10 border-x border-cyan-900/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>99.2% accuracy across all regions</span>
                  </td>
                  <td className="py-4 px-5 text-zinc-400">
                    Zero verbal evaluation
                  </td>
                  <td className="py-4 px-5 text-zinc-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Frequent drops on Hinglish & accents</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-white">
                    Technical Terminology Recognition
                  </td>
                  <td className="py-4 px-5 font-medium text-emerald-300 bg-cyan-950/10 border-x border-cyan-900/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom acoustic vocab (50k+ terms)</span>
                  </td>
                  <td className="py-4 px-5 text-zinc-400">
                    Recognizes text only
                  </td>
                  <td className="py-4 px-5 text-zinc-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Mangles 'gRPC', 'k8s', 'idempotency'</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-white">
                    Spoken Cadence & Filler Telemetry
                  </td>
                  <td className="py-4 px-5 font-medium text-emerald-300 bg-cyan-950/10 border-x border-cyan-900/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WPM, crutch words, hesitation pauses</span>
                  </td>
                  <td className="py-4 px-5 text-zinc-400">
                    No acoustic telemetry
                  </td>
                  <td className="py-4 px-5 text-zinc-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Rudimentary word count only</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-white">
                    Interviewer Voice Naturalness (TTS)
                  </td>
                  <td className="py-4 px-5 font-medium text-emerald-300 bg-cyan-950/10 border-x border-cyan-900/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Neural expressive tone & micro-pauses</span>
                  </td>
                  <td className="py-4 px-5 text-zinc-400">No audio output</td>
                  <td className="py-4 px-5 text-zinc-400">
                    Monotone synthetic robotic voice
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
