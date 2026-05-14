"use client";

import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

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
  const heading = "Building digital experiences with purpose and precision.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about");
      const json = await res.json();
      setData({ ...DEFAULT_ABOUT, ...json });
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-cream)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="section-label">About</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
            <div className="space-y-6">
              <h2 className="heading-editorial text-[clamp(2rem,4vw,3.5rem)]">
                {typedHeading}
                {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-[var(--color-text-muted)] text-base sm:text-lg leading-relaxed">
                {data.paragraph1}
              </p>
              <p className="text-[var(--color-text-muted)] text-base sm:text-lg leading-relaxed">
                {data.paragraph2}
              </p>
            </div>
          </div>

          {data.image && (
            <div className="mb-20 overflow-hidden">
              <img
                src={data.image}
                alt="About"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {data.highlights.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <div className="border-t border-[var(--color-border)] pt-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-[var(--color-text)]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}