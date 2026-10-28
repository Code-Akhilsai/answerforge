import dotenv from "dotenv";
dotenv.config();

/**
 * Common filler words and phrases to analyze in speech
 */
const FILLER_PATTERNS = [
  { phrase: "so basically", regex: /\bso basically\b/gi },
  { phrase: "you know", regex: /\byou know\b/gi },
  { phrase: "sort of", regex: /\bsort of\b/gi },
  { phrase: "kind of", regex: /\bkind of\b/gi },
  { phrase: "um", regex: /\bum\b/gi },
  { phrase: "uh", regex: /\buh\b/gi },
  { phrase: "like", regex: /\blike\b/gi },
  { phrase: "basically", regex: /\bbasically\b/gi },
  { phrase: "actually", regex: /\bactually\b/gi },
  { phrase: "i mean", regex: /\bi mean\b/gi },
];

/**
 * 1. Gnani STT Integration - Transcribe recorded audio
 */
export const transcribeAudio = async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm", languageCode = "en-IN" } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        success: false,
        message: "No audio data provided",
      });
    }

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GNANI_API_KEY is not configured in backend environment",
      });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
    const audioBuffer = Buffer.from(cleanBase64, "base64");

    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: mimeType });
    formData.append("audio_file", audioBlob, "recording.wav");
    formData.append("language_code", languageCode);

    const gnaniUrl = "https://api.vachana.ai/stt/v3";

    const response = await fetch(gnaniUrl, {
      method: "POST",
      headers: {
        "X-API-Key-ID": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gnani STT API error:", response.status, errorText);
      return res.status(response.status).json({
        success: false,
        message: `Gnani STT failed (${response.status}): ${errorText || "Transcription error"}`,
      });
    }

    const data = await response.json();

    const fullTranscript =
      data.full_transcript ||
      data.transcript ||
      (Array.isArray(data.segments)
        ? data.segments.map((s) => s.text).join(" ")
        : "") ||
      "";

    return res.status(200).json({
      success: true,
      transcript: fullTranscript.trim(),
      raw: data,
    });
  } catch (error) {
    console.error("Transcription controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to transcribe audio",
    });
  }
};

/**
 * 2. Answer Evaluation - Evaluate candidate transcript dynamically based on chosen topic and question
 */
