"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEmailAuth, useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
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
        setCompleteError(t("auth.linkExpired"));
        setCompleting(false);
      }
    };

    if (typeof window !== "undefined") {
      const url = window.location.href;
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
          <p className="mt-3 font-medium text-dark">{t("auth.verifying")}</p>
          <p className="mt-1 text-sm text-dark/40">{t("auth.pleaseWait")}</p>
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
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        {/* Email Auth Card */}
        <div className="card p-6">
          <h1 className="font-heading text-2xl font-bold text-dark">
            {t("auth.verifyTitle")}
          </h1>
          <p className="mt-1 text-sm text-dark/40">
            {t("auth.verifySubtitle")}
          </p>

          <div className="mt-6 space-y-4">
            {!linkSent ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-dark">{t("auth.enterEmail")}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field mt-1"
                    onKeyDown={(e) => e.key === "Enter" && email.includes("@") && handleEmailSubmit()}
                  />
                </label>

                <p className="text-xs text-dark/40">
                  {t("auth.emailNote")}
                </p>

                {(emailError || completeError) && (
                  <p className="text-sm text-error">{emailError || completeError}</p>
                )}

                <button
                  onClick={handleEmailSubmit}
                  disabled={emailSending || !email.includes("@")}
                  className="btn-primary w-full"
                >
                  {emailSending ? t("auth.sending") : t("auth.sendLink")}
                </button>
              </>
            ) : (
              <div className="rounded-card bg-success/10 p-4 text-center">
                <div className="text-2xl">✅</div>
                <p className="mt-2 font-medium text-success">{t("auth.linkSent")}</p>
                <p className="mt-1 text-sm text-dark/50">
                  {t("auth.linkSentNote")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guide link */}
        <div className="mt-4 text-center">
          <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent">
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>help</span>
            {t("guide.onboardTitle")}
          </Link>
        </div>
      </div>
    </div>
  );
}
