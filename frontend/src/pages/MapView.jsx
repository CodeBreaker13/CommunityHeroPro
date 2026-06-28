import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getHeatmap, getStats } from "../utils/api";
import { severityColor, statusColor } from "../utils/helpers";

const SEV_COLOR = { Critical:"#ef4444", High:"#E65C00", Medium:"#fbbf24", Low:"#22c55e" };
const SEV_RADIUS = { Critical:18, High:14, Medium:10, Low:7 };

const FilterBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding:'4px 12px', borderRadius:8, fontSize:11, cursor:'pointer', fontFamily:'monospace',
    border: active ? '1px solid #E65C00' : '1px solid rgba(230,92,0,0.2)',
    background: active ? 'rgba(230,92,0,0.2)' : 'rgba(255,255,255,0.03)',
    color: active ? '#FF8C00' : '#7a6540', transition:'all .15s'
  }}>{children}</button>
);

const ProgressRow = ({ label, val, max, color }) => (
  <div style={{ marginBottom:8 }}>
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
      <span style={{ color:'#C9A96E', fontFamily:'monospace' }}>{label}</span>
      <span style={{ color:'#FF8C00', fontFamily:'monospace' }}>{val}</span>
    </div>
    <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${(val/max)*100}%`, background:color||'#E65C00', borderRadius:2, transition:'width .6s ease' }}/>
    </div>
  </div>
);

export default function MapView() {
  const [points, setPoints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { getHeatmap().then(r => setPoints(r.data.points)); getStats().then(r => setStats(r.data)); }, []);

  const filtered = filter === "All" ? points : points.filter(p => p.severity === filter);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>Issue Heatmap</div>
        <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>GEO_CLUSTER · DELHI_NCR · {filtered.length} POINTS</div>
      </div>

      <div className="card" style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ fontSize:10, color:'#7a6540', fontFamily:'monospace' }}>SEVERITY_FILTER:</span>
        {["All","Critical","High","Medium","Low"].map(s => <FilterBtn key={s} active={filter===s} onClick={() => setFilter(s)}>{s}</FilterBtn>)}
      </div>

      <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(230,92,0,0.2)', height:400 }}>
        <MapContainer center={[28.6139,77.209]} zoom={11} style={{ height:'100%', width:'100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap'/>
          {filtered.map((p,i) => (
            <CircleMarker key={i} center={[p.lat,p.lng]} radius={SEV_RADIUS[p.severity]||10}
              fillColor={SEV_COLOR[p.severity]||"#888"} color={SEV_COLOR[p.severity]||"#888"}
              fillOpacity={0.75} weight={2} opacity={0.9}>
              <Popup>
                <div style={{ fontSize:12, minWidth:160, lineHeight:1.5 }}>
                  <div style={{ fontWeight:600, marginBottom:4 }}>{p.title}</div>
                  <span className={severityColor(p.severity)}>{p.severity}</span>{' '}
                  <span className={statusColor(p.status)}>{p.status}</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="card">
          <div className="sec-heading" style={{ marginBottom:10 }}>Top Affected Zones</div>
          <ProgressRow label="Rohini" val={87} max={100} color="#ef4444"/>
          <ProgressRow label="Saket" val={64} max={100} color="#E65C00"/>
          <ProgressRow label="Dwarka" val={51} max={100} color="#E65C00"/>
          <ProgressRow label="Karol Bagh" val={43} max={100} color="#22c55e"/>
          <ProgressRow label="Noida Sec 18" val={29} max={100} color="#22c55e"/>
        </div>
        <div className="card">
          <div className="sec-heading" style={{ marginBottom:10 }}>Dept. Response Rate</div>
          <ProgressRow label="BSES_ELECTRICITY" val={81} max={100} color="#fbbf24"/>
          <ProgressRow label="MCD_ROADS" val={72} max={100} color="#E65C00"/>
          <ProgressRow label="DELHI_JAL_BOARD" val={58} max={100} color="#60a5fa"/>
          <ProgressRow label="SANITATION_DEPT" val={65} max={100} color="#22c55e"/>
          <ProgressRow label="PWD" val={44} max={100} color="#a78bfa"/>
        </div>
      </div>
    </div>
  );
}
