"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Box, Code2, Server, Globe, Loader2 } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { getProjects, ProjectData } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack';

/* ═══════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════ */
const ParticleCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let id: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; hue: number };
    const particles: P[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4, vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.08, alpha: Math.random() * 0.32 + 0.08,
      hue: Math.random() > 0.55 ? 190 : 270,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,68%,${p.alpha})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 1 }} />;
};

/* ═══════════════════════════════════════
   TYPE CONFIG
═══════════════════════════════════════ */
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  frontend:  { color: '#22d3ee', border: 'rgba(34,211,238,0.35)',  bg: 'rgba(34,211,238,0.08)',  label: 'Frontend'   },
  backend:   { color: '#a855f7', border: 'rgba(168,85,247,0.35)', bg: 'rgba(168,85,247,0.08)',  label: 'Backend'    },
  fullstack: { color: '#10b981', border: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.08)',  label: 'Full Stack' },
};
const getType = (t?: string) => TYPE_CONFIG[t ?? ''] ?? { color: '#64748b', border: 'rgba(100,116,139,0.3)', bg: 'rgba(100,116,139,0.06)', label: t ?? '' };

/* ═══════════════════════════════════════
   PROJECT CARD
═══════════════════════════════════════ */
const ProjectCard: React.FC<{ project: ProjectData; index: number }> = ({ project, index }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const type = getType(project.type);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${index * 70}ms`,
      }}
      onClick={() => router.push(`/projects/${project.id}`)}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/projects/${project.id}`); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="h-full flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(15,23,42,0.8)',
          border: `1px solid ${hovered ? type.color + '45' : 'rgba(100,116,139,0.15)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: hovered ? `0 20px 60px ${type.color}15, 0 0 0 1px ${type.color}20` : 'none',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.image ? (
            <Image
              src={project.image} alt={project.title}
              fill sizes="(max-width:768px) 100vw,(max-width:1280px) 50vw,33vw"
              className="object-cover"
              style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s ease', opacity: hovered ? 1 : 0.82 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.8)' }}>
              <Code2 className="w-10 h-10 opacity-20 text-slate-400" />
            </div>
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(15,23,42,0.95) 0%,rgba(15,23,42,0.2) 55%,transparent 100%)' }} />

          {/* Scan line on hover */}
          <div className="absolute inset-x-0 h-[1px] pointer-events-none transition-all duration-500"
            style={{ top: hovered ? '100%' : '0%', background: `linear-gradient(90deg,transparent,${type.color},transparent)`, opacity: 0.6 }} />

          {/* Corner brackets */}
          <div className={`absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 transition-all duration-300`}
            style={{ borderColor: hovered ? type.color : 'transparent' }} />
          <div className={`absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 transition-all duration-300`}
            style={{ borderColor: hovered ? type.color : 'transparent' }} />

          {/* Type badge */}
          {project.type && (
            <div className="absolute top-3 right-3 px-2.5 py-1 font-orbitron text-[9px] tracking-widest rounded-lg backdrop-blur-sm"
              style={{ color: type.color, border: `1px solid ${type.border}`, background: type.bg }}>
              {type.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 md:p-7">
          {/* Top line */}
          <div className="w-full h-[1px] -mt-1 mb-5" style={{ background: `linear-gradient(90deg,transparent,${type.color}30,transparent)` }} />

          <div className="mb-3">
            <h3 className="font-orbitron text-xl font-bold leading-tight transition-colors duration-200"
              style={{ color: hovered ? type.color : '#f1f5f9' }}>
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="font-orbitron text-[9px] tracking-[0.3em] mt-1" style={{ color: type.color + 'aa' }}>
                {project.subtitle}
              </p>
            )}
          </div>

          {project.description && (
            <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3 mb-5">
              {project.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map(tag => (
              <span key={tag} className="font-orbitron text-[9px] px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(30,41,59,0.8)', color: '#64748b', border: '1px solid rgba(100,116,139,0.12)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(100,116,139,0.1)' }}>
            <div className="flex gap-2">
              {project.github && project.github !== '#' ? (
                <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)'; }}>
                  <Github className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg opacity-20 cursor-not-allowed"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.1)' }}>
                  <Github className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
              {project.link && project.link !== '#' ? (
                <a href={project.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${type.color}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)'; }}>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg opacity-20 cursor-not-allowed"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.1)' }}>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 font-orbitron text-[9px] tracking-widest transition-colors duration-200"
              style={{ color: hovered ? type.color : '#475569' }}>
              EXPLORE
              <ChevronRight className="w-3 h-3" style={{ transform: hovered ? 'translateX(2px)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
function ProjectsPageContent() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([])).finally(() => setLoading(false));
  }, []);

  const filters: { id: FilterType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all',       label: 'ทั้งหมด',  icon: <Box    className="w-3.5 h-3.5" />, color: '#94a3b8' },
    { id: 'frontend',  label: 'Frontend', icon: <Code2  className="w-3.5 h-3.5" />, color: '#22d3ee' },
    { id: 'backend',   label: 'Backend',  icon: <Server className="w-3.5 h-3.5" />, color: '#a855f7' },
    { id: 'fullstack', label: 'Full Stack',icon: <Globe  className="w-3.5 h-3.5" />, color: '#10b981' },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);
  const activeColor = filters.find(f => f.id === filter)?.color ?? '#94a3b8';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/20">

      {/* Particle bg */}
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 65%)', filter: 'blur(80px)' }} />

      {/* ── Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(34,211,238,0.1)' }}>
        <div className="absolute top-0 inset-x-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,#22d3ee60,#a855f760,transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between">
          <Link href="/"
            className="group flex items-center gap-2 font-orbitron text-xs tracking-widest transition-colors duration-200"
            style={{ color: '#22d3ee' }}>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_HOME
          </Link>
          <span className="font-orbitron font-black text-xl tracking-widest"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ARCHIVE
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-28 pb-24">

        {/* Page title */}
        <div className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,#22d3ee)' }} />
            <span className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-400 uppercase">Portfolio</span>
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,#22d3ee,transparent)' }} />
          </div>
          <h1 className="font-orbitron font-black text-white mb-4" style={{ fontSize: 'clamp(2rem,7vw,5rem)' }}>
            ALL{' '}
            <span style={{ background: 'linear-gradient(135deg,#22d3ee,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PROJECTS
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {t('projects.subtitle')} — คลังผลงานทั้งหมดที่เคยพัฒนา หลากหลายเทคโนโลยีและรูปแบบ ตอบโจทย์ทุกการใช้งาน ด้วยการออกแบบที่ใส่ใจในรายละเอียด
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.15)', backdropFilter: 'blur(16px)' }}>
            {filters.map(f => {
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron text-[10px] tracking-wider transition-all duration-200 focus:outline-none"
                  style={{
                    background: active ? `${f.color}15` : 'transparent',
                    color: active ? f.color : '#64748b',
                    border: `1px solid ${active ? f.color + '35' : 'transparent'}`,
                  }}>
                  {f.icon}
                  {f.label}
                </button>
              );
            })}
          </div>
          {!loading && (
            <div className="ml-auto font-orbitron text-[10px] tracking-widest px-4 py-2 rounded-xl"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.12)', color: activeColor }}>
              {filtered.length} PROJECT{filtered.length !== 1 ? 'S' : ''}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="font-orbitron text-[10px] tracking-widest text-slate-600 uppercase">กำลังโหลด...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.15)' }}>
              <Box className="w-7 h-7 text-slate-600" />
            </div>
            <p className="font-orbitron text-sm text-slate-500">ไม่มีผลงานในหมวดหมู่นี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
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