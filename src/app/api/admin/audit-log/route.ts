import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAuditLog } from "@/lib/db/queries-admin";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const logs = await getAuditLog(limit, offset);
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ error: "Failed to get audit log" }, { status: 500 });
  }
}
