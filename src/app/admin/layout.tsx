"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

import Dashboard from "./components/Dashboard";
import Education from "./components/EducationEditor";
import HeroEditor from "./components/HeroEditor";
import AboutEditor from "./components/AboutEditor";
import TechStackAdmin from "./components/TechStackEditor";
import CertificatesEditor from "./components/CertificatesEditor";
import ProjectsEditor from "./components/ProjectsEditor";
import ContactEditor from "./components/ContactEditor";

type Section =
  | "dashboard"
  | "hero"
  | "about"
  | "education"
  | "techstack"
  | "certificates"
  | "projects"
  | "contact";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Allow login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return <HeroEditor />;
      case "about":
        return <AboutEditor />;
      case "education":
        return <Education />;
      case "techstack":
        return <TechStackAdmin />;
      case "certificates":
        return <CertificatesEditor />;
      case "contact":
        return <ContactEditor />;
      case "projects":
        return <ProjectsEditor />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full text-left px-3 py-2 rounded transition
              ${activeSection === "dashboard"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveSection("hero")}
            className={`w-full text-left px-3 py-2 rounded transition
              ${activeSection === "hero"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            Hero Section
          </button>

          <button
            onClick={() => setActiveSection("about")}
            className={`w-full text-left px-3 py-2 rounded transition
              ${activeSection === "about"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            About Section
          </button>

          <button
            onClick={() => setActiveSection("education")}
            className={`w-full text-left px-3 py-2 rounded transition
              ${activeSection === "education"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            Education Section
          </button>

          <button
            onClick={() => setActiveSection("techstack")}
            className={`w-full text-left px-3 py-2 rounded transition
              ${activeSection === "techstack"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            Tech Stack Section
          </button>
          <button
            onClick={() => setActiveSection("certificates")}
            className={`w-full text-left px-3 py-2 rounded
    ${activeSection === "certificates"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"}`}
          >
            Certificates Section
          </button>

          <button
            onClick={() => setActiveSection("projects")}
            className={`w-full text-left px-3 py-2 rounded transition ${activeSection === "projects"
              ? "bg-slate-800 text-cyan-400"
              : "hover:text-cyan-400"
              }`}
          >
            Projects Section
          </button>

          <button
            onClick={() => setActiveSection("contact")}
            className={`w-full text-left px-3 py-2 rounded transition
    ${activeSection === "contact"
                ? "bg-slate-800 text-cyan-400"
                : "hover:text-cyan-400"
              }`}
          >
            Contact Section
          </button>

        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={() =>
              signOut({ callbackUrl: "/admin/login" })
            }
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 overflow-y-auto p-8">
        {renderSection()}
      </main>
    </div>
  );
}