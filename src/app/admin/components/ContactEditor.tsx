"use client";

import { useEffect, useState } from "react";

type ContactForm = {
  email: string;
  phone: string;
  location: string;
};

const emptyForm: ContactForm = {
  email: "",
  phone: "",
  location: "",
};

export default function ContactEditor() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* FETCH CONTACT */
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        const { _id, key, ...clean } = d;
        setForm({ ...emptyForm, ...clean });
      });
  }, []);

  /* SAVE */
  const save = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Failed to update contact info");
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Contact Section</h1>
        <p className="text-gray-400">
          Update your contact details shown on the website
        </p>
      </div>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 w-full">
        {/* EMAIL */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
            placeholder="example@gmail.com"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
            placeholder="+91 9000000000"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Location
          </label>
          <input
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="w-full p-3 rounded bg-slate-800 border border-slate-700
                       focus:outline-none focus:border-cyan-500"
            placeholder="City, Country"
          />
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded font-semibold
                     hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* FEEDBACK */}
        {success && (
          <p className="text-green-400">
            Contact details updated successfully
          </p>
        )}
        {error && (
          <p className="text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}