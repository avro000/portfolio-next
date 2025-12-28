"use client"

import type React from "react"

import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Sparkles,
  User,
  BookOpen,
  Code2,
  Award,
  FolderOpen,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import Dashboard from "./Dashboard"
import Education from "./EducationEditor"
import HeroEditor from "./HeroEditor"
import AboutEditor from "./AboutEditor"
import TechStackAdmin from "./TechStackEditor"
import CertificatesEditor from "./CertificatesEditor"
import ProjectsEditor from "./ProjectsEditor"
import ContactEditor from "./ContactEditor"

type Section = "dashboard" | "hero" | "about" | "education" | "techstack" | "certificates" | "projects" | "contact"

const navItems: { label: string; value: Section; icon: any }[] = [
  { label: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { label: "Hero", value: "hero", icon: Sparkles },
  { label: "About", value: "about", icon: User },
  { label: "Education", value: "education", icon: BookOpen },
  { label: "Tech Stack", value: "techstack", icon: Code2 },
  { label: "Certificates", value: "certificates", icon: Award },
  { label: "Projects", value: "projects", icon: FolderOpen },
  { label: "Contact", value: "contact", icon: Mail },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return <HeroEditor />
      case "about":
        return <AboutEditor />
      case "education":
        return <Education />
      case "techstack":
        return <TechStackAdmin />
      case "certificates":
        return <CertificatesEditor />
      case "contact":
        return <ContactEditor />
      case "projects":
        return <ProjectsEditor />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <aside
        className={`fixed inset-y-0 left-0 bg-linear-to-b from-slate-900/98 to-slate-950/98 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col transition-all duration-300 z-50 w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${desktopCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between gap-3 shrink-0 h-16.75">
          {desktopCollapsed ? (
            <button
              onClick={() => setDesktopCollapsed(false)}
              className="hidden lg:flex w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 items-center justify-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
              aria-label="Expand sidebar"
            >
              <Menu size={20} className="text-white" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white shrink-0">
                  AP
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400 truncate">
                    AdminHub
                  </h2>
                  <p className="text-xs text-gray-400">Portfolio Manager</p>
                </div>
              </div>
              <button
                onClick={() => setDesktopCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-200"
                aria-label="Collapse sidebar"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setActiveSection(item.value)
                setSidebarOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-3 group ${
                activeSection === item.value
                  ? "bg-linear-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/50"
                  : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800/50 border border-transparent"
              } ${desktopCollapsed ? "lg:justify-center" : ""}`}
              title={desktopCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0 group-hover:text-cyan-400 transition-colors duration-200" />
              {!desktopCollapsed && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-cyan-500/20 bg-linear-to-r from-red-500/5 to-transparent shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={`w-full px-3 py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/30 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-red-500/20 flex items-center gap-3 group text-sm ${
              desktopCollapsed ? "lg:justify-center" : "justify-center"
            }`}
            title={desktopCollapsed ? "Logout" : undefined}
          >
            <LogOut size={20} className="shrink-0 group-hover:text-red-200 transition-colors duration-200" />
            {!desktopCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${desktopCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-linear-to-r from-cyan-500/5 to-blue-500/5 shrink-0 sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
              AP
            </div>
            <div className="text-sm font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">
              AdminHub
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-4 py-4 border-b border-cyan-500/20 bg-linear-to-r from-cyan-500/5 to-blue-500/5 shrink-0 sticky top-0 z-30 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">
              {navItems.find((item) => item.value === activeSection)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <p className="text-xs text-gray-400">Welcome back!</p>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{renderSection()}</div>
        </main>
      </div>
    </div>
  )

}
