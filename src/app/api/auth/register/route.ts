import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/jwt";
import { createUser, getUserByEmail } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Account already exists. Please login." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    const user = await createUser({
      id,
      email,
      passwordHash,
      fullName,
      authMethod: "password",
    });

    await setAuthCookie({
      sub: user.id,
      email: user.email!,
      role: user.role || "viewer",
      fullName: user.fullName,
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
