from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import requests
import json
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# ─── FREE AI CONFIG ───────────────────────────────────────────────────────────
# Groq (FREE) - https://console.groq.com → get free API key
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "your_groq_api_key_here")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"  # Free model on Groq

# Hugging Face (FREE) - https://huggingface.co/settings/tokens → get free token
HF_TOKEN = os.environ.get("HF_API_TOKEN", "your_hf_token_here")
HF_IMG_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"

# ─── IN-MEMORY DB (replace with SQLite/Postgres in prod) ─────────────────────
issues_db = [
    {
        "id": "1",
        "title": "Large pothole on Ring Road",
        "category": "Roads & Potholes",
        "severity": "Critical",
        "status": "Open",
        "location": "Rohini Sector 7, Delhi",
        "lat": 28.7041,
        "lng": 77.1025,
        "description": "Very large pothole causing accidents near the bus stop.",
        "reporter": "Priya Kapoor",
        "votes": 14,
        "timestamp": "2024-01-15T10:30:00",
        "image_url": None,
        "ai_tags": ["Road Damage", "High Priority", "MCD Action Required"]
    },
    {
        "id": "2",
        "title": "Water pipeline leakage",
        "category": "Water & Sewage",
        "severity": "High",
        "status": "In Progress",
        "location": "Dwarka Sector 12, Delhi",
        "lat": 28.5921,
        "lng": 77.0460,
        "description": "Continuous water leakage wasting thousands of litres daily.",
        "reporter": "Rahul Sharma",
        "votes": 9,
        "timestamp": "2024-01-15T07:00:00",
        "image_url": None,
        "ai_tags": ["Water Leakage", "Urgent", "Delhi Jal Board"]
    },
    {
        "id": "3",
        "title": "Streetlight not working",
        "category": "Electricity",
        "severity": "Medium",
        "status": "Open",
        "location": "Saket Block C, Delhi",
        "lat": 28.5274,
        "lng": 77.2167,
        "description": "Three consecutive streetlights non-functional since 2 weeks.",
        "reporter": "Anjali Mehta",
        "votes": 6,
        "timestamp": "2024-01-14T20:00:00",
        "image_url": None,
        "ai_tags": ["Electricity", "BSES", "Safety Concern"]
    },
    {
        "id": "4",
        "title": "Garbage dump overflowing",
        "category": "Waste Management",
        "severity": "High",
        "status": "Resolved",
        "location": "Karol Bagh, Delhi",
        "lat": 28.6519,
        "lng": 77.1905,
        "description": "Community dustbin overflowing, causing hygiene issues.",
        "reporter": "Deepak Verma",
        "votes": 21,
        "timestamp": "2024-01-13T09:00:00",
        "image_url": None,
        "ai_tags": ["Waste Management", "Health Hazard", "MCD"]
    },
    {
        "id": "5",
        "title": "Open manhole near school",
        "category": "Public Safety",
        "severity": "Critical",
        "status": "Open",
        "location": "Pitampura, Delhi",
        "lat": 28.7060,
        "lng": 77.1304,
        "description": "Open manhole near primary school, dangerous for children.",
        "reporter": "Sneha Gupta",
        "votes": 33,
        "timestamp": "2024-01-15T12:00:00",
        "image_url": None,
        "ai_tags": ["Public Safety", "Critical", "Immediate Action"]
    }
]

citizens_db = [
    {"id": "u1", "name": "Priya Kapoor", "area": "Rohini", "reports": 47, "verifications": 230, "xp": 9400, "badge": "Legend"},
    {"id": "u2", "name": "Rahul Sharma", "area": "Dwarka", "reports": 38, "verifications": 178, "xp": 7800, "badge": "Champion"},
    {"id": "u3", "name": "Anjali Mehta", "area": "Saket", "reports": 29, "verifications": 142, "xp": 6200, "badge": "Hero"},
    {"id": "u4", "name": "Deepak Verma", "area": "Karol Bagh", "reports": 21, "verifications": 99, "xp": 4400, "badge": "Activist"},
    {"id": "u5", "name": "Sneha Gupta", "area": "Noida", "reports": 17, "verifications": 81, "xp": 3300, "badge": "Activist"},
]

