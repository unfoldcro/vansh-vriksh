import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otp";
import { setAuthCookie } from "@/lib/auth/jwt";
import { getUserByEmail, createUser } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 });
    }

    const result = await verifyOtp(email, code);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Find or create user
    let user = await getUserByEmail(email);
    const isNewUser = !user;

    if (!user) {
      const id = crypto.randomUUID();
      user = await createUser({
        id,
        email,
        fullName: email.split("@")[0], // temporary name, will be updated in profile
        authMethod: "email",
      });
    }

    if (user.banned) {
      return NextResponse.json({ error: "Account is suspended" }, { status: 403 });
    }

    await setAuthCookie({
      sub: user.id,
      email: user.email!,
      role: user.role || "viewer",
      fullName: user.fullName,
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, treeId: user.treeId },
      isNewUser,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
