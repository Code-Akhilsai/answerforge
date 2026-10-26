import React, { useState } from "react";
import { 
  X, 
  Mic, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  Clock, 
  Settings2,
  Play,
  RotateCcw
} from "lucide-react";

export default function QuickPracticeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Config, 2: Active Voice Simulation
  const [selectedRole, setSelectedRole] = useState("Distributed Systems (Staff SRE)");
  const [selectedSeniority, setSelectedSeniority] = useState("Senior / Staff (L5-L6)");
  const [selectedDialect, setSelectedDialect] = useState("Indic & Global English (Gnani Adaptive)");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCompletedRound, setHasCompletedRound] = useState(false);

  if (!isOpen) return null;

  const sampleQuestion = "Explain how you would design a cache invalidation strategy for a distributed service where stale reads could lead to financial losses.";

  const handleStartSession = () => {
    setStep(2);
    setHasCompletedRound(false);
    // Play the question via TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleQuestion);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSimulateAnswerInModal = () => {
    setHasCompletedRound(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="p-5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>AnswerForge Practice Chamber</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Gnani STT/TTS v4
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                {step === 1 ? "Configure your practice round" : "Active Voice Evaluation"}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          
          {step === 1 ? (
            <div className="space-y-5">
              {/* Role Track */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Target Interview Track
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Distributed Systems (Staff SRE)</option>
                  <option>Frontend Architecture & Web Vitals</option>
                  <option>Product Sense & Execution (PM)</option>
                  <option>Behavioral & Leadership (STAR Framework)</option>
                  <option>Data Engineering & MLOps</option>
                </select>
              </div>

              {/* Seniority Level */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Seniority Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Mid-Level (L4 / 2-4 YOE)",
                    "Senior / Staff (L5-L6)",
                    "Principal / Architect",
                    "Engineering Manager"
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedSeniority(level)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium text-left border transition-colors ${
                        selectedSeniority === level
                          ? "bg-zinc-800 text-cyan-300 border-cyan-500/50"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gnani Dialect Configuration */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Gnani Acoustic Tuning
                </label>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Indic & Global English Acoustic Model (Active)</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                    99.2% ACCURACY
                  </span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-[11px] text-zinc-400 leading-normal">
                Audio streams are processed ephemerally in RAM. No microphone recording is retained or stored to train external LLMs.
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartSession}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.99]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter Chamber & Hear Question</span>
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Active Chamber */
            <div className="space-y-4">
              
              {/* Question Banner */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                  <span>GNANI INTERVIEWER QUESTION</span>
                  {isSpeaking && (
                    <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      TTS SPEAKING
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  "{sampleQuestion}"
                </p>
              </div>

              {/* Spoken Response Simulation */}
              {!hasCompletedRound ? (
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-3">
                  <div className="text-xs text-zinc-400">
                    Press below to simulate spoken answer via Gnani STT:
                  </div>
                  <button
                    onClick={handleSimulateAnswerInModal}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-md"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Submit Spoken Answer & Analyze</span>
                  </button>
                </div>
              ) : (
                /* Instant Scorecard Result */
                <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-900/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>EVALUATION COMPLETE: GRADE A (91/100)</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">Latency: 146ms</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-zinc-900">
                      <div className="text-zinc-500 text-[10px]">Cadence</div>
                      <div className="font-bold text-white mt-0.5">140 WPM</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900">
                      <div className="text-zinc-500 text-[10px]">Fillers</div>
                      <div className="font-bold text-emerald-400 mt-0.5">1 word (0.8%)</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900">
                      <div className="text-zinc-500 text-[10px]">STAR Depth</div>
                      <div className="font-bold text-cyan-400 mt-0.5">94%</div>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    <span className="text-cyan-400 font-semibold">Coach Feedback:</span> Excellent description of write-through caching with Redis locks. Next time, state your fallback for when cache and DB synchronization fails during split-brain.
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/2 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
                    >
                      Configure Another
                    </button>
                    <button
                      onClick={() => {
                        alert("Account registration: In real production, this routes to signup / onboarding dashboard.");
                        onClose();
                      }}
                      className="w-1/2 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs text-slate-950 font-bold"
                    >
                      Save to My Profile
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
