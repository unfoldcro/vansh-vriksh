import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createJoinRequest, getJoinRequests } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const treeId = searchParams.get("treeId") || "";
    if (!treeId) return NextResponse.json({ requests: [] });

    const requests = await getJoinRequests(treeId);
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Failed to get requests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { treeId, claimedRelation } = await req.json();
    const id = await createJoinRequest({
      treeId,
      requesterId: session.id,
      requesterName: session.fullName,
      claimedRelation,
    });

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}
