"use client";

import React from 'react';
import { Code2, Server, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const footerLinks = [
    { labelKey: 'nav.home', id: 'home' },
    { labelKey: 'nav.about', id: 'about' },
    { labelKey: 'nav.projects', id: 'projects' },
    { labelKey: 'nav.contact', id: 'contact' },
  ];

  return (
    <footer className="relative border-t border-slate-800/60 bg-slate-950 overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="section-container relative z-10">
        {/* Main Footer */}
        <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand */}
          <div className="text-center md:text-left flex flex-col justify-center">
            <h3 className="font-orbitron text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-3 tracking-widest glitch-hover cursor-default">
              Nattawat
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-xs mx-auto md:mx-0">
              {t('footer.description')}
            </p>
          </div>

          {/* Skills */}
          <div className="text-center">
            <h4 className="font-orbitron text-xs text-slate-400 mb-3 md:mb-4">{t('footer.expertise')}</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-[10px] md:text-xs">
                <Code2 className="w-3 h-3" /> Frontend
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 text-[10px] md:text-xs">
                <Server className="w-3 h-3" /> Backend
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[10px] md:text-xs">
                <Globe className="w-3 h-3" /> Web
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="font-orbitron text-xs text-slate-400 mb-3 md:mb-4">{t('footer.links')}</h4>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4">
              {footerLinks.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-slate-500 hover:text-cyan-400 text-xs font-orbitron transition-colors"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 md:py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-2 text-center">
          <p className="text-slate-600 font-orbitron text-[10px] md:text-xs tracking-wider">
            © 2026 NATTAWAT_DEV // ALL RIGHTS RESERVED
          </p>
          <p className="flex items-center gap-1 text-slate-600 text-[10px] md:text-xs">
            {t('footer.madeWith')} <Heart className="w-3 h-3 text-red-500 fill-current" /> {t('footer.inBangkok')}
          </p>
        </div>
      </div>
    </footer>
  );
};
