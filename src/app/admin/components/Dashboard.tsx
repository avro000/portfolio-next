"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  GraduationCap,
  Code2,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tech: 0,
    education: 0,
  });

  const [statusOk, setStatusOk] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, tech, edu] = await Promise.all([
          fetch("/api/projects").then((r) => r.json()).catch(() => []),
          fetch("/api/techstack").then((r) => r.json()).catch(() => []),
          fetch("/api/education").then((r) => r.json()).catch(() => []),
        ]);

        setStats({
          projects: projects?.length ?? 0,
          tech: tech?.length ?? 0,
          education: edu?.length ?? 0,
        });

        setStatusOk(true);
      } catch {
        setStatusOk(false);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">
          Overview of your portfolio activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={Layers}
          label="Projects"
          value={loading ? "…" : stats.projects}
          gradient="from-cyan-400 to-blue-500"
        />
        <StatCard
          icon={Code2}
          label="Tech Stack"
          value={loading ? "…" : stats.tech}
          gradient="from-blue-500 to-cyan-400"
        />
        <StatCard
          icon={GraduationCap}
          label="Education"
          value={loading ? "…" : stats.education}
          gradient="from-cyan-400 to-blue-500"
        />
      </div>

      {/* STATUS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          System Status
        </h2>

        <StatusRow label="Database Connection" ok={statusOk} />
        <StatusRow label="API Health" ok={statusOk} />
        <StatusRow label="Mail Service" ok={true} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div
      className="relative group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 
      transition-all duration-500 ease-out
      hover:-translate-y-1 hover:scale-[1.03]
      hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20"
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient}`}
      ></div>

      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-linear-to-r ${gradient}`}>
          <Icon size={22} className="text-white" />
        </div>

        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 
      transition-all duration-400 hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/15"
    >
      {ok ? (
        <CheckCircle2 className="text-green-400" />
      ) : (
        <AlertTriangle className="text-red-400" />
      )}
      <p>{label}</p>
    </div>
  );
}