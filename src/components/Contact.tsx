"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

type ContactInfo = {
  email?: string;
  phone?: string;
  location?: string;
};

export default function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const heading = "Have a project in mind? Let's talk.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    location: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContact(d ?? {}))
      .catch(() => { });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/contact-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      setError("Failed to send message");
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-dark)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="text-[0.75rem] font-medium tracking-[0.15em] uppercase text-[#8A847D]">Get In Touch</span>
            <div className="flex-1 h-px bg-[#3A3A3A]"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif font-bold leading-[1.05] tracking-[-0.02em] text-[#EDE8E2] text-[clamp(2rem,4vw,3.5rem)] mb-8">
                {typedHeading}
                {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[#EDE8E2] ml-0.5 animate-pulse" />}
              </h2>

              <p className="text-[#8A847D] text-base sm:text-lg leading-relaxed mb-12">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>

              <div className="space-y-6">
                <div className="border-t border-[#3A3A3A] pt-6">
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-2">
                    EMAIL
                  </span>
                  <a
                    href={`mailto:${contact.email || "avpodder000@gmail.com"}`}
                    className="text-[#EDE8E2] hover:opacity-70 transition-opacity text-base sm:text-lg"
                  >
                    {contact.email || "avpodder000@gmail.com"}
                  </a>
                </div>

                {contact.phone && (
                  <div className="border-t border-[#3A3A3A] pt-6">
                    <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-2">
                      PHONE
                    </span>
                    <p className="text-[#EDE8E2] text-base sm:text-lg">
                      {contact.phone}
                    </p>
                  </div>
                )}

                <div className="border-t border-[#3A3A3A] pt-6">
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-2">
                    LOCATION
                  </span>
                  <p className="text-[#EDE8E2] text-base sm:text-lg">
                    {contact.location || "India"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-3">
                    Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-0 py-3 bg-transparent border-b border-[#3A3A3A] focus:border-[#EDE8E2] focus:outline-none transition-colors text-[#EDE8E2] text-base"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-0 py-3 bg-transparent border-b border-[#3A3A3A] focus:border-[#EDE8E2] focus:outline-none transition-colors text-[#EDE8E2] text-base"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8A847D] block mb-3">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-0 py-3 bg-transparent border-b border-[#3A3A3A] focus:border-[#EDE8E2] focus:outline-none transition-colors text-[#EDE8E2] text-base resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 px-8 py-4 border border-[#EDE8E2] text-[#EDE8E2] text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#EDE8E2] hover:text-[var(--color-bg-dark)] transition-all duration-300 disabled:opacity-50"
                >
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                  <Send size={14} />
                </button>

                {success && (
                  <p className="text-[#EDE8E2] text-sm font-medium">
                    Message sent successfully.
                  </p>
                )}
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}