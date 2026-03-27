import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAllTrees } from "@/lib/db/queries-admin";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const trees = await getAllTrees();
    return NextResponse.json({ trees });
  } catch {
    return NextResponse.json({ error: "Failed to get trees" }, { status: 500 });
  }
}
