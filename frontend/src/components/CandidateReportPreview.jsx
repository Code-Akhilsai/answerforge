import React, { useState } from "react";
import {
  FileText,
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Calendar,
  Mic,
} from "lucide-react";

export default function CandidateReportPreview({ onOpenPracticeModal }) {
  const [activeTab, setActiveTab] = useState("scorecard");

  return (
    <section
      id="candidate-report"
      className="py-24 bg-[#07090d] relative border-b border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>POST-INTERVIEW DIAGNOSTIC INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Diagnostic Report You Receive After Every Session
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            No vague encouragement. Get an enterprise-calibrated audit of your
            verbal delivery, technical architecture gaps, and an actionable
            7-day drill roadmap.
          </p>
        </div>

        {/* The Diagnostic Report Document Preview */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Document Header */}
          <div className="p-6 bg-zinc-950/90 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Full Diagnostic Evaluation: Session #AF-8942
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    STRONG HIRE
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3">
                  <span>Track: Staff Backend Engineer</span>
                  <span>&bull;</span>
                  <span>Evaluator: Gnani Voice Intelligence Core</span>
                  <span>&bull;</span>
                  <span>Duration: 28 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPracticeModal}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={onOpenPracticeModal}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-slate-950 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Mentor</span>
              </button>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* 1. Score Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="text-center md:text-left md:border-r md:border-zinc-800/80 pr-4">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">
                  Composite Score
                </div>
                <div className="text-4xl font-extrabold text-white font-mono mt-1">
                  88<span className="text-xl text-zinc-500">/100</span>
                </div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  Top 8th Percentile
                </div>
              </div>

              <div className="text-center md:text-left md:border-r md:border-zinc-800/80 pr-4">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">
                  Verbal Cadence
                </div>
                <div className="text-4xl font-extrabold text-cyan-400 font-mono mt-1">
                  142{" "}
                  <span className="text-xs text-zinc-500 font-normal">WPM</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Optimal executive range
                </div>
              </div>

              <div className="text-center md:text-left md:border-r md:border-zinc-800/80 pr-4">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">
                  Filler Words
                </div>
                <div className="text-4xl font-extrabold text-amber-400 font-mono mt-1">
                  1.4%{" "}
                  <span className="text-xs text-zinc-500 font-normal">
                    density
                  </span>
                </div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  -42% vs first session
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">
                  STAR Methodology
                </div>
                <div className="text-4xl font-extrabold text-indigo-400 font-mono mt-1">
                  92<span className="text-xl text-zinc-500">%</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Clear Situation & Action
                </div>
              </div>
            </div>

            {/* 2. Detailed Dimension Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths Audited */}
              <div className="p-5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase font-mono mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Acoustic composure:</strong> Maintained stable
                      pitch even when the interviewer introduced a surprise
                      network partition scenario.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Technical terminology precision:</strong>{" "}
                      Accurately articulated two-phase commit fallbacks and Raft
                      log replication semantics.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Structured framing:</strong> Began with
                      requirements and non-functional SLOs before diving into
                      component architecture.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actionable Improvement Points */}
              <div className="p-5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase font-mono mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Targeted Growth Areas</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Quantified business results:</strong> In the
                      behavioral conflict question, you explained the compromise
                      but forgot to quantify downtime prevented or dollar
                      impact.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Crutch word pattern:</strong> Subconsciously
                      leaned on "so basically" at minute 14:20 when
                      transitioning between Redis and Cassandra.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Pause discipline:</strong> Replaced thinking
                      silence with filler vocalizations rather than taking a
                      deliberate 2-second pause.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Personalized 7-Day Drill Schedule */}
            <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-mono font-semibold text-cyan-400 uppercase flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Personalized 7-Day Remediation Drill Plan</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Estimated 20 mins/day
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold">
                    DAY 1 - 2
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    Tactical Pause Drills
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Eliminate "so basically" by swapping fillers with 1.5s
                    deliberate silence.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold">
                    DAY 3 - 4
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    STAR Result Quantifier
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    5 rapid-fire behavioral prompts forcing concrete business
                    KPIs ($, %, ms).
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold">
                    DAY 5 - 7
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    Full 45-Min Mock Simulation
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Multi-tier pressure round with aggressive follow-ups on
                    cache invalidation.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                Want to see your own scorecard after a live voice session?
              </span>
              <button
                onClick={onOpenPracticeModal}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Mic className="w-3.5 h-3.5 text-slate-950" />
                <span>Launch Your Free Diagnostic Mock</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
