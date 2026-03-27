"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

type AuthMode = "login" | "register" | "forgot";

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: AuthMode;
}

export function AuthModal({ onClose, defaultMode = "login" }: AuthModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleLogin = async () => {
    setError(""); setSuccess(""); setLoading(true);
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
      onClose();
      if (!data.user?.treeId) router.push("/profile");
      else router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      setSuccess("Account created! Check your email to verify. / अकाउंट बनाया गया! ईमेल सत्यापित करें।");
      setMode("login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSuccess("Reset link sent to your email. / रीसेट लिंक ईमेल पर भेजा गया।");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSuccess("Verification email sent! / सत्यापन ईमेल भेजा गया!");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "login") handleLogin();
    else if (mode === "register") handleRegister();
    else handleForgot();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-bg-primary rounded-t-2xl sm:rounded-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-dark">
                {mode === "forgot" ? "Reset Password / पासवर्ड रीसेट" : mode === "register" ? "Register / रजिस्टर" : "Login / लॉगिन"}
              </h2>
              <p className="text-sm text-dark/40 mt-0.5">
                {mode === "forgot"
                  ? "Enter your email / ईमेल डालें"
                  : mode === "register"
                    ? "Create your account / अकाउंट बनाएं"
                    : "Welcome back / वापसी पर स्वागत"}
              </p>
            </div>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-black/10">
              <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "22px" }}>close</span>
            </button>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {success}
              {success.includes("verify") && (
                <button onClick={handleResend} disabled={loading} className="ml-2 underline hover:no-underline">Resend</button>
              )}
            </div>
          )}
          {error && (
            <div className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
              {error.includes("not verified") && (
                <button onClick={handleResend} disabled={loading} className="ml-2 underline hover:no-underline">Resend</button>
              )}
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            {mode === "register" && (
              <label className="block">
                <span className="text-sm font-medium text-dark">Full Name / पूरा नाम</span>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rajesh Patil" className="input-field mt-1" />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-medium text-dark">{t("auth.enterEmail")}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field mt-1" />
            </label>
            {mode !== "forgot" && (
              <label className="block">
                <span className="text-sm font-medium text-dark">Password / पासवर्ड</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                  className="input-field mt-1"
                  onKeyDown={(e) => { if (e.key === "Enter" && email && password) handleSubmit(); }} />
              </label>
            )}

            <button onClick={handleSubmit}
              disabled={loading || !email.includes("@") || (mode !== "forgot" && !password) || (mode === "register" && !fullName)}
              className="btn-primary w-full">
              {loading ? t("common.loading")
                : mode === "register" ? "Register / रजिस्टर करें"
                : mode === "forgot" ? "Send Reset Link / रीसेट लिंक भेजें"
                : "Login / लॉगिन करें"}
            </button>

            {mode === "login" && (
              <button onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                className="w-full text-center text-xs text-accent hover:underline">
                Forgot password? / पासवर्ड भूल गए?
              </button>
            )}

            <p className="text-center text-xs text-dark/40">
              {mode === "login" ? (
                <>No account?{" "}
                  <button onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-accent hover:underline">
                    Register / रजिस्टर करें
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-accent hover:underline">
                    Login / लॉगिन करें
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
