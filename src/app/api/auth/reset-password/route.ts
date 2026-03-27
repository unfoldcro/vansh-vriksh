import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { passwordResets, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "Email, token, and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Find valid reset token
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.email, email),
          eq(passwordResets.token, token),
          eq(passwordResets.used, false),
          sql`${passwordResets.expiresAt} > NOW()`
        )
      )
      .limit(1);

    if (!reset) {
      return NextResponse.json({ error: "Invalid or expired reset link. / अमान्य या समाप्त लिंक।" }, { status: 400 });
    }

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ used: true })
      .where(eq(passwordResets.id, reset.id));

    // Update password
    const passwordHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true, message: "Password reset successfully. Please login." });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
