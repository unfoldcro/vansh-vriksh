"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError("");

    if (!token || !email) {
      setError("Invalid reset link. / अमान्य रीसेट लिंक।");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match. / पासवर्ड मेल नहीं खाते।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Reset failed.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <div className="text-4xl">❌</div>
        <h1 className="mt-4 text-xl font-bold text-error">Invalid Reset Link</h1>
        <p className="mt-2 text-sm text-dark/60">अमान्य रीसेट लिंक। कृपया दोबारा अनुरोध करें।</p>
        <Link href="/verify" className="btn-primary mt-4 inline-block text-sm">
          Go to Login / लॉगिन पर जाएं
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-4 text-xl font-bold text-success">Password Reset!</h1>
        <p className="mt-2 text-sm text-dark/60">
          पासवर्ड सफलतापूर्वक बदला गया। अब लॉगिन करें।
        </p>
        <Link href="/verify" className="btn-primary mt-4 inline-block text-sm">
          Login / लॉगिन करें
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-6">
        <h1 className="font-heading text-2xl font-bold text-dark">
          Reset Password / नया पासवर्ड सेट करें
        </h1>
        <p className="mt-1 text-sm text-dark/40">
          Enter your new password below. / नीचे नया पासवर्ड डालें।
        </p>

        {error && (
          <p className="mt-3 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-dark">New Password / नया पासवर्ड</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="input-field mt-1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-dark">Confirm Password / पासवर्ड पुष्टि करें</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="input-field mt-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newPassword && confirmPassword) handleReset();
              }}
            />
          </label>

          <button
            onClick={handleReset}
            disabled={loading || !newPassword || !confirmPassword}
            className="btn-primary w-full"
          >
            {loading ? "Resetting..." : "Reset Password / पासवर्ड रीसेट करें"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <Suspense
        fallback={
          <div className="card p-8 text-center">
            <div className="text-dark/40">Loading...</div>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
