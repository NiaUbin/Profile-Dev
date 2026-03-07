"use client";

import { useState } from "react";
import { User, Camera, Save, Trash2 } from "lucide-react";

export default function ProfileAdmin() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Nattawat",
    role: "Full Stack Developer",
    bio: "นักพัฒนาเว็บผู้หลงใหลในการสร้างสรรค์ประสบการณ์ผู้ใช้ที่ดี",
    email: "contact@example.com",
    avatar: "https://github.com/shadcn.png"
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("บันทึกข้อมูลสำเร็จ!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="text-gray-600" size={24} />
            จัดการโปรไฟล์
          </h1>
          <p className="text-gray-500 mt-1">แก้ไขข้อมูลส่วนตัวและรูปภาพโปรไฟล์ของคุณ</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm">
          <div className="w-40 h-40 rounded-full border border-gray-300 overflow-hidden relative group">
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera size={32} className="text-white" />
            </div>
            {/* hidden file input */}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">{profileData.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{profileData.role}</p>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            รองรับ .jpg หรือ .png (สูงสุด 5MB)
          </p>
          
          <button className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors border border-transparent hover:border-red-200">
            <Trash2 size={16} /> ลบรูปภาพ
          </button>
        </div>

        {/* Profile Form Details */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
            ข้อมูลส่วนตัว
          </h3>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ตำแหน่ง / บทบาท</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">อีเมลติดต่อ</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">คำอธิบาย (Bio)</label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
