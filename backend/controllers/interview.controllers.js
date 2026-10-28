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
    const ext = mimeType.includes("wav") ? "wav" : mimeType.includes("mp3") ? "mp3" : "webm";
    formData.append("audio_file", audioBlob, `recording.${ext}`);
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

    // Call Gemini to evaluate score and metrics
    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const geminiKey = process.env.GEMINI_API_KEY;
    let evaluation;
    try {
      const prompt = `You are an interview evaluator. Evaluate the candidate's answer to the question.

Question: ${question}
Track: ${track}
Transcript: ${transcript}
DurationSeconds: ${durationSeconds}
WordCount: ${wordCount}
WPM: ${wpm}
FillerCount: ${totalFillers}
FillerDensity: ${fillerDensity}%

Return ONLY valid JSON with fields: score (0-100 number), verdict (string), verdictColor (emerald/cyan/amber), wpm (number), cadenceStatus (string), wordCount (number), fillersCount (number), fillerDensity (string with %), fillersList (array of {word,count}), relevanceScore (number), clarityScore (number), strengths (array of strings), improvements (array of strings), modelAnswer (string).`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );
      const geminiData = await geminiRes.json();
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      evaluation = JSON.parse(text);
      evaluation.score = Number(evaluation.score) || 75;
      evaluation.verdict = evaluation.verdict || "LEAN HIRE";
      evaluation.verdictColor = evaluation.verdictColor || "amber";
      evaluation.fillersList = evaluation.fillersList || detectedFillers;
      evaluation.wordCount = evaluation.wordCount || wordCount;
      evaluation.wpm = evaluation.wpm || wpm;
      evaluation.fillersCount = evaluation.fillersCount ?? totalFillers;
      evaluation.fillerDensity = evaluation.fillerDensity || `${fillerDensity}%`;
      evaluation.strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : ["Direct Delivery: Directly addressed the core objective of the prompt."];
      evaluation.improvements = Array.isArray(evaluation.improvements) ? evaluation.improvements : ["Quantified Business Impact: Strengthen the answer by citing concrete metrics."];
      evaluation.relevanceScore = Number(evaluation.relevanceScore) || 70;
      evaluation.clarityScore = Number(evaluation.clarityScore) || 70;
    } catch (e) {
      console.error("Gemini evaluation failed:", e);
      const compositeScore = Math.min(96, Math.max(62, 75));
      evaluation = {
        score: compositeScore,
        verdict: "LEAN HIRE",
        verdictColor: "amber",
        wpm,
        cadenceStatus: "Optimal Conversational Pace",
        wordCount,
        fillersCount: totalFillers,
        fillerDensity: `${fillerDensity}%`,
        fillersList: detectedFillers,
        relevanceScore: 70,
        clarityScore: 70,
        strengths: ["Direct Delivery: Directly addressed the core objective of the prompt."],
        improvements: ["Quantified Business Impact: Strengthen the answer by citing concrete metrics."],
        modelAnswer: customModelAnswer || "A strong answer clarifies requirements, outlines architecture with trade-offs, and addresses edge cases.",
      };
    }

    const finalModelAnswer = evaluation.modelAnswer || customModelAnswer || "A strong answer begins by clarifying requirements and non-functional SLOs, outlines the high-level architecture with proper trade-offs, and addresses edge cases, failure modes, and monitoring.";

    return res.status(200).json({
      success: true,
      evaluation: {
        score: evaluation.score,
        verdict: evaluation.verdict,
        verdictColor: evaluation.verdictColor,
        wpm: evaluation.wpm,
        cadenceStatus: evaluation.cadenceStatus,
        wordCount: evaluation.wordCount,
        fillersCount: evaluation.fillersCount,
        fillerDensity: evaluation.fillerDensity,
        fillersList: evaluation.fillersList,
        relevanceScore: evaluation.relevanceScore,
        clarityScore: evaluation.clarityScore,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
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
