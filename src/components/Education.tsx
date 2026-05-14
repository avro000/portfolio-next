"use client";

import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

type EducationItem = {
  _id: string;
  degree: string;
  field: string;
  institute: string;
  duration: string;
  score: string;
  icon: string;
  description: string;
};

export default function Education() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [education, setEducation] = useState<EducationItem[]>([]);
  const heading = "Academic foundation that drives innovation.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => setEducation(data));
  }, []);

  return (
    <section id="education" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-offwhite)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="section-label">Education</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <h2 className="heading-editorial text-[clamp(2rem,4vw,3.5rem)] mb-16 max-w-3xl">
            {typedHeading}
            {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
          </h2>

          <div className="space-y-0">
            {education.map((edu, index) => (
              <div
                key={edu._id}
                className={`group border-t border-[var(--color-border)] transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="py-8 sm:py-10 grid sm:grid-cols-12 gap-4 sm:gap-6 items-start group-hover:bg-[var(--color-bg-alt)]/50 px-4 -mx-4 transition-colors duration-300">
                  <div className="sm:col-span-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
                      {edu.degree}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">
                      {edu.field}
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-[var(--color-text)] text-sm font-medium">
                      {edu.institute}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
                      {edu.duration}
                    </p>
                  </div>

                  <div className="sm:col-span-3 sm:text-right">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
                      {edu.score}
                    </span>
                  </div>
                </div>

                {edu.description && (
                  <div className="px-4 -mx-4 pb-8 sm:pl-4">
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-2xl">
                      {edu.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[var(--color-border)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
