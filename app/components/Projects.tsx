"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Box, Code2, Server, Globe, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProjects, ProjectData } from '@/lib/firestore';

type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack';

/* ── Type config ── */
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  frontend: { color: '#22d3ee', border: 'rgba(34,211,238,0.35)',  bg: 'rgba(34,211,238,0.08)',  label: 'Frontend'  },
  backend:  { color: '#a855f7', border: 'rgba(168,85,247,0.35)', bg: 'rgba(168,85,247,0.08)',  label: 'Backend'   },
  fullstack:{ color: '#10b981', border: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.08)',  label: 'Full Stack'},
};
const fallbackType = { color: '#64748b', border: 'rgba(100,116,139,0.3)', bg: 'rgba(100,116,139,0.06)', label: '—' };
const getType = (t: string) => TYPE_CONFIG[t] ?? fallbackType;

/* ── Project card ── */
const ProjectCard: React.FC<{ project: ProjectData; index: number }> = ({ project, index }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const type = getType(project.type ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group cursor-pointer transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${index * 80}ms`,
      }}
      onClick={() => router.push(`/projects/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/projects/${project.id}`); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-400"
        style={{
          background: 'rgba(15,23,42,0.8)',
          border: `1px solid ${hovered ? type.color + '40' : 'rgba(100,116,139,0.15)'}`,
          backdropFilter: 'blur(16px)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? `0 16px 48px ${type.color}18, 0 0 0 1px ${type.color}20` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none overflow-hidden rounded-2xl">
          <div
            className="absolute top-0 left-0 w-8 h-[1.5px] transition-all duration-300"
            style={{ background: hovered ? type.color : 'transparent' }}
          />
          <div
            className="absolute top-0 left-0 h-8 w-[1.5px] transition-all duration-300"
            style={{ background: hovered ? type.color : 'transparent' }}
          />
        </div>

        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700"
              style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'rgba(30,41,59,0.8)' }}>
              <Code2 className="w-10 h-10 opacity-20 text-slate-400" />
            </div>
          )}
          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 50%, transparent 100%)`,
            }}
          />
          {/* Scan line on hover */}
          <div
            className="absolute inset-x-0 h-[1px] pointer-events-none transition-all duration-500"
            style={{
              top: hovered ? '100%' : '0%',
              background: `linear-gradient(90deg, transparent, ${type.color}, transparent)`,
              opacity: 0.6,
            }}
          />
          {/* Type badge */}
          {project.type && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1 font-orbitron text-[9px] tracking-widest rounded-lg"
              style={{ color: type.color, border: `1px solid ${type.border}`, background: type.bg }}
            >
              {type.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          {/* Title */}
          <div className="mb-3">
            <h3
              className="font-orbitron text-base font-bold leading-tight transition-colors duration-200"
              style={{ color: hovered ? type.color : '#f1f5f9' }}
            >
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="font-orbitron text-[9px] tracking-widest text-slate-600 mt-1">{project.subtitle}</p>
            )}
          </div>

          {project.description && (
            <p className="text-slate-400 text-xs leading-relaxed flex-1 line-clamp-2 mb-4">
              {project.description}
            </p>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="font-orbitron text-[9px] px-2 py-1 rounded-md"
                style={{ background: 'rgba(30,41,59,0.8)', color: '#64748b', border: '1px solid rgba(100,116,139,0.12)' }}
              >
                {tag}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span
                className="font-orbitron text-[9px] px-2 py-1 rounded-md"
                style={{ background: 'rgba(30,41,59,0.8)', color: '#475569', border: '1px solid rgba(100,116,139,0.12)' }}
              >
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(100,116,139,0.1)' }}
          >
            <div className="flex gap-2">
              {project.github && project.github !== '#' ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.4)'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)'; (e.currentTarget as HTMLElement).style.color = ''; }}
                >
                  <Github className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="w-7 h-7 flex items-center justify-center rounded-lg opacity-25 cursor-not-allowed"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.1)' }}>
                  <Github className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
              {project.link && project.link !== '#' ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${type.color}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)'; }}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="w-7 h-7 flex items-center justify-center rounded-lg opacity-25 cursor-not-allowed"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.1)' }}>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </div>

            <div
              className="flex items-center gap-1 font-orbitron text-[9px] tracking-widest transition-all duration-200"
              style={{ color: hovered ? type.color : '#475569' }}
            >
              ดูเพิ่มเติม
              <ChevronRight className="w-3 h-3" style={{ transform: hovered ? 'translateX(2px)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ── */
export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filters: { id: FilterType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all',       label: 'ทั้งหมด', icon: <Box className="w-3 h-3" />,   color: '#94a3b8' },
    { id: 'frontend',  label: 'Frontend', icon: <Code2 className="w-3 h-3" />, color: '#22d3ee' },
    { id: 'backend',   label: 'Backend',  icon: <Server className="w-3 h-3" />,color: '#a855f7' },
    { id: 'fullstack', label: 'Full Stack',icon: <Globe className="w-3 h-3" />,color: '#10b981' },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.type === filter);
  const activeColor = filters.find(f => f.id === filter)?.color ?? '#94a3b8';

  return (
    <div className="section-container relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,#22d3ee)' }} />
            <span className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-400 uppercase">PROJECTS.EXE</span>
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,#22d3ee,transparent)' }} />
          </div>
          <h2 className="font-orbitron font-black text-white" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)' }}>
            ผลงานของฉัน
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {loading ? '...' : `${filteredProjects.length} โปรเจกต์`}
          </p>
        </div>

        {/* Filter pills */}
        <div
          className="flex flex-wrap gap-2 p-1.5 rounded-2xl"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.15)', backdropFilter: 'blur(16px)' }}
        >
          {filters.map(f => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-orbitron text-[10px] tracking-wider transition-all duration-200 focus:outline-none"
                style={{
                  background: active ? `${f.color}15` : 'transparent',
                  color: active ? f.color : '#64748b',
                  border: `1px solid ${active ? f.color + '35' : 'transparent'}`,
                }}
              >
                {f.icon}
                <span className="hidden sm:inline">{f.label}</span>
                <span className="sm:hidden">{f.id === 'all' ? 'All' : f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="font-orbitron text-[10px] tracking-widest text-slate-600 uppercase">กำลังโหลด...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-2xl"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.15)' }}
          >
            <Box className="w-7 h-7 text-slate-600" />
          </div>
          <p className="font-orbitron text-sm text-slate-500">ไม่มีผลงานในหมวดหมู่นี้</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative z-10">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* View all */}
          {projects.length > 0 && (
            <div className="flex justify-center mt-14 md:mt-16 relative z-10">
              <Link
                href="/projects"
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-orbitron text-xs tracking-widest overflow-hidden transition-all duration-300"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  color: '#22d3ee',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,0.5)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(34,211,238,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,0.25)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.06),transparent)' }} />
                <span className="relative">ดูผลงานทั้งหมด</span>
                <ArrowRight className="w-4 h-4 relative transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};