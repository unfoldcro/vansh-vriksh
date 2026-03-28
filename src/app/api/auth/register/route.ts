import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createUser, getUserByEmail } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { emailVerifications } from "@/lib/db/schema";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // Rate limit: 3 registrations per hour per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Account already exists. Please login." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    await createUser({
      id,
      email,
      passwordHash,
      fullName,
      authMethod: "password",
    });

    // Generate verification token and send email
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(emailVerifications).values({
      email,
      token,
      expiresAt,
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      // Still return success — user was created, they can request resend
    }

    return NextResponse.json({
      success: true,
      message: "Account created. Please check your email to verify.",
      needsVerification: true,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
