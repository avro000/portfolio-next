"use client"

import { useEffect, useState } from "react"
import { BookOpen, Trash2, Edit2, Plus, Save } from "lucide-react"

const ICONS = ["BookOpen", "Atom", "Code2", "Cpu", "GraduationCap"] as const

type IconName = (typeof ICONS)[number] | ""

type Education = {
  _id?: string
  degree: string
  field: string
  institute: string
  duration: string
  score: string
  icon: IconName
  description: string
}

const emptyForm: Education = {
  degree: "",
  field: "",
  institute: "",
  duration: "",
  score: "",
  icon: "",
  description: "",
}

export default function EducationAdmin() {
  const [education, setEducation] = useState<Education[]>([])
  const [form, setForm] = useState<Education>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchEducation = async () => {
    const res = await fetch("/api/education")
    const data = await res.json()
    setEducation(data)
  }

  useEffect(() => {
    fetchEducation()
  }, [])

  const submitForm = async () => {
    if (!form.icon) {
      alert("Please select an icon")
      return
    }

    setLoading(true)

    await fetch("/api/education", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    })

    setForm(emptyForm)
    setEditingId(null)
    setLoading(false)
    fetchEducation()
  }

  const deleteEducation = async (id: string) => {
    if (!confirm("Delete this education entry?")) return

    await fetch("/api/education", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchEducation()
  }

  const startEdit = (edu: Education) => {
    const { _id, ...cleanForm } = edu
    setForm(cleanForm)
    setEditingId(_id!)
  }

  return (
    <div className="space-y-10">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <BookOpen size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Education</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">
          Manage your education timeline and academic achievements
        </p>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Plus size={18} className="sm:w-5 sm:h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
            {editingId ? "Edit Education Entry" : "Add New Education"}
          </h2>
        </div>

        <div className="space-y-4">
          {(
            [
              ["degree", "Degree"],
              ["field", "Field of Study"],
              ["institute", "Institute/University"],
              ["duration", "Duration"],
              ["score", "Score/Grade"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">{label}</label>
              <input
                placeholder={label}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>
          ))}

          {/* ICON DROPDOWN */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Icon</label>
            <select
              value={form.icon}
              onChange={(e) =>
                setForm({
                  ...form,
                  icon: e.target.value as IconName,
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            >
              <option value="">Select an icon</option>
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Description</label>
            <textarea
              placeholder="Describe this education entry..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                     focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={submitForm}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : editingId ? "Update Entry" : "Create Entry"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-cyan-300">Education Entries</h3>
        {education.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <p className="text-gray-400">No education entries yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {education.map((edu) => (
              <div
                key={edu._id}
                className="group flex justify-between items-start bg-linear-to-br from-slate-800/50 to-slate-900/30 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex-1">
                  <p className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                    {edu.degree}
                  </p>
                  <p className="text-sm text-cyan-300 mt-1">
                    {edu.field} • {edu.institute}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {edu.duration} • {edu.score}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(edu)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteEducation(edu._id!)}
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
