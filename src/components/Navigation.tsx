'use client';

import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavigationProps {
  activeSection: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certifications' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--color-bg)]/95 backdrop-blur-sm shadow-[0_1px_0_var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button
            onClick={() => scrollToSection('home')}
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)] hover:opacity-70 transition-opacity"
          >
            AP
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300"
              >
                {activeSection === item.id
                  ? `[${item.label}]`
                  : item.label}
              </button>
            ))}

            <button
              onClick={() => scrollToSection('contact')}
              className={`text-[11px] font-medium tracking-[0.15em] uppercase px-5 py-2 border transition-all duration-300 ${
                activeSection === 'contact'
                  ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                  : 'border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]'
              }`}
            >
              Contact
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[var(--color-text)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--color-bg)] border-t border-[var(--color-border)]">
          <div className="px-6 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-[var(--color-text)] bg-[var(--color-bg-alt)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {activeSection === item.id
                  ? `[${item.label}]`
                  : item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--color-text)] mt-2 border-t border-[var(--color-border)]"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
