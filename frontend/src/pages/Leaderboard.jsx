import React, { useEffect, useState } from "react";
import { Trophy, Star, Flame, ShieldCheck, MapPin, Zap } from "lucide-react";
import { getLeaderboard } from "../utils/api";

const BADGE_COLOR = {
  Legend:   { bg:'rgba(251,191,36,0.15)', color:'#fbbf24', border:'rgba(251,191,36,0.3)' },
  Champion: { bg:'rgba(34,197,94,0.12)',  color:'#4ade80', border:'rgba(34,197,94,0.25)' },
  Hero:     { bg:'rgba(230,92,0,0.15)',   color:'#fb923c', border:'rgba(230,92,0,0.3)' },
  Activist: { bg:'rgba(96,165,250,0.12)', color:'#60a5fa', border:'rgba(96,165,250,0.25)' },
};

const ACHIEVEMENTS = [
  { icon:MapPin,     label:"First Report",      xp:50,   earned:true },
  { icon:Flame,      label:"10-Day Streak",      xp:200,  earned:true },
  { icon:ShieldCheck,label:"50 Verifications",   xp:500,  earned:false, progress:47, total:50 },
  { icon:Trophy,     label:"Area Legend",         xp:1000, earned:false },
  { icon:Star,       label:"Problem Solver",      xp:300,  earned:false },
  { icon:Zap,        label:"Speed Hero",          xp:150,  earned:true },
];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaderboard().then(r => setLeaders(r.data.leaderboard)).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>Community Heroes</div>
        <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>CITIZEN_RANKINGS · DELHI_NCR · THIS_MONTH</div>
      </div>

      {/* Podium */}
      {leaders.length >= 3 && (
        <div className="card" style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:20, padding:'20px 14px' }}>
          {[leaders[1], leaders[0], leaders[2]].map((c, idx) => {
            const pos = [2,1,3][idx];
            const h = [52,72,38][idx];
            const bgPod = ['rgba(100,100,100,0.3)','rgba(230,92,0,0.35)','rgba(146,64,14,0.3)'][idx];
            const medal = ['🥈','🥇','🥉'][idx];
            return (
              <div key={c.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(230,92,0,0.15)', border:`1px solid rgba(230,92,0,${pos===1?0.6:0.3})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'#FF8C00' }}>
                  {c.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div style={{ fontSize:11, fontWeight:500, color:'#C9A96E' }}>{c.name.split(" ")[0]}</div>
                <div style={{ width:44, height:h, background:bgPod, borderRadius:'6px 6px 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:'1px solid rgba(230,92,0,0.2)' }}>
                  <span style={{ fontSize:18 }}>{medal}</span>
                  <span style={{ fontSize:10, color:'#FF8C00', fontFamily:'monospace' }}>#{pos}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="card">
        <div className="sec-heading" style={{ marginBottom:12 }}>Full Rankings</div>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
            <div style={{ width:28, height:28, border:'3px solid rgba(230,92,0,0.2)', borderTopColor:'#E65C00', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : leaders.map((c, idx) => {
          const bc = BADGE_COLOR[c.badge] || BADGE_COLOR.Activist;
          const rankColor = idx===0?'#fbbf24':idx===1?'#9ca3af':idx===2?'#fb923c':'rgba(255,255,255,0.15)';
          return (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(230,92,0,0.1)' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:rankColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color: idx<3?'#0c0a06':'#7a6540', flexShrink:0 }}>
                {idx+1}
              </div>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(230,92,0,0.12)', border:'1px solid rgba(230,92,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'#FF8C00', flexShrink:0 }}>
                {c.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:500, color:'#F5EDD6' }}>{c.name}</span>
                  <span style={{ fontSize:10, padding:'1px 7px', borderRadius:8, background:bc.bg, color:bc.color, border:`1px solid ${bc.border}` }}>{c.badge}</span>
                </div>
                <div style={{ fontSize:10, color:'#7a6540', fontFamily:'monospace', marginBottom:4 }}>{c.area} · {c.reports} reports · {c.verifications} verifications</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min((c.xp/10000)*100,100)}%`, background:'#E65C00', borderRadius:2 }}/>
                  </div>
                  <span style={{ fontSize:10, color:'#FF8C00', fontFamily:'monospace', flexShrink:0 }}>{c.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="sec-heading" style={{ marginBottom:12 }}>Achievement Badges</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} style={{ borderRadius:10, padding:'12px', textAlign:'center', border:`1px solid ${a.earned?'rgba(230,92,0,0.3)':'rgba(255,255,255,0.06)'}`, background:a.earned?'rgba(230,92,0,0.08)':'rgba(255,255,255,0.02)', opacity:a.earned?1:.5 }}>
              <div style={{ width:36, height:36, borderRadius:10, margin:'0 auto 8px', display:'flex', alignItems:'center', justifyContent:'center', background:a.earned?'rgba(230,92,0,0.2)':'rgba(255,255,255,0.05)' }}>
                <a.icon size={17} color={a.earned?'#FF8C00':'#7a6540'}/>
              </div>
              <div style={{ fontSize:11, fontWeight:500, color:'#F5EDD6', marginBottom:2 }}>{a.label}</div>
              <div style={{ fontSize:10, color:a.earned?'#E65C00':'#7a6540', fontFamily:'monospace' }}>+{a.xp} XP</div>
              {a.progress && !a.earned && (
                <div style={{ marginTop:6 }}>
                  <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(a.progress/a.total)*100}%`, background:'#E65C00' }}/>
                  </div>
                  <span style={{ fontSize:10, color:'#7a6540' }}>{a.progress}/{a.total}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
