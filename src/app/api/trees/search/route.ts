import { NextResponse } from "next/server";
import { searchTrees } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q.trim()) return NextResponse.json({ trees: [] });

    const results = await searchTrees(q);
    return NextResponse.json({ trees: results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
