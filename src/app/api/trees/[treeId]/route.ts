import { NextResponse } from "next/server";
import { getTreeMetadata } from "@/lib/db/queries";

export async function GET(_req: Request, { params }: { params: { treeId: string } }) {
  try {
    const { treeId } = params;
    const tree = await getTreeMetadata(treeId);
    if (!tree) return NextResponse.json({ error: "Tree not found" }, { status: 404 });

    return NextResponse.json({ tree });
  } catch {
    return NextResponse.json({ error: "Failed to get tree" }, { status: 500 });
  }
}
