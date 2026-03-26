"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEmailAuth, useAuth } from "@/hooks/useAuth";

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const { sendLink, completeSignIn, error: emailError, sending: emailSending, linkSent } = useEmailAuth();

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/profile");
    }
  }, [user, authLoading, router]);

  // On page load, check if this is a magic link return
  useEffect(() => {
    const finishSignIn = async () => {
      setCompleting(true);
      try {
        const result = await completeSignIn();
        if (result) {
          router.push("/profile");
        } else {
          setCompleting(false);
        }
      } catch {
        setCompleteError("लिंक अमान्य या समाप्त हो गया। कृपया दोबारा भेजें। / Link invalid or expired. Please send again.");
        setCompleting(false);
      }
    };

    if (typeof window !== "undefined") {
      const url = window.location.href;
      // Firebase magic links contain these parameters
      if (url.includes("mode=email") || url.includes("oobCode=") || url.includes("apiKey=")) {
        finishSignIn();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailSubmit = async () => {
    await sendLink(email);
  };

  // Show loading while completing sign-in from magic link
  if (completing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
        <div className="card p-8 text-center">
          <div className="text-3xl">🔐</div>
          <p className="mt-3 font-medium text-dark">सत्यापित कर रहे हैं... / Verifying...</p>
          <p className="mt-1 text-sm text-dark/40">कृपया प्रतीक्षा करें / Please wait</p>
        </div>
      </div>
    );
  }

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

                {(emailError || completeError) && (
                  <p className="text-sm text-error">{emailError || completeError}</p>
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
