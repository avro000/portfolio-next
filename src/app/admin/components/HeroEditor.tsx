"use client";

import { useEffect, useState } from "react";

type HeroForm = {
  name: string;
  role: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
};

const emptyForm: HeroForm = {
  name: "",
  role: "",
  description: "",
  githubUrl: "",
  linkedinUrl: "",
  email: "",
};

export default function HeroEditor() {
  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        const { _id, ...clean } = data;
        setForm({ ...emptyForm, ...clean });
      } catch {
        setError("Failed to load hero data");
      }
    };

    fetchHero();
  }, []);

  const saveHero = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Update failed");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Hero Section</h1>
        <p className="text-gray-400">
          Update your landing page content
        </p>
      </div>

      {/* FORM */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                   focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* ROLE */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Role / Title
          </label>
          <input
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                   focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={4}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                   focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* LINKS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              GitHub URL
            </label>
            <input
              value={form.githubUrl}
              onChange={(e) =>
                setForm({ ...form, githubUrl: e.target.value })
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700
                     focus:outline-none focus:border-cyan-500 mt-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              LinkedIn URL
            </label>
            <input
              value={form.linkedinUrl}
              onChange={(e) =>
                setForm({ ...form, linkedinUrl: e.target.value })
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700
                     focus:outline-none focus:border-cyan-500 mt-2"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Email URL
          </label>
          <input
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                   focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* ACTION */}
        <div className="flex items-center gap-4">
          <button
            onClick={saveHero}
            disabled={loading}
            className="bg-cyan-500 px-8 py-2 rounded font-semibold
                   hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {success && (
            <span className="text-green-400 text-sm">
              Saved successfully
            </span>
          )}

          {error && (
            <span className="text-red-400 text-sm">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>

  );
}