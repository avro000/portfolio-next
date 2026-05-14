"use client";

import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";

type HeroData = {
  name?: string;
  role?: string;
  description?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
};

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<HeroData>({});

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const fetchHero = async () => {
      const res = await fetch("/api/hero");
      const json = await res.json();
      setData(json);
    };
    fetchHero();
  }, []);

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const firstName = data.name?.split(" ")[0] ?? "";
  const lastName = data.name?.split(" ").slice(1).join(" ") ?? "";
  const { displayed: typedRole, done: roleDone } = useTypewriter(
    data.role ?? "",
    isVisible && !!data.role,
    40
  );

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden pt-20"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="section-label mb-6">Portfolio — 2024</p>

            <h1 className="heading-editorial text-[clamp(3rem,8vw,7rem)] mb-8">
              {firstName}
              {lastName && (
                <>
                  <br />
                  {lastName}
                </>
              )}
            </h1>

            <div className="flex items-center gap-6 mt-10">
              {data.githubUrl && (
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-[var(--color-text-muted)]">[</span>
                  <Github size={14} />
                  <span>Github</span>
                  <span className="text-[var(--color-text-muted)]">]</span>
                </a>
              )}
              {data.linkedinUrl && (
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-[var(--color-text-muted)]">[</span>
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                  <span className="text-[var(--color-text-muted)]">]</span>
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-[var(--color-text-muted)]">[</span>
                  <Mail size={14} />
                  <span>Email</span>
                  <span className="text-[var(--color-text-muted)]">]</span>
                </a>
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[var(--color-text-muted)] text-lg sm:text-xl leading-relaxed mb-8">
              {data.description ?? ""}
            </p>

            <div className="w-full h-px bg-[var(--color-border)] mb-8"></div>

            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight text-[var(--color-text)]">
              {typedRole}
              {!roleDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
            </p>
          </div>
        </div>

        <div
          className={`mt-20 lg:mt-32 flex justify-center transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={scrollToNext}
            className="flex flex-col items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
          >
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase">
              Scroll to explore
            </span>
            <ArrowDown
              size={16}
              className="group-hover:translate-y-1 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
