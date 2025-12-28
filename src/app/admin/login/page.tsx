"use client"

import type React from "react"

import { signIn } from "next-auth/react"
import { useState, useTransition } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()

  const isFormValid = email.length > 0 && password.length > 0

  const handleLogin = () => {
    if (!isFormValid) return

    setError("")
    setSuccess("")

    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password. Please try again.")
      } else {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/admin"
        }, 500)
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid && !isPending) {
      handleLogin()
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">AP</span>
            </div>
            <span className="text-white font-semibold text-base sm:text-lg">Admin Portal</span>
          </div>
        </div>
      </nav>

      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24 md:pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md backdrop-blur-md bg-slate-900/80 border border-slate-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-3 sm:mb-4">
              <Lock className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Admin Access</h1>
            <p className="text-slate-400 text-xs sm:text-sm">Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 shrink-0 mt-0.5" />
              <p className="text-green-300 text-xs sm:text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="mb-3 sm:mb-4 relative">
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 text-slate-500" />
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-6 relative">
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 sm:top-3.5 text-slate-500 hover:text-slate-400 transition-colors"
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" />
                ) : (
                  <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!isFormValid || isPending}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin">
                  <Lock className="w-4 sm:w-5 h-4 sm:h-5" />
                </span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>

          <p className="text-center text-slate-500 text-xs mt-4 sm:mt-6">Authorized personnel only</p>
        </div>
      </div>
    </>
  )
}
