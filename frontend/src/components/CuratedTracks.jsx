import React, { useState } from "react";
import {
  Code2,
  Layers,
  BarChart,
  Database,
  Briefcase,
  Compass,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function CuratedTracks({ onOpenPracticeModal }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const tracks = [
    {
      category: "engineering",
      icon: Code2,
      title: "Distributed Systems & Cloud Architecture",
      level: "Senior to Principal SDE",
      questionsCount: "620+ Scenarios",
      duration: "45 min rounds",
      samplePrompt:
        "Design an auto-scaling multi-tenant rate limiter with token bucket algorithm across 5 AWS regions.",
      rubrics: [
        "Concurrency",
        "Consensus (Raft/Paxos)",
        "Partition Tolerance",
        "Failure Domains",
      ],
    },
    {
      category: "engineering",
      icon: Layers,
      title: "Frontend Architecture & Web Vitals",
      level: "Staff Frontend Engineer",
      questionsCount: "380+ Scenarios",
      duration: "30 min rounds",
      samplePrompt:
        "Architect a canvas-based collaborative spreadsheet supporting 100k active cells and 60 FPS scrolling.",
      rubrics: [
        "Render Pipeline",
        "Virtualization",
        "Web Workers",
        "Hydration Bottlenecks",
      ],
    },
    {
      category: "product",
      icon: BarChart,
      title: "Product Sense & Execution (PM)",
      level: "Senior PM & Director",
      questionsCount: "450+ Scenarios",
      duration: "40 min rounds",
      samplePrompt:
        "Design a monetization model for an open-source developer tool without alienating the community.",
      rubrics: [
        "North Star Metric",
        "Go-To-Market",
        "Cannibalization Risk",
        "Unit Economics",
      ],
    },
    {
      category: "data",
      icon: Database,
      title: "Data Engineering & MLOps Pipelines",
      level: "Staff Data Engineer",
      questionsCount: "340+ Scenarios",
      duration: "35 min rounds",
      samplePrompt:
        "Build a real-time feature store for a credit card fraud detection engine with sub-10ms inference SLAs.",
      rubrics: [
        "Stream Processing",
        "Backfill Idempotency",
        "Schema Drift",
        "Data Lineage",
      ],
    },
    {
      category: "behavioral",
      icon: Compass,
      title: "Executive Behavioral & Conflict (STAR)",
      level: "Engineering Managers & VPs",
      questionsCount: "500+ Scenarios",
      duration: "30 min rounds",
      samplePrompt:
        "Describe when a multi-quarter product launch failed to meet adoption targets. How did you handle stakeholder morale?",
      rubrics: [
        "STAR Methodology",
        "Accountability",
        "Executive Composure",
        "De-escalation",
      ],
    },
    {
      category: "consulting",
      icon: Briefcase,
      title: "Management Consulting & Case Interviews",
      level: "Associate & Engagement Mgr",
      questionsCount: "290+ Scenarios",
      duration: "45 min rounds",
      samplePrompt:
        "A tier-1 telecom operator is facing a 22% margin squeeze in fiber rollout. Structure an 8-week diagnostic.",
      rubrics: [
        "Issue Tree Structuring",
        "Mental Math / Cadence",
        "MECE Principle",
        "Synthesis",
      ],
    },
  ];

  const filteredTracks =
    selectedCategory === "all"
      ? tracks
      : tracks.filter((t) => t.category === selectedCategory);

  return (
    <section id="role-tracks" className="py-24 bg-[#090b10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>CALIBRATED QUESTION BANKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated Tracks for Technical & Leadership Roles
            </h2>
            <p className="mt-2 text-zinc-400 max-w-2xl text-sm sm:text-base">
              Every role has unique evaluation criteria. Our questions and Gnani
              voice prompts mirror real loops at leading tech firms and top
              product companies.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
            {[
              { id: "all", label: "All Tracks" },
              { id: "engineering", label: "Engineering" },
              { id: "product", label: "Product" },
              { id: "data", label: "Data & ML" },
              { id: "behavioral", label: "Behavioral" },
              { id: "consulting", label: "Consulting" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-zinc-800 text-cyan-300 border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div
                key={idx}
                className="card-elevated rounded-2xl p-6 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {track.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {track.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mb-4">
                    <span>{track.questionsCount}</span>
                    <span>&bull;</span>
                    <span>{track.duration}</span>
                  </div>

                  {/* Sample Prompt Preview */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/60 mb-4">
                    <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1">
                      Example Interview Prompt:
                    </div>
                    <p className="text-xs text-zinc-300 italic">
                      "{track.samplePrompt}"
                    </p>
                  </div>

                  {/* Rubric Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {track.rubrics.map((r, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenPracticeModal}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors group-hover:border-zinc-700"
                >
                  <span>Practice This Role</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
