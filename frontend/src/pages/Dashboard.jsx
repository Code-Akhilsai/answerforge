import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mic,
  Square,
  Volume2,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart2,
  Calendar,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  X,
  Loader2,
  Headphones,
  Check,
  FileText,
  Trash2,
  Layers,
  Pause,
  Shuffle,
  Building,
  Target,
} from "lucide-react";
import api from "../api";

import AnimatedLogo from "../components/AnimatedLogo";

import { INTERVIEW_TOPICS } from "../data/interviewTopics";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // User credentials
  const userName = localStorage.getItem("userName") || "Candidate";
  const userEmail =
    localStorage.getItem("userEmail") || "candidate@answerforge.dev";

  // Real-time Persistent Practice Sessions (per-user, MongoDB via API)
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions([]);
    const fetchSessions = async () => {
      try {
        const response = await api.get("/interview/practice/sessions");
        if (response.data?.success) {
          const allSessions = response.data.sessions || [];
          const userEmail = localStorage.getItem("userEmail") || "";
          setSessions(
            allSessions.filter(
              (s) => s.userEmail === userEmail || !s.userEmail,
            ),
          );
        }
      } catch (err) {
        console.warn("Failed to fetch practice sessions:", err);
        setSessions([]);
      }
    };

    fetchSessions();
  }, []);

  // Practice Studio Modal
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeTopicKey, setActiveTopicKey] = useState("system_design");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Past Session Review Modal
  const [viewingSession, setViewingSession] = useState(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const timerIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const studioModalRef = useRef(null);

  // STT States
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sttError, setSttError] = useState("");

  // Evaluation States
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalError, setEvalError] = useState("");

  // TTS States
  const [ttsPlayingField, setTtsPlayingField] = useState(null);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const audioPlayerRef = useRef(new Audio());

  // Active Topic & Question Selection
  const activeTopic =
    INTERVIEW_TOPICS[activeTopicKey] || INTERVIEW_TOPICS.system_design;
  const currentQ =
    activeTopic.questions[activeQuestionIdx] || activeTopic.questions[0];

  // Live Metrics
  const totalSessions = sessions.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (Number(s.score) || 0), 0) /
            totalSessions,
        )
      : null;

  const avgWpm =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (parseInt(s.pace) || 0), 0) /
            totalSessions,
        )
      : null;

  const avgFillerDensity =
    totalSessions > 0
      ? (
          sessions.reduce(
            (sum, s) => sum + (parseFloat(s.fillerDensity) || 0),
            0,
          ) / totalSessions
        ).toFixed(1) + "%"
      : null;

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl]);

  // Audio Player Listeners
  useEffect(() => {
    const player = audioPlayerRef.current;
    const handleEnded = () => setTtsPlayingField(null);
    const handleError = () => setTtsPlayingField(null);

    player.addEventListener("ended", handleEnded);
    player.addEventListener("error", handleError);

    return () => {
      player.removeEventListener("ended", handleEnded);
      player.removeEventListener("error", handleError);
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  // Launch Studio with a specific topic and question
  const openStudioWithQuestion = (topicKey, qIdx = 0) => {
    setActiveTopicKey(topicKey);
    setActiveQuestionIdx(qIdx);
    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSttError("");
    setEvalError("");
    setIsStudioOpen(true);
  };

  // Randomize Question within topic
  const pickRandomQuestion = () => {
    const count = activeTopic.questions.length;
    if (count <= 1) return;
    let nextIdx = Math.floor(Math.random() * count);
    if (nextIdx === activeQuestionIdx) {
      nextIdx = (nextIdx + 1) % count;
    }
    setActiveQuestionIdx(nextIdx);
    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setSttError("");
    setEvalError("");
  };

  // Advance to next question cleanly
  const handleTryAnotherQuestion = () => {
    const totalQ = activeTopic.questions.length;
    if (totalQ > 1) {
      // Advance to next question in current topic sequentially
      setActiveQuestionIdx((prev) => (prev + 1) % totalQ);
    } else {
      // Rotate to next topic if only 1 question exists in current topic
      const topicKeys = Object.keys(INTERVIEW_TOPICS);
      const curIndex = topicKeys.indexOf(activeTopicKey);
      const nextTopicKey = topicKeys[(curIndex + 1) % topicKeys.length];
      setActiveTopicKey(nextTopicKey);
      setActiveQuestionIdx(0);
    }

    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingSeconds(0);
    setSttError("");
    setEvalError("");

    // Smoothly scroll modal view back to the top to see the new question
    if (studioModalRef.current) {
      studioModalRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 1. Microphone Recording
  const startRecording = async () => {
    try {
      setSttError("");
      setEvalError("");
      setEvaluation(null);
      setTranscript("");
      setAudioBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start(250);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setSttError(
        "Microphone access denied. You can also click 'Use Sample Audio' to test immediately.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Cancel in-flight recording and discard chunks
  const cancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = null; // Do not fire onstop to generate blob
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.warn("MediaRecorder stop error:", err);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setSttError("");
  };

  // Discard recorded audio and reset input/evaluations
  const discardAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setTranscript("");
    setEvaluation(null);
    setSttError("");
    setEvalError("");
  };

  // Safe studio exit
  const closeStudio = () => {
    if (isRecording) {
      cancelRecording();
    }
    setIsStudioOpen(false);
  };

  const handleUseSampleRecording = () => {
    setTranscript(currentQ.sampleTranscript);
    setAudioBlob(new Blob(["sample-audio"], { type: "audio/webm" }));
    setRecordingSeconds(28);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Convert recorded audio (webm/opus) to WAV so Gnani STT accepts it
  const convertToWav = async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return blob;
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const samples = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        let s = Math.max(-1, Math.min(1, channelData[i]));
        samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(wavBuffer);
      const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++)
          view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeString(0, "RIFF");
      view.setUint32(4, 36 + samples.length * 2, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, audioBuffer.sampleRate, true);
      view.setUint32(28, audioBuffer.sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, samples.length * 2, true);
      for (let i = 0; i < samples.length; i++)
        view.setInt16(44 + i * 2, samples[i], true);
      await audioCtx.close();
      return new Blob([wavBuffer], { type: "audio/wav" });
    } catch (err) {
      console.warn("WAV conversion failed, sending original blob:", err);
      return blob;
    }
  };

  // 2. Gnani STT Integration - Transcribe
  const handleTranscribeWithGnani = async () => {
    if (!audioBlob) {
      setSttError("Please record your answer first.");
      return;
    }

    setIsTranscribing(true);
    setSttError("");

    try {
      const wavBlob = await convertToWav(audioBlob);
      const base64Data = await blobToBase64(wavBlob);

      const response = await api.post("/interview/transcribe", {
        audioBase64: base64Data,
        mimeType: wavBlob.type || "audio/wav",
        languageCode: "en-IN",
      });

      if (response.data?.success && response.data?.transcript) {
        setTranscript(response.data.transcript);
      } else {
        setSttError(
          "Transcription returned no text. Please record and try again.",
        );
      }
    } catch (err) {
      console.warn("Gnani STT API notice:", err);
      setSttError("Gnani STT unavailable. Please record and try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // 3. Answer Evaluation (Dynamic per Topic & Question)
  const handleEvaluateAnswer = async () => {
    if (!transcript.trim()) {
      setEvalError("Please transcribe or provide your answer first.");
      return;
    }

    setIsEvaluating(true);
    setEvalError("");

    try {
      const response = await api.post("/interview/evaluate", {
        question: currentQ.question,
        transcript: transcript.trim(),
        track: activeTopicKey,
        expectedKeywords: currentQ.expectedKeywords || [],
        modelAnswer: currentQ.modelAnswer || "",
        durationSeconds: recordingSeconds || 28,
      });

      if (response.data?.success && response.data?.evaluation) {
        setEvaluation(response.data.evaluation);
      } else {
        throw new Error(response.data?.message || "Evaluation failed");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvalError(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // 4. Gnani TTS Integration
  const handlePlayTTS = async (text, fieldName) => {
    if (!text) return;

    if (ttsPlayingField === fieldName) {
      audioPlayerRef.current.pause();
      setTtsPlayingField(null);
      return;
    }

    setIsTtsLoading(true);

    try {
      const response = await api.post("/interview/tts", {
        text,
        voice: "Nalini",
        model: "timbre-v2.5",
        language: "en-IN",
      });

      if (response.data?.success && response.data?.audioBase64) {
        const audioSrc = `data:${response.data.mimeType || "audio/mp3"};base64,${response.data.audioBase64}`;
        audioPlayerRef.current.src = audioSrc;
        await audioPlayerRef.current.play();
        setTtsPlayingField(fieldName);
      } else {
        fallbackSpeak(text, fieldName);
      }
    } catch {
      fallbackSpeak(text, fieldName);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const fallbackSpeak = (text, fieldName) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98;
      utterance.onend = () => setTtsPlayingField(null);
      utterance.onerror = () => setTtsPlayingField(null);
      window.speechSynthesis.speak(utterance);
      setTtsPlayingField(fieldName);
    } else {
      setTtsPlayingField(null);
    }
  };

  // 5. Save Completed Session into Real-Time History
  const handleSaveToDashboard = async () => {
    if (!evaluation) return;

    const newSession = {
      id: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: currentQ.title,
      question: currentQ.question,
      track: activeTopicKey,
      trackLabel: activeTopic.name,
      company: currentQ.company,
      score: evaluation.score,
      evaluation: evaluation.verdict,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: `${Math.max(1, Math.round(recordingSeconds / 60))} min`,
      pace: `${evaluation.wpm} WPM`,
      fillers: `${evaluation.fillersCount} words (${evaluation.fillerDensity})`,
      fillerDensity: evaluation.fillerDensity,
      statusColor: evaluation.verdictColor || "emerald",
      transcript: transcript,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      modelAnswer: evaluation.modelAnswer,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);

    try {
      await api.post("/interview/practice/session", newSession);
    } catch (err) {
      console.warn("Failed to save practice session to server:", err);
      // Revert optimistic update on failure
      setSessions(sessions);
    }

    setIsStudioOpen(false);
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/interview/practice/session/${sessionId}`);
      setSessions(
        sessions.filter(
          (s) => s.id !== sessionId && String(s._id) !== sessionId,
        ),
      );
    } catch (err) {
      console.warn("Failed to delete practice session:", err);
    }
    if (viewingSession?.id === sessionId) {
      setViewingSession(null);
    }
  };

  const filteredSessions =
    selectedFilter === "all"
      ? sessions
      : sessions.filter((s) => s.track === selectedFilter);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setSessions([]);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <AnimatedLogo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
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
        {/* Real-time Welcome Banner */}
        <div className="relative rounded-2xl bg-linear-to-r from-cyan-950/40 via-zinc-900 to-indigo-950/30 border border-zinc-800/90 p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Interview Prep Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {userName}!
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Select an interview topic below to practice high-yield questions
                asked by top tech companies. Speak aloud, transcribe with Gnani
                STT, and receive automated diagnostic scoring.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => openStudioWithQuestion("system_design", 0)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Choose Topic & Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Real-Time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Composite Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgScore !== null ? avgScore : "--"}
              <span className="text-sm font-normal text-zinc-500">
                {avgScore !== null ? "/100" : ""}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {totalSessions > 0
                ? `Calculated from ${totalSessions} recorded session${totalSessions > 1 ? "s" : ""}`
                : "Awaiting first completed mock"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Verbal Cadence
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgWpm !== null ? `${avgWpm} WPM` : "--"}
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {avgWpm
                ? avgWpm >= 130 && avgWpm <= 165
                  ? "Optimal executive pacing"
                  : "Audio duration rate"
                : "Measured from voice recording"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Filler Word Density
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgFillerDensity !== null ? avgFillerDensity : "--"}
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {avgFillerDensity
                ? "Scanned by Gnani speech model"
                : "Crutch word analysis"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Sessions Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalSessions}
              <span className="text-sm font-normal text-zinc-500">
                {" "}
                session{totalSessions !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {totalSessions > 0
                ? "Saved in live history"
                : "Ready to start practicing"}
            </div>
          </div>
        </div>

        {/* SELECT INTERVIEW TOPIC SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Select an Interview Topic</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Pick a core domain to practice realistic questions calibrated
                for Tier-1 tech interviews
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(INTERVIEW_TOPICS).map((topicKey) => {
              const topic = INTERVIEW_TOPICS[topicKey];
              return (
                <div
                  key={topicKey}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-cyan-300">
                        {topic.badge}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {topic.questions.length} Questions
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {topic.name}
                    </h3>

                    {/* Preview of first question */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      "{topic.questions[0].question}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono pt-1">
                      <Building className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{topic.questions[0].company}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      {topic.questions[0].difficulty}
                    </span>
                    <button
                      onClick={() => openStudioWithQuestion(topicKey, 0)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>Practice Topic</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME SESSION HISTORY */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Practice History</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded-full">
                  {filteredSessions.length}
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Your actual voice recordings, Gnani STT transcripts, and
                evaluations
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto max-w-full no-scrollbar">
              {[
                { id: "all", label: "All Topics" },
                ...Object.keys(INTERVIEW_TOPICS).map((k) => ({
                  id: k,
                  label: INTERVIEW_TOPICS[k].badge,
                })),
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === f.id
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-white">
                  No practice sessions recorded yet
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Choose an interview topic above and speak your answer.
                  AnswerForge will transcribe your voice using Gnani STT and
                  deliver instant, actionable feedback.
                </p>
              </div>
              <button
                onClick={() => openStudioWithQuestion("system_design", 0)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Select a Topic to Start</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setViewingSession(session)}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{session.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {session.trackLabel}
                      </span>
                      {session.company && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {session.company}
                        </span>
                      )}
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

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          const sid =
                            session.id || session._id || session.sessionId;
                          if (!sid) return;
                          handleDeleteSession(sid, e);
                        }}
                        title="Delete session"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewingSession(session)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center gap-1 transition-colors"
                      >
                        <span>View Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FULL SPOKEN PRACTICE STUDIO MODAL */}
      {isStudioOpen && (
        <div
          ref={studioModalRef}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRecording) {
              closeStudio();
            }
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 sm:py-10 animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-3xl mx-auto my-4 sm:my-8 rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl p-5 sm:p-8 text-slate-100 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeStudio}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="Return to Dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mic className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Interview Practice Studio</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                      Gnani Speech AI
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 hidden sm:block">
                    Select a topic, answer the interview question aloud, and
                    receive automated diagnostic scoring
                  </p>
                </div>
              </div>

              <button
                disabled={isRecording}
                onClick={closeStudio}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. TOPIC SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Select Topic</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {Object.keys(INTERVIEW_TOPICS).map((tKey) => {
                  const t = INTERVIEW_TOPICS[tKey];
                  const isActive = activeTopicKey === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => {
                        setActiveTopicKey(tKey);
                        setActiveQuestionIdx(0);
                        setEvaluation(null);
                        setTranscript("");
                        setAudioBlob(null);
                        if (audioUrl) URL.revokeObjectURL(audioUrl);
                        setAudioUrl(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                        isActive
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white font-bold shadow-sm ring-1 ring-cyan-500/30"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-[11px] leading-tight truncate">
                        {t.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. QUESTION SELECTOR UNDER CHOSEN TOPIC */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Select Question</span>
                </label>

                {activeTopic.questions.length > 1 && (
                  <button
                    onClick={pickRandomQuestion}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Next / Surprise Question</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeTopic.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setEvaluation(null);
                      setTranscript("");
                      setAudioBlob(null);
                      if (audioUrl) URL.revokeObjectURL(audioUrl);
                      setAudioUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeQuestionIdx === idx
                        ? "bg-zinc-800 text-white border border-cyan-500/50 font-bold"
                        : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    Q{idx + 1}: {q.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE QUESTION CARD */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-cyan-300">
                    {currentQ.company}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {currentQ.difficulty}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayTTS(currentQ.question, "question")}
                  disabled={isTtsLoading}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {isTtsLoading && ttsPlayingField === "question" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : ttsPlayingField === "question" ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {ttsPlayingField === "question"
                      ? "Pause"
                      : "Hear Question (Gnani TTS)"}
                  </span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white leading-relaxed">
                "{currentQ.question}"
              </h3>

              {currentQ.signals && (
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-1.5">
                  <span className="text-cyan-400 font-semibold shrink-0">
                    Interviewer Signals:
                  </span>
                  <span className="text-zinc-400">{currentQ.signals}</span>
                </div>
              )}
            </div>

            {/* RECORDING CONTROLS */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>3. Record Your Answer</span>
                </span>

                <div className="flex items-center gap-2">
                  {isRecording && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[11px] font-mono text-red-400 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>REC</span>
                    </span>
                  )}
                  <span className="font-mono text-sm font-bold text-white">
                    {formatTime(recordingSeconds)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {audioBlob ? "Record Again" : "Start Recording"}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={stopRecording}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop Recording</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-zinc-950 hover:bg-red-500/10 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel Recording</span>
                    </button>
                  </div>
                )}

                {!isRecording && (
                  <button
                    type="button"
                    onClick={handleUseSampleRecording}
                    disabled={isRecording}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                  >
                    Use Sample Spoken Answer
                  </button>
                )}
              </div>

              {audioUrl && !isRecording && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                    <Headphones className="w-4 h-4 text-cyan-400" />
                    <span>
                      Audio Preview Recorded ({formatTime(recordingSeconds)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <audio
                      src={audioUrl}
                      controls
                      className="flex-1 sm:w-64 h-8 outline-none rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={discardAudio}
                      title="Discard audio and re-record"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/15 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Discard / Reset</span>
                    </button>
                  </div>
                </div>
              )}

              {sttError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sttError}</span>
                </div>
              )}
            </div>

            {/* GNANI STT TRANSCRIPTION */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>4. Gnani STT Transcription</span>
                </span>

                <button
                  onClick={handleTranscribeWithGnani}
                  disabled={isTranscribing || isRecording || !audioBlob}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transcribing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Transcribe with Gnani STT</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your transcribed spoken answer will appear here via Gnani STT..."
                  className="w-full p-3.5 rounded-xl bg-zinc-950 border text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/20 transition-all font-sans leading-relaxed resize-none"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    Words:{" "}
                    {transcript.trim()
                      ? transcript.trim().split(/\s+/).length
                      : 0}
                  </span>
                  <span>Gnani Prisma STT v3</span>
                </div>
              </div>

              {transcript.trim() && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>5. Evaluate Answer & Get Score</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {evalError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}
            </div>

            {/* RESULTS SCORECARD */}
            {evaluation && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-cyan-500/30 space-y-6 shadow-2xl animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-2xl font-black text-cyan-300">
                      {evaluation.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          Evaluation Scorecard
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            evaluation.verdictColor === "emerald"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                              : evaluation.verdictColor === "cyan"
                                ? "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                                : "bg-amber-950 text-amber-400 border border-amber-800/50"
                          }`}
                        >
                          {evaluation.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Track: {activeTopic.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const summary = `Your score is ${evaluation.score} out of 100 with a verdict of ${evaluation.verdict}. Speaking rate was ${evaluation.wpm} words per minute. Strength: ${evaluation.strengths[0]}. Improvement focus: ${evaluation.improvements[0]}`;
                      handlePlayTTS(summary, "feedback");
                    }}
                    disabled={isTtsLoading}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-cyan-300 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    {isTtsLoading && ttsPlayingField === "feedback" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : ttsPlayingField === "feedback" ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>
                      {ttsPlayingField === "feedback"
                        ? "Pause Voice Feedback"
                        : "Listen to Feedback (Gnani TTS)"}
                    </span>
                  </button>
                </div>

                {/* Sub-Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Relevance
                    </div>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">
                      {evaluation.relevanceScore}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Verbal Cadence
                    </div>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                      {evaluation.wpm}{" "}
                      <span className="text-xs font-normal text-zinc-500">
                        WPM
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Filler Density
                    </div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                      {evaluation.fillerDensity}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Structure
                    </div>
                    <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5">
                      {evaluation.clarityScore}%
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-2 font-mono uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Demonstrated Strengths</span>
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2 font-mono uppercase">
                      <AlertCircle className="w-4 h-4" />
                      <span>Targeted Growth Areas</span>
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer (Gnani TTS) */}
                <div className="p-4 rounded-xl bg-linear-to-r from-cyan-950/20 to-zinc-900 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Exemplary Model Answer (Gnani TTS)</span>
                    </span>

                    <button
                      onClick={() =>
                        handlePlayTTS(evaluation.modelAnswer, "modelAnswer")
                      }
                      disabled={isTtsLoading}
                      className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      {isTtsLoading && ttsPlayingField === "modelAnswer" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : ttsPlayingField === "modelAnswer" ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {ttsPlayingField === "modelAnswer"
                          ? "Pause"
                          : "Listen to Model Answer"}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">
                    "{evaluation.modelAnswer}"
                  </p>
                </div>

                {/* Save CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-end justify-end gap-3">
                  <button
                    onClick={handleTryAnotherQuestion}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Try Another Question</span>
                  </button>
                  <button
                    onClick={handleSaveToDashboard}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save to Dashboard History</span>
                  </button>
                </div>
              </div>
            )}

            {/* Studio Bottom Bar / Exit Studio */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={closeStudio}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Studio / Back to Dashboard</span>
              </button>

              <div className="text-[11px] font-mono text-zinc-500">
                Gnani STT & TTS Powered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PAST SCORECARD MODAL */}
      {viewingSession && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingSession(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 sm:py-10 animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl mx-auto my-4 sm:my-8 rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl p-6 sm:p-7 text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewingSession(null)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors sm:hidden"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono text-xl font-bold text-cyan-300 shrink-0">
                  {viewingSession.score}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {viewingSession.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>{viewingSession.trackLabel}</span>
                    <span>&bull;</span>
                    <span>{viewingSession.date}</span>
                    <span>&bull;</span>
                    <span className="text-cyan-400">{viewingSession.pace}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingSession(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Close Scorecard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            {viewingSession.question && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Interview Question
                </span>
                <p className="text-xs text-white font-medium">
                  "{viewingSession.question}"
                </p>
              </div>
            )}

            {/* Transcript */}
            {viewingSession.transcript && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Transcribed Answer (Gnani STT)
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{viewingSession.transcript}"
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {viewingSession.strengths && (
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {viewingSession.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewingSession.improvements && (
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px] uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Focus Areas</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {viewingSession.improvements.map((i, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Model Answer (with Gnani TTS) */}
            {viewingSession.modelAnswer && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    <span>Exemplary Model Answer</span>
                  </span>
                  <button
                    onClick={() =>
                      handlePlayTTS(viewingSession.modelAnswer, "modelView")
                    }
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen (Gnani TTS)</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  "{viewingSession.modelAnswer}"
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingSession(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => setViewingSession(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
