import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, CheckCircle, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import { getStats, getIssues } from "../utils/api";

const COLORS = ["#E65C00","#22c55e","#fbbf24","#60a5fa","#a78bfa"];
const TREND = [
  { month:"Jan", resolved:60, new:80 }, { month:"Feb", resolved:63, new:85 },
  { month:"Mar", resolved:67, new:90 }, { month:"Apr", resolved:65, new:88 },
  { month:"May", resolved:70, new:95 }, { month:"Jun", resolved:69, new:92 },
];

const SectionHead = ({ children }) => (
  <div className="sec-heading" style={{ marginBottom:10 }}>{children}</div>
);

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getIssues()])
      .then(([s, i]) => { setStats(s.data); setRecent(i.data.issues.slice(0,4)); })
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? Object.entries(stats.by_category).map(([name,value])=>({name,value})) : [];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ width:36, height:36, border:'3px solid rgba(230,92,0,0.3)', borderTopColor:'#E65C00', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>Dashboard</div>
          <div style={{ fontSize:11, color:'#7a6540', marginTop:2, fontFamily:'monospace' }}>DELHI_NCR · LIVE_COMMUNITY_OVERVIEW</div>
        </div>
        <button className="btn-primary" style={{ fontSize:12 }} onClick={() => onNavigate("report")}>
          <MapPin size={14}/> Report Issue
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        <StatCard label="TOTAL_ISSUES" value={stats?.total?.toLocaleString()} sub="+47 this week" icon={MapPin} color="orange"/>
        <StatCard label="RESOLVED" value={stats?.resolved?.toLocaleString()} sub={`${stats?.resolution_rate}% rate`} icon={CheckCircle} color="green"/>
        <StatCard label="IN_PROGRESS" value={stats?.in_progress?.toLocaleString()} sub="Avg 4.2 days" icon={Clock} color="amber"/>
        <StatCard label="ACTIVE_CITIZENS" value={stats?.active_citizens?.toLocaleString()} sub="+12% this month" icon={Users} color="blue"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="card">
          <SectionHead>Resolution Trend</SectionHead>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TREND} barSize={12} barCategoryGap="35%">
              <XAxis dataKey="month" tick={{ fontSize:10, fill:'#7a6540' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:'#7a6540' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid rgba(230,92,0,0.3)', background:'#1c1810', fontSize:11, color:'#F5EDD6' }}/>
              <Bar dataKey="new" fill="rgba(255,255,255,0.08)" radius={[4,4,0,0]} name="Reported"/>
              <Bar dataKey="resolved" fill="#E65C00" radius={[4,4,0,0]} name="Resolved"/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'#7a6540' }}><span style={{ width:10, height:10, borderRadius:2, background:'#E65C00', display:'inline-block' }}/>Resolved</span>
            <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'#7a6540' }}><span style={{ width:10, height:10, borderRadius:2, background:'rgba(255,255,255,0.15)', display:'inline-block' }}/>Reported</span>
          </div>
        </div>

        <div className="card">
          <SectionHead>Issue Breakdown</SectionHead>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {pieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius:10, border:'1px solid rgba(230,92,0,0.3)', background:'#1c1810', fontSize:11, color:'#F5EDD6' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1 }}>
              {pieData.map((d,i) => (
                <div key={d.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, marginBottom:5 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, color:'#C9A96E' }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:COLORS[i%COLORS.length], display:'inline-block' }}/>
                    {d.name.split(" & ")[0]}
                  </span>
                  <span style={{ fontWeight:500, color:'#F5EDD6', fontFamily:'monospace' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <SectionHead>Recent Reports</SectionHead>
          <button onClick={() => onNavigate("issues")} style={{ fontSize:11, color:'#E65C00', background:'none', border:'none', cursor:'pointer' }}>View all →</button>
        </div>
        {recent.map(issue => <IssueCard key={issue.id} issue={issue}/>)}
      </div>
    </div>
  );
}
