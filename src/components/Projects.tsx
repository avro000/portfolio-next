"use client";

import {
  Code2,
  Laptop,
  Globe,
  Database,
  Server,
  Layers,
  Cpu,
  Rocket,
  BookOpen,
  Dumbbell,
  Cloud,
  Shield,
  ExternalLink,
  Github,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Code2,
  Laptop,
  Globe,
  Database,
  Server,
  Layers,
  Cpu,
  Rocket,
  BookOpen,
  Dumbbell,
  Cloud,
  Shield,
};

import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

const GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-blue-500 to-cyan-400",
];

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
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [projects, setProjects] = useState<Project[]>([]);

  /* FETCH PROJECTS */
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
            }`}
        >
          {/* HEADING */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto mb-12"></div>

          {/* PROJECT GRID */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => {
              const Icon = ICONS[project.icon] || Code2;
              const gradient =
                GRADIENTS[index % GRADIENTS.length];

              return (
                <div
                  key={project._id}
                  className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] ${isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* TOP GRADIENT LINE */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient}`}
                  ></div>

                  <div className="p-8">
                    {/* ICON */}
                    <div
                      className={`inline-block p-3 bg-linear-to-r ${gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>

                    {/* TITLE */}
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* TECH STACK */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-cyan-400 border border-slate-600/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* LINKS */}
                    <div className="flex space-x-4">
                      <a
                        href={project.link}
                        target="_blank"
                        className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-cyan-400 to-blue-500 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={18} />
                        <span>Live Demo</span>
                      </a>

                      <a
                        href={project.github}
                        target="_blank"
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Github size={18} />
                        <span>Code</span>
                      </a>
                    </div>
                  </div>

                  {/* HOVER OVERLAY */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}