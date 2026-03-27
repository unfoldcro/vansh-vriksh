import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { adminDeleteTree, adminLockTree, adminTransferOwnership } from "@/lib/db/queries-admin";

export async function DELETE(_req: Request, { params }: { params: { treeId: string } }) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await adminDeleteTree(params.treeId, session.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete tree" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { treeId: string } }) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { action, newOwnerId } = await req.json();
    if (action === "lock") {
      await adminLockTree(params.treeId, session.id, true);
    } else if (action === "unlock") {
      await adminLockTree(params.treeId, session.id, false);
    } else if (action === "transfer" && newOwnerId) {
      await adminTransferOwnership(params.treeId, newOwnerId, session.id);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update tree" }, { status: 500 });
  }
}
