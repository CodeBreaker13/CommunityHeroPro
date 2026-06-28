import React, { useState, useRef } from "react";
import { Upload, Brain, MapPin, Send, X, CheckCircle, Loader } from "lucide-react";
import { createIssue, categorizeImage } from "../utils/api";
import { toBase64, categoryIcon } from "../utils/helpers";
import toast from "react-hot-toast";

const CATEGORIES = ["Roads & Potholes","Water & Sewage","Electricity","Waste Management","Public Safety","Other"];
const SEVERITIES = ["Low","Medium","High","Critical"];

const SectionHead = ({ children }) => <div className="sec-heading" style={{ marginBottom:8 }}>{children}</div>;

export default function ReportIssue({ onNavigate }) {
  const fileRef = useRef();
  const [form, setForm] = useState({ title:"", category:"", severity:"Medium", location:"", description:"", reporter:"" });
  const [imagePreview, setImagePreview] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const b64 = await toBase64(file); setImagePreview(b64); setAiResult(null);
    setAiLoading(true);
    try {
      const res = await categorizeImage(b64);
      setAiResult(res.data);
      setForm(f => ({ ...f, category: res.data.category||f.category, severity: res.data.severity||f.severity }));
      toast.success(`AI: ${res.data.category}`);
    } catch { toast("AI unavailable — fill manually", { icon:"ℹ️" }); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) { toast.error("Title and location required"); return; }
    setSubmitting(true);
    try {
      await createIssue({ ...form, image_url: imagePreview, ai_tags: aiResult?.ai_tags||[], lat: 28.6139+(Math.random()-.5)*.2, lng: 77.209+(Math.random()-.5)*.2 });
      setSubmitted(true); toast.success("Issue reported! +50 XP");
    } catch { toast.error("Failed to submit"); } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px', gap:16 }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.15)', border:'2px solid rgba(34,197,94,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <CheckCircle size={36} color="#22c55e"/>
      </div>
      <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase' }}>Issue Reported!</div>
      <div style={{ fontSize:13, color:'#C9A96E', textAlign:'center' }}>Community will verify soon. Earned <strong style={{ color:'#22c55e' }}>+50 XP</strong></div>
      <div style={{ display:'flex', gap:10 }}>
        <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ title:"",category:"",severity:"Medium",location:"",description:"",reporter:"" }); setImagePreview(null); setAiResult(null); }}>Report Another</button>
        <button className="btn-primary" onClick={() => onNavigate("issues")}>View All Issues</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>Report an Issue</div>
        <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>UPLOAD_PHOTO → AI_CATEGORIZE → SUBMIT</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {/* AI Upload */}
        <div className="card">
          <SectionHead>AI Image Analysis · HuggingFace ViT (Free)</SectionHead>
          {!imagePreview ? (
            <div onClick={() => fileRef.current.click()}
              style={{ border:'1.5px dashed rgba(230,92,0,0.35)', borderRadius:12, padding:32, textAlign:'center', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(230,92,0,0.06)'; e.currentTarget.style.borderColor='rgba(230,92,0,0.6)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.borderColor='rgba(230,92,0,0.35)'; }}>
              <Upload size={28} color="#E65C00" style={{ margin:'0 auto 10px', display:'block' }}/>
              <div style={{ fontSize:13, color:'#C9A96E', fontWeight:500 }}>Click to upload photo or video</div>
              <div style={{ fontSize:11, color:'#7a6540', marginTop:4 }}>AI will auto-detect category, severity & department</div>
            </div>
          ) : (
            <div>
              <div style={{ position:'relative' }}>
                <img src={imagePreview} alt="Issue" style={{ width:'100%', height:180, objectFit:'cover', borderRadius:10 }}/>
                <button type="button" onClick={() => { setImagePreview(null); setAiResult(null); fileRef.current.value=""; }}
                  style={{ position:'absolute', top:8, right:8, width:26, height:26, borderRadius:'50%', background:'rgba(0,0,0,0.7)', border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={13}/>
                </button>
              </div>
              {aiLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, padding:'8px 12px', background:'rgba(230,92,0,0.08)', borderRadius:8, border:'1px solid rgba(230,92,0,0.2)' }}>
                  <Loader size={14} color="#E65C00" style={{ animation:'spin 1s linear infinite' }}/>
                  <span style={{ fontSize:12, color:'#fb923c' }}>HuggingFace AI analyzing image…</span>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}
              {aiResult && (
                <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(34,197,94,0.08)', borderRadius:10, border:'1px solid rgba(34,197,94,0.2)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <Brain size={13} color="#22c55e"/>
                    <span style={{ fontSize:11, fontWeight:500, color:'#4ade80', fontFamily:'monospace' }}>AI_RESULT · {aiResult.source} · {aiResult.confidence}% conf</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#F5EDD6' }}>{categoryIcon(aiResult.category)} {aiResult.category} · {aiResult.severity} priority</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>
                    {aiResult.ai_tags?.map(tag => <span key={tag} style={{ fontSize:10, background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)', padding:'2px 8px', borderRadius:8 }}>{tag}</span>)}
                  </div>
                  {aiResult.note && <p style={{ fontSize:10, color:'#7a6540', marginTop:6 }}>{aiResult.note}</p>}
                </div>
              )}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:'none' }} onChange={handleFile}/>
        </div>

        {/* Form */}
        <div className="card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <SectionHead>Issue Parameters</SectionHead>
          <div>
            <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>ISSUE_TITLE *</label>
            <input className="input" placeholder="Brief description…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>CATEGORY</label>
              <select className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                <option value="">Select…</option>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>SEVERITY</label>
              <select className="input" value={form.severity} onChange={e=>setForm(f=>({...f,severity:e.target.value}))}>
                {SEVERITIES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>LOCATION *</label>
            <div style={{ position:'relative' }}>
              <MapPin size={13} color="#E65C00" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
              <input className="input" style={{ paddingLeft:30 }} placeholder="Area, street, landmark…" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
            </div>
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>REPORTER_NAME</label>
            <input className="input" placeholder="Anonymous" value={form.reporter} onChange={e=>setForm(f=>({...f,reporter:e.target.value}))}/>
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, color:'#7a6540', marginBottom:5, fontFamily:'monospace' }}>DESCRIPTION</label>
            <textarea className="input" rows={3} placeholder="Describe the issue…" style={{ resize:'none' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary" style={{ width:'100%', opacity:submitting?.7:1 }}>
            {submitting ? <><Loader size={14} style={{ animation:'spin 1s linear infinite' }}/> Injecting…</> : <><Send size={14}/> Inject Issue Into System</>}
          </button>
        </div>
      </form>
    </div>
  );
}
