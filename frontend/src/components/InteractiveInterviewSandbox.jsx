import React, { useState, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function InteractiveInterviewSandbox() {
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [isQuestionSpeaking, setIsQuestionSpeaking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micTranscript, setMicTranscript] = useState("");
  const [revealedWords, setRevealedWords] = useState(999);
  const [hasCompleted, setHasCompleted] = useState(true);
  const recognitionRef = useRef(null);

  const tracks = [
    {
      title: "Backend & Systems",
      question: "How would you prevent duplicate payments in an API when a network timeout occurs?",
      simulatedAnswer: "To prevent duplicate payments, [um] I would implement an idempotency key using UUIDv4 in the request header. When a request arrives, we store this key in Redis with an atomic lease. [like] If a client retries due to a timeout, we check the cache and return the existing response instead of processing the charge again.",
      feedback: {
        pace: "142 WPM",
        paceStatus: "Good Conversational Pace",
        fillers: "2 words detected ('um', 'like')",
        score: "92 / 100",
        strengths: "Clear architectural explanation with idempotency keys and Redis caching.",
        improvements: "State the fallback strategy if the Redis distributed lock expires mid-transaction.",
        suggested: "Also mention using a database unique constraint as the final safety net in case of cache expiration."
      }
    },
    {
      title: "Product Management",
      question: "Our mobile app onboarding completion dropped by 15% this week. How would you investigate it?",
      simulatedAnswer: "First, I would segment the drop-off by app version, operating system, and geographical region. [uh] Then I would inspect the onboarding funnel step-by-step to see if the drop is concentrated on SMS OTP verification or permissions. [basically] Once identified, I'd coordinate with QA to test device compatibility.",
      feedback: {
        pace: "138 WPM",
        paceStatus: "Calm & Structured",
        fillers: "2 words detected ('uh', 'basically')",
        score: "90 / 100",
        strengths: "Good structured funnel triage and cohort segmentation.",
        improvements: "Include a measurable goal and expected recovery timeline.",
        suggested: "Define a 48-hour triage SLA and an A/B rollback trigger if a newly released build is the root cause."
      }
    },
    {
      title: "Behavioral (STAR)",
      question: "Tell me about a time you missed a project deadline. How did you handle the situation?",
      simulatedAnswer: "During a major cloud migration, we encountered an unexpected database schema incompatibility 3 days before release. [you know] Instead of hiding it, I immediately flagged the blocker to our stakeholders, presented 2 recovery options, and negotiated a 48-hour delay. We completed the migration over the weekend with zero data loss.",
      feedback: {
        pace: "144 WPM",
        paceStatus: "Clear & Confident",
        fillers: "1 word detected ('you know')",
        score: "94 / 100",
        strengths: "Excellent STAR framework adherence: transparent communication and clear ownership.",
        improvements: "Quantify the team effort or downtime saved.",
        suggested: "Highlight post-mortem actions taken to prevent similar schema drift in future sprints."
      }
    }
  ];

  const current = tracks[selectedTrack];

  // TTS for question
  const handlePlayQuestion = () => {
    if (isQuestionSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsQuestionSpeaking(false);
    } else {
      setIsQuestionSpeaking(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(current.question);
        utterance.rate = 0.96;
        utterance.onend = () => setIsQuestionSpeaking(false);
        utterance.onerror = () => setIsQuestionSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsQuestionSpeaking(false), 3500);
      }
    }
  };

  // Simulate streaming response
  const handleSimulate = () => {
    setIsSimulating(true);
    setHasCompleted(false);
    setRevealedWords(0);
    setMicTranscript("");

    const words = current.simulatedAnswer.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      idx += 2;
      setRevealedWords(idx);
      if (idx >= words.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setHasCompleted(true);
      }
    }, 90);
  };

  // Mic recording
  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition not supported in this browser. Running simulation instead.");
      handleSimulate();
      return;
    }

    if (isRecordingMic) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecordingMic(false);
      setHasCompleted(true);
    } else {
      setMicTranscript("");
      setHasCompleted(false);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setMicTranscript(text);
        };

        recognition.onend = () => {
          setIsRecordingMic(false);
          setHasCompleted(true);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecordingMic(true);
      } catch (err) {
        console.error(err);
        handleSimulate();
      }
    }
  };

  const renderTranscript = (text, limit) => {
    const words = text.split(" ").slice(0, limit);
    return words.map((w, i) => {
      const isFiller = ["[um]", "[like]", "[basically]", "[uh]", "[you", "know]"].some(f => w.toLowerCase().includes(f.replace(/[\[\]]/g, "")));
      if (isFiller) {
        return (
          <span key={i} className="inline-block bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded mx-0.5 text-xs font-mono font-semibold border border-amber-500/30">
            {w}
          </span>
        );
      }
      return <span key={i} className="text-zinc-200">{w} </span>;
    });
  };

  return (
    <section id="interactive-sandbox" className="py-20 bg-[#090b10] border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-400 mb-3">
            <span>INTERACTIVE DEMO</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Try the Voice Interview Sandbox
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Hear the question, speak or simulate your answer, and see real-time speech feedback.
          </p>

          {/* Track selector */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 gap-1">
            {tracks.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedTrack(idx);
                  setRevealedWords(999);
                  setHasCompleted(true);
                  setMicTranscript("");
                  if (isQuestionSpeaking && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsQuestionSpeaking(false);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedTrack === idx
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left: Question + Recording */}
          <div className="space-y-4">
            
            {/* Question Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  AI Interviewer (Gnani TTS)
                </span>

                <button
                  onClick={handlePlayQuestion}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {isQuestionSpeaking ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Listen to Question</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-sm text-zinc-100 font-medium leading-relaxed">
                "{current.question}"
              </p>
            </div>

            {/* Answer Transcriber */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Your Spoken Answer (Gnani STT)</span>
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    Simulate Voice
                  </button>

                  <button
                    onClick={handleToggleMic}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                      isRecordingMic 
                        ? "bg-red-500/20 text-red-300 border-red-500 animate-pulse" 
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                    }`}
                  >
                    {isRecordingMic ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-zinc-400" />}
                    <span>{isRecordingMic ? "Stop" : "Use Mic"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 min-h-[120px] text-xs leading-relaxed text-zinc-300">
                {micTranscript ? (
                  <div>{micTranscript}</div>
                ) : (
                  renderTranscript(current.simulatedAnswer, revealedWords)
                )}
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Amber tags highlight detected filler words</span>
                <span className="font-mono text-cyan-400">Low-latency STT stream</span>
              </div>
            </div>

          </div>

          {/* Right: Clean AI Feedback Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Instant Speech Feedback</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                Score: {current.feedback.score}
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Speaking Pace</span>
                </div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  {current.feedback.pace}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  {current.feedback.paceStatus}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Filler Words</span>
                </div>
                <div className="text-lg font-bold text-amber-300 font-mono mt-1">
                  {current.feedback.fillers.split(" ")[0]} words
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Flagged in transcript
                </div>
              </div>
            </div>

            {/* Feedback Points */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>What went well</span>
                </div>
                <p className="text-zinc-300 pl-4 leading-relaxed">
                  {current.feedback.strengths}
                </p>
              </div>

              <div>
                <div className="font-semibold text-amber-400 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>How to improve</span>
                </div>
                <p className="text-zinc-300 pl-4 leading-relaxed">
                  {current.feedback.improvements}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800">
                <div className="text-[10px] font-mono text-cyan-400 font-semibold mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Better Way to Phrase It:</span>
                </div>
                <p className="text-xs text-zinc-200 italic font-serif">
                  "{current.feedback.suggested}"
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
