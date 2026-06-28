import React from "react";

const colorMap = {
  orange: { border:'rgba(230,92,0,0.4)', icon:'#E65C00', val:'#FF8C00', bg:'rgba(230,92,0,0.1)' },
  green:  { border:'rgba(34,197,94,0.3)', icon:'#22c55e', val:'#4ade80', bg:'rgba(34,197,94,0.08)' },
  amber:  { border:'rgba(251,146,60,0.3)', icon:'#fb923c', val:'#fbbf24', bg:'rgba(251,146,60,0.08)' },
  blue:   { border:'rgba(96,165,250,0.3)', icon:'#60a5fa', val:'#93c5fd', bg:'rgba(96,165,250,0.08)' },
};

export default function StatCard({ label, value, sub, icon: Icon, color="orange" }) {
  const c = colorMap[color] || colorMap.orange;
  return (
    <div style={{ borderRadius:12, padding:'14px 16px', background:'rgba(20,18,9,0.92)', border:`1px solid ${c.border}` }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={18} color={c.icon} />
        </div>
        <div>
          <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace', letterSpacing:'0.05em', marginBottom:2 }}>{label}</div>
          <div style={{ fontSize:22, fontWeight:600, color:c.val, fontFamily:'Rajdhani,sans-serif' }}>{value}</div>
          {sub && <div style={{ fontSize:10, color:'#7a6540', marginTop:2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}
