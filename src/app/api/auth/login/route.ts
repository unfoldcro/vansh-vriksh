import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/jwt";
import { getUserByEmail } from "@/lib/db/queries";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Rate limit: 5 login attempts per 15 minutes per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
    }

    const user = await getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.banned) {
      return NextResponse.json({ error: "Account is suspended" }, { status: 403 });
    }

    if (!user.verified) {
      return NextResponse.json({
        error: "Email not verified. Please check your email or request a new verification link.",
        needsVerification: true,
        email: user.email,
      }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setAuthCookie({
      sub: user.id,
      email: user.email!,
      role: user.role || "viewer",
      fullName: user.fullName,
    });

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        treeId: user.treeId,
        isAdmin: adminEmails.includes((user.email || "").toLowerCase()),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
