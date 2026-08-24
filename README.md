<div align="center">

# 🌱 PlantSathi AI

### Your plant's personal doctor — powered by AI

*Snap a photo. Get a diagnosis. Chat with an AI doctor for follow-up care.*

[![Node.js](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![JWT](https://img.shields.io/badge/auth-JWT%20%2B%20bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Groq](https://img.shields.io/badge/AI-Groq%20(Llama%203.1)-F55036)](https://groq.com/)
[![PlantNet](https://img.shields.io/badge/species%20ID-PlantNet%20API-4CAF50)](https://my.plantnet.org/)

**[🔗 GitHub Repo](#)** · **[🌍 Live Demo](#)**
*(add your links here once you've pushed to GitHub / deployed)*

</div>

---

## 🩺 What it does

Most people don't know why their plant is dying until it's too late. PlantSathi AI
turns a phone photo into an actual diagnosis: it identifies the species, detects
disease from the leaf, factors in your local weather, and gives you a real answer
— then lets you keep asking follow-up questions to an AI plant doctor until you're
confident you know what to do. Everything is private to your own account.

## ✨ Features

| | |
|---|---|
| 🔐 **Accounts & Auth** | Email/password signup, JWT-based sessions, bcrypt password hashing. Every user's data is private to them. |
| 🔍 **Plant Identification** | Species ID via the [PlantNet API](https://my.plantnet.org/) |
| 🩹 **AI Disease Detection** | Leaf-disease classification via a Hugging Face vision model |
| 💬 **AI Plant Doctor** | Conversational follow-up care advice via [Groq](https://console.groq.com/) (Llama 3.1) |
| 🌦️ **Weather-Aware Care Tips** | Live local weather via [OpenWeatherMap](https://openweathermap.org/api) |
| 📊 **Dashboard** | Scan history chart, healthy-vs-issue breakdown over time |
| 🪴 **My Garden** | Save plants, log watering, all scoped to your account |

## 🏗️ Architecture

```
┌──────────────┐   JWT    ┌────────────────┐
│   React 18   │◀────────▶│  Node.js +      │
│  Vite +      │  /api/*  │  Express         │
│  Tailwind    │          │  Backend         │
└──────────────┘          └───────┬─────────┘
                                   │
                 ┌─────────────────┼─────────────────┬──────────────┐
                 ▼                 ▼                 ▼              ▼
          ┌────────────┐  ┌────────────────┐  ┌────────────┐ ┌─────────────┐
          │  PlantNet   │  │  Hugging Face   │  │    Groq     │ │OpenWeather  │
          │  species ID │  │  disease model  │  │ Llama 3.1   │ │  Map        │
          └────────────┘  └────────────────┘  └────────────┘ └─────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  lowdb (JSON)    │
                          │  users · scans   │
                          │  garden · chats   │
                          └─────────────────┘
```

Every AI feature has a **demo-mode fallback** — the app runs and demos end-to-end
even with zero API keys configured, which makes it easy to clone and try
immediately (see [Environment Variables](#-environment-variables) below).

## 🧰 Tech stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast dev loop, modern styling |
| Backend | Node.js + Express | Lightweight, matches the JS-everywhere frontend stack |
| Auth | JWT (jsonwebtoken) + bcrypt | Stateless sessions, industry-standard password hashing |
| Storage | lowdb (local JSON file) | Zero setup for a student project — swappable for MongoDB/Postgres later |
| Species ID | PlantNet API | Purpose-built plant identification, generous free tier |
| Disease detection | Hugging Face Inference Providers | Hosted vision model, no local GPU needed |
| Conversational AI | Groq (Llama 3.1 8B) | Fast, free-tier-friendly, OpenAI-compatible API |
| Weather | OpenWeatherMap | Free tier, powers location-aware care tips |

## 📁 Project structure

```
plantsathi-ai/
├── backend/
│   ├── middleware/
│   │   └── auth.js         # verifies JWT on protected routes
│   ├── routes/
│   │   ├── auth.js         # signup / login / session check
│   │   ├── identify.js     # PlantNet species identification
│   │   ├── diagnose.js     # Hugging Face disease detection
│   │   ├── chat.js         # Groq AI Plant Doctor chat
│   │   ├── weather.js      # OpenWeatherMap + care tips
│   │   └── garden.js       # My Garden CRUD (scoped per user)
│   ├── data/db.json        # local JSON database (auto-created)
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/           # Home, Scan, Dashboard, MyGarden, Login, Signup
    │   ├── components/      # Navbar, ProtectedRoute, VeinMotif
    │   ├── context/
    │   │   └── AuthContext.jsx  # login state, token, session persistence
    │   ├── api/api.js       # axios client, talks directly to the backend
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and add JWT_SECRET (+ optional free API keys — see below)
npm run dev
```
Runs at `http://localhost:5050`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`, and talks **directly** to the backend at
`http://localhost:5050/api` — not through Vite's dev proxy, which has a known
issue with multipart file uploads on some Node versions. CORS is enabled on the
backend to allow this directly.

### 3. Open it

Visit `http://localhost:5173`. Sign up / log in first — every plant, diagnosis,
and chat is private to your account.

## 🔑 Environment variables

Add these to `backend/.env` (copy from `.env.example` as a starting point):

| Variable | Required? | Notes |
|---|---|---|
| `PORT` | No | Defaults to `5050` |
| `JWT_SECRET` | **Yes** | Long random string signing login sessions. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PLANTNET_API_KEY` | No (demo fallback) | Free tier: https://my.plantnet.org/ |
| `HUGGINGFACE_API_KEY` | No (demo fallback) | Free token: https://huggingface.co/settings/tokens — must be a **fine-grained token with "Make calls to Inference Providers" checked** |
| `HUGGINGFACE_DISEASE_MODEL` | No | Defaults to a public plant-disease classification model |
| `GROQ_API_KEY` | No (demo fallback) | Free key: https://console.groq.com/keys |
| `OPENWEATHER_API_KEY` | No (demo fallback) | Free key: https://openweathermap.org/api (can take ~2 hours to activate after signup) |

> ⚡ **The app works out of the box** with demo/mock data for every AI feature,
> even with zero external API keys — so you can clone it and demo the full flow
> immediately. `JWT_SECRET` is the one variable you should always set yourself;
> without it, sessions fall back to a shared default secret, which is fine for
> local demoing but shouldn't be relied on beyond that.

> 🔒 **Security note:** never commit your real `.env` or share screenshots of it
> — it's already listed in `.gitignore`. If a key is ever exposed, regenerate it
> from the provider's dashboard immediately.

## 🔐 How authentication works

- `backend/routes/auth.js` handles `POST /api/auth/signup` and `POST /api/auth/login`,
  hashing passwords with **bcrypt** (10 salt rounds) and issuing a **JWT** signed
  with `JWT_SECRET`, valid for 7 days.
- `backend/middleware/auth.js` verifies that JWT on every protected route
  (`/api/identify`, `/api/diagnose`, `/api/chat`, `/api/garden`) and attaches the
  user's ID to the request so data is scoped correctly. `/api/weather` is
  intentionally left public since it doesn't touch personal data.
- Every saved plant, diagnosis, and chat message is tagged with a `userId` and
  filtered server-side — one account can never see another's data.
- `frontend/context/AuthContext.jsx` stores the token in `localStorage` and
  restores the session on page reload via `GET /api/auth/me`.

## 🩹 How disease detection works

`backend/routes/diagnose.js` sends the uploaded image to Hugging Face's
**Inference Providers** API (`router.huggingface.co/hf-inference/...`), running a
plant-disease image classification model
(`linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` by default —
swappable via `HUGGINGFACE_DISEASE_MODEL`). The top prediction is matched against
a small local knowledge base to produce actionable care recommendations, and
every diagnosis is logged to `data/db.json`, scoped to the logged-in user, for
the Dashboard's history chart.

## 💬 How the AI Plant Doctor works

`backend/routes/chat.js` builds a system prompt describing PlantSathi's persona,
injects the currently identified plant/disease as context, and sends the
conversation to Groq's OpenAI-compatible chat completions endpoint
(`llama-3.1-8b-instant` by default — fast and free-tier friendly).

## 🎓 Known limitations — and why

- **lowdb (a local JSON file) isn't built for concurrent writes at scale.** Fine
  for a single-user demo or small class project; a production version would move
  to MongoDB or Postgres — genuinely easy given the storage layer is already
  isolated in `db.js`.
- **Demo-mode fallbacks mask missing API keys.** Great for a frictionless first
  run, but worth remembering during a live demo/viva that "it works" doesn't
  always mean "the real API integration is being exercised" — check your `.env`
  if you want to show off the actual PlantNet/Hugging Face/Groq calls.
- **No password reset flow yet.** A forgotten password currently has no recovery
  path — listed below as a natural next feature.
- **No rate limiting on `/api/auth/login`.** Fine for a demo; a public deployment
  would want basic brute-force protection here.

## 🗺️ Roadmap

- [ ] Swap `lowdb` for MongoDB/PostgreSQL for real concurrency
- [ ] "Forgot password" flow (email-based reset token)
- [ ] Fine-tune a custom PyTorch/ResNet50 model on the PlantVillage dataset,
      served via a small FastAPI microservice, instead of the hosted HF model
- [ ] Push/email reminders for watering schedules
- [ ] Offline-first PWA support for low-connectivity use
- [ ] Rate-limiting on `/api/auth/login`

## 👤 Author

**Gautam Raj** — [GitHub](https://github.com/GautamRaj1234)

Built as a final-year project exploring multi-API orchestration (vision, LLM,
weather), JWT auth, and shipping a full end-to-end AI product with graceful
fallbacks when external services aren't configured.

## 📄 License

Built for educational purposes as a final year project. Feel free to adapt it.
