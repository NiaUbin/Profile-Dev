"use client";

import { useState } from "react";
import { Code2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([
    { id: 1, name: "React", level: 90, category: "Frontend" },
    { id: 2, name: "Next.js", level: 85, category: "Frontend" },
    { id: 3, name: "Node.js", level: 80, category: "Backend" },
    { id: 4, name: "TypeScript", level: 88, category: "Language" },
    { id: 5, name: "Tailwind CSS", level: 95, category: "Frontend" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Code2 className="text-gray-600" size={24} />
            จัดการทักษะ (Skills)
          </h1>
          <p className="text-gray-500 mt-1">เพิ่ม ลบ หรือแก้ไขทักษะความสามารถของคุณ</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          เพิ่มทักษะใหม่
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาทักษะ หรือ หมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="all">ทุกหมวดหมู่</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Language">Language</option>
        </select>
      </div>

      {/* Skills List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden text-sm">
        <div className="grid grid-cols-12 bg-gray-50 text-gray-600 font-medium p-4 border-b border-gray-200">
          <div className="col-span-5 sm:col-span-4">ชื่อทักษะ</div>
          <div className="col-span-4 sm:col-span-3">หมวดหมู่</div>
          <div className="col-span-3 sm:col-span-3 text-right sm:text-left">ความชำนาญ</div>
          <div className="hidden sm:block sm:col-span-2 text-right">จัดการ</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="grid grid-cols-12 items-center p-4 hover:bg-gray-50 transition-colors">
              <div className="col-span-5 sm:col-span-4 font-medium text-gray-900">
                {skill.name}
              </div>
              <div className="col-span-4 sm:col-span-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs border border-gray-200">
                  {skill.category}
                </span>
              </div>
              <div className="col-span-3 sm:col-span-3 flex items-center gap-3 justify-end sm:justify-start">
                <div className="w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 font-medium text-xs w-8 text-right bg-blue-50 text-blue-700 px-1 py-0.5 rounded">
                  {skill.level}%
                </span>
              </div>
              <div className="col-span-12 sm:col-span-2 flex gap-2 justify-end mt-3 sm:mt-0">
                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredSkills.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              ไม่พบทักษะที่ค้นหา
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
