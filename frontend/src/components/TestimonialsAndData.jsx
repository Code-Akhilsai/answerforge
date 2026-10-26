import React from "react";
import { Star, Quote, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";

export default function TestimonialsAndData({ onOpenPracticeModal }) {
  const testimonials = [
    {
      quote: "Most AI interview tools feel like you're talking to a laggy robot with a 4-second delay. Gnani's voice engine on AnswerForge felt like a real hiring manager cutting in when my answer got hand-wavy. Reduced my filler words from 16 down to 2 per answer.",
      author: "Aditya Sharma",
      role: "Staff Backend Engineer",
      company: "Cracked L6 Offer at Top Fintech",
      metric: "-74% Filler Words",
      avatarInitials: "AS"
    },
    {
      quote: "I always struggled with behavioral interviews because I spent 5 minutes on the 'Situation' and rushed the 'Result'. AnswerForge's STAR breakdown flagged this immediately. I finally negotiated a 40% hike with confidence.",
      author: "Meera Krishnan",
      role: "Lead Product Manager",
      company: "Joined Tier-1 Streaming Platform",
      metric: "98% STAR Adherence",
      avatarInitials: "MK"
    },
    {
      quote: "Being from Chennai, other speech recognition tools constantly butchered my technical answers or marked my English as unclear. Gnani's speech-to-text had zero phonetic misrecognitions even when I said complex Kafka and distributed lock terms.",
      author: "Karthik Raja",
      role: "Senior Infrastructure Engineer",
      company: "Cracked Global Cloud Provider",
      metric: "99.4% STT Accuracy",
      avatarInitials: "KR"
    }
  ];

  return (
    <section className="py-24 bg-[#090b10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>VERIFIED CANDIDATE OUTCOMES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Candidates Who Want to Sound Authoritative, Not Rehearsed
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Real feedback from engineers, product leads, and managers who replaced stressful 
            guesswork with voice-driven deliberate practice.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="card-elevated rounded-2xl p-6 border border-zinc-800/80 flex flex-col justify-between"
            >
              <div>
                {/* Metric pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-[11px] font-mono text-cyan-300">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{t.metric}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white border border-zinc-700">
                  {t.avatarInitials}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.author}</div>
                  <div className="text-[11px] text-zinc-400">{t.role}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Macro Data Strip */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Average Candidate Improvement After 4 Voice Sessions</div>
              <div className="text-xs text-zinc-400">Measured across 8,000+ completed mock interviews on AnswerForge</div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-center">
            <div>
              <div className="text-xl font-bold text-cyan-400">-62%</div>
              <div className="text-[10px] text-zinc-500">Filler Words</div>
            </div>
            <div className="w-px h-8 bg-zinc-800"></div>
            <div>
              <div className="text-xl font-bold text-emerald-400">+28 pts</div>
              <div className="text-[10px] text-zinc-500">STAR Adherence</div>
            </div>
            <div className="w-px h-8 bg-zinc-800"></div>
            <div>
              <div className="text-xl font-bold text-white">142 WPM</div>
              <div className="text-[10px] text-zinc-500">Cadence Mastery</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
