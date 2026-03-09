"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, LogOut, Menu, Shield, Mail, X, Home, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

/* ═══════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════ */
function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        </div>
        <p className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-500 uppercase animate-pulse">กำลังตรวจสอบ...</p>
      </div>
    </div>
  );

  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault(); setError(""); setLoginLoading(true);
      try {
        await signIn(email, password);
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับสู่ระบบจัดการพอร์ตโฟลิโอ',
          icon: 'success',
          background: '#0f172a',
          color: '#e2e8f0',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] rounded-3xl',
            title: 'font-orbitron tracking-wider text-cyan-400',
          }
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found"))
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        else if (msg.includes("too-many-requests"))
          setError("ลองมากเกินไป กรุณารอสักครู่");
        else setError("เข้าสู่ระบบล้มเหลว: " + msg);
        
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({
          title: 'เข้าสู่ระบบล้มเหลว',
          text: error || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
          icon: 'error',
          background: '#0f172a',
          color: '#e2e8f0',
          confirmButtonText: 'ตกลง',
          buttonsStyling: false,
          customClass: {
            popup: 'border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.15)] rounded-3xl',
            title: 'font-orbitron tracking-wider text-rose-400',
            confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-orbitron tracking-wider transition-all'
          }
        });
      } finally { setLoginLoading(false); }
    };

    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 relative overflow-hidden px-4">
        {/* Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 65%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
              style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', boxShadow: '0 0 32px rgba(34,211,238,0.4)' }}>
              <Shield className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="font-orbitron font-black text-2xl text-white tracking-wider">ADMIN PANEL</h1>
            <p className="text-slate-500 text-xs mt-2 font-orbitron tracking-widest">เข้าสู่ระบบจัดการพอร์ตโฟลิโอ</p>
          </div>

          {/* Card */}
          <div className="p-8 rounded-2xl"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(34,211,238,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(34,211,238,0.06)' }}>

            {/* Top border accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg,transparent,#22d3ee,transparent)' }} />

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm"
                  style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185' }}>
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: focusField === 'email' ? '#22d3ee' : '#64748b' }}>
                  อีเมล
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com" required
                  onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}
                  className="w-full px-4 py-3 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700"
                  style={{
                    background: focusField === 'email' ? 'rgba(34,211,238,0.04)' : 'rgba(30,41,59,0.6)',
                    border: `1px solid ${focusField === 'email' ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)'}`,
                    boxShadow: focusField === 'email' ? '0 0 16px rgba(34,211,238,0.08)' : 'none',
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: focusField === 'pw' ? '#22d3ee' : '#64748b' }}>
                  รหัสผ่าน
                </label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  onFocus={() => setFocusField('pw')} onBlur={() => setFocusField(null)}
                  className="w-full px-4 py-3 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700"
                  style={{
                    background: focusField === 'pw' ? 'rgba(34,211,238,0.04)' : 'rgba(30,41,59,0.6)',
                    border: `1px solid ${focusField === 'pw' ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)'}`,
                    boxShadow: focusField === 'pw' ? '0 0 16px rgba(34,211,238,0.08)' : 'none',
                  }}
                />
              </div>

              <button
                type="submit" disabled={loginLoading}
                className="group relative w-full py-3.5 rounded-xl font-orbitron text-xs font-bold tracking-widest overflow-hidden transition-all duration-300 disabled:opacity-60 focus:outline-none"
                style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#020617', boxShadow: '0 0 24px rgba(34,211,238,0.35)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 40px rgba(34,211,238,0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 24px rgba(34,211,238,0.35)'; }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {loginLoading ? (
                    <><span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />กำลังเข้าสู่ระบบ...</>
                  ) : 'เข้าสู่ระบบ'}
                </span>
              </button>
            </form>
          </div>

          <p className="text-center font-orbitron text-[9px] tracking-widest text-slate-700 mt-6">
            PORTFOLIO ADMIN SYSTEM v1.0
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/* ═══════════════════════════════════════
   LAYOUT INNER
═══════════════════════════════════════ */
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'แดชบอร์ด',    path: '/admin',          icon: LayoutDashboard, color: '#22d3ee' },
    { name: 'จัดการผลงาน', path: '/admin/projects',  icon: Briefcase,       color: '#a855f7' },
    { name: 'ข้อความติดต่อ', path: '/admin/messages', icon: Mail,            color: '#10b981' },
  ];

  const handleSignOut = async () => { 
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      icon: 'question',
      showCancelButton: true,
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] rounded-3xl',
        title: 'font-orbitron tracking-wider text-white',
        confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] rounded-xl font-orbitron tracking-wider transition-all mr-3',
        cancelButton: 'mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl font-orbitron tracking-wider transition-all'
      }
    });

    if (result.isConfirmed) {
      await signOut(); 
      router.push('/admin'); 
      Swal.fire({
        title: 'ออกจากระบบแล้ว',
        icon: 'success',
        background: '#0f172a',
        color: '#e2e8f0',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] rounded-3xl',
          title: 'font-orbitron tracking-wider text-cyan-400',
        }
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(100,116,139,0.12)' }}>
        <div>
          <p className="font-orbitron font-black text-base tracking-wider"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ADMIN
          </p>
          <p className="font-orbitron text-[9px] tracking-[0.3em] text-slate-600 mt-0.5">PANEL v1.0</p>
        </div>
        <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: '#64748b' }} onClick={() => setSidebarOpen(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ name, path, icon: Icon, color }) => {
          const active = pathname === path;
          return (
            <Link key={path} href={path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group"
              style={{
                background: active ? `${color}12` : 'transparent',
                border: `1px solid ${active ? color + '30' : 'transparent'}`,
                color: active ? color : '#64748b',
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='rgba(100,116,139,0.08)'; (e.currentTarget as HTMLElement).style.color='#94a3b8'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; } }}
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: active ? `${color}15` : 'rgba(30,41,59,0.5)', border: `1px solid ${active ? color + '30' : 'rgba(100,116,139,0.1)'}` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: active ? color : '#475569' }} />
              </div>
              <span className="font-orbitron text-xs tracking-wider">{name}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-1" style={{ borderTop: '1px solid rgba(100,116,139,0.12)' }}>
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="font-orbitron text-[9px] tracking-widest text-slate-600 uppercase mb-0.5">Signed in as</p>
            <p className="text-slate-400 text-xs truncate font-rajdhani">{user.email}</p>
          </div>
        )}
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(100,116,139,0.08)'; (e.currentTarget as HTMLElement).style.color='#94a3b8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.1)' }}>
            <Home className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="font-orbitron text-xs tracking-wider">กลับสู่หน้าหลัก</span>
        </Link>

        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(244,63,94,0.08)'; (e.currentTarget as HTMLElement).style.color='#fb7185'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.1)' }}>
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="font-orbitron text-xs tracking-wider">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 relative"
        style={{ background: 'rgba(10,15,30,0.95)', borderRight: '1px solid rgba(100,116,139,0.12)', backdropFilter: 'blur(20px)' }}>
        <div className="absolute top-0 right-0 w-[1px] h-full"
          style={{ background: 'linear-gradient(to bottom,transparent,rgba(34,211,238,0.15) 30%,rgba(34,211,238,0.15) 70%,transparent)' }} />
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 flex flex-col z-10"
            style={{ background: 'rgba(10,15,30,0.98)', borderRight: '1px solid rgba(100,116,139,0.15)', backdropFilter: 'blur(20px)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-4"
          style={{ background: 'rgba(10,15,30,0.9)', borderBottom: '1px solid rgba(100,116,139,0.12)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(34,211,238,0.35)'; (e.currentTarget as HTMLElement).style.color='#22d3ee'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(100,116,139,0.2)'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}>
            <Menu className="w-4 h-4" />
          </button>
          <span className="font-orbitron font-black text-sm tracking-widest"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ADMIN
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {/* Top neon line */}
          <div className="fixed top-0 left-0 right-0 h-[1px] pointer-events-none z-10"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.2),transparent)' }} />
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EXPORT
═══════════════════════════════════════ */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLoginGate>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminLoginGate>
    </AuthProvider>
  );
}