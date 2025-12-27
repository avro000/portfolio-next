"use client";

import { useEffect, useState } from "react";

type Project = {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  tech: string[];
  link: string;
  github: string;
};

const emptyForm: Project = {
  title: "",
  description: "",
  icon: "",
  tech: [],
  link: "",
  github: "",
};

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
];

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...form,
      tech: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const res = await fetch("/api/projects", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { id: editingId, ...payload } : payload
      ),
    });

    if (!res.ok) {
      setError("Failed to save project");
      setLoading(false);
      return;
    }

    setForm(emptyForm);
    setTechInput("");
    setEditingId(null);
    setLoading(false);
    setSuccess(true);
    fetchProjects();

    setTimeout(() => setSuccess(false), 2000);
  };

  /* ================= DELETE ================= */
  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    await fetch("/api/projects", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchProjects();
  };

  /* ================= EDIT ================= */
  const edit = (project: Project) => {
    const { _id, tech, ...clean } = project;
    setForm({ ...clean, tech });
    setTechInput(tech.join(", "));
    setEditingId(_id!);
  };

  return (
    <div className="space-y-10 w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-gray-400 mt-1">
          Manage featured projects
        </p>
      </div>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 w-full">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Project" : "Add Project"}
        </h2>

        {/* TITLE */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Project Title
          </label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* ICON */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Icon
          </label>
          <select
            value={form.icon}
            onChange={(e) =>
              setForm({ ...form, icon: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
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
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Tech Stack (comma separated)
          </label>
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* LINKS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Live Demo URL
            </label>
            <input
              value={form.link}
              onChange={(e) =>
                setForm({ ...form, link: e.target.value })
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              GitHub URL
            </label>
            <input
              value={form.github}
              onChange={(e) =>
                setForm({ ...form, github: e.target.value })
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Project"
            : "Create Project"}
        </button>

        {/* FEEDBACK */}
        {success && (
          <p className="text-green-400 text-sm">
            Project saved successfully
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-4 w-full">
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex justify-between items-start bg-slate-900 border border-slate-800 rounded-lg p-4"
          >
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-gray-400 mt-1">
                {project.tech.join(", ")}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => edit(project)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={() => remove(project._id!)}
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
