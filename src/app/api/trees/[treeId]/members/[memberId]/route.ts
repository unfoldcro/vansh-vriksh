import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { softDeleteMember, isTreeOwnerOrEditor, verifyMemberBelongsToTree } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ALLOWED_FIELDS = new Set([
  "name", "nameHi", "alsoKnownAs", "relation", "relationGroup", "relationType",
  "generationLevel", "gender", "alive", "dob", "dobType", "dobApproximate",
  "deathYear", "deathTithi", "teerthSthal", "occupation", "notes", "oralHistory",
  "householdId",
]);

export async function PUT(req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify user has access to this tree
    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Verify member belongs to this tree
    const belongs = await verifyMemberBelongsToTree(params.memberId, params.treeId);
    if (!belongs) return NextResponse.json({ error: "Member not found in this tree" }, { status: 404 });

    const raw = await req.json();
    // Whitelist allowed fields
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (ALLOWED_FIELDS.has(key)) data[key] = value;
    }

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

    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const belongs = await verifyMemberBelongsToTree(params.memberId, params.treeId);
    if (!belongs) return NextResponse.json({ error: "Member not found in this tree" }, { status: 404 });

    await softDeleteMember(session.id, params.memberId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
