"use client";

import React from 'react';
import { CardFrame, ProgressBar } from './GamerUI';
import { User, Code2, Server, Globe, Zap, Star, Briefcase, GraduationCap, FileText } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();
  
  const frontendSkills = [
    { name: 'React / Next.js', level: 95, color: 'bg-cyan-500' },
    { name: 'TypeScript', level: 90, color: 'bg-blue-500' },
    { name: 'Tailwind CSS', level: 92, color: 'bg-teal-500' },
    { name: 'Vue.js', level: 75, color: 'bg-emerald-500' },
  ];

  const backendSkills = [
    { name: 'Node.js / Express', level: 88, color: 'bg-purple-500' },
    { name: 'Database (SQL/NoSQL)', level: 85, color: 'bg-indigo-500' },
    { name: 'REST API / GraphQL', level: 90, color: 'bg-violet-500' },
    { name: 'Docker / DevOps', level: 75, color: 'bg-pink-500' },
  ];

  return (
    <div className="section-container">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-16">
        <h2 className="font-orbitron text-2xl md:text-4xl font-black mb-2 text-white">{t('about.title')}</h2>
        <p className="text-slate-500 font-orbitron text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em]">{t('about.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
        {/* Left Side: Profile Card */}
        <div className="lg:w-1/3">
          <CardFrame className="h-full">
            {/* Profile Image */}
            <div className="relative aspect-square w-full max-w-[200px] md:max-w-none mx-auto mb-6 bg-slate-800 rounded-lg overflow-hidden group">
              <Image 
                src="/S__50872323.jpg"
                alt="Nattawat - Full Stack Developer" 
                fill
                sizes="(max-width: 768px) 200px, 100%"
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-end">
                <div>
                  <h2 className="font-orbitron text-xl md:text-2xl font-black text-white leading-none">Nattawat</h2>
                  <p className="text-cyan-400 text-[10px] md:text-xs font-orbitron tracking-widest mt-1">Full Stack Developer</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-slate-800/50 rounded-lg">
                <Briefcase className="text-cyan-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-orbitron text-slate-500 uppercase">{t('about.experience')}</p>
                  <p className="text-xs md:text-sm font-orbitron truncate">{t('about.experienceValue')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-slate-800/50 rounded-lg">
                <GraduationCap className="text-purple-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-orbitron text-slate-500 uppercase">{t('about.education')}</p>
                  <p className="text-xs md:text-sm font-orbitron truncate">{t('about.educationValue')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-slate-800/50 rounded-lg">
                <Globe className="text-emerald-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-orbitron text-slate-500 uppercase">{t('about.location')}</p>
                  <p className="text-xs md:text-sm font-orbitron truncate">{t('about.locationValue')}</p>
                </div>
              </div>
              
              {/* View CV Button */}
              <div className="pt-2">
                <a 
                  href="#"
                  className="w-full relative group flex items-center justify-center gap-2.5 px-4 py-2.5 md:py-3 bg-cyan-500 text-slate-950 border border-cyan-400 rounded-lg font-orbitron text-xs md:text-sm font-bold tracking-wider hover:bg-cyan-400 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out"></div>
                  <FileText className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">VIEW CV</span>
                </a>
              </div>
            </div>
          </CardFrame>
        </div>

        {/* Right Side: Bio & Skills */}
        <div className="lg:w-2/3 flex flex-col gap-4 md:gap-6">
          {/* Bio */}
          <CardFrame>
            <h3 className="font-orbitron text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
              <User className="text-cyan-400 w-5 h-5" /> {t('about.introduction')}
            </h3>
            <div className="text-slate-400 text-sm md:text-base leading-relaxed font-light space-y-3 md:space-y-4">
              <p>
                {t('about.introPart1')} <span className="text-cyan-400 font-medium">Nattawat</span> {t('about.introPart2')} <span className="text-cyan-400">Frontend</span> และ <span className="text-purple-400">Backend</span>
              </p>
              <p>
                {t('about.introPart3')} <span className="text-white font-medium">{t('about.beautiful')}</span>, <span className="text-white font-medium">{t('about.easyToUse')}</span> และ <span className="text-white font-medium">{t('about.fast')}</span> {t('about.introPart4')}
              </p>
            </div>
          </CardFrame>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Frontend Skills */}
            <CardFrame>
              <h3 className="font-orbitron text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                <Code2 className="text-cyan-400 w-4 h-4 md:w-5 md:h-5" /> 
                <span className="text-cyan-400">Frontend</span>
              </h3>
              <div className="flex flex-col gap-1.5 md:gap-2">
                {frontendSkills.map((skill) => (
                  <div 
                    key={skill.name} 
                    className="flex items-center justify-between p-2 md:p-2.5 rounded-lg border border-slate-700/30 bg-slate-800/40 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${skill.color} opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_8px_currentColor] transition-all duration-300`}></div>
                      <span className="text-[10px] md:text-xs font-sans font-medium tracking-wide text-slate-300 group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardFrame>

            {/* Backend Skills */}
            <CardFrame>
              <h3 className="font-orbitron text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                <Server className="text-purple-400 w-4 h-4 md:w-5 md:h-5" /> 
                <span className="text-purple-400">Backend</span>
              </h3>
              <div className="flex flex-col gap-1.5 md:gap-2">
                {backendSkills.map((skill) => (
                  <div 
                    key={skill.name} 
                    className="flex items-center justify-between p-2 md:p-2.5 rounded-lg border border-slate-700/30 bg-slate-800/40 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${skill.color} opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_8px_currentColor] transition-all duration-300`}></div>
                      <span className="text-[10px] md:text-xs font-sans font-medium tracking-wide text-slate-300 group-hover:text-purple-300 transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardFrame>
          </div>

          {/* Tools & Technologies */}
          <CardFrame>
            <h3 className="font-orbitron text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" /> {t('about.tools')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind', 'Git', 'Docker', 'Figma', 'VS Code', 'Google stitch', 'Firebase', 'antigravity AI', 'Gamini AI'].map(tool => (
                <span 
                  key={tool} 
                  className="px-2.5 md:px-3 py-1 md:py-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] md:text-sm font-sans font-medium rounded-md hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </CardFrame>
        </div>
      </div>
    </div>
  );
};
