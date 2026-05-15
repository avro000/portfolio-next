"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import AdminLayout from "./components/admin-layout"

function SessionExpiredToast() {
  const [countdown, setCountdown] = useState(5)
  const hasRedirected = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true
        signOut({ redirect: false }).then(() => {
          window.location.replace("/admin/login")
        })
      }
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1A1A1A]/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm mx-4 bg-[var(--color-bg-offwhite,#EDE8E2)] border border-[var(--color-border,#B0A89E)] p-8 text-center"
        style={{ animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      >
        <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-[var(--color-border,#B0A89E)] bg-[var(--color-bg-warm,#D2C8BC)]">
          <svg className="w-5 h-5 text-[var(--color-text,#1A1A1A)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted,#5A5550)] mb-3">
          Session Expired
        </p>

        <h2 className="font-bold text-2xl text-[var(--color-text,#1A1A1A)] mb-2" style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>
          Logging out.
        </h2>

        <p className="text-sm text-[var(--color-text-muted,#5A5550)] mb-6 leading-relaxed">
          Your session has expired for security.<br />
          Redirecting in <span className="font-semibold text-[var(--color-text,#1A1A1A)]">{Math.max(countdown, 0)}s</span>
        </p>

        <div className="w-full h-px bg-[var(--color-border,#B0A89E)] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[var(--color-text,#1A1A1A)]"
            style={{
              width: `${((5 - Math.max(countdown, 0)) / 5) * 100}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { status } = useSession()

  // Both refs update synchronously — no async state race conditions
  const wasAuthRef = useRef(false)
  const expiredRef = useRef(false)

  // Force re-render trigger (only used to make React show the toast)
  const [, forceRender] = useState(0)

  // Login page — no guard needed
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Track when user becomes authenticated
  if (status === "authenticated" && !expiredRef.current) {
    wasAuthRef.current = true
  }

  // Detect transition: authenticated → unauthenticated = expired
  if (status === "unauthenticated" && wasAuthRef.current && !expiredRef.current) {
    expiredRef.current = true
    wasAuthRef.current = false
    // Trigger a re-render to show the toast
    setTimeout(() => forceRender((n) => n + 1), 0)
  }

  // Session expired — show toast overlay for 5 seconds (this blocks all other paths)
  if (expiredRef.current) {
    return (
      <>
        <AdminLayout>{children}</AdminLayout>
        <SessionExpiredToast />
      </>
    )
  }

  // Loading — spinner
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Never was authenticated (direct URL access) — redirect immediately
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.replace("/admin/login")
    }
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
