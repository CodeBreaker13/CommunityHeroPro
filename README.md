Community Hero — Hyperlocal Problem Solver

A full-stack civic issue tracking platform built for Delhi NCR, enabling citizens to identify, report, validate, track, and resolve community issues through collaboration, data, and intelligent automation.

1. Background

Communities frequently face issues such as potholes, water leakages, damaged streetlights, waste management concerns, and public infrastructure challenges. Reporting these issues is often fragmented across phone calls, scattered social media posts, and disconnected government portals — with no shared visibility, no way to verify a report's authenticity, and no transparency into whether anything actually gets fixed.

Community Hero solves this by giving every citizen, in one place, a way to report an issue, have it verified by neighbors, watch it move through a resolution pipeline, and see the collective impact of their community's civic participation — all reinforced by free AI models for categorization, prediction, and assistance.

2. Challenge addressed

The brief asked for a platform that lets citizens identify, report, validate, track, and resolve community issues, while encouraging transparency, accountability, and community participation. Community Hero is built directly around this five-step lifecycle:

Lifecycle stageHow Community Hero implements itIdentifyCitizens browse the live map and issue feed to see what's already known, avoiding duplicate reportsReportA guided report form with photo upload, AI auto-categorization, and geo-taggingValidateOther citizens vote to verify a report is genuine before it's treated as confirmedTrackEvery issue carries a status (Open → In Progress → Resolved) visible to everyoneResolveStatus updates close the loop, feeding back into dashboard stats and citizen XP

3. Feature breakdown

3.1 Image-based issue reporting

The Report Issue page accepts a photo of the problem. The image is sent to the backend's /api/ai/categorize-image endpoint, which calls a HuggingFace Vision Transformer (ViT) model to classify the image content and automatically suggest the right category, severity, and department tags — removing the burden of manual classification from the citizen.

3.2 AI-powered issue categorization

Beyond images, every issue is mapped to a category (Roads & Potholes, Water & Sewage, Electricity, Waste Management, Public Safety) along with a severity level and a set of AI-generated tags (for example, "MCD Action Required", "Delhi Jal Board", "Immediate Action"). This mapping logic lives in the backend (map_to_issue_category) and translates raw model output into actionable civic labels.

3.3 Geo-location and mapping

Each issue carries latitude and longitude. The Map View page renders these as a heatmap across Delhi NCR (via the /api/map/heatmap endpoint), so citizens and administrators can immediately see where problems are clustering — useful for prioritizing limited civic resources.

3.4 Community verification

The Verify page lets citizens vote on issues reported by others. A report moves from "Open" toward "In Progress" as votes accumulate, building a layer of social proof before any civic body needs to act — reducing false reports and prioritizing issues the community actually cares about.

3.5 Real-time issue tracking

Every issue has a transparent status field (Open, In Progress, Resolved) and a timestamp trail. The All Issues page lists every report with filters by status and category, so nothing disappears into a black hole after submission.

3.6 Impact dashboards

The Dashboard page surfaces the metrics that matter: total issues, resolution rate, average resolution time, active citizen count, a category breakdown, and a month-by-month resolution trend — giving both citizens and administrators a fast read on whether the system is actually working.

3.7 Predictive insights

The AI Insights page calls Groq's LLaMA3 model with current issue statistics and asks it to generate forward-looking insights — for example, flagging that pothole reports in a certain area typically spike before monsoon season, or that an aging water pipeline is likely to generate more leakage complaints. This shifts the platform from purely reactive reporting to proactive civic planning.

3.8 Gamification for citizen engagement

Every citizen has a profile with an XP score and a badge tier (Activist → Hero → Champion → Legend), earned through reporting and verifying issues. The Leaderboard page ranks the most active citizens, encouraging sustained participation rather than a single one-off report.

3.9 AI civic assistant

A chat interface (AI Assistant page) lets citizens ask questions in Hindi or English — "MCD complaint number kya hai?", "How do I report a water leak?" — and get a direct answer, powered by Groq LLaMA3 with a system prompt tuned for Delhi NCR civic processes (MCD, Delhi Jal Board, BSES, PWD).

4. How this demonstrates AI helping communities

The evaluation focus asks specifically how AI improves reporting, verification, tracking, and resolution. Community Hero's AI layer is deliberately scoped to those four points rather than being decorative:

Reporting is faster and more accurate because image classification removes manual categorization guesswork.
Verification is supported by AI tags that give human verifiers extra context (for example, confidence score and detected label) before they vote.
Tracking benefits from AI-summarized issue descriptions (/api/ai/summarize) that condense a report into a one-line summary, suggested department, and estimated resolution time — useful for anyone triaging a long issue queue.
Resolution is informed by predictive insights that help civic bodies act before a problem becomes widespread, not just after it's reported.

Every AI feature is also designed to never block the platform. If no API key is configured, each endpoint degrades to a clearly-labeled demo response rather than failing — so the system is judged on its design and logic, not on whether a third-party API key happens to be present.

5. Tech stack

Frontend — React 18, Tailwind CSS 3, Recharts, React-Leaflet, Axios, Lucide Icons, React Hot Toast

Backend — Python 3.10+, Flask, Flask-CORS, Requests

AI (free tier)

Groq — LLaMA3-8B for chat, predictive insights, and summarization
HuggingFace — ViT model for image-based issue categorization

6. Project structure

community-hero/
├── backend/
│ ├── app.py Flask API — routes, AI integration, in-memory data store
│ ├── requirements.txt
│ └── .env.example
└── frontend/
├── public/
└── src/
├── components/ Sidebar, StatCard, IssueCard, Ticker
├── pages/ Dashboard, Issues, ReportIssue, Verify, MapView, Leaderboard, AIInsights, AIChat
└── utils/ api.js, helpers.js

7. Getting started

Clone the repository

git clone https://github.com/<your-username>/community-hero.git
cd community-hero

Backend setup

cd backend
cp .env.example .env
pip install -r requirements.txt
python app.py

Runs on http://localhost:5000

Frontend setup

Open a second terminal:

cd frontend
npm install
npm start

Runs on http://localhost:3000

Adding free AI keys (optional)

Edit backend/.env:

GROQ_API_KEY=your_groq_key_here
HF_API_TOKEN=your_huggingface_token_here

Groq keys are free at console.groq.com
HuggingFace tokens are free at huggingface.co/settings/tokens

The platform runs fully in demo mode without these — every AI endpoint has a static fallback.

8. API reference

MethodEndpointPurposeGET/api/healthHealth checkGET/api/issuesList issues, filterable by status and categoryGET/api/issues/:idFetch a single issuePOST/api/issuesCreate a new issuePOST/api/issues/:id/voteVerify or upvote an issuePOST/api/issues/:id/resolveMark an issue resolvedGET/api/statsDashboard-level statisticsGET/api/leaderboardCitizen XP rankingsGET/api/map/heatmapGeo-tagged issue points for the mapPOST/api/ai/categorize-imageHuggingFace image classificationGET/api/ai/insightsGroq-generated predictive insightsPOST/api/ai/chatGroq-powered civic assistant chatPOST/api/ai/summarizeAI-generated issue summary and priority score

9. Security note

backend/.env is excluded from version control via .gitignore. Only .env.example, containing placeholder values, is committed. Real API keys should never be committed or share it.
