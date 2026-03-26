"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEmailAuth, useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <span className="loading-dot" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const { sendLink, completeSignIn, error: emailError, sending: emailSending, linkSent } = useEmailAuth();

  const showDemoFirst = searchParams.get("demo") === "true";

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

  const handleEnterDemo = () => {
    // Set demo mode flag in localStorage
    localStorage.setItem("vansh-vriksh-demo", "true");
    router.push("/dashboard?demo=true");
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
      <div className="w-full max-w-md animate-fade-in-up">
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        {/* Demo Account Card */}
        <div className={`card mb-4 overflow-hidden border-accent/20 ${showDemoFirst ? "ring-2 ring-accent/30" : ""}`}>
          <div className="bg-accent/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "22px" }}>play_circle</span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-dark text-sm">{t("demo.loginTitle")}</h3>
                <p className="text-xs text-dark/50">{t("demo.loginDesc")}</p>
              </div>
            </div>
            <button
              onClick={handleEnterDemo}
              className="btn-primary mt-3 w-full"
            >
              <span className="material-symbols-rounded mr-2" style={{ fontSize: "18px" }}>visibility</span>
              {t("demo.enterDemo")}
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-border-warm" />
          <span className="text-xs text-dark/30 uppercase tracking-wider font-body">{t("demo.orSeparator")}</span>
          <div className="h-px flex-1 bg-border-warm" />
        </div>

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
