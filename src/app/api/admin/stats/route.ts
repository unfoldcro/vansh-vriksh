import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAdminStats } from "@/lib/db/queries-admin";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
