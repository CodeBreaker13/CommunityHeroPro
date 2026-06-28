import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader, Zap } from "lucide-react";
import { aiChat } from "../utils/api";

const SUGGESTIONS = [
  "Pothole kaise report karein?",
  "MCD complaint number kya hai?",
  "Water supply issue Delhi Jal Board?",
  "How to escalate unresolved issue?",
  "BSES electricity complaint process?",
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role:"ai", text:"Namaste! 🙏 Main Community Hero AI hoon — Delhi NCR ka civic assistant. Road, water, electricity ya kisi bhi infrastructure issue ke baare mein poochho. Hindi ya English dono chalega!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim(); if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:msg }]);
    setLoading(true);
    try {
      const res = await aiChat(msg);
      setMessages(prev => [...prev, { role:"ai", text:res.data.reply }]);
      setSource(res.data.source);
    } catch {
      setMessages(prev => [...prev, { role:"ai", text:"AI temporarily unavailable. MCD helpline: 1533, Delhi Jal Board: 1916, BSES: 19123." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 160px)', gap:12 }}>
      <div>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em', display:'flex', alignItems:'center', gap:8 }}>
          <Bot size={20} color="#E65C00"/> AI Assistant
        </div>
        <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace', display:'flex', alignItems:'center', gap:6 }}>
          <Zap size={10} color="#E65C00"/>
          MODEL: {source==="Groq LLaMA3" ? "GROQ_LLAMA3 (FREE · LIVE)" : "GROQ_LLAMA3 · Set GROQ_API_KEY for live responses"}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-end', flexDirection:m.role==="user"?"row-reverse":"row" }}>
            <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:m.role==="ai"?'rgba(230,92,0,0.15)':'rgba(255,255,255,0.08)', border:`1px solid ${m.role==="ai"?'rgba(230,92,0,0.3)':'rgba(255,255,255,0.15)'}` }}>
              {m.role==="ai" ? <Bot size={13} color="#E65C00"/> : <User size={13} color="#7a6540"/>}
            </div>
            <div className={m.role==="user"?"chat-bubble-user":"chat-bubble-ai"}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(230,92,0,0.15)', border:'1px solid rgba(230,92,0,0.3)' }}>
              <Bot size={13} color="#E65C00"/>
            </div>
            <div className="chat-bubble-ai" style={{ display:'flex', gap:4, alignItems:'center', color:'#7a6540' }}>
              <Loader size={12} color="#E65C00" style={{ animation:'spin 1s linear infinite' }}/>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              Processing…
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      {messages.length < 2 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ fontSize:11, padding:'5px 12px', borderRadius:8, border:'1px solid rgba(230,92,0,0.25)', background:'rgba(230,92,0,0.06)', color:'#C9A96E', cursor:'pointer', transition:'all .15s', fontFamily:'Inter,sans-serif' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(230,92,0,0.5)'; e.currentTarget.style.color='#FF8C00'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(230,92,0,0.25)'; e.currentTarget.style.color='#C9A96E'; }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display:'flex', gap:8 }}>
        <input className="input" style={{ flex:1 }} placeholder="Civic issues ke baare mein poochho — Hindi ya English…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&!e.shiftKey&&send()} disabled={loading}/>
        <button onClick={() => send()} disabled={loading||!input.trim()} className="btn-primary" style={{ padding:'0 16px' }}>
          <Send size={14}/>
        </button>
      </div>
    </div>
  );
}
