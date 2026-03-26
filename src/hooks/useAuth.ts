"use client";

import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, signOut };
}

export function usePhoneAuth() {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sendOtp = useCallback(async (phoneNumber: string) => {
    setError(null);
    setSending(true);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP भेजने में त्रुटि / Error sending OTP");
    } finally {
      setSending(false);
    }
  }, []);

  const verifyOtp = useCallback(async (otp: string) => {
    setError(null);
    if (!confirmationResult) {
      setError("Please request OTP first");
      return null;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      return result.user;
    } catch {
      setError("गलत OTP / Incorrect OTP");
      return null;
    }
  }, [confirmationResult]);

  return { sendOtp, verifyOtp, error, sending, otpSent: !!confirmationResult };
}

export function useEmailAuth() {
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const sendLink = useCallback(async (email: string) => {
    setError(null);
    setSending(true);
    try {
      const actionCodeSettings = {
        url: typeof window !== "undefined" ? `${window.location.origin}/verify?mode=email` : "",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("emailForSignIn", email);
      }
      setLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ईमेल भेजने में त्रुटि / Error sending email");
    } finally {
      setSending(false);
    }
  }, []);

  const completeSignIn = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (!isSignInWithEmailLink(auth, window.location.href)) return null;

    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation") || "";
    }

    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      return result.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      return null;
    }
  }, []);

  return { sendLink, completeSignIn, error, sending, linkSent };
}
