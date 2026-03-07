"use client";

import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { incrementVisits } from '@/lib/firestore';

function HomeContent() {
  const { t } = useLanguage();

  useEffect(() => {
    // Only count visit once per session to avoid spamming Firestore on hot reloads
    if (!sessionStorage.getItem('hasVisited')) {
      incrementVisits();
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen text-slate-200">
      <Navbar />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about" className="py-16 md:py-24 bg-slate-950/50">
          <About />
        </section>
        <section id="projects" className="py-16 md:py-24">
          <Projects />
        </section>
        <section id="contact" className="py-16 md:py-24 bg-slate-950/50">
          <Contact />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}

