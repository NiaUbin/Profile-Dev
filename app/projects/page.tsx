"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ExternalLink, Github, Box, Code2, Server, Globe } from 'lucide-react';
import { CardFrame } from '../components/GamerUI';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { getProjects, ProjectData } from '@/lib/firestore';

import { useRouter } from 'next/navigation';
type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack';

function ProjectsPageContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: <Box className="w-4 h-4" /> },
    { id: 'frontend', label: 'Frontend', icon: <Code2 className="w-4 h-4" /> },
    { id: 'backend', label: 'Backend', icon: <Server className="w-4 h-4" /> },
    { id: 'fullstack', label: 'Full Stack', icon: <Globe className="w-4 h-4" /> },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-5]">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
      </div>

      {/* Header Pipeline */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between w-full">
          <Link href="/" className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron tracking-wider">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base font-bold">BACK_TO_HOME</span>
          </Link>
          <div className="font-orbitron font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 glitch">
            ARCHIVE
          </div>
        </div>
      </header>

      <main className="section-container pt-32 pb-24 relative z-10 w-full">
        {/* Page Title */}
        <div className="mb-12 md:mb-20 text-center md:text-left animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
            ALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">PROJECTS</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl font-light mx-auto md:mx-0">
            {t('projects.subtitle')} - คลังผลงานทั้งหมดที่เคยพัฒนา หลากหลายเทคโนโลยีและรูปแบบ ตอบโจทย์ทุกการใช้งาน ด้วยการออกแบบที่ใส่ใจในรายละเอียด
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-12 animate-in py-2 fade-in duration-700 delay-150">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 font-orbitron text-xs sm:text-sm tracking-wider border rounded-lg transition-all duration-300 ${
                filter === f.id 
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full min-h-[40vh]">
            <Box className="w-20 h-20 text-slate-700/30 mb-6" />
            <h2 className="font-orbitron font-bold text-2xl text-slate-400">PROJECTS_NOT_FOUND</h2>
            <p className="font-sans text-slate-500 mt-2">ยังไม่มีประวัติผลงานในหมวดหมู่นี้</p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="group animate-in fade-in zoom-in-95 duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardFrame className="h-full flex flex-col p-0 overflow-hidden !rounded-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 bg-slate-900/40">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    {project.image ? (
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Code2 className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                    
                    {/* Overlay Type Badge */}
                    {project.type && (
                      <div className={`absolute top-4 right-4 px-3 py-1 border text-[10px] md:text-xs font-orbitron font-bold tracking-widest rounded shadow-lg backdrop-blur-md ${getTypeColor(project.type)}`}>
                        {getTypeLabel(project.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-slate-950/80 backdrop-blur-sm -mt-2">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                    
                    <div className="mb-4">
                      <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-xs text-cyan-500/80 font-orbitron tracking-widest uppercase">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 font-light">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map(tag => (
                        <span key={tag} className="text-[10px] font-orbitron px-2.5 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-md group-hover:border-slate-700 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-5 border-t border-slate-800/80">
                      <div className="flex gap-4">
                        {project.github && project.github !== '#' && (
                        <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white transition-colors group/icon relative z-10 p-1">
                          <Github className="w-5 h-5 group-hover/icon:-translate-y-1 transition-transform" />
                        </a>
                        )}
                        {project.link && project.link !== '#' && (
                        <a href={project.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-cyan-400 transition-colors group/icon z-10 p-1 relative">
                          <ExternalLink className="w-5 h-5 group-hover/icon:-translate-y-1 transition-transform" />
                        </a>
                        )}
                      </div>
                      <span className="text-xs font-orbitron font-bold text-cyan-500/50 group-hover:text-cyan-400 transition-colors tracking-wider flex items-center gap-2 group/link z-10 relative">
                        EXPLORE
                        <ChevronLeft className="w-4 h-4 rotate-180 group-hover/link:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </CardFrame>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <LanguageProvider>
      <ProjectsPageContent />
    </LanguageProvider>
  );
}
