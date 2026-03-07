"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Code2, Type, AlertCircle, Box, Globe, X, ZoomIn } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import { getProjectById, ProjectData } from '@/lib/firestore';

function ProjectDetailPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  // Combine cover image and gallery images into one unique array
  const allImages = project.image 
    ? [project.image, ...(project.images || [])].filter((v, i, a) => a.indexOf(v) === i)
    : (project.images || []);

  const currentImage = allImages[activeImageIndex] || project.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

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

      <main className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-24 md:pt-28 pb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-28 animate-in fade-in slide-in-from-left-8 duration-700">
            <div 
              className="relative w-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] group border border-slate-800/50 cursor-zoom-in bg-slate-900/20"
              onClick={() => currentImage && setIsImageOpen(true)}
            >
              {currentImage ? (
                <>
                  <img 
                    src={currentImage} 
                    alt={`${project.title} - Preview ${activeImageIndex + 1}`} 
                    className="w-full h-auto max-h-[70vh] object-contain object-center group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors duration-400 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                      <ZoomIn className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-[4/3] flex flex-col items-center justify-center text-slate-700">
                  <Code2 className="w-16 h-16 mb-4 opacity-50" />
                  <span className="font-orbitron font-bold text-base opacity-50">NO PREVIEW</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {allImages.slice(0, 4).map((imgUrl, idx) => {
                  const isLastThumbnail = idx === 3;
                  const remainingImages = allImages.length - 4;
                  const showOverlay = isLastThumbnail && remainingImages > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        if (showOverlay) setIsImageOpen(true);
                      }}
                      className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all group ${
                        activeImageIndex === idx 
                          ? "border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] opacity-100 scale-105" 
                          : "border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600"
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {showOverlay && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center transition-colors group-hover:bg-slate-950/50">
                          <span className="font-orbitron font-bold text-white text-sm sm:text-base">+{remainingImages}</span>
                          <span className="text-[9px] sm:text-[10px] text-slate-300 font-sans mt-0.5">เพิ่มเติม</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col pt-2 lg:pt-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            
            {/* Header / Title area */}
            <div className="mb-8">
              {project.type && (
                <div className="inline-block px-3 py-1 bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 text-xs font-orbitron font-medium tracking-widest rounded-full mb-4">
                  {getTypeLabel(project.type)}
                </div>
              )}
              <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-cyan-400 font-sans text-sm sm:text-base font-medium leading-relaxed">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Overivew text */}
            <div className="prose prose-invert max-w-none text-slate-300 font-sans text-sm sm:text-base leading-relaxed mb-8">
              {project.description ? (
                <div className="whitespace-pre-wrap font-light opacity-90">{project.description}</div>
              ) : (
                <div className="italic opacity-50">No description provided for this project.</div>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-10">
              <h3 className="font-orbitron text-xs text-slate-400 tracking-widest flex items-center gap-2 mb-4 uppercase">
                <Code2 className="w-4 h-4 text-emerald-500" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech?.length > 0 ? project.tech.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 text-slate-200 text-xs font-medium rounded-md cursor-default hover:bg-slate-700 hover:text-emerald-400 transition-colors"
                  >
                    {tag}
                  </span>
                )) : (
                  <span className="text-slate-500 text-xs italic">Unknown stack</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-auto border-t border-slate-800/60 pt-8">
              {project.link && project.link !== '#' && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-sans text-sm font-semibold transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.5)]"
                >
                  <Globe className="w-4 h-4" />
                  Visit Live Site
                </a>
              )}
              
              {project.github && project.github !== '#' && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-sans text-sm font-medium transition-all"
                >
                  <Github className="w-4 h-4" />
                  View Source Code
                </a>
              )}

              {(!project.github || project.github === '#') && (!project.link || project.link === '#') && (
                <div className="text-slate-500 text-sm italic">
                  No external links available.
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {isImageOpen && currentImage && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-lg p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          
          {/* Close Button Top Right */}
          <button 
            onClick={() => setIsImageOpen(false)}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-3 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full transition-colors z-20 focus:outline-none"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Main Image Area */}
          <div 
            className="relative w-full flex-1 flex flex-col items-center justify-center cursor-zoom-out min-h-0" 
            onClick={() => setIsImageOpen(false)}
          >
            <img 
              src={currentImage} 
              alt={project.title} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation Controls Below Image */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-6 mt-6 sm:mt-8 z-20 pb-2">
              <button
                onClick={handlePrevImage}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-transform focus:outline-none hover:scale-110 shadow-lg border border-slate-700/50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
              </button>

              <div className="text-slate-300 font-sans font-medium text-sm sm:text-base bg-slate-900/50 px-5 py-2 rounded-full border border-slate-800 flex items-center gap-2">
                <span className="text-white">{activeImageIndex + 1}</span>
                <span className="text-slate-500">of</span>
                <span className="text-slate-400">{allImages.length}</span>
              </div>

              <button
                onClick={handleNextImage}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-transform focus:outline-none hover:scale-110 shadow-lg border border-slate-700/50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
              </button>
            </div>
          )}
        </div>
      )}
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
