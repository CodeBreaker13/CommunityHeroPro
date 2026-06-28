import React, { useEffect, useState } from "react";
import { getStats } from "../utils/api";

export default function Ticker() {
  const [stats, setStats] = useState({ total:1284, resolved:892, in_progress:241, open:151, active_citizens:3847 });
  useEffect(() => { getStats().then(r => setStats(r.data)).catch(()=>{}); }, []);

  const items = [
    `TOTAL_ISSUES: ${stats.total}`,
    `RESOLVED: ${stats.resolved}`,
    `IN_PROGRESS: ${stats.in_progress}`,
    `OPEN: ${stats.open}`,
    `ACTIVE_CITIZENS: ${stats.active_citizens}`,
    `RESOLUTION_RATE: ${stats.total ? Math.round(stats.resolved/stats.total*100) : 0}%`,
    `AI_MODEL: GROQ_LLAMA3`,
    `IMAGE_AI: HUGGINGFACE_VIT`,
    `ZONE: DELHI_NCR`,
    `STATUS: NOMINAL`,
  ];
  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize:10, fontFamily:'monospace', color: i % 2 === 0 ? '#FF8C00' : '#22c55e', letterSpacing:'0.05em', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background: i % 2 === 0 ? '#E65C00' : '#22c55e', display:'inline-block' }}></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
