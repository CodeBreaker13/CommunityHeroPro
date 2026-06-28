import React, { useEffect, useState } from "react";
import { ShieldCheck, ThumbsUp, MapPin, Clock } from "lucide-react";
import { getIssues, voteIssue } from "../utils/api";
import { timeAgo, categoryIcon } from "../utils/helpers";
import toast from "react-hot-toast";

export default function Verify() {
  const [issues, setIssues] = useState([]);
  const [voted, setVoted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [totalXp, setTotalXp] = useState(1380);
  const [verCount, setVerCount] = useState(47);

  useEffect(() => { getIssues({ status:"open" }).then(r => setIssues(r.data.issues)).finally(() => setLoading(false)); }, []);

  const handleVote = async (issue) => {
    if (voted.has(issue.id)) return;
    try {
      const res = await voteIssue(issue.id);
      setVoted(v => new Set([...v, issue.id]));
      setTotalXp(x => x + 10); setVerCount(c => c + 1);
      setIssues(prev => prev.map(i => i.id===issue.id ? {...i, votes:res.data.votes, status:res.data.status} : i));
      toast.success("+10 XP — Verified!");
    } catch { toast.error("Verification failed"); }
  };

  const statStyle = { borderRadius:10, padding:'10px 14px', background:'rgba(20,18,9,0.9)', border:'1px solid rgba(230,92,0,0.25)', textAlign:'center' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>Community Verify</div>
          <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>VALIDATE_ISSUES · EARN_XP_TOKENS</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:10, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.08)' }}>
          <ShieldCheck size={14} color="#22c55e"/>
          <span style={{ fontSize:12, fontWeight:600, color:'#4ade80', fontFamily:'monospace' }}>{totalXp.toLocaleString()} XP</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        {[
          { label:"VERIFIED", val:verCount, color:'#FF8C00' },
          { label:"REPORTS_FILED", val:12, color:'#60a5fa' },
          { label:"TOTAL_XP", val:totalXp.toLocaleString(), color:'#4ade80' },
          { label:"RANK", val:"#4", color:'#fbbf24' },
        ].map(s => (
          <div key={s.label} style={statStyle}>
            <div style={{ fontSize:10, color:'#7a6540', fontFamily:'monospace', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:700, color:s.color, fontFamily:'Rajdhani,sans-serif' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="sec-heading" style={{ marginBottom:12 }}>Pending Verification Queue · {issues.length} issues</div>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
            <div style={{ width:28, height:28, border:'3px solid rgba(230,92,0,0.2)', borderTopColor:'#E65C00', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : issues.map(issue => {
          const isVoted = voted.has(issue.id);
          return (
            <div key={issue.id} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(230,92,0,0.1)' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(230,92,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{categoryIcon(issue.category)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:500, color:'#F5EDD6' }}>{issue.title}</div>
                <div style={{ display:'flex', gap:6, fontSize:10, color:'#7a6540', marginTop:3 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:3 }}><MapPin size={9}/>{issue.location}</span>
                  <span>·</span>
                  <span style={{ display:'flex', alignItems:'center', gap:3 }}><Clock size={9}/>{timeAgo(issue.timestamp)}</span>
                  <span>·</span>
                  <span style={{ display:'flex', alignItems:'center', gap:3 }}><ThumbsUp size={9}/>{issue.votes}</span>
                </div>
              </div>
              <button onClick={() => handleVote(issue)} style={{
                display:'flex', alignItems:'center', gap:5, fontSize:11, padding:'5px 12px', borderRadius:8, cursor:'pointer', transition:'all .15s', flexShrink:0,
                border: isVoted ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(230,92,0,0.3)',
                background: isVoted ? 'rgba(34,197,94,0.12)' : 'rgba(230,92,0,0.08)',
                color: isVoted ? '#4ade80' : '#fb923c',
              }}>
                <ShieldCheck size={12}/>{isVoted ? "Verified" : "Verify"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
