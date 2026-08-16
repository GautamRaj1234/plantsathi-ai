# PlantSathi AI 🌱 — Your Plant's Personal Doctor

An AI-powered plant healthcare platform built as a final year project. Create an
account, upload a photo of a plant, and PlantSathi AI identifies the species, detects
diseases from the leaf, gives weather-aware care recommendations, and lets you chat
with an AI Plant Doctor for follow-up advice — all scoped to your own private account.

## ✨ Features

- **Accounts & Auth** — email/password signup and login, JWT-based sessions, passwords
  hashed with bcrypt. Each user's data is private to them.
- **Plant Identification** — species ID via the [PlantNet API](https://my.plantnet.org/)
- **AI Disease Detection** — leaf-disease classification via a Hugging Face vision model
- **AI Plant Doctor** — conversational care advice via the [Groq API](https://console.groq.com/) (Llama 3.1)
- **Weather-Based Care Tips** — live weather via [OpenWeatherMap](https://openweathermap.org/api)
- **Dashboard** — scan history chart, healthy vs. issue counts
- **My Garden** — save plants and log watering, private per account

## 🛠 Tech Stack

| Layer      | Tech                                  |
|------------|----------------------------------------|
| Frontend   | React + Vite + Tailwind CSS            |
| Backend    | Node.js + Express                      |
| Auth       | JWT (jsonwebtoken) + bcrypt password hashing |
| Storage    | lowdb (local JSON file — easy to swap for MongoDB/Postgres later) |
| AI/ML APIs | PlantNet, Hugging Face Inference Providers, Groq LLM, OpenWeatherMap |

## 📁 Project Structure

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

## 🚀 Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and add your JWT_SECRET and free API keys (see below)
npm run dev
```

The backend runs at `http://localhost:5050`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and calls the backend directly at
`http://localhost:5050/api` (not through a dev proxy — Vite's proxy has a known issue
with multipart file uploads on some Node versions, so the frontend connects straight
to the backend instead, with CORS enabled on the backend to allow it).

### 3. Open the app

Visit `http://localhost:5173` in your browser. You'll be asked to sign up / log in
before you can use the app — every plant, diagnosis, and chat is private to your account.

## 🔑 Environment Variables

Add these to `backend/.env` (copy from `.env.example` as a starting point):

| Variable | Required? | Notes |
|---|---|---|
| `PORT` | No | Defaults to 5050 |
| `JWT_SECRET` | **Yes** | A long random string used to sign login sessions. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PLANTNET_API_KEY` | No (has demo fallback) | Free tier: https://my.plantnet.org/ |
| `HUGGINGFACE_API_KEY` | No (has demo fallback) | Free token: https://huggingface.co/settings/tokens — must be a **fine-grained token with "Make calls to Inference Providers" checked** |
| `HUGGINGFACE_DISEASE_MODEL` | No | Defaults to a public plant-disease classification model |
| `GROQ_API_KEY` | No (has demo fallback) | Free key: https://console.groq.com/keys |
| `OPENWEATHER_API_KEY` | No (has demo fallback) | Free key: https://openweathermap.org/api (can take up to ~2 hours to activate after signup) |

> The app **works out of the box with demo/mock data for the AI features** even
> without any of the four external API keys, so you can run and demo the full flow
> immediately. `JWT_SECRET` is the one variable you should always set yourself —
> without it, login sessions fall back to a shared default secret, which is fine for
> local demoing but shouldn't be relied on beyond that.

> **Security note:** never commit your real `.env` file or share screenshots of it —
> `.env` is already listed in `.gitignore`. If any of your keys are ever exposed
> (e.g. shared in a screenshot or chat), regenerate them from the provider's dashboard.

## 🔐 How Authentication Works

- `backend/routes/auth.js` handles `POST /api/auth/signup` and `POST /api/auth/login`,
  hashing passwords with **bcrypt** (10 salt rounds) and issuing a **JWT** signed with
  `JWT_SECRET`, valid for 7 days.
- `backend/middleware/auth.js` verifies that JWT on every protected route
  (`/api/identify`, `/api/diagnose`, `/api/chat`, `/api/garden`) and attaches the
  user's ID to the request so data can be scoped correctly. The weather route is
  intentionally left public since it doesn't touch personal data.
- Every saved plant, diagnosis, and chat message is tagged with a `userId` and
  filtered server-side, so one account can never see another's data.
- On the frontend, `context/AuthContext.jsx` stores the token in `localStorage` and
  restores the session on page reload by calling `GET /api/auth/me`.

## 🧠 How Disease Detection Works

`backend/routes/diagnose.js` sends the uploaded image to Hugging Face's **Inference
Providers** API (`router.huggingface.co/hf-inference/...`) running a plant-disease
image classification model (`linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`
by default — swappable via `HUGGINGFACE_DISEASE_MODEL` in `.env`). The top prediction
is matched against a small local knowledge base to produce actionable care
recommendations, and every diagnosis is logged to `data/db.json`, scoped to the
logged-in user, for the Dashboard's history chart.

## 💬 How the AI Plant Doctor Works

`backend/routes/chat.js` builds a system prompt describing PlantSathi's persona,
injects the currently identified plant/disease as context, and sends the conversation
to Groq's OpenAI-compatible chat completions endpoint (`llama-3.1-8b-instant` by
default — fast and free-tier friendly).

## 📦 Suggested Extensions (great for a viva/project defense)

- Swap `lowdb` for MongoDB/PostgreSQL for better concurrency at scale
- Add a "forgot password" flow (email-based reset token)
- Fine-tune your own PyTorch/ResNet50 model on the PlantVillage dataset and serve it
  via a small FastAPI microservice instead of the Hugging Face hosted API
- Add push/email reminders for watering schedules
- Add offline-first PWA support for farmers with limited connectivity
- Add rate-limiting on `/api/auth/login` to slow down brute-force attempts

## 📄 License

Built for educational purposes as a final year project. Feel free to adapt it.
