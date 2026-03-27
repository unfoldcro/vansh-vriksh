import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAllConnections } from "@/lib/db/queries-admin";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const connections = await getAllConnections();
    return NextResponse.json({ connections });
  } catch {
    return NextResponse.json({ error: "Failed to get connections" }, { status: 500 });
  }
}
