import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { rejectJoinRequest } from "@/lib/db/queries";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await rejectJoinRequest(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reject request" }, { status: 500 });
  }
}
