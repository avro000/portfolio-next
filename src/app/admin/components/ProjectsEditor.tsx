"use client"

import { useEffect, useState } from "react"
import { Layers, Plus, Edit2, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react"

type Project = {
  _id?: string
  title: string
  description: string
  icon: string
  tech: string[]
  link: string
  github: string
}

const emptyForm: Project = {
  title: "",
  description: "",
  icon: "",
  tech: [],
  link: "",
  github: "",
}

const ICON_OPTIONS = [
  "Code2",
  "Laptop",
  "Globe",
  "Database",
  "Server",
  "Layers",
  "Cpu",
  "Rocket",
  "BookOpen",
  "Dumbbell",
  "Cloud",
  "Shield",
]

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<Project>(emptyForm)
  const [techInput, setTechInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const submit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      ...form,
      tech: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    const res = await fetch("/api/projects", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    })

    if (!res.ok) {
      setError("Failed to save project")
      setLoading(false)
      return
    }

    setForm(emptyForm)
    setTechInput("")
    setEditingId(null)
    setLoading(false)
    setSuccess(true)
    fetchProjects()

    setTimeout(() => setSuccess(false), 2000)
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return

    await fetch("/api/projects", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchProjects()
  }

  const edit = (project: Project) => {
    const { _id, tech, ...clean } = project
    setForm({ ...clean, tech })
    setTechInput(tech.join(", "))
    setEditingId(_id!)
  }

  return (
    <div className="space-y-10 w-full">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Layers size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Projects</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">Manage featured projects and portfolio items</p>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full shadow-2xl">
        <div className="flex items-center gap-3">
          <Plus size={18} className="sm:w-5 sm:h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
        </div>

        <div className="space-y-4">
          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Project Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="Project name..."
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* ICON */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            >
              <option value="">Select icon</option>
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          {/* TECH STACK */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Tech Stack (comma separated)</label>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="React, Node.js, MongoDB..."
            />
          </div>

          {/* LINKS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">Live Demo URL</label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">GitHub URL</label>
              <input
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : editingId ? "Update Project" : "Create Project"}
          </button>

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <CheckCircle2 size={18} />
              Project saved successfully!
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-cyan-300">Projects</h3>
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <p className="text-gray-400">No projects added yet. Create your first project!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group flex justify-between items-start bg-linear-to-br from-slate-800/50 to-slate-900/30 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex-1">
                  <p className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">{project.description.substring(0, 100)}...</p>
                  <p className="text-xs text-cyan-400 mt-3 font-medium">{project.tech.join(" • ")}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => edit(project)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(project._id!)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
