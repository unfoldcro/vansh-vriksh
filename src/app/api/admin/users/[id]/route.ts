import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { adminDeleteUser, adminBanUser } from "@/lib/db/queries-admin";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await adminDeleteUser(params.id, session.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { action } = await req.json();
    if (action === "ban") {
      await adminBanUser(params.id, session.id, true);
    } else if (action === "unban") {
      await adminBanUser(params.id, session.id, false);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
