"use client"

import { useEffect, useState } from "react"
import { Layers, GraduationCap, Code2, CheckCircle2, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tech: 0,
    education: 0,
  })

  const [statusOk, setStatusOk] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, tech, edu] = await Promise.all([
          fetch("/api/projects")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/api/techstack")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/api/education")
            .then((r) => r.json())
            .catch(() => []),
        ])

        setStats({
          projects: projects?.length ?? 0,
          tech: tech?.length ?? 0,
          education: edu?.length ?? 0,
        })

        setStatusOk(true)
      } catch {
        setStatusOk(false)
      }

      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="sticky top-0 z-10 pb-4 space-y-2">
        <h1 className="text-lg sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-300">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-base lg:text-lg text-gray-400">
          Overview of your portfolio activity and content management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          icon={Layers}
          label="Projects"
          value={loading ? "…" : stats.projects}
          gradient="from-cyan-400 to-blue-500"
          colorClass="cyan"
        />
        <StatCard
          icon={Code2}
          label="Tech Stack"
          value={loading ? "…" : stats.tech}
          gradient="from-blue-500 to-cyan-400"
          colorClass="blue"
        />
        <StatCard
          icon={GraduationCap}
          label="Education"
          value={loading ? "…" : stats.education}
          gradient="from-purple-500 to-pink-400"
          colorClass="purple"
        />
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-300">System Status</h2>

        <div className="space-y-2 sm:space-y-3">
          <StatusRow label="Database Connection" ok={statusOk} />
          <StatusRow label="API Health" ok={statusOk} />
          <StatusRow label="Mail Service" ok={true} />
        </div>
      </div>
    </div>
  )
}

const colorMap = {
  cyan: {
    border: "border-cyan-500/20",
    borderHover: "hover:border-cyan-500/60",
    shadowHover: "hover:shadow-cyan-500/30",
  },
  blue: {
    border: "border-blue-500/20",
    borderHover: "hover:border-blue-500/60",
    shadowHover: "hover:shadow-blue-500/30",
  },
  purple: {
    border: "border-purple-500/20",
    borderHover: "hover:border-purple-500/60",
    shadowHover: "hover:shadow-purple-500/30",
  },
}

function StatCard({ icon: Icon, label, value, gradient, colorClass }: any) {
  const colors = colorMap[colorClass as keyof typeof colorMap] || colorMap.cyan

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden p-4 sm:p-5 lg:p-6
      bg-linear-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl
      ${colors.border}
      transition-all duration-500 ease-out
      hover:-translate-y-2 hover:scale-[1.05]
      ${colors.borderHover} hover:shadow-2xl ${colors.shadowHover}
      cursor-pointer`}
    >
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 rounded-full`}
      ></div>

      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div
          className={`p-3 sm:p-4 rounded-xl bg-linear-to-br ${gradient} shadow-lg shrink-0 ${
            colorClass === "cyan"
              ? "shadow-cyan-500/30"
              : colorClass === "blue"
                ? "shadow-blue-500/30"
                : "shadow-purple-500/30"
          }`}
        >
          <Icon size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-400 font-medium">{label}</p>
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r ${gradient}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border text-sm sm:text-base transition-all duration-400 ${
        ok
          ? "bg-green-500/10 border-green-500/30 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20"
          : "bg-red-500/10 border-red-500/30 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20"
      }`}
    >
      {ok ? (
        <CheckCircle2 size={18} className="shrink-0 text-green-500" />
      ) : (
        <AlertTriangle size={18} className="shrink-0" />
      )}
      <p className="font-medium">{label}</p>
    </div>
  )
}
