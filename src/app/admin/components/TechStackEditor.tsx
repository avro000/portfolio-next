"use client"

import { useEffect, useState } from "react"
import { Code2, Plus, Edit2, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react"

type Tech = {
  _id?: string
  name: string
  logo: string
}

const emptyForm: Tech = {
  name: "",
  logo: "",
}

export default function TechStackAdmin() {
  const [tech, setTech] = useState<Tech[]>([])
  const [form, setForm] = useState<Tech>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTech = async () => {
    const res = await fetch("/api/techstack")
    const data = await res.json()
    setTech(data)
  }

  useEffect(() => {
    fetchTech()
  }, [])

  const submit = async () => {
    if (!form.name || !form.logo) {
      setError("Name and logo URL are required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await fetch("/api/techstack", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    })

    if (!res.ok) {
      setError("Operation failed")
    } else {
      setSuccess(true)
      setForm(emptyForm)
      setEditingId(null)
      fetchTech()
      setTimeout(() => setSuccess(false), 2000)
    }

    setLoading(false)
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this tech?")) return

    await fetch("/api/techstack", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchTech()
  }

  const edit = (item: Tech) => {
    const { _id, ...clean } = item
    setForm(clean)
    setEditingId(_id!)
  }

  return (
    <div className="space-y-10">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Code2 size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Tech Stack</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">Manage technologies displayed on your portfolio</p>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Plus size={18} className="sm:w-5 sm:h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
            {editingId ? "Edit Technology" : "Add New Technology"}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Technology Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="React, Next.js, MongoDB..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Logo URL</label>
            <input
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="https://cdn.jsdelivr.net/..."
            />
          </div>

          {form.logo && (
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <p className="text-sm text-gray-400">Preview:</p>
              <img src={form.logo || "/placeholder.svg"} alt={form.name} className="h-10 w-10 object-contain" />
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : editingId ? "Update Technology" : "Add Technology"}
          </button>

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <CheckCircle2 size={18} />
              Saved successfully!
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
        <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-cyan-300">Added Technologies</h3>
        {tech.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <p className="text-gray-400">No technologies added yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tech.map((item) => (
              <div
                key={item._id}
                className="group flex items-center justify-between bg-linear-to-br from-slate-800/50 to-slate-900/30 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center border border-slate-700/30 group-hover:border-cyan-500/30 transition-colors">
                    <img src={item.logo || "/placeholder.svg"} alt={item.name} className="h-8 w-8 object-contain" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => edit(item)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(item._id!)}
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
