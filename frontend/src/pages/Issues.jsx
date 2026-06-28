import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import IssueCard from "../components/IssueCard";
import { getIssues } from "../utils/api";

const STATUSES = ["All","Open","In Progress","Resolved"];
const CATEGORIES = ["All","Roads & Potholes","Water & Sewage","Electricity","Waste Management","Public Safety"];

const FilterBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding:'4px 12px', borderRadius:8, fontSize:11, cursor:'pointer', fontFamily:'monospace', letterSpacing:'0.04em',
    border: active ? '1px solid #E65C00' : '1px solid rgba(230,92,0,0.2)',
    background: active ? 'rgba(230,92,0,0.2)' : 'rgba(255,255,255,0.03)',
    color: active ? '#FF8C00' : '#7a6540', transition:'all .15s'
  }}>{children}</button>
);

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  const load = () => { setLoading(true); getIssues().then(r => setIssues(r.data.issues)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    let d = issues;
    if (status !== "All") d = d.filter(i => i.status === status);
    if (category !== "All") d = d.filter(i => i.category === category);
    if (search) d = d.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()));
    setFiltered(d);
  }, [issues, status, category, search]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:22, color:'#FF8C00', textTransform:'uppercase', letterSpacing:'0.06em' }}>All Issues</div>
        <div style={{ fontSize:11, color:'#7a6540', fontFamily:'monospace' }}>ACTIVE_QUEUE · {filtered.length} RECORDS</div>
      </div>

      <div className="card" style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ position:'relative' }}>
          <Search size={13} color="#7a6540" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
          <input className="input" style={{ paddingLeft:30 }} placeholder="Search issues by title or location…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:10, color:'#7a6540', fontFamily:'monospace' }}>STATUS:</span>
          {STATUSES.map(s => <FilterBtn key={s} active={status===s} onClick={() => setStatus(s)}>{s}</FilterBtn>)}
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:10, color:'#7a6540', fontFamily:'monospace' }}>CATEGORY:</span>
          {CATEGORIES.map(c => <FilterBtn key={c} active={category===c} onClick={() => setCategory(c)}>{c==="All"?"All":c.split(" & ")[0]}</FilterBtn>)}
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div style={{ width:32, height:32, border:'3px solid rgba(230,92,0,0.2)', borderTopColor:'#E65C00', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:48, color:'#7a6540' }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
          <div style={{ fontFamily:'monospace', fontSize:12 }}>NO_RECORDS_FOUND</div>
        </div>
      ) : (
        <div>{filtered.map(issue => <IssueCard key={issue.id} issue={issue} onUpdate={load}/>)}</div>
      )}
    </div>
  );
}
