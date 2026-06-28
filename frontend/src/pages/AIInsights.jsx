import React, { useEffect, useState } from "react";
import { Brain, AlertTriangle, TrendingUp, RefreshCw, Zap } from "lucide-react";
import { getAIInsights } from "../utils/api";
import toast from "react-hot-toast";

const RISK = {
  High:     { border:'#ef4444', chip:'rgba(220,60,60,0.15)', chipTx:'#f87171', icon:'🔴' },
  Medium:   { border:'#E65C00', chip:'rgba(230,92,0,0.15)',  chipTx:'#fb923c', icon:'🟡' },
  Low:      { border:'#22c55e', chip:'rgba(34,197,94,0.12)', chipTx:'#4ade80', icon:'🟢' },
  Positive: { border:'#22c55e', chip:'rgba(34,197,94,0.12)', chipTx:'#4ade80', icon:'✅' },
};

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAIInsights().then(r => { setInsights(r.data.insights); setSource(r.data.source); })
      .catch(() => toast.error("Failed to load insights"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em', display:'flex', alignItems:'center', gap:8 }}>
            <Brain size={20} color="#E65C00"/> AI Insights Engine
          </div>
          <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>
            MODEL: {source === "Groq LLaMA3" ? "GROQ_LLAMA3_8B (FREE)" : "STATIC_FALLBACK — SET GROQ_API_KEY"}
          </div>
        </div>
        <button onClick={load} disabled={loading} className="btn-outline" style={{ fontSize:11 }}>
          <RefreshCw size={13} style={{ animation:loading?'spin 1s linear infinite':'' }}/> Refresh
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </div>

      {/* Source status */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:10, border:`1px solid ${source==="Groq LLaMA3"?'rgba(34,197,94,0.3)':'rgba(230,92,0,0.3)'}`, background:`${source==="Groq LLaMA3"?'rgba(34,197,94,0.06)':'rgba(230,92,0,0.06)'}` }}>
        <Zap size={13} color={source==="Groq LLaMA3"?'#22c55e':'#E65C00'}/>
        <span style={{ fontSize:11, color:source==="Groq LLaMA3"?'#4ade80':'#fb923c', fontFamily:'monospace' }}>
          {source==="Groq LLaMA3" ? "LIVE · Groq LLaMA3-8B free tier active" : "DEMO_MODE · Add GROQ_API_KEY in backend/.env for live AI"}
        </span>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:60, gap:12 }}>
          <div style={{ width:40, height:40, border:'3px solid rgba(230,92,0,0.2)', borderTopColor:'#E65C00', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontSize:12, color:'#7a6540', fontFamily:'monospace' }}>AI_ANALYZING_COMMUNITY_PATTERNS…</span>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {insights.map((insight, i) => {
            const r = RISK[insight.risk_level] || RISK.Medium;
            return (
              <div key={i} style={{ borderRadius:12, padding:'14px 16px', background:'rgba(20,18,9,0.92)', border:'1px solid rgba(230,92,0,0.15)', borderLeft:`3px solid ${r.border}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:16 }}>{r.icon}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:'#F5EDD6' }}>{insight.title}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#C9A96E', lineHeight:1.6 }}>{insight.description}</p>
                    {insight.action && (
                      <div style={{ marginTop:10, display:'flex', alignItems:'flex-start', gap:6, padding:'8px 10px', background:'rgba(255,255,255,0.04)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
                        <TrendingUp size={12} color="#E65C00" style={{ marginTop:1, flexShrink:0 }}/>
                        <span style={{ fontSize:11, color:'#C9A96E' }}><strong style={{ color:'#FF8C00' }}>ACTION:</strong> {insight.action}</span>
                      </div>
                    )}
                    {insight.category && (
                      <div style={{ marginTop:6, fontSize:10, color:'#7a6540', fontFamily:'monospace', display:'flex', alignItems:'center', gap:4 }}>
                        <AlertTriangle size={10}/> CATEGORY: {insight.category.toUpperCase().replace(/[& ]/g,'_')}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize:10, padding:'3px 10px', borderRadius:10, background:r.chip, color:r.chipTx, border:`1px solid ${r.border}30`, fontFamily:'monospace', flexShrink:0 }}>
                    {insight.risk_level?.toUpperCase()}_RISK
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How it works */}
      <div className="card-accent" style={{ marginTop:4 }}>
        <div className="sec-heading" style={{ marginBottom:10 }}>How AI Engine Works</div>
        {[
          ["01", "Issue data analyzed for patterns by category, zone, and time"],
          ["02", "Groq LLaMA3-8B (free) generates predictive insights from trends"],
          ["03", "HuggingFace ViT classifies uploaded images to auto-detect issue type"],
          ["04", "Insights help civic bodies allocate resources proactively"],
        ].map(([num, text]) => (
          <div key={num} style={{ display:'flex', gap:10, marginBottom:8 }}>
            <span style={{ fontSize:11, fontFamily:'monospace', color:'#E65C00', flexShrink:0 }}>{num}</span>
            <span style={{ fontSize:12, color:'#C9A96E', lineHeight:1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
