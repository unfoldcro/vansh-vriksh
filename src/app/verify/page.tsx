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
        window.location.href = "/profile";
      }
    }
  };

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

          {/* Tabs */}
          <div className="mt-6 flex rounded-input bg-bg-muted p-1">
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 rounded-[10px] py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "phone" ? "bg-bg-card text-dark shadow-sm" : "text-dark/50"
              }`}
            >
              📱 फोन / Phone
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 rounded-[10px] py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "email" ? "bg-bg-card text-dark shadow-sm" : "text-dark/50"
              }`}
            >
              ✉️ ईमेल / Email
            </button>
          </div>

          {/* Phone Auth */}
          {activeTab === "phone" && (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-dark">मोबाइल नंबर / Mobile Number</span>
                <div className="mt-1 flex gap-2">
                  <span className="flex items-center rounded-input border border-border-warm bg-bg-muted px-3 text-sm text-dark/50">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    disabled={otpSent}
                    className="input-field disabled:opacity-50"
                  />
                </div>
              </label>

              {otpSent && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">OTP डालें / Enter OTP</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="input-field mt-1 text-center font-mono text-lg tracking-widest"
                  />
                </label>
              )}

              {phoneError && (
                <p className="text-sm text-error">{phoneError}</p>
              )}

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneSending || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6)}
                className="btn-primary w-full"
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
                    <span className="text-sm font-medium text-dark">ईमेल / Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field mt-1"
                    />
                  </label>

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
          )}
        </div>
      </div>
    </div>
  );
}
