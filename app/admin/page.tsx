"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Activity, Briefcase, RefreshCw } from "lucide-react";
import { getProjects, getMessages } from "@/lib/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projects, messages] = await Promise.all([
        getProjects(),
        getMessages(),
      ]);
      setStats({
        projects: projects.length,
        messages: messages.length,
      });
      setLastUpdated(new Date().toLocaleTimeString("th-TH"));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { title: "ผลงานทั้งหมด", value: stats.projects, icon: Briefcase, color: "bg-blue-50 text-blue-600" },
    { title: "ข้อความติดต่อ", value: stats.messages, icon: Users, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-gray-600" size={24} />
            ภาพรวมระบบ
          </h1>
          <p className="text-gray-500 mt-1">ยินดีต้อนรับเข้าสู่ระบบจัดการพอร์ตโฟลิโอของคุณ</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          รีเฟรช
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-md ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-col flex">
                <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    stat.value
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">สถานะระบบ</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Firebase เชื่อมต่อสำเร็จ
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Firestore พร้อมใช้งาน
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              อัปเดตล่าสุด: {lastUpdated}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
