import React, { useState } from "react";
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  Compass, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  TrendingDown,
  VolumeX,
  Target
} from "lucide-react";

export default function SpeechAnalyticsPillars() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: "cadence",
      name: "Pacing & Speech Cadence",
      icon: Clock,
      badge: "WPM TELEMETRY",
      title: "Real-time Words-Per-Minute & Micro-Pause Analytics",
      description: "When candidates get anxious, speech accelerates beyond 170 WPM (sounding flustered) or drops below 110 WPM (sounding hesitant). Gnani's speech stream measures velocity in real time, encouraging a steady 135–150 WPM executive delivery.",
      visual: {
        metricLabel: "Measured Average Cadence",
        metricValue: "142 WPM",
        statusText: "Optimal Zone (130-155 WPM)",
        graphLabel: "Velocity Trend Curve",
        detailList: [
          "Micro-pause detection (highlights unnatural >2.5s silences)",
          "Dynamic speed adaptation based on answer complexity",
          "Breath cadence and sentence conclusion indicators"
        ]
      }
    },
    {
      id: "fillers",
      name: "Filler Words & Crutches",
      icon: AlertTriangle,
      badge: "VOCAL PURITY",
      title: "Timestamped Frequency of Filler Words",
      description: "Subconscious filler words like 'um', 'like', 'you know', and 'basically' erode perceived authority. AnswerForge logs every instance with precise timestamps, tracking your filler word density per minute across practice sessions.",
      visual: {
        metricLabel: "Filler Word Density",
        metricValue: "1.2%",
        statusText: "Exceptional (<2.0% is Tier-1 Benchmark)",
        graphLabel: "Identified Crutch Markers",
        detailList: [
          "Instant acoustic tagging of 'um', 'uh', 'like', 'sort of'",
          "Timestamped playback to review exact hesitation moments",
          "Remediation drills focused on tactical pause replacement"
        ]
      }
    },
    {
      id: "star",
      name: "STAR Framework Alignment",
      icon: Compass,
      badge: "METHODOLOGICAL DEPTH",
      title: "Automated Situation, Task, Action & Result Decomposition",
      description: "Top tech and consulting companies expect structured answers. AnswerForge analyzes spoken sentences to determine if you framed the Situation, stated the core Task, demonstrated decisive Action, and quantified the Result.",
      visual: {
        metricLabel: "STAR Adherence Score",
        metricValue: "92 / 100",
        statusText: "Quantified Result Detected (+$1.4M ARR / -45% Latency)",
        graphLabel: "Structural Weight Distribution",
        detailList: [
          "Identifies missing Quantified Outcomes in behavioral prompts",
          "Detects when candidates over-index on Situation and under-index on Action",
          "Automated restructuring suggestions to tighten delivery"
        ]
      }
    },
    {
      id: "tone",
      name: "Tone & Executive Presence",
      icon: Target,
      badge: "ACOUSTIC CONFIDENCE",
      title: "Acoustic Stability, Pitch Modulation & Uptalk Flagging",
      description: "Interviewers subconsciously assess confidence from pitch stability. Our acoustic model flags uptalk (pitch rising at the end of sentences like a question), monotone droning, and vocal strain under challenging technical follow-ups.",
      visual: {
        metricLabel: "Confidence Stability Index",
        metricValue: "96.4%",
        statusText: "Decisive & Authoritative",
        graphLabel: "Pitch Variation Spectrum",
        detailList: [
          "Uptalk mitigation (replaces questioning inflection with decisive cadence)",
          "Monotone pitch variation analysis for sustained listener engagement",
          "Stress resilience score across 30-minute intensive rounds"
        ]
      }
    }
  ];

  const current = pillars[activePillar];
  const Icon = current.icon;

  return (
    <section id="speech-analytics" className="py-24 bg-[#07090d] relative border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOUR-DIMENSIONAL SPEECH INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How AnswerForge Deconstructs Spoken Answers
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Hiring managers don't just judge what you say; they evaluate how you say it under pressure.
            Our platform evaluates both linguistic content and acoustic delivery.
          </p>
        </div>

        {/* 4 Interactive Pills/Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {pillars.map((p, idx) => {
            const PIcon = p.icon;
            const isSelected = activePillar === idx;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillar(idx)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-800/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20"
                    : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-cyan-500 text-slate-950" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    <PIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    0{idx + 1}
                  </span>
                </div>
                <div className={`text-xs font-bold tracking-tight ${isSelected ? "text-white" : "text-zinc-300"}`}>
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Showcase Box */}
        <div className="card-elevated rounded-2xl p-6 sm:p-8 border border-zinc-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Explanation */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-800/40 text-[11px] font-mono text-cyan-300 mb-3">
              <span>{current.badge}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {current.title}
            </h3>
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              {current.description}
            </p>

            <div className="mt-6 space-y-2.5">
              {current.visual.detailList.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Telemetry Widget Preview */}
          <div className="lg:col-span-5 bg-zinc-950/90 rounded-xl p-5 border border-zinc-800 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <span className="text-xs font-mono text-zinc-400">{current.visual.graphLabel}</span>
              <span className="text-[11px] font-mono text-cyan-400">LIVE SENSOR</span>
            </div>

            <div className="my-5 text-center p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                {current.visual.metricLabel}
              </div>
              <div className="text-4xl font-extrabold text-white font-mono mt-2 tracking-tight">
                {current.visual.metricValue}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[11px] font-medium text-emerald-300">
                <CheckCircle className="w-3 h-3" />
                <span>{current.visual.statusText}</span>
              </div>
            </div>

            {/* Micro visualizer bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>Diagnostic Accuracy</span>
                <span className="text-cyan-400">99.4%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-[94%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
