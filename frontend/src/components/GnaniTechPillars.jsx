import { Zap, Globe2, Cpu } from "lucide-react";

export default function GnaniTechPillars() {
  const highlights = [
    {
      icon: Zap,
      title: "Sub-200ms Voice Latency",
      description:
        "Fast speech processing pipeline creates natural conversational back-and-forth without awkward 4-second waiting pauses.",
    },
    {
      icon: Globe2,
      title: "Dialect & Accent Invariant",
      description:
        "Gnani's acoustic models are trained on diverse regional Indian and global English speech, avoiding phonetic transcription drops.",
    },
    {
      icon: Cpu,
      title: "Technical Lexicon Ready",
      description:
        "Accurately recognizes specialized terms like 'Kubernetes', 'idempotency', 'Kafka', and 'microservices' without mangling words.",
    },
  ];

  return (
    <section
      id="gnani-tech"
      className="py-20 bg-[#090b10] border-t border-zinc-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3">
            <span>GNANI.AI INTEGRATION</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Powered by Gnani Voice Intelligence
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Why Gnani's speech-to-text and text-to-speech APIs power
            AnswerForge.
          </p>
        </div>

        {/* 3 Simple Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {h.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {h.description}
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
