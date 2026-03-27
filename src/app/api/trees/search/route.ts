import { NextResponse } from "next/server";
import { searchTrees } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const district = searchParams.get("district") || "";
    const gotra = searchParams.get("gotra") || "";
    const village = searchParams.get("village") || "";

    // Need at least one search parameter
    if (!q.trim() && !district.trim() && !gotra.trim() && !village.trim()) {
      return NextResponse.json({ trees: [] });
    }

    const results = await searchTrees({ q, district, gotra, village });
    return NextResponse.json({ trees: results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
