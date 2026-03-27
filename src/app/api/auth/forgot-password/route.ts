import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { passwordResets } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getUserByEmail } from "@/lib/db/queries";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    // Don't reveal whether email exists — always return success
    if (!user) {
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
    }

    // Rate limit: max 3 resets per hour
    const [recentCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.email, email),
          sql`${passwordResets.createdAt} > NOW() - INTERVAL '1 hour'`
        )
      );

    if ((recentCount?.count ?? 0) >= 3) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(passwordResets).values({ email, token, expiresAt });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
  }
}
