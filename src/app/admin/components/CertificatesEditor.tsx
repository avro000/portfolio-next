"use client";

import { useEffect, useState } from "react";

const ICONS = [
  "Binary",
  "Database",
  "Cloud",
  "Puzzle",
  "Layers",
  "Coffee",
];

type Certificate = {
  _id?: string;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  description: string;
  link: string;
};

const emptyForm: Certificate = {
  title: "",
  issuer: "",
  year: "",
  icon: "",
  description: "",
  link: "",
};

export default function CertificatesEditor() {
  const [list, setList] = useState<Certificate[]>([]);
  const [form, setForm] = useState<Certificate>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates");
    setList(await res.json());
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const save = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/certificates", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { id: editingId, ...form } : form
      ),
    });

    if (!res.ok) {
      setError("Save failed");
    } else {
      setSuccess(true);
      setForm(emptyForm);
      setEditingId(null);
      fetchCertificates();
    }

    setLoading(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  const startEdit = (c: Certificate) => {
    const { _id, ...clean } = c;
    setForm(clean);
    setEditingId(_id!);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete certificate?")) return;

    await fetch("/api/certificates", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchCertificates();
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Certificates</h1>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-400">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded border border-slate-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Issuer</label>
          <input
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded border border-slate-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-gray-400">Year</label>
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full p-3 bg-slate-800 rounded border border-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full p-3 bg-slate-800 rounded border border-slate-700"
            >
              <option value="">Select icon</option>
              {ICONS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className="w-full p-3 bg-slate-800 rounded border border-slate-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Certificate Link</label>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded border border-slate-700"
          />
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded font-semibold"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Create"}
        </button>

        {success && <p className="text-green-400">Saved successfully</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {list.map((c) => (
          <div
            key={c._id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-400">
                {c.issuer} • {c.year}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => startEdit(c)}
                className="text-yellow-400"
              >
                Edit
              </button>
              <button
                onClick={() => remove(c._id!)}
                className="text-red-400"
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
