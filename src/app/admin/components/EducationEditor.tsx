"use client";

import { useEffect, useState } from "react";

/* Allowed icons */
const ICONS = [
  "BookOpen",
  "Atom",
  "Code2",
  "Cpu",
  "GraduationCap",
] as const;

type IconName = (typeof ICONS)[number] | "";

type Education = {
  _id?: string;
  degree: string;
  field: string;
  institute: string;
  duration: string;
  score: string;
  icon: IconName;
  description: string;
};

const emptyForm: Education = {
  degree: "",
  field: "",
  institute: "",
  duration: "",
  score: "",
  icon: "", // ✅ no default icon
  description: "",
};

export default function EducationAdmin() {
  const [education, setEducation] = useState<Education[]>([]);
  const [form, setForm] = useState<Education>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchEducation = async () => {
    const res = await fetch("/api/education");
    const data = await res.json();
    setEducation(data);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const submitForm = async () => {
    // simple validation
    if (!form.icon) {
      alert("Please select an icon");
      return;
    }

    setLoading(true);

    await fetch("/api/education", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { id: editingId, ...form } : form
      ),
    });

    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchEducation();
  };

  /* ================= DELETE ================= */
  const deleteEducation = async (id: string) => {
    if (!confirm("Delete this education entry?")) return;

    await fetch("/api/education", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchEducation();
  };

  /* ================= EDIT ================= */
  const startEdit = (edu: Education) => {
    const { _id, ...cleanForm } = edu;
    setForm(cleanForm);
    setEditingId(_id!);
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Education</h1>
        <p className="text-gray-400 mt-1">
          Manage your education timeline
        </p>
      </div>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Education" : "Add Education"}
        </h2>

        {(
          [
            ["degree", "Degree"],
            ["field", "Field"],
            ["institute", "Institute"],
            ["duration", "Duration"],
            ["score", "Score"],
          ] as const
        ).map(([key, label]) => (
          <input
            key={key}
            placeholder={label}
            value={form[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
          />
        ))}

        {/* ICON DROPDOWN */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Icon
          </label>
          <select
            value={form.icon}
            onChange={(e) =>
              setForm({
                ...form,
                icon: e.target.value as IconName,
              })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select an icon</option>
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full p-3 rounded bg-slate-800 border border-slate-700
                     focus:outline-none focus:border-cyan-500"
          rows={4}
        />

        <button
          onClick={submitForm}
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
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu._id}
            className="flex justify-between items-start bg-slate-900
                       border border-slate-800 rounded-lg p-4"
          >
            <div>
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-sm text-gray-400">
                {edu.institute} • {edu.duration}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {edu.score}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => startEdit(edu)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEducation(edu._id!)}
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
