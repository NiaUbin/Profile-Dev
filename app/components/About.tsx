"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Code2, Server, Zap, Briefcase, GraduationCap, Globe, FileText } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { getAboutData, AboutData } from '@/lib/firestore';

/* ═══════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════ */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; hue: number };
    const particles: P[] = Array.from({ length: 45 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.6 + 0.4,
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -Math.random() * 0.35 - 0.08,
      alpha: Math.random() * 0.35 + 0.08,
      hue:   Math.random() > 0.55 ? 190 : 270,   // cyan or purple
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 68%, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

/* ═══════════════════════════════════════
   SKILL ROW
═══════════════════════════════════════ */
const SkillRow: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-default transition-all duration-200"
      style={{
        background: hovered ? `${color}0e` : 'rgba(30,41,59,0.55)',
        border: `1px solid ${hovered ? color + '40' : 'rgba(100,116,139,0.12)'}`,
        boxShadow: hovered ? `0 0 14px ${color}12` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300"
        style={{ background: color, boxShadow: hovered ? `0 0 12px ${color}` : `0 0 5px ${color}70` }} />
      <span className="font-rajdhani font-semibold text-sm tracking-wide transition-colors duration-200 flex-1"
        style={{ color: hovered ? '#f1f5f9' : '#94a3b8' }}>
        {name}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════
   TOOL TAG
═══════════════════════════════════════ */
const ToolTag: React.FC<{ name: string }> = ({ name }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="inline-flex items-center px-3.5 py-1.5 rounded-lg font-rajdhani font-semibold text-sm cursor-default transition-all duration-200"
      style={{
        background: hovered ? 'rgba(34,211,238,0.08)' : 'rgba(30,41,59,0.6)',
        border: `1px solid ${hovered ? 'rgba(34,211,238,0.35)' : 'rgba(100,116,139,0.15)'}`,
        color: hovered ? '#22d3ee' : '#94a3b8',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {name}
    </span>
  );
};

/* ═══════════════════════════════════════
   GLASS CARD
═══════════════════════════════════════ */
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; accent?: string }> = ({ children, className = '', accent }) => (
  <div
    className={`rounded-2xl p-5 md:p-6 ${className}`}
    style={{
      background: 'rgba(15,23,42,0.7)',
      border: `1px solid ${accent ? `${accent}22` : 'rgba(100,116,139,0.15)'}`,
      backdropFilter: 'blur(16px)',
    }}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════
   CARD HEADER
═══════════════════════════════════════ */
const CardHeader: React.FC<{ icon: React.ReactNode; title: string; titleColor?: string; iconBg: string; iconBorder: string }> = ({ icon, title, titleColor, iconBg, iconBorder }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
      {icon}
    </div>
    <h3 className="font-orbitron text-sm font-bold" style={{ color: titleColor ?? '#f1f5f9' }}>{title}</h3>
  </div>
);

/* ═══════════════════════════════════════
   ABOUT
═══════════════════════════════════════ */
export const About: React.FC = () => {
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    getAboutData().then(setAboutData).catch(console.error);
  }, []);

  // Fallback defaults while loading or on error
  const data = aboutData;

  const frontendSkills = data?.frontendSkills ?? [
    { name: 'React / Next.js', color: '#22d3ee' },
    { name: 'TypeScript',      color: '#3b82f6' },
    { name: 'Tailwind CSS',    color: '#14b8a6' },
    { name: 'Vue.js',          color: '#10b981' },
  ];

  const backendSkills = data?.backendSkills ?? [
    { name: 'Node.js / Express',    color: '#a855f7' },
    { name: 'Database (SQL/NoSQL)', color: '#818cf8' },
    { name: 'REST API / GraphQL',   color: '#8b5cf6' },
    { name: 'Docker / DevOps',      color: '#ec4899' },
  ];

  const tools = data?.tools ?? [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB',
    'PostgreSQL', 'Tailwind', 'Git', 'Docker', 'Figma', 'VS Code',
    'Firebase', 'Google Stitch', 'Gemini AI', 'Antigravity AI',
  ];

  const displayName = data?.name ?? 'Nattawat';
  const displayRole = data?.role ?? 'Full Stack Developer';
  const avatarUrl = data?.avatarUrl ?? '/profile.webp';
  const cvUrl = data?.cvUrl ?? '/Professional Modern CV Resume.pdf';
  const highlightName = data?.highlightName ?? 'Nattawat';

  const profileStats = [
    { icon: Briefcase,     color: '#22d3ee', label: t('about.experience'), value: data?.experience ?? t('about.experienceValue') },
    { icon: GraduationCap, color: '#a855f7', label: t('about.education'),  value: data?.education ?? t('about.educationValue')  },
    { icon: Globe,         color: '#10b981', label: t('about.location'),   value: data?.location ?? t('about.locationValue')   },
  ];

  return (
    <div className="section-container relative overflow-hidden">

      {/* ── Particle canvas ── */}
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right,rgba(34,211,238,0.05) 0%,transparent 65%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left,rgba(168,85,247,0.05) 0%,transparent 65%)', filter: 'blur(40px)' }} />

      {/* ── Section Header ── */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,#22d3ee)' }} />
          <span className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-400 uppercase">{t('about.subtitle')}</span>
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,#22d3ee,transparent)' }} />
        </div>
        <h2 className="font-orbitron font-black text-white" style={{ fontSize: 'clamp(1.8rem,5vw,3rem)' }}>
          {t('about.title')}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 relative z-10">

        {/* ── LEFT: Profile ── */}
        <div className="lg:w-[300px] shrink-0 space-y-4">
          <GlassCard>
            {/* Photo */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5 group"
              style={{ border: '1px solid rgba(34,211,238,0.15)' }}>
              <Image
                src={avatarUrl}
                alt={`${displayName} - ${displayRole}`}
                fill sizes="300px"
                className="object-cover opacity-85 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700"
                priority
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top,rgba(2,6,23,0.9) 0%,rgba(2,6,23,0.3) 50%,transparent 100%)' }} />
              {['top-3 left-3 border-t-2 border-l-2','top-3 right-3 border-t-2 border-r-2','bottom-14 left-3 border-b-2 border-l-2','bottom-14 right-3 border-b-2 border-r-2'].map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 border-cyan-400/60 ${cls}`} />
              ))}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-orbitron text-2xl font-black text-white leading-none">{displayName}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <p className="font-orbitron text-[10px] tracking-widest text-cyan-400 uppercase">{displayRole}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2.5">
              {profileStats.map(({ icon: Icon, color, label, value }) => (
                <div key={label}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-default transition-all duration-200"
                  style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=`${color}30`; el.style.background=`${color}08`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(100,116,139,0.1)'; el.style.background='rgba(30,41,59,0.5)'; }}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                    style={{ background:`${color}15`, border:`1px solid ${color}30` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-orbitron text-[9px] tracking-[0.2em] uppercase text-slate-500">{label}</p>
                    <p className="font-orbitron text-[11px] leading-tight text-slate-200 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CV button */}
            <a href={cvUrl}
              className="group relative mt-5 w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-orbitron text-xs tracking-widest font-bold overflow-hidden transition-all duration-300"
              style={{ background:'linear-gradient(135deg,#22d3ee,#3b82f6)', color:'#020617', boxShadow:'0 0 20px rgba(34,211,238,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 32px rgba(34,211,238,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 20px rgba(34,211,238,0.3)'; }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }} />
              <FileText className="w-4 h-4 relative z-10" />
              <span className="relative z-10">VIEW CV</span>
            </a>
          </GlassCard>
        </div>

        {/* ── RIGHT: Bio + Skills + Tools ── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Bio */}
          <GlassCard accent="#22d3ee">
            <CardHeader
              icon={<User className="w-3.5 h-3.5 text-cyan-400" />}
              title={t('about.introduction')}
              iconBg="rgba(34,211,238,0.12)"
              iconBorder="rgba(34,211,238,0.25)"
            />
            <div className="space-y-3 text-slate-400 text-sm leading-relaxed">
              <p>
                {data?.introPart1 ?? t('about.introPart1')}{' '}
                <span className="text-cyan-400 font-medium">{highlightName}</span>{' '}
                {data?.introPart2 ?? t('about.introPart2')}{' '}
                <span className="px-1.5 py-0.5 rounded text-xs font-orbitron" style={{ background:'rgba(34,211,238,0.1)', color:'#22d3ee', border:'1px solid rgba(34,211,238,0.25)' }}>Frontend</span>{' '}
                และ{' '}
                <span className="px-1.5 py-0.5 rounded text-xs font-orbitron" style={{ background:'rgba(168,85,247,0.1)', color:'#a855f7', border:'1px solid rgba(168,85,247,0.25)' }}>Backend</span>
              </p>
              <p>
                {data?.introPart3 ?? t('about.introPart3')}{' '}
                <span className="text-white font-medium">{t('about.beautiful')}</span>,{' '}
                <span className="text-white font-medium">{t('about.easyToUse')}</span> และ{' '}
                <span className="text-white font-medium">{t('about.fast')}</span>{' '}
                {data?.introPart4 ?? t('about.introPart4')}
              </p>
            </div>
          </GlassCard>

          {/* Skills grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <GlassCard accent="#22d3ee">
              <CardHeader
                icon={<Code2 className="w-3.5 h-3.5 text-cyan-400" />}
                title="Frontend"
                titleColor="#22d3ee"
                iconBg="rgba(34,211,238,0.12)"
                iconBorder="rgba(34,211,238,0.25)"
              />
              <div className="space-y-2">
                {frontendSkills.map(s => <SkillRow key={s.name} name={s.name} color={s.color} />)}
              </div>
            </GlassCard>

            <GlassCard accent="#a855f7">
              <CardHeader
                icon={<Server className="w-3.5 h-3.5 text-purple-400" />}
                title="Backend"
                titleColor="#a855f7"
                iconBg="rgba(168,85,247,0.12)"
                iconBorder="rgba(168,85,247,0.25)"
              />
              <div className="space-y-2">
                {backendSkills.map(s => <SkillRow key={s.name} name={s.name} color={s.color} />)}
              </div>
            </GlassCard>
          </div>

          {/* Tools */}
          <GlassCard accent="#facc15">
            <CardHeader
              icon={<Zap className="w-3.5 h-3.5 text-yellow-400" />}
              title={t('about.tools')}
              iconBg="rgba(250,204,21,0.1)"
              iconBorder="rgba(250,204,21,0.25)"
            />
            <div className="flex flex-wrap gap-2">
              {tools.map(tool => <ToolTag key={tool} name={tool} />)}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};