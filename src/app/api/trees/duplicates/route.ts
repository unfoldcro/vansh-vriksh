import { NextResponse } from "next/server";
import { findDuplicateTrees } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const surname = searchParams.get("surname") || "";
    const gotra = searchParams.get("gotra") || "";
    const district = searchParams.get("district") || "";

    if (!surname || !gotra || !district) return NextResponse.json({ trees: [] });

    const trees = await findDuplicateTrees(surname, gotra, district);
    return NextResponse.json({ trees });
  } catch {
    return NextResponse.json({ error: "Duplicate check failed" }, { status: 500 });
  }
}
