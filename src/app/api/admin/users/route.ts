import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/db/queries-admin";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 });
  }
}