# ─── HELPERS ─────────────────────────────────────────────────────────────────
def call_groq(system_prompt, user_message, max_tokens=500):
    """Call Groq's free LLM API."""
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
        return None, "GROQ_API_KEY not set"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.4
    }
    try:
        r = requests.post(GROQ_URL, headers=headers, json=body, timeout=15)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"], None
    except Exception as e:
        return None, str(e)


def classify_image_hf(image_bytes):
    """Call HuggingFace ViT image classification (free)."""
    if not HF_TOKEN or HF_TOKEN == "your_hf_token_here":
        return None, "HF_API_TOKEN not set"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    try:
        r = requests.post(HF_IMG_URL, headers=headers, data=image_bytes, timeout=20)
        r.raise_for_status()
        return r.json(), None
    except Exception as e:
        return None, str(e)


def map_to_issue_category(hf_labels):
    """Map HuggingFace image labels to community issue categories."""
    label_str = " ".join([item.get("label", "").lower() for item in hf_labels[:3]])
    if any(w in label_str for w in ["street", "road", "highway", "asphalt", "traffic"]):
        return "Roads & Potholes", "High", ["Road Damage", "MCD Action Required"]
    if any(w in label_str for w in ["water", "pipe", "drain", "flood", "puddle"]):
        return "Water & Sewage", "High", ["Water Issue", "Delhi Jal Board"]
    if any(w in label_str for w in ["light", "electric", "wire", "pole", "lamp"]):
        return "Electricity", "Medium", ["Electricity Issue", "BSES"]
    if any(w in label_str for w in ["garbage", "trash", "waste", "dump", "litter"]):
        return "Waste Management", "High", ["Waste", "Sanitation Dept"]
    if any(w in label_str for w in ["construction", "building", "hole", "pit"]):
        return "Public Safety", "Critical", ["Safety Hazard", "Immediate Action"]
    return "Other", "Medium", ["Community Issue"]


# ─── ROUTES ───────────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


# ── Issues ──────────────────────────────────────────────────────────────────

@app.route("/api/issues", methods=["GET"])
def get_issues():
    status = request.args.get("status")
    category = request.args.get("category")
    data = issues_db
    if status:
        data = [i for i in data if i["status"].lower() == status.lower()]
    if category:
        data = [i for i in data if i["category"].lower() == category.lower()]
    return jsonify({"issues": data, "total": len(data)})


@app.route("/api/issues/<issue_id>", methods=["GET"])
def get_issue(issue_id):
    issue = next((i for i in issues_db if i["id"] == issue_id), None)
    if not issue:
        return jsonify({"error": "Not found"}), 404
    return jsonify(issue)


@app.route("/api/issues", methods=["POST"])
def create_issue():
    data = request.json
    new_issue = {
        "id": str(uuid.uuid4())[:8],
        "title": data.get("title", "Untitled"),
        "category": data.get("category", "Other"),
        "severity": data.get("severity", "Medium"),
        "status": "Open",
        "location": data.get("location", "Unknown"),
        "lat": data.get("lat", 28.6139),
        "lng": data.get("lng", 77.2090),
        "description": data.get("description", ""),
        "reporter": data.get("reporter", "Anonymous"),
        "votes": 0,
        "timestamp": datetime.now().isoformat(),
        "image_url": data.get("image_url"),
        "ai_tags": data.get("ai_tags", [])
    }
    issues_db.insert(0, new_issue)
    return jsonify(new_issue), 201


@app.route("/api/issues/<issue_id>/vote", methods=["POST"])
def vote_issue(issue_id):
    issue = next((i for i in issues_db if i["id"] == issue_id), None)
    if not issue:
        return jsonify({"error": "Not found"}), 404
    issue["votes"] += 1
    if issue["votes"] >= 10 and issue["status"] == "Open":
        issue["status"] = "In Progress"
    return jsonify({"votes": issue["votes"], "status": issue["status"]})


