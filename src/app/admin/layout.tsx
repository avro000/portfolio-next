"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AdminLayout from "./components/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()

  // Login page doesn't need auth guard
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show nothing while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated — redirect to login (replaces history so back button won't work)
  if (status === "unauthenticated") {
    router.replace("/admin/login")
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
