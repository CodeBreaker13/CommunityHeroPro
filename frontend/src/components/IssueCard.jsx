import React, { useState } from "react";
import { MapPin, ThumbsUp, Clock, CheckCircle } from "lucide-react";
import { severityColor, statusColor, categoryIcon, timeAgo } from "../utils/helpers";
import { voteIssue, resolveIssue } from "../utils/api";
import toast from "react-hot-toast";

export default function IssueCard({ issue, onUpdate }) {
  const [votes, setVotes] = useState(issue.votes);
  const [status, setStatus] = useState(issue.status);
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    setVoting(true);
    try {
      const res = await voteIssue(issue.id);
      setVotes(res.data.votes); setStatus(res.data.status);
      toast.success("Verified! +10 XP"); onUpdate?.();
    } catch { toast.error("Vote failed"); } finally { setVoting(false); }
  };
  const handleResolve = async () => {
    try { await resolveIssue(issue.id); setStatus("Resolved"); toast.success("Resolved!"); onUpdate?.(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div style={{ borderRadius:12, padding:'12px 14px', background:'rgba(20,18,9,0.92)', border:'1px solid rgba(230,92,0,0.2)', marginBottom:8, transition:'border-color .15s' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(230,92,0,0.5)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(230,92,0,0.2)'}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'rgba(230,92,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
          {categoryIcon(issue.category)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#F5EDD6' }}>{issue.title}</div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              <span className={severityColor(issue.severity)}>{issue.severity}</span>
              <span className={statusColor(status)}>{status}</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#7a6540', marginTop:3 }}>
            <MapPin size={10}/><span>{issue.location}</span>
            <span style={{margin:'0 4px'}}>·</span>
            <Clock size={10}/><span>{timeAgo(issue.timestamp)}</span>
            <span style={{margin:'0 4px'}}>·</span>
            <span>by {issue.reporter}</span>
          </div>
          {issue.description && <p style={{ fontSize:11, color:'#C9A96E', marginTop:5, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{issue.description}</p>}
          {issue.ai_tags?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
              {issue.ai_tags.map(tag => (
                <span key={tag} style={{ fontSize:10, background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)', padding:'1px 8px', borderRadius:8 }}>{tag}</span>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            <button onClick={handleVote} disabled={voting||status==="Resolved"}
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, padding:'4px 10px', borderRadius:8, border:'1px solid rgba(230,92,0,0.3)', background:'rgba(230,92,0,0.08)', color:'#fb923c', cursor:'pointer', transition:'all .15s' }}>
              <ThumbsUp size={11}/>{votes} verified
            </button>
            {status !== "Resolved" && (
              <button onClick={handleResolve}
                style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, padding:'4px 10px', borderRadius:8, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.08)', color:'#4ade80', cursor:'pointer', transition:'all .15s' }}>
                <CheckCircle size={11}/>Resolve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
