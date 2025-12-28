"use client"

import { useEffect, useState } from "react"
import { Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react"

type ContactForm = {
  email: string
  phone: string
  location: string
}

const emptyForm: ContactForm = {
  email: "",
  phone: "",
  location: "",
}

export default function ContactEditor() {
  const [form, setForm] = useState<ContactForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        const { _id, key, ...clean } = d
        setForm({ ...emptyForm, ...clean })
      })
  }, [])

  const save = async () => {
    setLoading(true)
    setSuccess(false)
    setError("")

    const res = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError("Failed to update contact info")
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Mail size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-300">Contact Section</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400">
          Update your contact details shown on the website
        </p>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 space-y-6 w-full shadow-2xl">
        {/* EMAIL */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Email Address
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            placeholder="example@gmail.com"
          />
        </div>

        {/* PHONE */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Phone Number
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            placeholder="+91 9000000000"
          />
        </div>

        {/* LOCATION */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Location
          </label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            placeholder="City, Country"
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
          <button
            onClick={save}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white
                     hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle2 size={18} />
              Contact details updated!
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
