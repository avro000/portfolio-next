"use client"

import { useEffect, useState } from "react"
import { Award, Plus, Edit2, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react"

const ICONS = ["Binary", "Database", "Cloud", "Puzzle", "Layers", "Coffee"]

type Certificate = {
  _id?: string
  title: string
  issuer: string
  year: string
  icon: string
  description: string
  link: string
}

const emptyForm: Certificate = {
  title: "",
  issuer: "",
  year: "",
  icon: "",
  description: "",
  link: "",
}

export default function CertificatesEditor() {
  const [list, setList] = useState<Certificate[]>([])
  const [form, setForm] = useState<Certificate>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates")
    setList(await res.json())
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const save = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    const res = await fetch("/api/certificates", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    })

    if (!res.ok) {
      setError("Save failed")
    } else {
      setSuccess(true)
      setForm(emptyForm)
      setEditingId(null)
      fetchCertificates()
    }

    setLoading(false)
    setTimeout(() => setSuccess(false), 2000)
  }

  const startEdit = (c: Certificate) => {
    const { _id, ...clean } = c
    setForm(clean)
    setEditingId(_id!)
  }

  const remove = async (id: string) => {
    if (!confirm("Delete certificate?")) return

    await fetch("/api/certificates", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchCertificates()
  }

  return (
    <div className="space-y-10">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Award size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Certificates</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">
          Manage your professional certifications and achievements
        </p>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Plus size={18} className="sm:w-5 sm:h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
            {editingId ? "Edit Certificate" : "Add Certificate"}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Certificate Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="Certificate name..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Issuer / Organization</label>
            <input
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="Organization name..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">Year</label>
              <input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              >
                <option value="">Select icon</option>
                {ICONS.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              placeholder="Describe this certificate..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Certificate Link</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              placeholder="https://..."
            />
          </div>

          <button
            onClick={save}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : editingId ? "Update Certificate" : "Add Certificate"}
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
        <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-cyan-300">Certificates</h3>
        {list.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <p className="text-gray-400">No certificates added yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((c) => (
              <div
                key={c._id}
                className="group flex justify-between items-start bg-linear-to-br from-slate-800/50 to-slate-900/30 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">{c.title}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {c.issuer} • {c.year}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(c._id!)}
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
