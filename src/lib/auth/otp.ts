import { db } from "@/lib/db/index";
import { otpCodes } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email: string, code: string): Promise<boolean> {
  // If Resend is configured, send via email
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Vansh Vriksh <noreply@vansh-vriksh.unfoldcro.in>",
        to: email,
        subject: "🌳 Vansh Vriksh — Your OTP Code / आपका OTP कोड",
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #C9A84C;">🌳 Vansh Vriksh — वंश वृक्ष</h2>
            <p>Your OTP code is / आपका OTP कोड है:</p>
            <div style="background: #f5f0e8; padding: 16px; border-radius: 12px; text-align: center; margin: 16px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1A1207;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px;">
              Valid for 10 minutes / 10 मिनट के लिए वैध<br/>
              If you didn't request this, ignore this email.
            </p>
          </div>
        `,
      });
      return true;
    } catch (err) {
      console.error("Resend email failed:", err);
    }
  }

  // Fallback: log OTP to console (visible in Vercel function logs)
  console.log(`\n🔑 OTP for ${email}: ${code}\n`);
  return true;
}

export async function sendOtp(email: string): Promise<{ success: boolean; otp?: string; error?: string }> {
  // Rate limit: max 5 OTPs per email per hour
  const [recentCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        sql`${otpCodes.createdAt} > NOW() - INTERVAL '1 hour'`
      )
    );

  if ((recentCount?.count ?? 0) >= 5) {
    return { success: false, error: "Too many OTP requests. Try again later." };
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP
  await db.insert(otpCodes).values({ email, code, expiresAt });

  // Send email (or log to console)
  const sent = await sendOtpEmail(email, code);

  if (!sent) {
    return { success: false, error: "Failed to send OTP. Try again." };
  }

  // If no email provider configured, return OTP in response so user can see it
  if (!process.env.RESEND_API_KEY) {
    return { success: true, otp: code };
  }

  return { success: true };
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        eq(otpCodes.code, code),
        eq(otpCodes.used, false),
        sql`${otpCodes.expiresAt} > NOW()`
      )
    )
    .limit(1);

  if (!otp) {
    return { valid: false, error: "Invalid or expired OTP. / अमान्य या समाप्त OTP।" };
  }

  // Mark as used
  await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.id, otp.id));

  return { valid: true };
}
