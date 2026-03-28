import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMembersByTreeId, getDeletedMembersByTreeId, addMember, isTreeOwnerOrEditor } from "@/lib/db/queries";

export async function GET(req: Request, { params }: { params: { treeId: string } }) {
  try {
    const { treeId } = params;
    const { searchParams } = new URL(req.url);
    const showDeleted = searchParams.get("deleted") === "true";

    if (showDeleted) {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const members = await getDeletedMembersByTreeId(treeId);
      return NextResponse.json({ members });
    }

    const members = await getMembersByTreeId(treeId);
    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ error: "Failed to get members" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { treeId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify user has access to this tree
    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { treeId } = params;
    const member = await req.json();
    const memberId = await addMember(session.id, treeId, member);

    return NextResponse.json({ memberId });
  } catch (err) {
    console.error("Add member error:", err);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}
