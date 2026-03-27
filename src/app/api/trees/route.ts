import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createTree } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await req.json();
    const treeId = await createTree(session.id, profile);

    return NextResponse.json({ treeId });
  } catch (err) {
    console.error("Create tree error:", err);
    return NextResponse.json({ error: "Failed to create tree" }, { status: 500 });
  }
}
