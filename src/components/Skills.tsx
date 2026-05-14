"use client";

import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

export default function Skills() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const heading = "Technologies I work with every day.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB"],
    },
    {
      title: "Tools & Others",
      skills: ["Git", "Docker", "AWS", "CI/CD"],
    },
  ];

  return (
    <section id="skills" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-dark)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="text-[0.75rem] font-medium tracking-[0.15em] uppercase text-[#8A847D]">Skills & Expertise</span>
            <div className="flex-1 h-px bg-[#3A3A3A]"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
            <h2 className="font-serif font-bold leading-[1.05] tracking-[-0.02em] text-[#EDE8E2] text-[clamp(2rem,4vw,3.5rem)]">
              {typedHeading}
              {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[#EDE8E2] ml-0.5 animate-pulse" />}
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className={`transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${categoryIndex * 150}ms` }}
              >
                <div className="border-t border-[#EDE8E2] pt-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-6 text-[#EDE8E2]">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <li
                        key={skillIndex}
                        className="text-[#8A847D] text-sm sm:text-base flex items-center gap-3"
                      >
                        <span className="w-1 h-1 bg-[#8A847D] rounded-full shrink-0"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
