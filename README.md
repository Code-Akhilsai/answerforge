# AnswerForge — AI Voice Interview Practice Platform

[**Live Site: https://answerforge.netlify.app**](https://answerforge.netlify.app)

AnswerForge is a full-stack AI-powered interview preparation platform. Candidates practice high-stakes interviews by speaking aloud, getting their voice transcribed via Gnani STT, evaluated by Google Gemini, and receive spoken feedback via Gnani TTS — all with per-user session history stored in MongoDB.

---

## 🚀 Features

- **Voice Interview Studio** — Record your answer aloud, transcribe with Gnani STT, and get instant diagnostic scoring.
- **AI Evaluation (Gemini)** — Scores answers on relevance, clarity, structure, and verbal cadence using `gemini-3.1-flash-lite`.
- **Gnani TTS** — Listen to question audio, evaluation feedback, and model answers via Gnani TTS (Nalini voice).
- **Per-User Practice History** — Every practice session is saved to MongoDB under the logged-in user; each user sees only their own history.
- **Delete Session** — Remove individual practice records from your dashboard.
- **Forgot Password** — Token-based password reset flow (demo mode returns token via API).
- **Protected Routes** — Dashboard is auth-guarded; sign-in/sign-up pages redirect authenticated users away.
- **Responsive Design** — Works on desktop and mobile.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, Mongoose (MongoDB) |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Speech-to-Text | Gnani STT (Prisma v3) |
| Text-to-Speech | Gnani TTS via Vachana API (`api.vachana.ai`) |
| LLM Evaluation | Google Gemini `gemini-3.1-flash-lite` |
| Deployment | Frontend: Netlify · Backend: Render |

---

## 📡 APIs (Backend)

All API routes are prefixed with `/api/v1`.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login (sets JWT httpOnly cookie) |
| `POST` | `/auth/google` | Google OAuth login |
| `POST` | `/auth/forgot-password` | Generate password-reset token |
| `POST` | `/auth/reset-password/:token` | Reset password with token |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/interview/transcribe` | Transcribe recorded audio via Gnani STT |
| `POST` | `/interview/evaluate` | Evaluate answer via Gemini AI |
| `POST` | `/interview/tts` | Synthesize speech via Gnani TTS |
| `POST` | `/interview/practice/session` | Save a practice session (auth) |
| `GET` | `/interview/practice/sessions` | Fetch user's practice sessions (auth) |
| `DELETE` | `/interview/practice/session/:id` | Delete a practice session (auth) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Uptime-monitoring health check |

---

## 🎙 Gnani API Integration

### Speech-to-Text (STT)
- **Provider:** Gnani (Prisma STT v3)
- **Endpoint:** `POST /interview/transcribe`
- **Input:** Base64-encoded WAV audio + language code
- **Output:** Transcribed text
- Used to convert the candidate's spoken answer into text before evaluation.

### Text-to-Speech (TTS)
- **Provider:** Gnani TTS via Vachana API (Timbre model)
- **Endpoint:** `POST /interview/tts`
- **API:** `https://api.vachana.ai/api/v1/tts/inference`
- **Model:** `timbre-v2.5`
- **Voice:** `Nalini`
- **Language:** `en-IN`
- Used to speak the interview question, evaluation feedback, and model answer aloud.

---

## 🧠 AI Evaluation Model

- **Provider:** Google Gemini
- **Model:** `gemini-3.1-flash-lite`
- **Configured in:** `backend/.env` → `GEMINI_MODEL=gemini-3.1-flash-lite`
- **What it evaluates:** Score (0–100), verdict (Strong Hire / Hire / Lean Hire), relevance, clarity, structure, WPM, filler density, strengths, improvements, and a model answer.
- **Fallback:** If the Gemini API is unavailable, a deterministic JS heuristic evaluation is used as backup.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```
PORT=3000
MONGO_URI=<your mongodb connection string>
JWT_SECRET=<your jwt secret>
GNANI_API_KEY=<your gnani/vachana api key>
GEMINI_API_KEY=<your google gemini api key>
GEMINI_MODEL=gemini-3.1-flash-lite
```

### Frontend (`frontend/.env` / `.env.production`)
```
VITE_BACKEND_URL=http://localhost:3000        # local
VITE_BACKEND_URL=https://answerforge-xl12.onrender.com  # production
```

> ⚠️ `.env*` files are **not** committed to git. Set them in your hosting dashboard (Netlify for frontend, Render for backend).

---

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB database (Atlas or local)

### Backend
```powershell
cd backend
npm install
# Create backend/.env with the variables above
npm run dev          # runs on http://localhost:3000
```

### Frontend
```powershell
cd frontend
npm install
# Create frontend/.env with VITE_BACKEND_URL=http://localhost:3000
npm run dev          # runs on http://localhost:5173
```

Open `http://localhost:5173`, register/login, and start practicing.

---

## 🚀 Deployment

### Backend (Render)
- **Build command:** `cd backend && npm install`
- **Start command:** `cd backend && node server.js`
- **Env vars:** `MONGO_URI`, `JWT_SECRET`, `GNANI_API_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`
- Health check: `https://<your-render-url>/health`

### Frontend (Netlify)
- **Base directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Env var:** `VITE_BACKEND_URL=https://<your-render-url>`

---

## 📁 Project Structure

```
AnswerForge/
├── backend/
│   ├── server.js                 # Express app + CORS + health route
│   ├── db/connectDB.js           # MongoDB connection
│   ├── models/user.models.js     # User schema (auth + practiceSessions)
│   ├── controllers/
│   │   ├── user.controllers.js   # Auth, forgot/reset password
│   │   └── interview.controllers.js  # Transcribe, evaluate, TTS, sessions
│   ├── middlewares/middleware.js # JWT auth middleware
│   └── routes/
│       ├── user.routes.js
│       └── interview.routes.js
├── frontend/
│   ├── src/
│   │   ├── api.js                # Axios instance with credentials
│   │   ├── App.jsx               # Routes + protected/guest guards
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   └── Dashboard.jsx     # Studio + practice history
│   │   ├── components/
│   │   │   ├── SignInModal.jsx   # Login / signup / forgot password
│   │   │   ├── AnimatedLogo.jsx  # Brand logo
│   │   │   └── ...
│   │   └── data/interviewTopics.js # Curated interview question bank
│   ├── index.html
│   └── netlify.toml
├── netlify.toml
└── README.md
```

---

## 🔒 Security Notes

- JWT stored in **httpOnly, secure, sameSite** cookies (not localStorage).
- Practice sessions are scoped per user (`userId` / `userEmail` on each session).
- CORS configured to allow only the frontend origin with credentials enabled.
- `.env` files excluded from git via `.gitignore`.

---

## 🏆 Hackathon Highlights

- Real-time voice-to-text transcription (Gnani STT)
- AI-powered interview scoring (Gemini `gemini-3.1-flash-lite`)
- Spoken feedback via Gnani TTS (Nalini voice)
- Per-user persistent practice history (MongoDB)
- Fully responsive studio + dashboard

---

## 📄 License

MIT
