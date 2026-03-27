import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/auth/otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sendOtp(email);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
