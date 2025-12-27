"use client";

import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

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
    setIsVisible(true);

    const fetchHero = async () => {
      const res = await fetch("/api/hero");
      const json = await res.json();
      setData(json);
    };

    fetchHero();
  }, []);

  const scrollToNext = () => {
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* background effects remain unchanged */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-cyan-400 mb-2 animate-fade-in">
              Hello, I&apos;m
            </h2>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-4
              bg-linear-to-r from-cyan-400 via-blue-500 to-cyan-400
              bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]"
            >
              {data.name ?? ""}
            </h1>

            <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 mb-8">
              <span className="inline-block animate-slide-up">
                {data.role ?? ""}
              </span>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {data.description ?? ""}
          </p>

          {/* SOCIAL LINKS */}
          <div className="flex justify-center space-x-6 mb-12">
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-full hover:bg-cyan-500
                           hover:scale-110 transition-all duration-300
                           hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Github size={24} />
              </a>
            )}

            {data.linkedinUrl && (
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-full hover:bg-cyan-500
                           hover:scale-110 transition-all duration-300
                           hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Linkedin size={24} />
              </a>
            )}

            {data.email && (
              <a
                href={data.email}
                className="p-3 bg-slate-800 rounded-full hover:bg-cyan-500
                           hover:scale-110 transition-all duration-300
                           hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Mail size={24} />
              </a>
            )}
          </div>

          <button
            onClick={scrollToNext}
            className="animate-bounce inline-flex items-center space-x-2
                       text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore More</span>
            <ArrowDown size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
