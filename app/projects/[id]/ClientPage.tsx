"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink, Github, Code2, Type, AlertCircle, Box, Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import { getProjectById, ProjectData } from '@/lib/firestore';

function ProjectDetailPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        const data = await getProjectById(id);
        if (data) {
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  const getTypeLabel = (type?: string) => {
    if (!type) return '';
    switch (type) {
      case 'frontend': return 'Frontend';
      case 'backend': return 'Backend';
      case 'fullstack': return 'Full Stack';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-20">
        <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
        <p className="mt-6 font-orbitron text-cyan-400 tracking-widest text-sm animate-pulse">LOADING_DATA...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-20 px-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-4 text-center">PROJECT NOT FOUND</h1>
        <p className="text-slate-400 font-sans text-center mb-8 max-w-md">The requested project could not be found or has been removed from the database.</p>
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 font-orbitron text-sm tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          GO BACK
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
      </div>

      {/* Header Pipeline */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between w-full">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron tracking-wider cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base font-bold">BACK</span>
          </button>
          <div className="font-orbitron font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 glitch">
            DETAIL
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 pt-32">
        {/* Cover Image */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden mb-12 sm:mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 animate-in fade-in zoom-in-95 duration-700 group">
          {project.image ? (
            <Image 
              src={project.image} 
              alt={project.title} 
              fill
              autoFocus
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-700">
              <Code2 className="w-20 h-20 mb-4 opacity-50" />
              <span className="font-orbitron font-bold text-lg opacity-50">NO IMAGE PREVIEW</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
          
          {/* Overlay details */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            {project.type && (
              <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs sm:text-sm font-orbitron font-bold tracking-widest rounded backdrop-blur-md mb-4 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                {getTypeLabel(project.type)}
              </div>
            )}
            <h1 className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight filter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="mt-3 text-cyan-400/90 font-sans text-sm sm:text-lg font-medium tracking-wide">
                {project.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Box className="w-6 h-6 text-cyan-400" />
                OVERVIEW
              </h2>
              <div className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-light">
                {project.description || "No description provided."}
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            {/* Tech Stack */}
            <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-shadow"></div>
              <h3 className="font-orbitron text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                TECHNOLOGIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech?.length > 0 ? project.tech.map((tag) => (
                  <span 
                    key={tag} 
                    className="font-sans px-3 py-1.5 bg-slate-950/50 border border-slate-700/50 text-slate-200 text-sm font-medium rounded-lg hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                )) : (
                  <span className="text-slate-500 text-sm italic">No technologies listed</span>
                )}
              </div>
            </section>

            {/* Links */}
            <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow"></div>
              <h3 className="font-orbitron text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-purple-400" />
                LINKS
              </h3>
              <div className="flex flex-col gap-4">
                {project.github && project.github !== '#' && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all font-sans text-slate-300 hover:text-white group/link"
                  >
                    <Github className="w-5 h-5 text-slate-400 group-hover/link:text-purple-400 transition-colors" />
                    <span className="font-medium">GitHub Repository</span>
                  </a>
                )}
                
                {project.link && project.link !== '#' && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all font-sans text-slate-300 hover:text-white group/link"
                  >
                    <Globe className="w-5 h-5 text-slate-400 group-hover/link:text-purple-400 transition-colors" />
                    <span className="font-medium">Live Demo</span>
                  </a>
                )}

                {(!project.github || project.github === '#') && (!project.link || project.link === '#') && (
                  <div className="text-slate-500 font-sans text-sm italic py-2">
                    No public links available for this project.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ClientProjectDetailPage() {
  return (
    <LanguageProvider>
      <ProjectDetailPageContent />
    </LanguageProvider>
  );
}
