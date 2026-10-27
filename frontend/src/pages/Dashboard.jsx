import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mic,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Plus,
  BarChart2,
  Calendar,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  User,
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("backend");

  // Get user details if saved, or fallback to default
  const userName = localStorage.getItem("userName") || "Alex Morgan";
  const userEmail = localStorage.getItem("userEmail") || "alex@answerforge.dev";

  const stats = [
    {
      label: "Composite Score",
      value: "88",
      suffix: "/100",
      change: "+4% vs last week",
      trend: "positive",
      icon: Award,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Verbal Cadence",
      value: "142",
      suffix: " WPM",
      change: "Optimal executive range",
      trend: "neutral",
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Filler Word Density",
      value: "1.2%",
      suffix: "",
      change: "-38% improvement",
      trend: "positive",
      icon: BarChart2,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Completed Mocks",
      value: "14",
      suffix: " sessions",
      change: "8h 40m total practice",
      trend: "neutral",
      icon: Clock,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  const recentSessions = [
    {
      id: "AF-8942",
      title: "Distributed Systems & Idempotency",
      track: "backend",
      trackLabel: "Backend & Systems",
      score: 92,
      evaluation: "STRONG HIRE",
      date: "Today, 4:20 PM",
      duration: "28 min",
      pace: "144 WPM",
      fillers: "2 words ('um', 'like')",
      statusColor: "emerald",
    },
    {
      id: "AF-8921",
      title: "Onboarding Funnel Drop-off Triage",
      track: "product",
      trackLabel: "Product Management",
      score: 88,
      evaluation: "HIRE",
      date: "Yesterday, 6:15 PM",
      duration: "32 min",
      pace: "138 WPM",
      fillers: "3 words ('basically', 'uh')",
      statusColor: "cyan",
    },
    {
      id: "AF-8890",
      title: "Cross-Functional Deadline Conflict",
      track: "behavioral",
      trackLabel: "Behavioral (STAR)",
      score: 85,
      evaluation: "HIRE",
      date: "Oct 25, 11:30 AM",
      duration: "24 min",
      pace: "140 WPM",
      fillers: "1 word ('you know')",
      statusColor: "cyan",
    },
    {
      id: "AF-8812",
      title: "Multi-Region Cassandra Replication",
      track: "backend",
      trackLabel: "Backend & Systems",
      score: 79,
      evaluation: "LEAN HIRE",
      date: "Oct 22, 2:00 PM",
      duration: "35 min",
      pace: "152 WPM",
      fillers: "5 words ('so basically', 'um')",
      statusColor: "amber",
    },
  ];

  const filteredSessions =
    selectedFilter === "all"
      ? recentSessions
      : recentSessions.filter((s) => s.track === selectedFilter);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  Answer<span className="text-cyan-400">Forge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Dashboard
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-zinc-800 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 text-cyan-400 font-semibold border border-zinc-800">
                Overview
              </span>
              <a
                href="#recent-sessions"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                Past Sessions
              </a>
              <a
                href="#drills"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                7-Day Drills
              </a>
            </nav>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Start New Mock</span>
              <span className="sm:hidden">New</span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-zinc-500 leading-tight">
                  {userEmail}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Next Up Banner */}
        <div className="relative rounded-2xl bg-linear-to-r from-cyan-950/40 via-zinc-900 to-indigo-950/30 border border-zinc-800/90 p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Candidate Readiness Calibrated</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {userName.split(" ")[0]}!
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Your verbal pacing is in the 92nd percentile. Focus today's
                practice on{" "}
                <span className="text-zinc-200 font-medium">
                  quantifying business results
                </span>{" "}
                in behavioral questions to boost your hiring consensus.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Spoken Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg hover:border-zinc-700/80 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {stat.value}
                  <span className="text-sm font-normal text-zinc-500">
                    {stat.suffix}
                  </span>
                </div>
                <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1.5">
                  <span
                    className={
                      stat.trend === "positive"
                        ? "text-emerald-400 font-medium"
                        : "text-zinc-400"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Layout: Recent Sessions + Drill Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Practice Sessions (2 cols) */}
          <div className="lg:col-span-2 space-y-4" id="recent-sessions">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Recent Practice Sessions</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded-full">
                    {filteredSessions.length}
                  </span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Audio diagnostic telemetry and automated feedback summaries
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFilter === "all"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter("backend")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFilter === "backend"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Engineering
                </button>
                <button
                  onClick={() => setSelectedFilter("product")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFilter === "product"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Product
                </button>
                <button
                  onClick={() => setSelectedFilter("behavioral")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFilter === "behavioral"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Behavioral
                </button>
              </div>
            </div>

            {/* Session Cards */}
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{session.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {session.trackLabel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          session.statusColor === "emerald"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                            : session.statusColor === "cyan"
                              ? "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                              : "bg-amber-950 text-amber-400 border border-amber-800/50"
                        }`}
                      >
                        {session.evaluation}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors">
                      {session.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{session.date}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{session.duration}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="text-zinc-300">
                        Pace:{" "}
                        <strong className="text-cyan-400">
                          {session.pace}
                        </strong>
                      </span>
                      <span>&bull;</span>
                      <span className="text-zinc-400">
                        Fillers:{" "}
                        <span className="text-zinc-300">{session.fillers}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono leading-none">
                        {session.score}
                        <span className="text-xs text-zinc-500 font-normal">
                          /100
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNewSessionModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center gap-1 transition-colors"
                    >
                      <span>Review Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 7-Day Drill Schedule & Voice Calibration */}
          <div className="space-y-6" id="drills">
            {/* 7-Day Drill Plan */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    7-Day Remediation Plan
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  Day 3 of 7
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-white">
                      Day 1 - 2: Strategic Pauses
                    </div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">
                      Eliminated "so basically" by holding a 1.5s pause.
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400">
                      COMPLETED &bull; 94% Accuracy
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mt-0.5 shrink-0"></div>
                  <div className="text-xs">
                    <div className="font-semibold text-cyan-300">
                      Day 3 - 4: Quantify STAR Metrics
                    </div>
                    <div className="text-zinc-300 text-[11px] mt-0.5">
                      Practice inserting dollar, time, and latency metrics into
                      behavioral stories.
                    </div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                      TODAY'S DRILL (15 min)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-start gap-3 opacity-60">
                  <Clock className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-zinc-300">
                      Day 5 - 7: Full Staff Mock Simulation
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">
                      Comprehensive 45-min mock with pressure follow-ups.
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-mono text-zinc-500">
                      UPCOMING
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Today's Drill</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gnani Voice Engine Specs */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Gnani Voice Diagnostics Active</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Your microphone audio is processed in real time using Gnani.ai's
                high-accuracy speech-to-text models, measuring pitch composure,
                prosody, and filler word frequency.
              </p>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>STT Latency: 120ms</span>
                <span className="text-emerald-400">Calibration: Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Mock Session Modal */}
      {isNewSessionModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewSessionModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl p-6 sm:p-7 text-slate-100">
            <button
              onClick={() => setIsNewSessionModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Configure Spoken Mock Session
                </h3>
                <p className="text-xs text-zinc-400">
                  Select your interview track and difficulty
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Interview Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "backend",
                      label: "Backend Systems",
                      desc: "APIs & Databases",
                    },
                    {
                      id: "product",
                      label: "Product Lead",
                      desc: "Strategy & Metrics",
                    },
                    {
                      id: "behavioral",
                      label: "Behavioral STAR",
                      desc: "Conflict & Culture",
                    },
                  ].map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTrack === track.id
                          ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="text-xs font-bold">{track.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {track.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    "15 min (Sprint)",
                    "30 min (Standard)",
                    "45 min (Staff Deep-Dive)",
                  ].map((dur, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`py-2 px-2 text-center rounded-xl border font-medium transition-colors ${
                        idx === 1
                          ? "bg-zinc-800 border-zinc-700 text-white font-bold"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-medium">Audio Mode:</span>
                  <span className="text-cyan-400 font-mono text-[11px]">
                    Gnani Neural STT + Live Feedback
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Ensure your microphone is enabled. You will receive real-time
                  verbal pace and filler detection.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewSessionModalOpen(false);
                    navigate("/");
                    setTimeout(() => {
                      const el = document.getElementById("interactive-sandbox");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