@app.route("/api/issues/<issue_id>/resolve", methods=["POST"])
def resolve_issue(issue_id):
    issue = next((i for i in issues_db if i["id"] == issue_id), None)
    if not issue:
        return jsonify({"error": "Not found"}), 404
    issue["status"] = "Resolved"
    return jsonify({"status": "Resolved"})


# ── AI: Image Categorization (HuggingFace free) ─────────────────────────────

@app.route("/api/ai/categorize-image", methods=["POST"])
def categorize_image():
    """Accept base64 image, classify with HF ViT, return community category."""
    data = request.json
    b64 = data.get("image_base64", "")
    if not b64:
        return jsonify({"error": "No image provided"}), 400

    # Decode base64
    try:
        if "," in b64:
            b64 = b64.split(",")[1]
        image_bytes = base64.b64decode(b64)
    except Exception:
        return jsonify({"error": "Invalid base64 image"}), 400

    # Try HuggingFace
    hf_result, err = classify_image_hf(image_bytes)
    if hf_result:
        category, severity, tags = map_to_issue_category(hf_result)
        top_label = hf_result[0].get("label", "Unknown") if hf_result else "Unknown"
        confidence = round(hf_result[0].get("score", 0) * 100, 1) if hf_result else 0
        return jsonify({
            "category": category,
            "severity": severity,
            "ai_tags": tags,
            "raw_label": top_label,
            "confidence": confidence,
            "source": "HuggingFace ViT"
        })

    # Fallback: no API key set — return smart mock
    return jsonify({
        "category": "Roads & Potholes",
        "severity": "High",
        "ai_tags": ["Road Damage", "MCD Action Required", "High Priority"],
        "raw_label": "street (demo mode)",
        "confidence": 85.0,
        "source": "demo",
        "note": f"Set HF_API_TOKEN env var for real AI. Error: {err}"
    })


# ── AI: Text Insights (Groq free LLM) ────────────────────────────────────────

@app.route("/api/ai/insights", methods=["GET"])
def get_ai_insights():
    """Generate predictive insights using Groq (free LLaMA3)."""
    stats = {
        "total": len(issues_db),
        "open": sum(1 for i in issues_db if i["status"] == "Open"),
        "in_progress": sum(1 for i in issues_db if i["status"] == "In Progress"),
        "resolved": sum(1 for i in issues_db if i["status"] == "Resolved"),
        "categories": {}
    }
    for issue in issues_db:
        c = issue["category"]
        stats["categories"][c] = stats["categories"].get(c, 0) + 1

    system = (
        "You are an AI assistant for a community issue tracking platform in Delhi, India. "
        "Analyze issue data and give 3 short predictive insights in JSON format only. "
        "Each insight has: title, description, risk_level (High/Medium/Low), category, action. "
        "Return ONLY a JSON array, no markdown, no explanation."
    )
    user = f"Issue stats: {json.dumps(stats)}. Generate 3 predictive insights for community action."

    result, err = call_groq(system, user, max_tokens=600)
    if result:
        try:
            cleaned = result.strip().lstrip("```json").rstrip("```").strip()
            insights = json.loads(cleaned)
            return jsonify({"insights": insights, "source": "Groq LLaMA3"})
        except Exception:
            pass

    # Fallback static insights
    return jsonify({
        "insights": [
            {
                "title": "Monsoon pothole surge expected",
                "description": "Road damage reports typically spike 3× in Rohini & Pitampura in July. Preventive patching recommended.",
                "risk_level": "High",
                "category": "Roads & Potholes",
                "action": "Schedule preventive road repairs before monsoon"
            },
            {
                "title": "Water pipeline aging — Dwarka Sector 6-9",
                "description": "Pipeline infrastructure averages 18+ years. Proactive replacement could prevent 60+ leakage reports.",
                "risk_level": "Medium",
                "category": "Water & Sewage",
                "action": "Commission pipeline audit for Dwarka sectors"
            },
            {
                "title": "Festive season waste surge approaching",
                "description": "AI predicts 2.4× waste volume in Karol Bagh during Diwali. Pre-scheduling extra sanitation rounds advised.",
                "risk_level": "Medium",
                "category": "Waste Management",
                "action": "Pre-deploy additional sanitation resources"
            }
        ],
        "source": "static",
        "note": f"Set GROQ_API_KEY env var for live AI insights. Error: {err}"
    })