export const evaluateAnswer = async (req, res) => {
  try {
    const {
      question = "Explain your architectural approach.",
      transcript = "",
      track = "system_design",
      expectedKeywords = [],
      modelAnswer: customModelAnswer = "",
      durationSeconds = 30,
    } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No transcript provided for evaluation",
      });
    }

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMin = Math.max(0.15, durationSeconds / 60);
    const wpm = Math.round(wordCount / durationMin);

    // Detect filler words
    let totalFillers = 0;
    const detectedFillers = [];

    for (const item of FILLER_PATTERNS) {
      const matches = transcript.match(item.regex);
      if (matches && matches.length > 0) {
        totalFillers += matches.length;
        detectedFillers.push({
          word: item.phrase,
          count: matches.length,
        });
      }
    }

    const fillerDensity =
      wordCount > 0 ? ((totalFillers / wordCount) * 100).toFixed(1) : "0.0";

    // Dynamic keyword matching (uses question-specific keywords if provided, with track fallback)
    const fallbackTrackKeywords = {
      system_design: [
        "idempotency", "redis", "cache", "partition", "atomic", "retry",
        "distributed", "latency", "scale", "kafka", "queue", "lock"
      ],
      databases: [
        "database", "b-tree", "lsm", "cassandra", "postgresql", "acid",
        "lock", "index", "saga", "outbox", "stampede", "ttl"
      ],
      behavioral: [
        "situation", "action", "result", "team", "conflict", "stakeholder",
        "resolution", "compromise", "leadership", "impact", "delivered"
      ],
      product: [
        "metric", "funnel", "cohort", "segment", "triage", "hypothesis",
        "retention", "user", "prioritization", "drop-off", "sla"
      ],
      frontend: [
        "lcp", "cls", "tbt", "web vitals", "code splitting", "ssr",
        "micro-frontend", "module federation", "bundle", "cdn", "state"
      ],
      devops_cloud: [
        "canary", "kubernetes", "argo", "service mesh", "istio", "rollback",
        "prometheus", "p99", "traffic split", "telemetry", "disaster recovery", "rto", "rpo"
      ],
      security: [
        "jwt", "revocation", "refresh token", "blacklist", "redis", "bloom filter",
        "ssrf", "dns rebinding", "metadata", "zero-trust", "mtls", "spiffe"
      ],
      ai_ml_eng: [
        "rag", "embeddings", "vector database", "hybrid search", "bm25", "reranker",
        "kv cache", "pagedattention", "vllm", "quantization", "prompt injection", "guardrails"
      ],
      api_backend: [
        "grpc", "graphql", "rest", "protobuf", "http/2", "websockets", "sse",
        "crdt", "kafka", "rabbitmq", "partition", "offset", "consumer group"
      ],
    };

    const targetKeywords =
      Array.isArray(expectedKeywords) && expectedKeywords.length > 0
        ? expectedKeywords
        : fallbackTrackKeywords[track] || fallbackTrackKeywords.system_design;

    const matchedKeywords = targetKeywords.filter((kw) =>
      transcript.toLowerCase().includes(kw.toLowerCase()),
    );

    // Keyword coverage ratio
    const keywordCoverageRatio = Math.min(
      1,
      matchedKeywords.length / Math.max(2, targetKeywords.length * 0.4),
    );

    // Elaboration and length score
    const lengthScore = Math.min(100, Math.round((wordCount / 50) * 85) + 15);

    // Relevance score
    const relevanceScore = Math.min(
      98,
      Math.max(62, Math.round(keywordCoverageRatio * 42 + 56)),
    );

    // Pacing evaluation (130-165 WPM is ideal conversational executive pace)
    let cadenceStatus = "Optimal Conversational Pace";
    let cadenceScore = 95;
    if (wpm < 110) {
      cadenceStatus = "Deliberate / Cautious Pace";
      cadenceScore = 78;
    } else if (wpm > 175) {
      cadenceStatus = "Fast / Rushed Tempo";
      cadenceScore = 80;
    }

    // Filler penalty
    const fillerPenalty = Math.min(25, totalFillers * 3.5);
    const clarityScore = Math.max(60, Math.round(cadenceScore - fillerPenalty));

    // Composite Score
    const compositeScore = Math.min(
      96,
      Math.max(
        62,
        Math.round(relevanceScore * 0.45 + clarityScore * 0.35 + lengthScore * 0.2),
      ),
    );

    // Hiring Verdict
    let verdict = "HIRE";
    let verdictColor = "cyan";
    if (compositeScore >= 88) {
      verdict = "STRONG HIRE";
      verdictColor = "emerald";
    } else if (compositeScore < 75) {
      verdict = "LEAN HIRE";
      verdictColor = "amber";
    }

    // Dynamic Strengths based on actual response
    const strengths = [];
    if (matchedKeywords.length >= 2) {
      strengths.push(
        `Domain Precision: Successfully articulated key concepts (${matchedKeywords.slice(0, 3).join(", ")}).`,
      );
    } else {
      strengths.push(
        "Direct Delivery: Directly addressed the core objective of the prompt.",
      );
    }

    if (totalFillers <= 1) {
      strengths.push(
        `High Acoustic Composure: Maintained clean verbal delivery with low filler count (${totalFillers} detected).`,
      );
    } else {
      strengths.push(
        `Natural Tempo: Sustained an engaging speech rate of ${wpm} words per minute.`,
      );
    }

    if (wordCount >= 35) {
      strengths.push(
        "Structured Framing: Laid out actionable components and systematic technical rationale.",
      );
    }

    // Dynamic Improvement Areas
    const improvements = [];
    if (totalFillers > 2) {
      improvements.push(
        `Crutch Word Awareness: Detected ${totalFillers} crutches (${detectedFillers
          .map((f) => `"${f.word}" x${f.count}`)
          .join(", ")}). Substitute fillers with 1.5s deliberate pauses.`,
      );
    } else {
      improvements.push(
        "Pause Discipline: Take a deliberate 2-second framing pause before moving into technical trade-offs.",
      );
    }

    if (matchedKeywords.length < 3) {
      const missingKeywords = targetKeywords
        .filter((kw) => !matchedKeywords.includes(kw))
        .slice(0, 3);
      if (missingKeywords.length > 0) {
        improvements.push(
          `Deepen Technical Specifics: Consider explicitly discussing: ${missingKeywords.join(", ")}.`,
        );
      }
    }

    improvements.push(
      "Quantified Business Impact: Strengthen the answer by citing concrete metrics (SLAs, latency reduction, or downtime prevented).",
    );

    const finalModelAnswer =
      customModelAnswer ||
      "A strong answer begins by clarifying requirements and non-functional SLOs, outlines the high-level architecture with proper trade-offs, and addresses edge cases, failure modes, and monitoring.";

    return res.status(200).json({
      success: true,
      evaluation: {
        score: compositeScore,
        verdict,
        verdictColor,
        wpm,
        cadenceStatus,
        wordCount,
        fillersCount: totalFillers,
        fillerDensity: `${fillerDensity}%`,
        fillersList: detectedFillers,
        relevanceScore,
        clarityScore,
        strengths,
        improvements,
        modelAnswer: finalModelAnswer,
      },
    });
  } catch (error) {
    console.error("Evaluation controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate answer",
    });
  }
};

/**
 * 3. Gnani TTS Integration - Synthesize speech from text
 */
export const synthesizeSpeech = async (req, res) => {
  try {
    const {
      text,
      voice = "Nalini",
      model = "timbre-v2.5",
      language = "en-IN",
      speed = 1.0,
    } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required for TTS synthesis",
      });
    }

    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GNANI_API_KEY is not configured",
      });
    }

    const gnaniTtsUrl = "https://api.vachana.ai/api/v1/tts/inference";

    const payload = {
      text: text.trim(),
      voice,
      model,
      language,
      speed,
      audio_config: {
        container: "mp3",
        sample_rate: 24000,
        bitrate: "128k",
      },
    };

    const response = await fetch(gnaniTtsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key-ID": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gnani TTS API error:", response.status, errText);
      return res.status(response.status).json({
        success: false,
        message: `Gnani TTS failed (${response.status}): ${errText}`,
        fallback: true,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({
      success: true,
      audioBase64,
      mimeType: "audio/mp3",
    });
  } catch (error) {
    console.error("TTS controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to synthesize speech",
      fallback: true,
    });
  }
};
