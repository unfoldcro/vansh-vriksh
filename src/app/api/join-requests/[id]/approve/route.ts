import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { approveJoinRequest, isTreeOwner } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { joinRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the join request to find which tree it's for
    const [request] = await db
      .select({ treeId: joinRequests.treeId })
      .from(joinRequests)
      .where(eq(joinRequests.id, params.id))
      .limit(1);
    if (!request?.treeId) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Only tree owner can approve join requests
    const owns = await isTreeOwner(session.id, request.treeId);
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await approveJoinRequest(params.id, session.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve request" }, { status: 500 });
  }
}
