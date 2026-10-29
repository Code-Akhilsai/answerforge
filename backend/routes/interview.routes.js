import { Router } from "express";
import {
  transcribeAudio,
  evaluateAnswer,
  synthesizeSpeech,
  savePracticeSession,
  getPracticeSessions,
  deletePracticeSession,
} from "../controllers/interview.controllers.js";
import authMiddleware from "../middlewares/middleware.js";

const interviewRouter = Router();

interviewRouter.post("/transcribe", transcribeAudio);
interviewRouter.post("/evaluate", evaluateAnswer);
interviewRouter.post("/tts", synthesizeSpeech);

/* User-specific practice sessions (MongoDB) */
interviewRouter.post("/practice/session", authMiddleware, savePracticeSession);
interviewRouter.get("/practice/sessions", authMiddleware, getPracticeSessions);
interviewRouter.delete(
  "/practice/session/:id",
  authMiddleware,
  deletePracticeSession,
);

export default interviewRouter;
