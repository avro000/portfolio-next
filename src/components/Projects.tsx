"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

type Project = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  tech: string[];
  link: string;
  github: string;
};

export default function Projects() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [projects, setProjects] = useState<Project[]>([]);
  const heading = "Work that speaks for itself.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-cream)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="section-label">Featured Projects</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            <span className="section-label">{projects.length}</span>
          </div>

          <h2 className="heading-editorial text-[clamp(2rem,4vw,3.5rem)] mb-16 max-w-3xl">
            {typedHeading}
            {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
          </h2>

          <div className="space-y-0">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className={`group border-t border-[var(--color-border)] transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="py-8 sm:py-10 group-hover:bg-[var(--color-bg-alt)]/50 px-4 -mx-4 transition-colors duration-300">
                  <div className="grid sm:grid-cols-12 gap-4 sm:gap-6 items-start">
                    <div className="sm:col-span-4">
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--color-text)] group-hover:translate-x-2 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)] mt-2">
                        PRJ-{String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[var(--color-text-muted)] leading-relaxed">
                        {project.tech.join(" · ")}
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex sm:flex-col sm:items-end gap-3">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300"
                        >
                          <span>[</span>
                          <span>Live</span>
                          <ArrowUpRight size={12} />
                          <span>]</span>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300"
                        >
                          <span>[</span>
                          <Github size={12} />
                          <span>Code</span>
                          <span>]</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[var(--color-border)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}