"use client";

import React, { useState } from 'react';
import { CardFrame } from './GamerUI';
import { ExternalLink, Github, Box, Code2, Server, Globe, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const ALL_PROJECTS = [
  {
    id: '1',
    title: 'ร้านค้าออนไลน์',
    subtitle: 'E-Commerce Platform',
    description: 'เว็บไซต์ขายสินค้าครบวงจร ระบบตะกร้าสินค้า ชำระเงินออนไลน์ และจัดการสต็อก',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    imageUrl: 'https://picsum.photos/seed/ecommerce/600/400',
    link: '#',
    github: '#',
    type: 'fullstack',
    rarity: 'Legendary'
  },
  {
    id: '2',
    title: 'แดชบอร์ดผู้ดูแล',
    subtitle: 'Admin Dashboard',
    description: 'ระบบจัดการข้อมูลสำหรับผู้ดูแล พร้อมกราฟแสดงผลและรายงาน Real-time',
    tags: ['React', 'TypeScript', 'Chart.js', 'REST API'],
    imageUrl: 'https://picsum.photos/seed/dashboard/600/400',
    link: '#',
    github: '#',
    type: 'frontend',
    rarity: 'Epic'
  },
  {
    id: '3',
    title: 'REST API Service',
    subtitle: 'Backend API',
    description: 'ระบบ API สำหรับจัดการผู้ใช้, Authentication และเชื่อมต่อฐานข้อมูล',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    imageUrl: 'https://picsum.photos/seed/api/600/400',
    link: '#',
    github: '#',
    type: 'backend',
    rarity: 'Epic'
  },
  {
    id: '4',
    title: 'เว็บไซต์พอร์ตโฟลิโอ',
    subtitle: 'Personal Website',
    description: 'เว็บไซต์แนะนำตัวแบบ Responsive รองรับทุกอุปกรณ์ พร้อม SEO ที่ดี',
    tags: ['Next.js', 'Tailwind', 'Framer Motion'],
    imageUrl: 'https://picsum.photos/seed/portfolio/600/400',
    link: '#',
    github: '#',
    type: 'frontend',
    rarity: 'Rare'
  },
  {
    id: '5',
    title: 'ระบบจองห้องประชุม',
    subtitle: 'Booking System',
    description: 'ระบบจองห้องประชุมออนไลน์ พร้อมปฏิทินและการแจ้งเตือน',
    tags: ['React', 'Node.js', 'MySQL', 'Socket.io'],
    imageUrl: 'https://picsum.photos/seed/booking/600/400',
    link: '#',
    github: '#',
    type: 'fullstack',
    rarity: 'Rare'
  },
  {
    id: '6',
    title: 'Landing Page',
    subtitle: 'Marketing Website',
    description: 'หน้าเว็บโปรโมทสินค้า ออกแบบสวยงาม โหลดเร็ว และ Mobile First',
    tags: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    imageUrl: 'https://picsum.photos/seed/landing/600/400',
    link: '#',
    github: '#',
    type: 'frontend',
    rarity: 'Common'
  }
];

type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack';

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: <Box className="w-3 h-3" /> },
    { id: 'frontend', label: 'Frontend', icon: <Code2 className="w-3 h-3" /> },
    { id: 'backend', label: 'Backend', icon: <Server className="w-3 h-3" /> },
    { id: 'fullstack', label: 'Full Stack', icon: <Globe className="w-3 h-3" /> },
  ];

  const filteredProjects = filter === 'all' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'frontend': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      case 'backend': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
      case 'fullstack': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'frontend': return 'Frontend';
      case 'backend': return 'Backend';
      case 'fullstack': return 'Full Stack';
      default: return type;
    }
  };

  return (
    <div className="section-container">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="font-orbitron text-2xl md:text-4xl font-black mb-2 text-white">ผลงานของฉัน</h2>
          <p className="text-slate-500 font-orbitron text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em]">PROJECTS.EXE</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-orbitron text-[10px] md:text-xs tracking-wider border rounded-md transition-all ${
                filter === f.id 
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' 
                  : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {f.icon}
              <span className="hidden sm:inline">{f.label}</span>
              <span className="sm:hidden">{f.id === 'all' ? 'All' : f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group cursor-pointer">
            <CardFrame className="h-full flex flex-col p-0 overflow-hidden !rounded-lg transition-all duration-300 group-hover:-translate-y-1 md:group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                
                {/* Type Badge */}
                <div className={`absolute top-3 right-3 px-2 py-0.5 border text-[9px] md:text-[10px] font-orbitron font-bold tracking-wider rounded ${getTypeColor(project.type)}`}>
                  {getTypeLabel(project.type)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="font-orbitron text-base md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-orbitron">{project.subtitle}</p>
                </div>
                
                <p className="text-slate-400 text-xs md:text-sm font-light mb-4 flex-1 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] md:text-[10px] font-orbitron px-2 py-0.5 bg-slate-800 text-slate-500 rounded">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[9px] md:text-[10px] font-orbitron px-2 py-0.5 bg-slate-800 text-slate-500 rounded">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="flex gap-3">
                    <button className="text-slate-500 hover:text-white transition-colors p-1">
                      <Github className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="text-slate-500 hover:text-white transition-colors p-1">
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-orbitron text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                    ดูเพิ่มเติม →
                  </span>
                </div>
              </div>
            </CardFrame>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-12 md:mt-16">
        <Link href="/projects" className="group flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 font-orbitron text-sm md:text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          ดูผลงานทั้งหมด
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
