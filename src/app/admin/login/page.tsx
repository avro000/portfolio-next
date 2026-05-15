"use client"

import type React from "react"
import { signIn } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, KeyRound, ShieldCheck, Send } from "lucide-react"

type Step = "login" | "forgot" | "otp" | "reset"


function Alert({ type, msg }: { type: "error" | "success"; msg: string }) {
  const isErr = type === "error"
  return (
    <div className={`mb-5 px-4 py-3 border flex items-start gap-3 ${isErr ? "bg-red-50/50 border-red-300/50 text-red-800" : "bg-emerald-50/50 border-emerald-300/50 text-emerald-800"}`}>
      {isErr ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
      <p className="text-sm font-medium">{msg}</p>
    </div>
  )
}

function BackBtn({ to, onClick, disabled }: { to: Step; onClick: (s: Step) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => onClick(to)}
      className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs font-medium tracking-[0.1em] uppercase mb-8 transition-colors duration-300"
      disabled={disabled}
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  )
}

function SubmitBtn({ onClick, disabled, loading, children }: { onClick: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full bg-[var(--color-text)] text-[var(--color-bg)] font-medium py-3.5 px-4 text-sm tracking-[0.05em] uppercase transition-all duration-300
                 hover:opacity-90 hover:tracking-[0.1em]
                 disabled:opacity-30 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2.5"
    >
      {loading ? <span className="w-4 h-4 border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)] rounded-full animate-spin" /> : children}
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
  const [mounted, setMounted] = useState(false)

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otpTimer, setOtpTimer] = useState(0)

  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

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

  const inputClasses = "w-full pl-11 pr-4 py-3.5 text-sm bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-text)] transition-colors duration-300 font-sans"
  const inputWithToggle = "w-full pl-11 pr-11 py-3.5 text-sm bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-text)] transition-colors duration-300 font-sans"
  const iconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]"
  const labelClasses = "block text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] mb-2.5"
  const toggleClasses = "absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300"

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-bg)]">
      {/* Minimal top bar */}
      <nav className="w-full border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <span className="font-serif font-bold text-xl text-[var(--color-text)] tracking-tight">AP</span>
            <span className="hidden sm:inline text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
              ← Back to portfolio
            </span>
          </a>
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
            Admin
          </span>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div
          className={`w-full max-w-[420px] transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >

          {/* ─── LOGIN STEP ─── */}
          {step === "login" && (
            <div>
              <div className="mb-10">
                <p className="section-label mb-4">Authentication</p>
                <h1 className="heading-editorial text-[clamp(2.2rem,5vw,3.5rem)] mb-3">
                  Sign in.
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  Enter your credentials to access the admin dashboard.
                </p>
              </div>

              {/* Decorative line */}
              <div className="w-full h-px bg-[var(--color-border)] mb-8" />

              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}

              <div className="mb-5">
                <label className={labelClasses}>Email</label>
                <div className="relative">
                  <Mail className={iconClasses} />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className={inputClasses}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, handleLogin)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClasses}>Password</label>
                <div className="relative">
                  <Lock className={iconClasses} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputWithToggle}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, handleLogin)}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={toggleClasses}>
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <SubmitBtn onClick={handleLogin} disabled={!email || !password} loading={loading}>
                Sign In <span className="text-xs opacity-60">→</span>
              </SubmitBtn>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => goTo("forgot")}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs font-medium tracking-[0.05em] transition-colors duration-300"
                >
                  Forgot password?
                </button>
                <p className="text-[var(--color-text-muted)]/50 text-[10px] font-medium tracking-[0.1em] uppercase">
                  Authorized only
                </p>
              </div>
            </div>
          )}

          {/* ─── FORGOT PASSWORD STEP ─── */}
          {step === "forgot" && (
            <div>
              <BackBtn to="login" onClick={goTo} disabled={loading} />

              <div className="mb-10">
                <p className="section-label mb-4">Account Recovery</p>
                <h1 className="heading-editorial text-[clamp(2rem,5vw,3rem)] mb-3">
                  Reset password.
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  Enter your admin email to receive a verification code.
                </p>
              </div>

              <div className="w-full h-px bg-[var(--color-border)] mb-8" />

              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}

              <div className="mb-6">
                <label className={labelClasses}>Admin Email</label>
                <div className="relative">
                  <Mail className={iconClasses} />
                  <input
                    type="email"
                    placeholder="avpodder000@gmail.com"
                    className={inputClasses}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, handleSendOtp)}
                    disabled={loading}
                  />
                </div>
              </div>

              <SubmitBtn onClick={handleSendOtp} disabled={!email} loading={loading}>
                <Send className="w-4 h-4" /> Send Code
              </SubmitBtn>
            </div>
          )}

          {/* ─── OTP VERIFICATION STEP ─── */}
          {step === "otp" && (
            <div>
              <BackBtn to="forgot" onClick={goTo} disabled={loading} />

              <div className="mb-10">
                <p className="section-label mb-4">Verification</p>
                <h1 className="heading-editorial text-[clamp(2rem,5vw,3rem)] mb-3">
                  Enter code.
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  A 6-digit code was sent to <span className="text-[var(--color-text)] font-medium">{masked}</span>
                </p>
              </div>

              <div className="w-full h-px bg-[var(--color-border)] mb-8" />

              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}

              <div className="flex justify-center gap-2.5 sm:gap-3 mb-6" onPaste={handleOtpPaste}>
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { handleOtpKey(i, e); if (e.key === "Enter") handleVerifyOtp() }}
                    className="w-12 h-14 text-center text-xl font-serif font-bold bg-transparent border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-text)] transition-colors duration-300"
                    disabled={loading}
                  />
                ))}
              </div>

              {otpTimer > 0 && (
                <p className="text-center text-[var(--color-text-muted)] text-xs tracking-wide mb-5">
                  Resend available in {otpTimer}s
                </p>
              )}
              {otpTimer <= 0 && (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full text-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs font-medium tracking-[0.05em] mb-5 transition-colors duration-300 disabled:opacity-50"
                >
                  Resend code
                </button>
              )}

              <SubmitBtn onClick={handleVerifyOtp} disabled={otpDigits.join("").length !== 6} loading={loading}>
                <ShieldCheck className="w-4 h-4" /> Verify Code
              </SubmitBtn>
            </div>
          )}

          {/* ─── RESET PASSWORD STEP ─── */}
          {step === "reset" && (
            <div>
              <div className="mb-10">
                <p className="section-label mb-4">New Password</p>
                <h1 className="heading-editorial text-[clamp(2rem,5vw,3rem)] mb-3">
                  Almost there.
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  Create a new password for your admin account.
                </p>
              </div>

              <div className="w-full h-px bg-[var(--color-border)] mb-8" />

              {error && <Alert type="error" msg={error} />}
              {success && <Alert type="success" msg={success} />}

              <div className="mb-5">
                <label className={labelClasses}>New Password</label>
                <div className="relative">
                  <Lock className={iconClasses} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputWithToggle}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={toggleClasses}>
                    {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClasses}>Confirm Password</label>
                <div className="relative">
                  <Lock className={iconClasses} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputWithToggle}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, handleResetPassword)}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={toggleClasses}>
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {newPassword && confirmPassword && (
                <p className={`text-xs tracking-wide mb-5 ${newPassword === confirmPassword ? "text-emerald-700" : "text-red-700"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              <SubmitBtn onClick={handleResetPassword} disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword} loading={loading}>
                Reset Password <span className="text-xs opacity-60">→</span>
              </SubmitBtn>
            </div>
          )}

          {/* Bottom decorative element */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--color-text-muted)]/40">
              AP
            </span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