@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    """General community assistant chat powered by Groq (free)."""
    data = request.json
    user_msg = data.get("message", "")
    if not user_msg:
        return jsonify({"error": "No message"}), 400

    system = (
        "You are Community Hero AI, an assistant for citizens of Delhi NCR, India. "
        "Help with: reporting civic issues, understanding local government processes, "
        "MCD (Municipal Corporation of Delhi) contacts, Delhi Jal Board, BSES electricity, "
        "PWD road complaints, sanitation. Be concise, helpful, in English or Hindi as needed. "
        "Keep responses under 150 words."
    )
    result, err = call_groq(system, user_msg, max_tokens=300)
    if result:
        return jsonify({"reply": result, "source": "Groq LLaMA3"})

    return jsonify({
        "reply": "AI assistant is in demo mode. Set your GROQ_API_KEY to enable live responses. For now: To report a road issue, use the Report tab and select 'Roads & Potholes'. For water complaints, contact Delhi Jal Board at 1916.",
        "source": "demo",
        "note": err
    })


@app.route("/api/ai/summarize", methods=["POST"])
def summarize_issue():
    """Summarize and suggest action for an issue using Groq."""
    data = request.json
    issue = data.get("issue", {})

    system = (
        "You are a civic AI. Given a community issue, output a JSON with: "
        "summary (1 sentence), suggested_department, estimated_days, priority_score (1-10), "
        "citizen_tip. Return ONLY JSON, no markdown."
    )
    user = f"Issue: {json.dumps(issue)}"

    result, err = call_groq(system, user, max_tokens=300)
    if result:
        try:
            cleaned = result.strip().lstrip("```json").rstrip("```").strip()
            return jsonify(json.loads(cleaned))
        except Exception:
            pass

    return jsonify({
        "summary": f"Community reported: {issue.get('title', 'Issue')}",
        "suggested_department": "MCD",
        "estimated_days": 5,
        "priority_score": 7,
        "citizen_tip": "Follow up after 48 hours if no response.",
        "source": "demo"
    })


# ── Stats & Leaderboard ──────────────────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
def get_stats():
    total = len(issues_db)
    resolved = sum(1 for i in issues_db if i["status"] == "Resolved")
    in_progress = sum(1 for i in issues_db if i["status"] == "In Progress")
    open_c = sum(1 for i in issues_db if i["status"] == "Open")

    by_category = {}
    by_severity = {}
    for issue in issues_db:
        c = issue["category"]
        s = issue["severity"]
        by_category[c] = by_category.get(c, 0) + 1
        by_severity[s] = by_severity.get(s, 0) + 1

    return jsonify({
        "total": total,
        "resolved": resolved,
        "in_progress": in_progress,
        "open": open_c,
        "resolution_rate": round((resolved / total * 100) if total else 0, 1),
        "by_category": by_category,
        "by_severity": by_severity,
        "active_citizens": 3847
    })


@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    sorted_citizens = sorted(citizens_db, key=lambda x: x["xp"], reverse=True)
    return jsonify({"leaderboard": sorted_citizens})


@app.route("/api/map/heatmap", methods=["GET"])
def get_heatmap():
    points = [
        {"lat": i["lat"], "lng": i["lng"],
         "title": i["title"], "severity": i["severity"],
         "status": i["status"], "id": i["id"]}
        for i in issues_db
    ]
    return jsonify({"points": points})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
