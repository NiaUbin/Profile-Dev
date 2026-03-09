"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Briefcase, RefreshCw, Eye, Mail, Activity, CheckCircle } from "lucide-react";
import { getProjects, getMessages, getVisits } from "@/lib/firestore";

/* ── Animated counter ── */
const Counter: React.FC<{ target: number; loading: boolean; color: string }> = ({ target, loading, color }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (loading) { setVal(0); return; }
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target, loading]);

  if (loading) return (
    <div className="h-9 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(100,116,139,0.15)' }} />
  );
  return <span className="font-orbitron font-black text-3xl" style={{ color }}>{val.toLocaleString()}</span>;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, visits: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projects, messages, visits] = await Promise.all([
        getProjects(), getMessages(), getVisits(),
      ]);
      setStats({ projects: projects.length, messages: messages.length, visits });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    { title: 'ยอดเข้าชมเว็บ', value: stats.visits,   icon: Eye,      color: '#a855f7', glow: 'rgba(168,85,247,0.15)'  },
    { title: 'ผลงานทั้งหมด',   value: stats.projects, icon: Briefcase, color: '#22d3ee', glow: 'rgba(34,211,238,0.15)'  },
    { title: 'ข้อความติดต่อ',  value: stats.messages, icon: Mail,      color: '#10b981', glow: 'rgba(16,185,129,0.15)'  },
  ];

  const systemStatus = [
    'Firebase เชื่อมต่อสำเร็จ',
    'Firestore พร้อมใช้งาน',
    'ติดต่อฐานข้อมูลการเข้าชมสำเร็จ',
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: '1px solid rgba(100,116,139,0.15)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-white tracking-wider">ภาพรวมระบบ</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">ยินดีต้อนรับเข้าสู่ระบบจัดการพอร์ตโฟลิโอ</p>
        </div>

        <button
          onClick={fetchStats} disabled={loading}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(34,211,238,0.35)'; el.style.color='#22d3ee'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(100,116,139,0.2)'; el.style.color='#64748b'; }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          รีเฟรช
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ title, value, icon: Icon, color, glow }) => (
          <div key={title}
            className="relative p-6 rounded-2xl overflow-hidden cursor-default transition-all duration-300 group"
            style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${color}20`, backdropFilter: 'blur(16px)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow=`0 0 32px ${glow}`; el.style.borderColor=`${color}40`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow='none'; el.style.borderColor=`${color}20`; }}
          >
            {/* Bg glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right,${color}08 0%,transparent 60%)` }} />

            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <Activity className="w-3.5 h-3.5 text-slate-700" />
            </div>

            <Counter target={value} loading={loading} color={color} />
            <p className="font-orbitron text-[10px] tracking-[0.25em] text-slate-500 uppercase mt-1">{title}</p>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg,transparent,${color}40,transparent)` }} />
          </div>
        ))}
      </div>

      {/* ── System status ── */}
      <div className="p-6 rounded-2xl" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.15)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10b981' }} />
          <h2 className="font-orbitron text-sm font-bold text-white tracking-wider">สถานะระบบ</h2>
        </div>

        <div className="space-y-3">
          {systemStatus.map((msg, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-default"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(16,185,129,0.25)'; (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(16,185,129,0.1)'; (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.04)'; }}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-sm font-rajdhani">{msg}</span>
              <span className="ml-auto font-orbitron text-[9px] tracking-widest text-emerald-500">ONLINE</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}