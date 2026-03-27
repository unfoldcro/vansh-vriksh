import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/jwt";
import { getUserByEmail } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.banned) {
      return NextResponse.json({ error: "Account is suspended" }, { status: 403 });
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

    return NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, treeId: user.treeId },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
