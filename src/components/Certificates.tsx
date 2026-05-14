"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

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
  const heading = "Credentials that validate expertise.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then(setCertificates);
  }, []);

  return (
    <section id="certificates" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-offwhite)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="section-label">Certifications</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <h2 className="heading-editorial text-[clamp(2rem,4vw,3.5rem)] mb-16 max-w-3xl">
            {typedHeading}
            {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
          </h2>

          <div className="space-y-0">
            {certificates.map((cert, index) => (
              <div
                key={cert._id}
                className={`group border-t border-[var(--color-border)] transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="py-6 sm:py-8 grid sm:grid-cols-12 gap-3 sm:gap-6 items-center group-hover:bg-[var(--color-bg-alt)]/50 px-4 -mx-4 transition-colors duration-300">
                  <div className="sm:col-span-5">
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-text)]">
                      {cert.title}
                    </h3>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-[var(--color-text-muted)] text-sm">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
                      {cert.year}
                    </span>
                  </div>

                  <div className="sm:col-span-2 sm:text-right">
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300"
                      >
                        <span>[</span>
                        <span>View</span>
                        <ArrowUpRight size={12} />
                        <span>]</span>
                      </a>
                    )}
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