"use client";

import { useState } from "react";
import { Briefcase, Plus, Edit2, Trash2, Search, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function ProjectsAdmin() {
  const [projects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Full Stack",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
      tech: ["Next.js", "Tailwind", "Node.js", "MongoDB"],
      link: "#"
    },
    {
      id: 2,
      title: "Portfolio Website v2",
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      tech: ["React", "CSS Modules", "Framer Motion"],
      link: "#"
    },
    {
      id: 3,
      title: "Task Management API",
      category: "Backend",
      image: "",
      tech: ["Express", "PostgreSQL", "Prisma"],
      link: "#"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-gray-600" size={24} />
            จัดการผลงาน (Projects)
          </h1>
          <p className="text-gray-500 mt-1">เพิ่ม ลบ หรือแก้ไขผลงานพอร์ตโฟลิโอของคุณ</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          เพิ่มผลงานใหม่
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อผลงาน หรือ หมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="all">ทุกหมวดหมู่</option>
          <option value="Full Stack">Full Stack</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-48 bg-gray-100 border-b border-gray-200 flex-shrink-0">
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-xs">ไม่มีรูปภาพ</span>
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-1.5 bg-white text-gray-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200 hover:border-blue-200 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button className="p-1.5 bg-white text-gray-600 hover:text-red-600 rounded-md shadow-sm border border-gray-200 hover:border-red-200 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded text-xs font-medium text-gray-700 shadow-sm">
                {project.category}
              </span>
            </div>

            {/* Content Container */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map((t, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-4 mt-auto border-t border-gray-100">
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink size={14} />
                  ดูเว็บไซต์จริง
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
          <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">ไม่พบผลงานที่ค้นหา</p>
        </div>
      )}
    </div>
  );
}
