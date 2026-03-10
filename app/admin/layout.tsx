"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, LogOut, Menu, Shield, Mail, X, Home, ChevronRight, User,
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
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
        </div>
        <p className="font-orbitron text-[10px] tracking-[0.4em] text-blue-500 uppercase animate-pulse">กำลังตรวจสอบ...</p>
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
          background: '#ffffff',
          color: '#1e293b',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border border-blue-100 shadow-[0_10px_40px_rgba(59,130,246,0.1)] rounded-3xl',
            title: 'font-orbitron tracking-wider text-blue-600',
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
          background: '#ffffff',
          color: '#1e293b',
          confirmButtonText: 'ตกลง',
          buttonsStyling: false,
          customClass: {
            popup: 'border border-rose-100 shadow-[0_10px_40px_rgba(244,63,94,0.1)] rounded-3xl',
            title: 'font-orbitron tracking-wider text-rose-500',
            confirmButton: 'mt-4 px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-orbitron tracking-wider transition-all'
          }
        });
      } finally { setLoginLoading(false); }
    };

    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 relative overflow-hidden px-4">
        {/* Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 65%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative shadow-lg shadow-blue-500/20"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#3b82f6)' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-orbitron font-black text-2xl text-slate-800 tracking-wider">ADMIN PANEL</h1>
            <p className="text-slate-500 text-xs mt-2 font-orbitron tracking-widest">เข้าสู่ระบบจัดการพอร์ตโฟลิโอ</p>
          </div>

          {/* Card */}
          <div className="p-8 rounded-2xl shadow-xl shadow-slate-200/50"
            style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(226,232,240,0.8)', backdropFilter: 'blur(20px)' }}>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm"
                  style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48' }}>
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: focusField === 'email' ? '#0ea5e9' : '#64748b' }}>
                  อีเมล
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com" required
                  onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}
                  className="w-full px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400"
                  style={{
                    background: focusField === 'email' ? '#ffffff' : '#f8fafc',
                    border: `1px solid ${focusField === 'email' ? '#3b82f6' : '#e2e8f0'}`,
                    boxShadow: focusField === 'email' ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: focusField === 'pw' ? '#0ea5e9' : '#64748b' }}>
                  รหัสผ่าน
                </label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  onFocus={() => setFocusField('pw')} onBlur={() => setFocusField(null)}
                  className="w-full px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400"
                  style={{
                    background: focusField === 'pw' ? '#ffffff' : '#f8fafc',
                    border: `1px solid ${focusField === 'pw' ? '#3b82f6' : '#e2e8f0'}`,
                    boxShadow: focusField === 'pw' ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
                  }}
                />
              </div>

              <button
                type="submit" disabled={loginLoading}
                className="group relative w-full py-3.5 rounded-xl font-orbitron text-xs font-bold tracking-widest text-white overflow-hidden transition-all duration-300 disabled:opacity-60 focus:outline-none shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#3b82f6)' }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {loginLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />กำลังเข้าสู่ระบบ...</>
                  ) : 'เข้าสู่ระบบ'}
                </span>
              </button>
            </form>
          </div>

          <p className="text-center font-orbitron text-[9px] tracking-widest text-slate-400 mt-6">
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
    { name: 'แดชบอร์ด',    path: '/admin',          icon: LayoutDashboard, color: '#0ea5e9' },
    { name: 'จัดการ About', path: '/admin/about',    icon: User,            color: '#3b82f6' },
    { name: 'จัดการผลงาน', path: '/admin/projects',  icon: Briefcase,       color: '#8b5cf6' },
    { name: 'ข้อความติดต่อ', path: '/admin/messages', icon: Mail,            color: '#10b981' },
  ];

  const handleSignOut = async () => { 
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      icon: 'question',
      showCancelButton: true,
      background: '#ffffff',
      color: '#1e293b',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'border border-blue-100 shadow-[0_10px_40px_rgba(59,130,246,0.1)] rounded-3xl',
        title: 'font-orbitron tracking-wider text-slate-800',
        confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 rounded-xl font-orbitron tracking-wider transition-all mr-3',
        cancelButton: 'mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl font-orbitron tracking-wider transition-all'
      }
    });

    if (result.isConfirmed) {
      await signOut(); 
      router.push('/admin'); 
      Swal.fire({
        title: 'ออกจากระบบแล้ว',
        icon: 'success',
        background: '#ffffff',
        color: '#1e293b',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-blue-100 shadow-[0_10px_40px_rgba(59,130,246,0.1)] rounded-3xl',
          title: 'font-orbitron tracking-wider text-blue-500',
        }
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <p className="font-orbitron font-black text-base tracking-wider"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ADMIN
          </p>
          <p className="font-orbitron text-[9px] tracking-[0.3em] text-slate-400 mt-0.5">PANEL v1.0</p>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group font-medium"
              style={{
                background: active ? `${color}15` : 'transparent',
                color: active ? color : '#64748b',
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='#f8fafc'; (e.currentTarget as HTMLElement).style.color='#334155'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; } }}
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: active ? '#ffffff' : '#f8fafc', border: `1px solid ${active ? color + '40' : '#e2e8f0'}`, boxShadow: active ? `0 2px 10px ${color}15` : 'none' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: active ? color : '#94a3b8' }} />
              </div>
              <span className="font-orbitron text-xs tracking-wider opacity-90">{name}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-1" style={{ borderTop: '1px solid #f1f5f9' }}>
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="font-orbitron text-[9px] tracking-widest text-slate-400 uppercase mb-0.5">Signed in as</p>
            <p className="text-slate-600 text-xs truncate font-rajdhani">{user.email}</p>
          </div>
        )}
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#f8fafc'; (e.currentTarget as HTMLElement).style.color='#334155'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Home className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="font-orbitron text-xs tracking-wider">กลับสู่หน้าหลัก</span>
        </Link>

        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#fff1f2'; (e.currentTarget as HTMLElement).style.color='#e11d48'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="font-orbitron text-xs tracking-wider">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 relative"
        style={{ background: 'rgba(255,255,255,0.95)', borderRight: '1px solid #e2e8f0', backdropFilter: 'blur(20px)' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 flex flex-col z-10 shadow-2xl shadow-slate-200"
            style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">

        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-4"
          style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #e2e8f0', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#cbd5e1'; (e.currentTarget as HTMLElement).style.color='#334155'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.color='#64748b'; }}>
            <Menu className="w-4 h-4" />
          </button>
          <span className="font-orbitron font-black text-sm tracking-widest"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ADMIN
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
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