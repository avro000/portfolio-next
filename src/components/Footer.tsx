"use client";

import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

function FooterLink({
  label,
  onClick,
  href,
  isInView,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  isInView: boolean;
}) {
  const { displayed, done } = useTypewriter(label, isInView, 40);

  const content = (
    <span className="group flex items-center cursor-pointer text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300">
      <span className="mr-2 flex items-center justify-between relative w-7">
        <span>[</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] text-[13px] -mt-[1px]">
          →
        </span>
        <span>]</span>
      </span>
      <span className="relative">
        {displayed}
        {!done && (
          <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse translate-y-[2px]" />
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-fit"
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block w-fit">
      {content}
    </button>
  );
}

type HeroData = {
  name?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
};

export default function Footer() {
  const [data, setData] = useState<HeroData>({});
  const [footerRef, isInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const socialLinks = [
    { label: "Github", url: data.githubUrl },
    { label: "LinkedIn", url: data.linkedinUrl },
  ];

  const name = data.name ?? "Avra Podder";

  return (
    <footer ref={footerRef} className="pt-16 pb-12 bg-[var(--color-bg-stone)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="border-t border-[var(--color-border)] pt-12 mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <FooterLink
                  key={link.id}
                  label={link.label}
                  onClick={() => scrollToSection(link.id)}
                  isInView={isInView}
                />
              ))}
            </div>

            <div className="space-y-3">
              {socialLinks
                .filter((s) => s.url)
                .map((link) => (
                  <FooterLink
                    key={link.label}
                    label={link.label}
                    href={link.url}
                    isInView={isInView}
                  />
                ))}
            </div>

            <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-between space-y-8 lg:space-y-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-white">
                  Available for new opportunities
                </span>
              </div>
              
              <div className="text-left lg:text-right space-y-4">
                <p className="text-lg sm:text-xl font-serif text-[var(--color-text)] max-w-sm">
                  Got an idea? Let's build something <span className="italic text-[var(--color-text-muted)]">extraordinary.</span>
                </p>
                <a
                  href={data.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${data.email}` : "#contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-[var(--color-text)] hover:text-[var(--color-text-muted)] transition-colors"
                >
                  <span>Start a conversation</span>
                  <div className="relative flex items-center justify-center w-8 group-hover:w-12 transition-all duration-300">
                    <span className="absolute left-0 w-full h-[1px] bg-[var(--color-text)] group-hover:bg-[var(--color-text-muted)] transition-colors"></span>
                    <span className="absolute -right-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] text-[14px]">
                      →
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 overflow-hidden">
          <h2
            className="font-serif font-black text-[var(--color-text)] leading-[0.85] tracking-tighter select-none whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 8.5vw, 12rem)" }}
          >
            {name.toUpperCase()}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
          <p>&copy; {new Date().getFullYear()} {name}</p>
          <p>Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
