"use client"

import { useEffect, useState } from "react"
import { Eye, Save, AlertCircle, CheckCircle2 } from "lucide-react"

type HeroForm = {
  name: string
  role: string
  description: string
  githubUrl: string
  linkedinUrl: string
  email: string
}

const emptyForm: HeroForm = {
  name: "",
  role: "",
  description: "",
  githubUrl: "",
  linkedinUrl: "",
  email: "",
}

export default function HeroEditor() {
  const [form, setForm] = useState<HeroForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero")
        const data = await res.json()
        const { _id, ...clean } = data
        setForm({ ...emptyForm, ...clean })
      } catch {
        setError("Failed to load hero data")
      }
    }

    fetchHero()
  }, [])

  const saveHero = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Update failed")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
            <Eye size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Hero Section</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">
          Update your landing page hero content and social links
        </p>
      </div>

      <div className="w-full bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 border border-cyan-500/20 shadow-2xl">
        {/* NAME */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Full Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                   focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
            placeholder="Your Name"
          />
        </div>

        {/* ROLE */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Professional Title / Role
          </label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                   focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
            placeholder="e.g., Full Stack Developer"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Professional Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                   focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"
            placeholder="Write your professional bio..."
          />
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              GitHub URL
            </label>
            <input
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                     focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
              placeholder="https://github.com/..."
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              LinkedIn URL
            </label>
            <input
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                     focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Email Address
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                   focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
            placeholder="your@email.com"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-4">
          <button
            onClick={saveHero}
            disabled={loading}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm sm:text-base text-white
                   hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-start"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm font-medium animate-in">
              <CheckCircle2 size={18} />
              Saved successfully!
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
