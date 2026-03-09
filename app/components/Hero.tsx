"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Code2, Server, Globe, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/* ── Matrix rain canvas ── */
const MatrixCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(canvas.width / 28);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = 'Mr.Nattawat S.'.split('');

    const draw = () => {
      ctx.fillStyle = 'rgba(2,6,23,0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 28;
        // Head char — bright
        ctx.font = '13px monospace';
        ctx.fillStyle = 'rgba(34,211,238,0.35)';
        ctx.fillText(char, x, y * 20);
        // Trail
        ctx.fillStyle = 'rgba(34,211,238,0.05)';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - 2) * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.3;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.28 }} />;
};

/* ── Typewriter hook ── */
const useTypewriter = (words: string[], speed = 100, pause = 2000) => {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
};

/* ── Orbiting ring ── */
const OrbitRing: React.FC<{ size: number; duration: number; opacity: number; reverse?: boolean }> = ({ size, duration, opacity, reverse }) => (
  <div
    className="absolute rounded-full border pointer-events-none"
    style={{
      width: size, height: size,
      top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      borderColor: `rgba(34,211,238,${opacity})`,
      animation: `spin${reverse ? 'Reverse' : ''} ${duration}s linear infinite`,
    }}
  >
    {/* Dot on ring */}
    <div
      className="absolute w-2 h-2 rounded-full"
      style={{ top: -4, left: '50%', transform: 'translateX(-50%)', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }}
    />
  </div>
);

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const roles = ['Full Stack Developer', 'Frontend Specialist', 'Backend Engineer', 'Prompt Engineer'];
  const typed = useTypewriter(roles, 80, 1800);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const skillCards = [
    { icon: Code2,  label: 'Frontend', sub: 'React · Next.js · CSS',  color: '#22d3ee', glow: 'rgba(34,211,238,0.15)' },
    { icon: Server, label: 'Backend',  sub: 'Node.js · Express · API', color: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
    { icon: Globe,  label: 'Web',      sub: 'Responsive · SEO · PWA',  color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
  ];

  const roles2 = [
    { label: 'Frontend Dev',      color: '#22d3ee', border: 'rgba(34,211,238,0.35)',  bg: 'rgba(34,211,238,0.06)' },
    { label: 'Backend Dev',       color: '#a855f7', border: 'rgba(168,85,247,0.35)',  bg: 'rgba(168,85,247,0.06)' },
    { label: 'Full Stack',        color: '#10b981', border: 'rgba(16,185,129,0.35)',  bg: 'rgba(16,185,129,0.06)' },
    { label: 'Prompt Engineer',   color: '#f59e0b', border: 'rgba(245,158,11,0.35)',  bg: 'rgba(245,158,11,0.06)' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-16 md:pt-20 overflow-hidden">
      {/* Matrix rain */}
      <MatrixCanvas />

      {/* Bottom fade — dissolves the matrix lines smoothly before About */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]"
        style={{
          height: '45%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(2,6,23,0.15) 20%, rgba(2,6,23,0.45) 45%, rgba(2,6,23,0.75) 65%, rgba(2,6,23,0.92) 80%, #020617 100%)',
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Orbit rings (desktop only) */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none overflow-hidden">
        <style>{`
          @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
          @keyframes spinReverse { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(-360deg); } }
        `}</style>
        <OrbitRing size={520} duration={28} opacity={0.06} />
        <OrbitRing size={700} duration={45} opacity={0.04} reverse />
        <OrbitRing size={880} duration={60} opacity={0.025} />
      </div>

      <div className="section-container relative z-10 text-center flex flex-col items-center px-4">

        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[10px] md:text-xs font-orbitron tracking-widest"
          style={{
            background: 'rgba(34,211,238,0.06)',
            border: '1px solid rgba(34,211,238,0.25)',
            color: '#22d3ee',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          {t('hero.available')}
          <Sparkles className="w-3 h-3" />
        </div>

        {/* Greeting */}
        <p className="font-orbitron text-slate-500 text-xs md:text-sm tracking-[0.4em] uppercase mb-3">
          {t('hero.greeting')}
        </p>

        {/* Name + Reflection */}
        <div className="relative mb-2">
          {/* Main name */}
          <h1 className="font-orbitron font-black leading-none" style={{ fontSize: 'clamp(3rem, 12vw, 7rem)' }}>
            <span
              className="relative block"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 45%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.05,
              }}
            >
              NATTAWAT
              {/* Glow layer */}
              <span
                className="absolute inset-0 pointer-events-none select-none"
                aria-hidden
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #3b82f6, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'blur(18px)',
                  opacity: 0.35,
                }}
              >
                NATTAWAT
              </span>
            </span>
          </h1>

          {/* Reflection shadow — flipped, fading downward */}
          <div
            className="pointer-events-none select-none"
            aria-hidden
            style={{
              transform: 'scaleY(-1)',
              marginTop: '-0.1em',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 40%, transparent 75%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 40%, transparent 75%)',
              height: 'clamp(1.5rem, 6vw, 3.5rem)',
              overflow: 'hidden',
            }}
          >
            <span
              className="font-orbitron font-black block"
              style={{
                fontSize: 'clamp(3rem, 12vw, 7rem)',
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 45%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'blur(1.5px)',
              }}
            >
              NATTAWAT
            </span>
          </div>
        </div>

        {/* Typewriter role */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-6 h-7">
          <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="font-orbitron text-sm md:text-base tracking-widest text-slate-300">
            {typed}
            <span className="animate-pulse text-cyan-400">|</span>
          </span>
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {roles2.map(({ label, color, border, bg }) => (
            <span
              key={label}
              className="px-3 py-1.5 rounded-full font-orbitron text-[10px] tracking-widest cursor-default transition-all duration-200"
              style={{ color, border: `1px solid ${border}`, background: bg }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="max-w-2xl text-slate-400 text-sm md:text-base leading-relaxed mb-10 px-2">
          {t('hero.description')}{' '}
          <span className="text-cyan-400 font-medium">{t('hero.website')}</span>{' '}
          {t('hero.and')}{' '}
          <span className="text-purple-400 font-medium">{t('hero.application')}</span>{' '}
          {t('hero.descriptionEnd')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none mx-auto justify-center">
          <button
            onClick={() => scrollTo('projects')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-xl px-8 py-3.5 font-orbitron text-sm font-bold tracking-widest transition-all duration-300 focus:outline-none"
            style={{
              background: 'linear-gradient(135deg,#22d3ee,#3b82f6)',
              color: '#020617',
              boxShadow: '0 0 24px rgba(34,211,238,0.35)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(34,211,238,0.55)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(34,211,238,0.35)'; }}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
            <span className="relative flex items-center justify-center gap-2">
              {t('hero.viewWork')}
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => scrollTo('contact')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-xl px-8 py-3.5 font-orbitron text-sm font-bold tracking-widest transition-all duration-300 focus:outline-none"
            style={{
              background: 'rgba(15,23,42,0.8)',
              color: '#cbd5e1',
              border: '1px solid rgba(100,116,139,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)';
              (e.currentTarget as HTMLElement).style.color = '#c084fc';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(168,85,247,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.3)';
              (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <span className="relative flex items-center justify-center gap-2">
              {t('hero.contactMe')}
            </span>
          </button>
        </div>

        {/* Skill cards */}
        <div className="mt-16 md:mt-24 grid grid-cols-3 gap-3 md:gap-5 w-full max-w-xs md:max-w-2xl mx-auto">
          {skillCards.map(({ icon: Icon, label, sub, color, glow }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl cursor-default transition-all duration-300"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(100,116,139,0.15)',
                backdropFilter: 'blur(16px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${glow}`;
                (e.currentTarget as HTMLElement).style.background = `${glow}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.background = 'rgba(15,23,42,0.7)';
              }}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
              </div>
              <div className="text-center">
                <p className="font-orbitron text-[10px] md:text-xs tracking-widest text-slate-200">{label}</p>
                <p className="text-[8px] md:text-[10px] text-slate-600 hidden md:block mt-1 leading-relaxed">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <button
          onClick={() => scrollTo('about')}
          className="mt-12 md:mt-16 flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity duration-300 focus:outline-none"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-slate-500 uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </button>
      </div>
    </div>
  );
};