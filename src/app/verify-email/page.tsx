"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. / अमान्य सत्यापन लिंक।");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully! Redirecting... / ईमेल सत्यापित! रीडायरेक्ट हो रहा है...");
        await refresh();

        setTimeout(() => {
          if (data.user?.treeId) {
            router.push("/dashboard");
          } else {
            router.push("/profile");
          }
        }, 1500);
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    })();
  }, [searchParams, router, refresh]);

  return (
    <div className="card p-8">
      {status === "loading" && (
        <>
          <div className="text-4xl">🌳</div>
          <h1 className="mt-4 text-xl font-bold text-dark">Verifying your email...</h1>
          <p className="mt-2 text-sm text-dark/40">ईमेल सत्यापित हो रहा है...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-4xl">✅</div>
          <h1 className="mt-4 text-xl font-bold text-success">Verified!</h1>
          <p className="mt-2 text-sm text-dark/60">{message}</p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-4xl">❌</div>
          <h1 className="mt-4 text-xl font-bold text-error">Verification Failed</h1>
          <p className="mt-2 text-sm text-dark/60">{message}</p>
          <Link href="/verify" className="btn-primary mt-4 inline-block text-sm">
            Go to Login / लॉगिन पर जाएं
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md text-center">
        <Suspense
          fallback={
            <div className="card p-8">
              <div className="text-4xl">🌳</div>
              <h1 className="mt-4 text-xl font-bold text-dark">Loading...</h1>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
