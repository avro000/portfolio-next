"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import AdminLayout from "./components/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Allow login page without the admin layout wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Wrap everything else with AdminLayout
  return <AdminLayout>{children}</AdminLayout>
}
