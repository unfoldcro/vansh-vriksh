"use client";

import { useState } from "react";
import Link from "next/link";
import { usePhoneAuth, useEmailAuth } from "@/hooks/useAuth";

type AuthTab = "phone" | "email";

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { sendOtp, verifyOtp, error: phoneError, sending: phoneSending, otpSent } = usePhoneAuth();
  const { sendLink, error: emailError, sending: emailSending, linkSent } = useEmailAuth();

  const handlePhoneSubmit = async () => {
    if (!otpSent) {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      await sendOtp(formattedPhone);
    } else {
      const user = await verifyOtp(otp);
      if (user) {
        // TODO: Check if user exists in Firestore, redirect accordingly
        window.location.href = "/profile";
      }
    }
  };

  const handleEmailSubmit = async () => {
    await sendLink(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          ← वापस / Back
        </Link>

        <div className="rounded-xl border border-border-warm bg-bg-card p-6 shadow-sm">
          <h1 className="font-hindi text-2xl font-bold text-earth">
            सत्यापन / Verification
          </h1>
          <p className="mt-1 text-sm text-earth/50">
            अपना अकाउंट सत्यापित करें / Verify your account
          </p>

          {/* Tabs */}
          <div className="mt-6 flex rounded-lg bg-bg-muted p-1">
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                activeTab === "phone" ? "bg-bg-card text-earth shadow-sm" : "text-earth/60"
              }`}
            >
              📱 फोन / Phone
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                activeTab === "email" ? "bg-bg-card text-earth shadow-sm" : "text-earth/60"
              }`}
            >
              ✉️ ईमेल / Email
            </button>
          </div>

          {/* Phone Auth */}
          {activeTab === "phone" && (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">मोबाइल नंबर / Mobile Number</span>
                <div className="mt-1 flex gap-2">
                  <span className="flex items-center rounded-lg border border-border-warm bg-bg-muted px-3 text-sm text-earth/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    disabled={otpSent}
                    className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                  />
                </div>
              </label>

              {otpSent && (
                <label className="block">
                  <span className="text-sm font-medium text-earth">OTP डालें / Enter OTP</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-center font-mono text-lg tracking-widest text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </label>
              )}

              {phoneError && (
                <p className="text-sm text-error">{phoneError}</p>
              )}

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneSending || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6)}
                className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
              >
                {phoneSending
                  ? "भेज रहे हैं... / Sending..."
                  : otpSent
                    ? "सत्यापित करें / Verify"
                    : "OTP भेजें / Send OTP"
                }
              </button>

              <div id="recaptcha-container" />
            </div>
          )}

          {/* Email Auth */}
          {activeTab === "email" && (
            <div className="mt-6 space-y-4">
              {!linkSent ? (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">ईमेल / Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </label>

                  {emailError && (
                    <p className="text-sm text-error">{emailError}</p>
                  )}

                  <button
                    onClick={handleEmailSubmit}
                    disabled={emailSending || !email.includes("@")}
                    className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
                  >
                    {emailSending ? "भेज रहे हैं... / Sending..." : "लिंक भेजें / Send Link"}
                  </button>
                </>
              ) : (
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <div className="text-2xl">✅</div>
                  <p className="mt-2 font-medium text-success">लिंक भेजा गया!</p>
                  <p className="mt-1 text-sm text-earth/60">
                    अपना ईमेल चेक करें और लिंक पर क्लिक करें।
                    <br />
                    Check your email and click the link.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
