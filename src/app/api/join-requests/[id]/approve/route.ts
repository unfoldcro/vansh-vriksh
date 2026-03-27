import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { approveJoinRequest } from "@/lib/db/queries";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await approveJoinRequest(params.id, session.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve request" }, { status: 500 });
  }
}
