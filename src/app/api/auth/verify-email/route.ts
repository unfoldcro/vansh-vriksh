import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { emailVerifications, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { setAuthCookie } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 });
    }

    // Find valid verification token
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.token, token),
          eq(emailVerifications.used, false),
          sql`${emailVerifications.expiresAt} > NOW()`
        )
      )
      .limit(1);

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired verification link. / अमान्य या समाप्त लिंक।" }, { status: 400 });
    }

    // Mark token as used
    await db
      .update(emailVerifications)
      .set({ used: true })
      .where(eq(emailVerifications.id, verification.id));

    // Mark user as verified
    const [user] = await db
      .update(users)
      .set({ verified: true, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-login after verification
    await setAuthCookie({
      sub: user.id,
      email: user.email!,
      role: user.role || "viewer",
      fullName: user.fullName,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, treeId: user.treeId },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
