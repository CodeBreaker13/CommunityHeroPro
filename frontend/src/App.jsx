import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Ticker from "./components/Ticker";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import MapView from "./pages/MapView";
import Leaderboard from "./pages/Leaderboard";
import AIInsights from "./pages/AIInsights";
import AIChat from "./pages/AIChat";

const PAGES = { dashboard: Dashboard, issues: Issues, report: ReportIssue, verify: Verify, map: MapView, leaderboard: Leaderboard, insights: AIInsights, chat: AIChat };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const Page = PAGES[page] || Dashboard;

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius:12, fontSize:13, background:'#1c1810', color:'#F5EDD6', border:'1px solid rgba(230,92,0,0.3)' },
        success: { iconTheme: { primary:'#22c55e', secondary:'#fff' } },
      }}/>
      {/* Top header bar */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', borderBottom:'1px solid rgba(230,92,0,0.2)', background:'rgba(12,10,6,0.95)', backdropFilter:'blur(8px)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:32, height:32, background:'#E65C00', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📍</div>
          <div>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:16, letterSpacing:'0.08em', color:'#FF8C00', textTransform:'uppercase' }}>Community Hero</div>
            <div style={{ fontSize:10, color:'#7a6540', letterSpacing:'0.05em' }}>Hyperlocal Problem Solver · Delhi NCR</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="live-dot"></span>
          <span style={{ fontSize:11, color:'#22c55e', fontWeight:500, letterSpacing:'0.05em' }}>LIVE SYSTEM ACTIVE</span>
        </div>
      </header>
      {/* Ticker */}
      <Ticker />
      <div style={{ display:'flex', flex:1 }}>
        <Sidebar active={page} onNavigate={setPage} />
        <main style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          <Page onNavigate={setPage} />
        </main>
      </div>
    </div>
  );
}
