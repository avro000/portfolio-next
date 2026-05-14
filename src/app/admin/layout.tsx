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

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return <AdminLayout>{children}</AdminLayout>
}
