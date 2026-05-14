"use client"

import type React from "react"
import { signIn } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, KeyRound, ShieldCheck, Send } from "lucide-react"

type Step = "login" | "forgot" | "otp" | "reset"


function Alert({ type, msg }: { type: "error" | "success"; msg: string }) {
  const isErr = type === "error"
  return (
    <div className={`mb-4 p-3 rounded-lg flex items-start gap-3 ${isErr ? "bg-red-500/10 border border-red-500/30" : "bg-green-500/10 border border-green-500/30"}`}>
      {isErr ? <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />}
      <p className={`text-sm font-medium ${isErr ? "text-red-300" : "text-green-300"}`}>{msg}</p>
    </div>
  )
}

function BackBtn({ to, onClick, disabled }: { to: Step; onClick: (s: Step) => void; disabled?: boolean }) {
  return (
    <button onClick={() => onClick(to)} className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-6 transition-colors" disabled={disabled}>
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  )
}

function SubmitBtn({ onClick, disabled, loading, children }: { onClick: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled || loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none flex items-center justify-center gap-2">
      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  )
}


export default function AdminLogin() {
  const [step, setStep] = useState<Step>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otpTimer, setOtpTimer] = useState(0)

  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (otpTimer <= 0) return
    const t = setInterval(() => setOtpTimer((p) => p - 1), 1000)
    return () => clearInterval(t)
  }, [otpTimer])

  const clear = () => { setError(""); setSuccess("") }

  const goTo = (s: Step) => {
    clear()
    if (s === "otp") setOtpDigits(["", "", "", "", "", ""])
    if (s === "reset") { setNewPassword(""); setConfirmPassword("") }
    setStep(s)
  }

  const handleLogin = async () => {
    if (!email || !password) return
    clear(); setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) { setError("Invalid email or password.") }
    else { setSuccess("Login successful! Redirecting…"); setTimeout(() => { window.location.href = "/admin" }, 500) }
  }

  const handleSendOtp = async () => {
    if (!email) { setError("Please enter your email."); return }
    clear(); setLoading(true)
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send OTP."); setLoading(false); return }
      setSuccess("OTP sent to your email!")
      setOtpTimer(60)
      setTimeout(() => goTo("otp"), 1000)
    } catch { setError("Network error. Try again.") }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("")
    if (otp.length !== 6) { setError("Please enter the full 6-digit code."); return }
    clear(); setLoading(true)
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Invalid OTP."); setLoading(false); return }
      setResetToken(data.resetToken)
      setSuccess("OTP verified!")
      setTimeout(() => goTo("reset"), 800)
    } catch { setError("Network error. Try again.") }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return }
    clear(); setLoading(true)
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetToken, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Reset failed."); setLoading(false); return }
      setSuccess("Password reset! Redirecting to login…")
      setTimeout(() => { setPassword(""); goTo("login") }, 1500)
    } catch { setError("Network error. Try again.") }
    setLoading(false)
  }

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const d = [...otpDigits]; d[i] = v.slice(-1); setOtpDigits(d)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const d = ["", "", "", "", "", ""]
    for (let i = 0; i < p.length; i++) d[i] = p[i]
    setOtpDigits(d)
    otpRefs.current[Math.min(p.length, 5)]?.focus()
  }
  const handleEnter = (e: React.KeyboardEvent, fn: () => void) => { if (e.key === "Enter" && !loading) fn() }

  const masked = email ? email.replace(/(.{2})(.*)(@.*)/, "$1****$3") : "your email"

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">AP</span>
            </div>
            <span className="text-white font-semibold text-base sm:text-lg">Admin Portal</span>
          </div>
        </div>
      </nav>

      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-3 sm:px-4 py-6 pt-20 sm:pt-24 md:pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md backdrop-blur-md bg-slate-900/80 border border-slate-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl">

          {step === "login" && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-4">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Admin Access</h1>
                <p className="text-slate-400 text-sm">Sign in to your admin dashboard</p>
              </div>
              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="email" placeholder="admin@example.com" className="w-full pl-10 pr-4 py-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleEnter(e, handleLogin)} disabled={loading} />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleEnter(e, handleLogin)} disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-400 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <SubmitBtn onClick={handleLogin} disabled={!email || !password} loading={loading}>
                <Lock className="w-5 h-5" /> <span>Sign In</span>
              </SubmitBtn>
              <button onClick={() => goTo("forgot")} className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm mt-5 transition-colors">
                Forgot password?
              </button>
              <p className="text-center text-slate-500 text-xs mt-4">Authorized personnel only</p>
            </div>
          )}

          {step === "forgot" && (
            <div>
              <BackBtn to="login" onClick={goTo} disabled={loading} />
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                  <KeyRound className="w-6 h-6 text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Forgot Password</h1>
                <p className="text-slate-400 text-sm">Enter your admin email to receive an OTP</p>
              </div>
              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="email" placeholder="avpodder000@gmail.com" className="w-full pl-10 pr-4 py-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleEnter(e, handleSendOtp)} disabled={loading} />
                </div>
              </div>
              <SubmitBtn onClick={handleSendOtp} disabled={!email} loading={loading}>
                <Send className="w-5 h-5" /> <span>Send OTP</span>
              </SubmitBtn>
            </div>
          )}

          {step === "otp" && (
            <div>
              <BackBtn to="forgot" onClick={goTo} disabled={loading} />
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/30 mb-4">
                  <ShieldCheck className="w-6 h-6 text-violet-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Verify OTP</h1>
                <p className="text-slate-400 text-sm">Enter the 6-digit code sent to <span className="text-cyan-400">{masked}</span></p>
              </div>
              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handleOtpPaste}>
                {otpDigits.map((d, i) => (
                  <input key={i} ref={(el) => { otpRefs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { handleOtpKey(i, e); if (e.key === "Enter") handleVerifyOtp() }}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    disabled={loading} />
                ))}
              </div>
              {otpTimer > 0 && (
                <p className="text-center text-slate-500 text-xs mb-4">Resend available in {otpTimer}s</p>
              )}
              {otpTimer <= 0 && (
                <button onClick={handleSendOtp} disabled={loading} className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm mb-4 transition-colors disabled:opacity-50">
                  Resend OTP
                </button>
              )}
              <SubmitBtn onClick={handleVerifyOtp} disabled={otpDigits.join("").length !== 6} loading={loading}>
                <ShieldCheck className="w-5 h-5" /> <span>Verify Code</span>
              </SubmitBtn>
            </div>
          )}

          {step === "reset" && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                  <Lock className="w-6 h-6 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
                <p className="text-slate-400 text-sm">Create a new password for your account</p>
              </div>
              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-400 transition-colors">
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => handleEnter(e, handleResetPassword)} disabled={loading} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-400 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {newPassword && confirmPassword && (
                <p className={`text-xs mb-4 ${newPassword === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
              <SubmitBtn onClick={handleResetPassword} disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword} loading={loading}>
                <Lock className="w-5 h-5" /> <span>Reset Password</span>
              </SubmitBtn>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
