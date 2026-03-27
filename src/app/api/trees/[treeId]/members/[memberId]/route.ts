import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { softDeleteMember } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    delete data.id;
    delete data.treeId;
    delete data.userId;

    const [updated] = await db
      .update(members)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(members.id, params.memberId))
      .returning();

    return NextResponse.json({ member: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await softDeleteMember(session.id, params.memberId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
