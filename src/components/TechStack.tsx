"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Tech = {
  _id: string;
  name: string;
  logo: string;
};

export default function TechStack() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [techStack, setTechStack] = useState<Tech[]>([]);

  /* ================= FETCH TECH STACK ================= */
  useEffect(() => {
    const fetchTech = async () => {
      const res = await fetch("/api/techstack");
      const data = await res.json();
      setTechStack(data);
    };

    fetchTech();
  }, []);

  /* ================= SCROLL BUTTON STATE ================= */
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [techStack]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="techstack" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Tech Stack
        </h2>
        <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto"></div>

        {/* CONTROLS */}
        <div className="flex items-center justify-end mb-8 gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border transition-all
              ${
                canScrollLeft
                  ? "border-slate-700/50 hover:border-cyan-500/50 text-white"
                  : "border-slate-800 text-gray-600 cursor-not-allowed"
              }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border transition-all
              ${
                canScrollRight
                  ? "border-slate-700/50 hover:border-cyan-500/50 text-white"
                  : "border-slate-800 text-gray-600 cursor-not-allowed"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* SCROLLABLE LINE */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-6 overflow-x-auto scroll-smooth pt-3 scrollbar-none"
        >
          {techStack.map((tech) => (
            <div
              key={tech._id}
              className="
                relative shrink-0 w-44 h-44 p-6 rounded-xl
                bg-slate-800/40 backdrop-blur-sm
                border border-slate-700/50
                transition-all duration-300
                hover:border-cyan-500/50
                hover:-translate-y-1
                overflow-hidden
                group
              "
            >
              {/* SHINE */}
              <div
                className="
                  absolute -inset-x-10 inset-y-0
                  bg-linear-to-r from-transparent via-cyan-400/25 to-transparent
                  translate-x-[-120%] group-hover:translate-x-[120%]
                  transition-transform duration-700
                "
              />

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="h-12 w-12 object-contain"
                />
                <span className="text-gray-300 font-medium tracking-wide text-center">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}