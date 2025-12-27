"use client";

import { useEffect, useState } from "react";

type Highlight = {
  title: string;
  description: string;
};

type AboutForm = {
  paragraph1: string;
  paragraph2: string;
  image: string;
  highlights: Highlight[];
};

const emptyForm: AboutForm = {
  paragraph1: "",
  paragraph2: "",
  image: "",
  highlights: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
};

const MAX_IMAGE_SIZE = 300 * 1024;

export default function AboutEditor() {
  const [form, setForm] = useState<AboutForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        const { _id, ...clean } = d;
        setForm({ ...emptyForm, ...clean });
      });
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (file: File) => {
    setImageError(null);

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 300KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE ================= */
  const save = async () => {
    setLoading(true);
    setSuccess(false);
    setSaveError(null);

    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      setSaveError("Failed to update About section");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">About Section</h1>
        <p className="text-gray-400">
          Manage your about content and highlights
        </p>
      </div>

      {/* FORM CARD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* PARAGRAPH 1 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Paragraph 1
          </label>
          <textarea
            value={form.paragraph1}
            onChange={(e) =>
              setForm({ ...form, paragraph1: e.target.value })
            }
            rows={4}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded
                       focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* PARAGRAPH 2 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Paragraph 2
          </label>
          <textarea
            value={form.paragraph2}
            onChange={(e) =>
              setForm({ ...form, paragraph2: e.target.value })
            }
            rows={4}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded
                       focus:outline-none focus:border-cyan-500 mt-2"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">
            About Image (Max 300KB)
          </label>

          <div
            className="border border-dashed border-slate-700 rounded-lg p-4
                       bg-slate-800 hover:border-cyan-500 transition mt-2"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                handleImageUpload(e.target.files[0])
              }
              className="text-sm text-gray-300"
            />
          </div>

          {/* IMAGE ERROR (only here) */}
          {imageError && (
            <p className="text-red-400 text-sm">
              {imageError}
            </p>
          )}

          {/* IMAGE PREVIEW */}
          {form.image && (
            <img
              src={form.image}
              className="w-40 rounded-xl border border-slate-700"
            />
          )}
        </div>

        {/* HIGHLIGHTS */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-400">
            Highlights (3 only)
          </label>

          {form.highlights.map((h, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4 mt-2">
              <input
                value={h.title}
                onChange={(e) => {
                  const copy = [...form.highlights];
                  copy[i].title = e.target.value;
                  setForm({ ...form, highlights: copy });
                }}
                placeholder={`Highlight ${i + 1} Title`}
                className="p-3 bg-slate-800 border border-slate-700 rounded
                           focus:outline-none focus:border-cyan-500"
              />

              <input
                value={h.description}
                onChange={(e) => {
                  const copy = [...form.highlights];
                  copy[i].description = e.target.value;
                  setForm({ ...form, highlights: copy });
                }}
                placeholder="Description"
                className="p-3 bg-slate-800 border border-slate-700 rounded
                           focus:outline-none focus:border-cyan-500"
              />
            </div>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded font-semibold
                     hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* SAVE ERROR */}
        {saveError && (
          <p className="text-red-400 text-sm">
            {saveError}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-green-400 text-sm">
            About section updated successfully
          </p>
        )}
      </div>
    </div>
  );
}
