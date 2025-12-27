"use client";

import {
  Binary,
  Coffee,
  Layers,
  Database,
  Cloud,
  Puzzle,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

const ICONS: Record<string, any> = {
  Binary,
  Coffee,
  Layers,
  Database,
  Cloud,
  Puzzle,
};

type Certificate = {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  description: string;
  link: string;
};

export default function Certificates() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then(setCertificates);
  }, []);

  return (
    <section id="certificates" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Certifications
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto mb-16"></div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {certificates.map((cert, index) => {
              const Icon = ICONS[cert.icon];

              return (
                <div
                  key={cert._id}
                  className={`h-full transition-all duration-700 ${
                    isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div
                    className="h-full flex flex-col p-6 bg-slate-800/50 backdrop-blur-sm
                    rounded-xl border border-slate-700/50 hover:border-cyan-500/50
                    transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-cyan-500/40 mb-4">
                      {Icon && <Icon className="text-cyan-400" size={22} />}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-1">
                      {cert.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {cert.issuer} • {cert.year}
                    </p>

                    <p className="text-gray-400 mt-3 leading-relaxed grow">
                      {cert.description}
                    </p>

                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        View Certificate <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}