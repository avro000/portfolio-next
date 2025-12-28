"use client"

import { useEffect, useState } from "react"
import { Upload, Save, AlertCircle, CheckCircle2 } from "lucide-react"

type Highlight = {
  title: string
  description: string
}

type AboutForm = {
  paragraph1: string
  paragraph2: string
  image: string
  highlights: Highlight[]
}

const emptyForm: AboutForm = {
  paragraph1: "",
  paragraph2: "",
  image: "",
  highlights: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
}

const MAX_IMAGE_SIZE = 300 * 1024

export default function AboutEditor() {
  const [form, setForm] = useState<AboutForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        const { _id, ...clean } = d
        setForm({ ...emptyForm, ...clean })
      })
  }, [])

  const handleImageUpload = (file: File) => {
    setImageError(null)

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 300KB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const save = async () => {
    setLoading(true)
    setSuccess(false)
    setSaveError(null)

    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      setSaveError("Failed to update About section")
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs sm:text-base">i</span>
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">About Section</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">
          Manage your about content, highlights, and profile image
        </p>
      </div>

      <div className="w-full bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 border border-cyan-500/20 shadow-2xl">
        {/* PARAGRAPH 1 */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            First Paragraph
          </label>
          <textarea
            value={form.paragraph1}
            onChange={(e) => setForm({ ...form, paragraph1: e.target.value })}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"
            placeholder="Write your first paragraph..."
          />
        </div>

        {/* PARAGRAPH 2 */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Second Paragraph
          </label>
          <textarea
            value={form.paragraph2}
            onChange={(e) => setForm({ ...form, paragraph2: e.target.value })}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-sm sm:text-base text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"
            placeholder="Write your second paragraph..."
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="space-y-4">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Profile Image (Max 300KB)
          </label>

          <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-6 sm:p-8 bg-slate-800/30 hover:border-cyan-500/60 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <Upload size={28} className="sm:w-8 sm:h-8 text-cyan-400" />
              <div>
                <p className="text-sm sm:text-base text-white font-medium">Drop image here or click to browse</p>
                <p className="text-xs sm:text-sm text-gray-400">PNG, JPG up to 300KB</p>
              </div>
            </label>
          </div>

          {imageError && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {imageError}
            </p>
          )}

          {form.image && (
            <div className="space-y-3">
              <p className="text-sm text-cyan-300 font-medium">Preview:</p>
              <img
                src={form.image || "/placeholder.svg"}
                className="h-48 rounded-xl border border-cyan-500/30 object-cover"
              />
            </div>
          )}
        </div>

        {/* HIGHLIGHTS */}
        <div className="space-y-4 pt-4 border-t border-slate-700/50">
          <label className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Key Highlights (3)
          </label>

          <div className="space-y-3 sm:space-y-4">
            {form.highlights.map((h, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
              >
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Title</label>
                  <input
                    value={h.title}
                    onChange={(e) => {
                      const copy = [...form.highlights]
                      copy[i].title = e.target.value
                      setForm({ ...form, highlights: copy })
                    }}
                    placeholder={`Highlight ${i + 1}`}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700/50 rounded-lg text-sm sm:text-base text-white placeholder-gray-500
                           focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Description</label>
                  <input
                    value={h.description}
                    onChange={(e) => {
                      const copy = [...form.highlights]
                      copy[i].description = e.target.value
                      setForm({ ...form, highlights: copy })
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700/50 rounded-lg text-sm sm:text-base text-white placeholder-gray-500
                           focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-4">
          <button
            onClick={save}
            disabled={loading}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm sm:text-base text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {saveError && (
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle size={18} />
              {saveError}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle2 size={18} />
              Updated successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
