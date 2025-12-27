"use client";

import { Code2, Lightbulb, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

type Highlight = {
  title: string;
  description: string;
};

type AboutData = {
  paragraph1: string;
  paragraph2: string;
  image: string;
  highlights: Highlight[];
};

const ICONS = [Code2, Lightbulb, Rocket];

const DEFAULT_ABOUT: AboutData = {
  paragraph1: "",
  paragraph2: "",
  image: "",
  highlights: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
};

export default function About() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about");
      const json = await res.json();
      setData({ ...DEFAULT_ABOUT, ...json });
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* TEXT */}
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {data.paragraph1}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {data.paragraph2}
              </p>
            </div>

            {/* IMAGE (UNCHANGED STYLING) */}
            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-cyan-500/30 overflow-hidden group">
                {data.image && (
                  <img
                    src={data.image}
                    alt="About Image"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-blue-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="grid md:grid-cols-3 gap-8">
            {data.highlights.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <div
                  key={index}
                  className={`p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 ${
                    isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="text-cyan-400 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}