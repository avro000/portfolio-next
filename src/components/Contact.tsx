"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

type ContactInfo = {
  email?: string;
  phone?: string;
  location?: string;
};

export default function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

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

  /* FETCH CONTACT INFO */
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContact(d ?? {}))
      .catch(() => {});
  }, []);

  /* SUBMIT MESSAGE */
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

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: contact.email || "avpodder000@gmail.com",
      link: `mailto:${contact.email || "avpodder000@gmail.com"}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact.phone || "Not available",
    },
    {
      icon: MapPin,
      label: "Location",
      value: contact.location || "India",
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* HEADING */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT INFO — PRESERVED */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Let's work together!
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision. Feel free to reach
                  out through any of the channels below.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className={`flex items-center space-x-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 ${
                      isInView
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 bg-linear-to-r from-cyan-400 to-blue-500 rounded-lg">
                      <info.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{info.label}</p>
                      <p className="text-white">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* FORM — PRESERVED */}
            <form
              onSubmit={handleSubmit}
              className={`space-y-6 ${
                isInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-linear-to-r from-cyan-400 to-blue-500 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                <Send size={18} />
              </button>

              {success && (
                <p className="text-green-400">
                  Message sent successfully
                </p>
              )}
              {error && <p className="text-red-400">{error}</p>}
            </form>
          </div>

          {/* FOOTER — PRESERVED */}
          <div className="mt-16 text-center text-gray-400">
            <p>&copy; 2024 Avra Podder. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}