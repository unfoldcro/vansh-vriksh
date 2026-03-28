import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/index";
import { marriages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET all marriages for a member
export async function GET(_req: Request, { params }: { params: { treeId: string; memberId: string } }) {
  try {
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

    const data = await req.json();
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
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { marriageId, ...fields } = data;
    if (!marriageId) return NextResponse.json({ error: "marriageId required" }, { status: 400 });

    delete fields.id;
    delete fields.memberId;

    const [updated] = await db
      .update(marriages)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(marriages.id, marriageId))
      .returning();

    return NextResponse.json({ marriage: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update marriage" }, { status: 500 });
  }
}
