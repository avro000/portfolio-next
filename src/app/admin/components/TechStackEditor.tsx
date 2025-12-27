"use client";

import { useEffect, useState } from "react";

type Tech = {
  _id?: string;
  name: string;
  logo: string;
};

const emptyForm: Tech = {
  name: "",
  logo: "",
};

export default function TechStackAdmin() {
  const [tech, setTech] = useState<Tech[]>([]);
  const [form, setForm] = useState<Tech>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchTech = async () => {
    const res = await fetch("/api/techstack");
    const data = await res.json();
    setTech(data);
  };

  useEffect(() => {
    fetchTech();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const submit = async () => {
    if (!form.name || !form.logo) {
      setError("Name and logo URL are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/techstack", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { id: editingId, ...form } : form
      ),
    });

    if (!res.ok) {
      setError("Operation failed");
    } else {
      setSuccess(true);
      setForm(emptyForm);
      setEditingId(null);
      fetchTech();
      setTimeout(() => setSuccess(false), 2000);
    }

    setLoading(false);
  };

  /* ================= DELETE ================= */
  const remove = async (id: string) => {
    if (!confirm("Delete this tech?")) return;

    await fetch("/api/techstack", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchTech();
  };

  /* ================= EDIT ================= */
  const edit = (item: Tech) => {
    const { _id, ...clean } = item;
    setForm(clean);
    setEditingId(_id!);
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Tech Stack</h1>
        <p className="text-gray-400 mt-1">
          Manage technologies displayed on your portfolio
        </p>
      </div>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Tech" : "Add Tech"}
        </h2>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Technology Name
          </label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
            placeholder="React, Next.js, MongoDB..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Logo URL
          </label>
          <input
            value={form.logo}
            onChange={(e) =>
              setForm({ ...form, logo: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
            placeholder="https://cdn.jsdelivr.net/..."
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded font-semibold
                     hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update"
            : "Create"}
        </button>

        {success && (
          <p className="text-green-400 text-sm">
            Saved successfully
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {tech.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-slate-900
                       border border-slate-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.logo}
                alt={item.name}
                className="h-8 w-8 object-contain"
              />
              <span className="font-medium">
                {item.name}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => edit(item)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={() => remove(item._id!)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}