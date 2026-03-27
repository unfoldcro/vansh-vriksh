import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, updateUser } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    // Don't allow updating sensitive fields
    delete data.id;
    delete data.email;
    delete data.passwordHash;
    delete data.banned;
    delete data.verified;

    const user = await updateUser(session.id, data);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
