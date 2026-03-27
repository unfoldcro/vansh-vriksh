import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createConnection } from "@/lib/db/queries";
import { db } from "@/lib/db/index";
import { connections } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const treeId = searchParams.get("treeId") || "";
    if (!treeId) return NextResponse.json({ connections: [] });

    const results = await db
      .select()
      .from(connections)
      .where(or(eq(connections.fromTreeId, treeId), eq(connections.toTreeId, treeId)));

    return NextResponse.json({ connections: results });
  } catch {
    return NextResponse.json({ error: "Failed to get connections" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const id = await createConnection(data);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "Failed to create connection" }, { status: 500 });
  }
}
