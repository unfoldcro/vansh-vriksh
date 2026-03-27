"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

type AuthTab = "otp" | "password";
type PasswordMode = "login" | "register";

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();
  const { t } = useTranslation();

  const [tab, setTab] = useState<AuthTab>("password");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  // Password tab state
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("login");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      if (user.treeId) {
        router.push("/dashboard");
      } else {
        router.push("/profile");
      }
    }
  }, [user, authLoading, router]);

  // ─── OTP Flow ───
  const handleSendOtp = async () => {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        setVerifying(false);
      } else {
        await refresh();
        if (data.isNewUser || !data.user?.treeId) {
          router.push("/profile");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("Verification failed. Please try again.");
      setVerifying(false);
    }
  };

  // ─── Password Flow ───
  const handlePasswordSubmit = async () => {
    setError("");
    setPasswordLoading(true);
    try {
      const endpoint = passwordMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body = passwordMode === "register"
        ? { email, password, fullName }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setPasswordLoading(false);
      } else {
        await refresh();
        if (!data.user?.treeId) {
          router.push("/profile");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("Network error. Please try again.");
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60">
          <span className="loading-dot" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      {/* Language Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
            arrow_back
          </span>
          {t("common.back")}
        </Link>

        <div className="card p-6">
          <h1 className="font-heading text-2xl font-bold text-dark">
            {t("auth.verifyTitle")}
          </h1>
          <p className="mt-1 text-sm text-dark/40">{t("auth.verifySubtitle")}</p>

          {/* Tabs */}
          <div className="mt-5 flex rounded-lg border border-border-warm p-1">
            <button
              onClick={() => { setTab("otp"); setError(""); }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === "otp"
                  ? "bg-accent text-white"
                  : "text-dark/60 hover:text-dark"
              }`}
            >
              Email OTP
            </button>
            <button
              onClick={() => { setTab("password"); setError(""); }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === "password"
                  ? "bg-accent text-white"
                  : "text-dark/60 hover:text-dark"
              }`}
            >
              ID / Password
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          {/* ─── OTP Tab ─── */}
          {tab === "otp" && (
            <div className="mt-5 space-y-4">
              {!otpSent ? (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-dark">
                      {t("auth.enterEmail")}
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field mt-1"
                      onKeyDown={(e) =>
                        e.key === "Enter" && email.includes("@") && handleSendOtp()
                      }
                    />
                  </label>
                  <p className="text-xs text-dark/40">{t("auth.emailNote")}</p>
                  <button
                    onClick={handleSendOtp}
                    disabled={sending || !email.includes("@")}
                    className="btn-primary w-full"
                  >
                    {sending ? t("auth.sending") : t("auth.sendOtp")}
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-card bg-success/10 px-4 py-3 text-center">
                    <p className="text-sm font-medium text-success">
                      OTP sent to {email}
                    </p>
                    <p className="mt-1 text-xs text-dark/40">
                      Check your email for the 6-digit code
                    </p>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-dark">
                      Enter OTP / OTP दर्ज करें
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="input-field mt-1 text-center text-2xl tracking-[0.5em]"
                      onKeyDown={(e) =>
                        e.key === "Enter" && otp.length === 6 && handleVerifyOtp()
                      }
                    />
                  </label>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifying || otp.length !== 6}
                    className="btn-primary w-full"
                  >
                    {verifying ? t("auth.verifying") : t("auth.verify")}
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                    className="btn-ghost w-full text-sm"
                  >
                    {t("auth.resendOtp")}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── Password Tab ─── */}
          {tab === "password" && (
            <div className="mt-5 space-y-4">
              {/* Toggle login/register */}
              <div className="flex rounded-md border border-border-warm p-0.5">
                <button
                  onClick={() => { setPasswordMode("login"); setError(""); }}
                  className={`flex-1 rounded px-2 py-1.5 text-xs font-medium transition-colors ${
                    passwordMode === "login"
                      ? "bg-earth text-white"
                      : "text-dark/50 hover:text-dark"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setPasswordMode("register"); setError(""); }}
                  className={`flex-1 rounded px-2 py-1.5 text-xs font-medium transition-colors ${
                    passwordMode === "register"
                      ? "bg-earth text-white"
                      : "text-dark/50 hover:text-dark"
                  }`}
                >
                  Register
                </button>
              </div>

              {passwordMode === "register" && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">
                    Full Name / पूरा नाम
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rajesh Patil"
                    className="input-field mt-1"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-sm font-medium text-dark">
                  {t("auth.enterEmail")}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field mt-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-dark">
                  Password / पासवर्ड
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={passwordMode === "register" ? "Min 6 characters" : "Enter password"}
                  className="input-field mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) handlePasswordSubmit();
                  }}
                />
              </label>

              <button
                onClick={handlePasswordSubmit}
                disabled={
                  passwordLoading ||
                  !email.includes("@") ||
                  !password ||
                  (passwordMode === "register" && !fullName)
                }
                className="btn-primary w-full"
              >
                {passwordLoading
                  ? t("common.loading")
                  : passwordMode === "register"
                    ? "Register / रजिस्टर करें"
                    : "Login / लॉगिन करें"}
              </button>

              <p className="text-center text-xs text-dark/40">
                {passwordMode === "login" ? (
                  <>
                    No account?{" "}
                    <button
                      onClick={() => { setPasswordMode("register"); setError(""); }}
                      className="text-accent hover:underline"
                    >
                      Register here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => { setPasswordMode("login"); setError(""); }}
                      className="text-accent hover:underline"
                    >
                      Login here
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Guide link */}
        <div className="mt-4 text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
              help
            </span>
            {t("guide.onboardTitle")}
          </Link>
        </div>
      </div>
    </div>
  );
}
