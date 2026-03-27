import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { emailVerifications } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getUserByEmail } from "@/lib/db/queries";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true, message: "If the email exists, a verification link has been sent." });
    }

    if (user.verified) {
      return NextResponse.json({ error: "Email is already verified. Please login." }, { status: 400 });
    }

    // Rate limit: max 3 verification emails per hour
    const [recentCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          sql`${emailVerifications.createdAt} > NOW() - INTERVAL '1 hour'`
        )
      );

    if ((recentCount?.count ?? 0) >= 3) {
      return NextResponse.json({ error: "Too many requests. Try again later. / बहुत अधिक अनुरोध। बाद में प्रयास करें।" }, { status: 429 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(emailVerifications).values({ email, token, expiresAt });

    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true, message: "Verification email sent." });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
