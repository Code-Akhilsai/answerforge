import { Router } from "express";
import {
  transcribeAudio,
  evaluateAnswer,
  synthesizeSpeech,
} from "../controllers/interview.controllers.js";

const interviewRouter = Router();

interviewRouter.post("/transcribe", transcribeAudio);
interviewRouter.post("/evaluate", evaluateAnswer);
interviewRouter.post("/tts", synthesizeSpeech);

export default interviewRouter;

