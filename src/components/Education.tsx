'use client';

import {
  BookOpen,
  Atom,
  Code2,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

const ICONS = {
  BookOpen,
  Atom,
  Code2,
  Cpu,
  GraduationCap,
};

type IconName = keyof typeof ICONS;

type EducationItem = {
  _id: string;
  degree: string;
  field: string;
  institute: string;
  duration: string;
  score: string;
  icon: IconName;
  description: string;
};

export default function Education() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [education, setEducation] = useState<EducationItem[]>([]);

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(data => setEducation(data));
  }, []);

  return (
    <section id="education" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto mb-16"></div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-0 h-full w-px bg-linear-to-b from-cyan-500/50 to-blue-500/50"></div>

            <div className="space-y-12">
              {education.map((edu, index) => {
                const Icon = ICONS[edu.icon] ?? GraduationCap;

                return (
                  <div
                    key={edu._id}
                    className={`relative pl-20 transition-all duration-700 ${
                      isInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Timeline Icon */}
                    <div className="absolute left-0 top-4 w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-cyan-500/50">
                      <Icon className="text-cyan-400" size={22} />
                    </div>

                    {/* Card */}
                    <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {edu.degree}
                      </h3>

                      <p className="text-gray-400">{edu.field}</p>

                      <p className="text-sm text-gray-500 mt-1">
                        {edu.institute}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                        <span>{edu.duration}</span>
                        <span>{edu.score}</span>
                      </div>

                      <p className="text-gray-400 mt-4 leading-relaxed">
                        {edu.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
