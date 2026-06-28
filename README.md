# 🦸 Community Hero — Hyperlocal Problem Solver

Full-stack civic issue tracking platform for Delhi NCR.
**React + Tailwind CSS frontend · Python Flask backend · Free AI (Groq + HuggingFace)**

---

## 📁 Project Structure

```
community-hero/
├── frontend/          ← React + Tailwind app
│   └── src/
│       ├── components/   Sidebar, StatCard, IssueCard
│       ├── pages/        Dashboard, Issues, ReportIssue, Verify, MapView, Leaderboard, AIInsights, AIChat
│       └── utils/        api.js, helpers.js
└── backend/           ← Python Flask API
    ├── app.py
    └── requirements.txt
```

---

## 🚀 Quick Start

### Step 1 — Get FREE AI API Keys (2 minutes)

#### Groq (Free LLM — LLaMA3)
1. Go to https://console.groq.com
2. Sign up → API Keys → Create key
3. Copy your key

#### HuggingFace (Free Image AI)
1. Go to https://huggingface.co/settings/tokens
2. New token → Read → Copy

---

### Step 2 — Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env → paste your GROQ_API_KEY and HF_API_TOKEN

pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

---

## 🤖 Free AI Features

| Feature | AI Used | Cost |
|---------|---------|------|
| Image categorization | HuggingFace ViT | Free |
| Predictive insights | Groq LLaMA3-8B | Free |
| AI civic assistant chat | Groq LLaMA3-8B | Free |
| Issue summarization | Groq LLaMA3-8B | Free |

Both run in **demo/fallback mode** without API keys — safe to demo!

---

## ✨ Features

- 📊 **Dashboard** — Live stats, charts, recent issues
- 📝 **Report Issue** — Upload photo → AI auto-categorizes (HuggingFace)
- ✅ **Community Verify** — Vote to verify issues, earn XP
- 🗺️ **Map View** — Leaflet heatmap of all issues
- 🏆 **Leaderboard** — Gamified citizen rankings + achievements
- 🧠 **AI Insights** — Groq LLaMA3 predictive analysis
- 💬 **AI Chat** — Civic assistant (Groq LLaMA3, Hindi/English)

---

## 🔌 API Endpoints

```
GET  /api/health
GET  /api/issues              → list all issues
POST /api/issues              → create issue
POST /api/issues/:id/vote     → verify/vote
POST /api/issues/:id/resolve  → mark resolved
GET  /api/stats               → dashboard stats
GET  /api/leaderboard         → citizen rankings
GET  /api/map/heatmap         → map data points

POST /api/ai/categorize-image → HuggingFace image AI
GET  /api/ai/insights         → Groq predictive insights
POST /api/ai/chat             → Groq civic chatbot
POST /api/ai/summarize        → Groq issue summary
```

---

## 🏗️ Tech Stack

**Frontend:** React 18, Tailwind CSS 3, Recharts, React-Leaflet, Axios, Lucide Icons, React Hot Toast

**Backend:** Python 3.10+, Flask, Flask-CORS, Requests

**AI (Free):**
- [Groq](https://console.groq.com) — LLaMA3-8B (free tier, very fast)
- [HuggingFace](https://huggingface.co) — ViT image classification (free)

---

Built for Smart India Hackathon / Community problem-solving challenges.
