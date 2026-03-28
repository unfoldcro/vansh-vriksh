import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { approveConnection, isTreeOwner } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { connections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the connection to verify ownership of the target tree
    const [conn] = await db
      .select({ toTreeId: connections.toTreeId })
      .from(connections)
      .where(eq(connections.id, params.id))
      .limit(1);
    if (!conn?.toTreeId) return NextResponse.json({ error: "Connection not found" }, { status: 404 });

    // Only the target tree owner can approve
    const owns = await isTreeOwner(session.id, conn.toTreeId);
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await approveConnection(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve connection" }, { status: 500 });
  }
}
