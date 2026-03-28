import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { setTreePasscode, isTreeOwner } from "@/lib/db/queries";

export async function PUT(req: Request, { params }: { params: { treeId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only tree owner can set passcode
    const owns = await isTreeOwner(session.id, params.treeId);
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { passcode } = await req.json();
    await setTreePasscode(params.treeId, passcode || null);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to set passcode" }, { status: 500 });
  }
}
