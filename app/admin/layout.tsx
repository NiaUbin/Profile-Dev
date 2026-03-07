"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, LogOut, Menu, Shield, Mail } from "lucide-react";
import { useState } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoginLoading(true);
      try {
        await signIn(email, password);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "เข้าสู่ระบบล้มเหลว";
        if (errorMessage.includes("invalid-credential") || errorMessage.includes("wrong-password") || errorMessage.includes("user-not-found")) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else if (errorMessage.includes("too-many-requests")) {
          setError("ลองมากเกินไป กรุณารอสักครู่");
        } else {
          setError("เข้าสู่ระบบล้มเหลว: " + errorMessage);
        }
      } finally {
        setLoginLoading(false);
      }
    };

    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">เข้าสู่ระบบเพื่อจัดการพอร์ตโฟลิโอ</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">อีเมล</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Portfolio Admin System v1.0
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "แดชบอร์ด", path: "/admin", icon: LayoutDashboard },
    { name: "จัดการผลงาน", path: "/admin/projects", icon: Briefcase },
    { name: "ข้อความติดต่อ", path: "/admin/messages", icon: Mail },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-800">
            Admin Panel
          </span>
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
             <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          {user && (
            <div className="px-4 py-2 text-xs text-gray-400 truncate">
              {user.email}
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogOut size={18} className="text-gray-400" />
            กลับสู่หน้าหลัก
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
          >
            <Shield size={18} className="text-red-400" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:hidden">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-lg font-bold text-gray-800">
              Admin
            </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLoginGate>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminLoginGate>
    </AuthProvider>
  );
}
