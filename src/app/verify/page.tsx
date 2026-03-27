"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

type AuthMode = "login" | "register" | "forgot";

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          setError("Email not verified. Check your inbox or resend verification.");
          return;
        }
        setError(data.error || "Login failed");
        return;
      }

      if (!data.user?.treeId) {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Account created! Please check your email to verify. / अकाउंट बनाया गया! कृपया ईमेल सत्यापित करें।");
      setMode("login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess("Password reset link sent to your email. / पासवर्ड रीसेट लिंक ईमेल पर भेजा गया।");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification");
        return;
      }

      setSuccess("Verification email sent! Check your inbox. / सत्यापन ईमेल भेजा गया!");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "login") handleLogin();
    else if (mode === "register") handleRegister();
    else if (mode === "forgot") handleForgotPassword();
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
            {mode === "forgot" ? "Reset Password / पासवर्ड रीसेट" : t("auth.verifyTitle")}
          </h1>
          <p className="mt-1 text-sm text-dark/40">
            {mode === "forgot"
              ? "Enter your email to receive a reset link / रीसेट लिंक पाने के लिए ईमेल डालें"
              : mode === "register"
                ? "Create your account / अपना अकाउंट बनाएं"
                : "Login to continue / लॉगिन करें"}
          </p>

          {/* Success message */}
          {success && (
            <div className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {success}
              {success.includes("verify") && (
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="ml-2 underline hover:no-underline"
                >
                  Resend
                </button>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
              {error.includes("not verified") && (
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="ml-2 underline hover:no-underline"
                >
                  Resend Verification
                </button>
              )}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {/* Full Name — only for register */}
            {mode === "register" && (
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

            {/* Email */}
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

            {/* Password — not for forgot */}
            {mode !== "forgot" && (
              <label className="block">
                <span className="text-sm font-medium text-dark">
                  Password / पासवर्ड
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                  className="input-field mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) handleSubmit();
                  }}
                />
              </label>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !email.includes("@") ||
                (mode !== "forgot" && !password) ||
                (mode === "register" && !fullName)
              }
              className="btn-primary w-full"
            >
              {loading
                ? t("common.loading")
                : mode === "register"
                  ? "Register / रजिस्टर करें"
                  : mode === "forgot"
                    ? "Send Reset Link / रीसेट लिंक भेजें"
                    : "Login / लॉगिन करें"}
            </button>

            {/* Forgot password link — only on login */}
            {mode === "login" && (
              <button
                onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                className="w-full text-center text-xs text-accent hover:underline"
              >
                Forgot password? / पासवर्ड भूल गए?
              </button>
            )}

            {/* Mode switchers */}
            <p className="text-center text-xs text-dark/40">
              {mode === "login" ? (
                <>
                  No account?{" "}
                  <button
                    onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                    className="text-accent hover:underline"
                  >
                    Register here / यहां रजिस्टर करें
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                    className="text-accent hover:underline"
                  >
                    Login here / यहां लॉगिन करें
                  </button>
                </>
              )}
            </p>
          </div>
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
