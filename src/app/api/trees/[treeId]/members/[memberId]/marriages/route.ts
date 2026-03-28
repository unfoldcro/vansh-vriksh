import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isTreeOwnerOrEditor, verifyMemberBelongsToTree } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { marriages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const ALLOWED_FIELDS = new Set([
  "spouseName", "spouseFatherName", "spouseGotra", "spouseKulDevta", "spouseKulDevi",
  "spouseJati", "spouseVillage", "spouseDistrict", "marriageDate", "marriageStatus",
  "endDate", "maidenName", "maidenFullName", "marriedSurname", "displayPreference",
  "displayName", "surnameSetBy", "visibility", "linkedTreeId",
]);

// GET all marriages for a member (requires auth)
export async function GET(_req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const result = await db
      .select()
      .from(marriages)
      .where(and(eq(marriages.memberId, params.memberId), eq(marriages.status, "active")));

    return NextResponse.json({ marriages: result });
  } catch {
    return NextResponse.json({ error: "Failed to get marriages" }, { status: 500 });
  }
}

// POST create a new marriage record
export async function POST(req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const belongs = await verifyMemberBelongsToTree(params.memberId, params.treeId);
    if (!belongs) return NextResponse.json({ error: "Member not found in this tree" }, { status: 404 });

    const raw = await req.json();
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (ALLOWED_FIELDS.has(key)) data[key] = value;
    }

    const id = `marriage_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const [created] = await db
      .insert(marriages)
      .values({
        id,
        memberId: params.memberId,
        ...data,
      })
      .returning();

    return NextResponse.json({ marriage: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create marriage" }, { status: 500 });
  }
}

// PUT update an existing marriage record (marriageId in body)
export async function PUT(req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hasAccess = await isTreeOwnerOrEditor(session.id, params.treeId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const raw = await req.json();
    const { marriageId } = raw;
    if (!marriageId) return NextResponse.json({ error: "marriageId required" }, { status: 400 });

    // Verify marriage belongs to this member
    const [existing] = await db
      .select({ memberId: marriages.memberId })
      .from(marriages)
      .where(eq(marriages.id, marriageId))
      .limit(1);
    if (!existing || existing.memberId !== params.memberId) {
      return NextResponse.json({ error: "Marriage not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (ALLOWED_FIELDS.has(key)) data[key] = value;
    }

    const [updated] = await db
      .update(marriages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(marriages.id, marriageId))
      .returning();

    return NextResponse.json({ marriage: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update marriage" }, { status: 500 });
  }
}
