import React from "react";
import { LayoutDashboard, MapPin, PlusCircle, ShieldCheck, Trophy, Brain, MessageSquare, Map } from "lucide-react";

const links = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"issues",    label:"All Issues", icon:MapPin },
  { id:"report",    label:"Report Issue", icon:PlusCircle },
  { id:"verify",    label:"Verify", icon:ShieldCheck },
  { id:"map",       label:"Map View", icon:Map },
  { id:"leaderboard", label:"Heroes", icon:Trophy },
  { id:"insights",  label:"AI Insights", icon:Brain },
  { id:"chat",      label:"AI Assistant", icon:MessageSquare },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside style={{ width:210, flexShrink:0, background:'rgba(12,10,6,0.97)', borderRight:'1px solid rgba(230,92,0,0.2)', display:'flex', flexDirection:'column', minHeight:'calc(100vh - 80px)', position:'sticky', top:80, height:'calc(100vh - 80px)' }}>
      <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
        <div className="sec-heading" style={{ padding:'4px 12px 8px' }}>Navigation</div>
        {links.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)}
            className={`sidebar-link w-full text-left ${active===id?'active':''}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
      {/* Bottom user card */}
      <div style={{ padding:'12px', borderTop:'1px solid rgba(230,92,0,0.2)' }}>
        <div className="sec-heading" style={{ marginBottom:8 }}>Citizen Profile</div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(230,92,0,0.2)', border:'1px solid rgba(230,92,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'#FF8C00' }}>YO</div>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:'#F5EDD6' }}>You (Citizen)</div>
            <div style={{ fontSize:10, color:'#7a6540' }}>1,380 XP · Activist</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
