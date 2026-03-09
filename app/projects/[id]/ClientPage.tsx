"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, ExternalLink, Github,
  Code2, AlertCircle, Globe, X, ZoomIn, Layers, ArrowUpRight, Loader2
} from 'lucide-react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { getProjectById, ProjectData } from '@/lib/firestore';

/* ── Type config ── */
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  frontend:  { color: '#22d3ee', border: 'rgba(34,211,238,0.3)',  bg: 'rgba(34,211,238,0.07)',  label: 'Frontend'   },
  backend:   { color: '#a855f7', border: 'rgba(168,85,247,0.3)', bg: 'rgba(168,85,247,0.07)',  label: 'Backend'    },
  fullstack: { color: '#10b981', border: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.07)',  label: 'Full Stack' },
};
const getType = (t?: string) => TYPE_CONFIG[t ?? ''] ?? { color: '#64748b', border: 'rgba(100,116,139,0.3)', bg: 'rgba(100,116,139,0.06)', label: t ?? '' };

/* ─────────────────────────────────────────── */
function ProjectDetailPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject]     = useState<ProjectData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [lightbox, setLightbox]   = useState(false);
  const [imgIdx, setImgIdx]       = useState(0);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    getProjectById(id)
      .then(d => setProject(d ?? null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* keyboard nav for lightbox */
  const onKey = useCallback((e: KeyboardEvent) => {
    if (!lightbox) return;
    if (e.key === 'Escape') setLightbox(false);
    if (e.key === 'ArrowRight') setImgIdx(i => (i + 1) % allImages.length);
    if (e.key === 'ArrowLeft')  setImgIdx(i => (i - 1 + allImages.length) % allImages.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-cyan-400 opacity-50" />
      </div>
      <p className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-500 uppercase animate-pulse">Loading Data...</p>
    </div>
  );

  /* ── Not found ── */
  if (!project) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-20 h-20 flex items-center justify-center rounded-3xl"
        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
        <AlertCircle className="w-9 h-9 text-rose-400" />
      </div>
      <div className="text-center">
        <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-2">PROJECT NOT FOUND</h1>
        <p className="text-slate-500 text-sm max-w-sm">The requested project could not be found or has been removed.</p>
      </div>
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 px-6 py-3 rounded-xl font-orbitron text-xs tracking-widest transition-all duration-300"
        style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(34,211,238,0.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        GO BACK
      </button>
    </div>
  );

  const allImages = project.image
    ? [project.image, ...(project.images ?? [])].filter((v, i, a) => a.indexOf(v) === i)
    : (project.images ?? []);
  const curImage = allImages[imgIdx] ?? project.image;
  const type = getType(project.type);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 selection:bg-cyan-500/20">

      {/* ── Ambient bg ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${type.color}0a 0%, transparent 65%)`, filter: 'blur(80px)', transform: 'translateY(-30%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        {/* Horizontal grid lines */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute inset-x-0 h-[1px]"
            style={{ top: `${12 + i * 11}%`, background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.03) 50%,transparent)' }} />
        ))}
      </div>

      {/* ── Header ── */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(2,6,23,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(34,211,238,0.1)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[1px]"
          style={{ background: `linear-gradient(90deg,transparent,${type.color}60,transparent)` }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 font-orbitron text-xs tracking-widest transition-colors duration-200"
            style={{ color: '#22d3ee' }}
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK
          </button>

          <div className="flex items-center gap-2">
            {project.type && (
              <span
                className="font-orbitron text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full"
                style={{ color: type.color, border: `1px solid ${type.border}`, background: type.bg }}
              >
                {type.label}
              </span>
            )}
            <span className="font-orbitron font-black text-lg tracking-widest"
              style={{
                background: `linear-gradient(135deg, ${type.color}, #a855f7)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              DETAIL
            </span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-24 md:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Image viewer ── */}
          <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-28">

            {/* Main image */}
            <div
              className="relative w-full rounded-2xl overflow-hidden cursor-zoom-in group"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: `1px solid ${type.color}25`,
                boxShadow: `0 0 40px ${type.color}12`,
              }}
              onClick={() => curImage && setLightbox(true)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') { setLightbox(true); } }}
            >
              {/* Corner brackets */}
              {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2',
                'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 pointer-events-none ${cls}`}
                  style={{ borderColor: type.color + '60' }} />
              ))}

              {curImage ? (
                <>
                  <img
                    src={curImage}
                    loading="lazy"
                    alt={`${project.title} preview ${imgIdx + 1}`}
                    className="w-full h-auto max-h-[65vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(2,6,23,0.4)' }}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full scale-75 group-hover:scale-100 transition-transform duration-300"
                      style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid ${type.color}50`, boxShadow: `0 0 20px ${type.color}40` }}>
                      <ZoomIn className="w-5 h-5" style={{ color: type.color }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-video flex flex-col items-center justify-center gap-3 text-slate-700">
                  <Code2 className="w-12 h-12 opacity-25" />
                  <span className="font-orbitron text-xs tracking-widest opacity-30">NO PREVIEW</span>
                </div>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(100,116,139,0.2)' }}>
                  <span className="font-orbitron text-[9px] tracking-wider" style={{ color: type.color }}>{imgIdx + 1}</span>
                  <span className="text-slate-600 text-[9px]">/</span>
                  <span className="font-orbitron text-[9px] tracking-wider text-slate-500">{allImages.length}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {allImages.slice(0, 5).map((url, i) => {
                  const isLast = i === 4 && allImages.length > 5;
                  const active = imgIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => { setImgIdx(i); if (isLast) setLightbox(true); }}
                      className="relative shrink-0 w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden transition-all duration-200 focus:outline-none"
                      style={{
                        border: `1.5px solid ${active ? type.color : 'rgba(100,116,139,0.15)'}`,
                        opacity: active ? 1 : 0.5,
                        transform: active ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: active ? `0 0 12px ${type.color}40` : 'none',
                      }}
                    >
                      <img src={url} alt={`thumb ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                      {isLast && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center"
                          style={{ background: 'rgba(2,6,23,0.75)' }}>
                          <span className="font-orbitron font-bold text-white text-sm">+{allImages.length - 5}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Nav arrows (multi-image) */}
            {allImages.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = type.color + '50'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.2)'; }}
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: imgIdx === i ? 20 : 6,
                        height: 6,
                        background: imgIdx === i ? type.color : 'rgba(100,116,139,0.3)',
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = type.color + '50'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.2)'; }}
                >
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 pt-2 lg:pt-4">

            {/* Title block */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${type.color}20`, backdropFilter: 'blur(16px)' }}
            >
              {project.type && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(to bottom, ${type.color}, transparent)` }} />
                  <span className="font-orbitron text-[9px] tracking-[0.3em] uppercase" style={{ color: type.color }}>{type.label}</span>
                </div>
              )}
              <h1 className="font-orbitron font-black leading-tight text-white mb-2"
                style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)' }}>
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="font-orbitron text-xs tracking-wider mt-2" style={{ color: type.color + 'cc' }}>
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.12)', backdropFilter: 'blur(16px)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <h3 className="font-orbitron text-[9px] tracking-[0.3em] text-slate-500 uppercase">Overview</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            )}

            {/* Tech stack */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.12)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <h3 className="font-orbitron text-[9px] tracking-[0.3em] text-slate-500 uppercase">Tech Stack</h3>
              </div>
              {project.tech?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(tag => (
                    <span
                      key={tag}
                      className="font-orbitron text-[10px] tracking-wider px-3 py-1.5 rounded-lg cursor-default transition-all duration-200"
                      style={{ background: 'rgba(30,41,59,0.8)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.15)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = type.color;
                        (e.currentTarget as HTMLElement).style.borderColor = type.color + '40';
                        (e.currentTarget as HTMLElement).style.background = type.bg;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.8)';
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-xs italic">No stack information</p>
              )}
            </div>

            {/* Action buttons */}
            <div
              className="p-6 rounded-2xl flex flex-wrap gap-3"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.12)', backdropFilter: 'blur(16px)' }}
            >
              {project.link && project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 px-5 py-3 rounded-xl font-orbitron text-xs tracking-widest font-bold overflow-hidden relative transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${type.color}22, ${type.color}10)`,
                    border: `1px solid ${type.border}`,
                    color: type.color,
                    boxShadow: `0 0 20px ${type.color}18`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${type.color}35`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${type.color}18`; }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ background: `linear-gradient(90deg,transparent,${type.color}12,transparent)` }} />
                  <Globe className="w-4 h-4 relative" />
                  <span className="relative">Visit Live Site</span>
                  <ArrowUpRight className="w-3.5 h-3.5 relative" />
                </a>
              )}

              {project.github && project.github !== '#' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 px-5 py-3 rounded-xl font-orbitron text-xs tracking-widest font-bold transition-all duration-300"
                  style={{
                    background: 'rgba(30,41,59,0.8)',
                    border: '1px solid rgba(100,116,139,0.2)',
                    color: '#94a3b8',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.4)';
                    (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.2)';
                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  }}
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}

              {(!project.link || project.link === '#') && (!project.github || project.github === '#') && (
                <p className="text-slate-600 text-xs italic font-rajdhani">No external links available.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Lightbox ── */}
      {lightbox && curImage && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(2,6,23,0.97)', backdropFilter: 'blur(24px)' }}
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 z-20"
            style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(100,116,139,0.2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.2)'; }}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          {/* Image */}
          <div className="relative flex-1 flex items-center justify-center w-full min-h-0" onClick={e => e.stopPropagation()}>
            <img
              src={curImage}
              loading="lazy"
              alt={project.title}
              className="max-w-full max-h-full object-contain rounded-2xl"
              style={{ boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${type.color}20` }}
            />
          </div>

          {/* Nav */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-4 mt-6 z-20" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid ${type.color}30` }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: type.color }} />
              </button>

              <div className="font-orbitron text-xs px-4 py-2 rounded-full"
                style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }}>
                <span style={{ color: type.color }}>{imgIdx + 1}</span> / {allImages.length}
              </div>

              <button
                onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid ${type.color}30` }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: type.color }} />
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