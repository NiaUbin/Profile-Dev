"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, User, Briefcase, Mail, Zap, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavItem {
  id: string;
  labelKey: string;
  mobileLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems: NavItem[] = [
    { id: 'home', labelKey: 'nav.home', mobileLabel: 'HOME', icon: Terminal },
    { id: 'about', labelKey: 'nav.about', mobileLabel: 'ABOUT', icon: User },
    { id: 'projects', labelKey: 'nav.projects', mobileLabel: 'WORK', icon: Briefcase },
    { id: 'contact', labelKey: 'nav.contact', mobileLabel: 'CONTACT', icon: Mail },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-3 md:py-4 flex justify-between items-center w-full">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => scrollTo('home')}
          >
            <User className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 group-hover:animate-pulse" />
            <span className="font-orbitron text-lg md:text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Nattawat.
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`font-orbitron text-xs tracking-widest hover:text-cyan-400 transition-colors relative py-1 ${
                  activeSection === item.id ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {t(item.labelKey)}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"></span>
                )}
              </button>
            ))}
            
            {/* Language Toggle Button - Desktop */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all duration-300 group"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="font-orbitron text-xs font-bold">
                <span className={`transition-colors ${language === 'th' ? 'text-cyan-400' : 'text-slate-500'}`}>TH</span>
                <span className="text-slate-600 mx-1">/</span>
                <span className={`transition-colors ${language === 'en' ? 'text-cyan-400' : 'text-slate-500'}`}>EN</span>
              </span>
            </button>
          </nav>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Language Toggle Button - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg transition-all duration-300"
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-orbitron text-[10px] font-bold text-cyan-400">
                {language === 'th' ? 'TH' : 'EN'}
              </span>
            </button>
            
            {/* Mobile Toggle */}
            <button 
              className="text-cyan-400 p-2 -mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-4 font-orbitron text-xl tracking-widest transition-all duration-300 ${
                  activeSection === item.id ? 'text-cyan-400' : 'text-slate-300'
                } ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <IconComponent size={24} className={activeSection === item.id ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{language === 'en' ? item.mobileLabel : t(item.labelKey)}</span>
              </button>
            );
          })}
          
          {/* Language Toggle in Mobile Menu */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl transition-all duration-300 mt-4 ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <Languages className="w-5 h-5 text-cyan-400" />
            <span className="font-orbitron text-sm">
              <span className={`transition-colors ${language === 'th' ? 'text-cyan-400' : 'text-slate-500'}`}>ไทย</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className={`transition-colors ${language === 'en' ? 'text-cyan-400' : 'text-slate-500'}`}>English</span>
            </span>
          </button>
          
          {/* Decorative Line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 rounded-full"></div>
          
          {/* Status */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-orbitron mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{t('nav.online')}</span>
          </div>
        </div>
      </div>
    </>
  );
};
