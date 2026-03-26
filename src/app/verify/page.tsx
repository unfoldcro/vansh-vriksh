"use client";

import { useState } from "react";
import Link from "next/link";
import { useEmailAuth } from "@/hooks/useAuth";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const { sendLink, error: emailError, sending: emailSending, linkSent } = useEmailAuth();

  const handleEmailSubmit = async () => {
    await sendLink(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link href="/" className="mb-6 inline-block text-sm text-dark/40 transition-colors hover:text-accent">
          &larr; वापस / Back
        </Link>

        <div className="card p-6">
          <h1 className="font-hindi text-2xl font-bold text-dark">
            सत्यापन / Verification
          </h1>
          <p className="mt-1 text-sm text-dark/40">
            अपना अकाउंट सत्यापित करें / Verify your account
          </p>

          {/* Email Auth */}
          <div className="mt-6 space-y-4">
            {!linkSent ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-dark">ईमेल / Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field mt-1"
                  />
                </label>

                <p className="text-xs text-dark/40">
                  हम आपको एक लिंक भेजेंगे। लिंक पर क्लिक करें और लॉगिन हो जाएगा।
                  <br />
                  We&apos;ll send you a magic link. Click it to sign in.
                </p>

                {emailError && (
                  <p className="text-sm text-error">{emailError}</p>
                )}

                <button
                  onClick={handleEmailSubmit}
                  disabled={emailSending || !email.includes("@")}
                  className="btn-primary w-full"
                >
                  {emailSending ? "भेज रहे हैं... / Sending..." : "लिंक भेजें / Send Link"}
                </button>
              </>
            ) : (
              <div className="rounded-card bg-success/10 p-4 text-center">
                <div className="text-2xl">✅</div>
                <p className="mt-2 font-medium text-success">लिंक भेजा गया!</p>
                <p className="mt-1 text-sm text-dark/50">
                  अपना ईमेल चेक करें और लिंक पर क्लिक करें।
                  <br />
                  Check your email and click the link.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
