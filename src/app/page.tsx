'use client';

import { useState, useEffect } from 'react';

import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import TechStack from '@/components/TechStack';
import Certificates from '@/components/Certificates';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'education',
        'skills',
        'techstack',
        'certificates',
        'projects',
        'contact',
      ];

      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navigation activeSection={activeSection} />
      <Hero />
      <About />
      <Education />
      <Skills />
      <TechStack />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  );
}
