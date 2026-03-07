"use client";

import React, { useState, useEffect } from 'react';
import { CardFrame } from './GamerUI';
import { ExternalLink, Github, Box, Code2, Server, Globe, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProjects, ProjectData } from '@/lib/firestore';


type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack';

export const Projects: React.FC = () => {
  const router = useRouter();
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
    { id: 'all', label: 'ทั้งหมด', icon: <Box className="w-3 h-3" /> },
    { id: 'frontend', label: 'Frontend', icon: <Code2 className="w-3 h-3" /> },
    { id: 'backend', label: 'Backend', icon: <Server className="w-3 h-3" /> },
    { id: 'fullstack', label: 'Full Stack', icon: <Globe className="w-3 h-3" /> },
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center w-full">
              <Box className="w-16 h-16 text-slate-700/50 mb-4" />
              <p className="font-sans text-xl text-slate-400 font-medium">ไม่มีผลงาน</p>
              <p className="font-sans text-sm text-slate-500 mt-2">ยังไม่มีโปรเจกต์ในฐานข้อมูลหรือหมวดหมู่นี้</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardFrame className="h-full flex flex-col p-0 overflow-hidden !rounded-lg transition-all duration-300 group-hover:-translate-y-1 md:group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {project.image ? (
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                        <Code2 className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    
                    {/* Type Badge */}
                    {project.type && (
                      <div className={`absolute top-3 right-3 px-2 py-0.5 border text-[9px] md:text-[10px] font-orbitron font-bold tracking-wider rounded ${getTypeColor(project.type)}`}>
                        {getTypeLabel(project.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <div className="mb-2">
                      <h3 className="font-orbitron text-base md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-[10px] md:text-xs text-slate-500 font-orbitron">{project.subtitle}</p>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="text-slate-400 text-xs md:text-sm font-light mb-4 flex-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] md:text-[10px] font-orbitron px-2 py-0.5 bg-slate-800 text-slate-500 rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[9px] md:text-[10px] font-orbitron px-2 py-0.5 bg-slate-800 text-slate-500 rounded">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div className="flex gap-3">
                        {project.github && project.github !== '#' && (
                          <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white transition-colors p-1 z-10 relative">
                            <Github className="w-4 h-4 md:w-5 md:h-5" />
                          </a>
                        )}
                        {project.link && project.link !== '#' && (
                          <a href={project.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white transition-colors p-1 z-10 relative">
                            <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                          </a>
                        )}
                        {(!project.github || project.github === '#') && (!project.link || project.link === '#') && (
                          <>
                            <button onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white transition-colors p-1 z-10 relative cursor-not-allowed opacity-50">
                              <Github className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white transition-colors p-1 z-10 relative cursor-not-allowed opacity-50">
                              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </>
                        )}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-orbitron text-cyan-400/50 group-hover:text-cyan-400 transition-colors z-10 relative">
                        ดูเพิ่มเติม →
                      </span>
                    </div>
                  </div>
                </CardFrame>
              </div>
            ))}
          </div>
          )}

          {/* View All Button */}
          {projects.length > 0 && (
          <div className="flex justify-center mt-12 md:mt-16">
            <Link href="/projects" className="group flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 font-orbitron text-sm md:text-base tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              ดูผลงานทั้งหมด
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          )}
        </>
      )}
    </div>
  );
};
