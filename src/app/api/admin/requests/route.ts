import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAllJoinRequests } from "@/lib/db/queries-admin";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const requests = await getAllJoinRequests();
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Failed to get requests" }, { status: 500 });
  }
}
