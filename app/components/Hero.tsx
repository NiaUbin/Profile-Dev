"use client";

import React from 'react';
import { GameButton } from './GamerUI';
import { ChevronDown, Code2, Server, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-16 md:pt-20 overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>

      <div className="section-container relative z-10 text-center flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] md:text-xs font-orbitron tracking-tight mb-6 md:mb-8 animate-bounce">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{t('hero.available')}</span>
          <Sparkles className="w-3 h-3" />
        </div>

        {/* Main Title */}
        <h1 className="font-orbitron text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
          <span className="block text-slate-100 mb-1 md:mb-2">{t('hero.greeting')}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 glitch pb-2">
            Nattawat
          </span>
        </h1>

        {/* Role Badge */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="relative group cursor-default">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <span className="relative px-4 py-1.5 md:py-2 bg-slate-900 border border-slate-800 rounded-full text-cyan-400 text-xs md:text-sm font-orbitron tracking-widest flex items-center justify-center">
              Frontend Dev
            </span>
          </div>
          <div className="relative group cursor-default">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <span className="relative px-4 py-1.5 md:py-2 bg-slate-900 border border-slate-800 rounded-full text-purple-400 text-xs md:text-sm font-orbitron tracking-widest flex items-center justify-center">
              Backend Dev
            </span>
          </div>
          <div className="relative group cursor-default">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <span className="relative px-4 py-1.5 md:py-2 bg-slate-900 border border-slate-800 rounded-full text-emerald-400 text-xs md:text-sm font-orbitron tracking-widest flex items-center justify-center">
              Full Stack
            </span>
          </div>
          <div className="relative group cursor-default">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <span className="relative px-4 py-1.5 md:py-2 bg-slate-900 border border-slate-800 rounded-full text-emerald-400 text-xs md:text-sm font-orbitron tracking-widest flex items-center justify-center">
              Prompt Engineer
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-xl md:max-w-2xl mx-auto text-slate-400 text-sm md:text-lg lg:text-xl font-light mb-8 md:mb-10 leading-relaxed px-2">
          {t('hero.description')} <span className="text-cyan-400 font-medium">{t('hero.website')}</span> {t('hero.and')} <span className="text-purple-400 font-medium">{t('hero.application')}</span> {t('hero.descriptionEnd')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-md mx-auto mt-4">
          <button 
            onClick={() => scrollTo('projects')} 
            className="group relative w-full sm:w-auto overflow-hidden rounded-lg bg-cyan-500 px-8 py-3 font-orbitron text-sm md:text-base font-bold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] uppercase tracking-wider"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t('hero.viewWork')}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
          </button>
          
          <button 
            onClick={() => scrollTo('contact')} 
            className="group relative w-full sm:w-auto overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-3 font-orbitron text-sm md:text-base font-bold text-slate-300 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] uppercase tracking-wider backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t('hero.contactMe')}
            </span>
          </button>
        </div>

        {/* Skills Preview */}
        <div className="mt-12 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-sm md:max-w-4xl mx-auto">
          {/* Frontend */}
          <div className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="p-3 md:p-4 rounded-xl bg-slate-900/50 border border-slate-800 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5 transition-all duration-300">
              <Code2 className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
            </div>
            <div className="text-center">
              <h3 className="font-orbitron text-[10px] md:text-sm tracking-wider text-slate-300">Frontend</h3>
              <p className="text-[8px] md:text-xs text-slate-500 hidden md:block mt-1">React, Next.js, HTML, CSS, JS</p>
            </div>
          </div>

          {/* Backend */}
          <div className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="p-3 md:p-4 rounded-xl bg-slate-900/50 border border-slate-800 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 transition-all duration-300">
              <Server className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="font-orbitron text-[10px] md:text-sm tracking-wider text-slate-300">Backend</h3>
              <p className="text-[8px] md:text-xs text-slate-500 hidden md:block mt-1">Node.js, Express, PHP, API</p>
            </div>
          </div>

          {/* Web */}
          <div className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="p-3 md:p-4 rounded-xl bg-slate-900/50 border border-slate-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all duration-300">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="font-orbitron text-[10px] md:text-sm tracking-wider text-slate-300">Web</h3>
              <p className="text-[8px] md:text-xs text-slate-500 hidden md:block mt-1">Responsive, SEO, PWA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
